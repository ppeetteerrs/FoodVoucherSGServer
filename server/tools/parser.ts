import * as models from '../models/models';
import { DB } from '../database/rethinkdb';

class ParserClass {

  constructor() {
  }

  async calculateRedemption(card: models.CardOut, monthlyTransactions: models.TransactionOut[], dailyTransactions: models.TransactionOut[]) {
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
    let response = await DB.updateItem("cards", card.id, card);
    return card;
  }

  async parseCardArray(cards: models.CardOut[]) {
    let monthlyTransactions: models.TransactionOut[] = await DB.getMonthlyTransactions();
    let dailyTransactions: models.TransactionOut[] = await DB.getDailyTransactions();
    for (let card of cards) {
      card = await this.calculateRedemption(card, monthlyTransactions, dailyTransactions);
    }
    return cards;
  }

  async parseCard(card: models.CardOut) {
    let monthlyTransactions: models.TransactionOut[] = await DB.getMonthlyTransactions();
    let dailyTransactions: models.TransactionOut[] = await DB.getDailyTransactions();
    card = await this.calculateRedemption(card, monthlyTransactions, dailyTransactions);
    return card;
  }
  
}

var Parser = new ParserClass();
export { Parser };