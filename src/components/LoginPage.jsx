import React from 'react';

const Username = () => {
	return (<input id="username" type="text"/>);
}

const Password = () => {
	return (<input id="password" type="password"/>);
}

const SubmitSignIn = () => {
	return (<button id="submit" type="submit">Sign In</button>);
}

const LoginPage = () => {
	return (<div id="loginpagewrapper">
		<div id="loginbox">
			<Username/>
			<Password/>
			<SubmitSignIn/>
		</div>
	</div>);
}

export default LoginPage;
