import * as r from "rethinkdb";
import { UserIn } from "../server/models/users";

var test_conn;
var prod_conn;
var auth_conn;

//RethinkDB Connection


async function completeSetup() {
  test_conn = await r.connect({});
  await DBSetup();
  await connectDB();
  await TableSetup();
  await IndexSetup();
  console.log("Done");
}

async function DBSetup() {
  //Creating DB
    await r.dbCreate('production').run(test_conn);

    await r.dbCreate('auth').run(test_conn);
}

async function connectDB() {
  test_conn = await r.connect({});
  prod_conn = await r.connect({ db: "production" });
  auth_conn = await r.connect({ db: "auth" });
}

async function TableSetup() {
  //Tables for Auth
    await r.db('auth').tableCreate('users').run(test_conn);
    
  //Tables for Production
    await r.db('production').tableCreate('card_batches').run(test_conn);
    await r.db('production').tableCreate('cards').run(test_conn);
    await r.db('production').tableCreate('payments').run(test_conn);
    await r.db('production').tableCreate('transactions').run(test_conn);

  //Tables for Test
    await r.db('test').tableCreate('card_batches').run(test_conn);
    await r.db('test').tableCreate('cards').run(test_conn);
    await r.db('test').tableCreate('payments').run(test_conn);
    await r.db('test').tableCreate('transactions').run(test_conn);

}

async function IndexSetup() {
  //Index for Auth
    await r.table('users').indexCreate('accountType').run(auth_conn);
    await r.table('users').indexCreate('email').run(auth_conn);

  //Index for Production
    await r.table('card_batches').indexCreate('charityID').run(prod_conn);

    await r.table('cards').indexCreate('barcode').run(prod_conn);
    await r.table('cards').indexCreate('batchUID').run(prod_conn);
    await r.table('cards').indexCreate('charityID').run(prod_conn);
    await r.table('cards').indexCreate('enabled').run(prod_conn);

    await r.table('payments').indexCreate('from_id').run(prod_conn);
    await r.table('payments').indexCreate('to_id').run(prod_conn);

    await r.table('transactions').indexCreate('cardBarcode').run(prod_conn);
    await r.table('transactions').indexCreate('cardID').run(prod_conn); 
    await r.table('transactions').indexCreate('charityID').run(prod_conn); 
    await r.table('transactions').indexCreate('hawkerID').run(prod_conn);

  //Index for Test
    await r.table('card_batches').indexCreate('charityID').run(test_conn);

    await r.table('cards').indexCreate('barcode').run(test_conn);
    await r.table('cards').indexCreate('batchUID').run(test_conn);
    await r.table('cards').indexCreate('charityID').run(test_conn);
    await r.table('cards').indexCreate('enabled').run(test_conn);

    await r.table('payments').indexCreate('from_id').run(test_conn);
    await r.table('payments').indexCreate('to_id').run(test_conn);

    await r.table('transactions').indexCreate('cardBarcode').run(test_conn);
    await r.table('transactions').indexCreate('cardID').run(test_conn); 
    await r.table('transactions').indexCreate('charityID').run(test_conn); 
    await r.table('transactions').indexCreate('hawkerID').run(test_conn); 

}

async function addAdminAccount() {
  let admin: UserIn = {
    email: "fvsg@gmail.com",
    password: "fvsg2017",
    accountType: "Admin",
    name: "Admin"
  }
  await r.table("users").insert(admin).run(auth_conn);
  console.log("Admin Account Added");
}

async function mySetup() {
  await connectDB();
  await IndexSetup();
  console.log("Done");
}

//completeSetup();
connectDB().then(addAdminAccount);