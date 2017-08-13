"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
class ParserClass {
    constructor() {
    }
    async calculateRedemption(card, monthlyTransactions, dailyTransactions, real) {
        let monthlyRedemption = 0;
        let dailyRedemption = 0;
        for (let transaction of monthlyTransactions) {
            if (transaction.cardID == card.id) {
                monthlyRedemption += 1;
            }
        }
        for (let transaction of dailyTransactions) {
            if (transaction.cardID == card.id) {
                dailyRedemption += 1;
            }
        }
        card.redeemedThisMonth = monthlyRedemption;
        card.redeemedToday = dailyRedemption;
        let DB;
        if (real) {
            DB = database_1.prod;
        }
        else {
            DB = database_1.test;
        }
        let response = await DB.updateItem("cards", card.id, card);
        return card;
    }
    async parseCardArray(cards, real) {
        let DB;
        if (real) {
            DB = database_1.prod;
        }
        else {
            DB = database_1.test;
        }
        let monthlyTransactions = await DB.getMonthlyTransactions();
        let dailyTransactions = await DB.getDailyTransactions();
        for (let card of cards) {
            card = await this.calculateRedemption(card, monthlyTransactions, dailyTransactions, real);
        }
        return cards;
    }
    async parseCard(card, real) {
        let DB;
        if (real) {
            DB = database_1.prod;
        }
        else {
            DB = database_1.test;
        }
        let monthlyTransactions = await DB.getMonthlyTransactions();
        let dailyTransactions = await DB.getDailyTransactions();
        card = await this.calculateRedemption(card, monthlyTransactions, dailyTransactions, real);
        return card;
    }
}
var Parser = new ParserClass();
exports.Parser = Parser;
