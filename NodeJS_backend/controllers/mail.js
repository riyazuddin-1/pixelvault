const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.MAILER_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILER_UID,
        pass: process.env.MAILER_PASS
    }
})

const mailHandler = {};

mailHandler.sendEmail = async (res, email, subject, content) => {
    if(!email || !subject) return res.status(400).send("Missing important fields");
    try {
        let mailOptions = {
            from: process.env.MAILER_UID,
            to: email,
            subject: subject,
            html: content
        }
        
        transporter.sendMail(mailOptions, (error, info)=> {
            if (error) {
              return res.status(400).send("Error sending email");
            }
        })
    } catch(e) {
        res.status(500).send("Internal server error");
    }
}

module.exports = mailHandler;