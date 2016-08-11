var MainApp = angular.module("MainApp", ["IRFPages", "IRFLogger"]);

MainApp.controller("MainController",
["$scope", "$log", "SessionStore",
function($scope, $log, SessionStore) {
	$scope.appShortName = "Px";
	$scope.appName = "Perdix";

	document.mainTitle = "Perdix Mobility | Alpha";

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
