irf.pages.controller("PageEngineOfflineCtrl", [
	"$log",
	"$scope",
	"$state",
	"$stateParams",
	"$injector",
	"irfStorageService",
	"elementsUtils",
	"entityManager",
function(
	$log,
	$scope,
	$state,
	$stateParams,
	$injector,
	irfStorageService,
	elementsUtils,
	entityManager
) {
	var self = this;
	$log.info("Page.EngineOffline.html loaded");

	$scope.pageName = $stateParams.pageName;
	$scope.page = $injector.get(irf.page($scope.pageName));

	var updateAppTitle = function(menuTitle) {
		document.title = menuTitle + " | " + document.mainTitle;
	};

	$scope.loadPage = function(event) {
		event && event.preventDefault();
		$state.go('Page.Engine', {pageName: $scope.pageName});
		updateAppTitle($scope.page.title);
	};

	$scope.callback = function(item, index) {
		$log.debug("Restoring offline data");
		entityManager.setModel($scope.pageName, item);
		$scope.loadPage(null);
	};

	if ($scope.page.offline && angular.isFunction($scope.page.getOfflineDisplayItem)) {
		var items = irfStorageService.getMasterJSON($scope.pageName);

		var offlineItems = [], displayItems = [];
		var idx = 0;
		_.forEach(items, function(value, key) {
			offlineItems[idx] = value;
			try {displayItems[idx] = $scope.page.getOfflineDisplayItem(value, idx);} catch (e) {displayItems[idx] = ['PARSING_ERROR', e.message];}
			for (var i = 0; i < displayItems[idx].length; i++) {
				if (angular.isNumber(displayItems[idx][i]))
					displayItems[idx][i] = displayItems[idx][i].toString();
			};
			idx++;
		});
		$scope.offlineItems = offlineItems;
		$scope.displayItems = displayItems;

	} else {
		$log.error("Offline not supported for " + $scope.pageName);
		$scope.loadPage(null);
	}

	$scope.offlineListInfo = {
		actions: [{
			name: "Delete",
			icon: "fa fa-trash",
			fn: function(item, index){
				_.pullAt($scope.displayItems, index);
				_.pullAt($scope.offlineItems, index);
				irfStorageService.deleteJSON($scope.pageName, item.$$STORAGE_KEY$$);
			},
			isApplicable: function(item, index){
				//if (index%2==0){
				//	return false;
				//}
				return true;
			}
		}]
	};
}]);
