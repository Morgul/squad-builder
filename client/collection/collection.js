// ---------------------------------------------------------------------------------------------------------------------
// CollectionController
//
// @module main.js
// ---------------------------------------------------------------------------------------------------------------------

function CollectionController($scope, $http, _, ngToast, authSvc, cardSvc)
{
    // Define properties
    Object.defineProperties($scope, {
        authorized: { get: function(){ return authSvc.authorized; } },
        user: { get: function(){ return authSvc.user; } },
    });

    $scope.getName = function(canonicalName)
    {
        return cardSvc.getCardName(canonicalName);
    }; // end getName

    $scope.updateCollection = _.throttle(function()
    {
        $http.put('/profiles/' + $scope.user.id, { collection: $scope.user.collection })
            .success(function()
            {
                ngToast.create({
                    content: "Collection updated.",
                    dismissButton: true
                });
            })
            .error(function(data, status)
            {
                var content;
                switch(status)
                {
                    case 403:
                        content = "Unable to update, unauthorized.";
                        break;

                    default:
                        content = "Unable to update.";
                        break;
                } // end switch

                ngToast.create({
                    content: content,
                    dismissButton: true,
                    class: 'danger'
                });
            });
    }, 1000, { leading: false });

    $http.get('/cards/expansions')
        .success(function(data)
        {
            console.log('expansions:', data);
            $scope.expansions = data;
        });
} // end CollectionController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder.controllers').controller('CollectionController', [
    '$scope',
    '$http',
    'lodash',
    'ngToast',
    'AuthService',
    'CardService',
    CollectionController
]);

// ---------------------------------------------------------------------------------------------------------------------