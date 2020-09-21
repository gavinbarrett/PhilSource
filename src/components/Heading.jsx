import React from 'react';

const AppTitle = () => {
	return (<div id="title">PhiloSource</div>);
}

const Links = ({updateState}) => {
	return (<div id="links">
		<UploadLink updateState={updateState}/> | <SignInLink updateState={updateState}/>
	</div>);
}

const UploadLink = ({updateState}) => {
	// render upload page
	const upload = () => { updateState(2); }

	return (<div id="uploadlink" onClick={upload}>Upload</div>);
}

const SignInLink = ({updateState}) => {
	// render sign in page
	const signin = () => { updateState(1); }

	return (<div id="signinlink" onClick={signin}>Sign In</div>);
}

const Heading = ({updateState}) => {
	return (<div id="heading">
		<AppTitle/>
		<Links updateState={updateState}/>
	</div>);
}

export default Heading;
