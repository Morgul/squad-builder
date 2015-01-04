// ---------------------------------------------------------------------------------------------------------------------
// SquadMember
//
// @module squad-member.js
// ---------------------------------------------------------------------------------------------------------------------

function SquadMemberFactory(_, cardSvc)
{
    function SquadMember(faction)
    {
        this.faction = faction;
        this.upgrades = {};
    } // end SquadMember

    SquadMember.prototype = {
        get points()
        {
            var points = 0;

            if(this.pilot) { points += this.pilot.points || 0; }
            if(this.title) { points += this.title.points || 0; }
            if(this.mod) { points += this.mod.points || 0; }

            _.forIn(this.upgrades, function(upgrade)
            {
                points += upgrade.points || 0;
            });

            return points;
        },
        get pilots()
        {
            if(this.ship)
            {
                return _.filter(cardSvc.filterByFaction(this.faction, cardSvc.pilots), { ship: this.ship.canonicalName });
            } // end if
        },
        get titles()
        {
            var self = this;
            return _.filter(cardSvc.filterByType('title'), function(title)
            {
                if(self.ship)
                {
                    return (title.ship == undefined) || (title.ship == self.ship.canonicalName);
                } // end if
            });
        },
        get mods()
        {
            var self = this;
            return _.filter(cardSvc.filterByType('modification'), function(mod)
            {
                if(self.ship)
                {
                    return (mod.ship == undefined) || (mod.ship == self.ship.canonicalName);
                } // end if
            });
        },
        get upgradeSlots()
        {
            var slots = [];
            if(this.pilot)
            {
                slots = slots.concat(this.pilot.upgrades);
            } // end if

            if(this.title)
            {
                slots = slots.concat(this.title.grantsUpgrades);
            } // end if

            if(this.mod)
            {
                slots = slots.concat(this.mod.grantsUpgrades);
            } // end if

            _.forIn(this.upgrades, function(upgrade)
            {
                slots = slots.concat(upgrade.grantsUpgrades);
            });

            return slots;
        }
    }; // end prototype

    return function(faction){ return new SquadMember(faction); };
} // end SquadMemberFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder').factory('SquadMember', [
    'lodash',
    'CardService',
    SquadMemberFactory
]);

// ---------------------------------------------------------------------------------------------------------------------