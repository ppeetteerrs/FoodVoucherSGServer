"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("rethinkdb");
class AuthClass {
    constructor() {
    }
    async getAll(request) {
        await this.ready();
        let data_response = await r.table(request.table).getAll(request.value, { index: request.index }).coerceTo("array").run(this.auth);
        return data_response;
    }
    async get(request) {
        await this.ready();
        let data_response = await r.table(request.table).get(request.value).run(this.auth);
        return data_response;
    }
    async getTable(table) {
        await this.ready();
        let data_response = await r.table(table).coerceTo("array").run(this.auth);
        return data_response;
    }
    async login(userAuth, callback) {
        await this.ready();
        this.getUser(userAuth.email, "email", (err, data) => {
            if (data[0] && userAuth.password === data[0].password) {
                let returnUser = {
                    email: data[0].email,
                    name: data[0].name,
                    id: data[0].id,
                    accountType: data[0].accountType
                };
                callback(null, returnUser);
            }
            else {
                callback({ message: "Incorrect Password" });
            }
        });
    }
    async register(userRegister, test, callback) {
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
            }
            else {
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
    async getUser(input, index, callback) {
        await this.ready();
        r.table("users").getAll(input, { index: index }).coerceTo("array").run(this.auth, (err, data) => {
            callback(err, data);
        });
    }
    async deleteUser(input, index, callback) {
        await this.ready();
        r.table("users").getAll(input, { index: index }).delete().run(this.auth, (err, data) => {
            callback(err, data);
        });
    }
    connectAuth(callback) {
        r.connect({ db: "auth" }, (err, connection) => {
            this.auth = connection;
            callback();
        });
    }
    ready() {
        let promise = new Promise((resolve, reject) => {
            if (!this.auth) {
                this.connectAuth(resolve);
            }
            else {
                resolve();
            }
        });
        return promise;
    }
}
var Auth = new AuthClass();
exports.Auth = Auth;
