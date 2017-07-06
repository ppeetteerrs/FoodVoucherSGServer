var fs = require('fs'),
Canvas = require('canvas'),
JSBarcode = require('jsbarcode');
var exports = module.exports;


function generateCodeArray  (number){
    var array = [];
    for(var i=0; i<number; i++){
        var code = getRandomCode(7,873425);
        array.push(code);
    }
    return array;
}

function getRandomCode(digitsCode, identifier){
    var min = Math.pow(10, digitsCode);
    var max = Math.pow(10, digitsCode + 1);
    var code = Math.floor(Math.random() * (max - min)) + min;
    code = identifier*Math.pow(10, digitsCode + 1) + code;
    return code;
}

exports.generatePDF = function (){
    var pdf = new Canvas(1000,500,'pdf');
    
    var pdfContext = pdf.getContext('2d');
    
    var codeArray = generateCodeArray(25);
    
    for (var i=0; i<25; i++){
        
        var barcode = new Canvas(200,100);
        
        JSBarcode(barcode)
          .options({font: "OCR-B"}) // Will affect all barcodes
          .codabar(codeArray[i].toString(), {fontSize: 18, textMargin: 0})
          .render();
        
        var png = barcode.toBuffer();
        
        var img = new Canvas.Image;
        
        img.src = png;
        
        pdfContext.drawImage(img,(Math.floor(i/5))*200,(i%5)*100,200,100);
    
    }
    
    return pdf.toBuffer();
}

exports.generateJSON = function (number){
    var array = [];
    for(var i=0; i<number; i++){
        var code = getRandomCode(7,873425);
        array.push(code);
    }
    return JSON.stringify(array);
}


