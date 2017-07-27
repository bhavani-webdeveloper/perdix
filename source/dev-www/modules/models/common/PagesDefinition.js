irf.USER_ALLOWED_PAGES = "UserAllowedPages__";
irf.models.factory('PagesDefinition', ["$resource", "$log", "BASE_URL", "$q", "SysQueries", "SessionStore", "Link", "$rootScope",
    function($resource, $log, BASE_URL, $q, SysQueries, SessionStore, Link, $rootScope) {
    var endpoint = BASE_URL + '/api';

    var pDef = {};

    pDef.getPagesDefinition = function(userId, skip_relogin) {
        var deferred = $q.defer();
        SysQueries.query({identifier:'userpages.list', limit: 0, offset: 0, parameters:{user_id:userId}, skip_relogin: skip_relogin || false}).$promise.then(function(records){
            if (records && records.results) {
                var def = {};
                _.each(records.results, function(v, k){
                    var d = {
                        "uri": v.uri,
                        "offline": v.offline,
                        "directAccess": v.directAccess,
                        "title": v.title,
                        "shortTitle": v.shortTitle,
                        "iconClass": v.iconClass,
                        "state": v.state,
                        "stateParams": {
                            "pageName": v.pageName,
                            "pageId": v.pageId
                        },
                        "config": v.pageConfig
                    };
                    if (v.addlParams) {
                        try {
                            var ap = JSON.parse(v.addlParams);
                            angular.extend(d.stateParams, ap);
                        } catch (e) {}
                    }
                    if (v.pageConfig) {
                        try {
                            var pc = JSON.parse(v.pageConfig);
                            d.config = pc;
                        } catch (e) {}
                    }
                    def[v.uri] = d;
                });
                deferred.resolve(def);
            }
        }, deferred.reject);
        return deferred.promise;
    };

    var userAllowedPages = null;
    pDef.getRoleAllowedPageList = function() {
        var deferred = $q.defer();
        var localPages = SessionStore.getItem(irf.USER_ALLOWED_PAGES + SessionStore.getLoginname());
        pDef.getPagesDefinition(SessionStore.getLoginname(), (localPages && localPages.length)).then(function(response){
            delete response.$promise;
            delete response.$resolved;
            userAllowedPages = response;
            SessionStore.setItem(irf.USER_ALLOWED_PAGES + SessionStore.getLoginname(), userAllowedPages);
            deferred.resolve(response);
        }, function(error) {
            $log.error(error);
            if (localPages && localPages.length) {
                $log.info("old menu in use");
                userAllowedPages = localPages;
                deferred.resolve(localPages);
            } else {
                deferred.reject(error);
            }
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
                if (md[i].items) {
                    // SUBMENU
                    md[i].items = __parseMenuDefinition(allowedPages, menuMap, md[i].items);
                    if (!md[i].items || md[i].items.length == 0) {
                        md.splice(i, 1);
                    }
                } else if (md[i].link || md[i].linkId) {
                    // LINKS
                    var l = md[i].link;
                    if (md[i].linkId) {
                        var lid = md[i].linkId;
                        md[i].onClick = function(event, menu) {
                            Link[lid](event, menu, l);
                        };
                    } else {
                        md[i].onClick = function(event, menu) {
                            window.open(event, menu, l);
                        };
                    }
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

    pDef.getUserAllowedPages = function() {
        var deferred = $q.defer();
        if (userAllowedPages) {
            deferred.resolve(userAllowedPages);
        } else {
            pDef.getRoleAllowedPageList().then(function(response){
                deferred.resolve(userAllowedPages);
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

    pDef.convertToUri = function(state, pageName) {
        return (state && state.replace(/\./g, "/")) + (pageName ? "/" + pageName : "");
    }

    pDef.getPageDefinition = function(pageUri) {
        if (userAllowedPages && userAllowedPages[pageUri]) {
            return userAllowedPages[pageUri];
        } else {
            var deferred = $q.defer();
            pDef.getRoleAllowedPageList().then(function(response){
                var p = userAllowedPages[pageUri];
                if (p) {
                    deferred.resolve(p);
                } else {
                    deferred.reject("PAGE_ACCESS_RESTRICTED");
                }
            }, function(errorResponse){
                deferred.reject(errorResponse);
            });
            return deferred.promise;
        }
    };

    pDef.getPageConfig = function(pageUri){
        var deferred = $q.defer();
        var out = null;
        if (userAllowedPages && userAllowedPages[pageUri]){
            if (_.hasIn(userAllowedPages[pageUri], 'stateParams')){
                out = userAllowedPages[pageUri].stateParams;    
            }
            deferred.resolve(out)
        } else {
            pDef.getRoleAllowedPageList().then(function(response){
                var p = userAllowedPages[pageUri];
                if (p) {
                    if (_.hasIn(p, 'stateParams')){
                        out = p.stateParams;
                    }
                    deferred.resolve(out);
                } else {
                    deferred.reject("PAGE_ACCESS_RESTRICTED");
                }
            })
        }
        return deferred.promise;
    }

    pDef.isStateAllowed = function(state, pageName) {
        _.forEach(userAllowedPages, function(v, k){
            if ((!pageName && v.state === state) || (pageName && v.state === state && pageName === v.stateParams.pageName))
                return true;
        });
        return false;
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
            } else {
                deferred.resolve(form);
            }
            $log.info("Profile Page got initialized");
        }, function(){
            deferred.resolve(form);
        });
        return deferred.promise;
    };

    $rootScope.$on('irf-login-success', function() {
        pDef.getRoleAllowedPageList();
    });

    return pDef;
}]);
