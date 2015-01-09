// ---------------------------------------------------------------------------------------------------------------------
// SummaryController
//
// @module summary.js
// ---------------------------------------------------------------------------------------------------------------------

function SummaryController($scope, $location, $routeParams, squadSvc)
{
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
        }
    });

    $scope.back = function()
    {
        var path = '/builder/';
        path += $routeParams.id ? $routeParams.id : '';

        $location.path(path);
    }; // end back
} // end SummaryController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder').controller('SummaryController', [
    '$scope',
    '$location',
    '$routeParams',
    'SquadService',
    SummaryController
]);

// ---------------------------------------------------------------------------------------------------------------------