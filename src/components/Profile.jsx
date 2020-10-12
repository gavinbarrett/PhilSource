import React from 'react';
import { Heading } from './Heading';
import { Footer } from './Footer';

const Profile = ({user}) => {
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
		<img id="largeavatar" src='avatar.jpg'/>
		<div id="profilename">{user}</div>
		</div>
	</div>
	<Footer/></>);
}

export {
	Profile
}
