import React from 'react';

const SearchInput = () => {

	const filterSearch = (event) => {
		//FIXME: pull texts from the database

		console.log(event.target.value);
	}

	return (<div id="searchinput">
		<input type="text" placeholder="search for titles and metadata tags of texts here" onChange={filterSearch}/>
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
