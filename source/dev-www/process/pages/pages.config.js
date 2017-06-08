
irf.HOME_PAGE = {
	"url": "Page/Landing",
	"to": "Page.Landing",
	"params": {

	},
	"options": {

	}
};

irf.goHome = function($state) {
	$state.go(irf.HOME_PAGE.to, irf.HOME_PAGE.params, irf.HOME_PAGE.options);
};

irf.pages.config([
	"$stateProvider", "irfElementsConfigProvider", "Model_ELEM_FC", "irfNavigatorProvider",
	function($stateProvider, elemConfig, Model_ELEM_FC, irfNavigatorProvider) {
	var statesDefinition = [{
		name: "Page.Landing", // Favorites
		url: "/Landing",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "PageLandingCtrl"
	},{
		name: "Page.LeadDashboard",
		url: "/LeadDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "LeadDashboardCtrl"
	},{
		name: "Page.JournalMaintenanceDashboard",
		url: "/JournalMaintenanceDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "JournalMaintenanceDashboardCtrl"
	},{
		name: "Page.JournalPostingDashboard",
		url: "/JournalPostingDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "JournalPostingDashboardCtrl"
	},{
		name: "Page.ReferenceCodeDashboard",
		url: "/ReferenceCodeDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "ReferenceCodeDashboardCtrl"
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
		name: "Page.LoanOriginationDashboard",
		url: "/LoanOriginationDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "LoanOriginationDashboardCtrl"
	},{
		name: "Page.UserDashboard",
		url: "/UserDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "UserDashboardCtrl"
	},{
		name: "Page.LUCDashboard",
		url: "/LUCDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "LUCDashboardCtrl"
	},{
		name: "Page.InventoryDashboard",
		url: "/InventoryDashboard",
		templateUrl: "process/pages/templates/Page.InventoryDashboard.html",
		controller: "InventoryDashboardCtrl"
	},{
		name: "Page.PsychometricTest",
		url: "/PsychometricTest/:participantId/:applicationId",
		templateUrl: "process/pages/templates/Psychometric.Test.html",
		controller: "PsychometricTestCtrl"
	},{
		name: "Page.ReportsDashboard",
		url: "/ReportsDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "ReportsDashboardCtrl"
	},{
		name: "Page.Reports",
		url: "/Reports/:pageId",
		templateUrl: "process/pages/templates/Reports.html",
		controller: "ReportsCtrl"
	},{
		name: "Page.ScoreDashboard",
		url: "/ScoreDashboard",
		templateUrl: "process/pages/templates/ManageScore.html",
		controller: "ScoreCtrl"
	},{
		name: "Page.DocumentTrackingDashboard",
		url: "/DocumentTrackingDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "DocumentTrackingDashboardCtrl"
	},{
		name: "Page.CentreCreationDashboard",
		url: "/CentreCreationDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "CentreCreationDashboardCtrl"
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

	elemConfig.configNavigator(irfNavigatorProvider.factory);
}]);
