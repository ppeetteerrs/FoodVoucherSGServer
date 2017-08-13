import * as models from '../models/models';
import { Auth, prod, test } from '../database';

class UpdateParserClass {

  constructor() {
  }

  public async update(request: models.DBUpdateRequest, real: boolean) {
    let response = {} as any;
    switch (request.type) {
      case "card" || "cards":
        response = await this.updateCard(request.id, request.object, real);
        break;
      case "user" || "users":
        break;
      case "payment" || "payments":
        response = await this.updatePayment(request.id, request.object, real);
        break;
    }
    return response;
  }

  private async updateCard(id: string, card: models.CardOut, real: boolean) {
    let DB;
    if (real) {
      DB = prod;
    } else {
      DB = test;
    }
    let charityProfile: models.UserOut = await Auth.get({ db: "auth", table: "users", index: "primary", valueIsInt: false, value: card.charityID, limit: -1 });
    let creatorProfile: models.UserOut = await Auth.get({ db: "auth", table: "users", index: "primary", valueIsInt: false, value: card.creatorID, limit: -1 });
    let parsedCard = {
      charityName: charityProfile.name,
      charityID: card.charityID,
      creatorName: creatorProfile.name,
      creatorID: card.creatorID,
      ownerName: card.ownerName,
      ownerLocation: card.ownerLocation,
      quotaPerMonth: parseInt(card.quotaPerMonth.toString()),
      quotaPerDay: parseInt(card.quotaPerDay.toString()),
      enabled: card.enabled
    };
    let response = await DB.updateItem("cards", id, parsedCard);
    return response;
  }

  private async updateUser(id: string, user: models.UserOut) {
    
  }

  private async updatePayment(id: string, payment: models.Payment, real: boolean) {
    let DB;
    if (real) {
      DB = prod;
    } else {
      DB = test;
    }
    payment.date = new Date(payment.date);
    let response = DB.updateItem("payments", id, payment);
    return response;
  }
}

var UpdateParser = new UpdateParserClass();

export { UpdateParser };