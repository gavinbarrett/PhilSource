import React, { useEffect } from 'react';
import './sass/FeatureCard.scss';

const FeatureCard = ({featname}) => {

	const category = featname["category"];
	const path = featname["path"];

	console.log(category);
	console.log(path);

	return (<div id={`${category}`} className={`featurecard ${path}`} onClick={() => console.log(`${featname} card clicked!`)}>
		{category}
	</div>);
}

export {
	FeatureCard
}
