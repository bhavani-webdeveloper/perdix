var MainApp = angular.module("MainApp", ["IRFPages", "IRFLogger"]);

MainApp.controller("MainController",
["$scope", "$log", "SessionStore", "Queries", "$state", "$timeout",
function($scope, $log, SessionStore, Queries, $state, $timeout) {
	$scope.appShortName = "Px";
	$scope.appName = "Perdix";
	document.mainTitle = "Perdix Mobility";

	$scope.isCordova = typeof(cordova) !== 'undefined';

	var checkLatestVersion = function() {
		$scope.latest_apk_url = '';
		$scope.latest_apk_force_upgrade = false;
		if ($scope.isCordova) {
			Queries.getGlobalSettings('cordova.latest_apk_version').then(function(value){
				$scope.latest_version = value;
				if ($scope.appManifest.version != $scope.latest_version) {
					Queries.getGlobalSettings('cordova.latest_apk_download_strategy').then(function (DownloadStrategy) {
						if (DownloadStrategy == 'DOWNLOAD_PAGE') {
							$scope.latest_apk_url =irf.MANAGEMENT_BASE_URL+"/server-ext/downloadApk.php";
							Queries.getGlobalSettings('cordova.latest_apk_force_upgrade').then(function (val) {
								$scope.latest_apk_force_upgrade = val === 'Y';
							});
						} else {
							Queries.getGlobalSettings('cordova.latest_apk_url').then(function (url) {
								$log.debug('latest_apk_url:' + url);
								$scope.latest_apk_url = url;
								Queries.getGlobalSettings('cordova.latest_apk_force_upgrade').then(function (val) {
									$scope.latest_apk_force_upgrade = val === 'Y';
								});
							});
						}
					}, function(err){
						Queries.getGlobalSettings('cordova.latest_apk_url').then(function (url) {
							$log.debug('latest_apk_url:' + url);
							$scope.latest_apk_url = url;
							Queries.getGlobalSettings('cordova.latest_apk_force_upgrade').then(function (val) {
								$scope.latest_apk_force_upgrade = val === 'Y';
							});
						});
					});
				}
			});
		}
	};

	$timeout(function() {
		if ($state.current.name === irf.REDIRECT_STATE) {
			$log.debug("Trying redirect assuming token is avilable.");
			$state.transitionTo(irf.HOME_PAGE.to, irf.HOME_PAGE.params, irf.HOME_PAGE.options);
		}
	}, 300);

	$.getJSON("app_manifest.json", function(json) {
		$scope.$apply(function(){
			irf.appManifest = json;
			$scope.appManifest = irf.appManifest;
			$scope.appName = irf.appManifest.title;
		});
		document.mainTitle = irf.appManifest.name;
	});
	$scope.appConfig = irf.appConfig;

	$scope.$on('irf-login-success', function($event){
		checkLatestVersion();
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

	$("body").on('collapsed.pushMenu expanded.pushMenu', function() {
		setTimeout(function() {
			//try { $('.irf-table-view .root-table').dataTable().fnAdjustColumnSizing(); } catch (e) {}
		}, 301);
	});
}]);
