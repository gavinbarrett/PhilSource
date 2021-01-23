import React, { useEffect } from 'react';
import './sass/SubFilter.scss';

const SubFilter = ({filter}) => {
	
	useEffect(() => {
		// download the first page of texts from the filtered subdiscipline
		filterTexts(filter);
	}, []);

	const filterTexts = async (filter) => {
		const resp = await fetch('/filtertexts', {method: 'POST'}, headers: {'Content-Type': 'application/json'}, body: JSON.stringify({"filter": filter}));
		console.log(resp);
	}

	return (<div className='subfilterwrapper'>
		{"This is a subfilter"}
	</div>);
}

export {
	SubFilter
}
