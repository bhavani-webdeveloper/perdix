irf.pages.controller("ReportsCtrl",
    ["$log", "$scope", "SessionStore", "$state", "$stateParams", "$q", "BIReports", "PageHelper", "$timeout", "irfSimpleModal", "formHelper", "irfProgressMessage", "$http",
        function ($log, $scope, SessionStore, $state, $stateParams, $q, BIReports, PageHelper, $timeout, irfSimpleModal, formHelper, irfProgressMessage, $http) {
            $log.info("ReportsCtrl loaded");
            $scope.isDownloadButtonEnabled = SessionStore.getGlobalSetting('reportDashboard.isDownloadButtonEnabled') || 0;
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

            $scope.downloadSummaryReport = function(menuId) {
                PageHelper.showLoader();
                var reportData = {
                    "menu_id": menuId,
                    "user_id": userName,
                    "action": "download"
                };
                irfProgressMessage.pop("Reports", "Downloading Report. Please wait...");
                $http.get(
                    irf.BI_BASE_URL + '/biportal/api/ReportDefinition.php',
                    {params: reportData}, {
                        responseType: 'arraybuffer'
                    }
                ).then(function (response) {
                    var headers = response.headers();
                    if (headers['content-type'].indexOf('json') != -1 && !headers["content-disposition"]) {
                        var decodedString = String.fromCharCode.apply(null, new Uint8Array(response.data));
                        console.log(decodedString);
                        PageHelper.showErrors({
                            data: {
                                error: decodedString
                            }
                        });
                        irfProgressMessage.pop("Reports", "Report download failed.", 5000);
                        return;
                    }
                    var blob = new Blob([response.data], {
                        type: headers['content-type']
                    });
                    if (!$("#reportdownloader").length) {
                        var l = document.createElement('a');
                        l.id = "reportdownloader";
                        document.body.appendChild(l);
                    }
                    $("#reportdownloader").css({
                        "position": "absolute",
                        "height": "-1px",
                        "top": "-100px",
                        "left": "-100px",
                        "width": "-100px",
                    });
                    var link = document.getElementById("reportdownloader");
                    link.href = window.URL.createObjectURL(blob);

                    if (headers["content-disposition"] && headers["content-disposition"].split('filename=').length == 2) {
                        var filename = headers["content-disposition"].split('filename=')[1];
                        link.download = filename.replace(/"/g, "");
                    } else {
                        link.download = SessionStore.getLoginname() + + '_' + moment().format('YYYYMMDDhhmmss');
                    }
                    link.click();
                    irfProgressMessage.pop("Reports", "Report downloaded.", 5000);
                }, function (err) {
                    var decodedString = String.fromCharCode.apply(null, new Uint8Array(err.data));
                    PageHelper.showErrors({
                        data: {
                            error: decodedString
                        }
                    });
                    irfProgressMessage.pop("Reports", "Report download failed.", 5000);
                }).finally(function () {
                    PageHelper.hideLoader();
                });
            }

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