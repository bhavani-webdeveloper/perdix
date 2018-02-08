irf.pageCollection.controller(irf.controller("bi.AnalyticsDashboard"),
["$scope", "BIAnalytics", "irfNavigator", "$log", "$sce", "$window", "PageHelper", "irfProgressMessage", "Account",
function($scope, BIAnalytics, irfNavigator, $log, $sce, $window, PageHelper, irfProgressMessage, Account) {
	var authToken;
	PageHelper.showLoader();
	irfProgressMessage.pop('Analytics', 'Analytics Page is loading. Please wait...', 10000);
	Account.getAnalyticsToken().$promise.then(function(data) {
		authToken = data.analyticsToken.substring(12)
		return BIAnalytics.setCookie({
			"authToken": authToken
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
			irfProgressMessage.clear();
			$scope.analyticsDashboardURL = $sce.trustAsResourceUrl(irf.ANALYTICS_WEB_URL + "/embedded-mode/" + role + "?show-navigator=true");///TeamA/ProjectA/home
			function setAnalyticsFrameHeight() {
				$(".analytics-iframe, .analytics-root").css('height', ($(window).height()-139)+'px');
			}
			$($window).resize(setAnalyticsFrameHeight);
			setAnalyticsFrameHeight();
		}, function(err) {
			irfProgressMessage.clear();
			PageHelper.hideLoader();
			PageHelper.showProgress('Analytics', 'Analytics login failed.', 5000);
            PageHelper.showErrors(err);
		});
	}, function(err) {
		irfProgressMessage.clear();
		PageHelper.hideLoader();
		PageHelper.showProgress('Analytics', 'Analytics login failed.', 5000);
        PageHelper.showErrors(err);
	});
}]);