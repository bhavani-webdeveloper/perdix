irf.pages.config([
	"$stateProvider", "irfElementsConfigProvider", "Model_ELEM_FC", "MODEL_ELEM_COMMONS", "irfNavigatorProvider", "formHelperProvider",
	function($stateProvider, elemConfig, Model_ELEM_FC, MODEL_ELEM_COMMONS, irfNavigatorProvider, formHelperProvider) {
	var statesDefinition = [{
		name: "Page.LeadDashboard",
		url: "/LeadDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "LeadDashboardCtrl"
	},{
		name: "Page.witfinLeadDashboard",
		url: "/witfinLeadDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "witfinLeadDashboardCtrl"
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
		name: "Page.JournalMultiPostingDashboard",
		url: "/JournalMultiPostingDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "JournalMultiPostingDashboardCtrl"
	},{
		name: "Page.FinconAccountingDashboard",
		url: "/FinconAccountingDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "FinconAccountingDashboardCtrl"
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
		name: "Page.CreditMonitoringDashboard",
		url: "/CreditMonitoringDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "CreditMonitoringDashboardCtrl"
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
	},{
		name: "Page.ServiceRequestDashboard",
		url: "/ServiceRequestDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "ServiceRequestDashboardCtrl"		
	},{
		name: "Page.ManagementReportDashboard",
		url: "/ManagementReportDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "PageManagementReportDashboardCtrl"		
	}];

	angular.forEach(statesDefinition, function(value, key){
		$stateProvider.state(value);
	});

	elemConfig.configFileUpload(Model_ELEM_FC);
	elemConfig.configCommons(MODEL_ELEM_COMMONS);
	
	elemConfig.configPikaday({
		minDate: new Date(1800, 0, 1),
		maxDate: new Date(2050, 12, 31),
		yearRange: [1801, 2040],
		format: 'YYYY-MM-DD'
	});

	elemConfig.configNavigator(irfNavigatorProvider.factory);

	elemConfig.configFormHelper(formHelperProvider.factory);
}]);
irf.pages.run(["Model_ELEM_FC", "MODEL_ELEM_COMMONS", "$rootScope", "SessionStore", "AuthTokenHelper", function(Model_ELEM_FC, MODEL_ELEM_COMMONS, $rootScope, SessionStore, AuthTokenHelper) {
	$rootScope.$on("irf-login-success", function() {
        Model_ELEM_FC.authToken = AuthTokenHelper.getAuthData().access_token;
		Model_ELEM_FC.imageCompressionRatio = SessionStore.getGlobalSetting("imageCompressionRatio");
		Model_ELEM_FC.compressionRatio = SessionStore.getGlobalSetting("compressionRatio");
		MODEL_ELEM_COMMONS.defaultGeoLocationPLugin = SessionStore.getGlobalSetting("cordova.defaultGeoLocationPlugin");
	})
}]);
