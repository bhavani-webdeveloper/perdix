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
	"Utils",
function(
	$log,
	$scope,
	$state,
	$stateParams,
	$injector,
	irfStorageService,
	elementsUtils,
	entityManager,
	OfflineManager,
	Utils
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
		$state.go('Page.Bundle', {pageName: $scope.pageName, pageId: data.pageId, pageData: {'$offlineData': data}});
		updateAppTitle($scope.page.title);
	};

	if ($scope.page.offline) {
		if (angular.isFunction($scope.page.getOfflineDisplayItem)) {
			var items = OfflineManager.retrieveItems_v2($scope.pageName, $scope.page.offlineStrategy);
			$log.info(items);
			items.then(function(items){
                var offlineItems = [],
                    displayItems = [];
                var idx = 0;
                _.forEach(items, function(item, key) {
                	var jsonItem;
                	if ($scope.page.offlineStrategy == 'SQLITE' && Utils.isCordova){
                     jsonItem = JSON.parse(item);
                	}else{
                		jsonItem =item;
                	}
                    offlineItems[idx] = jsonItem;
                    jsonItem.bundleModel.offlineKey = key;
                    try {
                        displayItems[idx] = $scope.page.getOfflineDisplayItem(jsonItem, idx);
                    } catch (e) {
                        displayItems[idx] = ['PARSING_ERROR', e.message];
                    }
                    for (var i = 0; i < displayItems[idx].length; i++) {
                        if (angular.isNumber(displayItems[idx][i]))
                            displayItems[idx][i] = displayItems[idx][i].toString();
                    };
                    idx++;
                });
                $scope.offlineItems = offlineItems;
                $scope.displayItems = displayItems;
            },
            function(error) {
            	$log.info(error);

            })
		} else {
			$scope.error = "Display items not defined. Caanot view offline records. Contact admin";
		}
	} else {
		$log.error("Offline not supported for " + $scope.pageName);
		$scope.loadPage(null);
	}

	/*if ($scope.page.offline) {
		if (angular.isFunction($scope.page.getOfflineDisplayItem)) {
			var items = OfflineManager.retrieveItems($scope.pageName);

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
				for (var i = 0; i < displayItems[idx].length; i++) {
					if (angular.isNumber(displayItems[idx][i]))
						displayItems[idx][i] = displayItems[idx][i].toString();
				};
				idx++;
			});
			$scope.offlineItems = offlineItems;
			$scope.displayItems = displayItems;
		} else {
			$scope.error = "Display items not defined. Caanot view offline records. Contact admin";
		}
	} else {
		$log.error("Offline not supported for " + $scope.pageName);
		$scope.loadPage(null);
	}
*/
	$scope.offlineListInfo = {
		actions: [{
			name: "Open",
			icon: "fa fa-folder-open-o",
			fn: function(item, index){
				$log.debug("Restoring offline data");
				$scope.loadPage(null, item);
			},
			isApplicable: function(item, index){
				return true;
			}
		}, {
			name: "Delete",
			icon: "fa fa-trash",
			fn: function(item, index){
				Utils.confirm("Are You Sure?").then(function(){
					_.pullAt($scope.displayItems, index);
					_.pullAt($scope.offlineItems, index);
					$log.warn(item.$$STORAGE_KEY$$);
					//OfflineManager.removeItem($scope.pageName, item.$$STORAGE_KEY$$);
					OfflineManager.removeItem_v2($scope.pageName, item.$$STORAGE_KEY$$, $scope.page.offlineStrategy);
				});
			},
			isApplicable: function(item, index){
				return true;
			}
		}]
	};
}]);
