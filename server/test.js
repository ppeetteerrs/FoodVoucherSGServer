"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("./tools/generator");
var registerUser = {
    name: "Test",
    email: "ppeetteerrs@gmail.com",
    password: "fvsg2017",
    accountType: "Admin"
};
let barcodes = generator_1.Generator.generateCodeArray(9, [82, 3, 5]);
console.log(barcodes.toString());
