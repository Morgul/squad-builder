// ---------------------------------------------------------------------------------------------------------------------
// BuilderController
//
// @module main.js
// ---------------------------------------------------------------------------------------------------------------------

function BuilderController($scope, $location, $routeParams, _, $modal, authSvc, cardSvc, squadSvc, squadMember)
{
    $scope.newShip = undefined;
    $scope.temp = {};
    $scope.totalCards = {};

    if($routeParams.id)
    {
        squadSvc.load($routeParams.id)
            .catch(function()
            {
                $location.path('/');
            });
    } // end if

    // Calculate the total cards.
    authSvc.initialized
        .then(function()
        {
            _.forIn(authSvc.user.collection, function(count, expansionName)
            {
                var expansion = _.find(cardSvc.expansions, { name: expansionName });
                _.each(expansion.cards, function(card)
                {
                    $scope.totalCards[card.name] = ($scope.totalCards[card.name] || 0) + (count * card.count);
                });
            });
        });

    Object.defineProperties($scope, {
        faction: {
            get: function(){ return $scope._faction || squadSvc.faction; },
            set: function(val){ $scope._faction = val; }
        },
        squad: {
            get: function(){ return squadSvc.squad; },
            set: function(val){ squadSvc.squad = val; }
        },
        squadID: {
            get: function(){ return squadSvc.id; },
            set: function(val){ squadSvc.id = val; }
        },
        squadName: {
            get: function(){ return squadSvc.name; },
            set: function(val){ squadSvc.name = val; }
        },
        squadDescription: {
            get: function(){ return squadSvc.description; },
            set: function(val){ squadSvc.description = val; }
        },
        cardCount: {
            get: function()
            {
                var counts = {};
                _.each($scope.squad, function(member)
                {
                    if(member.ship) { counts[member.ship.canonicalName] = (counts[member.ship.canonicalName] || 0) + 1; }
                    if(member.pilot) { counts[member.pilot.canonicalName] = (counts[member.pilot.canonicalName] || 0) + 1; }
                    if(member.title) { counts[member.title.canonicalName] = (counts[member.title.canonicalName] || 0) + 1; }
                    if(member.mod) { counts[member.mod.canonicalName] = (counts[member.mod.canonicalName] || 0) + 1; }

                    _.each(member.equipped, function(upgrade)
                    {
                        counts[upgrade.canonicalName] = (counts[upgrade.canonicalName] || 0) + 1;
                    });
                })

                return counts;
            }
        },
        totalCards: {
            get: function()
            {
                var counts = {};
                _.forIn(authSvc.user.collection, function(count, expansionName)
                {
                    var expansion = _.find(cardSvc.expansions, { name: expansionName });
                    _.each(expansion.cards, function(card)
                    {
                        counts[card.name] = (counts[card.name] || 0) + (count * card.count);
                    });
                });

                return counts;
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

    $scope.$watch('faction', function(newFaction, oldFaction)
    {
        cardSvc.initialized
            .then(function()
            {
                $scope.ships = cardSvc.filterByFaction($scope.faction, cardSvc.ships);
                $scope.upgrades = cardSvc.filterByFaction($scope.faction, cardSvc.upgrades);
            });

        if(newFaction && newFaction != oldFaction)
        {
            if(newFaction != squadSvc.faction && !_.isEmpty(squadSvc.squad))
            {
                var modalInstance = $modal.open({
                    templateUrl: 'switchFaction.html',
                    size: 'lg'
                });

                modalInstance.result
                    .then(function()
                    {
                        // They clicked yes, so reset everything
                        if(squadSvc.id)
                        {
                            $location.path('/builder');
                        } // end if

                        squadSvc.clear();
                    },
                    function()
                    {
                        // They clicked no, so go back to our last faction.
                        $scope._faction = oldFaction;
                    });
            } // end if
        } // end if
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

    $scope.checkCollection = function(card)
    {
        // Check to see if we have either 0 of a card, or don't know this card. If so, it's an automatic false.
        if(!$scope.totalCards[card.canonicalName])
        {
            return { valid: false, message: "Not in Collection" };
        }
        else if(_.isEmpty((authSvc.user || {}).collection))
        {
            // If you haven't filled in any of your collection, then we assume you don't care, so we assume everything is
            // allowed.
            return { valid: true, message: "Collection not defined" };
        }
        else
        {
            var enough = ($scope.cardCount[card.canonicalName] || 0) <= ($scope.totalCards[card.canonicalName] || 0);
            return {
                valid: enough,
                message: enough ? "Enough in Collection": "Not enough in Collection"
            };
        } // end if
    }; // end checkCollection

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

    $scope.clear = function()
    {
        squadSvc.clear()
            .then(function()
            {
                $location.path('/builder');
            });
    }; // end clear

    $scope.save = function()
    {
        if($scope.isValid())
        {
            squadSvc.save()
                .then(function(id)
                {
                    $location.path('/builder/' + id);
                });
        } // end if
    }; // end save

    $scope.delete = function()
    {
        if($scope.squadName)
        {
            var modalInstance = $modal.open({
                templateUrl: 'deleteSquad.html',
                size: 'lg'
            });

            modalInstance.result
                .then(function()
                {
                    squadSvc.delete()
                        .then(function()
                        {
                            $location.path('/builder');
                        });
                },
                function() { });
        } // end if
    }; // end delete

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
    '$modal',
    'AuthService',
    'CardService',
    'SquadService',
    'SquadMember',
    BuilderController
]);

// ---------------------------------------------------------------------------------------------------------------------