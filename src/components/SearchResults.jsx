import React from 'react';
import { Heading } from './Heading';
import { Footer } from './Footer';
import { TextPost } from './TextPost';
import { SearchBox } from './SearchBox';
import './sass/SearchResults.scss';

const SearchResults = ({user, results, updateDisplayFile, changeFilename, updateHash, updateSearchResults}) => {
	return (<><Heading user={user}/>
	<div id="resultswrapper">
		{results.length ? results.map((res, index) => (
			<TextPost key={index} title={res["title"]} user={res["user"]} tags={res["tags"]} file={res["file"]} hash={res["hash"]} updateDisplayFile={updateDisplayFile} changeFilename={changeFilename} updateHash={updateHash}/>
		)) : <div id="nores">{"No results found"}</div>}
		<SearchBox updateSearchResults={updateSearchResults}/>
	</div>
	<Footer/>
	</>);
}

export {
	SearchResults
}
