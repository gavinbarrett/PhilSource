import React, { useEffect } from 'react';

const FeatureCard = ({featname}) => {

	const category = featname["category"];
	const path = featname["path"];
	console.log(category, path);
	
	useEffect(() => {
		console.log(category);
		const elem = document.getElementById(category);
		elem.style.background = `url("${path}")`;
	});

	return (<div id={`${category}`} className="featurecard" onClick={() => console.log(`${featname} card clicked!`)}>
		{category}
	</div>);
}

export {
	FeatureCard
}
