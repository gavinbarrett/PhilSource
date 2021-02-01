import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const SearchInput = ({updateSearchResults}) => {
	const [input, updateInput] = useState('');
	const [suggestions, updateSuggestions] = useState([]);
	const history = useHistory();

	useEffect(() => {
		document.addEventListener('keydown', checkQuery);
	}, []);

	const checkQuery = async (e) => {
		const searchbox = document.getElementById('searchinputbox');
		if ((document.activeElement === searchbox) && (e.code === 'Enter'))
			await filterSearch();
	}

	const filterInput = async (event) => {
		// persist keyDown event
		event.persist();
		// check if input is valid (alphanumeric)
		if (!await validInput(event.target.value)) return;
		if (event.target.value === '') return;
		// persist event in async function
		// update the input value for search button queries
		await updateInput(event.target.value);
		// call fetch to get a list of database entries matching the input
		const resp = await fetch('/text_query', {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify({"tag": event.target.value})});
		// return the objects
		const res = await resp.json();
		console.log(res["search_results"]);
		if (!res["search_results"]) return;
		const titles = Array.from(res["search_results"]["rows"], res => res["title"]);
		const uniq = [...new Set(titles)];
		// FIXME: if titles > 10, take a slice of the first 10
		// update search suggestion box
		await updateSuggestions(uniq);
	}

	const validInput = async (inp) => {
		return new Promise((resolve, reject) => {
			if (inp === '') resolve(false);
			const alphaRegex = /^[a-z0-9\s]+$/i;
			if (!inp.match(alphaRegex)) resolve(false);
			resolve(true);
		});
	}

	const filterSearch = async () => {
		// check that input is valid
		if (!await validInput(input)) return;
		const resp = await fetch('/text_query', {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify({"tag": input})});
		let res = await resp.json();
		if (res.search_results.rows.length === 0) return;
		console.log(`Filtered Documents: ${res.search_results.rowAsArray}`);
		// update search results
		await updateSearchResults(res.search_results);
		// change page to search display page
		history.push('/searchresults');
	}

	return (<div id="searchinput">
		<input id="searchinputbox" list="suggs" type="text" placeholder="search for titles and metadata tags of texts here" onChange={filterInput}/>
		<datalist id="suggs">
			{suggestions.map((sug, index) => {
				return <option key={index} value={sug}/>
			})}
		</datalist>
		<button className="querybutton" onClick={filterSearch}>Search</button>
	</div>);
}

const SearchBox = ({updateSearchResults}) => {
	return (<div id="searchwrapper">
		<div id="searchbox">
			<SearchInput updateSearchResults={updateSearchResults}/>
		</div>
	</div>);
}

export {
	SearchBox
}
