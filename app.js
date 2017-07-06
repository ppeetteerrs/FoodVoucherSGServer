"use strict";
var express = require('express');
var app = express();
var generator = require('./generator');
var validator = require('./validator');
var path = require('path');
var bodyParser = require('body-parser');
var fs  = require('fs');


app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DEvarE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(bodyParser.json());

app.get('/newpdf',(req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=barcode.pdf');
  res.send(generator.generatePDF());
})

app.get('/newbarcodes.json',(req, res) => {
  var datas = generator.generateJSON(25);  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.json(datas);
  res.end();
  
})

app.get('/check.json',(req, res) => {
  var code = req.query.code;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  var data = validator.checkCode(code)
  res.send(data);
})

app.get('/bible',(req, res) => {
  var sentence = req.query.sentence;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/plain');
  res.send(sentence);
})

app.listen(process.env.PORT, process.env.IP, function () {
  console.log('Example app listening on port ' + process.env.PORT)
})