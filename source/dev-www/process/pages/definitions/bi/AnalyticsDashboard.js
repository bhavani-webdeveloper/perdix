irf.pageCollection.controller(irf.controller("bi.AnalyticsDashboard"),
["$scope", "BIAnalytics", "irfNavigator", "$log", "$sce",
function($scope, BIAnalytics, irfNavigator, $log, $sce) {
	BIAnalytics.getLoginToken().$promise.then(function(resp) {
		return BIAnalytics.setCookie({
			"authToken": resp.headers['www-authenticate'].substring(12)
		}).$promise;
	}).then(function(resp) {
		$log.info(resp);
		$scope.analyticsDashboardURL = $sce.trustAsResourceUrl(irf.ANALYTICS_WEB_URL + "/embedded-mode/home");///TeamA/ProjectA/home
	});
}]);