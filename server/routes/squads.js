//----------------------------------------------------------------------------------------------------------------------
// Brief description for squads module.
//
// @module squads
//----------------------------------------------------------------------------------------------------------------------
var express = require('express');

var querymodel = require('../querymodel');
var models = require('../models');

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

//----------------------------------------------------------------------------------------------------------------------
// Squads Endpoint
//----------------------------------------------------------------------------------------------------------------------

router.post('/', function(req, res)
{
    if(req.isAuthenticated())
    {
        var squad = new models.Squad(req.body);
        squad.save()
            .then(function()
            {
                //FIXME: There is a bug in jbase that doesn't correctly save arrays that have been pushed to.
                req.user.squads = req.user.squads.concat(squad.id);
                req.user.save()
                    .then(function()
                    {
                        res.end();
                    });
            });
    }
    else
    {
        res.status(403).end();
    } // end if
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------