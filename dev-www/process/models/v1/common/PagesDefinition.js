irf.models.factory('PagesDefinition', ["$resource", "$log", "BASE_URL", "$q", "Queries",
    function($resource, $log, BASE_URL, $q, Queries){
    var endpoint = BASE_URL + '/api';

    var pDef = $resource(endpoint, null, {
        getPagesJson: {
            method:'GET',
            url:'process/pages.json'
        },
    });

    pDef.getRoleAllowedPageList = function(userid) {
        //var deferred = $q.defer();
        //return Queries.getPagesDefinition(userid);
        return pDef.getPagesJson().$promise;
        //return deferred.promise;
    };

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
            pDef.getRoleAllowedPageList(userid).then(function(response){
                //$log.info(response);
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
