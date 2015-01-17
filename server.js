// Brief description for server.js module.
//
// @module server.js
//----------------------------------------------------------------------------------------------------------------------

var path = require('path');

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

var package = require('./package');

// Auth
var serialization = require('./server/auth/serialization');
var gPlusAuth = require('./server/auth/google-plus');

// Routers
var routeUtils = require('./server/routes/utils');
var cardsRouter = require('./server/routes/cards');
var squadsRouter = require('./server/routes/squads');
var profilesRouter = require('./server/routes/profiles');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

// Build the express app
var app = express();

// Basic request logging
app.use(routeUtils.requestLogger(logger));

// Basic error logging
app.use(routeUtils.errorLogger(logger));

// Passport support
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Set up out authentication support
gPlusAuth.initialize(app);

// Setup static serving
app.use(express.static(path.resolve('./client')));

// Set up our application routes
app.use('/cards', cardsRouter);
app.use('/squads', squadsRouter);
app.use('/profiles', profilesRouter);

// The fallback route, always serves index.html
app.use(routeUtils.serveIndex);

// Start the server
var server = app.listen(3000, function()
{
    var host = server.address().address;
    var port = server.address().port;

    logger.info('FFSquadBuilder server v%s listening at http://%s:%s', package.version, host, port);
});

//----------------------------------------------------------------------------------------------------------------------
