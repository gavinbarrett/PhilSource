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
		<option value='Select a category' selected>Select a category</option>
		<option value='Aesthetics'>Aesthetics</option>
		<option value='Existentialism'>Existentialism</option>
		<option value='Feminism'>Feminism</option>
		<option value='German Idealism'>German Idealism</option>
		<option value='Logic'>Logic</option>
		<option value='Marxism'>Marxism</option>
		<option value='Metaphysics'>Metaphysics</option>
		<option value='Philosophy of Mind'>Philosophy of Mind</option>
		<option value='Philosophy of Religion'>Philosophy of Religion</option>
		<option value='Philosophy of Science'>Philosophy of Science</option>
		<option value='Political Philosophy'>Political Philosophy</option>
		<option value='Skepticism'>Skepticism</option>
	</select>);
}

const UploadPage = ({user, changeFilename, updateHash}) => {
	const [title, updateTitle] = useState('');
	const [author, updateAuthor] = useState('');
	const [tags, updateTags] = useState('');
	const [file, updateFile] = useState(null);
	const [category, updateCategory] = useState('');
	const [error, updateError] = useState('');
	const history = useHistory();

	// update document file object
	const dropped = async f => { await updateFile(f[0]); }

	// update the document's title
	const changeTitle = async event => { await updateTitle(event.target.value); }

	// update the document's author
	const changeAuthor = async event => { await updateAuthor(event.target.value); }

	// update the document's metadata tags
	const changeTags = async event => { await updateTags(event.target.value); }

	const validInput = async () => {
		/* Check the validity of user-supplied file metadata fields */
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
			} else if (category === 'Select a category') {
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
		// try to upload the file if it's metadata passes validation
		if (await validInput()) {
			// add file attributes to the FormData object
			const formData = new FormData();
			formData.append('title', title);
			formData.append('author', author);
			formData.append('tags', tags);
			formData.append('category', category);
			formData.append('textfile', file);
			const resp = await fetch('/upload', {method: 'PUT',  body: formData});
			// if user is not authenticated, redirect to signin page
			if (resp.status != 200) history.push('/signin');
			const r = await resp.json();
			//if (!r["status"]) return;
			//console.log(`Hash: ${r["status"]}`);
			const hash = r["status"];
			// store the hash of the current file
			//await updateHash(hash);
			// change the name of the displayed file
			await changeFilename(file.name);
			// switch to the PDFRenderer page
			history.push(`/pdfrenderer/${hash}`);
		} else {
			console.log('Cannot upload file.');
		}
	}

	return (<div id="uploadpagewrapper">
		<Dropzone id="dropzone" type="file" accept="application/pdf" onDrop={dropped}>
			{({getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles}) => (
			<div id="dropperwrapper">
			<div id="dropper" {...getRootProps()}>
				<input name="textfile" type="file" {...getInputProps()}/>
				{!isDragActive && acceptedFiles.length == 0 && "Click here or drag a file to upload!"}
				{isDragActive && !isDragReject && "Drop your file here!"}
				{isDragActive && isDragReject && "Please enter an image file"}
				{acceptedFiles.length > 0 && !isDragActive && !isDragReject && acceptedFiles[0].name}
			</div>
			</div>
			)}
		</Dropzone>
		<div id="tags">
		{error ? <div className='uploaderror'>{error}</div> : ''}
		<input id="texttitle" type="text" placeholder="put your title here" maxlength="64" onChange={changeTitle}/>
		<input id="metatags" type="text" placeholder="put metadata tags here, separated by commas" maxlength="64"onChange={changeTags}/>
		<input id="author" type="text" placeholder="put the author here" maxlength="64" onChange={changeAuthor}/><CategorySelector updateCategory={updateCategory}/><button id="submit" type="submit" onClick={upload}>Upload</button>
	</div></div>);
}

export {
	UploadPage
}
