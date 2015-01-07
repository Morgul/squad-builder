// ---------------------------------------------------------------------------------------------------------------------
// SquadService
//
// @module squad-service.js
// ---------------------------------------------------------------------------------------------------------------------

function SquadServiceFactory()
{
    function SquadService()
    {
        this.name = undefined;
        this.squad = [];
    } // end SquadService

    return new SquadService();
} // end SquadServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder').service('SquadService', [SquadServiceFactory]);

// ---------------------------------------------------------------------------------------------------------------------