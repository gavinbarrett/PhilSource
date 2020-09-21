const express = require('express');
const app = express();
const PORT = process.env.PORT || 5555;

// allow json consumption
app.use(express.json());

// serve from the dist directory
app.use(express.static(__dirname + '/dist'));

// upload pdf file
app.post('/upload', (req, res) => {
	console.log(req);
	res.send(JSON.stringify({"status": "success"}));
});

// serve landing page
app.get('/', (req, res) => {
	res.send('./index');
});


app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`);
});
