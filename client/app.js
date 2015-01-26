// ---------------------------------------------------------------------------------------------------------------------
// Main Card-crimes app.
//
// @module app.js
// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder', [
        'ngRoute',

        'lodash',
        'ngToast',
        'ui.select',
        'ui.bootstrap',
        'directive.g+signin',

        'squad-builder.services',
        'squad-builder.controllers',
        'squad-builder.directives',
        'squad-builder.utils'
    ])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', { templateUrl: '/home/home.html', controller: 'HomeController' })
            .when('/builder', { templateUrl: '/builder/builder.html', controller: 'BuilderController' })
            .when('/builder/summary', { templateUrl: '/summary/summary.html', controller: 'SummaryController' })
            .when('/builder/:id', { templateUrl: '/builder/builder.html', controller: 'BuilderController' })
            .when('/builder/:id/summary', { templateUrl: '/summary/summary.html', controller: 'SummaryController' })
            .when('/browser', { templateUrl: '/browser/browser.html', controller: 'BrowserController' })
            .when('/profiles/:id', { templateUrl: '/profile/profile.html', controller: 'ProfileController' })
            .when('/collection', { templateUrl: '/collection/collection.html', controller: 'CollectionController' })
            .when('/squads/:id?', { templateUrl: '/squads/squads.html', controller: 'SquadsController' })
            .otherwise({redirectTo: '/'});
    }])
    .config(['uiSelectConfig', function(uiSelectConfig)
    {
        uiSelectConfig.theme = 'bootstrap';
        uiSelectConfig.resetSearchInput = true;
    }]);

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder.services', []);
angular.module('squad-builder.controllers', []);
angular.module('squad-builder.directives', []);
angular.module('squad-builder.utils', []);

// ---------------------------------------------------------------------------------------------------------------------