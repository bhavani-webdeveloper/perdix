irf.pages.controller("PageEngineErrorCtrl", ["$log", "$scope", "$state", "$stateParams", "$injector", "entityManager", "formHelper", function($log, $scope, $state, $stateParams, $injector, entityManager, formHelper) {
	var self = this;
	$log.info("Page.Engine.Error.html loaded");

	$scope.pageName = $stateParams.pageName;
}]);
