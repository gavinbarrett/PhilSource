import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Link, Switch, useRouteMatch } from 'react-router-dom';
import { Heading } from './components/Heading';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { Profile } from './components/Profile';
import { LoginPage } from './components/LoginPage';
import { UploadPage } from './components/UploadPage';
import { PDFRenderer } from './components/PDFRenderer';
import { SearchResults } from './components/SearchResults';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { PageNotFound } from './components/PageNotFound';
import { ForgotPassword } from './components/ForgotPassword';
import './components/sass/App.scss';

const App = () => {
	
	const [user, updateUser] = useState(null);
	const [hash, updateHash] = useState(null);
	const [filename, changeFilename] = useState(null);
	const [displayFile, updateDisplayFile] = useState(null);
	const [searchResults, updateSearchResults] = useState([]);

	useEffect(() => {
		console.log('Welcome to Philsource.');
		window.scroll({ top: 0, left: 0, behavior: 'smooth' });
		retrieveSession();
	}, []);

	const retrieveSession = async () => {
		const resp = await fetch('/get_session', { headers: {'Content-Type': 'application/json'}, credentials: 'same-origin' });
		if (resp.status != 200) return;
		const response = await resp.json();
		const retrieved = response["retrieved"];
		if (retrieved != 'failed')
			updateUser(retrieved);
	}

	return (<><Heading user={user} updateUser={updateUser}/>
		<Switch>
		<Route path='/' exact render={() => <LandingPage updateSearchResults={updateSearchResults}/>}/>
		<Route path='/signin' render={() => <LoginPage updateUser={updateUser}/>}/>
		<Route path='/forgot' render={() => <ForgotPassword/>}/>
		<Route path='/upload' render={() => <UploadPage updateDisplayFile={updateDisplayFile} changeFilename={changeFilename} updateHash={updateHash}/>}/>
		<Route path='/profile' render={() => <Profile user={user}/>}/>
		<Route path='/pdfrenderer' render={() => <PDFRenderer user={user} file={displayFile} name={filename} hash={hash}/>}/>
		<Route path='/searchresults' render={() => <SearchResults user={user} results={searchResults["search_results"]} updateDisplayFile={updateDisplayFile} changeFilename={changeFilename} updateHash={updateHash} updateSearchResults={updateSearchResults}/>}/>
		<Route path='/privacy' render={() => <PrivacyPolicy/>}/>
		<Route path='*' render={() => <PageNotFound/>}/>
		</Switch>
	<Footer/></>);
}

ReactDOM.render(
	<Router>
		<App/>
	</Router>, 
document.getElementById('root'));
