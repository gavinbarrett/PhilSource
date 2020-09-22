import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import UploadPage from './components/UploadPage';
import PDFRenderer from './components/PDFRenderer';

const App = () => {

	const [state, updateState] = useState(0);
	const [displayFile, updateDisplayFile] = useState(null);

	let page = '';

	if (state === 0)
		page = <LandingPage updateState={updateState}/>;
	else if (state === 1)
		page = <LoginPage/>;
	else if (state === 2)
		page = <UploadPage updateState={updateState} updateDisplayFile={updateDisplayFile}/>
	else if (state === 3)
		page = <PDFRenderer file={displayFile}/>
	return (<>{page}</>);
}

ReactDOM.render(<App/>, document.getElementById('root'));
