import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './sass/FeatureCard.scss';

export const FeatureCard = ({featname, updateFilter}) => {
	const category = featname["category"];
	const path = featname["path"];
	const history = useHistory();
	const filterTexts = () => {
		// set filter
		updateFilter(category);
		// render filter page
		history.push(`/subfilter/${category}`);
	}
	return (<div className={`featurecard`} onClick={filterTexts}>
		<div className={`feature-image ${path}`}>
			{category}
		</div>
	</div>);
}
