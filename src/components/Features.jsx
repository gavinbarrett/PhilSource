import React, { useState } from 'react';
import { FeatureCard } from './FeatureCard';
import { Categories } from './Categories';

const Features = () => {
	
	const [state, changeState] = useState(0);

	const current_feats = ['Feminism', 'Phil. of Science', 'Existentialism', 'Phenomenology', 'Metaphysics', 'Phil. of Mind', 'Logic', 'Metaethics', 'Skepticism'];

	const flipState = () => {
		state ? changeState(0) : changeState(1);
	}

	const handleFeatured = () => {
		console.log("handling featured");
		if (!state) return;
		const feat = document.getElementById('featured');
		const browse = document.getElementById('browseall');
		feat.style.background = '#e0fbfc';
		browse.style.background = '#293241';
		feat.style.color = '#293241';
		browse.style.color = '#e0fbfc';
		flipState();
	}

	const handleBrowse = () => {
		console.log("handling browsing");
		if (state) return;
		const feat = document.getElementById('featured');
		const browse = document.getElementById('browseall');
		feat.style.background = '#293241';
		browse.style.background = '#e0fbfc';
		feat.style.color = '#e0fbfc';
		browse.style.color = '#293241';
		flipState();
	}

	return (<div id="featurewrapper">
	<div id="selector">
		<div id="featured" onClick={handleFeatured}>Featured</div>
		<div id="browseall" onClick={handleBrowse}>Browse All</div>
	</div>
	<div id="features">
		{state ? Categories.map((feature, index) => {
			return <FeatureCard key={index} featname={feature}/>
			}) : current_feats.map((feature, index) => {
				return <FeatureCard key={index} featname={feature}/>;
		})}
	</div>
	</div>);
}

export {
	Features
}
