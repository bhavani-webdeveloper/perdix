irf.pages.controller("ReportsCtrl",
["$log", "$scope", "SessionStore", "$state", "$stateParams", "$q", "BIReports", "PageHelper", "$timeout", "irfSimpleModal",
	function($log, $scope, SessionStore, $state, $stateParams, $q, BIReports, PageHelper, $timeout, irfSimpleModal){
	$log.info("ReportsCtrl loaded");

	var pageData = {};
	var tabData = {"menu_name":$stateParams.pageId};

	var userName = SessionStore.getLoginname();

	var currentUserRole = SessionStore.getUserRole();

	$scope.currentUserAccessLevel = currentUserRole.accessLevel;

	PageHelper.showLoader();

	var allAccessLevels = [10, 20, 30]; // filtering not available for 40

	$scope.filterAccessLevels = allAccessLevels.slice(allAccessLevels.indexOf($scope.currentUserAccessLevel));
	$scope.fSelect = Array($scope.filterAccessLevels.length);
	$scope.fNodes = Array($scope.filterAccessLevels.length);

	$scope.listNextAccessLevelItems = function(accessLevel, selectedValue, index) {
		for (i = index; i < $scope.filterAccessLevels.length; i++) $scope.fSelect[i] = [];
		BIReports.reportFilterList({
			"accessLevel": accessLevel,
			"selectedValue": selectedValue,
			"userId": userName,
			"userAccessLevel": $scope.currentUserAccessLevel
		}).$promise.then(function(response) {
			$scope.fNodes[index] = response.items;
		});
	}

	$scope.listNextAccessLevelItems($scope.filterAccessLevels[0], '', 0);

	var initialize = function() {
		if (_.isObject(pageData)) {
			if (pageData.filter) {
				tabData.filter = pageData.filter;
			}
			if (pageData.user && pageData.user.name) {
				$scope.filterUsername = pageData.user.name;
			}
		}
		$scope.ResultDataSet = [];
		BIReports.reportTabList(tabData).$promise.then(function(response) {
			$scope.TabDefinition = response;
			$timeout(function() {
				$scope.active = 0;
			});
		}).finally(function() {
			PageHelper.hideLoader();
		});
	};

	$scope.applyFilter = function() {
		var user = $scope.fSelect[$scope.filterAccessLevels.length - 1];
		var _f = [];
		for (var i = 0; i < $scope.fSelect.length; i++) {
			_f.push($scope.fSelect[i].id);
		}

		pageData = {
			filter: _f.join(':'),
			user: user
		};
		initialize();
	}

	$scope.resetFilter = function() {
		for (i = 0; i < $scope.filterAccessLevels.length; i++) $scope.fSelect[i] = [];

		pageData = {};
		initialize();
	}

	$scope.onTabLoad = function(menuId, activeindex) {
		if(!$scope.ResultDataSet[activeindex]) {
			PageHelper.showLoader();
			var reportData = {"menu_id":menuId, "user_id": userName};
			if (pageData && pageData.filter) {
				reportData.filter = pageData.filter;
			}
			BIReports.reportDataList(reportData).$promise.then(function(response) {
				var dataset = [];
				
				angular.forEach(response.ReportData, function(value, key) {
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
		'<div ng-show="model.$showLoader" class="text-center">Loading...</div>'+
		'<table ng-hide="model.$showLoader || model.error" class="table table-striped table-responsive">'+
			'<tr>'+
				'<th ng-repeat="(key, value) in model.drilldownReport[0]" ng-hide="key.startsWith(\'__\')">{{key|translate}}</th>'+
			'</tr>'+
			'<tr ng-repeat="row in model.drilldownReport">'+
				'<td ng-repeat="(key, value) in row" ng-hide="key.startsWith(\'__\')">{{value}}</td>'+
			'</tr>'+
		'</table>'+
		'<div ng-show="model.error">Error: {{model.error.error}}</div>';

	$scope.reportDrilldown = function(report, record) {
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
		BIReports.reportDrilldown(drilldownRequest).$promise.then(function(response) {
			drilldownModel.drilldownReport = response.drilldownReport;
		}, function(error) {
			drilldownModel.error = error;
		}).finally(function() {
			drilldownModel.$showLoader = false;
		});
		irfSimpleModal('{{model.report.TableTitle}}', drilldownBodyHtml, drilldownModel, {size: 'lg'});
	};

	initialize();

}]);