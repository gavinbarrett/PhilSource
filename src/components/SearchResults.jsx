import React from 'react';
import { Footer } from './Footer';
import { TextPost } from './TextPost';

const SearchResults = ({results, updateDisplayFile, changeFilename}) => {

	return (<><div id="resultswrapper">
		{results["search_results"].map((res, index) => (
			<TextPost key={index} title={res["title"]} user={res["user"]} tags={res["tags"]} file={res["file"]} hash={res["hash"]} updateDisplayFile={updateDisplayFile} changeFilename={changeFilename}/>
		))}
	</div>
	<Footer/>
	</>);
}

export {
	SearchResults
}
