// ---------------------------------------------------------------------------------------------------------------------
// CardDirective
//
// @module card-directive.js
// ---------------------------------------------------------------------------------------------------------------------

function CardDirectiveFactory(_, cardSvc)
{
    function CardDirectiveController($scope)
    {
        $scope.$watch('model', function()
        {
            if($scope.model)
            {
                switch($scope.model.type)
                {
                    case undefined:
                        $scope.type = 'pilot';
                        $scope.ship = _.find(cardSvc.ships, { canonicalName: $scope.model.ship });
                        $scope.actions = _.isEmpty($scope.model.actions) ? $scope.ship.actions : $scope.ship.actions.concat($scope.model.actions);
                        break;

                    default:
                        $scope.type = $scope.model.type;
                        $scope.ship = undefined;
                        $scope.actions = undefined;
                        break;
                } // end switch
            } // end if
        });

        $scope.isPilot = function()
        {
            return ($scope.model || {}).type == undefined;
        }; // end isPilot

        $scope.getCardName = function(canonicalName)
        {
            return cardSvc.getCardName(canonicalName);
        }; // end getCardName
    } // end CardDirectiveController

    return {
        restrict: 'E',
        scope: {
            model: "="
        },
        replace: true,
        templateUrl: "/cards/card.html",
        controller: ['$scope', CardDirectiveController]
    };
} // end CardDirectiveFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder').directive('card', [
    'lodash',
    'CardService',
    CardDirectiveFactory
]);

// ---------------------------------------------------------------------------------------------------------------------