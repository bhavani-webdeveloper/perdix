irf.models.factory('PagesDefinition', ["$resource", "BASE_URL", "$q", function($resource, BASE_URL, $q){
    var endpoint = BASE_URL + '/api';

    var pDef = $resource(endpoint, null, {
        getRoleAllowedPageList: {
            method:'GET',
            url:'process/pages.json'
        },
    });

    var userAllowedPages = null;

    var __parseMenuDefinition = function(allowedPages, menuMap, md) {
        for (var i = md.length - 1; i >= 0; i--) {
            if (angular.isString(md[i])) {
                menuMap[md[i]] = allowedPages[md[i]];
                md[i] = allowedPages[md[i]];

                if (!md[i]) {
                    md.splice(i, 1);
                }
            } else if (angular.isObject(md[i])) {
                md[i].items = __parseMenuDefinition(allowedPages, menuMap, md[i].items);
                if (!md[i].items || md[i].items.length == 0) {
                    md.splice(i, 1);
                }
            }
        }
        return md;
    };

    var parseMenuDefinition = function(allowedPages, menuDef) {
        var md = _.cloneDeep(menuDef);
        if (angular.isObject(md)) {
            var menuMap = {};
            md.items = __parseMenuDefinition(allowedPages, menuMap, md.items);
            md.$menuMap = menuMap;
            return md;
        }
        return null;
    };

    pDef.parseMenuDefinition = parseMenuDefinition;

    pDef.getUserAllowedDefinition = function(userid, menuDef) {
        var deferred = $q.defer();
        if (userAllowedPages) {
            deferred.resolve(parseMenuDefinition(userAllowedPages, menuDef));
        } else {
            // TODO: get role for the user & get real role allowed list
            pDef.getRoleAllowedPageList().$promise.then(function(response){
                delete response.$promise;
                delete response.$resolved;
                userAllowedPages = response;
                deferred.resolve(parseMenuDefinition(userAllowedPages, menuDef));
            }, function(errorResponse){
                deferred.reject(errorResponse);
            });
        }
        return deferred.promise;
    };

    return pDef;
}]);
