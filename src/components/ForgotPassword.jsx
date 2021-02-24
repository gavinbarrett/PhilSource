import React, { useState } from 'react';
import { Heading } from './Heading';
import { Footer } from './Footer';
import './sass/ForgotPassword.scss';

const ResetSuccess = ({email, success}) => {
	return (<div className="resetsuccess">
		{`An email has been sent to ${email} if an associated account exists. Follow the link provided to reset your password.`}
	</div>);
}

const EmailInput = ({email, updateEmail, updateSubmitted, updateSuccess}) => {
	
	const update = async (event) => {
		await updateEmail(event.target.value);
	}
	
	const sendRecoveryEmail = async () => {
		const resp = await fetch('/forgot', {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify({"email": email})})
		const data = await resp.json();
		if (data["status"] === "success") await updateSuccess(true);
		await updateSubmitted(true);
		// if successful, send to view page which informs the user of the 
	}

	return (<div className="forgotemail">
		<input className="femail" placeholder="Enter your email here" onChange={update}/>
		<button className="emailbutton" onClick={sendRecoveryEmail}>Send Password Reset</button>
	</div>);
}

export const ForgotPassword = () => {
	
	const [email, updateEmail] = useState('');
	const [success, updateSuccess] = useState(false);
	const [submitted, updateSubmitted] = useState(null);

	return (<><div className="forgotpasswrapper">
			{submitted ? <ResetSuccess email={email} success={success}/> : <EmailInput email={email} updateEmail={updateEmail} updateSubmitted={updateSubmitted} updateSuccess={updateSuccess}/>}
		</div></>);
}
