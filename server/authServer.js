const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('./databaseFunctions.js');
const { getProfileFromDisk, readProfileFromDisk } = require('./diskUtilities.js');

// set cookie/session lifetime to 60 minutes
const expiry = 60 * 60;

exports.authUser = async (req, res, next) => {
	/* authenticate the user's session ID against a database */
	if (!req.cookies.sessionIDs) return res.sendStatus(401);
	const user = req.cookies.sessionIDs['user'];
	const sessionID = req.cookies.sessionIDs['id'];
	if (sessionID == null || sessionID == undefined) return res.sendStatus(401);
	// check Redis cache for sessionID
	const keys = db.exists(sessionID);
	// if sessionID isn't in the cache, send user to re-authenticate
	if (!keys) return res.sendStatus(401);
	// if sessionID is in the cache, user is authed and can access authorized functions
	next();
}

exports.signUserUp = async (req, res) => {
	// start user sign up process
	const { user, pass, email } = req.body;
	// FIXME: sanitize user, pass, email inputs
	try {
		// check to see if username is taken
		const exists = await checkForUser(user);
		if (exists) {
			// FIXME: clean up this response so that users can't impersonate as the unavailable user
			res.send(JSON.stringify({"user":"unavailable"}));
			return;
		} else {
			const result = await addUser(user, pass, email);
			// send back user and token
			const sessionID = await generateSessionID();
			db.set(sessionID, user, 'EX', expiry);
			const clientData = {
				user: user,
				id: sessionID
			};
			// set session ID in the cookie header
			res.cookie('sessionIDs', clientData, { maxAge: expiry * 1000, secure: true, httpOnly: true, sameSite: true });
			//
			res.send(JSON.stringify({"authed" : user}));
		}
	} catch (error) {
		res.send(JSON.stringify({"authed" : null}));
	}
};

exports.signUserIn = async (req, res) => {
	// sign in the user
	const { user, pass } = req.body;
	// hash password
	try {
		// find user's hashed password in the database
		const hash = await getHashedPass(user);
		// FIXME: check for profile photo hash; if one exists, read from disk with getProfileFromDisk
		// hash given password and check against db hash
		const hashed = await checkHashes(pass, hash);
		if (hashed) {
			// generate a unique session ID
			const sessionID = await generateSessionID();
			// set expiring session in the Redis cache
			db.set(sessionID, user, 'EX', expiry);
			const picture = await getProfilePicture(user);
			// set the session id in the cookie
			const clientData = { user: user, id: sessionID };
			// secure the cookie from snooping, XSS, and CSRF; set lifetime to 60 minutes
			const options = { maxAge: expiry * 1000, secure: true, httpOnly: true, sameSite: true };
			res.cookie('sessionIDs', clientData, options);
			picture ? res.send(JSON.stringify({"authed": user, "picture": picture})) : res(JSON.stringify({"authed": user, "picture": null}));
		// return failed login status
		} else
			res.send(JSON.stringify({"status": "failed"}));
	} catch (err) {
		res.send(JSON.stringify({"status": "failed"}));
	}
};

exports.signUserOut = async (req, res) => {
	/* delete session and cookie information */
	const sessionID = req.cookies.sessionIDs['id'];
	// delete session ID
	db.del(sessionID);
	// delete cookie
	res.clearCookie('sessionIDs');
	res.send(JSON.stringify({"status":"success"}));
};

exports.retrieveSession = async (req, res) => {
	/* retrieve a user's active session */
	if (req.cookies.sessionIDs) {
		const id = req.cookies.sessionIDs['id'];
		const user = req.cookies.sessionIDs['user'];
		// FIXME: check db; make sure user exists; return the hash of the profile photo if it exists
		const session = await checkForSession(id);
		if (!session)
			res.send(JSON.stringify({"retrieved": "failed", "profile": null}));
		else {
			const picture = await getProfilePicture(user);
			//console.log(`Picture retrieved: ${picture}`);
			res.send(JSON.stringify({"retrieved": user, "profile": picture}));
		}
	} else
		res.send(JSON.stringify({"retrieved": "failed", "profile": null}));
};

const getProfilePicture = async (user) => {
	// FIXME: check users table for user; extract profile picture hash; read disk by hash and return it to the user
	const query = `select * from users where username=$1`;
	const values = [user];
	try {
		const rows = await db.query(query, values);
		if (rows.rows.length !== 0) {
			const hash = rows['rows'][0]['profile'];
			console.log(hash);
			try {
				const image = await readProfileFromDisk(hash);
				//console.log(`Image from disk: ${image}`);
				if (image)
					return image;
				return null;
				console.log(`Image hash: ${image}`);
				return null;
			} catch(error) {
				console.log(`Error getting profile image.`);
				return null;
			}
		}
		return null;
	} catch(error) {
		console.log(`Error getting profile picture: ${error}`);
		return null;
	}
}

const checkForSession = async (id) => {
	/* check the Redis cache for the session */
	try {
		const r = await db.get(id);
		if (r)	// session exists; authenticate user
			return r;
		return null;
	} catch(error) {
		console.log(`Checking session error: ${error}`);
		return null;
	}
}

const addUser = async (user, pass, email) => {
	// add a user to the system
	// generate hashed password with bcrypt
	console.log(`Adding user.`);
	const hash = await computeSaltedHashedPass(pass);
	// construct an SQL query to insert the user
	const query = `insert into users (username, password, email) values ($1, $2, $3);`;
	const values = [user, hash, email]
	// place the user and hash password in the database
	try {
		const resp = await db.query(query, values);
		return resp;
	} catch (err) {
		console.log(`Error adding user: ${err}`);
		return false;
	}
}

const checkForUser = async (user) => {
	// search the database for the user
	const values = [user];
	const query = `select * from users where user=$1`;
	try {
		const resp = await db.query(query, values);
	} catch(error) {
		console.log(`Error checking for user ${error}`);
		return false;
	}
}

const computeSaltedHashedPass = async (pass) => {
	/* generate a salted hash of the user submitted password */
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
	// FIXME: add input validation
	/* get the salted hashed password of a user from the user table */
	const query = `select * from users where username=$1`;
	const values = [user];
	try {
		const rows = await db.query(query, values);
		console.log(`Length: ${rows.rows.length}`);
		if (rows.rows.length !== 0) {
			console.log(`Rows: "${Object.getOwnPropertyNames(rows["rows"]["length"])}"`);
			return rows['rows'][0]['password'];
		}
		throw new Error('User not found.');
	} catch (error) {
		console.log(`Error getting hashed password: ${error}`);
		return null;
	}	
}

const checkHashes = async (pass, hashword) => {
	// compare the salted hashed password against the database entry
	return await new Promise((resolve, reject) => {
		bcrypt.compare(pass, hashword, (err, hash) => {
			if (err) reject(err);
			resolve(hash);
		});
	});
}

const generateSessionID = async () => {
	/* return 64 bytes of entropy encoded in base64 to be used as a session ID */
	return new Promise((resolve, reject) => {
		resolve(crypto.randomBytes(64).toString('base64'));
	});
}
