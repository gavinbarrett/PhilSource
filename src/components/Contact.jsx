import React from 'react';
import './sass/Contact.scss';

const Emailer = () => {
	return (<div className='emailer'>
		{"If you need to contact us, please email us at philsource247@gmail.com"}
	</div>);
}

const SourceCode = () => {
	return (<div className='sourcecode'>
		{"If you'd like to check out the source code, please view our "}<a href='https://github.com/gavinbarrett/PhiloSource'>Github repo.</a>
	</div>);
}

const Contact = () => {
	return (<div className='contactpage'>
		<Emailer/>
		<SourceCode/>
	</div>);
}

export {
	Contact
}
