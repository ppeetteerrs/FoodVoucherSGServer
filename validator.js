"use strict";
var exports = module.exports;
var cardsRef = require('./firebase.js').cardsRef;

exports.checkCode = function (code, callback) {
  var found = false;
  var array = [];
  cardsRef.once('value', function (snapshot) {
    var found = false;
    snapshot.forEach(function (childSnapshot) {
      array = array.concat(childSnapshot.val());
    });
    console.log("Code: "  + code);
    for(var i=0; i<array.length; i++){
      console.log(i + " " + array[i]);
      if(parseInt(array[i]) == parseInt(code)){
        found = true;
        break;
      }
    }
    callback(found);
  });
}
