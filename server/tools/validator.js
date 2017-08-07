"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rethinkdb_1 = require("../database/rethinkdb");
class ValidatorClass {
    async check(code) {
        let barcodeObjects = await rethinkdb_1.DB.getAll({ db: "db", table: "cards", index: "barcode", valueIsInt: true, value: code, limit: 1 });
        if (barcodeObjects.length > 0) {
            let cardObject = barcodeObjects[0];
            //First must be enabled
            if (!cardObject.enabled) {
                return { error_message: "Card not enabled" };
            }
            //Second must have full owner information
            if (cardObject.ownerLocation == "" || cardObject.ownerLocation == null || cardObject.ownerLocation == "None" || cardObject.ownerLocation == "none" || cardObject.ownerName == "" || cardObject.ownerName == null || cardObject.ownerName == "None" || cardObject.ownerName == "none") {
                return { error_message: "Please fill in owner information" };
            }
            //Third must not have exceeded quota
            if (cardObject.redeemedThisMonth >= cardObject.quotaPerMonth) {
                return { error_message: "Monthly Quota Reached " + cardObject.redeemedThisMonth + "/" + cardObject.quotaPerMonth };
            }
            if (cardObject.redeemedToday >= cardObject.quotaPerDay) {
                return { error_message: "Daily Quota Reached " + cardObject.redeemedToday + "/" + cardObject.quotaPerDay };
            }
            return cardObject;
        }
        else {
            return { error_message: "Barcode not in database" };
        }
    }
}
var Validator = new ValidatorClass();
exports.Validator = Validator;
