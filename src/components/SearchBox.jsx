import React, { useEffect, useState } from 'react';

const SearchInput = ({updateState, updateSearchResults}) => {

	const [input, updateInput] = useState('');
	const [suggestions, updateSuggestions] = useState([]);

	useEffect(() => {
		document.addEventListener('keydown', checkQuery);
	}, []);

	const checkQuery = async (e) => {
		const searchbox = document.getElementById('searchinputbox');
		if ((document.activeElement === searchbox) && (e.code === 'Enter'))
			await filterSearch();
	}

	const filterInput = async (event) => {
		if (event.target.value === '') return;
		// persist event in async function
		event.persist();
		// update the input value for search button queries
		await updateInput(event.target.value);
		// call fetch to get a list of database entries matching the input
		const resp = await fetch('/text_query', {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify({"query": event.target.value})});
		// return the objects
		const res = await resp.json();
		console.log(res);
		// update search suggestion box
		await updateSuggestions(res["search_results"]);
	}

	const filterSearch = async () => {
		console.log(input);
		if (input === '') return;
		const resp = await fetch('/text_query', {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify({"query": input})});
		let res = await resp.json();
		// update search results
		await updateSearchResults(res);
		// change page to search display page
		await updateState(4);
	}

	return (<div id="searchinput">
		<input id="searchinputbox" list="suggs" type="text" placeholder="search for titles and metadata tags of texts here" onChange={filterInput}/>
		<datalist id="suggs">
			{suggestions.map((sug, index) => {
				return <option key={index} value={sug["title"]}/>
			})}
		</datalist>
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
