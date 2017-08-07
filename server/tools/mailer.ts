import * as nodemailer from 'nodemailer';

class MailerClass {

  // create reusable transporter object using the default SMTP transport
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
      user: 'ppeetteerrsx@gmail.com',
      pass: 'dkmlwxwmbotmecst'
    }
  });

  constructor() {

  }


  sendMail(toEmail, pdfFileName) {
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

    let promise = new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve('Message is sent to ' + toEmail);
        }
      });
    });
    return promise;
  }

}

var Mailer = new MailerClass();

export { Mailer };
