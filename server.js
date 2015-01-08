// Brief description for server.js module.
//
// @module server.js
//----------------------------------------------------------------------------------------------------------------------

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');

var package = require('./package');

// Auth
var serialization = require('./server/auth/serialization');
var gPlusAuth = require('./server/auth/google-plus');

// Routers
var mainRouter = require('./server/routes/main');
var cardsRouter = require('./server/routes/cards');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

// Build the express app
var app = express();

// Passport support
//app.use(express.cookieParser());
app.use(bodyParser.json());
//app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

// Set up out authentication support
gPlusAuth.initialize(app);

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
