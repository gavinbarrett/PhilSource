import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Link, useHistory } from 'react-router-dom';
import './sass/Heading.scss';

const AppTitle = () => {
	// Link to home page
	return (<div id="title">
		<Link to='/'>PhiloSource</Link>
	</div>);
}

const ProfileDetail = ({user, updateUser, toggle, profile, updateProfile}) => {
	const history = useHistory();

	const signOut = async () => {
		// log user out of auth cache
		const resp = await fetch('/signout', {method: 'GET'});
		// log user out of ui
		updateUser(null);
		updateProfile(null);
		// return to home page
		history.push('/');
	}

	return (<div id="profilecard2" onMouseLeave={() => toggle()}>
		<div id="avatarcard">
		{profile ? <img id="avatar" src={profile} onClick={() => history.push('/profile')}/> : <img id="avatar" src="avatar.jpg" onClick={() => history.push('/profile')}/>}
		<div id="cardname">{user}</div>
		<div id="signout" onClick={signOut}>Sign Out</div>
		</div>
	</div>);
}

const ProfileCard = ({user, updateUser, profile, updateProfile}) => {
	const [button, updateButton] = useState(0);
	const toggle = async () => {
		button ? updateButton(0) : updateButton(1);
	}
	return (<div id="profilecard" onMouseEnter={() => toggle()}>
		{button ? <ProfileDetail user={user} updateUser={updateUser} toggle={toggle} profile={profile} updateProfile={updateProfile}/> : user}
	</div>);
}

const Links = ({user, updateUser, profile, updateProfile}) => {
	return (<div id="links">
		<UploadLink/>
		<div className="vrwrapper">
			<div className="vr"/>
		</div>
		{user ? <ProfileCard user={user} updateUser={updateUser} profile={profile} updateProfile={updateProfile}/> : <SignInLink/>}
	</div>);
}

const UploadLink = () => {
	// Link to upload page
	return (<Link id='uploadlink' to='/upload'>Upload</Link>);
}

const SignInLink = () => {
	// render sign in page
	return (<Link id='signinlink' to='/signin'>Sign In</Link>);
}

export const Heading = ({user, updateUser, profile, updateProfile}) => {
	return (<header>
		<AppTitle/>
		<Links user={user} updateUser={updateUser} profile={profile} updateProfile={updateProfile}/>
	</header>);
}
