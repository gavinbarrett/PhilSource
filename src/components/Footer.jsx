import React from 'react';
import { Link } from 'react-router-dom';
import './sass/Footer.scss';

const Footer = () => {
	
	return (<div id="footer">
		<div className="footcolumn">
			<div className="footerheads">Navigation</div>
			<div className="footerlinks">
				<Link to={'/'}>Home</Link>
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
		</div>
	</div>);
}

export {
	Footer
}
