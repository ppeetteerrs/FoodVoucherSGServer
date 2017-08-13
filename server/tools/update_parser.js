"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
class UpdateParserClass {
    constructor() {
    }
    async update(request, real) {
        let response = {};
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
    async updateCard(id, card, real) {
        let DB;
        if (real) {
            DB = database_1.prod;
        }
        else {
            DB = database_1.test;
        }
        let charityProfile = await database_1.Auth.get({ db: "auth", table: "users", index: "primary", valueIsInt: false, value: card.charityID, limit: -1 });
        let creatorProfile = await database_1.Auth.get({ db: "auth", table: "users", index: "primary", valueIsInt: false, value: card.creatorID, limit: -1 });
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
    async updateUser(id, user) {
    }
    async updatePayment(id, payment, real) {
        let DB;
        if (real) {
            DB = database_1.prod;
        }
        else {
            DB = database_1.test;
        }
        payment.date = new Date(payment.date);
        let response = DB.updateItem("payments", id, payment);
        return response;
    }
}
var UpdateParser = new UpdateParserClass();
exports.UpdateParser = UpdateParser;
