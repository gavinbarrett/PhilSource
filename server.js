const fs = require('fs');
const zlib = require('zlib');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const Duplex = require('stream').Duplex;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5555;

// store files in memory
const upload = multer({storage: multer.memoryStorage()});

const database = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'rootpass',
	database: 'philsource'
});

// const CREATE_USERS = `CREATE TABLE`;
// FIXME: establish database if one does not exist

// serve from the dist directory
app.use(express.static(__dirname + '/dist'));
// allow json consumption
app.use(express.json({limit: '100mb'}));


const computeSaltedHashedPass = async (pass) => {
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
	const CMD = `SELECT * FROM users WHERE User=?`;
	const values = [user];
	return await new Promise((resolve, reject) => {
		database.query(CMD, values, (err, rows) => {
			console.log(rows);
			if (err) reject(err);
			(rows[0] == undefined) ? reject(new Error('User not found.')) : resolve(rows[0]['Pass']);
		});
	});
}


const checkHashes = async (pass, hashword) => {
	return await new Promise((resolve, reject) => {
		bcrypt.compare(pass, hashword, (err, hash) => {
			if (err) reject(err);
			resolve(hash);
		});
	});
}


const addUser = async (user, pass, email) => {
	console.log(`Adding user: ${user}`);
	// generate hashed password with bcrypt
	const hash = await computeSaltedHashedPass(pass);
	// construct an SQL query to insert the user
	const CMD = `INSERT INTO users (User, Pass, Email) VALUES (?, ?, ?);`;
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
	const CMD = `SELECT * FROM users WHERE user=?;`;
	const values = [user];
	return await new Promise((resolve, reject) => {
		database.query(CMD, values, (err, rows) => {
			if (err) reject(false);
			(rows[0] == undefined) ? resolve(false) : resolve(true);
		});
	});
}


const hashFile = async (file) => {
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

app.post('/text_query', async (req, res) => {
	const { query } = req.body;

	// FIXME: SANITIZE INPUTS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	const CMD = `SELECT * FROM texts WHERE title REGEXP ? OR tags REGEXP ?`;

	const values = [query, query];

	const results = await new Promise((resolve, reject) => {
		database.query(CMD, values, (err, rows) => {
			err ? reject(err) : resolve(rows);
		});
	});
	res.send(JSON.stringify({"search_results": results}));
});

app.get('/get_text', async (req, res) => {
	const hash = req.query["hash"];
	const CMD = `SELECT * FROM texts WHERE hash=?`;
	const values = [hash];
	const results = await new Promise((resolve, reject) => {
		database.query(CMD, values, (err, rows) => {
			err ? reject(err) : resolve(rows);
		});
	});
	res.send(JSON.stringify({"status": results}));
});

const checkForTextHash = async (hash) => {
	const CMD = `SELECT * FROM texts WHERE hash REGEXP ?`;
	const values = [hash];
	return new Promise((resolve, reject) => {
		database.query(CMD, values, (err, rows) => {
			if (err) reject(false);
			(rows[0] == undefined) ? resolve(false) : resolve(true);
		});
	});
}

const insertTextIntoDB = (rawfile) => {
	// compress the base64 representation of the file
	const zipped = zlib.gzipSync(JSON.stringify(rawfile)).toString('base64');
	const CMD = `INSERT INTO texts (title, user, tags, file, hash) VALUES (?, ?, ?, ?, ?);`;
	const values = [title, user, tags, zipped, hash];
	return new Promise((resolve, reject) => {
		database.query(CMD, values, (err, rows) => {
			if (err) reject(false);
			resolve(true);
		});
	});
}

app.post('/comment', async (req, res) => {
	const { post, user, hash } = req.body;
	// FIXME: check user jwt credentials
	const CMD = `INSERT INTO comments (post, user, hash) VALUES (?, ?, ?);`
	const values = [post, user, hash];
	const resp = await new Promise((resolve, reject) => {
		database.query(CMD, values, (err, rows) => {
			if (err) resolve(false);
			resolve(true);
		});
	});
	resp ? res.send(JSON.stringify({"status":"success"})) : res.send(JSON.stringify({"status":"failure"}));
});

app.get('/get_comments', async (req, res) => {
	const hash = req.query["hash"];
	// FIXME: pull comments from the db
	console.log(hash);

	const CMD = `SELECT * FROM comments WHERE hash=?`;
	const values = [hash];
	const resp = await new Promise((resolve, reject) => {
		database.query(CMD, values, (err, rows) => {
			if (err) resolve(false);
			(rows[0] == undefined) ? resolve(null) : resolve(rows);
		});
	});
	console.log(resp);
	res.send(JSON.stringify({"posts": resp}));
});

// upload pdf file
app.put('/upload', upload.single('textfile'), async (req, res) => {
	// FIXME: check authenticity of user's jwt
	const { title, tags, user } = req.body;
	// title, user, tags, file
	const rawfile = req.file["buffer"];
	const file = Buffer.from(rawfile);
	const arraybuff = Uint8Array.from(file).buffer;
	try {
		// generate the file hash
		let hash = await hashFile(file);
		// check the database for the hash
		let found = await checkForTextHash(hash);
		// notify client that file already exists in database
		if (found) {
			res.send(JSON.stringify({"status": "hash_collision"}));
			return;
		}
		// insert into database
		const result = await insertTextIntoDB(rawfile);
		res.send(JSON.stringify({"status": result}));
		return;
	} catch(err) { 
		res.send(JSON.stringify({"status": "failed"}));
	}
});


app.post('/sign_in', async (req, res) => {
	const { user, pass } = req.body;
	// hash password
	try {
		// find user's hashed password in the database
		const hash = await getHashedPass(user);
		// hash given password and check against db hash
		const hashed = await checkHashes(pass, hash);
		if (hashed) {
			console.log('hashes match!');
			const token = jwt.sign({"user": user}, process.env.ACCESS_TOKEN_SECRET);
			res.send(JSON.stringify({"user": user, "access token": token}));
		} else
			res.send(JSON.stringify({"access token": "failed"}));
	} catch (err) {
		res.send(JSON.stringify({"sign_in": "failed"}));
	}
});


app.post('/sign_up', async (req, res) => {
	const { user, pass, email } = req.body;
	
	// FIXME: sanitize user, pass, email inputs

	// check to see if username is taken
	const exists = await checkForUser(user);
	if (exists) {
		res.send(JSON.stringify({"user":"unavailable"}));
		return;
	} else {
		const result = await addUser(user, pass, email);
		console.log(result);
		// send back user and token
		const token = jwt.sign({"user": user}, process.env.ACCESS_TOKEN_SECRET);
		res.send(JSON.stringify({"user": user, "token": token}));
	}
});


// serve landing page
app.get('/', (req, res) => {
	res.send('./index');
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`);
});
