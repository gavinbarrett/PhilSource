import React, { useState } from 'react';
import { Heading } from './Heading';
import { Footer } from './Footer';
import { useHistory } from 'react-router-dom';
import './sass/LoginPage.scss';

const Username = () => {
	return (<input id="username" type="text"/>);
}

const Password = () => {
	return (<input id="password" type="password"/>);
}

const PasswordRetype = () => {
	return (<input id="passwordretype" type="password"/>);
}

const SubmitSignIn = () => {
}

const Emailer = () => {
	return (<input id="emailer" type="text"/>);
}

const SignUpBox = ({updateUser, updateToken}) => {
	
	const history = useHistory();
	
	const signup = async () => {

		// grab username, password, retyped password, email
		const user = document.getElementById('username').value;
		const pass = document.getElementById('password').value;
		const passretyped = document.getElementById('passwordretype').value;
		const email = document.getElementById('emailer').value;
		const regex = new RegExp(/\w+@\w+\.\w+/);
		// FIXME: throw error if any of these are missing
		// FIXME: enforce requirements for username/password length and constitution
		// FIXME: check for passwords to match
		if (pass != passretyped) return;

		if (!email.match(regex)) {
			console.log('regex does not match');
			return;
		}

		const data = {"user": user,"pass": pass, "email": email};

		const resp = await fetch('/sign_up', {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)});
		const response = await resp.json();
		console.log(response);
		// update jwtoken for the one logged in
		updateUser(response["user"]);
		updateToken(response["token"]);
		// update name of logged in 
		history.push('/');
	}

	return (<div className="loginbox">
		<div id="user" className="logintext">Username</div>
		<Username/>
		<div id="pass" className="logintext">Password</div>
		<Password/>
		<div id="passretype" className="logintext">Retype Password</div>
		<PasswordRetype/>
		<div id="email" className="logintext">Email</div>
		<Emailer/>
		<button id="signupbutton" type="submit" onClick={() => signup()}>Sign Up</button>
	</div>);
}

const SignInBox = ({updateUser, updateToken}) => {
	
	const history = useHistory();

	const signin = async () => {
		const user = document.getElementById('username').value;
		const pass = document.getElementById('password').value;
		const data = {"user": user, "pass": pass};
		const resp = await fetch('/sign_in', {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)});
		const response = await resp.json();
		updateUser(response["user"]);
		updateToken(response["token"]);
		history.push('/');
	}

	const forgotPass = () => {
		history.push('/forgot');
	}

	return (<div className="loginbox">
		<div className="logintext">Username</div>
		<Username/>
		<div className="logintext">Password</div>
		<Password/>
		<div className="forgotlink" onClick={forgotPass}>
			Forgot Password
		</div>
		<button id="submit" type="submit" onClick={signin}>Sign In</button>
	</div>);
}

const LoginPage = ({updateUser, updateToken}) => {
	
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

	return (<><Heading/>
	<div id="loginpagewrapper">
		<div id="boxwrapper">
		<div id="loginselector">
		<div id="signinselect" onClick={signin}>Sign In</div>
		<div id="signupselect" onClick={signup}>Sign Up</div>
		</div>
		{state ? <SignUpBox updateUser={updateUser} updateToken={updateToken}/> : <SignInBox updateUser={updateUser} updateToken={updateToken}/>}
		</div>
	</div>
	<Footer/></>);
}

export {
	LoginPage
}
