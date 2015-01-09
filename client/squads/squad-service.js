// ---------------------------------------------------------------------------------------------------------------------
// SquadService
//
// @module squad-service.js
// ---------------------------------------------------------------------------------------------------------------------

function SquadServiceFactory($http, Promise, ngToast)
{
    function SquadService()
    {
        this.id = undefined;
        this.name = undefined;
        this.notes = undefined;
        this.squad = [];
    } // end SquadService

    SquadService.prototype.save = function()
    {
        var self = this;

        return new Promise(function(resolve, reject)
        {
            $http.post('/data/squads/', { name: this.name, members: this.squad, notes: this.notes })
                .success(function(data)
                {
                    self.id = data.id;

                    ngToast.create({
                        content: "Squad saved successfully.",
                        dismissButton: true
                    });

                    console.log('id:', self.id, data.id);

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
    SquadServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------