import React, {useState} from 'react';
import Dropzone, {useDropzone} from 'react-dropzone';
import { useHistory } from 'react-router-dom';
import './sass/UploadPage.scss';

const CategorySelector = ({updateCategory}) => {
	const selectCategory = async event => {
		// update the uploading category
		await updateCategory(event.target.value);
	}
	return (<select name='catselector' id='catselector' onChange={selectCategory}>
		<option value='' selected></option>
		<option value='Aesthetics'>Aesthetics</option>
		<option value='Existentialism'>Existentialism</option>
		<option value='Feminism'>Feminism</option>
		<option value='German Idealism'>German Idealism</option>
		<option value='Logic'>Logic</option>
		<option value='Marxism'>Marxism</option>
		<option value='Metaphysics'>Metaphysics</option>
		<option value='Phil. of Mind'>Phil. of Mind</option>
		<option value='Phil. of Religion'>Phil. of Religion</option>
		<option value='Phil. of Science'>Phil. of Science</option>
		<option value='Political Philosophy'>Political Philosophy</option>
		<option value='Skepticism'>Skepticism</option>
	</select>);
}

const UploadPage = ({user, updateDisplayFile, changeFilename, updateHash}) => {
	
	const [title, updateTitle] = useState('');
	const [author, updateAuthor] = useState('');
	const [tags, updateTags] = useState('');
	const [file, updateFile] = useState(null);
	const [category, updateCategory] = useState('');
	const [error, updateError] = useState('');
	const history = useHistory();

	const dropped = async f => {
		// add selected file to the state
		await updateFile(f[0]);
	}

	const changeTitle = async event => {
		// update uploading file title
		await updateTitle(event.target.value);
	}

	const changeAuthor = async event => {
		await updateAuthor(event.target.value);
	}

	const changeTags = async event => {
		// update uploading file title
		await updateTags(event.target.value);
	}

	const validInput = async () => {
		const alphaRegex = /^[a-z0-9\s]+$/i;
		return new Promise((resolve, reject) => {
			if (user === '')
				history.push('/signin');
			if (file === null) {
				updateError(`Please enter a file to submit.`);
				resolve(false);
			} else if (title === '') {
				updateError(`Please enter a title for the file.`);
				resolve(false);
			} else if (author === '') {
				updateError(`Please enter an author for the file.`);
				resolve(false)
			} else if (category === '') {
				updateError(`Please enter a category for the file.`);
				resolve(false);
			} else if (!title.match(alphaRegex)) {
				console.log(`Title: ${title}`);
				updateError(`Please enter an alphanumeric title (a-z, A-Z, 0-9, ' ').`);
				resolve(false);
			} else if (!author.match(alphaRegex)) {
				updateError(`Please enter an alphanumeric author name (a-z, A-Z, 0-9, ' ').`);
				resolve(false);
			} else if (!(tags.split(',').join('')).match(alphaRegex)) {
				updateError(`Please enter alphanumeric tags (a-z, A-Z, 0-9, ' ') separated by commas.`);
				resolve(false);
			}
			resolve(true);
		});	
	}

	const upload = async () => {
		if (await validInput()) {
			const path = file["path"];
			// split metadata tags by commas
			let split = tags.split(',').map(str => str.trim());
			// filter empty strings
			//const filtered = tags.filter((elem) => { return elem.length != 0 });
			const formData = new FormData();
			formData.append('title', title);
			formData.append('author', 'samuel clemens');
			formData.append('tags', split);
			formData.append('category', category);
			formData.append('textfile', file);
			// FIXME: activate loading screen
			// try to upload a text to the database
			const resp = await fetch('/upload', {method: 'PUT',  body: formData});
			console.log(resp);
			// if user is not authenticated, redirect to signin page
			if (resp.status != 200) history.push('/signin');
			const blob = new Blob([file], {"type": "application/pdf"});
			const r = await resp.json();
			await updateHash(r["status"]);
			await updateDisplayFile(blob);
			await changeFilename(file.name);
			history.push('/pdfrenderer');
		}
		console.log('cannot upload');
	}

	return (<><div id="uploadpagewrapper">
		<Dropzone id="dropzone" type="file" accept="application/pdf" onDrop={dropped}>
			{({getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles}) => (
			<div id="dropperwrapper">
			<div id="dropper" {...getRootProps()}>
				<input type="file" {...getInputProps()}/>
				{!isDragActive && acceptedFiles.length == 0 && "Click here or drag a file to upload!"}
				{isDragActive && !isDragReject && "Drop your file here!"}
				{isDragActive && isDragReject && "Please enter an image file"}
				{acceptedFiles.length > 0 && !isDragActive && !isDragReject && acceptedFiles[0].name}
			</div>
			</div>
			)}
		</Dropzone>
		{error ? <div className='uploaderror'>{error}</div> : ''}
		<div id="tags">
		<input id="texttitle" type="text" placeholder="put your title here" onChange={changeTitle}/>
		<input id="metatags" type="text" placeholder="put metadata tags here, separated by commas" onChange={changeTags}/>
		<CategorySelector updateCategory={updateCategory}/>
		<button id="submit" type="submit" onClick={upload}>Upload</button>
		</div>
		<input id="author" type="text" placeholder="put the author here" onChange={changeAuthor}/>
	</div></>);
}

export {
	UploadPage
}
