/**
 * ================================================================
 * BundleManager
 * ================================================================
 *
 * BundleManager provides interface to the Bundle Helpers and actions.
 *
 *
 */
irf.pages.factory('BundleManager', ['BundleLog', '$injector', '$q', 'formHelper', '$filter', '$log', function(BundleLog, $injector, $q, formHelper, $filter, $log){

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
                BundleLog.info("Pushing event [" + eventName + "]");
                try{
                    currentInstance.bundlePage.eventListeners[eventName](pageObj, currentInstance.bundleModel, obj);
                }catch (e){
                    BundleLog.error("Error pushing event [" + eventName + "]. Proceeding to next event.", e);
                }

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
            BundleLog.info("Broadcasting event [" + eventName + "]");
            for (var i=0; i<pagesLength; i++){
                var page = pages[i].page;
                if (_.hasIn(page, 'eventListeners.' + eventName)) {
                    try {
                        page.eventListeners[eventName](currentInstance.bundleModel, pages[i].model, obj);
                    } catch(e){
                        BundleLog.error("Error while broadcasting event [" + eventName + "]. Target Page Class:[" + pages[i].singlePageDefinition.pageClass + "] , Form Name: [" + pages[i].formName+ "]", e);
                    }

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
            var deferred = $q.defer();

            var pageObj = {};
            definition.bundlePageName = bundlePageName;
            pageObj.singlePageDefinition = _.cloneDeep(definition);
            pageObj.definition = definition;
            pageObj.pageName = definition.pageName;
            pageObj.pageNameHtml = irf.pageNameHtml(pageObj.pageName);
            pageObj.formName = irf.form(definition.pageName) + (pageCounter++);
            pageObj.title = definition.title;
            pageObj.model = model || {};
            pageObj.error = false;
            var pageDefPath = "pages/" + pageObj.pageName.replace(/\./g, "/");
            try {
                pageObj.page = _.cloneDeep($injector.get(irf.page(pageObj.pageName)));
                if (angular.isFunction(pageObj.page.initialize) && shouldInitialize) {
                    pageObj.$initPromise = $q.when(pageObj.page.initialize(pageObj.model, pageObj.page.form, pageObj.formCtrl, pageObj.singlePageDefinition, bundleModel));
                }
                deferred.resolve(pageObj);
            } catch (err) {
                require([pageDefPath], function(pageDefObj){
                    /* Page is loaded, now bind it to pages */
                    $log.info("[REQUIRE] Done loading page(" + pageObj.pageName + ")");
                    irf.pageCollection.loadPage(pageDefObj.pageUID, pageDefObj.dependencies, pageDefObj.$pageFn);
                    try {
                        pageObj.page = _.cloneDeep($injector.get(irf.page(pageObj.pageName)));
                        if (angular.isFunction(pageObj.page.initialize) && shouldInitialize) {
                            pageObj.$initPromise = $q.when(pageObj.page.initialize(pageObj.model, pageObj.page.form, pageObj.formCtrl, pageObj.singlePageDefinition, bundleModel));
                        }
                        deferred.resolve(pageObj);
                    } catch (e) {
                        BundleLog.error("Error initializing page", e);
                        pageObj.error = true;
                    }
                }, function(err){
                    $log.info("[REQUIRE] Error loading page(" + pageObj.pageName + ")");
                    $log.error(err)
                });
            } finally {
                return deferred.promise;
            }
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
        },

        getBundlePagesFormValidity: function(pageClass) {

            var _pageClass = [], formValidity = {}, reqPages, info;

            if(angular.isUndefined(pageClass)){
                return formValidity;
            }

            _pageClass = _pageClass.concat(pageClass);

            if(_pageClass.length === 0){
                return formValidity;
            }

            for(var i=0; i < _pageClass.length; i++){

                reqPages = $filter('filter')(pages, {definition:{'pageClass' : _pageClass[i]}});

                if(!reqPages || reqPages.length === 0)
                    continue;

                angular.forEach(reqPages, function(value, key){
                    info = {};
                    //if the tab is not clicked, formctrl won't be thr
                    if (value.formCtrl) {
                        info['pristine'] = value.formCtrl.$pristine;
                        info['dirty'] = value.formCtrl.$dirty;
                        info['invalid'] = value.formCtrl.$invalid;
                        info['valid'] = value.formCtrl.$valid;
                        info['submitted'] = value.formCtrl.$submitted;
                    }
                    formValidity[value.title + "@" + value.formName] = info;
                });

            }
            return formValidity;
        },

        broadcastSchemaFormValidate: function(pageClass) {
            var _pageClass = [];
            if(angular.isUndefined(pageClass)){
                return;
            }
            _pageClass = _pageClass.concat(pageClass);

            if(_pageClass.length === 0){
                return;
            }
            for(var idx = 0; idx < pages.length; idx++ ){
                if(_pageClass.indexOf(pages[idx].definition.pageClass) > -1  && pages[idx].formCtrl){
                    pages[idx].formCtrl.scope.$broadcast('schemaFormValidate');
                }
            }
        },

        resetBundlePagesFormState: function(pageClass) {
            var _pageClass = [];
            if(angular.isUndefined(pageClass)){
                return;
            }
            _pageClass = _pageClass.concat(pageClass);

            if(_pageClass.length === 0){
                return;
            }
            for (var idx = 0; idx < pages.length; idx++) {
                if (_pageClass.indexOf(pages[idx].definition.pageClass) > -1 && pages[idx].formCtrl) {
                    formHelper.resetFormValidityState(pages[idx].formCtrl);
                }
            }
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
        "error": function(msg, e){
            $log.error("<<BUNDLE>> :: " + msg);
            if (e){
                console.error(e);
            }
        },
        "warn": function(msg, e){
            $log.warn("<<BUNDLE>> :: " + msg);
            if (e){
                console.warn(e);
            }
        }
    }
}]);

irf.pages.controller("PageBundleCtrl",
["$log", "$filter", "$scope", "$state", "$stateParams", "$injector", "$q", "entityManager", "$timeout", "BundleManager", "BundleLog", "OfflineManager", "PageHelper", "Utils", "SessionStore",
function($log, $filter, $scope, $state, $stateParams, $injector, $q, entityManager, $timeout, BundleManager, BundleLog, OfflineManager, PageHelper, Utils, SessionStore) {
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
    };

    var addPagetoPages = function(page){

        var pos = _.sortedIndexBy($scope.pages, page, function(value){
            return value.singlePageDefinition && value.singlePageDefinition.order? value.singlePageDefinition.order:10000;
        });

        $scope.pages.splice(pos,0,page);
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
        var p1 = null;

        if ($scope.bundlePage.onAddNewTab){
            p1 = $scope.bundlePage.onAddNewTab(definition, $scope.bundleModel);
        }

        $q.when(p1)
            .then(function(model){
                BundleManager.createPageObject(definition, model, $scope.bundleModel, true, $scope.pageName).then(function(pageObj) {
                    var openPage = pageObj
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
                })
            });
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

        $q.when()
            .then(function(){
                var deferred = $q.defer();
                try {
                    $scope.bundlePage = _.cloneDeep($injector.get(irf.page($scope.pageName)));
                    deferred.resolve();
                } catch (e) {
                    if (e.message.startsWith("[$injector:unpr] Unknown provider: "+irf.page($scope.pageName)+"Provider")) {
                        $log.error("Loading Dynamic page...");
                        try{
                            var pageDefPath = "pages/" + $scope.pageName.replace(/\./g, "/");
                            PageHelper.showLoader();
                            require([pageDefPath], function(pageDefObj) {
                                $log.info("[REQUIRE] Done loading page(" + $scope.pageName + ")");
                                irf.pageCollection.loadPage(pageDefObj.pageUID, pageDefObj.dependencies, pageDefObj.$pageFn);
                                try {
                                    $scope.bundlePage = _.cloneDeep($injector.get(irf.page($scope.pageName)));
                                    deferred.resolve();
                                    PageHelper.hideLoader();
                                } catch (e) {
                                    $log.error(e);
                                    $scope.error = true;
                                    deferred.reject();
                                }
                            })
                        } catch(e) {
                            $log.error(e);
                            deferred.reject();
                        }
                    } else {
                        $log.error(e);
                        deferred.reject();
                    }
                }
                return deferred.promise;
            })
            .then(function(){
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
                                var iData = initialData[i];
                                var bDef = bundleDefinitionMap[iData.pageClass];

                                var p = BundleManager.createPageObject(bDef, iData.model, $scope.bundleModel, !$scope.bundleModel.$$STORAGE_KEY$$, $scope.pageName).then(function(pageObj) {
                                    var openPage = pageObj;
                                    addPagetoPages(openPage);
                                    if (!openPage.error && openPage.$initPromise) {
                                        initPromises.push(openPage.$initPromise);
                                    }
                                    bDef.openPagesCount++;
                                })
                                initPromises.push(p);

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
                                        var p = BundleManager.createPageObject(bDef, null, $scope.bundleModel, true, $scope.pageName).then(function(pageObj) {
                                            var openPage = pageObj;
                                            addPagetoPages(openPage);
                                            if (!openPage.error && openPage.$initPromise) {
                                                initPromises.push(openPage.$initPromise);
                                            }
                                        });
                                        initPromises.push(p); // Adding the bundle page load (via require) itself to promises list.
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
            })
        return deferredInitBundle.promise;
    };

    var autoSaveOfflineTimer = null;
    var stopAutoSaveOffline = function() {
        if (autoSaveOfflineTimer) {
            clearInterval(autoSaveOfflineTimer);
            autoSaveOfflineTimer = null;
        }
    };

    $scope.initBundle().then(function(){

        stopAutoSaveOffline();
        if ($scope.bundlePage.offline && (n = (n = SessionStore.getGlobalSetting('bundle.offline.autosave.timeout'))? Number(n): 0)) {
            autoSaveOfflineTimer = setInterval(BundleManager.saveOffline, n);
        }
        $timeout(function() {
            $(".bundle-page .irf-tabset ul.nav-tabs").affix({
                offset: {
                    top: 87
                }
            }).on("affix.bs.affix", function() {
                $(".bundle-page .irf-tabset ul.nav-tabs").addClass("bg-tint-theme");
            }).on("affix-top.bs.affix", function() {
                $(".bundle-page .irf-tabset ul.nav-tabs").removeClass("bg-tint-theme");
            });

            $('.bundle-page').bind('destroyed', function() {
                stopAutoSaveOffline();
            });

            if ($scope.pages && $scope.pages.length) {
                $scope.activeIndex = $scope.pages[0].formName;
                BundleManager.initializePageUI($scope.pages[0]);
            }

        });
    });

    $scope.$on('$destroy', function() {
        stopAutoSaveOffline();
    });

}]);
