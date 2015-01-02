//----------------------------------------------------------------------------------------------------------------------
// Brief description for cards.js module.
//
// @module cards.js
//----------------------------------------------------------------------------------------------------------------------

var fs = require('fs');
var util = require('util');

//----------------------------------------------------------------------------------------------------------------------

// Import manifest data
var manifestStr = fs.readFileSync('./manifest.js','utf8');
eval(manifestStr);

// Import common cards
var commonCardsStr = fs.readFileSync('./cards-common.js','utf8');
eval(commonCardsStr);

// Import english translations
var enCardsStr = fs.readFileSync('./cards-en.js','utf8');
eval(enCardsStr);

// Generate the cards
module.exports.cardLoaders.English();

//console.log('cards:', util.inspect(module.exports.titles, { depth: null, colors: true }));

//----------------------------------------------------------------------------------------------------------------------