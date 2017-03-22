var irfMiddlewares = angular.module('IRFMiddleware', []);

irfMiddlewares.constant('AuthMiddleware', function(){
    return {
        resolve: {
            user: ['$q', 'Auth', '$timeout', function($q, authModel, $timeout) {
                var deferred = $q.defer();

                return deferred.promise;
            }]
        },
        onEnter: ['$state', '$timeout', 'user', function($state, $timeout, user) {
            if(!user) {
                $timeout(function() {
                    $state.go('Login');
                });
            }
        }]
    }
});
