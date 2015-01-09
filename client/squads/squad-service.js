// ---------------------------------------------------------------------------------------------------------------------
// SquadService
//
// @module squad-service.js
// ---------------------------------------------------------------------------------------------------------------------

function SquadServiceFactory($http, ngToast)
{
    function SquadService()
    {
        this.name = undefined;
        this.notes = undefined;
        this.squad = [];
    } // end SquadService

    SquadService.prototype.save = function()
    {
        console.log('name:', this.name);
        $http.post('/data/squads/', { name: this.name, members: this.squad, notes: this.notes })
            .success(function()
            {
                ngToast.create({
                    content: "Squad saved successfully.",
                    dismissButton: true
                });
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
    }; // end; save

    return new SquadService();
} // end SquadServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder').service('SquadService', [
    '$http',
    'ngToast',
    SquadServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------