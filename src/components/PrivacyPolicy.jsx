import React from 'react';
import './sass/PrivacyPolicy.scss';

const PrivacyPolicy = () => {
	return (<><div className="privacypolicybox">
		<div>
		<p className="policyHeader">{"Who we are"}</p>
		<p className="policy">{"PhiloSource is an open source community for sharing philosophical literature and facilitating philosophical discussions. The main features of this site are 1) uploading appropriate PDF files to our server(s), 2) searching through these files with various filters, 3) viewing the PDFs in your browser, 4) downloading these PDFs, and 5) leaving comments beneath these PDF posts to engage with others."}</p>
		</div>
		<div>
		<p className="policyHeader">{"What we do with your data"}</p>
		<p className="policy">{"We use your data to 1) authenticate your credentials when you log in, 2) keep you logged into a session until it expires or you sign out, 3) authenticate actions such as signing in, uploading texts, and commenting on posts, 4) send you a link to recover your email if you forgot it, 5) send you updates about our website's features and policies."}</p>
		</div>
		<div>
		<p className="policyHeader">{"What happens when you use our website"}</p>
		<p className="policy">{"When you sign up for an account on PhiloSource, we only require that you choose an appropriate username and password and provide an email address. When you log into our website, we will authenticate your username and password against our database and establish a session for you. You will be given a cookie that your browser will use to help keep you logged into your session and allow you to perform user actions."}</p>
		</div>
	</div></>);
}

export {
	PrivacyPolicy
}
