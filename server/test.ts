import { DB, Auth } from "./database";
import { UserAuth, UserProfile, UserRegister } from "./models/users";
import { Generator } from "./tools/generator";

var registerUser: UserRegister = {
  name: "Test",
  email: "ppeetteerrs@gmail.com",
  password: "fvsg2017",
  accountType: "Admin"
};

let barcodes = Generator.generateCodeArray(9, [82, 3, 5]);
console.log(barcodes.toString());