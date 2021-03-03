require('dotenv').config();
const fs = require('fs');
const multer = require('multer');
const express = require('express');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const { authUser, signUserUp, signUserIn, signUserOut, retrieveSession } = require('./server/authServer.js');
const { commentOnPost, filterTexts, getPostComments, textQuery, uploadProfile, uploadText } = require('./server/uploadMedia.js');
const { getDocFromDisk, getProfileFromDisk } = require('./server/diskUtilities.js');
const { forgotPassword } = require('./server/passwordRecovery.js');
const db = require('./server/databaseFunctions.js');

const app = express();
const PORT = process.env.PORT || 5000;

// serve from the dist directory
app.use(express.static(__dirname + '/dist'));
// allow json consumption
app.use(express.json({limit: '100mb'}));

// use localhost proxy
app.set('trust proxy', '127.0.0.1')
//FIXME: add `secure: true` to cookie options
app.use(cookieParser(process.env.SERVER_SECRET));

// store files in memory
const upload = multer({ storage: multer.memoryStorage() });

// serve landing page
app.get('/', (req, res) => res.render('index'));
// serve other unauthed content
app.get('/get_text', getDocFromDisk);
app.get('/get_profile', getProfileFromDisk);
app.get('/get_comments', getPostComments);
app.post('/text_query', textQuery);
app.post('/filtertexts', filterTexts);
app.post('/sign_up', signUserUp);
app.post('/sign_in', signUserIn);
app.post('/forgot', forgotPassword);

// serve authed user content
app.get('/get_session', authUser, retrieveSession);
app.put('/upload', upload.single('textfile'), authUser, uploadText);
app.put('/upload_profile', upload.single('profilepic'), authUser, uploadProfile);
app.post('/comment', authUser, commentOnPost);
app.get('/signout', authUser, signUserOut);

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`);
});
