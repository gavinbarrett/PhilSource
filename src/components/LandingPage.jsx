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
		<Footer/>
	</div>);
}

export default LandingPage;
