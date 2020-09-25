import React from 'react';

const Footer = ({updateState}) => {
	
	const home = () => { updateState(0); }

	const signIn = () => { updateState(1); }

	const upload = () => { updateState(2); }

	return (<div id="footer">
		<div className="footcolumn">
			<div className="footerheads">Navigation</div>
			<div className="footerlinks" onClick={home}>Home</div>
			<div className="footerlinks" onClick={upload}>Upload</div>
			<div className="footerlinks" onClick={signIn}>Sign In</div>
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
