const express = require('express');
const app = express();
const PORT = process.env.PORT || 5555;

app.use(express.static(__dirname + '/dist'));

app.get('/', (req, res) => {
	res.send('./index');
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`);
});
