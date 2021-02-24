import React from 'react';
import { SearchBox } from './SearchBox';
import { Features } from './Features';
import { Categories } from './Categories';
import './sass/SearchBox.scss';

export const LandingPage = ({updateSearchResults, updateFilter}) => {
	return (<div>
		<SearchBox updateSearchResults={updateSearchResults}/>
		<Features updateFilter={updateFilter}/>
	</div>);
}
