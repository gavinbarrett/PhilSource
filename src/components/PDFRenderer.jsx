import React, { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

const PDFRenderer = ({file}) => {
	console.log(file);	
	const [pageAmt, updatePageAmt] = useState(null);
	const [pageNum, updatePageNum] = useState(1);
	
	const loadPageNums = async ({numPages}) => {
		console.log(`${numPages} pages`);
		await updatePageAmt(numPages);
	}

	const nextPage = () => {
		if (pageNum === pageAmt) return;
		updatePageNum(pageNum + 1);
	}

	const prevPage = () => {
		if (pageNum === 1) return;
		updatePageNum(pageNum - 1);
	}

	const download = () => {
		let blob = new Blob([blob], {"type": "application/pdf"});
		let link = document.createElement('a');
		link.href = data;
		link.download = "file.pdf";
		link.click();
		setTimeout(() => {
			window.URL.revokeObjectURL(data);
		}, 100);
	}

	return (<div id="pdfrendererwrapper">
		<div id="pdfcontroller">
			<nav id="navbar">
				<div id="movebuttons">
					<button className="navbutton" onClick={prevPage}>Prev</button>
					<button className="navbutton" onClick={nextPage}>Next</button>
				</div>
				<button className="navbutton" onClick={download}>Download</button>
			</nav>
			<div id="pdfbox">
				<Document file={file} onLoadSuccess={loadPageNums}>
					<Page pageNumber={pageNum} width={600}/>
				</Document>
			</div>
		</div>
	</div>);
}

export default PDFRenderer;
