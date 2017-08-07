"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rethinkdb_1 = require("../database/rethinkdb");
class ParserClass {
    constructor() {
    }
    async calculateRedemption(card, monthlyTransactions, dailyTransactions) {
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
        let response = await rethinkdb_1.DB.updateItem("cards", card.id, card);
        return card;
    }
    async parseCardArray(cards) {
        let monthlyTransactions = await rethinkdb_1.DB.getMonthlyTransactions();
        let dailyTransactions = await rethinkdb_1.DB.getDailyTransactions();
        for (let card of cards) {
            card = await this.calculateRedemption(card, monthlyTransactions, dailyTransactions);
        }
        return cards;
    }
    async parseCard(card) {
        let monthlyTransactions = await rethinkdb_1.DB.getMonthlyTransactions();
        let dailyTransactions = await rethinkdb_1.DB.getDailyTransactions();
        card = await this.calculateRedemption(card, monthlyTransactions, dailyTransactions);
        return card;
    }
}
var Parser = new ParserClass();
exports.Parser = Parser;
