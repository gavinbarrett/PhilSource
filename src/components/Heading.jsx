import React from 'react';

const AppTitle = () => {
	return (<div id="title">PhilSource</div>);
}

const Links = () => {
	return (<div id="links">
		<UploadLink/> | <SignInLink/>
	</div>);
}

const UploadLink = () => {
	return (<div id="uploadlink">Upload</div>);
}

const SignInLink = () => {
	return (<div id="signinlink">Sign In</div>);
}

const Heading = () => {
	return (<div id="heading">
		<AppTitle/>
		<Links/>
	</div>);
}

export default Heading;
