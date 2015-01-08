// ---------------------------------------------------------------------------------------------------------------------
// ProfileController
//
// @module profile.js
// ---------------------------------------------------------------------------------------------------------------------

function ProfileController($scope, authSvc)
{
    // Define properties
    Object.defineProperties($scope, {
        authorized: { get: function(){ return authSvc.authorized; } },
        user: { get: function(){ return authSvc.user; } }
    });
} // end ProfileController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder').controller('ProfileController', [
    '$scope',
    'authSvc',
    ProfileController
]);

// ---------------------------------------------------------------------------------------------------------------------