
irf.HOME_PAGE = {
	"url": "Page/Landing",
	"to": "Page.Landing",
	"params": {

	},
	"options": {

	}
};

irf.pages.config([
	"$stateProvider", "irfElementsConfigProvider", "Model_ELEM_FC",
	function($stateProvider, elemConfig, Model_ELEM_FC) {
	var statesDefinition = [{
		name: "Page.Landing", // Favorites
		url: "/Landing",
		templateUrl: "process/pages/templates/Page.Landing.html",
		controller: "PageLandingCtrl"
	},{
		name: "Page.Dashboard", // BI Dashboard
		url: "/Dashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "PageDashboardCtrl"
	},{
		name: "Page.Customer360", // Customer360
		url: "/Customer360/:pageId",
		templateUrl: "process/pages/templates/Page.Customer360.html",
		controller: "Customer360Ctrl"
	},{
		name: "Page.CustomerHistory", // Customer360
		url: "/CustomerHistory/:pageId",
		templateUrl: "process/pages/templates/Page.CustomerHistory.html",
		controller: "CustomerHistoryCtrl"
	},{
		name: "Page.GroupDashboard",
		url: "/GroupDashboard",
		templateUrl: "process/pages/templates/Page.GroupDashboard.html",
		controller: "PageGroupDashboardCtrl"
	},{
		name: "Page.ManagementDashboard",
		url: "/ManagementDashboard",
		templateUrl: "process/pages/templates/Page.ManagementDashboard.html",
		controller: "PageManagementDashboardCtrl"
	}];

	angular.forEach(statesDefinition, function(value, key){
		$stateProvider.state(value);
	});

	elemConfig.configFileUpload(Model_ELEM_FC);

	elemConfig.configPikaday({
		minDate: new Date(1800, 0, 1),
		maxDate: new Date(2050, 12, 31),
		yearRange: [1801, 2040],
		format: 'YYYY-MM-DD'
	});
}]);
