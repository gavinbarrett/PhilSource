import React from 'react';
import { Heading } from './Heading';
import { Footer } from './Footer';
import './sass/Heading.scss';
import './sass/Footer.scss';
import './sass/PageNotFound.scss';

const PageNotFound = () => {
	return(<><Heading/>
	<div className="notfound">
		404 Page not found
	</div>
	<Footer/></>);
}

export {
	PageNotFound
}
