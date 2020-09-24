import React, { useState } from 'react';
import { Footer } from './Footer';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

const Comments = () => {
	return (<div id="comments">
		Comments
	</div>);
}

const PDFRenderer = ({file, name, updateState}) => {
	
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
		reader.readAsDataURL(file);
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
		<Comments/>
	</div>
	<Footer updateState={updateState}/>
	</>);
}

export {
	PDFRenderer
}
