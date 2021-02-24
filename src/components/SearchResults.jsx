import React from 'react';
import { TextPost } from './TextPost';
import { SearchBox } from './SearchBox';
import './sass/SearchResults.scss';

const SearchResults = ({user, results, changeFilename, updateHash, updateSearchResults}) => {
	console.log(`Results: ${results}`);
	return (<><div id="resultswrapper">
		{(results && results.length) ? results.map((res, index) => (
			<TextPost key={index} title={res["title"]} user={res["user"]} tags={res["tags"]} file={res["file"]} hash={res["hash"]} changeFilename={changeFilename} updateHash={updateHash}/>
		)) : <div id="nores">{"No results found"}</div>}
		<SearchBox updateSearchResults={updateSearchResults}/>
	</div></>);
}

export {
	SearchResults
}
