irf.pages.controller("PageBundleCtrl", ["$log","$filter", "$scope", "$state", "$stateParams", "$injector", "$q", "entityManager", "formHelper", "$timeout",
    function($log,$filter,$scope, $state, $stateParams, $injector, $q, entityManager, formHelper, $timeout) {
        var self = this;

        /*var bundle = {
            bundleName: "loans.Screening",
            pages: [{
                pageName: 'lead.LeadGeneration',
                title: 'LeadGeneration'
            }]
        };*/

        $scope.pageNames = [{
            pageName: 'lead.LeadGeneration',
            title: 'Lead Generation',
            repeat:3
        }, {
            pageName: 'CustomerSearch',
            title: 'Customer Search',
            repeat:2
        }, {
            pageName: 'lead.LeadBulkUpload',
            title: 'Bulk Upload',
            repeat:1
        },
        {
            pageName: 'customer.IndividualEnrollment',
            title: 'Applicant',
            repeat:1
        },
        {
            pageName: 'customer.EnterpriseEnrollment',
            title: 'Enterprise Enrollment',
            repeat:1
        }
        ];



        $scope.pages = [];
        $scope.tabs = [];
        for (i in $scope.pageNames) {
            var obj = {};
            
            obj.pageName = $scope.pageNames[i].pageName;
            obj.formName = irf.form($scope.pageNames[i].pageName);
            obj.pageNameHtml = $scope.pageNames[i].pageName.split('.').join('<br/>');
            obj.title = $scope.pageNames[i].title;
            obj.id=$scope.pageNames[i].id;
            obj.repeat=$scope.pageNames[i].repeat;

            obj.error = false;
            try {
                obj.page = $injector.get(irf.page(obj.pageName));
            } catch (e) {
                $log.error(e);
                obj.error = true;
                //$state.go('Page.EngineError', {pageName:$scope.pageName});
            }

            if (obj.page) {
                if (obj.page.type == 'schema-form') {
                    obj.model = entityManager.getModel(obj.pageName);
                    if (angular.isFunction(obj.page.schema)) {
                        var promise = obj.page.schema();
                        promise.then((function(data) {
                            var _obj = obj;
                            return function(data) {
                                _obj.page.schema = data;

                                if (angular.isFunction(_obj.page.form)) {
                                    var promise = _obj.page.form();
                                    promise.then(function(data) {
                                         var obj = _obj;
                                        obj.page.form = data;
                                        $timeout(function() {
                                            obj.page.initialize(obj.page.model, $scope.page.form, $scope.formCtrl);
                                        });
                                    });
                                }
                            };
                        })());
                    }
                    obj.formHelper = formHelper;

                    $scope.$on('irf-sf-init', function(event) {
                        $scope.formCtrl = event.targetScope[$scope.formName];
                    });
                    $scope.$on('sf-render-finished', function(event) {
                        $log.warn("on sf-render-finished on page, rendering layout");
                        setTimeout(renderLayout);
                    });
                } else if (obj.page.type == 'search-list') {
                    obj.model = entityManager.getModel(obj.pageName);
                    obj.page.definition.formName = obj.formName;
                    if (obj.page.offline === true) {
                        obj.page.definition.offline = true;
                        var acts = obj.page.definition.actions = obj.page.definition.actions || {};
                        acts.preSave = function(model, formCtrl, formName) {
                            var deferred = $q.defer();
                            $log.warn('on pageengine preSave');
                            var offlinePromise = obj.page.getOfflinePromise(model);
                            if (offlinePromise && _.isFunction(offlinePromise.then)) {
                                offlinePromise.then(function(out) {
                                    $log.warn('offline results:');
                                    $log.warn(out.body.length);
                                    /* Build results */
                                    var items = obj.page.definition.listOptions.getItems(out.body, out.headers);
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
            $scope.pages.push(obj);

            $log.info(obj.repeat);

            if(obj.repeat>1)
            {
            	$scope.tabs.push(obj);	
            }
        }

        
       

        $scope.removeTab = function (item) {
        var title=$scope.pages.splice(item, 1)[0].title;
        var item=$filter('filter')($scope.tabs, title,true)[0];
        var index=$scope.tabs.indexOf(item);
        var temp=$scope.tabs.splice(index, 1)[0];
        temp.repeat=temp.repeat+1;
        $scope.tabs.push(temp);
        };

        $scope.addTab = function (item) {
        var temp=$scope.tabs.splice(item, 1)[0];
        $log.info($scope.pages);
        $log.info(temp);
        $scope.tabs.push(temp);

        if(temp.repeat>1)
        {
            temp.repeatflag=true;
            $scope.pages.push(temp);
            --temp.repeat
        }

        };
    }
]);