"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//External Libraries
const express = require("express");
const bodyParser = require("body-parser");
var app = express();
var path = require('path');
var fs = require('fs');
//RethinkDB
const database_1 = require("./database");
//My Functions
const tools_1 = require("./tools");
// Irrelevant Background Work
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DEvarE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/plain');
    res.send("Welcome to your own server boy!");
});
//Requesting For PDF
app.post('/prod/generate_barcodes', (req, res) => {
    let cards_batch = req.body;
    tools_1.Generator.generatePDF(cards_batch, true, true).then((filename) => {
        res.json("PDF Sent " + filename);
    });
});
app.post('/test/generate_barcodes', (req, res) => {
    let cards_batch = req.body;
    tools_1.Generator.generatePDF(cards_batch, false, true).then((filename) => {
        res.json("PDF Sent " + filename);
    });
});
//Database Interactions
//Get all items from a table that matches an index
app.post('/prod/db/get_all', (req, res) => {
    let DB = database_1.prod;
    if (req.body.db == "db") {
        if (req.body.index == "primary") {
            DB.get(req.body).then((data_response) => {
                res.json(data_response);
            });
        }
        else {
            DB.getAll(req.body).then((data_response) => {
                res.json(data_response);
            });
        }
    }
    else if (req.body.db == "auth") {
        if (req.body.index == "primary") {
            database_1.Auth.get(req.body).then((data_response) => {
                res.json(data_response);
            });
        }
        else {
            database_1.Auth.getAll(req.body).then((data_response) => {
                res.json(data_response);
            });
        }
    }
    else {
        res.json("No Such Database");
    }
});
app.post('/test/db/get_all', (req, res) => {
    let DB = database_1.test;
    if (req.body.db == "db") {
        if (req.body.index == "primary") {
            DB.get(req.body).then((data_response) => {
                res.json(data_response);
            });
        }
        else {
            DB.getAll(req.body).then((data_response) => {
                res.json(data_response);
            });
        }
    }
    else if (req.body.db == "auth") {
        if (req.body.index == "primary") {
            database_1.Auth.get(req.body).then((data_response) => {
                res.json(data_response);
            });
        }
        else {
            database_1.Auth.getAll(req.body).then((data_response) => {
                res.json(data_response);
            });
        }
    }
    else {
        res.json("No Such Database");
    }
});
//Get all items from a table
app.post('/prod/db/get_table', (req, res) => {
    let DB = database_1.prod;
    if (req.body.db == "db") {
        DB.getTable(req.body.table).then((data_response) => {
            res.json(data_response);
        });
    }
    else if (req.body.db == "auth") {
        database_1.Auth.getTable(req.body.table).then((data_response) => {
            res.json(data_response);
        });
    }
    else {
        res.json("No Such Database");
    }
});
app.post('/test/db/get_table', (req, res) => {
    let DB = database_1.test;
    if (req.body.db == "db") {
        DB.getTable(req.body.table).then((data_response) => {
            res.json(data_response);
        });
    }
    else if (req.body.db == "auth") {
        database_1.Auth.getTable(req.body.table).then((data_response) => {
            res.json(data_response);
        });
    }
    else {
        res.json("No Such Database");
    }
});
//Update a database entry
app.post('/prod/db/update_item', (req, res) => {
    tools_1.UpdateParser.update(req.body, true).then((data_response) => {
        console.log(data_response);
        res.json(data_response);
    });
});
app.post('/test/db/update_item', (req, res) => {
    tools_1.UpdateParser.update(req.body, false).then((data_response) => {
        console.log(data_response);
        res.json(data_response);
    });
});
//Check Validity of a Barcode
app.post('/prod/db/check_code', (req, res) => {
    tools_1.Validator.check(req.body.code, true).then((data_response) => {
        res.json(data_response);
    });
});
app.post('/test/db/check_code', (req, res) => {
    tools_1.Validator.check(req.body.code, false).then((data_response) => {
        res.json(data_response);
    });
});
app.post('/prod/db/upload_transaction', (req, res) => {
    let DB = database_1.prod;
    DB.uploadTransaction(req.body).then((data_response) => {
        console.log(data_response);
        res.json(data_response);
    });
});
app.post('/test/db/upload_transaction', (req, res) => {
    let DB = database_1.test;
    DB.uploadTransaction(req.body).then((data_response) => {
        console.log(data_response);
        res.json(data_response);
    });
});
app.post('/prod/db/upload_payment', (req, res) => {
    let DB = database_1.prod;
    DB.uploadPayment(req.body).then((data_response) => {
        console.log(data_response);
        res.json(data_response);
    });
});
app.post('/test/db/upload_payment', (req, res) => {
    let DB = database_1.test;
    DB.uploadPayment(req.body).then((data_response) => {
        console.log(data_response);
        res.json(data_response);
    });
});
//Authentication
app.post('/prod/auth/login', (req, res) => {
    let userAuth = req.body;
    database_1.Auth.login(userAuth, (err, data) => {
        if (err) {
            res.json({ error_message: err.message });
        }
        else {
            res.json(data);
        }
    });
});
app.post('/test/auth/login', (req, res) => {
    let userAuth = req.body;
    database_1.Auth.login(userAuth, (err, data) => {
        if (err) {
            res.json({ error_message: err.message });
        }
        else {
            res.json(data);
        }
    });
});
app.post('/prod/auth/register', (req, res) => {
    let userRegister = req.body;
    database_1.Auth.register(userRegister, false, (err, data) => {
        if (err) {
            res.json({ error_message: err.message });
        }
        else {
            res.json(data);
        }
    });
});
app.post('/test/auth/register', (req, res) => {
    let userRegister = req.body;
    database_1.Auth.register(userRegister, false, (err, data) => {
        if (err) {
            res.json({ error_message: err.message });
        }
        else {
            res.json(data);
        }
    });
});
//Server Settings
var PORT = 8081; //process.env.PORT;
var IP = process.env.IP;
app.set('trust proxy', true);
app.set('trust proxy', 'loopback');
app.listen(PORT, IP, function () {
    console.log('Example app listening on port ' + PORT);
});
