import React, { useState } from 'react';
import './sass/Profile.scss'

const User = () => {
	return(<div className="profile-icon">
		<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <circle cx="12" cy="7" r="4" />
  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
</svg>
	</div>);
}

const Settings = () => {
	return (<div className="profile-icon">
		<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-adjustments-horizontal" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
	  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
	  <circle cx="14" cy="6" r="2" />
	  <line x1="4" y1="6" x2="12" y2="6" />
	  <line x1="16" y1="6" x2="20" y2="6" />
	  <circle cx="8" cy="12" r="2" />
	  <line x1="4" y1="12" x2="6" y2="12" />
	  <line x1="10" y1="12" x2="20" y2="12" />
	  <circle cx="17" cy="18" r="2" />
	  <line x1="4" y1="18" x2="15" y2="18" />
	  <line x1="19" y1="18" x2="20" y2="18" />
	</svg>
	</div>);
}

const ProfileLandingPage = ({user, profile, updateProfile}) => {
	const loadFile = async event => {
		/* Load */
		const file = event.target.files[0];
		const formData = new FormData();
		// add the profile picture to the form
		formData.append('profilepic', file);
		// send the picture to the server
		const resp = await fetch('/upload_profile', {method: 'PUT', body: formData});
		const r = await resp.json();
		// FIXME: retrieve hash from profile photo upload, send hash to getProfileFromDisk to download photo
		if (r["status"] == "success") {
			const blob = new Blob([file], {"type" : "application/image"});
			const url = URL.createObjectURL(blob);
			await updateProfile(url);
		} else
			console.log("Couldn't change profile pic");
	}

	return (<div className="profileimage">
		<label for='file-input' className="profile-pic-container">
			{profile ? <img id='largeavatar' src={profile} accept='image/*'/> : <img id='largeavatar' src="avatar.jpg" accept='image/*'/>}
		</label>
		<input id='file-input' type='file' name='profilepic' onChange={loadFile}/>
	<div id="profilename">{user}</div>
	</div>);
}

export const Profile = ({user, profile, updateProfile}) => {
	return (<><div id="profile">
		<div id="profilebar">
		<div className="barselect">
			<User/>
		</div>
		<div className="barselect">
			<Settings/>
		</div>
		</div>
		<ProfileLandingPage user={user} profile={profile} updateProfile={updateProfile}/>
	</div></>);
}
