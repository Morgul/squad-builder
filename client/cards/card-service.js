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

        // Get all cards
        this.initialized = Promise.all([
            $http.get('/cards/ships')
                .success(function(data)
                {
                    self.ships = data;
                }),
            $http.get('/cards/pilots')
                .success(function(data)
                {
                    self.pilots = data;
                }),
            $http.get('/cards/upgrades')
                .success(function(data)
                {
                    self.upgrades = data;
                }),
            $http.get('/cards/expansions')
                .success(function(data)
                {
                    self.expansions = data;
                })
        ]);
    } // end CardService

    CardService.prototype.filterByFaction = function(faction, list)
    {
        return _.filter(list, function(card)
        {
            return _.contains(card.factions, faction) || card.faction == faction || (_.isEmpty(card.faction) && _.isEmpty(card.factions));
        });
    }; // end filterByFaction

    CardService.prototype.filterByType = function(faction, type)
    {
        return _.filter(this.filterByFaction(faction, this.upgrades), { type: type });
    }; // end filterByType

    CardService.prototype.getCard = function(canonicalName, cardType)
    {
        var card;
        cardType = cardType || 'all';

        if(cardType == 'pilot' || cardType == 'all'){ card = _.find(this.pilots, { canonicalName: canonicalName }); }
        if((cardType == 'ship' || cardType == 'all') && !card) { card = _.find(this.ships, { canonicalName: canonicalName }); }
        if((cardType == 'upgrade' || cardType == 'all') && !card) { card = _.find(this.upgrades, { canonicalName: canonicalName }); }

        return card;
    }; // end getCard

    CardService.prototype.getCardName = function(canonicalName)
    {
        var card = this.getCard(canonicalName) || {};
        return card.name;
    }; // end getCardName

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