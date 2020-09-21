import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import UploadPage from './components/UploadPage';

const App = () => {
	
	const [state, updateState] = useState(0);
	
	let page = '';
	
	if (state === 0)
		page = <LandingPage updateState={updateState}/>;
	else if (state === 1)
		page = <LoginPage/>;
	else if (state === 2)
		page = <UploadPage/>

	return (<>{page}</>);
}

ReactDOM.render(<App/>, document.getElementById('root'));
