import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
const zlib = require('zlib');
import './sass/SubFilter.scss';

const Document = ({doc, changeFilename, updateHash}) => {
	const history = useHistory();
	const { title, author, user, tags, category, hash, file } = doc;

	const loadFile = async () => {
		// unzip compressed base64 file
		await changeFilename(title);
		await updateHash(hash);
		history.push('/pdfrenderer');
	}

	return (<div className='document' onClick={loadFile}>
		{title}
	</div>);
}

const NoDocuments = ({filter}) => {
	return (<div className='nodocs'>
		{`No documents on ${filter} found.`}
	</div>);
}

const SubFilter = ({filter, changeFilename, updateHash}) => {
	const [docs, updateDocs] = useState([]);
	const [path, updatePath] = useState(useLocation());
	
	useEffect(() => {
		// download the first page of texts from the filtered subdiscipline
		filterTexts(filter);
	}, []);

	const filterTexts = async (filter) => {
		const data = {"category" : path.pathname.split('/').pop(-1)};
		const resp = await fetch('/filtertexts', {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)});
		const r = await resp.json();
		console.log(`Response: ${Object.getOwnPropertyNames(r["docs"]["rows"][0])}`);
		if (r.docs.rows.length === 0) await updateDocs(null);
		await updateDocs(r["docs"]["rows"]);
	}

	return (<div className='subfilterwrapper'>
		<div className='documentbox'>
			{(docs && docs[0] != undefined) ? docs.map((doc, index) => {
				return (<div className='documentcase'>
					<Document key={index} doc={doc} changeFilename={changeFilename} updateHash={updateHash}/>
				</div>);
			}) : <NoDocuments filter={filter}/>}
		</div>
	</div>);
}

export {
	SubFilter
}
