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

router.param('squad_id', function(req, resp, next, id)
{
    models.Squad.get(id)
        .then(function(squad)
        {
            req.squad = squad;
            next();
        })
        .catch(models.errors.DocumentNotFound, function(error)
        {
            resp.status(404).json({
                human: "Squad not found.",
                message: error.message,
                stack: error.stack
            });
        });
});

router.get('/squads', function(req, res)
{
    querymodel.search(models.Squad, req)
        .then(function(squads)
        {
            res.json(squads);
        });
});

router.post('/squads', function(req, resp)
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
                        resp.end();
                    })
                    .catch(function(error)
                    {
                        resp.status(500).json({
                            human:"Failed to save squad.",
                            message: error.message,
                            stack: error.stack
                        });
                    });
            });
    }
    else
    {
        res.status(403).end();
    } // end if
});

router.get('/squads/:squad_id', function(req, resp)
{
    resp.json(req.squad);
});

router.delete('/squads/:squad_id', function(req, resp)
{
    req.squad.delete()
        .then(function()
        {
            res.end();
        })
        .catch(function(error)
        {
            resp.status(500).json({
                human:"Failed to delete squad.",
                message: error.message,
                stack: error.stack
            });
        });
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------