const fs = require('fs');
const zlib = require('zlib');
const mysql = require('mysql');
const redis = require('redis');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const multer = require('multer');
const moment = require('moment');
const express = require('express');
const Duplex = require('stream').Duplex;
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');

// require environment access token
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// serve from the dist directory
app.use(express.static(__dirname + '/dist'));
// allow json consumption
app.use(express.json({limit: '100mb'}));

// use localhost proxy
app.set('trust proxy', '127.0.0.1')
//FIXME: add `secure: true` to cookie options
app.use(cookieParser(process.env.SERVER_SECRET));

// store files in memory
const upload = multer({ storage: multer.memoryStorage() });

// connect to redis cache
const client = redis.createClient();
client.on('error', err => console.log(err));

// set session expiration to 60 minutes
const expiry = 60 * 60;

// connect to database
const database = mysql.createConnection({
	host: `${process.env.DB_HOST}`,
	user: `${process.env.DB_USER}`,
	password: `${process.env.DB_PASS}`,
	database: `${process.env.DB_NAME}`
});

const generateSessionID = async () => {
	return new Promise((resolve, reject) => {
		resolve(crypto.randomBytes(64).toString('base64'));
	});
}

const computeSaltedHashedPass = async (pass) => {
	// generate a salted hash of the user submitted password
	const rounds = 10;
	return await new Promise((resolve, reject) => {
		bcrypt.genSalt(rounds, (err, salt) => {
			if (err) reject(err);
			bcrypt.hash(pass, salt, (err, hash) => {
				if (err) reject(err);
				resolve(hash);
			});
		});
	});
}

const getHashedPass = async (user) => {
	// pull salted hash from the database
	const CMD = `select * from users where User=?`;
	const values = [user];
	return await new Promise((resolve, reject) => {
		database.query(CMD, values, (err, rows) => {
			if (err) reject(err);
			(rows[0] == undefined) ? reject(new Error('User not found.')) : resolve(rows[0]['Pass']);
		});
	});
}

const forgotPassword = async (req, res) => {
	const { email } = req.body;
	const CMD = 'select * from users where Email=?';
	const values = [email];
	// search for the user's email in the user table
	const resp = await new Promise((resolve, reject) => {
		database.query(CMD, values, (err, rows) => {
			if (err || !rows.length) resolve(false);
			resolve(true);
		})
	});
	// send an email if the email address was in the database
	if (resp) sendPasswordRecoverLink(email);
	resp ? res.send(JSON.stringify({"status" : "success"})) : res.send(JSON.stringify({"status" : "failure"}));
};

const checkHashes = async (pass, hashword) => {
	// compare the salted hashed password against the database entry
	return await new Promise((resolve, reject) => {
		bcrypt.compare(pass, hashword, (err, hash) => {
			if (err) reject(err);
			resolve(hash);
		});
	});
}

const addUser = async (user, pass, email) => {
	// add a user to the system
	// generate hashed password with bcrypt
	const hash = await computeSaltedHashedPass(pass);
	// construct an SQL query to insert the user
	const CMD = `insert into users (User, Pass, Email) values (?, ?, ?);`;
	const values = [user, hash, email]
	// place the user and hash password in the database
	return await new Promise((resolve, reject) => {
		database.query(CMD, values, (err, rows) => {
			if (err) resolve(false);
			resolve(true);
		});
	});
}

const checkForUser = async (user) => {
	// search the database for the user
	const CMD = `select * from users where user=?;`;
	const values = [user];
	return await new Promise((resolve, reject) => {
		database.query(CMD, values, (err, rows) => {
			if (err) reject(false);
			(rows[0] == undefined) ? resolve(false) : resolve(true);
		});
	});
}

const hashFile = async (file) => {
	// compute the sha256 digest of a file 
	return new Promise((resolve, reject) => {
		let stream = new Duplex();
		stream.push(file);
		stream.push(null);
		const shasum = crypto.createHash('sha256');
		stream.on('error', err => { reject(err); });
		stream.on('end', () => { resolve(shasum.digest('hex')); });
		stream.pipe(shasum);
	});
}

const textQuery = async (req, res) => {
	// search the database file title and tags for a user submitted phrase
	const { query } = req.body;
	const CMD = `select * from documents where title regexp ? or tags regexp ?`;
	const values = [query, query];
	const results = await new Promise((resolve, reject) => {
		database.query(CMD, values, (err, rows) => {
			err ? reject(err) : resolve(rows);
		});
	});
	res.send(JSON.stringify({"search_results": results}));
};


const getPostComments = async (req, res) => {
	// pull the comments of a post from the comments table
	const hash = req.query["hash"];
	const CMD = `select * from comments where hash=?`;
	const values = [hash];
	const resp = await new Promise((resolve, reject) => {
		database.query(CMD, values, (err, rows) => {
			if (err) resolve(false);
			(rows[0] == undefined) ? resolve(null) : resolve(rows);
		});
	});
	res.send(JSON.stringify({"posts": resp}));
};


const sendPasswordRecoverLink = async (recipient) => {
	// send a password recovery link
	let transporter = nodemailer.createTransport({
		service: "gmail",
    	secure: true,
		auth: {
    	  user: process.env.MAIL_USER,
    	  pass: process.env.MAIL_PASS,
		}
	});
	let info = await transporter.sendMail({
		from: '"Philsource" <philsource247@gmail.com>',
		to: `${recipient}`,
		subject: 'Philsource Password Recovery',
		text: 'yo buddy'
	});
}

const signUpUser = async (req, res) => {
	// start user sign up process
	const { user, pass, email } = req.body;

	// FIXME: sanitize user, pass, email inputs
	
	// check to see if username is taken
	const exists = await checkForUser(user);
	if (exists) {
		res.send(JSON.stringify({"user":"unavailable"}));
		return;
	} else {
		const result = await addUser(user, pass, email);
		// send back user and token
		const sessionID = await generateSessionID();
		client.set(sessionID, user, 'EX', expiry);
		const clientData = {
			user: user,
			id: sessionID
		};
		// set session ID in the cookie header
		res.cookie('sessionIDs', clientData, { maxAge: expiry * 1000, secure: true, httpOnly: true, sameSite: true });
		//
		res.send(JSON.stringify({"authed" : user}));
	}
};

const signInUser = async (req, res) => {
	// sign in the user
	const { user, pass } = req.body;
	// hash password
	try {
		// find user's hashed password in the database
		const hash = await getHashedPass(user);
		// hash given password and check against db hash
		const hashed = await checkHashes(pass, hash);
		if (hashed) {
			// FIXME: create uuid and check redis cache for its existence; if it doesn't exist in the cache, add the uuid and any other metadata needed (e.g. user name, session expiration time)
			// FIXME: put uuid inside user's cookie
			// generate a unique session ID
			const sessionID = await generateSessionID();
			// set expiring session in the Redis cache
			client.set(sessionID, user, 'EX', expiry);
			// set the session id in the cookie
			const clientData = { user: user, id: sessionID };
			// secure the cookie from snooping, XSS, and CSRF; set lifetime to 60 minutes
			const options = { maxAge: expiry * 1000, secure: true, httpOnly: true, sameSite: true };
			res.cookie('sessionIDs', clientData, options);
			res.send(JSON.stringify({"authed" : user}));
		// return failed login status
		} else
			res.send(JSON.stringify({"status": "failed"}));
	} catch (err) {
		res.send(JSON.stringify({"status": "failed"}));
	}
};


const filterTexts = async (req, res) => {
	const { category } = req.body;
	const values = [category];
	const CMD = `select * from documents where category=?`;
	const resp = await new Promise((resolve, reject) => {
		database.query(CMD, values, (err, rows) => {
			if (err) resolve(false);
			(rows[0] == undefined) ? resolve(null) : resolve(rows);
		});
	});
	// return a set of texts based on the selected subdiscipline
	res.send(JSON.stringify({"docs": resp}));
}

const checkForTextHash = async (hash) => {
	// search the database for a file hash
	const CMD = `select * from documents where hash=?`;
	const values = [hash];
	return new Promise((resolve, reject) => {
		database.query(CMD, values, (err, rows) => {
			if (err) reject(false);
			else (rows[0] == undefined) ? resolve(false) : resolve(true);
		});
	});
}


// FIXME: save the profile picture to the profiles/ folder; name it after the user primary key
const insertProfileIntoDB = async (user, image) => {
	// zip the file and encode it in base64
	const zipped = zlib.gzipSync(JSON.stringify(image)).toString('base64');
	// load file and user values
	const values = [zipped, user]
	const CMD = `update users set Picture=? where User=?`;
	return new Promise((resolve, reject) => {
		// pass values through MySQL stored procedures
		database.query(CMD, values, (err, rows) => {
			if (err) reject(false);
			// add user profile picture to the users table
			resolve(true);
		});
	});
}

const getTextFromDisk = async (req, res) => {
	/* return the base64 representation of a file on disk */
	const hash = req.query['hash'];
	const resp = await readDocFromDisk(hash);
	if (resp) {
		console.log(resp);
		res.send(JSON.stringify({"file": resp}));
	} else
		res.send(JSON.stringify({"file": null}));
}

const writeDocToDisk = async (hash, file) => {
	/* save a file to disk */
	return new Promise((resolve, reject) => {
		fs.writeFile(`./data/documents/${hash}.pdf`, file, err => {
			if (err) resolve(null);
			console.log(`${hash}.pdf saved to disk.`);
			resolve(true);
		});
	});
}

const readDocFromDisk = async (hash) => {
	/* read a file from disk if it exists */
	const path = `./data/documents/${hash}.pdf`;
	return new Promise((resolve, reject) => {
		fs.access(path, fs.F_OK, err => {
			// file doesn't exist
			if (err) resolve(null);
			// file exists
			fs.readFile(path, 'base64', (err, data) => {
				// couldn't read file
				if (err) resolve(null);
				// return file contents
				resolve(data);
			});
		});
	});
}

const insertDocIntoDB = async (title, author, user, tags, category, hash) => {
	/* insert a record into the document table */
	return new Promise((resolve, reject) => {
		const values = [title, author, user, tags, category, hash];
		const CMD = `insert into documents (title, author, user, tags, category, hash) values(?, ?, ?, ?, ?, ?)`;
		database.query(CMD, values, (err, rows) => {
			if (err) resolve(null);
			resolve(true);
		});
	});
}


const authUser = async (req, res, next) => {
	// authenticate the user's session ID against a database
	if (!req.cookies.sessionIDs) return res.sendStatus(401);
	const user = req.cookies.sessionIDs['user'];
	const sessionID = req.cookies.sessionIDs['id'];
	if (sessionID == null || sessionID == undefined) return res.sendStatus(401);
	// check Redis cache for sessionID
	client.exists(sessionID, (err, data) => {
		// if sessionID isn't in the cache, send user to re-authenticate
		if (err) return res.sendStatus(401);
		// if sessionID is in the cache, user is authed and can access authorized functions
		next();
	});
}

const uploadText = async (req, res) => {
	const { title, author, tags, category } = req.body;
	//console.log(`Req.cookies: ${JSON.stringify(req.cookies)}`);
	const user = req.cookies.sessionIDs['user'];
	console.log(`Upload from ${user}`);
	// title, user, tags, file
	const rawfile = req.file["buffer"];
	const file = Buffer.from(rawfile);
	try {
		// generate the file hash
		let hash = await hashFile(file);
		console.log(`Title: ${title}\nAuthor: ${author}\nUser: ${user}\nTags: ${tags}\nCategory: ${category}\nHash: ${hash}`);
		// check the database for the hash
		let found = await checkForTextHash(hash);
		// notify client that file already exists in database
		if (found)
			res.send(JSON.stringify({"status": hash}));
		else {
			// insert into database
			// FIXME: write savedoctodisk function
			const written = await writeDocToDisk(hash, rawfile);
			// if file was successfully saved to disk, add a record in the documents table
			if (written) {
				let r = await insertDocIntoDB(title, author, user, tags, category, hash);
				res.send(JSON.stringify({"status": hash}));
			} else {
				res.send(JSON.stringify({"status": "failed"}));
			}
		}
	} catch (err) { 
		console.log(`Error when uploading: ${err}`);
		res.send(JSON.stringify({"status": "failed"}));
	}
};

const uploadProfile = async (req, res) => {
	const user = req.cookies.sessionIDs['user'];
	const image = req.file["buffer"];
	try {
		// try to insert image file into the users table
		const result = await insertProfileIntoDB(user, image);
		res.send(JSON.stringify({"status":"success"}));
	} catch (err) {
		res.send(JSON.stringify({"status":"failed"}));
	}
}

const commentOnPost = async (req, res) => {
	// comment on a post
	const { user, post, hash } = req.body;
	//console.log(`Authed Session name: ${req.session.sessionName}`);
	//console.log(`Cookie: ${req.cookies}`);
	//console.log(`post: ${post}\nhash: ${hash}`);
	const CMD = `insert into comments (user, hash, time, post) value (?, ?, ?, ?);`
	const values = [user, hash, moment().format('MMMM Do YYYY, h:mm:ss a'), post];
	const resp = await new Promise((resolve, reject) => {
		database.query(CMD, values, (err, rows) => {
			if (err) resolve(false);
			resolve(true);
		});
	});
	resp ? res.send(JSON.stringify({"status":"success"})) : res.send(JSON.stringify({"status":"failure"}));
};

const checkForSession = async (id) => {
	/* check the Redis cache for the session */
	return new Promise((resolve, reject) => {
		client.get(id, (err, response) => {
			if (err) resolve(null);
			resolve(response);
		});
	});
}

const retrieveSession = async (req, res) => {
	/* retrieve a user's active session */
	if (req.cookies.sessionIDs) {
		const id = req.cookies.sessionIDs['id'];
		const user = req.cookies.sessionIDs['user'];
		const session = await checkForSession(id);
		if (!session)
			res.send(JSON.stringify({"retrieved": "failed"}));
		else // FIXME: check fs for session
			res.send(JSON.stringify({"retrieved": user}));
	} else
		res.send(JSON.stringify({"retrieved": "failed"}));
};


const signUserOut = async (req, res) => {
	/* delete session and cookie information */
	const sessionID = req.cookies.sessionIDs['id'];
	console.log(`SessionID: ${sessionID}`);
	// delete session ID
	client.del(sessionID);
	// delete cookie
	res.clearCookie('sessionIDs');
	res.send(JSON.stringify({"status":"success"}));
};

// serve landing page
app.get('/', (req, res) => {
	res.render('index');
});

// serve unauthed content
app.get('/get_text', getTextFromDisk);
app.get('/get_comments', getPostComments);
app.post('/filtertexts', filterTexts);
app.post('/forgot', forgotPassword);
app.post('/text_query', textQuery);
app.post('/sign_in', signInUser);
app.post('/sign_up', signUpUser);

// serve authed user content
app.get('/get_session', authUser, retrieveSession);
app.put('/upload', upload.single('textfile'), authUser, uploadText);
app.put('/upload_profile', upload.single('profilepic'), authUser, uploadProfile);
app.post('/comment', authUser, commentOnPost);
app.get('/signout', authUser, signUserOut);

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`);
});
