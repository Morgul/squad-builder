//----------------------------------------------------------------------------------------------------------------------
// Brief description for squads module.
//
// @module squads
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var express = require('express');
var Promise = require('bluebird');

var routeUtils = require('./utils');
var models = require('../models');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

var router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Middleware
//----------------------------------------------------------------------------------------------------------------------

// Basic request logging
router.use(routeUtils.requestLogger(logger));

// Basic error logging
router.use(routeUtils.errorLogger(logger));

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

router.get('/', function(req, res)
{
    res.format({
        json: function()
        {
            if(req.isAuthenticated())
            {
                var squadList = [];
                var squads = req.user.squads;

                _.each(squads, function(squadID)
                {
                    squadList.push(models.Squad.get(squadID));
                });

                Promise.all(squadList)
                    .then(function(squads)
                    {
                        res.json(squads);
                    })
                    .catch(function(error)
                    {
                        logger.error("Failed to get this user's Squads.", error.stack);
                        res.status(500).json(
                            {
                                human: "Failed to get this user's Squads.",
                                message: error.message,
                                stack: error.stack
                            });
                    });
            }
            else
            {
                res.json([]);
            } // end if
        },
        html: function()
        {
            routeUtils.serveIndex(req, res);
        }
    });
});

router.post('/', function(req, resp)
{
    if(req.isAuthenticated())
    {
        // We don't trust the client not to give us an incorrect gPlusID.
        req.body.gPlusID = req.user.gPlusID;

        var squad = new models.Squad(req.body);
        squad.save()
            .then(function()
            {
                //FIXME: There is a bug in jbase that doesn't correctly save arrays that have been pushed to.
                req.user.squads = req.user.squads.concat(squad.id);
                req.user.save()
                    .then(function()
                    {
                        resp.json({ id: squad.id });
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

router.put('/:squad_id', function(req, resp)
{
    if(req.isAuthenticated() && (req.user.gPlusID == req.squad.gPlusID))
    {
        // This implicitly supports partial updates
        _.assign(req.squad, req.body);

        req.squad.save()
            .then(function()
            {
                resp.json({ id: req.squad.id });
            })
            .catch(function(error)
            {
                resp.status(500).json({
                    human:"Failed to save squad.",
                    message: error.message,
                    stack: error.stack
                });
            });
    }
    else
    {
        res.status(403).end();
    } // end if
});

router.get('/:squad_id', function(req, resp)
{
    resp.json(req.squad);
});

router.delete('/:squad_id', function(req, resp)
{
    if(req.isAuthenticated())
    {
        var squadID = req.squad.id;
        req.squad.remove()
            .then(function()
            {
                // Use filter due to stupid jbase bug.
                req.user.squads = _.filter(req.user.squads, function(squad)
                {
                    return squad != squadID;
                });

                req.user.save()
                    .then(function()
                    {
                        resp.end();
                    });
            })
            .catch(function(error)
            {
                resp.status(500).json({
                    human:"Failed to delete squad.",
                    message: error.message,
                    stack: error.stack
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