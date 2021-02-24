import React, { useEffect, useState } from 'react';
import { Heading } from './Heading';
import { Footer } from './Footer';
import { useHistory } from 'react-router-dom';
import './sass/LoginPage.scss';

const Username = ({updateUsername}) => {
	return (<input id="username" type="text" autocomplete={"off"} maxLength={64} onChange={event => updateUsername(event.target.value)}/>);
}

const Password = ({updatePassword}) => {
	return (<input id="password" type="password" autocomplete={"off"} maxLength={64} onChange={event => updatePassword(event.target.value)}/>);
}

const PasswordRetype = ({updateRePassword}) => {
	return (<input id="passwordretype" type="password" autocomplete={"off"} maxLength={64} onChange={event => updateRePassword(event.target.value)}/>);
}

const Emailer = ({updateEmail}) => {
	return (<input id="emailer" type="email" autocomplete={"off"} maxLength={64} onChange={event => updateEmail(event.target.value)}/>);
}

const SignUpBox = ({updateUser}) => {
	const [username, updateUsername] = useState('');
	const [password, updatePassword] = useState('');
	const [rePassword, updateRePassword] = useState('');
	const [email, updateEmail] = useState('');
	const [error, updateError] = useState('');
	const history = useHistory();
	
	const validInput = async () => {
		/* Check the validity of user-supplied sign up credentials */
		return new Promise((resolve, reject) => {
			const alphaRegex = /^[a-z0-9]+$/i;
			const emailRegex = /^[a-z0-9]+@\w+\.\w+/;
			// check that fields are filled out
			if (username === '' || password === '' || rePassword === '' || email === '') {
				updateError(`Please fill out all input fields.`);
				resolve(false);
			// check that passwords match
			} else if (password != rePassword) {
				updateError(`Passwords do not match.`);
				resolve(false);
			} else if (!email.match(emailRegex)) {
				updateError(`Invalid email syntax.`);
				resolve(false);
			// check that username/password is alphanumeric
			} else if (!username.match(alphaRegex)) {
				updateError(`Username must be alphanumeric (a-z, A-Z, 0-9).`);
				resolve(false);
			} else if (!password.match(alphaRegex)) {
				updateError(`Password must be alphanumeric (a-z, A-Z, 0-9).`);
				resolve(false);
			} else if (password.length < 12 || password.length > 48) {
				updateError(`Password length must be between 12 and 48 characters.`);
				resolve(false);
			}
			resolve(true);
		});
		// FIXME: check that username contains numbers and letters and doesn't contain invalid
		// FIXME: check that passwords are a good enough size (12-48) and contain numbers and letters and doesn't contain invalid
	}

	const signup = async () => {
		if (await validInput()) {
			const data = {"user" : username,"pass" : password, "email" : email};
			const resp = await fetch('/sign_up', {method: "POST", headers: {"Content-Type": "application/json"}, credentials: 'same-origin', body: JSON.stringify(data)});
			const response = await resp.json();
			console.log(`New user logged into session: ${response["authed"]}`);
			
			// FIXME: check authed
			// update the logged in user's name
			
			updateUser(response["authed"]);
			// update name of logged in 
			history.push('/');
		} else
			console.log('Invalid input.');
	}

	return (<div className="loginbox">
		{error ? <div className='error'>{error}</div> : ''}
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

const SignInBox = ({updateUser, updateProfile}) => {
	const [username, updateUsername] = useState('');
	const [password, updatePassword] = useState('');
	const [error, updateError] = useState('');
	const history = useHistory();
	
	const forgotPass = () => {
		// render the password retrieval page
		history.push('/forgot');
	}

	const validInput = async () => {
		/* Check the validity of user-supplied credentials */
		return new Promise((resolve, reject) => {
			const alphaRegex = /^[a-z0-9]+$/i;
			// check that fields are filled out
			if (username === '' || password === '') {
				updateError(`Please fill out all fields.`);
				resolve(false);
			// check that username/password is alphanumeric
			} else if (!username.match(alphaRegex)) {
				updateError(`Username must be alphanumeric (A-Z, a-z, 0-9).`);
				resolve(false);
			} else if (!password.match(alphaRegex)) {
				updateError(`Password must be alphanumeric (A-Z, a-z, 0-9).`);
				resolve(false);
			} else if (password.length < 12 || password.length > 48) {
				updateError(`Password length must be between 12 and 48 characters.`);
				resolve(false)
			}
			resolve(true);
		});
	}

	const signin = async () => {
		if (await validInput()) {
			const data = {"user" : username, "pass" : password};
			const resp = await fetch('/sign_in', {method: 'POST', headers: {"Content-Type": "application/json"}, credentials: 'same-origin', body: JSON.stringify(data)});
			const response = await resp.json();
			console.log(response);
			console.log(`Pic response: ${response["picture"]}`);
			if (response && response["authed"]) {
				if (response["picture"] !== "undefined") {
					console.log(`User logged into session: ${response["authed"]}`);
					const picture = response["picture"];
					const url = 'data:image/png;base64,' + picture;
					updateProfile(url);
				}
				updateUser(response["authed"]);
				history.push('/');
			} else {
				console.log('Cannot log in.');
			}
		} else
			console.log('Invalid input.');
	}
	
	/*{"<div className='forgotlink' onClick={forgotPass}>Forgot Password</div>"}*/

	return (<div className="loginbox">
		{error ? <div className='error'>{error}</div> : ''}
		<div className="logintext">Username</div>
		<Username updateUsername={updateUsername}/>
		<div className="logintext">Password</div>
		<Password updatePassword={updatePassword}/>
		<div className="forgotlinkclass">
		</div>
		<button id="submit" type="submit" onClick={signin}>Sign In</button>
	</div>);
}

export const LoginPage = ({updateUser, updateProfile}) => {
	const [state, changeState] = useState(0);
	
	// alternate between SignIn and SignUp components
	const flipState = () => { state ? changeState(0) : changeState(1); }

	const signin = () => {
		// display SignIn component
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
		// display SignUp component
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
		{state ? <SignUpBox updateUser={updateUser}/> : <SignInBox updateUser={updateUser} updateProfile={updateProfile}/>}
		</div>
	</div></>);
}
