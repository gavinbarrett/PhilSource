import React from 'react';
import './sass/Profile.scss'

const Profile = ({user}) => {

	const setProfilePhoto = () => {
		console.log('clicked avatar!');
	}

	return (<><div id="profile">
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
	</div></>);
}

export {
	Profile
}
