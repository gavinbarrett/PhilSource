const bcrypt = require('bcrypt');
const mysql = require('mysql');
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5555;

const database = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'rootpass',
	database: 'philsource'
});

// serve from the dist directory
app.use(express.static(__dirname + '/dist'));
// allow json consumption
app.use(express.json());


const computeHash = async (pass) => {
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
	const CMD = `SELECT * FROM users WHERE User='${user}'`;
	console.log(CMD);
	return await new Promise((resolve, reject) => {
		database.query(CMD, (err, rows) => {
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
	console.log('adding user');
	// generate hashed password with bcrypt
	const hash = await computeHash(pass);
	// construct an SQL query to insert the user
	const CMD = `INSERT INTO users (User, Pass, Email) VALUES ("${user}", "${hash}", "${email}");`;
	// place the user and hash password in the database
	database.query(CMD, (err, rows) => {
		if (err) {
			console.log("can't establish user");
			return;
		}
		console.log(`New user established: ${user}`);
	});
}


const checkForUser = async (user) => {
	const CMD = `SELECT * FROM users WHERE user='${user}';`;
	return await new Promise((resolve, reject) => {
		database.query(CMD, (err, rows) => {
			if (err) resolve(false);
			(rows[0] == undefined) ? resolve(false) : resolve(true);
		});
	});
}


app.post('/text_query', async (req, res) => {
	const { query } = req.body;

	// FIXME: SANITIZE INPUTS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	const CMD = `SELECT * FROM texts WHERE title REGEXP '${query}' OR tags REGEXP '${query}'`;

	const results = await new Promise((resolve, reject) => {
		database.query(CMD, (err, rows) => {
			err ? reject(err) : resolve(rows);
		});
	});

	res.send(JSON.stringify({"search_results": results}));
});


// upload pdf file
app.put('/upload', async (req, res) => {
	const {title, textfile, tags} = req.body;

	console.log(textfile["path"]);
	console.log(tags[0]);

	// FIXME: hash file

	const user = 'admin';

	const file = textfile["path"];
	// title, user, tags, file

	const CMD = `INSERT INTO texts (title, user, tags, file) VALUES ("${title}", "${user}", "${tags[0]}", "${file}");`;

	console.log(CMD);

	database.query(CMD, (err, rows) => {
		if (err) {
			console.log(err);
			throw err;
		}
		console.log('inserted into db');
	});
	// insert blob (textfile) into the database with associated tags
	// should we require a membership in order to upload? probably

	res.send(JSON.stringify({"status": "success"}));
});


app.post('/sign_in', async (req, res) => {
	const {user, pass} = req.body;
	console.log(user, pass);
	// hash password
	try {
		// find user's hashed password in the database
		const hash = await getHashedPass(user);
		// hash given password and check against db hash
		const hashed = await checkHashes(pass, hash);
		if (hashed) {
			
			console.log('hashes match!');
			const token = jwt.sign({"user": user}, process.env.ACCESS_TOKEN_SECRET);
			console.log(token);
			res.send(JSON.stringify({"access token": token}));
		} else {
			res.send(JSON.stringify({"access token": "failed"}));
		}
	} catch (err) {
		console.log(err);
		res.send(JSON.stringify({"sign_in": "failed"}));
	}
});


app.post('/sign_up', async (req, res) => {
	const {user, pass, email} = req.body;
	
	// FIXME: sanitize user, pass, email inputs

	// check to see if username is taken
	const exists = await checkForUser(user);
	if (exists) {
		res.send(JSON.stringify({"user":"unavailable"}));
		return;
	} else {
		await addUser(user, pass, email);
		// FIXME: return jwt to the user
		res.send(JSON.stringify({"status":"success"}));
	}
});


// serve landing page
app.get('/', (req, res) => {
	res.send('./index');
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`);
});
