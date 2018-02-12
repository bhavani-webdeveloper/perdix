irf.pages.controller("PageManagementDashboardCtrl",
	["$log", "$scope", "$stateParams", "formHelper", "SessionStore",
	function($log, $scope, $stateParams, formHelper, SessionStore){
	$log.info("Page.MgmtDash.html loaded");

	$scope.branch = SessionStore.getBranch();
	$scope.role = SessionStore.getRole();

	$scope.dashboardDefinition = {
		"title": "MANAGEMENT_DASHBOARD",
		"items": [
			{
				"id": "VillageSearch",
				"title": "VILLAGE",
				"state": "Page.Engine",
				"iconClass": "fa fa-search",
				"stateParams": {
					"pageName": "VillageSearch",
					"pageId": null
				}
			},
			{
				"id": "VillageCRU",
				"title": "ADD_VILLAGE",
				"state": "Page.Engine",
				"iconClass": "fa fa-tree",
				"stateParams": {
					"pageName": "Management_VillageCRU",
					"pageId": null
				}
			},
			{
				"id": "CentreSearch",
				"title": "CENTRE",
				"state": "Page.Engine",
				"iconClass": "fa fa-search",
				"stateParams": {
					"pageName": "CentreSearch",
					"pageId": null
				}
			},
			{
				"id": "CentreCRU",
				"title": "ADD_CENTRE",
				"state": "Page.Engine",
				"iconClass": "fa fa-home",
				"stateParams": {
					"pageName": "Management_CentreCRU",
					"pageId": null
				}
			}
		]
	};

}]);