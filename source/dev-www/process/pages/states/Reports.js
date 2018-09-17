irf.pages.controller("ReportsCtrl",
    ["$log", "$scope", "SessionStore", "$state", "$stateParams", "$q", "BIReports", "PageHelper", "$timeout", "irfSimpleModal", "formHelper",
        function ($log, $scope, SessionStore, $state, $stateParams, $q, BIReports, PageHelper, $timeout, irfSimpleModal, formHelper) {
            $log.info("ReportsCtrl loaded");

            var pageData = {};
            var tabData = {
                "menu_name": $stateParams.pageId
            };

            var userName = SessionStore.getLoginname();

            var currentBranch = SessionStore.getBranchId();

            var currentUserRole = SessionStore.getUserRole();

            $scope.currentUserAccessLevel = currentUserRole.accessLevel;

            PageHelper.showLoader();

            var initialize = function () {
                if (_.isObject(pageData)) {
                    if (pageData.filter) {
                        tabData.filter = pageData.filter;
                    }
                }
                $scope.ResultDataSet = [];
                BIReports.reportTabList(tabData).$promise.then(function (response) {
                    $scope.TabDefinition = response;
                    $timeout(function () {
                        $scope.active = 0;
                    });
                }).finally(function () {
                    PageHelper.hideLoader();
                });
            };

			$scope.filterForm = [{
                type: "section",
                "condition":"model.currentUserAccessLevel < 40",
                "htmlClass": "pull-right",
                "items": [{
                    "type": "userbranch",
                    "key": "userbranch",
                    "notitle": true
                }, {
                    "type": "select",
                    "key": "usercentre",
                    "notitle": true,
                    "enumCode": "centre_code",
                    "parentEnumCode": "userbranch",
                    "parentValueExpr": "model.userbranch"
                }, {
                    type: "button",
                    notitle: true,
                    "title": "Apply Filter",
                    "icon": "fa fa-filter",
                    "style": "btn-default btn-xs",
                    "onClick": "actions.applyFilter()"
                }, {
                    type: "button",
                    notitle: true,
                    "title": "Reset",
                    "icon": "fa fa-rotate-left",
                    "style": "btn-default btn-xs",
                    "onClick": "actions.resetFilter()"
                }]
            }, {
                type: "section",
                "condition":"model.currentUserAccessLevel == 40",
                "htmlClass": "pull-right",
                "items": [{
                    "type": "select",
                    "key": "usercentre",
                    "notitle": true,
                    "enumCode": "usercentre",
                }, {
                    type: "button",
                    notitle: true,
                    "title": "Apply Filter",
                    "icon": "fa fa-filter",
                    "style": "btn-default btn-xs",
                    "onClick": "actions.applyFilter()"
                }, {
                    type: "button",
                    notitle: true,
                    "title": "Reset",
                    "icon": "fa fa-rotate-left",
                    "style": "btn-default btn-xs",
                    "onClick": "actions.resetFilter()"
                }]
            }];
            $scope.filterSchema = {
                "type": "object",
                "properties": {
                    "userbranch": {
                        'title': "BRANCH"
                    },
                    "usercentre": {
                        'title': "CENTRE"
                    }

                }
            };
            $scope.filterModel = {
                "userbranch": null,
				"usercentre": null,
				"currentUserAccessLevel": $scope.currentUserAccessLevel
			};

            $scope.formHelper = formHelper;
            $scope.filterFormName = "filterForm";
            $scope.filterFormOptions = {};
            $scope.filterActions = {
                applyFilter: function () {
                    pageData = {
                        filter: [$scope.filterModel.userbranch, $scope.filterModel.usercentre].join(':')
                    }
                    initialize();
                },
                resetFilter: function () {
                    pageData = {};
                    initialize();
                }
            };
			$scope.initFilterForm = function (model, form, formCtrl) {};

            $scope.onTabLoad = function (menuId, activeindex) {
                if (!$scope.ResultDataSet[activeindex]) {
                    PageHelper.showLoader();
                    var reportData = {
                        "menu_id": menuId,
                        "user_id": userName
                    };
                    if (pageData && pageData.filter) {
                        reportData.filter = pageData.filter;
                    }
                    BIReports.reportDataList(reportData).$promise.then(function (response) {
                        var dataset = [];

                        angular.forEach(response.ReportData, function (value, key) {
                            dataset[key] = value;
                            /*if(value.ReportType == 'CHART') {
                            	dataset[key] = value;
                            } else {
                            	dataset[key] = value;
                            }*/
                        });
                        $scope.ResultDataSet[activeindex] = dataset;
                        PageHelper.hideLoader();
                    });
                }
            };

            var drilldownBodyHtml =
                '<div ng-show="model.$showLoader" class="text-center">Loading...</div>' +
                '<div ng-hide="model.$showLoader || model.error" style="overflow:auto">' +
                '<table class="table table-striped table-responsive">' +
                '<tr>' +
                '<th ng-repeat="(key, value) in model.drilldownReport[0]" ng-hide="key.startsWith(\'__\')">{{key|translate}}</th>' +
                '</tr>' +
                '<tr ng-repeat="row in model.drilldownReport">' +
                '<td ng-repeat="(key, value) in row" ng-hide="key.startsWith(\'__\')">{{value}}</td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '<div ng-show="model.error">Error: {{model.error.error}}</div>';

            $scope.reportDrilldown = function (report, record) {
                var drilldownModel = {
                    report: report,
                    $showLoader: true
                };
                var drilldownRequest = {
                    user: userName,
                    reportId: report.unique_id,
                    record: record
                };
                if (pageData && pageData.filter) {
                    drilldownRequest.filter = pageData.filter;
                }
                BIReports.reportDrilldown(drilldownRequest).$promise.then(function (response) {
                    drilldownModel.drilldownReport = response.drilldownReport;
                }, function (error) {
                    drilldownModel.error = error;
                }).finally(function () {
                    drilldownModel.$showLoader = false;
                });
                irfSimpleModal('{{model.report.TableTitle}}', drilldownBodyHtml, drilldownModel, {
                    size: 'lg'
                });
            };

            initialize();

        }
    ]);