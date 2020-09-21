import React from 'react';
import ReactDOM from 'react-dom';
import Heading from './components/Heading'
import SearchBox from './components/SearchBox';
import Features from './components/Features';

const App = () => {
	return (<div>
		<Heading/>
		<SearchBox/>
		<Features/>
	</div>);
}

ReactDOM.render(<App/>, document.getElementById('root'));
