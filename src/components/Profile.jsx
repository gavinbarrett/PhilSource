import React, { useState } from 'react';
import './sass/Profile.scss'

const ProfileLandingPage = ({user, profile}) => {
		return (<div className="profileimage">
			<label for='file-input'>
				{profile ? <img id='largeavatar' src={profile} accept='image/*'/> : <img id='largeavatar' src="avatar.jpg" accept='image/*'/>}
			</label>
			<input id='file-input' type='file' name='profilepic' /*onChange={loadFile}*//>
		<div id="profilename">{user}</div>
		</div>);
}

const Profile = ({user, profile, updateProfile}) => {

	const loadFile = async event => {
		/* Load */
		const file = event.target.files[0];
		const formData = new FormData();
		// add the profile picture to the form
		formData.append('profilepic', file);
		// send the picture to the server
		const resp = await fetch('/upload_profile', {method: 'PUT', body: formData});
		const r = await resp.json();
		if (r["status"] == "success") {
			const blob = new Blob([file], {"type" : "application/image"});
			const url = URL.createObjectURL(blob);
			await updateProfile(url);
		} else
			console.log("Couldn't change profile pic");
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
		<ProfileLandingPage user={user} profile={profile}/>
	</div></>);
}

export {
	Profile
}
