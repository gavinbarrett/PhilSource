import React from 'react';
import { BrowserRouter as Router, Link, useHistory, useRouteMatch } from 'react-router-dom';

const AppTitle = () => {
	// Link to home page
	return (<div id="title">
		<Link to='/'>PhiloSource</Link>
	</div>);
}

const ProfileCard = ({user}) => {
	return (<div id="signinlink">{user}</div>);
}

const Links = ({user}) => {
	return (<div id="links">
		<UploadLink/> | {user ? <ProfileCard user={user}/> : <SignInLink/>}
	</div>);
}

const UploadLink = () => {
	// Link to upload page
	return (<div id="uploadlink">
		<Link to='/upload'>Upload</Link>
	</div>);
}

const SignInLink = () => {
	// render sign in page
	return (<div id="signinlink">
		<Link to='/login'>Sign In</Link>
	</div>);
}

const Heading = ({user}) => {
	return (<div id="heading">
		<AppTitle/>
		<Links user={user}/>
	</div>);
}

export {
	Heading
}
