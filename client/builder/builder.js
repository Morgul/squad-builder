// ---------------------------------------------------------------------------------------------------------------------
// BuilderController
//
// @module main.js
// ---------------------------------------------------------------------------------------------------------------------

function BuilderController($scope, $location, $routeParams, _, cardSvc, squadSvc, squadMember)
{
    $scope.newShip = undefined;
    $scope.temp = {};
    $scope.faction = 'empire';

    if($routeParams.id)
    {
        squadSvc.load($routeParams.id);
    } // end if

    Object.defineProperties($scope, {
        squad: {
            get: function() { return squadSvc.squad; },
            set: function(val) { squadSvc.squad = val; }
        },
        squadName: {
            get: function() { return squadSvc.name; },
            set: function(val) { squadSvc.name = val; }
        },
        squadNotes: {
            get: function() { return squadSvc.notes; },
            set: function(val) { squadSvc.notes = val; }
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

    $scope.$watch('faction', function(oldFaction, newFaction)
    {
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

        if(lastItem && lastItem.ship)
        {
            // Check to see if we're a ship with more than one card.
            var companionCard = _.filter($scope.ships, function(ship)
            {
                return (ship.canonicalName == lastItem.ship.canonicalName) && (ship.name != lastItem.ship.name);
            })[0];

            if(companionCard)
            {
                var companion = squadMember($scope.faction);
                companion.ship = companionCard;
                squadSvc.squad.push(companion);
            } // end if
        } // end if
    }, true);

    $scope.$watch('newShip', function()
    {
        if($scope.newShip)
        {
            var member = squadMember($scope.faction);
            member.ship = $scope.newShip;
            squadSvc.squad.push(member);
            $scope.newShip = undefined;
        } // end if
    });

    // -----------------------------------------------------------------------------------------------------------------
    // Functions
    // -----------------------------------------------------------------------------------------------------------------

    $scope.isValid = function()
    {
        var valid = !_.isEmpty($scope.squad);
        _.each($scope.squad, function(member)
        {
            if(!member.ship || !member.pilot)
            {
                valid = false;
            } // end if
        });

        return valid;
    }; // end isValid

    $scope.save = function()
    {
        squadSvc.save()
            .then(function(id)
            {
                $location.path('/builder/' + id);
            });
    }; // end save

    $scope.summary = function()
    {
        var path = '/builder/';
        path += $routeParams.id ? $routeParams.id + '/summary' : 'summary';

        $location.path(path);
    }; // end summary

    $scope.removeShip = function(index)
    {
        if(squadSvc.squad[index].ship)
        {
            squadSvc.squad.splice(index, 1);
        } // end if
    }; // end removeShip

    $scope.upgradesByType = function(type, ship)
    {
        return _.filter(cardSvc.filterByType($scope.faction, type), function(upgrade)
        {
            return (!upgrade.ship || upgrade.ship == ship.canonicalName)
                && (upgrade.size == 'all' || upgrade.size == ship.size);
        });
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
    '$location',
    '$routeParams',
    'lodash',
    'CardService',
    'SquadService',
    'SquadMember',
    BuilderController
]);

// ---------------------------------------------------------------------------------------------------------------------