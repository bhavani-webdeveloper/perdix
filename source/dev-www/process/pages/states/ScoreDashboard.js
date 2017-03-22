irf.pages.controller("ScoreCtrl",
["$log", "$scope", "SessionStore", "$stateParams", "$q", "BIReports", "PageHelper",
    function($log, $scope, SessionStore, $stateParams, $q, BIReports, PageHelper){
    $log.info("ScoreCtrl loaded");

    var userName = SessionStore.getLoginname();

	//sample
    PageHelper.showLoader();
	
	BIReports.listOfscoreServices().$promise.then(function(response) {
        $scope.scoredashboardDefinition = response;
    });
	PageHelper.hideLoader();

}]);