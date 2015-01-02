//----------------------------------------------------------------------------------------------------------------------
// Router for the rest api portion of the website.
//
// @module cards.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
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
// Ships Endpoint
//----------------------------------------------------------------------------------------------------------------------

router.param('ship_id', function(req, resp, next, id)
{
    models.Ship.get(id)
        .then(function(ship)
        {
            req.ship = ship;
            next();
        })
        .catch(models.errors.DocumentNotFound, function()
        {
            resp.status(404).json({ error: "Ship not found." });
        });
});

router.get('/ships', function(req, res)
{
    querymodel.search(models.Ship, req)
        .then(function(ships)
        {
            res.json(ships);
        });
});

router.get('/ships/:ship_id', function(req, resp)
{
    resp.json(req.ship);
});

//----------------------------------------------------------------------------------------------------------------------
// Pilots Endpoint
//----------------------------------------------------------------------------------------------------------------------

router.param('pilot_id', function(req, resp, next, id)
{
    models.Pilot.get(id)
        .then(function(pilot)
        {
            req.pilot = pilot;
            next();
        })
        .catch(models.errors.DocumentNotFound, function()
        {
            resp.status(404).json({ error: "Pilot not found." });
        });
});

router.get('/pilots', function(req, res)
{
    querymodel.search(models.Pilot, req)
        .then(function(pilots)
        {
            res.json(pilots);
        });
});

router.get('/pilots/:pilot_id', function(req, resp)
{
    resp.json(req.pilot);
});

//----------------------------------------------------------------------------------------------------------------------
// Upgrades Endpoint
//----------------------------------------------------------------------------------------------------------------------

router.param('upgrade_id', function(req, resp, next, id)
{
    models.Upgrade.get(id)
        .then(function(upgrade)
        {
            req.upgrade = upgrade;
            next();
        })
        .catch(models.errors.DocumentNotFound, function()
        {
            resp.status(404).json({ error: "Upgrade not found." });
        });
});

router.get('/upgrades', function(req, res)
{
    querymodel.search(models.Upgrade, req)
        .then(function(upgrades)
        {
            res.json(upgrades);
        });
});

router.get('/upgrades/:upgrade_id', function(req, resp)
{
    resp.json(req.upgrade);
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------