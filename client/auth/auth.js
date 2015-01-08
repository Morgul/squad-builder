// ---------------------------------------------------------------------------------------------------------------------
// AuthService
//
// @module auth.js
// ---------------------------------------------------------------------------------------------------------------------

function AuthServiceFactory($rootScope, $http, Promise)
{
    function AuthService()
    {
        var self = this;
        $rootScope.$on('event:google-plus-signin-success', function (event, authResult)
        {
            // Send login to server
            $http.post('/auth/google/callback', { code: authResult.code })
                .success(function(data)
                {
                    self.user = data;
                });
        });

        $rootScope.$on('event:google-plus-signin-failure', function (event, authResult)
        {
            if(authResult.error == 'user_signed_out')
            {
                self.user = undefined;
            } // end if

            switch(authResult.error)
            {
                case 'user_signed_out':
                    self.user = undefined;
                    break;

                default:
                    console.log('login failed:', authResult);
                    break;
            } // end switch
        });
    } // end AuthService

    AuthService.prototype = {
        get authorized() { return !!this._user; },
        get user() { return this._user; },
        set user(val)
        {
            if(val)
            {
                Object.defineProperty(val, 'display', {
                    get: function(){ return this.nickname || this.displayName || this.email; }
                });
            } // end if

            this._user = val;
        }
    }; // end signOut

    AuthService.prototype.signOut = function()
    {
        $http.post('/auth/logout')
            .success(function()
            {
                // Sign the user out
                window.gapi.auth.signOut();
            });
    }; // end signOut

    return new AuthService();
} // end AuthServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder').service('AuthService', [
    '$rootScope',
    '$http',
    '$q',
    AuthServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------