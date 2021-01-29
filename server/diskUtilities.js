const fs = require('fs');

exports. getDocFromDisk = async (req, res) => {
	/* return the base64 representation of a file on disk */
	const hash = req.query['hash'];
	const resp = await readDocFromDisk(hash);
	if (resp) {
		res.send(JSON.stringify({"file": resp}));
	} else
		res.send(JSON.stringify({"file": null}));
}

exports.writeDocToDisk = async (hash, file) => {
	/* save the file to disk */
	return new Promise((resolve, reject) => {
		fs.writeFile(`./data/documents/${hash}.pdf`, file, err => {
			if (err) resolve(null);
			console.log(`${hash}.pdf written to disk.`);
			resolve(true);
		});
	});
}

readDocFromDisk = async (hash) => {
	// FIXME: add input validation
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
