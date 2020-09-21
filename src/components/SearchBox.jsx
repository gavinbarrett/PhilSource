import React from 'react';

const SearchInput = () => {
	return (<div id="searchinput">
		<input type="text" placeholder="search for texts here"/>
	</div>);
}

const SearchBox = () => {
	return (<div id="searchwrapper">
		<div id="searchbox">
			<SearchInput/>
		</div>
	</div>);
}

export default SearchBox;
