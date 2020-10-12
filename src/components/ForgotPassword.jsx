import React, { useState } from 'react';
import { Heading } from './Heading';
import { Footer } from './Footer';

const ResetSuccess = ({email, success}) => {
	return (<div className="resetsuccess">
		{success ? `An email has been sent to ${email}. Follow the link provided to reset your password.` : `No account was found associated with the email ${email}`}
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

const ForgotPassword = () => {
	
	const [email, updateEmail] = useState('');
	const [success, updateSuccess] = useState(false);
	const [submitted, updateSubmitted] = useState(null);

	return (<><Heading/>
		<div className="forgotpasswrapper">
			{submitted ? <ResetSuccess email={email} success={success}/> : <EmailInput email={email} updateEmail={updateEmail} updateSubmitted={updateSubmitted} updateSuccess={updateSuccess}/>}
		</div>
	<Footer/></>);
}

export {
	ForgotPassword
}
