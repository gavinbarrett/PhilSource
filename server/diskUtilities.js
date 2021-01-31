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

exports.getProfileFromDisk = async (req, res) => {
	const hash = req.query['hash'];
	console.log(`Hash: ${hash}`);
	const resp = await readProfileFromDisk(hash);
	console.log(`Resp: ${resp}`);
	resp ? res.send(JSON.stringify({"file": resp})) : res.send(JSON.stringify({"file": "null"}));
}

exports.writeProfileToDisk = async (hash, file, ext) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(`./data/profiles/${hash}.${ext}`, file, err => {
			if (err)
				resolve(null);
			console.log(`${hash}.${ext} written to disk.`);
			resolve(true);
		});
	});
}

exports.readProfileFromDisk = async (profile) => {
	// FIXME: add input validation
	/* read a file from disk if it exists */
	const dir = `./data/profiles/`;
	const fileRegex = new RegExp(`${profile}\.((png)|(jpg)|(jpeg))`);
	return new Promise((resolve, reject) => {
		fs.readdir(dir, (err, files) => {
			console.log(`Files: ${files}`);
			const file = files.filter(ff => { return ff.match(fileRegex) });
			console.log(`File: ${file}`);
			if (!file) resolve(null);
			const path = `./data/profiles/${file}`;
			fs.access(path, fs.F_OK, err => {
				if (err) {
					console.log(`Error accessing file: ${err}`);
					resolve(null);
				}
				fs.readFile(path, 'base64', (err, data) => {
					if (err) {
						console.log(`Error reading file: ${err}`);
						resolve(null);
					}
					resolve(data);
				});
			});
		});
	});
}
