//----------------------------------------------------------------------------------------------------------------------
// The routes for the main application
//
// @module main.js
//----------------------------------------------------------------------------------------------------------------------

var fs = require('fs');
var path = require('path');
var express = require('express');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

var router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Middleware
//----------------------------------------------------------------------------------------------------------------------

// Basic request logging
router.use(function(request, response, next)
{
    logger.info("%s %s '%s'", request.method, response.statusCode, request.url);
    next();
});

// Basic error logging
router.use(function(error, request, response, next)
{
    logger.error("%s '%s': Error encountered: \n%s", request.method, request.url, error.stack);
    next(error);
});

// Host static files.
router.use(express.static(path.resolve('./client')));

// The fallback route, always serves index.html
router.use(function(request, response)
{
    response.setHeader("Content-Type", "text/html");
    fs.createReadStream(path.resolve('./client/index.html')).pipe(response);
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------