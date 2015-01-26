// ---------------------------------------------------------------------------------------------------------------------
// SquadsController
//
// @module main.js
// ---------------------------------------------------------------------------------------------------------------------

function SquadsController($scope, $http, _, ngToast, $modal, cardSvc, squadMemberFac)
{
    $http.get('/squads')
        .success(function(data)
        {
            cardSvc.initialized
                .then(function()
                {
                    $scope.squads = [];
                    _.each(data, function(squad)
                    {
                        var points = 0;
                        var faction;
                        $scope.squads.push({
                            name: squad.name,
                            description: squad.description,
                            id: squad.id,
                            wins: squad.wins,
                            losses: squad.losses,
                            draws: squad.draws,
                            members: _.reduce(squad.members, function(results, member)
                            {
                                var squadMember = squadMemberFac();
                                squadMember.pilot = cardSvc.getCard(member.pilot, 'pilot');
                                squadMember.title = cardSvc.getCard(member.title, 'upgrade');
                                squadMember.mod = cardSvc.getCard(member.mod, 'upgrade');

                                _.each(member.upgrades, function(upgrade)
                                {
                                    var card = cardSvc.getCard(upgrade, 'upgrade');
                                    squadMember.upgrades[card.type].push(card);
                                });

                                points += squadMember.points;
                                faction = squadMember.faction;

                                results.push(squadMember);
                                return results;
                            }, []),
                            points: points,
                            faction: faction
                        });
                    });
                });
        });

    //------------------------------------------------------------------------------------------------------------------

    $scope.hasSquads = function(faction)
    {
        return _.filter($scope.squads, { faction: faction }).length > 0;
    }; // end hasSquads

    $scope.save = _.throttle(function(squad)
    {
        $http.put('/squads/' + squad.id, { wins: squad.wins, losses: squad.losses, draws: squad.draws })
            .success(function()
            {
                ngToast.create({
                    content: "Squad updated successfully.",
                    dismissButton: true
                });
            })
            .error(function(data, status)
            {
                var content;
                switch(status)
                {
                    case 403:
                        content = "Unable to update squad, unauthorized.";
                        break;

                    default:
                        content = "Unable to update squad.";
                        break;
                } // end switch

                ngToast.create({
                    content: content,
                    dismissButton: true,
                    class: 'danger'
                });
            });
    }, 1500, { leading: false }); // end save

    $scope.delete = function(squadID)
    {
        var modalInstance = $modal.open({
            templateUrl: 'deleteSquad.html',
            size: 'lg'
        });

        modalInstance.result
            .then(function()
            {
                $http.delete('/squads/' + squadID)
                    .success(function()
                    {
                        _.remove($scope.squads, { id: squadID });

                        ngToast.create({
                            content: "Squad deleted successfully.",
                            dismissButton: true
                        });
                    })
                    .error(function(data, status)
                    {
                        var content;
                        switch(status)
                        {
                            case 403:
                                content = "Unable to delete, unauthorized.";
                                break;

                            default:
                                content = "Unable to delete.";
                                break;
                        } // end switch

                        ngToast.create({
                            content: content,
                            dismissButton: true,
                            class: 'danger'
                        });
                    });
            },
            function() { });
    }; // end delete
} // end SquadsController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder.controllers').controller('SquadsController', [
    '$scope',
    '$http',
    'lodash',
    'ngToast',
    '$modal',
    'CardService',
    'SquadMember',
    SquadsController
]);

// ---------------------------------------------------------------------------------------------------------------------