// ---------------------------------------------------------------------------------------------------------------------
// BuilderController
//
// @module main.js
// ---------------------------------------------------------------------------------------------------------------------

function BuilderController($scope, _, cardSvc, squadMember)
{
    $scope.temp = {};
    $scope.squad = [squadMember($scope)];

    Object.defineProperties($scope, {
        totalPoints: {
            get: function()
            {
                var points = 0;
                _.each($scope.squad, function(member)
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
        $scope.squad = [squadMember($scope)];
        $scope.ships = cardSvc.filterByFaction($scope.faction, cardSvc.ships);
        $scope.upgrades = cardSvc.upgrades;
    });

    $scope.$watch('squad', function()
    {
        var lastItem = _.last($scope.squad);
        if(lastItem.ship)
        {
            $scope.squad.push(squadMember($scope));
        } // end if
    }, true);

    // -----------------------------------------------------------------------------------------------------------------
    // Functions
    // -----------------------------------------------------------------------------------------------------------------

    $scope.removeShip = function(index)
    {
        if($scope.squad[index].ship)
        {
            $scope.squad.splice(index, 1);
        } // end if
    }; // end removeShip

    $scope.upgradesByType = function(type)
    {
        return cardSvc.filterByType(type);
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
    'SquadMember',
    BuilderController
]);

// ---------------------------------------------------------------------------------------------------------------------