"use strict";
// System
var exports = module.exports;
var fs = require('fs');

//Barcode
var bwipjs = require('bwip-js');

//PDF
var PDFDocument = require('pdfkit');

//My Code
var cardsRef = require('./firebase.js').cardsRef;
var mailer = require('./mailer.js');

function createBarcodes(codeArray, callback) {
  var barcodeArray = [];
  for (i = 0; i < codeArray.length; i++) {
    bwipjs.toBuffer({
      bcid: 'code128', // Barcode type
      text: codeArray[i].toString(),
      scale: 3, // 3x scaling factor
      height: 10, // Bar height, in millimeters
      includetext: true, // Show human-readable text
      textxalign: 'center', // Always good to set this
      textsize: 13 // Font size, in points
    }, (err, png) => {
      barcodeArray.push(png);
      if (barcodeArray.length == codeArray.length) {
        callback(barcodeArray);
      }
    });
  }
}

function createPDFFile(uid, barcodeArray) {
  var doc = new PDFDocument({
    layout: "landscape"
  });
  let filename = "./pdf/test/" + uid + ".pdf";
  stream = doc.pipe(fs.createWriteStream(filename));
  for (i = 0; i < barcodeArray.length; i++) {
    let pageIndex = i % 9;
    let rowIndex = pageIndex % 3;
    let columnIndex = (pageIndex - rowIndex) / 3;
    //Add new Pages
    if (pageIndex == 0 && i != 0) {
      doc.addPage({
        layout: "landscape"
      });
    }
    // Calculate Coordinates
    let x = rowIndex * (241 + 18) + 18
    let y = columnIndex * (150 + 40) + 41

    // Add the Card Border
    doc.image("./assets/img/box.jpg", x, y, {
      height: 150,
      width: 241
    });
    doc.image(barcodeArray[i], x, y, {
      width: 100
    });
  }
  doc.end();
  return filename;
};

function generateCodeArray(number) {
  var array = [];
  for (var i = 0; i < number; i++) {
    var code = getRandomCode(7, 873425);
    array.push(code);
  }
  return array;
}

function getRandomCode(digitsCode, identifier) {
  var min = Math.pow(10, digitsCode);
  var max = Math.pow(10, digitsCode + 1);
  var code = Math.floor(Math.random() * (max - min)) + min;
  code = identifier * Math.pow(10, digitsCode + 1) + code;
  return code;
}

exports.generateJSON = function (number) {
  var array = [];
  for (var i = 0; i < number; i++) {
    var code = getRandomCode(7, 873425);
    array.push(code);
  }
  return JSON.stringify(array);
}

exports.completePDF = function (amount, email, callback) {
  let barcodeArray = generateCodeArray(amount);
  cardsRef.push(barcodeArray, () => {
    createBarcodes(barcodeArray, (array) => {
      let filename = createPDFFile(Math.floor(Math.random() * 10000), array);
      mailer.sendMail(email, filename);
      callback(filename);
    })
  });
}
