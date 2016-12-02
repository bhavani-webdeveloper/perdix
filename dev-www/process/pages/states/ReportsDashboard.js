irf.pages.controller("ReportsDashboardCtrl",
["$log", "$scope", "SessionStore", "$stateParams", "$q", "BIReports", "PageHelper",
    function($log, $scope, SessionStore, $stateParams, $q, BIReports, PageHelper){
    $log.info("ReportsDashboardCtrl loaded");

    var userName = SessionStore.getLoginname();

	//sample
    PageHelper.showLoader();
	
	BIReports.reportMenuList().$promise.then(function(response) {
		console.log(response);
        $scope.dashboardDefinition = response;
    });
	
    BIReports.reportList({"sd":"sd"}).$promise.then(function(resp){
        self.formSource[0].items[0].titleMap = resp;
        self.form = self.formSource;
    }, function(errResp){
        PageHelper.showErrors(errResp);
    }).finally(function(){
        PageHelper.hideLoader();
    });

}]);