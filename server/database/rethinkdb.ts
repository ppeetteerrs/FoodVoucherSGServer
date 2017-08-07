import { CONFIG } from "../config";
import * as models from "../models/models";
import * as r from "rethinkdb";
import { Parser } from "../tools/parser";

class DBClass {

  db;

  constructor() {
  }

  public async getAll(request: models.DBGetAllRequest) {
    await this.ready();
    let value = request.value;
    if (request.valueIsInt) {
      value = parseInt(request.value);
    }
    let data_response: any[] = await r.table(request.table).getAll(value, { index: request.index }).coerceTo("array").run(this.db);
    if (request.limit >= 1) {
      data_response = data_response.slice(0, request.limit);
    }
    if (request.table == "cards") {
      data_response = await Parser.parseCardArray(data_response);
    }
    return data_response;

  }

  public async getTable(table: string) {
    await this.ready();
    let data_response: any[] = await r.table(table).coerceTo("array").run(this.db);
    return data_response;
  }

  public async get(request: models.DBGetAllRequest) {
    await this.ready();
    let data_response = await r.table(request.table).get(request.value).run(this.db);
    if (request.table == "cards") {
      data_response = await Parser.parseCard(data_response);
    }
    return data_response;
  }

  public async insertItems(request: models.DBInsertRequest) {
    await this.ready();
    let response = await r.table(request.table).insert(request.object).run(this.db);
    return response["generated_keys"];
  }

  public async updateItem(table, id, object) {
    await this.ready();
    let data_response: any = await r.table(table).get(id).update(object).run(this.db);
    console.log(data_response);
    return data_response;
  }

  public async uploadTransaction(transaction: models.TransactionIn) {
    await this.ready();
    //Testing Purpose
    if (CONFIG.dev_mode) {

      let randomYear = Math.floor(Math.random() * 18 + 2000);
      let randomMonth = Math.floor(Math.random() * 12 + 1);
      transaction.date = new Date(randomYear, randomMonth, 1);
    } else {
      //Production
      transaction.date = new Date();
    }
    let data_response = await r.table("transactions").insert(transaction).run(this.db);
    console.log(data_response);
    return data_response;
  }

  public async uploadPayment(payment: models.Payment) {
    await this.ready();
    payment.amount = parseInt(payment.amount.toString());
    if (CONFIG.dev_mode) {
      //Testing Purpose
      let randomYear = Math.floor(Math.random() * 18 + 2000);
      let randomMonth = Math.floor(Math.random() * 12 + 1);
      payment.date = new Date(randomYear, randomMonth, 1);
    } else {
      //Production
      payment.date = new Date();
    }
    let data_response = await r.table("payments").insert(payment).run(this.db);
    console.log(data_response);
    return data_response;
  }

  async getMonthlyTransactions() {
    await this.ready();
    let monthlyTransactions: models.TransactionOut[] = await r.table("transactions").filter((val) => {
      return val("date").add(28800).month().eq(r.now().month()).and(
        val("date").add(28800).year().eq(r.now().year())
      )
    }).coerceTo("array").run(this.db);
    return monthlyTransactions;
  }

  async getDailyTransactions() {
    await this.ready();
    let dailyTransactions: models.TransactionOut[] = await r.table("transactions").filter((val) => { return (val("date").add(28800).date().eq(r.now().date())) }).coerceTo("array").run(this.db);
    return dailyTransactions;
  }

  async getAllBarcodes() {
    await this.ready();
    return await r.table("cards").pluck("barcode").coerceTo("array").run(this.db);
  }

  private connectDB(callback) {
    if (CONFIG.dev_mode) {
      r.connect({ db: "test" }, (err, connection) => {
        this.db = connection;
        callback();
      });

    } else {
      r.connect({ db: "production" }, (err, connection) => {
        this.db = connection;
        callback();
      });
    }

  }

  private ready() {
    let promise = new Promise((resolve, reject) => {
      if (!this.db) {
        this.connectDB(resolve);
      } else {
        resolve();
      }
    });
    return promise;
  }

}

var DB = new DBClass();

export { DB };