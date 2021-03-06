// ---------------------------------------------------------------------------------------------------------------------
// SquadMember
//
// @module squad-member.js
// ---------------------------------------------------------------------------------------------------------------------

function SquadMemberFactory($rootScope, _, cardSvc)
{
    function SquadMember(faction)
    {
        var self = this;
        this.faction = faction;
        this.combined = {};

        // This is the structure for storing upgrades. The reasons for this structure are both subtle and devious. If
        // you value your sanity, I recommend you do not delve further into it's mysteries. You have been warned.
        this.upgrades = {
            'astromech': [],
            'bomb': [],
            'cannon': [],
            'cargo': [],
            'crew': [],
            'elite': [],
            'hardpoint': [],
            'illicit': [],
            'missile': [],
            'modification': [],
            'salvaged astromech': [],
            'system': [],
            'team': [],
            'title': [],
            'torpedo': [],
            'turret': []
        };

        // Watch each of the upgrade arrays, so we can recalculate the updates as they are modified. This allows us to
        // handle the recursive case of an upgrade granting new upgrades.
        _.forIn(this.upgrades, function(upgrades, type)
        {
            $rootScope.$watch(function(){ return upgrades; }, function()
            {
                self._update();
            }, true);
        });

        // Build the combined object
        this._buildCombined();
    } // end SquadMember

    SquadMember.prototype = {
        get points()
        {
            var points = 0;

            if(this.pilot) { points += this.pilot.points || 0; }
            if(this.title) { points += this.title.points || 0; }
            if(this.mod) { points += this.mod.points || 0; }

            _.forIn(this.upgrades, function(upgrades)
            {
                _.each(upgrades, function(upgrade) { points += (upgrade || {}).points || 0; });
            });

            return points;
        },

        get equipped()
        {
            var equipped = [];
            _.forIn(this.upgrades, function(upgrades)
            {
                _.each(upgrades, function(upgrade)
                {
                    if(upgrade)
                    {
                        equipped.push(upgrade);
                    } // end if
                });
            });

            return equipped;
        },

        get faction(){ return this._faction || this._pilot.faction },
        set faction(val){ this._faction = val; },

        // Change Tracking
        get pilot(){ return this._pilot; },
        set pilot(val)
        {
            this._pilot = val;

            if(!this._ship)
            {
                this.ship = cardSvc.getCard(val.ship);
            }
            else
            {
                this._update();
            } // end if

        },
        get ship(){ return this._ship; },
        set ship(val) { this._ship = val; this._update()},
        get title(){ return this._title; },
        set title(val) { this._title = val; this._update(); },
        get mod(){ return this._mod; }, set mod(val) { this._mod = val; this._update(); },

        // Cards
        get pilotCards()
        {
            if(this.ship)
            {
                return _.filter(cardSvc.filterByFaction(this.faction, cardSvc.pilots), { ship: this.ship.canonicalName });
            } // end if
        },
        get titleCards()
        {
            var self = this;
            return _.filter(cardSvc.filterByType(this.faction, 'title'), function(title)
            {
                if(self.ship)
                {
                    return self.upgradeAllowed(title);
                } // end if
            });
        },
        get modCards()
        {
            var self = this;
            return _.filter(cardSvc.filterByType(this.faction, 'modification'), function(mod)
            {
                if(self.ship)
                {
                    return self.upgradeAllowed(mod);
                } // end if
            });
        }
    }; // end prototype

    SquadMember.prototype.upgradeCards = function(type)
    {
        var self = this;
        return _.filter(cardSvc.filterByType(this.faction, type), function(upgrade)
        {
            if(self.ship)
            {
                return self.upgradeAllowed(upgrade);
            } // end if
        });
    }; // end upgradeCards

    SquadMember.prototype.upgradeAllowed = function(card)
    {
        // First, we filter by ship name restrictions
        var allowed = ((card.ship == undefined) || (card.ship == this.ship.canonicalName));

        // Next, we restrict by size
        if(allowed)
        {
            if(this.ship.size == 'huge' && card.type == 'modification')
            {
                // Huge ships can only equip _modifications_ with 'Huge ship only.'
                allowed = card.size == 'huge';
            }
            else
            {
                // Large and small ships can equip any upgrade that either has no size restriction, or has a restriction
                // for the same size as the current ship's size.
                allowed = ((!card.size) || (card.size == this.ship.size));
            } // end if
        } // end if

        return allowed;
    }; // end upgradeAllowed

    SquadMember.prototype._update = function()
    {
        this._updateUpgrades();
    }; // end _update

    SquadMember.prototype._updateUpgrades = function()
    {
        var upgradeSlots = [];
        if(this.pilot) { upgradeSlots = upgradeSlots.concat(this.pilot.upgrades); }
        if(this.title) { upgradeSlots = upgradeSlots.concat(this.title.grants.upgrades); }
        if(this.mod) { upgradeSlots = upgradeSlots.concat(this.mod.grants.upgrades); }

        _.forIn(this.upgrades, function(upgrades, type)
        {
            _.each(upgrades, function(upgrade)
            {
                if(upgrade)
                {
                    upgradeSlots = upgradeSlots.concat((upgrade.grants || {}).upgrades || []);
                } // end if
            });
        });

        // Generate an object of the counts of each upgrade type we should have
        var counts = _.countBy(upgradeSlots);

        // Ensure that we have the correct number of items in each upgrade type
        _.forIn(this.upgrades, function(slots, type)
        {
            var count = counts[type] || 0;
            if(slots.length < count)
            {
                while(slots.length < count)
                {
                    slots.push(null);
                } // end while
            }
            else if(slots.length > count)
            {
                var numToRemove = slots.length - count;
                slots.splice(0, numToRemove);
            } // end if
        });
    }; // end _updateUpgrades

    SquadMember.prototype._buildCombined = function()
    {
        var member = this;
        Object.defineProperties(this.combined, {
            name: {
                get: function(){ return (member.pilot || {}).name }
            },
            skill: {
                get: function(){ return (member.pilot || {}).skill }
            },
            ship: {
                get: function(){ return (member.pilot || {}).ship }
            },
            text: {
                get: function(){ return (member.pilot || {}).text }
            },
            faction: {
                get: function(){ return (member.pilot || {}).faction }
            },
            type: {
                get: function(){ return 'combined'; }
            },
            points: {
                get: function() { return member.points; }
            },

            attack: {
                get: function()
                {
                    var attack = 0;

                    if(member.pilot){ attack += member.pilot.attack || member.ship.attack || 0 }
                    if(member.title){ attack += member.title.grants.attack || 0 }
                    if(member.mod){ attack += member.mod.grants.attack || 0 }

                    _.forIn(member.upgrades, function(type)
                    {
                        _.each(member.upgrades[type], function(upgrade)
                        {
                            attack += ((upgrade || {}).grant || {}).attack || 0;
                        });
                    });

                    return attack;
                }
            },
            energy: {
                get: function()
                {
                    var energy = 0;

                    if(member.pilot){ energy += member.pilot.energy || member.ship.energy || 0 }
                    if(member.title){ energy += member.title.grants.energy || 0 }
                    if(member.mod){ energy += member.mod.grants.energy || 0 }

                    _.forIn(member.upgrades, function(type)
                    {
                        _.each(member.upgrades[type], function(upgrade)
                        {
                            energy += ((upgrade || {}).grant || {}).energy || 0;
                        });
                    });

                    return energy;
                }
            },
            agility: {
                get: function()
                {
                    var agility = 0;

                    if(member.pilot){ agility += member.pilot.agility || member.ship.agility || 0 }
                    if(member.title){ agility += member.title.grants.agility || 0 }
                    if(member.mod){ agility += member.mod.grants.agility || 0 }

                    _.forIn(member.upgrades, function(type)
                    {
                        _.each(member.upgrades[type], function(upgrade)
                        {
                            agility += ((upgrade || {}).grant || {}).agility || 0;
                        });
                    });

                    return agility;
                }
            },
            hull: {
                get: function()
                {
                    var hull = 0;

                    if(member.pilot){ hull += member.pilot.hull || member.ship.hull || 0 }
                    if(member.title){ hull += member.title.grants.hull || 0 }
                    if(member.mod){ hull += member.mod.grants.hull || 0 }

                    _.forIn(member.upgrades, function(type)
                    {
                        _.each(member.upgrades[type], function(upgrade)
                        {
                            hull += ((upgrade || {}).grant || {}).hull || 0;
                        });
                    });

                    return hull;
                }
            },
            shields: {
                get: function()
                {
                    var shields = 0;

                    if(member.pilot){ shields += member.pilot.shields || member.ship.shields || 0 }
                    if(member.title){ shields += member.title.grants.shields || 0 }
                    if(member.mod){ shields += member.mod.grants.shields || 0 }

                    _.forIn(member.upgrades, function(type)
                    {
                        _.each(member.upgrades[type], function(upgrade)
                        {
                            shields += ((upgrade || {}).grant || {}).shields || 0;
                        });
                    });

                    return shields;
                }
            },

            upgrades: {
                get: function()
                {
                    var self = this;

                    // Check to see if we have _upgrades and clear it out.
                    if(!this._upgrades){ this._upgrades = []; }
                    this._upgrades.splice(0, this._upgrades.length);

                    var upgradeSlots = [];
                    if(member.ship) { upgradeSlots = upgradeSlots.concat(member.ship.upgrades); }
                    if(member.pilot) { upgradeSlots = upgradeSlots.concat(member.pilot.upgrades); }
                    if(member.title) { upgradeSlots = upgradeSlots.concat(member.title.grants.upgrades); }
                    if(member.mod) { upgradeSlots = upgradeSlots.concat(member.mod.grants.upgrades); }

                    _.forIn(member.upgrades, function(upgrades)
                    {
                        _.each(upgrades, function(upgrade)
                        {
                            if(upgrade) { upgradeSlots = upgradeSlots.concat((upgrade.grants || {}).upgrades || []); }
                        });
                    });

                    // Insert upgrade items
                    _.each(upgradeSlots, function(slot){ self._upgrades.push(slot); });

                    return this._upgrades;
                }
            },
            actions: {
                get: function()
                {
                    var actions = [];
                    if(member.ship) { actions = actions.concat(member.ship.actions); }
                    if(member.pilot) { actions = actions.concat(member.pilot.actions); }
                    if(member.title) { actions = actions.concat(member.title.grants.actions); }
                    if(member.mod) { actions = actions.concat(member.mod.grants.actions); }

                    _.forIn(member.actions, function(upgrades)
                    {
                        _.each(upgrades, function(upgrade)
                        {
                            if(upgrade) { actions = actions.concat(upgrade.grants.upgrades || []); }
                        });
                    });

                    return actions;
                }
            }
        });
    }; // end _buildCombined

    SquadMember.prototype.toJSON = function()
    {
        return {
            pilot: (this.pilot || {}).canonicalName,
            title: (this.title || {}).canonicalName,
            mod: (this.mod || {}).canonicalName,
            upgrades: _.transform(this.upgrades, function(result, upgrades)
            {
                result.results = result.results.concat(_.reduce(upgrades, function(result, upgrade)
                {
                    if(upgrade) { result.push(upgrade.canonicalName); }

                    return result;
                }, []));

                return result;
            }, { results: [] }).results
        }
    }; // end toJSON

    return function(faction){ return new SquadMember(faction); };
} // end SquadMemberFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder').factory('SquadMember', [
    '$rootScope',
    'lodash',
    'CardService',
    SquadMemberFactory
]);

// ---------------------------------------------------------------------------------------------------------------------