import React, { useEffect } from 'react';
import './sass/FeatureCard.scss';

const FeatureCard = ({featname}) => {

	const category = featname["category"];
	const path = featname["path"];
	
	useEffect(() => {
		const elem = document.getElementById(category);
		elem.style.background = `url('./sass/assets/feminism.jpg')`;
	});

	return (<div id={`${category}`} className="featurecard" onClick={() => console.log(`${featname} card clicked!`)}>
		{category}
	</div>);
}

export {
	FeatureCard
}
