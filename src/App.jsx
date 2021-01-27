import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Link, Switch, useRouteMatch } from 'react-router-dom';
import { Heading } from './components/Heading';
import { Footer } from './components/Footer';
import { Scroll } from './components/Scroll';
import { LandingPage } from './components/LandingPage';
import { Profile } from './components/Profile';
import { Contact } from './components/Contact';
import { LoginPage } from './components/LoginPage';
import { UploadPage } from './components/UploadPage';
import { PDFRenderer } from './components/PDFRenderer';
import { SearchResults } from './components/SearchResults';
import { SubFilter } from './components/SubFilter';
import { ForgotPassword } from './components/ForgotPassword';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { PageNotFound } from './components/PageNotFound';
const zlib = require('zlib');
import './components/sass/App.scss';

const App = () => {
	
	const [user, updateUser] = useState(null);
	const [hash, updateHash] = useState(null);
	const [profile, updateProfile] = useState('avatar.jpg');
	const [filter, updateFilter] = useState(null);
	const [filename, changeFilename] = useState(null);
	const [displayFile, updateDisplayFile] = useState(null);
	const [searchResults, updateSearchResults] = useState([]);

	useEffect(() => {
		// retrieve the user's session
		retrieveSession();
	}, []);

	const retrieveSession = async () => {
		// retrieve the user's session ID if one exists
		const resp = await fetch('/get_session', { headers: {'Content-Type': 'application/json'}, credentials: 'same-origin' });
		// starting new session
		if (resp.status != 200) {
			console.log('Welcome to PhiloSource.');
			return;
		} // resuming old session
		const response = await resp.json();
		const retrieved = response["retrieved"];
		//const pic = response["profile"][0]["Picture"];
		if (retrieved != 'failed') {
			console.log(`Welcome back to PhiloSource, ${retrieved}.`);
			// set client username
			await updateUser(retrieved);	
			/*
			if (pic) {		
				const unzipped = zlib.unzipSync(new Buffer(pic, 'base64')).toString('base64');
				console.log(`Unzipped: ${unzipped}`);
				const reader = new FileReader();
				const fileObj = new File([pic], {type: 'image/jpeg'});
				reader.onloadend = async () => {
					console.log(`Res: ${reader.result}`);
					await updateProfile(reader.result);
				};
				reader.readAsDataURL(fileObj);
				//console.log(`fileObj: ${fileObj}`);
				//const blob = new Blob([fileObj]);
				//console.log(`Blob: ${blob}`);
				//const blob = new Blob([unzipped], {"type": "application/image"});
				//await updateProfile(fileObj);
			}
			*/
		}
	}

	return (<>
	<Heading user={user} updateUser={updateUser} profile={profile} updateProfile={updateProfile}/>
		<Switch>
		<Route path='/' exact render={() => <LandingPage updateSearchResults={updateSearchResults} updateFilter={updateFilter}/>}/>
		<Route path='/signin' render={() => <LoginPage updateUser={updateUser}/>}/>
		<Route path='/forgot' render={() => <ForgotPassword/>}/>
		<Route path='/upload' render={() => <UploadPage updateDisplayFile={updateDisplayFile} changeFilename={changeFilename} updateHash={updateHash}/>}/>
		<Route path='/profile' render={() => <Profile user={user} profile={profile} updateProfile={updateProfile}/>}/>
		<Route path='/pdfrenderer' render={() => <PDFRenderer user={user} file={displayFile} name={filename} hash={hash}/>}/>
		<Route path='/searchresults' render={() => <SearchResults user={user} results={searchResults["search_results"]} updateDisplayFile={updateDisplayFile} changeFilename={changeFilename} updateHash={updateHash} updateSearchResults={updateSearchResults}/>}/>
		<Route path='/subfilter/*' render={() => <SubFilter filter={filter} updateDisplayFile={updateDisplayFile} changeFilename={changeFilename} updateHash={updateHash}/>}/>
		<Route path='/contact' render={() => <Contact/>}/>/>
		<Route path='/privacy' render={() => <PrivacyPolicy/>}/>
		<Route path='*' render={() => <PageNotFound/>}/>
		</Switch>
	<Footer/>
	</>);
}

ReactDOM.render(
	<Router>
		<Scroll/>
		<App/>
	</Router>, 
document.getElementById('root'));
