import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { UploadPage } from './components/UploadPage';
import { PDFRenderer } from './components/PDFRenderer';
import { SearchResults } from './components/SearchResults';

const App = () => {

	const [state, updateState] = useState(0);
	const [displayFile, updateDisplayFile] = useState(null);
	const [filename, changeFilename] = useState(null);
	const [searchResults, updateSearchResults] = useState([]);

	let page = '';

	if (state === 0)
		page = <LandingPage updateState={updateState} updateSearchResults={updateSearchResults}/>;
	else if (state === 1)
		page = <LoginPage/>;
	else if (state === 2)
		page = <UploadPage updateState={updateState} updateDisplayFile={updateDisplayFile} changeFilename={changeFilename}/>
	else if (state === 3)
		page = <PDFRenderer file={displayFile} name={filename} updateState={updateState}/>
	else if (state === 4)
		page = <SearchResults results={searchResults} updateState={updateState} updateDisplayFile={updateDisplayFile} changeFilename={changeFilename}/>
	return (<>{page}</>);
}

ReactDOM.render(<App/>, document.getElementById('root'));
