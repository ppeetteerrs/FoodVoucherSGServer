import { prod, test } from "../database";
import * as models from "../models/models"

class ValidatorClass {

  async check(code: number, real: boolean) {
    let DB;
    if (real) {
      DB = prod;
    } else {
      DB = test;
    }
    let barcodeObjects: models.CardOut[] = await DB.getAll({ db: "db", table: "cards", index: "barcode", valueIsInt: true, value: code, limit: 1 });
    if (barcodeObjects.length > 0) {
      let cardObject = barcodeObjects[0];
      //First must be enabled
      if (!cardObject.enabled) {
        return { error_message: "Card Not Enabled" };
      }
      //Second must have full owner information
      if (cardObject.ownerLocation == "" || cardObject.ownerLocation == null || cardObject.ownerLocation == "None" || cardObject.ownerLocation == "none" || cardObject.ownerName == "" || cardObject.ownerName == null || cardObject.ownerName == "None" || cardObject.ownerName == "none") {
        return { error_message: "No Owner" };
      }
      //Third must not have exceeded quota
      if (cardObject.redeemedThisMonth >= cardObject.quotaPerMonth) {
        return { error_message: "Monthly Quota Reached: " + cardObject.redeemedThisMonth + "/" + cardObject.quotaPerMonth };
      }
      if (cardObject.redeemedToday >= cardObject.quotaPerDay) {
        return { error_message: "Daily Quota Reached: " + cardObject.redeemedToday + "/" +  cardObject.quotaPerDay };
      }

      return cardObject;
    } else {
      return { error_message: "Card Not Found" };
    }
  }
}

var Validator = new ValidatorClass();

export { Validator };