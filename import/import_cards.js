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
        var maneuverRow = _.reduce(row, function(results, manuever, index)
        {
            switch(manuever)
            {
                case 3:
                    results[index] = 'red';
                    break;
                case 2:
                    results[index] = 'green';
                    break;
                case 1:
                    results[index] = 'white';
                    break;
                case 0:
                    results[index] = null;
                    break;
                default:
                    console.error('Unknown maneuver!!!');
                    break;
            } // end switch

            return results;
        }, [null, null, null, null, null, null, null, null]);

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
    if(text && text != '')
    {
        text = text.replace(/xwing-miniatures-font/g, 'xmf');
        text = text.replace(/sloop/g, 'bank');
        text = text.replace(/turnleft/g, 'turn-left');
        text = text.replace(/turnright/g, 'turn-right');
        text = text.replace(/bankleft/g, 'bank-left');
        text = text.replace(/bankright/g, 'bank-right');
        text = text.replace(/barrelroll/g, 'barrel-roll');
        text = text.replace(/kturn/g, 'k-turn');
        text = text.replace(/targetlock/g, 'target-lock');
        text = text.replace(/salvagedastromech/g, 'salvaged-astromech');
        text = text.replace(/card-restriction/g, 'restriction');
        text = text.replace(/<br \/><br \/>/g, '</p><p>');
        text = '<p>' + text;
        text += '</p>';

        return text;
    } // end if
} // end process text

function processGrants(card)
{
    var grants = {
        upgrades: processAddons(card.confersAddons),
        actions: []
    };

    switch(card.name)
    {
        case "Veteran Instincts":
            grants.skill = 2;
            break;

        case "Stealth Device":
            grants.agility = 1;
            break;

        case "Shield Upgrade":
            grants.shields = 1;
            break;

        case "Engine Upgrade":
            grants.actions.push('boost');
            break;

        case "Targeting Computer":
            grants.actions.push('target-lock');
            break;

        case "Hull Upgrade":
            grants.hull = 1;
            break;

        case "Combat Retrofit":
            grants.hull = 2;
            grants.shields = 1;
            break;

        case "Millennium Falcon":
            grants.actions.push('evade');
            break;

        case "Bright Hope":
            grants.energy = 2;
            break;

        case "Quantum Storm":
            grants.energy = 1;
            break;
    } // end switch

    return grants;
} // end processGrants

function processSize(upgrade)
{
    var size = 'all';

    switch(upgrade.name)
    {
        case "Anti-Pursuit Lasers":
            size = 'large';
            break;

        case "Countermeasures":
            size = 'large';
            break;

        case "Tactical Jammer":
            size = 'large';
            break;

        case "Expanded Cargo Hold":
            size = 'huge';
            break;

        case "Raymus Antilles":
            size = 'huge';
            break;

        case "Toryn Farr":
            size = 'huge';
            break;

        case "WED-15 Repair Droid":
            size = 'huge';
            break;

        case "Carlist Rieekan":
            size = 'huge';
            break;

        case "Jan Dodonna":
            size = 'huge';
            break;

        default:
            size = upgrade.huge ? 'huge' : (upgrade.large ? 'large' : (upgrade.small ? 'small' : 'all'))
            break;
    } // end switch

    return size;
} // end processSize

function processExpansionImage(name)
{
    return '/images/expansions/' + name.replace('Expansion Pack', '').replace('-', '').replace(/ /g, '').toLowerCase() + '.png';
} // end processExpansionImage

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
                actions: (pilot.ship_override || {}).actions,
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
                    grants: processGrants(upgrade),
                    size: processSize(upgrade),
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
                ship: findCanonicalName('ship', mod.ship),
                sources: mod.sources,
                faction: processFaction(mod.faction),
                type: 'modification',
                size: processSize(mod),
                grants: processGrants(mod),
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
                size: processSize(title),
                grants: processGrants(title),
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
                image: processExpansionImage(name),
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
                image: processExpansionImage(name),
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