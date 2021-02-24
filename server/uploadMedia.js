const zlib = require('zlib');
const crypto = require('crypto');
const moment = require('moment');
const Duplex = require('stream').Duplex;
// PhiloSource server functions
const db = require('./databaseFunctions.js');
const { validateQuery } = require('./validateQuery.js');
const { writeDocToDisk, writeProfileToDisk } = require('./diskUtilities.js');

// regular expressions for database input validation
const alphaNumRegex = /^[a-z0-9]+$/i; // alphanumeric
const alphaSpaceRegex = /^[a-z0-9\s]+$/i; // alphanumeric + space

exports.commentOnPost = async (req, res) => {
	// FIXME: add input validation with different regex that can parse datetime
	/* comment on a post */
	const { user, post, hash } = req.body;
	console.log(`Post: ${post}`);
	const query = `insert into comments (username, hash, time, post) values ($1, $2, $3, $4)`
	const values = [user, hash, moment().format('MMMM Do YYYY, h:mm:ss a'), post];
	console.log(`Query: ${query}`);
	console.log(`Values: ${values}`);
	try {
		const rows = await db.query(query, values);
		console.log(`Rows: ${Object.getOwnPropertyNames(rows)}`);
		console.log(`Deposited ${hash}`);
		rows ? res.send(JSON.stringify({"status": "success"})) : res.send(JSON.stringify({"status": "failure"}));
	} catch(error) {
		res.send(JSON.stringify({"status": "failure"}));
	}
};

exports.filterTexts = async (req, res) => {
	const { category } = req.body;
	const values = [category];
	const query = `select * from documents where category=$1`;
	if (await validateQuery(values, alphaSpaceRegex)) {
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
	} else {
		res.send(JSON.stringify({"docs": null}));
	}
}

exports.uploadText = async (req, res) => {
	console.log('Uploading');
	/* upload a PDF to disk */
	// extract user and file metadata
	const { title, author, tags, category } = req.body;
	const username = req.cookies.sessionIDs['user'];
	// extract the PDF file
	const fileObj = req.file["buffer"];
	// turn file into buffer object
	const file = Buffer.from(fileObj);
	// try to upload the PDF if it's
	try {
		console.log('Hashing file.');
		// generate the file hash
		let hash = await hashFile(file);
		console.log('File hashed.');
		if (!validDocumentRecord(title, author, username, tags, category, hash))
			res.send(JSON.stringify({"status": null}));
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
				let r = await insertDocIntoDB(title, author, username, tags, category, hash);
				res.send(JSON.stringify({"status": hash}));
			} else {
				res.send(JSON.stringify({"status": null}));
			}
		}
	} catch (err) {
		console.log(`Error when uploading: ${err}`);
		res.send(JSON.stringify({"status": null}));
	}
};

exports.uploadProfile = async (req, res) => {
	/* save a user's profile photo to disk */
	const user = req.cookies.sessionIDs['user'];
	const image = req.file["buffer"];
	try {
		// try to insert image file into the users table
		// FIXME: save to disk instead of inserting into the db; add the hash to the user record
		const hash = await hashFile(image);
		console.log(`Hash: ${hash}`);
		// save profile photo on disk
		// FIXME: programmatically set image file extension
		const written = await writeProfileToDisk(hash, image, 'jpg');
		// insert hash into the document table
		const result = await insertProfileIntoDB(user, hash);
		(written && result) ? res.send(JSON.stringify({"status": "success"})) : res.send(JSON.stringify({"status": null}));
	} catch (error) {
		console.log(`Error uploading file: ${error}`);
		res.send(JSON.stringify({"status": "failed"}));
	}
}

exports.textQuery = async (req, res) => {
	// search the database file title and tags for a user submitted phrase
	const { tag } = req.body;
	console.log(`Tag: ${tag}`);
	const query = `select * from documents where title ~* $1 or tags ~* $2`;
	const values = [tag, tag];
	if (await validateQuery(values, alphaSpaceRegex)) {
		try {
			const rows = await db.query(query, values);
			rows ? res.send(JSON.stringify({"search_results": rows})) : res.send(JSON.stringify({"search_results": null}));
		} catch(error) {
			console.log(`Error querying for documents: ${error}`);
			res.send(JSON.stringify({"search_results": null}));
		}
	} else {
		res.send(JSON.stringify({"search_results": null}));
	}
};

exports.getPostComments = async (req, res) => {
	// pull the comments of a post from the comments table
	const hash = req.query["hash"];
	const query = `select * from comments where hash=$1`;
	const values = [hash];
	if (await validateQuery(values, alphaNumRegex)) {
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
	} else {
		res.send(JSON.stringify({"posts": null}));
	}
};

const validDocumentRecord = async (title, author, username, tags, category, hash) => {
	/* FIXME: ensure title, author, username, tags, category, hash are all <= 64 characters long
			  match title, author, and username with alphaSpaceRegex, tags with `{alphaNumRegex}, `,
			  match category with alphaSpaceRegex, match hash with alphaNumRegex
	*/
	const alphaNumRegex = /^[a-z0-9]+$/i;
	const alphaSpaceRegex = /^[a-z0-9\s]+$/i;
	const tagRegex = /^(([a-z0-9\s]+,?)+\s?)$/i;
	// ensure all credentials are <= 64 characters in length
	if (title.length > 64 || author.length > 64 || username.length > 64 || tags.length > 64 || category.length > 64 || hash.length > 64)
		return false;
	// ensure all credentials pass their respective regex checks
	if (!title.match(alphaSpaceRegex) || !author.match(alphaSpaceRegex) || !username.match(alphaSpaceRegex) || tags.match(tagRegex) || !category.match(alphaSpaceRegex) || !hash.match(alphaNumRegex))
		return false;
	return true;
}

const insertDocIntoDB = async (title, author, username, tags, category, hash) => {
	/* insert a record into the document table */
	console.log('inserting');
	const values = [title, author, username, tags, category, hash];
	const query = `insert into documents (title, author, username, tags, category, hash) values($1, $2, $3, $4, $5, $6)`;
	if (validDocumentRecord(title, author, username, tags, category, hash)) {
		try {
			const rows = await db.query(query, values);
			console.log(`Rows from doc insertion: ${rows}`);
			return true;
		} catch (error) {
			console.log(`Error: ${error}`);
			return false;
		}
	}
	return false;
}

const insertProfileIntoDB = async (user, hash) => {
	/* insert the profile hash into the user record */
	const values = [hash, user]
	const query = `update users set profile=$1 where username=$2`;
	if (await validateQuery(values, alphaSpaceRegex)) {
		try {
			const rows = await db.query(query, values);
			if (rows.rows.length !== 0)
				return true;
			return false;
		} catch(error) {
			console.log(`Error inserting profile into db: ${error}`);
			return false;
		}
	} else {
		return false;
	}
}

const checkForTextHash = async (hash) => {
	/* search the database for a file hash */
	const query = `select * from documents where hash=$1`;
	const values = [hash];
	if (await validateQuery(values, alphaNumRegex)) {
		try {
			const rows = await db.query(query, values);
			console.log(`Hash Check Resp: ${rows}`);
			return false;
		} catch (error) {
			return false;
		}
	} else {
		return false;
	}
}

const hashFile = async (file) => {
	/* compute the sha256 digest of a file */
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
