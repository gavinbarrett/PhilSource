import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Link, useHistory } from 'react-router-dom';

const AppTitle = () => {
	// Link to home page
	return (<div id="title">
		<Link to='/'>PhiloSource</Link>
	</div>);
}

const ProfileDetail = ({user, toggle}) => {
	
	const history = useHistory();

	useEffect(() => {
		document.getElementById("profilecard2").addEventListener("mouseleave", toggle);
	}, []);

	return (<div id="profilecard2" onClick={ () => history.push('/profile') }>
		<div id="avatarcard">
		<img id="avatar" src="avatar.jpg"/>
		<div id="cardname">{user}</div>
		</div>
	</div>);
}

const ProfileCard = ({user}) => {
	
	const [button, updateButton] = useState(0);

	useEffect(() => {
		document.getElementById("profilecard").addEventListener("mouseover", toggle);
	}, []);
	
	const toggle = async () => {
		console.log('toggling');
		button ? updateButton(0) : updateButton(1);
	}

	return (<div id="profilecard">
		{button ? <ProfileDetail user={user} toggle={toggle}/> : user}
	</div>);
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
