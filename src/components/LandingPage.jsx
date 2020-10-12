import React, { useEffect } from 'react';
import { Heading } from './Heading';
import { SearchBox } from './SearchBox';
import { Features } from './Features';
import { Footer } from './Footer';
import { Categories } from './Categories';
import './sass/SearchBox.scss';

const LandingPage = ({user, updateSearchResults}) => {
	
	useEffect(() => {
		window.scrollTo(0,0);
	}, []);

	return (<div>
		<Heading user={user}/>
		<SearchBox updateSearchResults={updateSearchResults}/>
		<Features/>
		<Footer/>
	</div>);
}

export {
	LandingPage
}
