irf.pages.controller("ReportsCtrl",
["$log", "$scope", "SessionStore", "$state", "$stateParams", "$q", "BIReports", "PageHelper",
	function($log, $scope, SessionStore, $state, $stateParams, $q, BIReports, PageHelper){
	$log.info("ReportsCtrl loaded");

	var pageData = $stateParams.pageData;
	if (pageData && pageData.user && pageData.user.name) {
		$scope.filterUsername = pageData.user.name;
	}

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
		BIReports.reportFilterList({ "accessLevel": accessLevel, "selectedValue": selectedValue }).$promise.then(function(response) {
			$scope.fNodes[index] = response.items;
		});
	}

	$scope.listNextAccessLevelItems($scope.filterAccessLevels[0], '', 0);

	$scope.applyFilter = function() {
		var user = $scope.fSelect[$scope.filterAccessLevels.length - 1];
		var _f = [];
		for (var i = 0; i < $scope.fSelect.length; i++) {
			_f.push($scope.fSelect[i].id);
		}
		$state.go("Page.Reports", {
			pageId: $stateParams.pageId,
			pageData: {
				filter: _f.join(':'),
				user: user
			}
		});
	}

	$scope.ResultDataSet = [];

	$scope.onTabLoad = function(tabIndex, activeindex) {
		if(!$scope.ResultDataSet[activeindex]) {
			PageHelper.showLoader();
			var reportData = {"report_id":tabIndex, "user_id": userName};
			if (pageData && pageData.user && pageData.user.id) {
				reportData.user_id = pageData.user.id;
			}
			BIReports.reportDataList(reportData).$promise.then(function(response) {
				$scope.dataset = [];
				
				angular.forEach(response.ReportData, function(value, key) {
					$scope.dataset[key] = value;
					/*if(value.ReportType == 'CHART') {
						$scope.dataset[key] = value;
					} else {
						$scope.dataset[key] = value;
					}*/
				});
				$scope.ResultDataSet[activeindex] = $scope.dataset;
				PageHelper.hideLoader();
			});
		}
		
		$scope.onHeaderClick = function(key, report_id) {
			var drillDownUrl = irf.REPORT_BASE_URL + '/ReportDrilldown.php?report_id='+report_id+'&key='+key;
			$log.info(drillDownUrl);
			window.open(drillDownUrl);
		};
	};

	var tabData = {"menu_name":$stateParams.pageId};
	if (pageData && pageData.filter) {
		tabData.filter = pageData.filter;
	}
	BIReports.reportTabList(tabData).$promise.then(function(response) {
		console.log(response);
		$scope.TabDefinition = response;
	}).finally(function() {
		PageHelper.hideLoader();
	});

}]);