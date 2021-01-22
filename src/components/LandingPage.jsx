import React, { useEffect } from 'react';
import { SearchBox } from './SearchBox';
import { Features } from './Features';
import { Categories } from './Categories';
import './sass/SearchBox.scss';

const LandingPage = ({updateSearchResults}) => {
	
	useEffect(() => {
		window.scrollTo(0,0);
	}, []);

	return (<div>
		<SearchBox updateSearchResults={updateSearchResults}/>
		<Features/>
	</div>);
}

export {
	LandingPage
}
