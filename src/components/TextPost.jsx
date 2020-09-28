import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
const zlib = require('zlib');

const TextPost = ({title, user, tags, file, hash, updateDisplayFile, changeFilename}) => {

	const [digest, updateDigest] = useState(null);
	const history = useHistory();

	useEffect(() => {
		const upHash = async () => {
			await updateDigest(hash);
		}
		upHash();
	}, []);

	const display = async () => {
		// call fetch and pull file with hash
		const resp = await fetch(`/get_text/?hash=${digest}`, {method: 'GET'});
		const results = await resp.json();
		console.log(results);
		//console.log(`calling for ${digest}`);
		//console.log(file["data"]);
		//const blob = new Blob([file], {"type": "application/pdf"});
		//console.log(blob);
		const file = results["status"][0]["file"];
		const bfile = JSON.parse(zlib.unzipSync(Buffer.from(file, 'base64')));
		console.log(bfile);
		// FIXME: uncompress file and transform from base64 to pdf
		const blob = new Blob([bfile], {"type": "application/pdf"});
		await updateDisplayFile(bfile);
		await changeFilename(title);
		history.push('/pdfrenderer');
	}

	return (<div id="postwrapper" onClick={display}>
		<div id="posttitle">{title}</div>
		<div id="posttags">{tags}</div>
	</div>);
}

export {
	TextPost
}
