import React, {useState} from 'react';
import Dropzone, {useDropzone} from 'react-dropzone';

const UploadPage = ({updateState, updateDisplayFile, changeFilename}) => {
	
	const [file, updateFile] = useState(null);
	const [tags, updateTags] = useState(null);

	const dropped = async (f) => {
		// add selected file to the state
		await updateFile(f[0]);
	}

	const upload = async () => {
		if (file === null) return;
		let title = document.getElementById('texttitle').value;
		// grab metadata tags
		let tags = document.getElementById("metatags").value.split(" ");
		// filter empty strings
		const filtered = tags.filter((elem) => { return elem.length != 0 });
		// add supplied file and the tags to the form data
		const text = {"title": title, "textfile": file, "tags": filtered};
		// send the post request
		const resp = await fetch('/upload', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(text)});
		console.log(resp);

		const blob = new Blob([file], {"type": "application/pdf"});
		await updateDisplayFile(blob);
		await changeFilename(file.name);
		await updateState(3);
	}

	return (<div id="uploadpagewrapper">
		<Dropzone id="dropzone" type="file" accept="application/pdf" onDrop={dropped}>
			{({getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles}) => (
			<div id="dropper" {...getRootProps()}>
				<input type="file" {...getInputProps()}/>
				{!isDragActive && acceptedFiles.length == 0 && "Click here or drag a file to upload!"}
				{isDragActive && !isDragReject && "Drop your file here!"}
				{isDragActive && isDragReject && "Please enter an image file"}
				{acceptedFiles.length > 0 && !isDragActive && !isDragReject && acceptedFiles[0].name}
			</div>
			)}
		</Dropzone>
		<div id="tags">
		<input id="texttitle" type="text" placeholder="put your title here"/>
		<input id="metatags" type="text" placeholder="put metadata tags here, separated by commas"/>
		<button id="submit" type="submit" onClick={upload}>Upload</button>
		</div>
	</div>);
}

export {
	UploadPage
}
