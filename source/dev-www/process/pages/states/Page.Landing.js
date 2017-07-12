irf.pages.controller("PageLandingCtrl",
	["$log", "$scope", "SessionStore", "PagesDefinition",
	function($log, $scope, SessionStore, PagesDefinition){
	$log.info("Page.Landing loaded");

	$scope.branch = SessionStore.getBranch();
	$scope.role = SessionStore.getRole();

	var fullDefinition = {
		"title": "FAVORITES",
		"items": [
			"Page/Engine/CustomerSearch"
		]
	};

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp){
        $scope.dashboardDefinition = resp;
    });

}]);