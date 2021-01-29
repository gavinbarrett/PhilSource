const nodemailer = require('nodemailer');
const db = require('./databaseFunctions.js');

exports.forgotPassword = async (req, res) => {
	// FIXME: add input validation
	/* send the user a password recovery email */
	const { email } = req.body;
	const query = 'select * from users where email=$1';
	const values = [email];
	// search for the user's email in the user table
	const resp = await new Promise((resolve, reject) => {
		db.query(query, values, (err, rows) => {
			if (err || !rows.length) resolve(false);
			resolve(true);
		})
	});
	// send an email if the email address was in the database
	if (resp) sendPasswordRecoverLink(email);
	resp ? res.send(JSON.stringify({"status" : "success"})) : res.send(JSON.stringify({"status" : "failure"}));
};

const sendPasswordRecoverLink = async (recipient) => {
	// send a password recovery link
	let transporter = nodemailer.createTransport({
		service: "gmail",
    	secure: true,
		auth: {
    	  user: process.env.MAIL_USER,
    	  pass: process.env.MAIL_PASS,
		}
	});
	let info = await transporter.sendMail({
		from: '"Philsource" <philsource247@gmail.com>',
		to: `${recipient}`,
		subject: 'Philsource Password Recovery',
		text: 'yo buddy'
	});
}
