import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
const zlib = require('zlib');
import './sass/TextPost.scss';

const TextPost = ({title, user, tags, file, hash, changeFilename, updateHash}) => {

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
		const result = await resp.json();
		const f = result['file'];
		if (f) {
			// read base64 into a buffer
			const buffer = Buffer.from(f, 'base64');
			// construct pdf file object
			const pdf = new File([buffer], {type: 'application/json'});
			await changeFilename(title);
			//await updateHash(hash);
			history.push(`/pdfrenderer/${hash}`);
		}
	}

	return (<div id="postwrapper" onClick={display}>
		<div id="posttitle">{title}</div>
		<div id="posttags">{tags}</div>
	</div>);
}

export {
	TextPost
}
