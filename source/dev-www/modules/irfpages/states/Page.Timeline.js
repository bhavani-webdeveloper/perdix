irf.pages.controller("PageTimelineCtrl", ["$log", "$scope", "$state", "$stateParams", function($log, $scope, $state, $stateParams) {
	var self = this;
	$log.info("Page.Timeline.html loaded");

	$scope.timelineName = $stateParams.timelineName;
}]);
