// ---------------------------------------------------------------------------------------------------------------------
// Main Card-crimes app.
//
// @module app.js
// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder', [
        'ngRoute',

        'lodash',
        'ui.bootstrap',

        'squad-builder.services',
        'squad-builder.controllers',
        'squad-builder.directives'
    ])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/builder', { templateUrl: '/builder/builder.html', controller: 'BuilderController' })
            .when('/browser', { templateUrl: '/browser/browser.html', controller: 'BrowserController' })
            .when('/collection', { templateUrl: '/collection/collection.html', controller: 'CollectionController' })
            .when('/squads/:id?', { templateUrl: '/squads/squads.html', controller: 'SquadsController' })
            .otherwise({redirectTo: '/builder'});
    }]);

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder.services', []);
angular.module('squad-builder.controllers', []);
angular.module('squad-builder.directives', []);

// ---------------------------------------------------------------------------------------------------------------------