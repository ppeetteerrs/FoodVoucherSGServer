//External Libraries
import * as express from 'express';
import * as bodyParser from 'body-parser';
var app = express();
var path = require('path');
var fs = require('fs');

//Interfaces
import * as models from './models/models';
//RethinkDB
import { Auth, DB } from './database';
//My Functions
import { Generator, Validator, Parser, UpdateParser } from './tools';

// Irrelevant Background Work
  app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DEvarE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
  app.use(bodyParser.json());
  app.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/plain');
    res.send("Welcome to your own server boy!");
  })


//Requesting For PDF
  app.post('/generate_barcodes', (req, res) => {
    let cards_batch : models.CardsBatchIn = req.body;
    Generator.generatePDF(cards_batch).then((filename) => {
      res.json("PDF Sent " + filename);
    });
  })

//Database Interactions
  //Get all items from a table that matches an index
  app.post('/db/get_all', (req, res) => {
    if (req.body.db == "db") {
      if (req.body.index == "primary") {
        DB.get(req.body).then((data_response) => {
          res.json(data_response);
        });
      } else {
        DB.getAll(req.body).then((data_response) => {
          res.json(data_response);
        });
      }
    } else if (req.body.db == "auth") {
      if (req.body.index == "primary") {
        Auth.get(req.body).then((data_response) => {
          res.json(data_response);
        });
      } else {
        Auth.getAll(req.body).then((data_response) => {
          res.json(data_response);
        });
      }
    } else {
      res.json("No Such Database");
    }
  })

  //Get all items from a table
  app.post('/db/get_table', (req, res) => {
    if (req.body.db == "db") {
      DB.getTable(req.body.table).then((data_response) => {
        res.json(data_response);
      });
    } else if (req.body.db == "auth") {
      Auth.getTable(req.body.table).then((data_response) => {
        res.json(data_response);
      });
    } else {
      res.json("No Such Database");
    }
  })

  //Update a database entry
  app.post('/db/update_item', (req, res) => {
    UpdateParser.update(req.body).then((data_response) => {
      console.log(data_response);
      res.json(data_response);
    });
  })

  //Check Validity of a Barcode
  app.post('/db/check_code', (req, res) => {
    Validator.check(req.body.code).then((data_response) => {
      res.json(data_response);
    });
  })

  app.post('/db/upload_transaction', (req, res) => {
    DB.uploadTransaction(req.body).then((data_response) => {
      console.log(data_response);
      res.json(data_response);
    });
  })

  app.post('/db/upload_payment', (req, res) => {
    DB.uploadPayment(req.body).then((data_response) => {
      console.log(data_response);
      res.json(data_response);
    });
  })

//Authentication
  app.post('/auth/login', (req, res) => {
    let userAuth : models.UserAuth = req.body;
    Auth.login(userAuth, (err, data) => {
      if (err) {
        res.json({ error_message: err.message });
      } else {
        res.json(data);
      }
    });
  })

  app.post('/auth/register', (req, res) => {
    let userRegister: models.UserIn = req.body;
    Auth.register(userRegister, false, (err, data) => {
      if (err) {
        res.json({ error_message: err.message });
      } else {
        res.json(data);
      }
    });
  })


//Server Settings
  var PORT = 8082; //process.env.PORT;
  var IP = process.env.IP;

  app.listen(PORT, IP, function () {
    console.log('Example app listening on port ' + PORT);
  })
