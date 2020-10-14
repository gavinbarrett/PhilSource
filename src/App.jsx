import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Link, Switch, useRouteMatch } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { Profile } from './components/Profile';
import { LoginPage } from './components/LoginPage';
import { UploadPage } from './components/UploadPage';
import { PDFRenderer } from './components/PDFRenderer';
import { SearchResults } from './components/SearchResults';
import { PageNotFound } from './components/PageNotFound';
import { ForgotPassword } from './components/ForgotPassword';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './components/sass/App.scss';

const App = () => {
	
	const [user, updateUser] = useState(null);
	const [token, updateToken] = useState(null);
	const [hash, updateHash] = useState(null);
	const [filename, changeFilename] = useState(null);
	const [displayFile, updateDisplayFile] = useState(null);
	const [searchResults, updateSearchResults] = useState([]);

	return (<Switch>
		<Route path='/' exact render={() => <LandingPage user={user} updateSearchResults={updateSearchResults}/>}/>
		<Route path='/signin' render={() => <LoginPage updateUser={updateUser} updateToken={updateToken}/>}/>
		<Route path='/forgot' render={() => <ForgotPassword/>}/>
		<Route path='/upload' render={() => <UploadPage user={user} token={token} updateDisplayFile={updateDisplayFile} changeFilename={changeFilename}/>}/>
		<Route path='/profile' render={() => <Profile user={user}/>}/>
		<Route path='/pdfrenderer' render={() => <PDFRenderer user={user} token={token} file={displayFile} name={filename} hash={hash}/>}/>
		<Route path='/searchresults' render={() => <SearchResults user={user} results={searchResults["search_results"]} updateDisplayFile={updateDisplayFile} changeFilename={changeFilename} updateHash={updateHash} updateSearchResults={updateSearchResults}/>}/>
		<Route path='*' render={() => <PageNotFound/>}/>
	</Switch>);
}

ReactDOM.render(
	<Router>
		<App/>
	</Router>, 
document.getElementById('root'));
