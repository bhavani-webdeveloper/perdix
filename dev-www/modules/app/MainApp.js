var MainApp = angular.module("MainApp", ["IRFPages", "IRFLogger"]);

MainApp.controller("MainController",
["$scope", "$log", "SessionStore", "Queries", "$state", "$timeout",
function($scope, $log, SessionStore, Queries, $state, $timeout) {
	$scope.appShortName = "Px";
	$scope.appName = "Perdix";
	document.mainTitle = "Perdix Mobility";

	$scope.isCordova = typeof(cordova) !== 'undefined';

	$.getJSON("app_manifest.json", function(json) {
		$scope.$apply(function(){
			$scope.app_manifest = json;
			$scope.appName = json.title;
			document.mainTitle = json.name;
		});
		if ($scope.isCordova) {
			Queries.getGlobalSettings('cordova.latest_apk_version').then(function(value){
				$scope.latest_version = value;
				if ($scope.app_manifest.version != $scope.latest_version) {
					Queries.getGlobalSettings('cordova.latest_apk_url').then(function(url){
						$log.debug('latest_apk_url:'+url);
						$scope.latest_apk_url = url;
					});
				}
			});
		}
		if ($scope.app_manifest.connect_perdix7) {
			$timeout(function() {
				$scope.connect_perdix7 = true;
				if ($state.current.name === irf.REDIRECT_STATE) {
					$log.debug("Legacy Perdix7 interoperability enabled, and trying redirect assuming token is avilable.");
					$state.transitionTo(irf.HOME_PAGE.to, irf.HOME_PAGE.params, irf.HOME_PAGE.options);
				}
			});
		}
	});

	$.AdminLTE.options.navbarMenuSlimscroll = false;
	if ($.AdminLTE.options.navbarMenuSlimscroll && typeof $.fn.slimscroll != 'undefined') {
		$(".navbar .menu").slimscroll({
			height: $.AdminLTE.options.navbarMenuHeight,
			alwaysVisible: false,
			size: $.AdminLTE.options.navbarMenuSlimscrollWidth
		}).css("width", "100%");
	}

	$.AdminLTE.options.boxWidgetOptions.boxWidgetIcons.collapse = "fa-chevron-down";
	$.AdminLTE.options.boxWidgetOptions.boxWidgetIcons.open = "fa-chevron-right";
	$.AdminLTE.options.sidebarPushMenu = false;

	var menuResize = function(){
		var w = window.innerWidth; // $(window).width();
		if (w > ($.AdminLTE.options.screenSizes.sm - 1) && w < $.AdminLTE.options.screenSizes.md) {
			$("body").addClass('sidebar-collapse').trigger('collapsed.pushMenu');
		} else if (w > ($.AdminLTE.options.screenSizes.md - 1)) {
			$("body").removeClass('sidebar-collapse').trigger('expanded.pushMenu');
		}
	};
	$(window).resize(menuResize);
	menuResize();
}]);
