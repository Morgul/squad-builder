// Brief description for server.js module.
//
// @module server.js
//----------------------------------------------------------------------------------------------------------------------

var express = require('express');

var package = require('./package');
var mainRouter = require('./server/routes/main');
var cardsRouter = require('./server/routes/cards');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

// Build the express app
var app = express();

// Set up our application routes
app.use('/cards', cardsRouter);
app.use('/', mainRouter);

// Start the server
var server = app.listen(3000, function()
{
    var host = server.address().address;
    var port = server.address().port;

    logger.info('FFSquadBuilder server v%s listening at http://%s:%s', package.version, host, port);
});

//----------------------------------------------------------------------------------------------------------------------
