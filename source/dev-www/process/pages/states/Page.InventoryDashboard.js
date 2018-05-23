irf.pages.controller("InventoryDashboardCtrl", ['$log', '$scope', 'PagesDefinition', 'SessionStore', 'Inventory',
	function($log, $scope, PagesDefinition, SessionStore, Inventory) {
		$log.info("Page.InventoryDashboard.html loaded");

		var fullDefinition = {
			"title": "INVENTORY_TRACKING_DASHBOARD",
			"iconClass": "fa fa-suitcase",
			"items": [
				"Page/Engine/loans.individual.InventoryTracking.InventoryTracking",
				"Page/Engine/loans.individual.InventoryTracking.InventoryBatchQueue",
				"Page/Engine/loans.individual.InventoryTracking.InventoryTransitQueue",
				"Page/Engine/loans.individual.InventoryTracking.InventoryReceivedQueue"
			]
		};

		var branchdefinition = {
			"title": "INVENTORY_IN_BRANCH_DASHBOARD",
			"iconClass": "fa fa-suitcase",
			"items": [
				"Page/Engine/loans.individual.InventoryTracking.CaptureInventory",
				"Page/Engine/loans.individual.InventoryTracking.InventoryByBranchQueue",
			]
		};


		PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
			$scope.InventoryTrackingDashboardDefinition = resp;
			var branchId = SessionStore.getBranchId();

			var lcMenu = $scope.InventoryTrackingDashboardDefinition.$menuMap["Page/Engine/loans.individual.InventoryTracking.InventoryBatchQueue"];
			if (lcMenu) {
				Inventory.searchInventoryTracking({
					'branchId': branchId,
					'page': 1,
					'currentStage': "courier",
					'per_page': 1,
				}).$promise.then(function(response, headerGetter) {
					lcMenu.data = response.headers['x-total-count'];
				}, function() {
					lcMenu.data = '-';
				});
			}

			var leqMenu = $scope.InventoryTrackingDashboardDefinition.$menuMap["Page/Engine/loans.individual.InventoryTracking.InventoryTransitQueue"];
			if (leqMenu) {
				Inventory.searchInventoryTracking({
					'branchId': branchId,
					'courierNumber': '',
					'podNumber': '',
					'currentStage': "Transit",
					'page': 1,
					'per_page': 1,
				}).$promise.then(function(response, headerGetter) {
					leqMenu.data = response.headers['x-total-count'];
				}, function() {
					leqMenu.data = '-';
				});
			}

			var llrqMenu = $scope.InventoryTrackingDashboardDefinition.$menuMap["Page/Engine/loans.individual.InventoryTracking.InventoryReceivedQueue"];
			if (llrqMenu) {
				Inventory.searchInventoryTracking({
					'branchId': branchId,
					'courierNumber': '',
					'podNumber': '',
					'currentStage': "Completed",
					'page': 1,
					'per_page': 1,
				}).$promise.then(function(response, headerGetter) {
					llrqMenu.data = response.headers['x-total-count'];
				}, function() {
					llrqMenu.data = '-';
				});
			}
		});

		
		PagesDefinition.getUserAllowedDefinition(branchdefinition).then(function(resp) {
			$scope.BranchInventoryDashboardDefinition = resp;
			var branchId = SessionStore.getBranchId();

			var lMenu = $scope.BranchInventoryDashboardDefinition.$menuMap["Page/Engine/loans.individual.InventoryTracking.InventoryByBranchQueue"];
			if (lMenu) {
				Inventory.searchInventory({
					'branchId': branchId,
					'page': 1,
					'per_page': 1,
				}).$promise.then(function(response, headerGetter) {
					lMenu.data = response.headers['x-total-count'];
				}, function() {
					lMenu.data = '-';
				});
			}
		});
	}
]);