irf.models.factory('PagesDefinition', ["$resource", "$log", "BASE_URL", "$q", "Queries", "SessionStore",
    function($resource, $log, BASE_URL, $q, Queries, SessionStore){
    var endpoint = BASE_URL + '/api';

    var pDef = $resource(endpoint, null, {
        getPagesJson: {
            method:'GET',
            url:'process/pages.json'
        },
    });

    var userAllowedPages = null;

    pDef.getRoleAllowedPageList = function() {
        var deferred = $q.defer();
        //pDef.getPagesJson().$promise
        Queries.getPagesDefinition(SessionStore.getLoginname())
        .then(function(response){
            delete response.$promise;
            delete response.$resolved;
            userAllowedPages = response;
            deferred.resolve(response);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

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

    pDef.getUserAllowedDefinition = function(menuDef) {
        var deferred = $q.defer();
        if (userAllowedPages) {
            deferred.resolve(parseMenuDefinition(userAllowedPages, menuDef));
        } else {
            pDef.getRoleAllowedPageList().then(function(response){
                deferred.resolve(parseMenuDefinition(userAllowedPages, menuDef));
            }, function(errorResponse){
                deferred.reject(errorResponse);
            });
        }
        return deferred.promise;
    };

    pDef.getRolePageConfig = function(pageUri) {
        var deferred = $q.defer();
        if (userAllowedPages) {
            var p = userAllowedPages[pageUri];
            if (p) {
                deferred.resolve(p.config);
            } else {
                deferred.reject("PAGE_ACCESS_RESTRICTED");
            }
        } else {
            pDef.getRoleAllowedPageList().then(function(response){
                var p = userAllowedPages[pageUri];
                if (p) {
                    deferred.resolve(p.config);
                } else {
                    deferred.reject("PAGE_ACCESS_RESTRICTED");
                }
            }, function(errorResponse){
                deferred.reject(errorResponse);
            });
        }
        return deferred.promise;
    };

    var readOnlyFormCache = {};
    pDef.setReadOnlyByRole = function(pageUri, form) {
        var deferred = $q.defer();
        pDef.getRolePageConfig(pageUri).then(function(config){
            if (config) {
                $log.info("config:");
                $log.info(config);
                if (!readOnlyFormCache[pageUri]) {
                    readOnlyFormCache[pageUri] = form;
                }
                var f = _.cloneDeep(form);
                for (var i = f.length - 1; i >= 0; i--) {
                    f[i].readonly = !!config.readonly;
                };
                deferred.resolve(f);
            } else if (readOnlyFormCache[pageUri]) {
                $log.debug('resetting initial form');
                deferred.resolve(readOnlyFormCache[pageUri]);
            }
            $log.info("Profile Page got initialized");
        });
        return deferred.promise;
    };

    return pDef;
}]);
