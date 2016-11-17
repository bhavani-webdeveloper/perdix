irf.pages.controller("PsychometricTestCtrl",
	["$log", "$scope", "SessionStore", "$stateParams", "Psychometric",
	function($log, $scope, SessionStore, $stateParams, Psychometric){
	$log.info("PsychometricTest loaded");

	Psychometric.getTest({
		"participantId": $stateParams.pageId,
		"createdBy": SessionStore.getLoginname(),
		"langCode": "en"
	}, function(test) {
		$scope.test = test;
	}, function(err) {

	});
}]);