import React from 'react';

const FeatureCard = ({featname}) => {
	
	const handleCard = () => {
		console.log(`${featname} card clicked!`);
	}

	return (<div className="featurecard" onClick={handleCard}>
		{featname}
	</div>);
}

export {
	FeatureCard
}
