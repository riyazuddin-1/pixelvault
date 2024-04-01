const nodemailer = require('nodemailer');

const {db, collections } = require('../database');
const collectionName = collections.users;

var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.MAILER_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILER_UID,
        pass: process.env.MAILER_PASS
    }
})

const mailControllers = {};

mailControllers.sendEmail = async (req, res) => {
    mail = req.body.email;
    otp = req.body.otp;
    console.log(mail, otp);
    var result = await db.collection(collectionName).findOne({ mailID: mail });
    console.log(result);
    if(!result) {
        res.status(300).send('The email is not registered');
    } else {
        console.log('found');
        var mailOptions = {
            from: process.env.MAILER_UID,
            to: mail,
            subject: 'OTP for password change',
            html: `<p>Hello User!!!</p><p>Your One Time Password for password change is..</p><h4>${otp}</h4>`
        }
        transporter.sendMail(mailOptions, (error, info)=> {
            if (error) {
                console.log(error);
                res.status(300).send();
              } else {
                res.status(200).send();
              }
        })
    }
}

module.exports = mailControllers;