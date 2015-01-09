// ---------------------------------------------------------------------------------------------------------------------
// SquadService
//
// @module squad-service.js
// ---------------------------------------------------------------------------------------------------------------------

function SquadServiceFactory($http, Promise, ngToast, cardSvc, squadMemberFac)
{
    function SquadService()
    {
        this.id = undefined;
        this.name = undefined;
        this.notes = undefined;
        this.squad = [];
    } // end SquadService

    SquadService.prototype.load = function(id)
    {
        var self = this;
        return new Promise(function(resolve, reject)
        {
            if(id)
            {
                $http.get('/data/squads/' + id)
                    .success(function(data)
                    {
                        cardSvc.initialized
                            .then(function()
                            {
                                self.name = data.name;
                                self.notes = data.notes;
                                self.id = data.id;
                                self.squad = _.reduce(data.members, function(results, member)
                                {
                                    var squadMember = squadMemberFac();
                                    squadMember.pilot = cardSvc.getCard(member.pilot);
                                    squadMember.title = cardSvc.getCard(member.title);
                                    squadMember.mod = cardSvc.getCard(member.mod);

                                    _.each(member.upgrades, function(upgrade)
                                    {
                                        var card = cardSvc.getCard(upgrade);
                                        squadMember.upgrades[card.type].push(card);
                                    });

                                    results.push(squadMember);
                                    return results;
                                }, []);
                            });
                    });
            }
            else
            {
                reject(new Error("Invalid id."));
            } // end if
        });
    };

    SquadService.prototype.save = function()
    {
        var self = this;
        return new Promise(function(resolve, reject)
        {
            $http.post('/data/squads/', { name: self.name, members: self.squad, notes: self.notes })
                .success(function(data)
                {
                    self.id = data.id;

                    ngToast.create({
                        content: "Squad saved successfully.",
                        dismissButton: true
                    });

                    resolve(self.id);
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

                    reject();
                });
        });
    }; // end; save

    return new SquadService();
} // end SquadServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder').service('SquadService', [
    '$http',
    '$q',
    'ngToast',
    'CardService',
    'SquadMember',
    SquadServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------