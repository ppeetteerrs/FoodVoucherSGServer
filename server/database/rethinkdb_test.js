"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const r = require("rethinkdb");
const parser_1 = require("../tools/parser");
class DBClass {
    constructor() {
    }
    async getAll(request) {
        await this.ready();
        let value = request.value;
        if (request.valueIsInt) {
            value = parseInt(request.value);
        }
        let data_response = await r.table(request.table).getAll(value, { index: request.index }).coerceTo("array").run(this.db);
        if (request.limit >= 1) {
            data_response = data_response.slice(0, request.limit);
        }
        if (request.table == "cards") {
            data_response = await parser_1.Parser.parseCardArray(data_response, false);
        }
        return data_response;
    }
    async getTable(table) {
        await this.ready();
        let data_response = await r.table(table).coerceTo("array").run(this.db);
        return data_response;
    }
    async get(request) {
        await this.ready();
        let data_response = await r.table(request.table).get(request.value).run(this.db);
        if (request.table == "cards") {
            data_response = await parser_1.Parser.parseCard(data_response, false);
        }
        return data_response;
    }
    async insertItems(request) {
        await this.ready();
        let response = await r.table(request.table).insert(request.object).run(this.db);
        return response["generated_keys"];
    }
    async updateItem(table, id, object) {
        await this.ready();
        let data_response = await r.table(table).get(id).update(object).run(this.db);
        //console.log(data_response);
        return data_response;
    }
    async uploadTransaction(transaction) {
        await this.ready();
        //Testing Purpose
        if (config_1.CONFIG.dev_mode) {
            let randomYear = Math.floor(Math.random() * 18 + 2000);
            let randomMonth = Math.floor(Math.random() * 12 + 1);
            transaction.date = new Date(randomYear, randomMonth, 1);
        }
        else {
            //Production
            transaction.date = new Date();
        }
        let data_response = await r.table("transactions").insert(transaction).run(this.db);
        //console.log(data_response);
        return data_response;
    }
    async uploadPayment(payment) {
        await this.ready();
        payment.amount = parseInt(payment.amount.toString());
        if (config_1.CONFIG.dev_mode) {
            //Testing Purpose
            let randomYear = Math.floor(Math.random() * 18 + 2000);
            let randomMonth = Math.floor(Math.random() * 12 + 1);
            payment.date = new Date(randomYear, randomMonth, 1);
        }
        else {
            //Production
            payment.date = new Date();
        }
        let data_response = await r.table("payments").insert(payment).run(this.db);
        //console.log(data_response);
        return data_response;
    }
    async getMonthlyTransactions() {
        await this.ready();
        let monthlyTransactions = await r.table("transactions").filter((val) => {
            return val("date").add(28800).month().eq(r.now().month()).and(val("date").add(28800).year().eq(r.now().year()));
        }).coerceTo("array").run(this.db);
        return monthlyTransactions;
    }
    async getDailyTransactions() {
        await this.ready();
        let dailyTransactions = await r.table("transactions").filter((val) => { return (val("date").add(28800).date().eq(r.now().date())); }).coerceTo("array").run(this.db);
        return dailyTransactions;
    }
    async getAllBarcodes() {
        await this.ready();
        let response = await r.table("cards").pluck("barcode").coerceTo("array").run(this.db);
        //console.log(response);
        return response;
    }
    connectDB(callback) {
        r.connect({ db: "test" }, (err, connection) => {
            this.db = connection;
            callback();
        });
    }
    ready() {
        let promise = new Promise((resolve, reject) => {
            if (!this.db) {
                this.connectDB(resolve);
            }
            else {
                resolve();
            }
        });
        return promise;
    }
}
var test = new DBClass();
exports.test = test;
