// ---------------------------------------------------------------------------------------------------------------------
// SummaryController
//
// @module summary.js
// ---------------------------------------------------------------------------------------------------------------------

function SummaryController($scope, $location, squadSvc)
{
    Object.defineProperties($scope, {
        squad: {
            get: function() { return squadSvc.squad; },
            set: function(val) { squadSvc.squad = val; }
        },
        squadName: {
            get: function() { return squadSvc.name; },
            set: function(val) { squadSvc.name = val; }
        }
    });

    $scope.back = function()
    {
        $location.path('/builder');
    }; // end back
} // end SummaryController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder').controller('SummaryController', [
    '$scope',
    '$location',
    'SquadService',
    SummaryController
]);

// ---------------------------------------------------------------------------------------------------------------------