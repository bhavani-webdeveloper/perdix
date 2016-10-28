irf.pages.controller("PageBundleCtrl", ["$log", "$filter", "$scope", "$state", "$stateParams", "$injector", "$q", "entityManager", "formHelper", "$timeout",
function($log, $filter, $scope, $state, $stateParams, $injector, $q, entityManager, formHelper, $timeout) {
    var self = this;

    var bundle = {
        bundleName: "loans.Screening",
        pages: [{
            pageName: 'customer.IndividualEnrollment',
            title: 'APPLICANT',
            minimum: 1,
            maximum: 1
        }, {
            pageName: 'customer.IndividualEnrollment',
            title: 'CO_APPLICANT',
            minimum: 0,
            maximum: 2
        }, {
            pageName: 'customer.EnterpriseEnrollment',
            title: 'BUSINESS',
            minimum: 1,
            maximum: 1
        }]
    };

    $scope.pages = [];
    $scope.addTabMenu = [];

    var initializePage = function(bundlePage) {
        var pageObj = {};

        pageObj.pageName = bundlePage.pageName;
        pageObj.pageNameHtml = pageObj.pageName.split('.').join('<br/>');
        pageObj.formName = irf.form(bundlePage.pageName);
        pageObj.title = bundlePage.title;
        pageObj.id = bundlePage.id;
        pageObj.bundlePage = bundlePage;

        pageObj.error = false;
        try {
            pageObj.page = $injector.get(irf.page(pageObj.pageName));
        } catch (e) {
            $log.error(e);
            pageObj.error = true;
            //$state.go('Page.EngineError', {pageName:$scope.pageName});
        }
        if (pageObj.page) {
            if (pageObj.page.type == 'schema-form') {
                pageObj.model = entityManager.getModel(pageObj.pageName);
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
                    $log.warn("on sf-render-finished on page, rendering layout");
                    //setTimeout(renderLayout);
                });
            } else if (pageObj.page.type == 'search-list') {
                pageObj.model = entityManager.getModel(pageObj.pageName);
                pageObj.page.definition.formName = pageObj.formName;
                if (pageObj.page.offline === true) {
                    pageObj.page.definition.offline = true;
                    var acts = pageObj.page.definition.actions = pageObj.page.definition.actions || {};
                    acts.preSave = function(model, formCtrl, formName) {
                        var deferred = $q.defer();
                        $log.warn('on pageengine preSave');
                        var offlinePromise = pageObj.page.getOfflinePromise(model);
                        if (offlinePromise && _.isFunction(offlinePromise.then)) {
                            offlinePromise.then(function(out) {
                                $log.warn('offline results:');
                                $log.warn(out.body.length);
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

    for (i in bundle.pages) {
        bundle.pages[i].minimum = bundle.pages[i].minimum || 0;
        bundle.pages[i].maximum = bundle.pages[i].maximum || 1000;
        var bundlePage = _.cloneDeep(bundle.pages[i]);
        bundlePage.openPagesCount = 0;
        if (bundlePage.minimum > 0) {
            var openPage = initializePage(bundlePage);
            $scope.pages.push(openPage);
            bundlePage.openPagesCount = 1;
        }
        if (bundlePage.minimum == 0 || bundlePage.maximum > 1) {
            $scope.addTabMenu.push(bundlePage);
        }
    }

    $scope.isRemovable = function(bundlePage) {
        return bundlePage.minimum < bundlePage.openPagesCount;
    };

    $scope.removeTab = function(index) {
        var bundlePage = $scope.pages[index].bundlePage;
        --bundlePage.openPagesCount;
        $scope.pages.splice(index, 1);
        if (!$filter('filter')($scope.addTabMenu, {"pageName":bundlePage.pageName}, true).length) {
            $scope.addTabMenu.push(bundlePage);
        }
    };

    $scope.addTab = function(index) {
        var bundlePage = $scope.addTabMenu[index];
        $log.info(bundlePage);
        var openPage = initializePage(bundlePage);
        $scope.pages.push(openPage);
        ++bundlePage.openPagesCount;
        if (bundlePage.maximum <= bundlePage.openPagesCount) {
            $scope.addTabMenu.splice(index, 1);
        }
    };

    $scope.$on('$viewContentLoaded', function(event) {
        $('a[href^="#"]').click(function(e){
            e.preventDefault();
        });
    });
}]);