"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QRCode = require("qrcode");
QRCode.toDataURL('I am a pony!', function (err, url) {
    console.log(url);
});
