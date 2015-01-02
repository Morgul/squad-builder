// ---------------------------------------------------------------------------------------------------------------------
// SiteHeader
//
// @module header.js
// ---------------------------------------------------------------------------------------------------------------------

function SiteHeaderFactory()
{
    function SiteHeaderController($scope, $location)
    {
        $scope.isCollapsed = true;

        // Watch the location, and update our 'active' button to match.
        $scope.$watch(function(){ return $location.path(); }, function()
        {
            $scope.location = $location.path().substr(1).split('/')[0];
        });

    } // end SiteHeaderController

    return {
        restrict: 'E',
        scope: true,
        templateUrl: "/header/header.html",
        controller: ['$scope', '$location', SiteHeaderController],
        replace: true
    };
} // end SiteHeaderFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder.directives').directive('siteHeader', [
    SiteHeaderFactory
]);

// ---------------------------------------------------------------------------------------------------------------------