import React, { useEffect } from 'react';
import './sass/FeatureCard.scss';

const FeatureCard = ({featname}) => {
	const category = featname["category"];
	const path = featname["path"];
	return (<div id={`${category}`} className={`featurecard ${path}`}>
		{category}
	</div>);
}

export {
	FeatureCard
}
