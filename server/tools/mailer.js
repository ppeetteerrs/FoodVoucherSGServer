"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
class MailerClass {
    constructor() {
        // create reusable transporter object using the default SMTP transport
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'ppeetteerrsx@gmail.com',
                pass: 'dkmlwxwmbotmecst'
            }
        });
    }
    sendMail(toEmail, pdfFileName) {
        let mailOptions = {
            from: 'Peter Yuen <ppeetteerrsx@gmail.com>',
            to: toEmail,
            subject: '✔ PDF Generated ✔',
            text: 'Please check the attachment',
            attachments: [{
                    filename: "barcoded.pdf",
                    path: pdfFileName
                }]
        };
        let promise = new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve('Message is sent to ' + toEmail);
                }
            });
        });
        return promise;
    }
}
var Mailer = new MailerClass();
exports.Mailer = Mailer;
