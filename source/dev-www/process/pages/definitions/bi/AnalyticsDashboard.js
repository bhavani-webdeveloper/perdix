irf.pageCollection.controller(irf.controller("bi.AnalyticsDashboard"),
["$scope", "BIAnalytics", "irfNavigator", "$log", "$sce", "$window", "PageHelper", "irfProgressMessage",
function($scope, BIAnalytics, irfNavigator, $log, $sce, $window, PageHelper, irfProgressMessage) {
	var authToken;
	PageHelper.showLoader();
	irfProgressMessage.pop('Analytics', 'Analytics Page is loading. Please wait...', 50000);
	BIAnalytics.doAnalyticsLogin().then(function(data) {
			irfProgressMessage.clear();
			$scope.analyticsDashboardURL = $sce.trustAsResourceUrl(irf.ANALYTICS_WEB_URL + "/embedded-mode/" + data.team + "/" + 
			data.application + "/home?show-navigator=true");///TeamA/ProjectA/home
			function setAnalyticsFrameHeight() {
				$(".analytics-iframe, .analytics-root").css('height', ($(window).height()-139)+'px');
			}
			$($window).resize(setAnalyticsFrameHeight);
			setAnalyticsFrameHeight();
			PageHelper.hideLoader();
		}, function(err) {
			irfProgressMessage.clear();
			PageHelper.hideLoader();
			PageHelper.showProgress('Analytics', 'Analytics login failed.', 5000);
            PageHelper.showErrors(err);
		});
	
}]);