"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const bwipjs = require("bwip-js");
const PDFDocument = require("pdfkit");
const mailer_1 = require("./mailer");
const database_1 = require("../database");
class GeneratorClass {
    constructor() {
        this.IDENTIFIER = (8000010000204).toString().split("").map(Number);
        this.Barcode_Length = 13;
        this.Card_Size = { height: 150, width: 241 };
        this.Barcode_Width = 100;
        this.Barcode_Coords = [70, 110];
        this.Card_Layout = [3, 3]; //Rows, Columns
    }
    async generatePDF(cardsBatch, real) {
        console.log(cardsBatch);
        let DB;
        if (real) {
            DB = database_1.prod;
        }
        else {
            DB = database_1.test;
        }
        let parsedcardsBatch = await this.parseCardBatch(cardsBatch);
        //Generate new Cards
        let existing_barcodes = await DB.getAllBarcodes();
        let barcodeArray = this.generateCodeArray(parsedcardsBatch.amount, existing_barcodes);
        //Save the Card Batch
        let batch_uids = await DB.insertItems({ table: "card_batches", object: parsedcardsBatch });
        //Save the new Cards
        let card_objects = this.createCardObjects(parsedcardsBatch, batch_uids[0], barcodeArray);
        DB.insertItems({ table: "cards", object: card_objects });
        //Create PDF File
        let barcodePNGBufferArray = await this.createBarcodesPNGBuffers(barcodeArray);
        let filename = this.createPDFFile(batch_uids[0], barcodePNGBufferArray);
        //Send PDF File
        await mailer_1.Mailer.sendMail(parsedcardsBatch.charityEmail, filename);
        return filename;
    }
    async parseCardBatch(cardsBatch) {
        let charityProfile = await database_1.Auth.get({ db: "auth", table: "users", index: "primary", valueIsInt: false, value: cardsBatch.charityID, limit: -1 });
        let creatorProfile = await database_1.Auth.get({ db: "auth", table: "users", index: "primary", valueIsInt: false, value: cardsBatch.creatorID, limit: -1 });
        let batch = {
            amount: parseInt(cardsBatch.amount),
            charityEmail: charityProfile.email,
            charityName: charityProfile.name,
            createdAt: new Date(),
            charityID: cardsBatch.charityID,
            creatorID: cardsBatch.creatorID,
            creatorName: creatorProfile.name,
            quotaPerDay: parseInt(cardsBatch.quotaPerDay),
            quotaPerMonth: parseInt(cardsBatch.quotaPerMonth)
        };
        return batch;
    }
    //Generate the Card Objejcts to be store in DB
    createCardObjects(cardsBatch, batch_uid, barcodeArray) {
        let cardsArray = [];
        for (let barcode of barcodeArray) {
            let card = {
                charityID: cardsBatch.charityID,
                charityName: cardsBatch.charityName,
                creatorID: cardsBatch.creatorID,
                creatorName: cardsBatch.creatorName,
                ownerName: "None",
                ownerLocation: "None",
                quotaPerMonth: cardsBatch.quotaPerMonth,
                quotaPerDay: cardsBatch.quotaPerDay,
                redeemedToday: 0,
                redeemedThisMonth: 0,
                batchUID: batch_uid,
                enabled: false,
                barcode: barcode
            };
            cardsArray.push(card);
        }
        return cardsArray;
    }
    //Generate an array of Barcode PNG Buffers
    createBarcodesPNGBuffers(codeArray) {
        let promise = new Promise((resolve, reject) => {
            let barcodeArray = [];
            for (var i = 0; i < codeArray.length; i++) {
                bwipjs.toBuffer({
                    bcid: 'code128',
                    text: codeArray[i].toString(),
                    scale: 3,
                    height: 10,
                    includetext: true,
                    textxalign: 'center',
                    textsize: 13 // Font size, in points
                }, (err, png) => {
                    barcodeArray.push(png);
                    if (barcodeArray.length == codeArray.length) {
                        resolve(barcodeArray);
                    }
                });
            }
        });
        return promise;
    }
    ;
    //Create a PDF File from an array of barcode PNG buffers
    createPDFFile(uid, barcodeArray) {
        var doc = new PDFDocument({
            layout: "landscape",
            size: [595.28, 841.89]
        });
        let filename = "../pdf/test/" + uid + ".pdf";
        let stream = doc.pipe(fs.createWriteStream(filename));
        let total_double_pages = Math.ceil(barcodeArray.length / (this.Card_Layout[0] * this.Card_Layout[1]));
        //For each double page, generate front and  back side
        for (let i = 0; i < total_double_pages; i++) {
            //Front Page
            if (i != 0) {
                doc.addPage({
                    layout: "landscape",
                    size: [595.28, 841.89]
                });
            }
            //For each card (row, column)
            for (let j = 0; j < this.Card_Layout[0]; j++) {
                for (let k = 0; k < this.Card_Layout[1]; k++) {
                    let barcode_index = i * (this.Card_Layout[0] * this.Card_Layout[1]) + j * this.Card_Layout[1] + k;
                    if (barcode_index < barcodeArray.length) {
                        let x = j * (240 + 18) + 18;
                        let y = k * (150 + 40) + 20;
                        // Add the Card Border
                        doc.image("../assets/img/front.jpg", x, y, {
                            height: this.Card_Size.height,
                            width: this.Card_Size.width
                        });
                        doc.image(barcodeArray[barcode_index], x + this.Barcode_Coords[0], y + this.Barcode_Coords[1], {
                            width: this.Barcode_Width
                        });
                    }
                }
            }
            //Back Page
            /*
            doc.addPage({
              layout: "landscape",
              size: [595.28, 841.89]
            });
            //For each card (row, column)
            for (let j = 0; j < this.Card_Layout[0]; j++) {
              for (let k = 0; k < this.Card_Layout[1]; k++) {
                let barcode_index = i * (this.Card_Layout[0] * this.Card_Layout[1]) + j * this.Card_Layout[1] + k;
                if (barcode_index < barcodeArray.length) {
                  let x = 841.89 - (j * (240 + 18) + 18) - 240;
                  let y = k * (150 + 40) + 20;
                  // Add the Card Border
                  doc.image("../assets/img/back.jpg", x, y, {
                    height: this.Card_Size.height,
                    width: this.Card_Size.width
                  });
                }
              }
            }
            */
        }
        /*
        for (var i = 0; i < barcodeArray.length; i++) {
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
          doc.image("../assets/img/box.jpg", x, y, {
            height: this.Card_Size.height,
            width: this.Card_Size.width
          });
          doc.image(barcodeArray[i], x + this.Barcode_Coords[0], y + this.Barcode_Coords[1], {
            width: this.Barcode_Width
          });
        }
        */
        doc.end();
        return filename;
    }
    ;
    //Generate an array of random barcodes (do not repeat with generated barcodes)
    generateCodeArray(amount, existing_barcodes) {
        let array = [];
        for (let i = 0; i < amount; i++) {
            do {
                var code = this.getRandomCode();
            } while (existing_barcodes.indexOf(code) >= 0);
            array.push(code);
            existing_barcodes.push(code);
        }
        return array;
    }
    //Generate a barcode given an identifier and barcode length
    getRandomCode() {
        let min = Math.pow(10, this.Barcode_Length);
        let max = Math.pow(10, this.Barcode_Length + 1);
        let code = Math.floor(Math.random() * (max - min)) + min;
        let code_array = code.toString().split("").map(Number);
        let end_code = 0;
        for (let i = 0; i < this.Barcode_Length; i++) {
            let digit = this.IDENTIFIER[i];
            if (digit == 0) {
                end_code += code_array[i] * Math.pow(10, this.Barcode_Length - i - 1);
            }
            else {
                end_code += digit * Math.pow(10, this.Barcode_Length - i - 1);
            }
        }
        return end_code;
    }
}
var Generator = new GeneratorClass();
exports.Generator = Generator;
