irf.pageCollection.controller(irf.controller("bi.AnalyticsDashboard"),
["$scope", "BIAnalytics", "irfNavigator", "$log", "$sce", "$window", "PageHelper",
function($scope, BIAnalytics, irfNavigator, $log, $sce, $window, PageHelper) {
	var authToken;
	PageHelper.showLoader();
	BIAnalytics.getAnalyticsLoginToken().then(function(resp) {
		authToken = resp.headers['www-authenticate'].substring(12)
		return BIAnalytics.setCookie({
			"authToken": resp.headers['www-authenticate'].substring(12)
		}).$promise;
	}).then(function(resp) {
		$log.info(resp);
		BIAnalytics.currentUser({
			"authToken": authToken
		}).$promise.then(function(data) {
			PageHelper.hideLoader();
			var role = '';
			if(data && data.user && data.user.teams && data.user.teams.length > 0) {
				role = data.user.teams[0].role || role;
			}
			$scope.analyticsDashboardURL = $sce.trustAsResourceUrl(irf.ANALYTICS_WEB_URL + "/embedded-mode/" + role + "?show-navigator=true");///TeamA/ProjectA/home
			function setAnalyticsFrameHeight() {
				$(".analytics-iframe, .analytics-root").css('height', ($(window).height()-139)+'px');
			}
			$($window).resize(setAnalyticsFrameHeight);
			setAnalyticsFrameHeight();
		}, function(err) {
			PageHelper.hideLoader();
			PageHelper.showProgress('Analytics', 'Oops. Some error', 5000);
            PageHelper.showErrors(err);
		});
	}, function(err) {
		PageHelper.hideLoader();
		PageHelper.showProgress('Analytics', 'Oops. Some error', 5000);
        PageHelper.showErrors(err);
	});
}]);