irf.pages.controller("PageBundleOfflineCtrl", [
	"$log",
	"$scope",
	"$state",
	"$stateParams",
	"$injector",
	"irfStorageService",
	"elementsUtils",
	"entityManager",
	"OfflineManager",
function(
	$log,
	$scope,
	$state,
	$stateParams,
	$injector,
	irfStorageService,
	elementsUtils,
	entityManager,
	OfflineManager
) {
	var self = this;
	$log.info("Page.BundleOffline.html loaded");

	$scope.pageName = $stateParams.pageName;
	$scope.page = $injector.get(irf.page($scope.pageName));

	var updateAppTitle = function(menuTitle) {
		document.title = menuTitle + " | " + document.mainTitle;
	};

	$scope.loadPage = function(event, data) {
		event && event.preventDefault();
		$state.go('Page.Bundle', {pageName: $scope.pageName, pageData: {'$$offlineData': data}});
		updateAppTitle($scope.page.title);
	};

	$scope.callback = function(item, index) {
		$log.debug("Restoring offline data");
		$scope.loadPage(null, item);
	};

	if ($scope.page.offline && angular.isFunction($scope.page.getOfflineDisplayItem)) {
		var items = OfflineManager.retrieveItems($scope.pageName);
		console.log(items);

		var offlineItems = [], displayItems = [];
		var idx = 0;
		_.forEach(items, function(value, key) {
			offlineItems[idx] = value;
			value.bundleModel.offlineKey = key;
			try {
				displayItems[idx] = $scope.page.getOfflineDisplayItem(value, idx);
			} catch (e) {
				displayItems[idx] = ['PARSING_ERROR', e.message];
			}
			// for (var i = 0; i < displayItems[idx].length; i++) {
			// 	if (angular.isNumber(displayItems[idx][i]))
			// 		displayItems[idx][i] = displayItems[idx][i].toString();
			// };
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
				// _.pullAt($scope.displayItems, index);
				// _.pullAt($scope.offlineItems, index);
				// irfStorageService.deleteJSON($scope.pageName, item.$$STORAGE_KEY$$);
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
