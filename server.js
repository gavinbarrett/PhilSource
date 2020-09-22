const bcrypt = require('bcrypt');
const mysql = require('mysql');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5555;

const database = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'rootpass',
	database: 'philsource'
});

// allow json consumption
app.use(express.json());

// serve from the dist directory
app.use(express.static(__dirname + '/dist'));

// upload pdf file
app.post('/upload', async (req, res) => {
	//const textfile = req.body["text"];
	const {textfile, tags} = req.body;
	//const tags = req.body["tags"];
	console.log(req.body);
	//console.log(tags);
	res.send(JSON.stringify({"status": "success"}));
});

app.post('/sign_in', async (req, res) => {

});

app.post('/sign_up', async (req, res) => {

});

// serve landing page
app.get('/', (req, res) => {
	res.send('./index');
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`);
});
