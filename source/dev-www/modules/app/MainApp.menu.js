
MainApp.directive('irfMainMenu', function(){
	return {
		restrict: "E",
		replace: true,
		scope: {
			
		},
		templateUrl: "modules/app/templates/menu.html",
		link: function(scope, elem, attrs, ctrl) {
			//ctrl.init(elem);
		},
		controller: "irfMainMenuController"
	};
});

MainApp.controller("irfMainMenuController", [
	"$scope", "$log", "$http", "$state", "SessionStore", "PagesDefinition", "irfNavigator",
	function($scope, $log, $http, $state, SessionStore, PagesDefinition, irfNavigator) {

	$scope.ss = SessionStore;

	$scope.photo = SessionStore.getPhoto();

	$scope.currentBranch = SessionStore.getCurrentBranch();

	$http.get("process/MenuDefinition.json").then(function(response){
		PagesDefinition.getUserAllowedDefinition(response.data).then(function(resp){
			$scope.definition = resp;
			$.AdminLTE.layout.activate();
			$.AdminLTE.tree('.sidebar');
			// $('.main-sidebar').slimScroll();
			$("a[href='#']").click(function(e){e.preventDefault()});
		});
	});

	var adminLteSidemenuFixOnSmallScreen = function() {
		if ($(window).width() < ($.AdminLTE.options.screenSizes.sm)) {
			if ($("body").hasClass('sidebar-open')) {
				$("body").removeClass('sidebar-open').removeClass('sidebar-collapse').trigger('collapsed.pushMenu');
			}
		}
	};

	/*$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options){ 
		if (toState === 'PageView.PageEngine' && toParams && toParams.pageName) {
			
		}
	});*/

	var updateAppTitle = function(menuTitle) {
		document.title = menuTitle + " | " + document.mainTitle;
	};

	$scope.loadPage = function(event, menu) {
		event.preventDefault();
		if (menu && menu.state) {
			irfNavigator.go({
				"state": menu.state,
				"pageName": menu.stateParams.pageName,
				"pageId": menu.stateParams.pageId,
				"pageData": menu.stateParams.pageData
			}, null, true);
			adminLteSidemenuFixOnSmallScreen();
			updateAppTitle(menu.title);
			window.scrollTo(0,0);
		}
		if (angular.isFunction(menu.onClick)) {
			menu.onClick(event, menu);
		}
	};

	$scope.loadOfflinePage = function(event, menu) {
		event.preventDefault();
		if (menu && menu.offline && menu.state) {
			$state.go(menu.state + 'Offline', menu.stateParams);
			adminLteSidemenuFixOnSmallScreen();
			updateAppTitle("Offline | " + menu.title);
			window.scrollTo(0,0);
		}
	};

	$scope.isActive = function(id) {
		return $state.current.name === id;
	};
}]);
