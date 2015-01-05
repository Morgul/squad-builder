// ---------------------------------------------------------------------------------------------------------------------
// BuilderController
//
// @module main.js
// ---------------------------------------------------------------------------------------------------------------------

function BuilderController($scope, _, cardSvc, squadSvc, squadMember)
{
    $scope.temp = {};
    $scope.faction = 'empire';
    squadSvc.squad = [squadMember($scope)];

    Object.defineProperties($scope, {
        squad: {
            get: function()
            {
                return squadSvc.squad;
            },
            set: function(val)
            {
                squadSvc.squad = val;
            }
        },
        totalPoints: {
            get: function()
            {
                var points = 0;
                _.each(squadSvc.squad, function(member)
                {
                    points += member.points || 0;
                });

                return points;
            }
        }
    });

    // -----------------------------------------------------------------------------------------------------------------
    // Watches
    // -----------------------------------------------------------------------------------------------------------------

    $scope.$watch('faction', function()
    {
        squadSvc.squad = [squadMember($scope)];

        cardSvc.initialized
            .then(function()
            {
                $scope.ships = cardSvc.filterByFaction($scope.faction, cardSvc.ships);
                $scope.upgrades = cardSvc.filterByFaction($scope.faction, cardSvc.upgrades);
            });
    });

    $scope.$watch('squad', function()
    {
        var lastItem = _.last(squadSvc.squad);

        if(lastItem.ship)
        {
            // Check to see if we're a ship with more than one card.
            var companionCard = _.filter($scope.ships, function(ship)
            {
                return (ship.canonicalName == lastItem.ship.canonicalName) && (ship.name != lastItem.ship.name);
            })[0];

            if(companionCard)
            {
                var companion = squadMember($scope);
                companion.ship = companionCard;
                squadSvc.squad.push(companion);
            } // end if

            // We need to add an empty squad member.
            squadSvc.squad.push(squadMember($scope));
        } // end if
    }, true);

    // -----------------------------------------------------------------------------------------------------------------
    // Functions
    // -----------------------------------------------------------------------------------------------------------------

    $scope.removeShip = function(index)
    {
        if(squadSvc.squad[index].ship)
        {
            squadSvc.squad.splice(index, 1);
        } // end if
    }; // end removeShip

    $scope.upgradesByType = function(type)
    {
        return cardSvc.filterByType($scope.faction, type);
    }; // end upgradesByType

    $scope.isReleased = function(card)
    {
        return cardSvc.isReleased(card);
    }; // end isReleased

    $scope.formatName = function(card)
    {
        var name = "";

        if(card.points)
        {
            name += "(" + card.points + ") ";
        } // end if

        name += card.name;

        if(!cardSvc.isReleased(card))
        {
            name += " [Unreleased]";
        } // end if

        return name;
    }; // end formatPilotName
} // end BuilderController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder.controllers').controller('BuilderController', [
    '$scope',
    'lodash',
    'CardService',
    'SquadService',
    'SquadMember',
    BuilderController
]);

// ---------------------------------------------------------------------------------------------------------------------