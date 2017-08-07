import { DB } from './rethinkdb';
import * as r from "rethinkdb";
import * as models from "../models/models";

class AuthClass {

  auth;

  constructor() {

  }

  public async getAll(request: models.DBGetAllRequest) {
    await this.ready();
    let data_response = await r.table(request.table).getAll(request.value, { index: request.index }).coerceTo("array").run(this.auth);
    return data_response;    
  }

  public async get(request: models.DBGetAllRequest) {
    await this.ready();
    let data_response = await r.table(request.table).get(request.value).run(this.auth);
    return data_response; 
  }

  public async getTable(table: string) {
    await this.ready();
    let data_response: any[] = await r.table(table).coerceTo("array").run(this.auth);
    return data_response;
  }

  async login(userAuth: models.UserAuth, callback) {
    await this.ready();
    this.getUser(userAuth.email, "email", (err, data) => {
      if (data[0] && userAuth.password === data[0].password) {
        let returnUser: models.UserOut = {
          email: data[0].email,
          name: data[0].name,
          id: data[0].id,
          accountType: data[0].accountType
        }
        callback(null, returnUser);
      } else {
        callback({ message: "Incorrect Password" });
      }
    });
  }

  async register(userRegister: models.UserIn, test: boolean, callback) {
    await this.ready();
    this.getUser(userRegister.email, "email", (err, data) => {
      let user = data[0];
      if (user) {
        //REMOVE FOR PRODUCTION
        if (test) {
          this.deleteUser(userRegister.email, "email", (err, data) => {
            console.log("Deleted");
            console.log(data);
          });
        }
        callback({ message: "Email Already Registered" });
      } else {
        r.table("users").insert(userRegister).run(this.auth, (err, data) => {
          //REMOVE FOR PRODUCTION
          if (test) {
            this.deleteUser(userRegister.email, "email", (err, data) => {
              console.log("Deleted");
              console.log(data);
            });
          }
          callback(null, data);
        });
      }
    });
  }

  async getUser(input: string, index: string, callback) {
    await this.ready();
    r.table("users").getAll(input, { index: index }).coerceTo("array").run(this.auth, (err, data) => {
      callback(err, data);
    });
  }

  async deleteUser(input: string, index: string, callback) {
    await this.ready();
    r.table("users").getAll(input, { index: index }).delete().run(this.auth, (err, data) => {
      callback(err, data);
    });
  }


  private connectAuth(callback) {
    r.connect({ db: "auth" }, (err, connection) => {
      this.auth = connection;
      callback();
    });
  }

  ready() {
    let promise = new Promise((resolve, reject) => {
      if (!this.auth) {
        this.connectAuth(resolve);
      } else {
        resolve();
      }

    });
    return promise;
  }
}

var Auth = new AuthClass();

export { Auth };