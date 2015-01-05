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

function findCanonicalName(type, name)
{
    if(name)
    {
        return _.find(cards[type + 's'], { name: name }).canonical_name;
    } // end if
} // end findCanonicalName

function processCards(expansionCards)
{
    return _.reduce(expansionCards, function(results, card)
    {
        var canonicalName = findCanonicalName(card.type, card.name);

        results.push({
            name: canonicalName,
            count: card.count,
            type: card.type == 'modification' ? 'upgrade' : (card.type == 'title' ? 'upgrade' : card.type)
        });

        return results;
    }, []);
} // end processCards

function processText(text)
{
    text = text.replace(/xwing-miniatures-font/g, 'xmf');
    text = text.replace(/sloop/g, 'bank');
    text = text.replace(/turnleft/g, 'turn-left');
    text = text.replace(/turnright/g, 'turn-right');
    text = text.replace(/bankleft/g, 'bank-left');
    text = text.replace(/bankright/g, 'bank-right');
    text = text.replace(/barrelroll/g, 'barrel-roll');
    text = text.replace(/kturn/g, 'k-turn');
    text = text.replace(/salvagedastromech/g, 'salvaged-astromech');
    text = text.replace(/card-restriction/g, 'restriction');
    text = text.replace(/<br \/><br \/>/g, '</p><p>');
    text = '<p>' + text;
    text += '</p>';

    return text;
} // end process text

//----------------------------------------------------------------------------------------------------------------------

//return;

models.initialize
    .then(function()
    {
        console.log('Starting import...');
    })
    .then(function()
    {
        console.log('  Importing ships...');
        var ships = [];

        _.each(cards.ships, function(ship)
        {
            var shipDef = {
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
            };

            // Must use name due to CR90 having duplicate canonical names
            var promise = models.Ship.filter({name : ship.name})
                .then(function(matches)
                {
                    if(!_.isEmpty(matches))
                    {
                        var model = matches[0];

                        _.assign(model, shipDef);

                        return model;
                    }
                    else
                    {
                        return new models.Ship(shipDef);
                    } // end if
                })
                .then(function(model)
                {
                    model.save();
                });

            ships.push(promise);
        });

        return Promise.all(ships);
    })
    .then(function()
    {
        console.log('  Importing pilots...');
        var pilots = [];

        _.each(cards.pilots, function(pilot)
        {
            var pilotDef = {
                name: pilot.name,
                canonicalName: pilot.canonical_name,
                text: processText(pilot.text || ""),
                skill: pilot.skill,
                ship: findCanonicalName('ship', pilot.ship),
                points: pilot.points,
                energy: (pilot.ship_override || {}).energy,
                attack: (pilot.ship_override || {}).attack,
                agility: (pilot.ship_override || {}).agility,
                hull: (pilot.ship_override || {}).hull,
                shields: (pilot.ship_override || {}).shields,
                sources: pilot.sources,
                faction: processFaction(pilot.faction),
                upgrades: processUpgrades(pilot.slots),
                unique: pilot.unique
            };

            var promise = models.Pilot.filter({name : pilot.name})
                .then(function(matches)
                {
                    if(!_.isEmpty(matches))
                    {
                        var model = matches[0];

                        _.forIn(pilotDef, function(value, key)
                        {
                            if(value !== undefined)
                            {
                                model[key] = value;
                            } // end if
                        });

                        return model;
                    }
                    else
                    {
                        return new models.Pilot(pilotDef);
                    } // end if
                })
                .then(function(model)
                {
                    model.save();
                });

            pilots.push(promise);
        });

        return Promise.all(pilots);
    })
    .then(function()
    {
        console.log('  Importing upgrades...');
        var upgrades = [];

        _.each(cards.upgrades, function(upgrade)
        {
            if( upgrade.canonical_name != 'calc')
            {
                var upgradeDef = {
                    name: upgrade.name,
                    canonicalName: upgrade.canonical_name,
                    text: processText(upgrade.text),
                    points: upgrade.points,
                    attack: upgrade.attack,
                    range: upgrade.range,
                    ship: findCanonicalName('ship', upgrade.ship),
                    sources: upgrade.sources,
                    faction: processFaction(upgrade.faction),
                    type: upgrade.slot.toLowerCase(),
                    limited: upgrade.limited,
                    unique: upgrade.unique
                };

                var promise = models.Upgrade.filter({name : upgrade.name})
                    .then(function(matches)
                    {
                        if(!_.isEmpty(matches))
                        {
                            var model = matches[0];

                            _.forIn(upgradeDef, function(value, key)
                            {
                                if(value !== undefined)
                                {
                                    model[key] = value;
                                } // end if
                            });

                            return model;
                        }
                        else
                        {
                            return new models.Upgrade(upgradeDef);
                        } // end if
                    })
                    .then(function(model)
                    {
                        model.save();
                    });

                upgrades.push(promise);
            } // end if
        });

        return Promise.all(upgrades);
    })
    .then(function()
    {
        console.log('  Importing modifications...');
        var modifications = [];

        _.each(cards.modifications, function(mod)
        {
            var modDef = {
                name: mod.name,
                canonicalName: mod.canonical_name,
                text: processText(mod.text),
                points: mod.points,
                ship: mod.ship,
                sources: mod.sources,
                faction: processFaction(mod.faction),
                type: 'modification',
                size: mod.huge ? 'huge' : (mod.large ? 'large' : mod.small ? 'small' : 'all'),
                grantsUpgrades: processAddons(mod.confersAddons),
                limited: mod.limited,
                unique: mod.unique
            };

            var promise = models.Upgrade.filter({name : mod.name})
                .then(function(matches)
                {
                    if(!_.isEmpty(matches))
                    {
                        var model = matches[0];

                        _.forIn(modDef, function(value, key)
                        {
                            if(value !== undefined)
                            {
                                model[key] = value;
                            } // end if
                        });

                        return model;
                    }
                    else
                    {
                        return new models.Upgrade(modDef);
                    } // end if
                })
                .then(function(model)
                {
                    model.save();
                });

            modifications.push(promise);
        });

        return Promise.all(modifications);
    })
    .then(function()
    {
        console.log('  Importing titles...');
        var titles = [];

        _.each(cards.titles, function(title)
        {
            var titleDef = {
                name: title.name,
                canonicalName: title.canonical_name,
                text: processText(title.text),
                points: title.points,
                energy: title.energy,
                ship: findCanonicalName('ship', title.ship),
                sources: title.sources,
                faction: processFaction(title.faction),
                type: 'title',
                size: title.huge ? 'huge' : (title.large ? 'large' : title.small ? 'small' : 'all'),
                grantsUpgrades: processAddons(title.confersAddons),
                limited: title.limited,
                unique: title.unique
            };

            var promise = models.Upgrade.filter({name : title.name})
                .then(function(matches)
                {
                    if(!_.isEmpty(matches))
                    {
                        var model = matches[0];

                        _.forIn(titleDef, function(value, key)
                        {
                            if(value !== undefined)
                            {
                                model[key] = value;
                            } // end if
                        });

                        return model;
                    }
                    else
                    {
                        return new models.Upgrade(titleDef);
                    } // end if
                })
                .then(function(model)
                {
                    model.save();
                });

            titles.push(promise);
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
            var expansionDef = {
                name: name,
                cards: processCards(cards),
                released: !_.contains(cards.unreleasedExpansions, name)
            };

            var promise = models.Expansion.filter({name : name})
                .then(function(matches)
                {
                    if(!_.isEmpty(matches))
                    {
                        var model = matches[0];

                        _.forIn(expansionDef, function(value, key)
                        {
                            if(value !== undefined)
                            {
                                model[key] = value;
                            } // end if
                        });

                        return model;
                    }
                    else
                    {
                        return new models.Expansion(expansionDef);
                    } // end if
                })
                .then(function(model)
                {
                    model.save();
                });

            expansions.push(promise);
        });

        // Add placeholders for the unreleased expansions
        _.each(cards.unreleasedExpansions, function(name)
        {
            var expansionDef = {
                name: name,
                released: false
            };

            var promise = models.Expansion.filter({name : name})
                .then(function(matches)
                {
                    if(!_.isEmpty(matches))
                    {
                        var model = matches[0];

                        _.forIn(expansionDef, function(value, key)
                        {
                            if(value !== undefined)
                            {
                                model[key] = value;
                            } // end if
                        });

                        return model;
                    }
                    else
                    {
                        return new models.Expansion(expansionDef);
                    } // end if
                })
                .then(function(model)
                {
                    model.save();
                });

            expansions.push(promise);
        });

        return Promise.all(expansions);
    })
    .then(function()
    {
        console.log('Import Complete.')
    });

//----------------------------------------------------------------------------------------------------------------------