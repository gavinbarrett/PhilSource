import React from 'react';
import Heading from './Heading';
import SearchBox from './SearchBox';
import Features from './Features';
import Footer from './Footer';
import Categories from './Categories';

const LandingPage = ({updateState}) => {
	return (<div>
		<Heading updateState={updateState}/>
		<SearchBox/>
		<Features/>
		<Footer updateState={updateState}/>
	</div>);
}

export default LandingPage;
