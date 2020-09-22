import React, { useState } from 'react';

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

const SignUpBox = () => {
	
	const signup = async () => {

		// grab username, password, retyped password, email
		const user = document.getElementById('username').value;
		const pass = document.getElementById('password').value;
		const passretyped = document.getElementById('passwordretype').value;
		const email = document.getElementById('emailer').value;
		// FIXME: throw error if any of these are missing
		// FIXME: enforce requirements for username/password length and constitution
		// FIXME: check for passwords to match
		if (pass != passretyped) return;
		
		const data = {"user": user,"pass": pass, "email": email};

		const resp = await fetch('/sign_up', {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)});
		console.log(resp);
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

const SignInBox = () => {

	const signin = () => {
		const user = document.getElementById('username').value;
		const pass = document.getElementById('password').value;
		const data = {"user": user, "pass": pass};
		const resp = fetch('/sign_in', {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)});
		console.log(resp);
	}

	return (<div className="loginbox">
		<div className="logintext">Username</div>
		<Username/>
		<div className="logintext">Password</div>
		<Password/>
		<button id="submit" type="submit" onClick={signin}>Sign In</button>
	</div>);
}

const LoginPage = () => {
	
	const [state, changeState] = useState(0);

	const flipState = () => {
		state ? changeState(0) : changeState(1);
	}

	const signin = () => {
		if (state === 0) return;
		const si = document.getElementById('signinselect');
		const su = document.getElementById('signupselect');
		const lb = document.getElementsByClassName('loginbox')[0];
		si.style.background = '#E0FBFC';
		su.style.background = '#293241';
		lb.style.borderRadius = '0px 10px 10px 10px';
		flipState();
	}

	const signup = () => {
		if (state === 1) return;
		const si = document.getElementById('signinselect');
		const su = document.getElementById('signupselect');
		const lb = document.getElementsByClassName('loginbox')[0];
		si.style.background = '#293241';
		su.style.background = '#E0FBFC';
		lb.style.borderRadius = '10px 10px 10px 10px';
		flipState();
	}

	return (<div id="loginpagewrapper">
		<div id="boxwrapper">
		<div id="loginselector">
		<div id="signinselect" onClick={signin}>Sign In</div>
		<div id="signupselect" onClick={signup}>Sign Up</div>
		</div>
		{state ? <SignUpBox/> : <SignInBox/>}
		</div>
	</div>);
}

export default LoginPage;
