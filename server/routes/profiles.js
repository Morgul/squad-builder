//----------------------------------------------------------------------------------------------------------------------
// Routes for profiles
//
// @module profiles.js
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
// Profiles Endpoint
//----------------------------------------------------------------------------------------------------------------------

router.param('user_id', function(req, resp, next, id)
{
    models.User.get(id)
        .then(function(user)
        {
            req.profile = user;
            next();
        })
        .catch(models.errors.DocumentNotFound, function(error)
        {
            resp.status(404).json({
                human: "User not found.",
                message: error.message,
                stack: error.stack
            });
        });
});

router.get('/', function(req, resp)
{
    resp.format({
        json: function()
        {
            models.User.filter()
                .then(function(users)
                {
                    resp.json(users);
                });
        },
        html: function()
        {
            routeUtils.serveIndex(req, resp);
        }
    });
});

router.get('/:user_id', function(req, resp)
{
    resp.format({
        json: function()
        {
            resp.json(req.profile);
        },
        html: function()
        {
            routeUtils.serveIndex(req, resp);
        }
    });
});

router.put('/:user_id', function(req, resp)
{
    if(req.isAuthenticated())
    {
        _.assign(req.profile, req.body);

        req.profile.save()
            .then(function()
            {
                resp.status(200).end();
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