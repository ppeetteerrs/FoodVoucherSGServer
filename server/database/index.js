"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rethinkdb_prod_1 = require("./rethinkdb_prod");
exports.prod = rethinkdb_prod_1.prod;
const rethinkdb_test_1 = require("./rethinkdb_test");
exports.test = rethinkdb_test_1.test;
const auth_1 = require("./auth");
exports.Auth = auth_1.Auth;
