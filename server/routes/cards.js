//----------------------------------------------------------------------------------------------------------------------
// Router for the rest api portion of the website.
//
// @module cards.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var express = require('express');

var routeUtils = require('./utils');
var querymodel = require('../querymodel');
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
            resp.status(404).json({
                human: "Ship not found.",
                message: error.message,
                stack: error.stack
            });
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
            resp.status(404).json({
                human: "Pilot not found.",
                message: error.message,
                stack: error.stack
            });
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
            resp.status(404).json({
                human: "Upgrade not found.",
                message: error.message,
                stack: error.stack
            });
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
// Expansions Endpoint
//----------------------------------------------------------------------------------------------------------------------

router.param('expansion_id', function(req, resp, next, id)
{
    models.Expansion.get(id)
        .then(function(expansion)
        {
            req.expansion = expansion;
            next();
        })
        .catch(models.errors.DocumentNotFound, function()
        {
            resp.status(404).json({
                human: "Expansion not found.",
                message: error.message,
                stack: error.stack
            });
        });
});

router.get('/expansions', function(req, res)
{
    querymodel.search(models.Expansion, req)
        .then(function(expansions)
        {
            res.json(expansions);
        });
});

router.get('/expansions/:expansion_id', function(req, resp)
{
    resp.json(req.expansion);
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------