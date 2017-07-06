"use strict";
var express = require('express');
var app = express();
var generator = require('./generator');
var validator = require('./validator');
var fb = require('./firebase')
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

fb.signin.then(() => {
  console.log("Signed In");
});

// Setting Response  Headers
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DEvarE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Body Parsing
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/plain');
  res.send("Welcome to your own server boy!");
})

//Requesting For PDF
app.get('/newpdf', (req, res) => {
  let amount = req.query.amount;
  let email = req.query.email;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/plain');
  generator.completePDF(amount, email, (filename) => {
    res.send("PDF Sent " + filename);
  });

})

app.get('/newbarcodes', (req, res) => {
  let options = JSON.parse(req.query.options);
  var datas = generator.generateJSON(25);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.json(datas);
  res.end();
})

app.get('/check', (req, res) => {
  var code = req.query.code;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/plain');
  validator.checkCode(code, (found) => {
    res.send(found.toString());
  });
})

app.listen(process.env.PORT, process.env.IP, function () {
  console.log('Example app listening on port ' + process.env.PORT)
})

/*
app.listen(8081, function () {
  console.log('Example app listening on port 8081')
})*/
