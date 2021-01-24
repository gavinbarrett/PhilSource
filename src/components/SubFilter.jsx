import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
const zlib = require('zlib');
import './sass/SubFilter.scss';

const Document = ({doc, updateDisplayFile, changeFilename, updateHash}) => {
	const history = useHistory();
	const { title, author, user, tags, category, hash, file } = doc;

	const loadFile = async () => {
		// unzip compressed base64 file
		const bfile = JSON.parse(zlib.unzipSync(Buffer.from(file, 'base64')));
		console.log(`bfile: ${bfile}`);
		// write file data into a Blob object
		const blob = new Blob([bfile], {"type": "application/pdf"});
		await updateDisplayFile(bfile);
		await updateHash(hash);
		await changeFilename(title);
		history.push('/pdfrenderer');
	}

	return (<div className='document' onClick={loadFile}>
		{title}
	</div>);
}

const SubFilter = ({filter, updateDisplayFile, changeFilename, updateHash}) => {
	
	const [docs, updateDocs] = useState(null);
	const [path, updatePath] = useState(useLocation());
	
	useEffect(() => {
		// download the first page of texts from the filtered subdiscipline
		filterTexts(filter);
	}, []);

	const filterTexts = async (filter) => {
		console.log(`Sending filter: ${filter}`);
		console.log(`Path: ${path.pathname}`);
		//const x = path.split('/');
		//console.log(`Split: ${x}`);
		//const y = x.pop(-1);
		//console.log(`Popped: ${y}`);
		const data = {"category" : path.pathname.split('/').pop(-1)};
		const resp = await fetch('/filtertexts', {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)});
		const r = await resp.json();
		console.log(r);
		await updateDocs(r["docs"]);
	}

	return (<div className='subfilterwrapper'>
		<div className='documentbox'>
			{docs ? docs.map((doc, index) => {
				return (<div className='documentcase'>
					<Document key={index} doc={doc} updateDisplayFile={updateDisplayFile} changeFilename={changeFilename} updateHash={updateHash}/>
				</div>);
			}) : `No documents on ${filter} found.`}
		</div>
	</div>);
}

export {
	SubFilter
}
