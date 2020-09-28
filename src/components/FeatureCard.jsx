import React from 'react';

const FeatureCard = ({featname}) => {
	return (<div className="featurecard" onClick={() => console.log(`${featname} card clicked!`)}>
		{featname}
	</div>);
}

export {
	FeatureCard
}
