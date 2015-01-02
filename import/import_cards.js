//----------------------------------------------------------------------------------------------------------------------
// Brief description for import_cards.js module.
//
// @module import_cards.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var Promise = require('bluebird');

var cards = require('./cards');
var models = require('../server/models');

//----------------------------------------------------------------------------------------------------------------------

function processActions(actions)
{
    return _.reduce(actions, function(results, action)
    {
        results.push(action.replace(' ', '-').toLowerCase());
        return results;
    }, []);
} // end processActions

function processFactions(factions)
{
    return _.reduce(factions, function(results, faction)
    {
        results.push(processFaction(faction));
        return results;
    }, []);
} // end processFactions

function processFaction(faction)
{
    switch(faction)
    {
        case 'Galactic Empire':
            return 'empire';

        case 'Rebel Alliance':
            return 'rebel';

        case 'Scum and Villainy':
            return 'scum';
    } // end switch
} // end processFaction

function processManeuvers(maneuvers)
{
    return _.reduce(maneuvers, function(results, row)
    {
        var maneuverRow = _.reduce(row, function(results, manuever)
        {
            switch(manuever)
            {
                case 3:
                    results.push('red');
                    break;
                case 2:
                    results.push('green');
                    break;
                case 1:
                    results.push('white');
                    break;
                case 0:
                    results.push(null);
                    break;
                default:
                    console.error('Unknown maneuver!!!');
                    break;
            } // end switch

            return results;
        }, []);

        results.push(maneuverRow);

        return results;
    }, []);
} // end processManeuvers

function processUpgrades(upgrades)
{
    return _.reduce(upgrades, function(results, upgrade)
    {
        results.push(upgrade.toLowerCase());
        return results;
    }, []);
} // end processUpgrades

function processAddons(addons)
{
    return _.reduce(addons, function(results, addon)
    {
        if(addon.slot)
        {
            results.push(addon.slot.toLowerCase());
        } // end if

        return results;
    }, []);
} // end processAddons

function processCards(expansionCards)
{
    return _.reduce(expansionCards, function(results, card)
    {
        var canonicalName = _.find(cards[card.type + 's'], { name: card.name }).canonical_name;

        results.push({
            name: canonicalName,
            count: card.count,
            type: card.type == 'modification' ? 'upgrade' : (card.type == 'title' ? 'upgrade' : card.type)
        });

        return results;
    }, []);
} // end processCards

//----------------------------------------------------------------------------------------------------------------------

//return;

models.initialize
    .then(function()
    {
        console.log('Clearing the database...');

        models.Ship.removeAll();
        models.Pilot.removeAll();
        models.Upgrade.removeAll();

        console.log('Starting import...');
    })
    .then(function()
    {
    })
    .then(function()
    {
        console.log('  Importing ships...');
        var ships = [];

        _.each(cards.ships, function(ship)
        {
            ships.push(new models.Ship({
                name: ship.name,
                canonicalName: ship.canonical_name,
                factions: processFactions(ship.factions),
                energy: ship.energy,
                attack: ship.attack,
                agility: ship.agility,
                hull: ship.hull,
                shields: ship.shields,
                epicPoints: ship.epic_points,
                actions: processActions(ship.actions),
                maneuvers: processManeuvers(ship.maneuvers),
                size: ship.huge ? 'huge' : (ship.large ? 'large' : 'small')
            }).save());
        });

        return Promise.all(ships);
    })
    .then(function()
    {
        console.log('  Importing pilots...');
        var pilots = [];

        _.each(cards.pilots, function(pilot)
        {
            pilots.push(new models.Pilot({
                name: pilot.name,
                canonicalName: pilot.canonical_name,
                text: pilot.text,
                skill: pilot.skill,
                points: pilot.points,
                sources: pilot.sources,
                faction: processFaction(pilot.faction),
                upgrades: processUpgrades(pilot.slots),
                unique: pilot.unique
            }).save());
        });

        return Promise.all(pilots);
    })
    .then(function()
    {
        console.log('  Importing upgrades...');
        var upgrades = [];

        _.each(cards.upgrades, function(upgrade)
        {
            upgrades.push(new models.Upgrade({
                name: upgrade.name,
                canonicalName: upgrade.canonical_name,
                text: upgrade.text,
                points: upgrade.points,
                attack: upgrade.attack,
                range: upgrade.range,
                ship: upgrade.ship,
                sources: upgrade.sources,
                type: upgrade.slot.toLowerCase(),
                unique: upgrade.unique
            }).save());
        });

        return Promise.all(upgrades);
    })
    .then(function()
    {
        console.log('  Importing modifications...');
        var modifications = [];

        _.each(cards.modifications, function(mod)
        {
            modifications.push(new models.Upgrade({
                name: mod.name,
                canonicalName: mod.canonical_name,
                text: mod.text,
                points: mod.points,
                ship: mod.ship,
                sources: mod.sources,
                type: 'modification',
                size: mod.huge ? 'huge' : (mod.large ? 'large' : mod.small ? 'small' : 'all'),
                grantsUpgrades: processAddons(mod.confersAddons),
                unique: mod.unique
            }).save());
        });

        return Promise.all(modifications);
    })
    .then(function()
    {
        console.log('  Importing titles...');
        var titles = [];

        _.each(cards.titles, function(title)
        {
            titles.push(new models.Upgrade({
                name: title.name,
                canonicalName: title.canonical_name,
                text: title.text,
                points: title.points,
                energy: title.energy,
                ship: title.ship,
                sources: title.sources,
                type: 'title',
                size: title.huge ? 'huge' : (title.large ? 'large' : title.small ? 'small' : 'all'),
                grantsUpgrades: processAddons(title.confersAddons),
                unique: title.unique
            }).save());
        });

        return Promise.all(titles);
    })
    .then(function()
    {
        console.log('  Importing expansions...');
        var expansions = [];

        // Add the released expansions
        _.forIn(cards.manifestByExpansion, function(cards, name)
        {
            expansions.push(new models.Expansion({
                name: name,
                cards: processCards(cards),
                released: !_.contains(cards.unreleasedExpansions, name)
            }).save());
        });

        // Add placeholders for the unreleased expansions
        _.each(cards.unreleasedExpansions, function(name)
        {
            expansions.push(new models.Expansion({
                name: name,
                released: false
            }).save());
        });

        return Promise.all(expansions);
    })
    .then(function()
    {
        console.log('Import Complete.')
    });

//----------------------------------------------------------------------------------------------------------------------