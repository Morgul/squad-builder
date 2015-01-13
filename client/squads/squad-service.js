// ---------------------------------------------------------------------------------------------------------------------
// SquadService
//
// @module squad-service.js
// ---------------------------------------------------------------------------------------------------------------------

function SquadServiceFactory($http, Promise, ngToast, authSvc, cardSvc, squadMemberFac)
{
    function SquadService()
    {
        this.id = undefined;
        this.name = undefined;
        this.notes = undefined;
        this.squad = [];
        this.gPlusID = undefined;
    } // end SquadService

    SquadService.prototype = {
        get faction(){ return ((this.squad[0] || {}).faction) || 'empire'; }
    };

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
                                self.gPlusID = data.gPlusID;
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
                    })
                    .error(function(data, status)
                    {
                        var error;
                        switch(status)
                        {
                            case 404:
                                error = new Error("Squad with that id not found.");
                                break;

                            default:
                                error = new Error('Squad failed to load.');
                                error.inner = data;

                                console.error('Squad failed to load:', data);
                                break;
                        } // end switch

                        reject(error);
                    });
            }
            else
            {
                reject(new Error("Invalid id."));
            } // end if
        });
    };

    SquadService.prototype.save = function(insertNew)
    {
        // If we aren't the user who owns the squad, we need to do a force a new squad to be created.
        if(authSvc.user.gPlusID != this.gPlusID)
        {
            insertNew = true;
        } // end if

        var self = this;
        return new Promise(function(resolve, reject)
        {
            var httpPromise;
            var squadDef = { name: self.name, members: self.squad, notes: self.notes };

            // Determine id we are updating, or creating a new one
            if(self.id && !insertNew)
            {
                httpPromise = $http.put('/data/squads/' + self.id, squadDef);
            }
            else
            {
                httpPromise = $http.post('/data/squads/', squadDef);
            } // end if

            // In either event, we do the following
            httpPromise
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

    SquadService.prototype.delete = function()
    {
        var self = this;
        return new Promise(function(resolve, reject)
        {
            if(self.id)
            {
                $http.delete('/data/squads/' + self.id)
                    .success(function()
                    {
                        self.clear();

                        ngToast.create({
                            content: "Squad deleted successfully.",
                            dismissButton: true
                        });

                        resolve();
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

                        reject();
                    });
            }
            else
            {
                reject(new Error("Invalid id."));
            } // end if
        });
    }; // end delete

    SquadService.prototype.clear = function()
    {
        var self = this;

        return new Promise(function(resolve)
        {
            self.name = undefined;
            self.notes = undefined;
            self.id = undefined;
            self.squad = [];

            resolve();
        });
    }; // end clear

    return new SquadService();
} // end SquadServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder').service('SquadService', [
    '$http',
    '$q',
    'ngToast',
    'AuthService',
    'CardService',
    'SquadMember',
    SquadServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------