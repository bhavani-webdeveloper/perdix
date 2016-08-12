irf.pages.controller("PageLandingCtrl",
	["$log", "$scope", "SessionStore", "PagesDefinition",
	function($log, $scope, SessionStore, PagesDefinition){
	$log.info("Page.Landing loaded");

	$scope.branch = SessionStore.getBranch();
	$scope.role = SessionStore.getRole();

	var fullDefinition = {
		"title": "FAVORITES",
		"items": [
			"Page/Engine/CustomerSearch",
			"Page/Engine/loans.individual.PendingClearingQueue",
			"Page/Engine/loans.individual.PendingCashQueue",
			"Page/Engine/loans.individual.BounceQueue"
		]
	};

    PagesDefinition.getUserAllowedDefinition(SessionStore.getLoginname(), fullDefinition).then(function(resp){
        $scope.dashboardDefinition = resp;
    });

}]);