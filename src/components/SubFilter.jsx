import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
const zlib = require('zlib');
import './sass/SubFilter.scss';

const Document = ({doc, changeFilename, updateHash}) => {
	const history = useHistory();
	const { title, author, user, tags, category, hash, file } = doc;
	const loadFile = async () => {
		changeFilename(title);
		// render the pdf page
		history.push(`/pdfrenderer/${hash}`);
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

export const SubFilter = ({filter, changeFilename, updateHash}) => {
	const [docs, updateDocs] = useState([]);
	const [path, updatePath] = useState(useLocation());
	
	useEffect(() => {
		// download the first page of texts from the filtered subdiscipline
		filterTexts(filter);
	}, []);

	useEffect(() => {
		console.log(`Docs: ${docs}`);
	}, [docs]);

	const filterTexts = async (filter) => {
		console.log(`filter: ${filter}`);
		const data = {"category" : filter};
		const resp = await fetch('/filtertexts', {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)});
		const r = await resp.json();
		if (r) {
			if (r.docs && r.docs.rows && r.docs.rows.length === 0) {
				updateDocs(null);
			} else {
				updateDocs(r["docs"]["rows"]);
			}
		} else
			updateDocs(null);
	}

	return (<div className='subfilterwrapper'>
		<div className='documentbox'>
			{docs && docs.length ? docs.map((doc, index) => {
				return (<div className='documentcase'>
					<Document key={index} doc={doc} changeFilename={changeFilename} updateHash={updateHash}/>
				</div>);
			}) : <NoDocuments filter={filter}/>}
		</div>
	</div>);
}
