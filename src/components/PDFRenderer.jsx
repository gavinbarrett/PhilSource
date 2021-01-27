import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { EditorState, convertToRaw} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { stateToHTML } from 'draft-js-export-html';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import './sass/PDFRenderer.scss';

const NoComments = () => {
	/* Return this component if the document doesn't have any comments */
	return (<div className="noComment">{"Be the first to comment!"}</div>);
}

const Comment = ({text, poster, time}) => {
	const ref = useRef(null);

	useEffect(() => {
		// set the inner html to our serialized comment
		ref["current"].innerHTML = text;
	}, []);

	return (<div className="commentcard">
		<div className="poster">Posted by: {poster} at {time}</div>
		<div ref={ref} className="postcontent"></div>
	</div>);
}

const Comments = ({user, hash}) => {
	const [posts, updatePosts] = useState([]);
	const [editState, updateEditState] = useState(EditorState.createEmpty());
	const history = useHistory();

	useEffect(() => {
		/* Pull comments for the document from the comments table */
		getComments(hash);
	}, []);

	const getComments = async (hash) => {
		/* Download the comments based on the hash */
		const resp = await fetch(`/get_comments/?hash=${hash}`, {method: "GET"});
		const result = await resp.json();
		await updatePosts(result["posts"]);
	}
	
	const submitComment = async () => {
		/* Comment on a document */
		console.log(`Grabbing comments for ${hash}`);
		console.log(`State: ${typeof editState.getCurrentContent()}`);
		const commstate = stateToHTML(editState.getCurrentContent());
		// create json object including user, time, content
		const resp = await fetch('/comment', {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'same-origin', body: JSON.stringify({"user": `${user}`, "post": `${commstate}`, "hash": `${hash}`})});
		if (resp.status != 200) history.push('/signin');
		const data = await resp.json();
		// load the new comment
		await getComments(hash);
	}

	return (<div id="comments">
		<div className="editor">
			<Editor editorState={editState} 
			toolbarClassName="toolbarClassName"
			wrapperClassName="wrapperClassName"
			editorClassName="editorClassName"
			onEditorStateChange={updateEditState}/>
		</div>
		<div id="subbuttonwrapper">
			<button id="subbutton" onClick={submitComment}>Comment</button>
		</div>
		<div id="cont">
		</div>
		{posts ? posts.map((post, index) => {
			return (<Comment key={index} text={post["post"]} poster={post["user"]} time={post["time"]}/>);
		}) : <NoComments/>}
	</div>);
}

const PDFRenderer = ({user, file, updateDisplayFile, name, hash}) => {
	const [pageAmt, updatePageAmt] = useState(null);
	const [pageNum, updatePageNum] = useState(1);
	const [prevenabled, updatePrevDisabled] = useState(true);
	const [nextenabled, updateNextDisabled] = useState(false);

	useEffect(() => {
		/* Downloads a document from the server. The PDFRenderer component is the sole 
		component that downloads files and displays them. All other components just set
		the hash of the file and render the PDFRenderer page, triggering this function. */
		getDocument();
	}, []);

	const getDocument = async () => {
		/* download the document if a hash is set */
		if (!hash) return;
		// request file
		const resp = await fetch(`/get_text/?hash=${hash}`, {method: 'GET'});
		const content = await resp.json();
		// check that a file exists
		if (content && content["file"]) {
			// decode base64
			const buffer = Buffer.from(content["file"], 'base64');
			// create file object
			const fl = new File([buffer], {type: 'application/json'});
			// add file to the document component
			await updateDisplayFile(fl);
		}
	}
	
	const loadPageNums = async ({numPages}) => { 
		/* Set the document page number */
		await updatePageAmt(numPages);
	}

	const nextPage = async () => {
		/* Flip to the next page in the document if one exists */
		if (pageNum === pageAmt) return;
		else if (pageNum === pageAmt-1)
			await updateNextDisabled(true);
		await updatePrevDisabled(false);
		await updatePageNum(pageNum + 1);
	}

	const prevPage = async () => {
		/* Flip to the previous page of the document if one exists */
		if (pageNum === 1) return;
		else if (pageNum === 2)
			await updatePrevDisabled(true);
		await updateNextDisabled(false);
		await updatePageNum(pageNum - 1);
	}

	const download = async () => {
		/* Prompt the user to save the file to their drive */
		let reader = new FileReader();
		let link = document.createElement('a');
		console.log(file);
		console.log(Object.keys(file));
		const f = new Blob(file["data"], {"type": "application/pdf"});
		reader.readAsDataURL(f);
		reader.onloadend = () => {
			const x = reader.result;
			link.setAttribute('href', x);
			link.setAttribute('download', name);
			link.style.display = 'none';
			// add link to the page
			document.body.appendChild(link);
			link.click();
			// remove link from the page
			document.body.removeChild(link);
		}
	}

	return (<><div id="pdfrendererwrapper">
		<div id="pdfcontroller">
			<nav id="navbar">
				<div id="movebuttons">
					<button className="navbutton" disabled={prevenabled} onClick={prevPage}>Prev</button>
					Page {pageNum} of {pageAmt}
					<button className="navbutton" disabled={nextenabled} onClick={nextPage}>Next</button>
				</div>
				<button className="navbutton" onClick={download}>Download</button>
			</nav>
			<div id="pdfbox">
				<Document file={file} onLoadSuccess={loadPageNums}>
					<Page pageNumber={pageNum} width={600}/>
				</Document>
			</div>
		</div>
		<Comments user={user} hash={hash}/>
	</div></>);
}

export {
	PDFRenderer
}
