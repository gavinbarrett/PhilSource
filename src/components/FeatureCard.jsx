import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './sass/FeatureCard.scss';

const FeatureCard = ({featname, updateFilter}) => {
	const category = featname["category"];
	const path = featname["path"];
	const history = useHistory();
	const filterTexts = async () => {
		// set filter
		await updateFilter(category);
		// render filter page
		history.push('/subfilter');
	}
	return (<div id={`${category}`} className={`featurecard ${path}`} onClick={filterTexts}>
		{category}
	</div>);
}

export {
	FeatureCard
}
