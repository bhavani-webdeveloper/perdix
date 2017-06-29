irf.pageCollection.controller(irf.controller("bi.AnalyticsDashboard"),
["$scope", "BIAnalytics", "irfNavigator", "$log", "$sce", "$window",
function($scope, BIAnalytics, irfNavigator, $log, $sce, $window) {
	BIAnalytics.getLoginToken().$promise.then(function(resp) {
		return BIAnalytics.setCookie({
			"authToken": resp.headers['www-authenticate'].substring(12)
		}).$promise;
	}).then(function(resp) {
		$log.info(resp);
		$scope.analyticsDashboardURL = $sce.trustAsResourceUrl(irf.ANALYTICS_WEB_URL + "/embedded-mode/home");///TeamA/ProjectA/home
		function setAnalyticsFrameHeight() {
			$(".analytics-iframe, .analytics-root").css('height', ($(window).height()-139)+'px');
		}
		$($window).resize(setAnalyticsFrameHeight);
		setAnalyticsFrameHeight();
	});
}]);