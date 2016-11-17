
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
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "PageLandingCtrl"
	},{
		name: "Page.BIDashboard", // BI Dashboard
		url: "/BIDashboard",
		templateUrl: "process/pages/templates/Page.BIDashboard.html",
		controller: "PageBIDashboardCtrl"
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
		name: "Page.LoansDashboard",
		url: "/LoansDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "LoansDashboardCtrl"
	},{
		name: "Page.LoansBookingDashboard",
		url: "/LoansBookingDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "LoansBookingDashboardCtrl"
	},{
		name: "Page.LoansDisbursementDashboard",
		url: "/LoansDisbursementDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "LoansDisbursementDashboardCtrl"
	},{
		name: "Page.LoansACHPDCDashboard",
		url: "/LoansACHPDCDashboard",
		templateUrl: "process/pages/templates/Page.LoansACHPDCDashboard.html",
		controller: "LoansACHPDCDashboardCtrl"
	},{
		name: "Page.LoansCollectionsDashboard",
		url: "/LoansCollectionsDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "LoansCollectionsDashboardCtrl"
	},{
		name: "Page.ManagementDashboard",
		url: "/ManagementDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "PageManagementDashboardCtrl"
	},{
		name: "Page.PsychometricTest",
		url: "/PsychometricTest/:pageId",
		templateUrl: "process/pages/templates/Psychometric.Test.html",
		controller: "PsychometricTestCtrl"
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
