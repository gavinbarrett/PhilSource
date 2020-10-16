import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Heading } from './Heading';
import { Footer } from './Footer';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { EditorState, convertToRaw} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { stateToHTML } from 'draft-js-export-html';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import './sass/PDFRenderer.scss';

const PostComment = ({token, hash, getComments}) => {
	
	const [comment, updateComment] = useState(null);
	const history = useHistory();

	const changeComment = async (event) => {
		await updateComment(event.target.value);
	}

	const submitComment = async () => {
		console.log(`comment: ${comment}`);
		if (comment.length > 1000) return;
		if (comment == null) return;
		// redirect to login page if no jwt exists
		if (token == null) history.push('/login');
		// send comment post request
		const resp = await fetch('/comment', {method: "POST", headers: {"authorization": `Bearer ${token}`, "Content-Type": "application/json"}, body: JSON.stringify({"post": comment, "hash": hash})});
		const r = await resp.json();
		// erase textarea text
		await updateComment(null);
		document.getElementById('originalpost').value = '';
		getComments(hash);
		console.log(r);
	}
	return (<div id="postcomment">
		<textarea id="originalpost" type="input" placeholer="put your comment here" onChange={changeComment}/>
		<div>Bold Italic</div>
		<div id="subbuttonwrapper"><button id="subbutton" onClick={submitComment}>Submit</button></div>
	</div>);
}

const Comment = ({text, poster}) => {
	return (<div className="commentcard">
		<div className="poster">Posted by: {poster}</div>
		<div className="postcontent">{text}</div>
	</div>);
}

const NoComments = () => {
	return (<div className="noComment">{"Be the first to comment!"}</div>);
}

const Comments = ({token, hash}) => {
	
	const [posts, updatePosts] = useState([]);
	const [editState, updateEditState] = useState(EditorState.createEmpty());

	useEffect(() => {
		getComments(hash);
	}, []);

	const getComments = async (hash) => {
		const resp = await fetch(`/get_comments/?hash=${hash}`, {method: "GET"});
		const result = await resp.json();
		await updatePosts(result["posts"]);
	}
	
	const printout = () => {
		const contstate = stateToHTML(editState.getCurrentContent());
		console.log(contstate);
	}

	return (<div id="comments">
		<div className="editor" onClick={printout}>
			<Editor editorState={editState} 
			toolbarClassName="toolbarClassName"
			wrapperClassName="wrapperClassName"
			editorClassName="editorClassName"
			onEditorStateChange={updateEditState}/>
		</div>
		{posts ? posts.map((post, index) => {
			return (<Comment key={index} text={post["post"]} poster={post["user"]}/>);
		}) : <NoComments/>}
	</div>);
}

const PDFRenderer = ({user, token, file, name, hash, updateState}) => {
	
	const [pageAmt, updatePageAmt] = useState(null);
	const [pageNum, updatePageNum] = useState(1);
	const [prevenabled, updatePrevDisabled] = useState(true);
	const [nextenabled, updateNextDisabled] = useState(false);

	const loadPageNums = async ({numPages}) => {
		console.log(`${numPages} pages`);
		await updatePageAmt(numPages);
	}

	const nextPage = async () => {
		if (pageNum === pageAmt) return;
		else if (pageNum === pageAmt-1)
			await updateNextDisabled(true);
		await updatePrevDisabled(false);
		await updatePageNum(pageNum + 1);
	}

	const prevPage = async () => {
		if (pageNum === 1) return;
		else if (pageNum === 2)
			await updatePrevDisabled(true);
		await updateNextDisabled(false);
		await updatePageNum(pageNum - 1);
	}

	const download = async () => {
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

	return (<><Heading user={user}/>
	<div id="pdfrendererwrapper">
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
		<Comments token={token} hash={hash}/>
	</div>
	<Footer/>
	</>);
}

export {
	PDFRenderer
}
