import React, { useEffect, useState } from 'react';
import { Heading } from './Heading';
import { Footer } from './Footer';
import { useHistory } from 'react-router-dom';
import './sass/LoginPage.scss';

const Username = ({updateUsername}) => {
	return (<input id="username" type="text" onChange={event => updateUsername(event.target.value)}/>);
}

const Password = ({updatePassword}) => {
	return (<input id="password" type="password" onChange={event => updatePassword(event.target.value)}/>);
}

const PasswordRetype = ({updateRePassword}) => {
	return (<input id="passwordretype" type="password" onChange={event => updateRePassword(event.target.value)}/>);
}

const Emailer = ({updateEmail}) => {
	return (<input id="emailer" type="email" onChange={event => updateEmail(event.target.value)}/>);
}

const SignUpBox = ({updateUser}) => {
	const [username, updateUsername] = useState('');
	const [password, updatePassword] = useState('');
	const [rePassword, updateRePassword] = useState('');
	const [email, updateEmail] = useState('');
	
	const history = useHistory();
	
	const signup = async () => {
		// grab username, password, retyped password, email
		// FIXME: username, password, rePassword, email
		const regex = new RegExp(/\w+@\w+\.\w+/);
		

		// FIXME: throw error if any of these are missing
		// FIXME: enforce requirements for username/password complexity, length, and min/max life
		// FIXME: check for passwords to match
		if (pass != passretyped) return;
		if (!email.match(regex)) {
			console.log('regex does not match');
			return;
		}
		const data = {"user" : username,"pass" : password, "email" : email};
		const resp = await fetch('/sign_up', {method: "POST", headers: {"Content-Type": "application/json"}, credentials: 'same-origin', body: JSON.stringify(data)});
		const response = await resp.json();
		console.log(`New user logged into session: ${response["authed"]}`);
		// update the logged in user's name
		updateUser(response["authed"]);
		// update name of logged in 
		history.push('/');
	}

	return (<div className="loginbox">
		<div id="user" className="logintext">Username</div>
		<Username updateUsername={updateUsername}/>
		<div id="pass" className="logintext">Password</div>
		<Password updatePassword={updatePassword}/>
		<div id="passretype" className="logintext">Retype Password</div>
		<PasswordRetype updateRePassword={updateRePassword}/>
		<div id="email" className="logintext">Email</div>
		<Emailer updateEmail={updateEmail}/>
		<button id="signupbutton" type="submit" onClick={() => signup()}>Sign Up</button>
	</div>);
}

const SignInBox = ({updateUser}) => {
	const [username, updateUsername] = useState('');
	const [password, updatePassword] = useState('');
	const history = useHistory();

	const signin = async () => {
		const data = {"user" : username, "pass" : password};
		const resp = await fetch('/sign_in', {method: 'POST', headers: {"Content-Type": "application/json"}, credentials: 'same-origin', body: JSON.stringify(data)});
		const response = await resp.json();
		console.log(`User logged into session: ${response["authed"]}`);
		updateUser(response["authed"]);
		history.push('/');
	}

	const forgotPass = () => {
		history.push('/forgot');
	}

	return (<div className="loginbox">
		<div className="logintext">Username</div>
		<Username updateUsername={updateUsername}/>
		<div className="logintext">Password</div>
		<Password updatePassword={updatePassword}/>
		<div className="forgotlinkclass">
			<div className="forgotlink" onClick={forgotPass}>Forgot Password</div>
		</div>
		<button id="submit" type="submit" onClick={signin}>Sign In</button>
	</div>);
}

const LoginPage = ({updateUser}) => {
	const [state, changeState] = useState(0);

	const flipState = () => { state ? changeState(0) : changeState(1); }

	const signin = () => {
		if (state === 0) return;
		const si = document.getElementById('signinselect');
		const su = document.getElementById('signupselect');
		const lb = document.getElementsByClassName('loginbox')[0];
		su.style.background = '#3D5A80';
		si.style.background = '#293241';
		//su.style.color = 'black';
		//si.style.color = 'white';
		lb.style.borderRadius = '0px 10px 10px 10px';
		flipState();
	}

	const signup = () => {
		if (state === 1) return;
		const si = document.getElementById('signinselect');
		const su = document.getElementById('signupselect');
		const lb = document.getElementsByClassName('loginbox')[0];
		su.style.background = '#293241';
		si.style.background = '#3D5A80';
		//su.style.color = 'white';
		//si.style.color = 'black';
		lb.style.borderRadius = '10px 10px 10px 10px';
		flipState();
	}

	return (<><div id="loginpagewrapper">
		<div id="boxwrapper">
		<div id="loginselector">
		<div id="signinselect" onClick={signin}>Sign In</div>
		<div id="signupselect" onClick={signup}>Sign Up</div>
		</div>
		{state ? <SignUpBox updateUser={updateUser}/> : <SignInBox updateUser={updateUser}/>}
		</div>
	</div></>);
}

export {
	LoginPage
}
