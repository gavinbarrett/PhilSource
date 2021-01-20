import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Link, useHistory } from 'react-router-dom';
import './sass/Heading.scss';

const AppTitle = () => {
	// Link to home page
	return (<div id="title">
		<Link to='/'>PhiloSource</Link>
	</div>);
}

const ProfileDetail = ({user, toggle}) => {
	const history = useHistory();
	return (<div id="profilecard2" onMouseLeave={() => toggle()} onClick={ () => history.push('/profile') }>
		<div id="avatarcard">
		<img id="avatar" src="avatar.jpg"/>
		<div id="cardname">{user}</div>
		</div>
	</div>);
}

const ProfileCard = ({user}) => {
	
	const [button, updateButton] = useState(0);

	const toggle = async () => {
		button ? updateButton(0) : updateButton(1);
	}

	return (<div id="profilecard" onMouseEnter={() => toggle()}>
		{button ? <ProfileDetail user={user} toggle={toggle}/> : user}
	</div>);
}

const Links = ({user}) => {
	return (<div id="links">
		<UploadLink/>
		<div className="vrwrapper">
			<div className="vr"/>
		</div>
		{user ? <ProfileCard user={user}/> : <SignInLink/>}
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

const Heading = ({user}) => {
	return (<header>
		<AppTitle/>
		<Links user={user}/>
	</header>);
}

export {
	Heading
}
