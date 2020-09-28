import React from 'react';
import { useHistory } from 'react-router-dom';

const TextPost = ({title, user, tags, file, updateDisplayFile, changeFilename}) => {
	const history = useHistory();
	
	const display = async () => {
		console.log(file["data"]);
		const blob = new Blob([file], {"type": "application/pdf"});
		console.log(blob);
		await updateDisplayFile(blob);
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
