import React from 'react';
import { Link } from 'react-router-dom';
import './sass/Footer.scss';

const Footer = () => {
	
	const scrollToTop = () => {
		// scroll to the top of the Home page
		// FIXME: only scroll to the top if we are on the home screen already
		window.scroll({ top: 0, left: 0, behavior: 'smooth' });
	}

	return (<footer>
		<div className="footcolumn">
			<div className="footerheads">Navigation</div>
			<div className="footerlinks">
				<Link to={'/'} onClick={scrollToTop}>Home</Link>
			</div>
			<div className="footerlinks">
				<Link to={'/upload'}>Upload</Link>
			</div>
			<div className="footerlinks">
				<Link to={'/signin'}>Sign In</Link>
			</div>
		</div>
		<div className="footcolumn">
			<div className="footerheads">About</div>
			<div className="footerlinks">Use</div>
			<div className="footerlinks">Help</div>
		</div>
		<div className="footcolumn">
			<div className="footerheads">Development</div>
			<div className="footerlinks"><a href="https://github.com/gavinbarrett/PhiloSource">Code</a></div>
			<div className="footerlinks">Contact</div>
			<div className="footerlinks"><a href="https://github.com/gavinbarrett/PhiloSource/pulls">Contribute</a></div>
		</div>
	</footer>);
}

export {
	Footer
}
