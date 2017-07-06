var firebase = require("firebase");

var config = {
  apiKey: "AIzaSyBQFh08QVkzoRGiZkcB3QdVjWSZTg27wlA",
  authDomain: "foodvouchersg.firebaseapp.com",
  databaseURL: "https://foodvouchersg.firebaseio.com",
  projectId: "foodvouchersg",
  storageBucket: "foodvouchersg.appspot.com",
  messagingSenderId: "266445754382"
};

firebase.initializeApp(config);


exports.signin = firebase.auth().signInWithEmailAndPassword("server@gmail.com", "fvsg2017");

exports.cardsRef = firebase.database().ref("cards");