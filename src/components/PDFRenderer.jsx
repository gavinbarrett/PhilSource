import React, { useEffect, useState } from 'react';
import { Footer } from './Footer';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

const PostComment = ({hash, getComments}) => {
	
	const [comment, updateComment] = useState(null);

	const changeComment = async (event) => {
		await updateComment(event.target.value);
	}

	const submitComment = async () => {
		if (comment.length > 1000) return;
		const resp = await fetch('/comment', {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({"post": comment, "user": "user", "hash": hash})});
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
	return (<div className="noComment">"Be the first to comment!"</div>);
}

const Comments = ({hash}) => {
	
	const [posts, updatePosts] = useState([]);

	useEffect(() => {
		getComments(hash);
	}, []);

	const getComments = async (hash) => {
		const resp = await fetch(`/get_comments/?hash=${hash}`, {method: "GET"});
		const result = await resp.json();
		await updatePosts(result["posts"]);
	}
	
	return (<div id="comments">
		<PostComment hash={hash} getComments={getComments}/>
		{posts ? posts.map((post, index) => {
			return (<Comment key={index} text={post["post"]} poster={post["user"]}/>);
		}) : <NoComments/>}
	</div>);
}

const PDFRenderer = ({file, name, hash, updateState}) => {
	
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
		<Comments hash={hash}/>
	</div>
	<Footer/>
	</>);
}

export {
	PDFRenderer
}