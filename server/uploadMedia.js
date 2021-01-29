const db = require('./databaseFunctions.js');
const zlib = require('zlib');
const crypto = require('crypto');
const moment = require('moment');
const Duplex = require('stream').Duplex;
const { writeDocToDisk } = require('./databaseFunctions.js');

// regular expressions for database input validation
const alphaNumRegex = /^[a-z0-9]+$/i;
const alphaSpaceRegex = /^[a-z0-9\s]+$/i;

exports.commentOnPost = async (req, res) => {
	// FIXME: add input validation
	/* comment on a post */
	const { user, post, hash } = req.body;
	const query = `insert into comments (username, hash, time, post) value ($1, $2, $3, $4)`
	const values = [user, hash, moment().format('MMMM Do YYYY, h:mm:ss a'), post];
	try {
		const rows = await db.query(query, values);
		rows ? res.send(JSON.stringify({"status": "success"})) : res.send(JSON.stringify({"status": "failure"}));
	} catch(error) {
		res.send(JSON.stringify({"status": "failure"}));
	}
};

exports.filterTexts = async (req, res) => {
	// FIXME: add input validation to db call
	const { category } = req.body;
	const values = [category];
	const query = `select * from documents where category=$1`;
	try {
		const rows = await db.query(query, values);
		if (rows)
			res.send(JSON.stringify({"docs": rows}));
		else
			res.send(JSON.stringify({"docs": null}));
	} catch(error) {
		console.log(`Error: ${error}`);
		res.send(JSON.stringify({"docs": null}));
	}
}

exports.uploadText = async (req, res) => {
	console.log('Uploading');
	/* upload a PDF to disk */
	// extract user and file metadata
	const { title, author, tags, category } = req.body;
	const user = req.cookies.sessionIDs['user'];
	// extract the PDF file
	const fileObj = req.file["buffer"];
	// turn file into buffer object
	const file = Buffer.from(fileObj);
	// try to upload the PDF if it's
	const vm = await validMetadata(title, author, tags, category);
	console.log(`vm: ${vm}`);
	if (vm) {
		try {
			console.log('Hashing file.');
			// generate the file hash
			let hash = await hashFile(file);
			console.log('File hashed.');
			// check the database for the hash
			let found = await checkForTextHash(hash);
			console.log('File hash checked.');
			// notify client that file already exists in database
			if (found)
				res.send(JSON.stringify({"status": hash}));
			else {
				// insert into database
				// FIXME: write savedoctodisk function
				const written = await writeDocToDisk(hash, file);
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
	}
};

exports.uploadProfile = async (req, res) => {
	/* save a user's profile photo to disk */
	const user = req.cookies.sessionIDs['user'];
	const image = req.file["buffer"];
	try {
		// try to insert image file into the users table
		// FIXME: save to disk instead of inserting into the db; add the hash to the user record
		const result = await insertProfileIntoDB(user, image);
		res.send(JSON.stringify({"status": "success"}));
	} catch (err) {
		res.send(JSON.stringify({"status": "failed"}));
	}
}

exports.textQuery = async (req, res) => {
	// search the database file title and tags for a user submitted phrase
	const { tag } = req.body;
	console.log(`Tag: ${tag}`);
	const query = `select * from documents where title ~* $1 or tags ~* $2`;
	const values = [tag, tag];
	try {
		const rows = await db.query(query, values);
		rows ? res.send(JSON.stringify({"search_results": rows})) : res.send(JSON.stringify({"search_results": null}));
	} catch(error) {
		console.log(`Error querying for documents: ${error}`);
		res.send(JSON.stringify({"search_results": null}));
	}
};

exports.getPostComments = async (req, res) => {
	// pull the comments of a post from the comments table
	const hash = req.query["hash"];
	const query = `select * from comments where hash=$1`;
	const values = [hash];
	try {
		const rows = await db.query(query, values);
		if (rows)
			res.send(JSON.stringify({"posts": rows}));
		else
			res.send(JSON.stringify({"posts": null}));
	} catch(error) {
		console.log(`Error: ${error}`);	
		res.send(JSON.stringify({"posts": null}));
	}
};

const validMetadata = async (title, author, tags, category) => {
	return new Promise((resolve, reject) => {
		console.log(`Title: ${title}\nAuthor: ${author}\nTags: ${tags}\nCategory: ${category}`);
		if (!title.match(alphaSpaceRegex) || !author.match(alphaSpaceRegex) || !tags.match(alphaSpaceRegex) || !category.match(alphaSpaceRegex))
			resolve(false);
		resolve(true);
	});
}

const insertDocIntoDB = async (title, author, user, tags, category, hash) => {
	// FIXME: add input validation
	/* insert a record into the document table */
	console.log('inserting');
	const values = [title, author, user, tags, category, hash];
	const query = `insert into documents (title, author, username, tags, category, hash) values($1, $2, $3, $4, $5, $6)`;
	try {
		const rows = await db.query(query, values);
		console.log(`Rows from doc insertion: ${rows}`);
		return true;
	} catch (error) {
		console.log(`Error: ${error}`);
		return false;
	}
}
// FIXME: save the profile picture to the profiles/ folder; name it after the user primary key
const insertProfileIntoDB = async (user, image) => {
	// FIXME: add input validation
	// zip the file and encode it in base64
	const zipped = zlib.gzipSync(JSON.stringify(image)).toString('base64');
	// load file and user values
	const values = [zipped, user]
	const query = `update users set Picture=? where User=?`;
	return new Promise((resolve, reject) => {
		// pass values through MySQL stored procedures
		db.query(query, values, (err, rows) => {
			if (err) reject(false);
			// add user profile picture to the users table
			resolve(true);
		});
	});
}

const checkForTextHash = async (hash) => {
	// FIXME: add input validation
	// search the database for a file hash
	const query = `select * from documents where hash=$1`;
	const values = [hash];
	try {
		const rows = await db.query(query, values);
		console.log(`Hash Check Resp: ${rows}`);
		return false;
	} catch (error) {
		return false;
	}
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
