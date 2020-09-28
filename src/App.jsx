import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch, useRouteMatch } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { UploadPage } from './components/UploadPage';
import { PDFRenderer } from './components/PDFRenderer';
import { SearchResults } from './components/SearchResults';
import { PageNotFound } from './components/PageNotFound';

const App = () => {
	
	const [user, updateUser] = useState(null);
	const [token, updateToken] = useState(null);
	const [filename, changeFilename] = useState(null);
	const [displayFile, updateDisplayFile] = useState(null);
	const [searchResults, updateSearchResults] = useState([]);

	return (<Switch>
		<Route path='/' exact render={() => <LandingPage user={user} updateSearchResults={updateSearchResults}/>}/>
		<Route path='/login' render={() => <LoginPage updateUser={updateUser} updateToken={updateToken}/>}/>
		<Route path='/upload' render={() => <UploadPage updateDisplayFile={updateDisplayFile} changeFilename={changeFilename}/>}/>
		<Route path='/pdfrenderer' render={() => <PDFRenderer file={displayFile} name={filename}/>}/>
		<Route path='/searchresults' render={() => <SearchResults results={searchResults} updateDisplayFile={updateDisplayFile} changeFilename={changeFilename}/>}/>
		<Route render={() => <PageNotFound/>}/>
	</Switch>);
}

ReactDOM.render(
	<Router>
		<App/>
	</Router>, 
document.getElementById('root'));
