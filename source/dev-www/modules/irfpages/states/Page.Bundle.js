/**
 * ================================================================
 * BundleManager
 * ================================================================
 *
 * BundleManager provides interface to the Bundle Helpers and actions.
 *
 *
 */
irf.pages.factory('BundleManager', ['BundleLog', '$injector', '$q', 'formHelper', function(BundleLog, $injector, $q, formHelper){

    var currentInstance = null;
    var pages = [];
    var pageCounter = 0;

    return {
        register: function(bundlePage, bundleModel, _pages){
            var newInstance = {
                createdAt: Date.now(),
                bundlePage: bundlePage,
                bundleModel: bundleModel
            };
            currentInstance = newInstance;
            pages = _pages;
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
        pushEvent: function(eventName, pageObj, obj){
            BundleLog.info("Recieved event [" + eventName + "]");
            BundleLog.info("Calling event handler");
            if (_.hasIn(currentInstance.bundlePage, 'eventListeners') && _.hasIn(currentInstance.bundlePage.eventListeners, eventName)){
                BundleLog.info("Inside here");
                currentInstance.bundlePage.eventListeners[eventName](pageObj, currentInstance.bundleModel, obj);
            }
        },
        /**
         * Broadcast an event to all pages in the bundle.
         * @param  {[type]} eventName [description]
         * @param  {[type]} obj       [description]
         * @return {[type]}           [description]
         */
        broadcastEvent: function(eventName, obj){
            var pagesLength = pages.length;
            for (var i=0; i<pagesLength; i++){
                var page = pages[i].page;
                if (_.hasIn(page, 'eventListeners.' + eventName)) {
                    page.eventListeners[eventName](currentInstance.bundleModel, pages[i].model, obj);
                }
            }
        },
        /**
         * Creates an empty page object and injects the page definition into it based on the definition.
         * @param definition
            {
                pageName: 'customer.IndividualEnrolment2',
                title: 'CO_APPLICANT',
                pageClass: 'co-applicant', // key
                minimum: 0,
                maximum: 3
            }
         * @param model
         * @param bundleModel
         * @return pageObj
         */
        createPageObject: function(definition, model, bundleModel, shouldInitialize, bundlePageName) {
            var pageObj = {};
            definition.bundlePageName = bundlePageName;
            pageObj.singlePageDefinition = _.cloneDeep(definition);
            pageObj.definition = definition;
            pageObj.pageName = definition.pageName;
            pageObj.pageNameHtml = pageObj.pageName.split('.').join('<br/>');
            pageObj.formName = irf.form(definition.pageName) + (pageCounter++);
            pageObj.title = definition.title;
            pageObj.model = model || {};

            pageObj.error = false;
            try {
                pageObj.page = _.cloneDeep($injector.get(irf.page(pageObj.pageName)));
                if (angular.isFunction(pageObj.page.initialize) && shouldInitialize) {
                    pageObj.$initPromise = $q.when(pageObj.page.initialize(pageObj.model, pageObj.page.form, pageObj.formCtrl, pageObj.singlePageDefinition, bundleModel));
                }
            } catch (e) {
                BundleLog.error(e);
                pageObj.error = true;
            }
            return pageObj;
        },
        initializePageUI: function(pageObj) {
            var deferredUI = $q.defer(); // TODO: deferredUI resolve
            if (pageObj.page) {
                if (pageObj.page.type == 'schema-form') {
                    if (pageObj.page.subType == 'sub-navigation') {
                        boxColumnHook(pageObj.page);
                    }
                    // pageObj.model = entityManager.getModel(pageObj.pageName);
                    if (angular.isFunction(pageObj.page.schema)) {
                        var promise = pageObj.page.schema();
                        promise.then((function(data) {
                            var _pageObj = pageObj;
                            return function(data) {
                                _pageObj.schema = data;
                            };
                        })());
                    } else if (angular.isObject(pageObj.page.schema)) {
                        pageObj.schema = pageObj.page.schema;
                    }
                    // formFn support discontinued
                    pageObj.formHelper = formHelper;
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
                pageObj.page.uiReady = true;
            } else {
                deferredUI.reject();
            }
            deferredUI.promise;
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

irf.pages.controller("PageBundleCtrl",
["$log", "$filter", "$scope", "$state", "$stateParams", "$injector", "$q", "entityManager", "$timeout", "BundleManager", "BundleLog", "OfflineManager", "PageHelper", "Utils", "Queries",
function($log, $filter, $scope, $state, $stateParams, $injector, $q, entityManager, $timeout, BundleManager, BundleLog, OfflineManager, PageHelper, Utils, Queries) {
    var self = this;

    $scope.pages = [];
    $scope.addTabMenu = [];
    $scope.pageName = $stateParams.pageName;
    $scope.pageId = $stateParams.pageId;
    $scope.anchorLnks = [];
    $scope.bundleModel = {};

    var boxColumnHook = function(page){
        var topElements = page.form;
        var topElementsLength = topElements.length;
        for (var i=0;i<topElementsLength; i++){
            var form = topElements[i];
            if (form['type'] == 'box' && !_.hasIn(form, 'colClass')) {
                form.colClass = 'col-sm-12';
            }
        }
    }

    $scope.isRemovable = function(definition) {
        return definition.minimum < definition.openPagesCount && !$scope.bundlePage.readonly;
    };

    $scope.removeTab = function(index, e) {
        e && e.preventDefault();
        Utils.confirm("Are You Sure?").then(function() {
            var removal = function(index) {
                var definition = $scope.pages[index].definition;
                $scope.pages.splice(index, 1);
                --definition.openPagesCount;
                if ($scope.addTabMenu.indexOf(definition) == -1) {
                    $scope.addTabMenu.push(definition);
                }
            };
            var i = index;
            var pageObj = $scope.pages[i];
            if (angular.isFunction(pageObj.page.preDestroy)) {
                var promisedReturn = pageObj.page.preDestroy(pageObj.model, pageObj.page.form, pageObj.formCtrl, pageObj.singlePageDefinition, $scope.bundleModel);
                if (promisedReturn && angular.isFunction(promisedReturn.then)) {
                    promisedReturn.then(function() {
                        removal(i);
                    });
                } else {
                    removal(i);
                }
            } else {
                removal(i);
            }
        });
    };

    $scope.addTab = function(index, e) {
        e && e.preventDefault();
        var definition = $scope.addTabMenu[index];
        var openPage = BundleManager.createPageObject(definition, null, $scope.bundleModel, true, $scope.pageName);
        var insertIndex = -1;
        for (var i = 0; i < $scope.pages.length; i++) {
            if ($scope.pages[i].definition == definition) {
                insertIndex = i+1;
            }
        };
        if (insertIndex > -1) {
            $scope.pages.splice(insertIndex, 0, openPage);
        } else {
            $scope.pages.push(openPage);
        }
        ++definition.openPagesCount;
        if (definition.maximum <= definition.openPagesCount) {
            BundleLog.debug($scope.addTabMenu.splice(index, 1));
        }
        //BundleManager.initializePageUI(openPage);
    };

    $scope.onTabOpen = function(index, e) {
        e && e.preventDefault();
        if (!$scope.pages[index].page.uiReady) {
            BundleManager.initializePageUI($scope.pages[index]);
        }
    };

    /** OFFLINE */
    BundleManager.saveOffline = $scope.saveOffline = function(){
        var deferred = $q.defer();
        var offlineData = {
            pageId: $scope.pageId,
            bundleModel: $scope.bundleModel,
            bundlePages: [],
            $$STORAGE_KEY$$: $scope.bundleModel.$$STORAGE_KEY$$
        };
        for (var i=0; i< $scope.pages.length; i++){
            var initialData = {
                model: $scope.pages[i].model,
                pageClass: $scope.pages[i].definition.pageClass
            }
            initialData.model.$$STORAGE_KEY$$ = $scope.bundleModel.$$STORAGE_KEY$$;
            offlineData.bundlePages.push(initialData);
        }
        var prePromise;
        if (_.isFunction($scope.bundlePage.preSave)) { 
            prePromise = $scope.bundlePage.preSave(offlineData);
        }
        if (prePromise && _.isFunction(prePromise.then)) {
            prePromise.then(function() {
                $scope.bundleModel.$$STORAGE_KEY$$ = OfflineManager.storeItem($scope.pageName, $scope.pageId, offlineData);
                PageHelper.showProgress("offline-save", "Offline record saved/updated", 5000);
                deferred.resolve($scope.bundleModel.$$STORAGE_KEY$$);
            });
        } else {
            $scope.bundleModel.$$STORAGE_KEY$$ = OfflineManager.storeItem($scope.pageName, $scope.pageId, offlineData);
            PageHelper.showProgress("offline-save", "Offline record saved/updated", 5000);
            deferred.resolve($scope.bundleModel.$$STORAGE_KEY$$);
        }
        return deferred.promise;
    };

    BundleManager.updateOffline = function() {
        if ($scope.bundleModel.$$STORAGE_KEY$$) {
            return BundleManager.saveOffline();
        } else {
            return $q.reject();
        }
    };

    var isAutoSaveOffline = true;
    var autoSaveOffline = function(n) {
        if (isAutoSaveOffline) {
            BundleManager.saveOffline();
            $timeout(function() {
                autoSaveOffline(n);
            }, n);
        }
    };

    BundleManager.deleteOffline = function() {
        if ($scope.bundleModel.$$STORAGE_KEY$$) {
            OfflineManager.removeItem($scope.pageName, $scope.bundleModel.$$STORAGE_KEY$$);
            delete $scope.bundleModel.$$STORAGE_KEY$$;
            return $q.resolve();
        } else {
            return $q.reject();
        }
    };

    $scope.loadOfflinePage = function(event) {
        event.preventDefault();
        $state.go('Page.BundleOffline', {pageName: $scope.pageName});
    };
/*
    var pageData = $stateParams.pageData;
    if (pageData && pageData.$offlineData) {
        
        var offlineData = pageData.$offlineData;
        for (var i=0; i<offlineData.pagesData.length; i++){
            $scope.bundlePage.bundlePages.push(_.merge(offlineData.pagesData[i].pageDefinition, {model:offlineData.pagesData[i].model}));
        }
        _.merge(bundleModel, pageData.$offlineData.bundleModel);
        return;
    }*/
    /** END OF OFFLINE */

    var initPromises = [];

    $scope.$on('$viewContentLoaded', function(event) {
        BundleLog.info('$viewContentLoaded');
        $('a[href^="#"]').click(function(e){
            e.preventDefault();
        });
    });

    $scope.initBundle = function() {
        var deferredInitBundle = $q.defer();
        /* Loading the page */
        try {
            $scope.bundlePage = _.cloneDeep($injector.get(irf.page($scope.pageName)));
        } catch (e) {
            BundleLog.error(e);
            $scope.error = true;
            //$state.go('Page.EngineError', {pageName:$scope.pageName});
        }
        /* Done loading the page. */
        BundleLog.info("Bundle Page Loaded");
        var bundleInstance = BundleManager.register($scope.bundlePage, $scope.bundleModel, $scope.pages);
        BundleLog.info("Ready to accept events");

        BundleLog.info("Ready to call pre_pages_initialize");
        var bDefPromise;
        if ($scope.bundlePage.bundleDefinitionPromise) {
            bDefPromise = $scope.bundlePage.bundleDefinitionPromise();
        } else {
            bDefPromise = $scope.bundlePage.bundleDefinition;
        }
        $q.when(bDefPromise).then(function(bundleDefinition) {
            var initPromise;
            var pageData = $stateParams.pageData;
            if (pageData && pageData.$offlineData && pageData.$offlineData.$$STORAGE_KEY$$) { // Loading offline data
                var offlineData = pageData.$offlineData;
                $stateParams.pageId = $scope.pageId = offlineData.pageId;
                $scope.bundleModel = offlineData.bundleModel;
                $scope.bundlePage.bundlePages = offlineData.bundlePages;
                $scope.bundleModel.$$STORAGE_KEY$$ = offlineData.$$STORAGE_KEY$$;
                initPromise = $q.resolve();
            } else { // Loading online data
                initPromise = $q.when($scope.bundlePage.pre_pages_initialize($scope.bundleModel));
            }
            initPromise.then(function(){
                $scope.bundlePage.bundleDefinition = bundleDefinition;
                var bundleDefinitionMap = _.keyBy(bundleDefinition, function(o){
                    o.openPagesCount = 0;
                    return o.pageClass;
                });

                var initialData = $scope.bundlePage.bundlePages; // $scope.bundlePage.bundlePages - initial data
                if (initialData && initialData.length) {
                    for (i in initialData) {
                        var iData = _.cloneDeep(initialData[i]);
                        var bDef = bundleDefinitionMap[iData.pageClass];
                        var openPage = BundleManager.createPageObject(bDef, iData.model, $scope.bundleModel, !$scope.bundleModel.$$STORAGE_KEY$$, $scope.pageName);
                        $scope.pages.push(openPage);
                        if (!openPage.error && openPage.$initPromise) {
                            initPromises.push(openPage.$initPromise);
                        }
                        bDef.openPagesCount++;
                    }
                    for (i in bundleDefinition) {
                        var bDef = bundleDefinition[i];
                        if (bDef.maximum > bDef.openPagesCount) {
                            $scope.addTabMenu.push(bDef);
                        }
                    }
                } else {
                    for (i in bundleDefinition) {
                        var bDef = bundleDefinition[i];
                        if (typeof bDef.minimum === 'undefined') {
                            bDef.minimum = 0;
                        }
                        if (typeof bDef.maximum === 'undefined') {
                            bDef.maximum = 99;
                        }
                        if (bDef.minimum > 0) {
                            for (var i = 0; i < bDef.minimum; i++) {
                                var openPage = BundleManager.createPageObject(bDef, null, $scope.bundleModel, true, $scope.pageName);
                                $scope.pages.push(openPage);
                                if (!openPage.error && openPage.$initPromise) {
                                    initPromises.push(openPage.$initPromise);
                                }
                            };
                            bDef.openPagesCount = bDef.minimum;
                        }
                        if (bDef.maximum > bDef.openPagesCount) {
                            $scope.addTabMenu.push(bDef);
                        }
                    }
                }

                $q.all(initPromises).finally(function(){
                    BundleLog.info("All page init done");
                    $q.when($scope.bundlePage.post_pages_initialize($scope.bundleModel)).finally(deferredInitBundle.resolve);
                    BundleLog.info("Call done post_pages_initialize");
                });
            }, function() {
                BundleLog.info("Bundle init rejected");
            });
        }, function() {
            BundleLog.error("FAILED to load bundle definition. Define 'bundleDefinition[]' or 'bundleDefinitionPromise()' in bundlePage definition");
        });
        BundleLog.info("Call done pre_pages_initialize");
        return deferredInitBundle.promise;
    };

    $scope.initBundle().then(function(){
        if ($scope.pages && $scope.pages.length) {
            BundleManager.initializePageUI($scope.pages[0]);
        }
        Queries.getGlobalSettings('bundle.offline.autosave.timeout').then(function(value) {
            var n = Number(value);
            $timeout(function() {
                isAutoSaveOffline = true;
                autoSaveOffline(n);
            }, n);
        });
    });

    $scope.$on('$destroy', function() {
        isAutoSaveOffline = false;
    });

}]);
