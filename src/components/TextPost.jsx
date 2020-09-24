import React from 'react';

const TextPost = ({title, user, tags, file, updateState, updateDisplayFile, changeFilename}) => {
	
	const display = async () => {
		console.log(file["data"]);
		const blob = new Blob([file["data"]], {"type": "application/pdf"});
		console.log(blob);
		await updateDisplayFile(blob);
		await changeFilename(title);
		await updateState(3);
	}

	return (<div id="postwrapper" onClick={display}>
		<div id="posttitle">{title}</div>
		<div id="posttags">{tags}</div>
	</div>);
}

export {
	TextPost
}
