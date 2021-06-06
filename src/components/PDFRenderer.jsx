import React, { createRef, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import './sass/PDFRenderer.scss';

const NoComments = () => {
	/* Return this component if the document doesn't have any comments */
	return (<div className="noComment">{"Be the first to comment!"}</div>);
}

const CommentBox = ({refer, updateComment}) => {
	const changeComment = event => {
		updateComment(event.target.value);
	}
	return (<div className='editor'>
		<textarea ref={refer} id="comment-input" type='text' placeholder={"Comment on post..."} maxlength={200} onChange={changeComment}></textarea>
	</div>);
}

const Comment = ({text, poster, time}) => {
	return (<div className="commentcard">
		<div className="poster">Posted by: {poster} at {time}</div>
		<div className="postcontent">
			{text}
		</div>
	</div>);
}

const Comments = ({user, path}) => {
	const [posts, updatePosts] = useState([]);
	const [comment, updateComment] = useState('');
	const [maxLength, updateMaxLength] = useState(200);
	const [hash, updateHash] = useState(path.pathname.split("/")[2]);
	const history = useHistory();
	const refer = createRef();

	useEffect(() => {
		/* Pull comments for the document from the comments table */
		// FIXME: pass pulled hash into comments component
		getComments(hash);
	}, []);

	const getComments = async (hash) => {
		/* Download the comments based on the hash */
		const resp = await fetch(`/get_comments/?hash=${hash}`, {method: "GET"});
		const result = await resp.json();
		if (result && result['posts']['rows'].length !== 0)
			updatePosts(result['posts']['rows']);
	}
	
	const submitComment = async () => {
		/* Comment on a document */
		if (comment === "") return;
		// create json object including user, time, content
		const resp = await fetch('/comment', {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'same-origin', body: JSON.stringify({"user": `${user}`, "post": `${comment}`, "hash": `${hash}`})});
		// reset comment box value to ""
		refer.current.value = "";
		if (resp.status != 200) history.push('/signin');
		const data = await resp.json();
		// load the new comment
		getComments(hash);
	}

	const overMaxLength = async () => {
		/* If the comment length is equal to or greater than the maxLength, stop reading into editState */
		if (comment.length >= maxLength)
			return true;
		return false;
	}

	return (<div id="comments">
		<CommentBox refer={refer} updateComment={updateComment}/>
		<div id="subbuttonwrapper">
			<button id="subbutton" onClick={submitComment}>Comment</button>
		</div>
		<div id="cont">
		</div>
		{(posts && Array.isArray(posts)) ? posts.map((post, index) => {
			return (<Comment key={index} text={post["post"]} poster={post["user"]} time={post["time"]}/>);
		}) : <NoComments/>}
	</div>);
}

export const PDFRenderer = ({user, name}) => {
	const [pageAmt, updatePageAmt] = useState(null);
	const [pageNum, updatePageNum] = useState(1);
	const [file, updateDisplayFile] = useState(null);
	const [prevenabled, updatePrevDisabled] = useState(true);
	const [nextenabled, updateNextDisabled] = useState(false);
	const [pageHash, updatePageHash] = useState("");
	const [location, updateLocation] = useState(useLocation());

	useEffect(() => {
		/* Downloads a document from the server. The PDFRenderer component is the sole 
		component that downloads files and displays them. All other components just set
		the hash of the file and render the PDFRenderer page, triggering this function. */
		updateDocumentHash();
		//getDocument();
	}, []);

	const updateDocumentHash = async () => {
		const h = location.pathname.split("/")[2];
		console.log(`h: ${h}`);
		// request file
		const resp = await fetch(`/get_text/?hash=${h}`, {method: 'GET'});
		const content = await resp.json();
		// check that a file exists
		if (content && content["file"]) {
			// decode base64
			const buffer = Buffer.from(content["file"], 'base64');
			console.log(`Buffer: ${buffer}`);
			// create file object
			const fl = new File([buffer], {type: 'application/pdf'});
			console.log(`FL: ${fl}`);
			// add file to the document component
			updateDisplayFile(fl);
		}
	}

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
			//const pdfFile = new File([buffer], {type: 'application/json'});
			const pdfFile = new Blob(buffer, {type: 'application/json'});
			// add file to the document component
			updateDisplayFile(pdfFile);
		}
	}
	
	const loadPageNums = ({numPages}) => { 
		/* Set the document page number */
		updatePageAmt(numPages);
	}

	const nextPage = () => {
		/* Flip to the next page in the document if one exists */
		if (pageNum === pageAmt) return;
		else if (pageNum === pageAmt-1)
			updateNextDisabled(true);
		updatePrevDisabled(false);
		updatePageNum(pageNum + 1);
	}

	const prevPage = () => {
		/* Flip to the previous page of the document if one exists */
		if (pageNum === 1) return;
		else if (pageNum === 2)
			updatePrevDisabled(true);
		updateNextDisabled(false);
		updatePageNum(pageNum - 1);
	}

	const download = () => {
		/* Prompt the user to save the file to their drive */
		let reader = new FileReader();
		const link = document.createElement('a');
		reader.readAsDataURL(file);
		reader.onload = () => {
			const ref = reader.result;
			link.setAttribute('href', ref);
			link.setAttribute('download', `${name}.pdf`);
			link.style.display = 'none';
			// add link to the page
			document.body.appendChild(link);
			// wait for user interaction
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
		<Comments user={user} path={location}/>
	</div></>);
}
