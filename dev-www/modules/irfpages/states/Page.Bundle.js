/**
 * ================================================================
 * BundleManager
 * ================================================================
 *
 * BundleManager provides interface to the Bundle Helpers and actions.
 *
 *
 */
irf.pages.factory('BundleManager', ['BundleLog', function(BundleLog){

    var currentInstance = null;

    return {
        register: function(bundlePage){
            var newInstance = {
                createdAt: Date.now(),
                bundlePage: bundlePage
            };
            currentInstance = newInstance;
            return currentInstance;
        },
        /**
         * Returns a new bundleInstance
         *
         * @return {[type]}
         */
        getInstance: function(){
            return currentInstance;
        },
        pushEvent: function(eventName, obj){
            BundleLog.info("Recieved event [" + eventName + "]");
            BundleLog.info(obj);
        }
    }
}]);

irf.pages.factory('BundleLog', ['$log', function($log){
    return {
        "info": function(msg){
            $log.info("<<BUNDLE>> :: " + msg);    
        },
        "debug": function(msg){
            $log.debug("<<BUNDLE>> :: " + msg);    
        },
        "error": function(msg){
            $log.error("<<BUNDLE>> :: " + msg);    
        },
        "warn": function(msg){
            $log.warn("<<BUNDLE>> :: " + msg);    
        }
    }
}]);

irf.pages.controller("PageBundleCtrl", ["$log", "$filter", "$scope", "$state", "$stateParams", "$injector", "$q", "entityManager", "formHelper", "$timeout", "BundleManager", "BundleLog",
function($log, $filter, $scope, $state, $stateParams, $injector, $q, entityManager, formHelper, $timeout, BundleManager, BundleLog) {
    var self = this;

    $scope.pages = [];
    $scope.addTabMenu = [];
    $scope.pageName = $stateParams.pageName;

    var bundle = {
        'pageName': $stateParams.pageName
    }

    var initializePage = function(bundlePage) {
        var pageObj = {};

        pageObj.pageName = bundlePage.pageName;
        pageObj.pageNameHtml = pageObj.pageName.split('.').join('<br/>');
        pageObj.formName = irf.form(bundlePage.pageName);
        pageObj.title = bundlePage.title;
        pageObj.id = bundlePage.id;
        pageObj.bundlePage = bundlePage;
        pageObj.model = {};

        pageObj.error = false;
        try {
            pageObj.page = _.cloneDeep($injector.get(irf.page(pageObj.pageName)));
        } catch (e) {
            BundleLog.error(e);
            pageObj.error = true;
            //$state.go('Page.EngineError', {pageName:$scope.pageName});
        }
        if (pageObj.page) {
            if (pageObj.page.type == 'schema-form') {
                // pageObj.model = entityManager.getModel(pageObj.pageName);
                if (angular.isFunction(pageObj.page.schema)) {
                    var promise = pageObj.page.schema();
                    promise.then((function(data) {
                        var _pageObj = pageObj;
                        return function(data) {
                            _pageObj.page.schema = data;

                            if (angular.isFunction(_pageObj.page.form)) {
                                var promise = _pageObj.page.form();
                                promise.then(function(data) {
                                    var pageObj = _pageObj;
                                    pageObj.page.form = data;
                                    $timeout(function() {
                                        pageObj.page.initialize(pageObj.page.model, $scope.page.form, $scope.formCtrl);
                                    });
                                });
                            }
                        };
                    })());
                }
                pageObj.formHelper = formHelper;

                $scope.$on('irf-sf-init', function(event) {
                    $scope.formCtrl = event.targetScope[$scope.formName];
                });
                $scope.$on('sf-render-finished', function(event) {
                    BundleLog.warn("on sf-render-finished on page, rendering layout");
                    //setTimeout(renderLayout);
                });
            } else if (pageObj.page.type == 'search-list') {
                // pageObj.model = entityManager.getModel(pageObj.pageName);
                pageObj.page.definition.formName = pageObj.formName;
                if (pageObj.page.offline === true) {
                    pageObj.page.definition.offline = true;
                    var acts = pageObj.page.definition.actions = pageObj.page.definition.actions || {};
                    acts.preSave = function(model, formCtrl, formName) {
                        var deferred = $q.defer();
                        BundleLog.warn('on pageengine preSave');
                        var offlinePromise = pageObj.page.getOfflinePromise(model);
                        if (offlinePromise && _.isFunction(offlinePromise.then)) {
                            offlinePromise.then(function(out) {
                                BundleLog.warn('offline results:');
                                BundleLog.warn(out.body.length);
                                /* Build results */
                                var items = pageObj.page.definition.listOptions.getItems(out.body, out.headers);
                                model._result = model._result || {};
                                model._result.items = items;

                                deferred.resolve();
                            }).catch(function() {
                                deferred.reject();
                            });
                        } else {
                            deferred.reject();
                        }
                        return deferred.promise;
                    };
                }
            }
        }
        return pageObj;
    };

    $scope.isRemovable = function(bundlePage) {
        return bundlePage.minimum < bundlePage.openPagesCount;
    };

    $scope.removeTab = function(index) {
        var bundlePage = $scope.pages[index].bundlePage;
        --bundlePage.openPagesCount;
        BundleLog.info($scope.pages.splice(index, 1));
        if ($scope.addTabMenu.indexOf(bundlePage) == -1) {
            $scope.addTabMenu.push(bundlePage);
        }
    };

    $scope.addTab = function(index) {
        var bundlePage = $scope.addTabMenu[index];
        BundleLog.info(bundlePage);
        var openPage = initializePage(bundlePage);
        var insertIndex = -1;
        for (var i = 0; i < $scope.pages.length; i++) {
            if ($scope.pages[i].bundlePage == bundlePage) {
                insertIndex = i;
            }
        };
        if (insertIndex > -1) {
            $scope.pages.splice(insertIndex, 0, openPage);
        } else {
            $scope.pages.push(openPage);
        }
        ++bundlePage.openPagesCount;
        if (bundlePage.maximum <= bundlePage.openPagesCount) {
            BundleLog.debug($scope.addTabMenu.splice(index, 1));
        }
    };

    $scope.$on('$viewContentLoaded', function(event) {
        BundleLog.info('$viewContentLoaded');
        $('a[href^="#"]').click(function(e){
            e.preventDefault();
        });
        
        /* Loading the page */
        try {
            $scope.page = $injector.get(irf.page($scope.pageName));
        } catch (e) {
            BundleLog.error(e);
            $scope.error = true;
            //$state.go('Page.EngineError', {pageName:$scope.pageName});
        }
        /* Done loading the page. */
        BundleLog.info("Bundle Page Loaded");
        var bundleInstance = BundleManager.register($scope.page);
        BundleLog.info("Ready to accept events");


        bundle.pages = $scope.page.bundlePages;

        for (i in bundle.pages) {
            bundle.pages[i].minimum = bundle.pages[i].minimum || 0;
            bundle.pages[i].maximum = bundle.pages[i].maximum || 1000;
            var bundlePage = _.cloneDeep(bundle.pages[i]);
            bundlePage.openPagesCount = 0;
            if (bundlePage.minimum > 0) {
                for (var i = 0; i < bundlePage.minimum; i++) {
                    var openPage = initializePage(bundlePage);
                    $scope.pages.push(openPage);
                };
                bundlePage.openPagesCount = bundlePage.minimum;
            }
            if (bundlePage.maximum > bundlePage.minimum) {
                $scope.addTabMenu.push(bundlePage);
            }
        }
        

    });
}]);
