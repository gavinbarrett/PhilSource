import React from 'react';
import { Link } from 'react-router-dom';
import './sass/Footer.scss';

export const Footer = () => {
	
	const scrollToTop = () => {
		// scroll to the top of the Home page
		// FIXME: only scroll to the top if we are on the home screen already
		window.scroll({ top: 0, left: 0, behavior: 'smooth' });
	}

	return (<footer>
		<div className="footcolumn">
			<div className="footerlinkbox">
			<div className="footerheads">PhiloSource</div>
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
		</div>
		<div className="footcolumn">
			<div className="footerlinkbox">
			<div className="footerheads">Info</div>
			<div className="footerlinks">
				<Link to={'/contact'}>Contact</Link>
			</div>
			<div className="footerlinks">
				<Link to={'/privacy'}>Privacy Policy</Link>
			</div>
			<div className="footerlinks">PhiloSource &copy; 2021</div>
			</div>
		</div>
	</footer>);
}
