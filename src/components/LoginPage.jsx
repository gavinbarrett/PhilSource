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
	return (<button id="submit" type="submit">Sign In</button>);
}

const Emailer = () => {
	return (<input id="emailer" type="text"/>);
}

const SignUpBox = () => {
	return (<div className="loginbox">
		<div className="logintext">Username</div>
		<Username/>
		<div className="logintext">Password</div>
		<Password/>
		<div className="logintext">Retype Password</div>
		<PasswordRetype/>
		<div className="logintext">Email</div>
		<Emailer/>
		<button id="signupbutton" type="submit">Sign Up</button>
	</div>);
}

const SignInBox = () => {

	return (<div className="loginbox">
		<div className="logintext">Username</div>
		<Username/>
		<div className="logintext">Password</div>
		<Password/>
		<SubmitSignIn/>
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
