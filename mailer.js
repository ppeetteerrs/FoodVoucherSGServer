'use strict';
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: 'ppeetteerrsx@gmail.com',
    pass: 'dkmlwxwmbotmecst'
  }
});

exports.sendMail = function (toEmail, pdfFileName) {
  let mailOptions = {
    from: 'Peter Yuen <ppeetteerrsx@gmail.com>', // sender address
    to: toEmail, // list of receivers
    subject: '✔ PDF Generated ✔', // Subject line
    text: 'Please check the attachment', // plain text body
    attachments: [{
      filename: "barcoded.pdf",
      path: pdfFileName
    }]
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message is sent to ' + toEmail);
  });
}
