// ---------------------------------------------------------------------------------------------------------------------
// BrowserController
//
// @module main.js
// ---------------------------------------------------------------------------------------------------------------------

function BrowserController($scope, _, cardSvc)
{
    $scope.cards = {};
    $scope.types = ['pilots', 'upgrades'];

    cardSvc.initialized
        .then(function()
        {
            $scope.cards.combined = cardSvc.pilots.concat(cardSvc.upgrades);
        });

    $scope.selectCard = function(card)
    {
        if($scope.cards.selected && card.name == $scope.cards.selected.name)
        {
            $scope.cards.selected = undefined;
        }
        else
        {
            $scope.cards.selected = card;
        } // end if
    }; // end selectCard

    $scope.isPilot = function(card)
    {
        return (card || {}).type == undefined;
    }; // end isPilot

    $scope.getCardName = function(canonicalName)
    {
        return cardSvc.getCardName(canonicalName);
    }; // end getCardName

    $scope.isReleased = function(card)
    {
        return cardSvc.isReleased(card);
    }; // end isReleased
} // end BrowserController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder.controllers').controller('BrowserController', [
    '$scope',
    'lodash',
    'CardService',
    BrowserController
]);

// ---------------------------------------------------------------------------------------------------------------------