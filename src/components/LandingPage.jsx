import React, { useEffect } from 'react';
import { Heading } from './Heading';
import { SearchBox } from './SearchBox';
import { Features } from './Features';
import { Footer } from './Footer';
import { Categories } from './Categories';

const LandingPage = ({updateState, updateSearchResults}) => {
	
	useEffect(() => {
		window.scrollTo(0,0);
	}, []);

	return (<div>
		<Heading updateState={updateState}/>
		<SearchBox updateState={updateState} updateSearchResults={updateSearchResults}/>
		<Features/>
		<Footer updateState={updateState}/>
	</div>);
}

export {
	LandingPage
}
