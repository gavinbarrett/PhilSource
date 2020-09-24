import React, { useState } from 'react';

const SearchInput = ({updateState, updateSearchResults}) => {

	const [input, updateInput] = useState('');

	const filterInput = async (event) => {
		//FIXME: pull texts from the database
		console.log(event.target.value);
		await updateInput(event.target.value);
		// call fetch to get list of database entries matching the input
	}

	const filterSearch = async () => {
		if (input === '') return;
		const resp = await fetch('/text_query', {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify({"query": input})});
		let res = await resp.json();
		
		await updateSearchResults(res);
		// FIXME: update search results
		await updateState(4);
		// FIXME: change page to search display page
	}

	return (<div id="searchinput">
		<input type="text" placeholder="search for titles and metadata tags of texts here" onChange={filterInput}/>
		<button onClick={filterSearch}>Search</button>
	</div>);
}

const SearchBox = ({updateState, updateSearchResults}) => {
	return (<div id="searchwrapper">
		<div id="searchbox">
			<SearchInput updateState={updateState} updateSearchResults={updateSearchResults}/>
		</div>
	</div>);
}

export {
	SearchBox
}
