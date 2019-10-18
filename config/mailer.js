const nodeMailer = require('nodemailer');
require('dotenv').config();
let adminEmail      = process.env.MAIL_HOST;
let adminPassword   = process.env.MAIL_PORT;
let mailHost        = process.env.ADMIN_EMAIL;
let mailPort        = process.env.ADMIN_PASSWORD;

let sendMail = (toEmail,subject,contentHtml) => {
    let transporter = nodeMailer.createTransport({
        host    : mailHost,
        port    : mailPort,
        secure  : false , //use SSL , TLS,
        auth    : {
            user : adminEmail,
            pass : adminPassword
        } 
    });
    let options = {
        from    : adminEmail,
        to      : toEmail,
        subject : subject,
        html    : contentHtml
    }
    return transporter.sendMail(options); // this default return a Promise
};
module.exports = sendMail;