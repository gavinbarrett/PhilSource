import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TextPost } from './TextPost';
import { SearchBox } from './SearchBox';
import './sass/SearchResults.scss';

export const SearchResults = ({user, results, changeFilename, updateHash, updateSearchResults}) => {
	const [loc, updateLocation] = React.useState(useLocation());

	useEffect(() => {
		getPathInfo();
	}, []);

	const getPathInfo = async () => {
		const path = loc.pathname.split('/');
		const input = path[path.length - 1];
		const resp = await fetch('/text_query', {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify({"tag": input})});
		const res = await resp.json();
		if (res.search_results.rows.length === 0) return;
		// update search results
		updateSearchResults(res.search_results.rows);
	}
	
	return (<div id="resultswrapper">
		<SearchBox updateSearchResults={updateSearchResults}/>
		<div className="post-results">
			{(results && results.length) ? results.map((res, index) => (
				<TextPost key={index} title={res["title"]} user={res["user"]} tags={res["tags"]} file={res["file"]} hash={res["hash"]} changeFilename={changeFilename} updateHash={updateHash}/>
			)) : <div id="nores">{"No results found"}</div>}
		</div>
	</div>);
}
