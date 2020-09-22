import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

const PDFRenderer = ({file}) => {

	const [pages, updatePages] = useState(null);
	const [pageNum, updatePageNum] = useState(1);
	
	const loadPageNums = async ({numPages}) => {
		console.log(`${numPages} pages`);
		await updatePages(numPages);
	}

	const nextPage = () => {
		updatePageNum(pageNum + 1);
	}

	const prevPage = () => {
		updatePageNum(pageNum - 1);
	}

	return (<div id="pdfrendererwrapper">
		<div id="pdfbox">
			<nav>
				<button onClick={prevPage}>Prev</button>
				<button onClick={nextPage}>Next</button>
			</nav>
			<Document file={file} onLoadSuccess={loadPageNums}>
				<Page pageNumber={pageNum} width={600}/>
			</Document>
		</div>
	</div>);
}

export default PDFRenderer;
