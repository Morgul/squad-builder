// ---------------------------------------------------------------------------------------------------------------------
// ProfileController
//
// @module profile.js
// ---------------------------------------------------------------------------------------------------------------------

function ProfileController($scope, $http, Promise, $routeParams, ngToast, authSvc, cardSvc)
{
    $scope.profile = {};

    // Define properties
    Object.defineProperties($scope, {
        authorized: { get: function(){ return authSvc.authorized; } },
        user: { get: function(){ return authSvc.user; } },
        isUserProfile: { get: function(){ return authSvc.user.id == $scope.profile.id } },
        score: {
            get: function()
            {
                var score = {
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    total: 0
                };
                _.each($scope.profile.squads, function(squad)
                {
                    score.wins += squad.wins;
                    score.losses += squad.losses;
                    score.draws += squad.draws;

                    // 2 points for a win, 1 point for a draw, 0 points for a loss.
                    score.total += (2 * squad.wins) + (squad.draws);
                });

                return score;
            }
        }
    });

    $scope.topSquads = function()
    {
        return _.sortBy($scope.profile.squads, 'score').reverse().slice(0, 4);
    }; // end topSquads

    $scope.edit = function()
    {
        $scope.editing = true;
    }; // end edit

    $scope.save = function()
    {
        $http.put('/profiles/' + $routeParams.id, { bio: $scope.profile.bio })
            .success(function(data)
            {
                ngToast.create({
                    content: "Profile saved successfully.",
                    dismissButton: true
                });

                $scope.editing = false;
            })
            .error(function(data, status)
            {
                var content;
                switch(status)
                {
                    case 403:
                        content = "Unable to save, unauthorized.";
                        break;

                    default:
                        content = "Unable to save.";
                        break;
                } // end switch

                ngToast.create({
                    content: content,
                    dismissButton: true,
                    class: 'danger'
                });
            });
    }; // end save

    $http.get('/profiles/' + $routeParams.id)
        .success(function(profile)
        {
            var squadPromises = [];

            // Since our list of squads is nothing more than an ID, we need to query for the actual squad data.
            _.each(profile.squads, function(squadID)
            {
                squadPromises.push($http.get('/squads/' + squadID));
            });

            // Once all of the queries have completed, reduce the data to a useful form.
            Promise.all(squadPromises)
                .then(function(squadResponses)
                {
                    profile.squads = _.reduce(squadResponses, function(results, response)
                    {
                        if(response.status == 200)
                        {
                            // Calculate score
                            response.data.score = (2 * response.data.wins) + response.data.draws;

                            // Get Faction
                            response.data.faction = cardSvc.getCard(response.data.members[0].pilot).faction;

                            // Add it to our list of squads
                            results.push(response.data);
                        } // end if

                        return results;
                    }, []);

                    console.log('profile:', profile);
                    $scope.profile = profile;
                });
        });
} // end ProfileController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder').controller('ProfileController', [
    '$scope',
    '$http',
    '$q',
    '$routeParams',
    'ngToast',
    'AuthService',
    'CardService',
    ProfileController
]);

// ---------------------------------------------------------------------------------------------------------------------