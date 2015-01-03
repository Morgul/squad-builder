// ---------------------------------------------------------------------------------------------------------------------
// CardService
//
// @module card-service.js
// ---------------------------------------------------------------------------------------------------------------------

function CardServiceFactory($http, Promise, _)
{
    function CardService()
    {
        var self = this;

        // Get a list of all ships
        $http.get('/cards/ships')
            .success(function(data)
            {
                self.ships = data;
            });

        // Get a list of all pilots
        $http.get('/cards/pilots')
            .success(function(data)
            {
                self.pilots = data;
            });

        // Get a list of all upgrades
        $http.get('/cards/upgrades')
            .success(function(data)
            {
                self.upgrades = data;
            });

        // Get a list of all upgrades
        $http.get('/cards/expansions')
            .success(function(data)
            {
                self.expansions = data;
            });
    } // end CardService

    CardService.prototype.filterByFaction = function(faction, list)
    {
        return _.filter(list, function(card)
        {
            return _.contains(card.factions, faction) || card.faction == faction || (_.isEmpty(card.faction) && _.isEmpty(card.factions));
        });
    }; // end filterByFaction

    CardService.prototype.filterByType = function(type)
    {
        return _.filter(this.upgrades, { type: type });
    }; // end filterByType

    CardService.prototype.isReleased = function(card)
    {
        var self = this;
        var released = false;

        // Detect if we're a ship card, and handle us special.
        if(card.maneuvers)
        {
            _.each(this.expansions, function(expansion)
            {
                var ships = _.filter(expansion.cards, { type: 'ship' });
                if(_.find(ships, { name: card.canonicalName }) && expansion.released)
                {
                    released = true;
                } // end if
            });

            return released;
        }
        else
        {
            if(_.isEmpty(card.sources))
            {
                return false;
            }
            else
            {
                _.each(card.sources, function(sourceName)
                {
                    var source = _.find(self.expansions, { name: sourceName });

                    if(source && source.released)
                    {
                        released = true;
                    } // end if
                });

                return released;
            } // end if
        } // end if
    }; // end isReleased

    return new CardService();
} // end CardServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder').service('CardService', [
    '$http',
    '$q',
    'lodash',
    CardServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------