import React from 'react';
import { Heading } from './Heading';
import { Footer } from './Footer';
import './sass/Profile.scss'

const Profile = ({user}) => {

	const setProfilePhoto = () => {
		console.log('clicked avatar!');
		// FIXME: get photo from user
		
		// FIXME: set image src to provided photo
	}

	return (<><Heading user={user}/>
	<div id="profile">
		<div id="profilebar">
		<div className="barselect">
			Account
		</div>
		<div className="barselect">
			Settings
		</div>
		</div>
		<div id="profilecontent">
			<img id="largeavatar" src='avatar.jpg' onClick={setProfilePhoto}/>
		<div id="profilename">{user}</div>
		</div>
	</div>
	<Footer/></>);
}

export {
	Profile
}
