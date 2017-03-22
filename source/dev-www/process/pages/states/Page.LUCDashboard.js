irf.pages.controller("LUCDashboardCtrl", ['$log', '$scope', 'PagesDefinition', 'SessionStore', 'LUC',
	function($log, $scope, PagesDefinition, SessionStore, LUC) {
		$log.info("Page.LUCDashboard.html loaded");

		var fullDefinition = {
			"title": "LUC Dashboard",
			"iconClass": "fa fa-check-square-o",
			"items": [
				"Page/Engine/loans.individual.luc.LucScheduleQueue",
				"Page/Engine/loans.individual.luc.LucRescheduledQueue",
				"Page/Engine/loans.individual.luc.LucRiskQueue",
				"Page/Engine/loans.individual.luc.LucLegalRecoveryQueue"
			]
		};

		PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
			$scope.dashboardDefinition = resp;
			var branch = SessionStore.getCurrentBranch();
		        var centres = SessionStore.getCentres();
		        var centreId=[];
		        
		        if (centres && centres.length) {
						for (var i = 0; i < centres.length; i++) {
							centreId.push(centres[i].centreId);
						}
					}

			var lsqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.luc.LucScheduleQueue"];
			if (lsqMenu) {
				LUC.search({
					'accountNumber': '',
					'currentStage':"LUCSchedule",
					'centreId': centreId[0],
					'branchName': branch.branchName,
					'page': 1,
					'per_page': 1,
					'applicantName': '',
					'businessName': '',
				}).$promise.then(function(response, headerGetter) {
					lsqMenu.data = response.headers['x-total-count'];
				}, function() {
					lsqMenu.data = '-';
				});
			}

			var lrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.luc.LucRescheduledQueue"];
			if (lrqMenu) {
				LUC.search({
					'accountNumber': '',
					'currentStage':"LUCReschedule",
					'centreId': centreId[0],
					'branchName': branch.branchName,
					'page': 1,
					'per_page': 1,
					'applicantName': '',
					'businessName': '',
				}).$promise.then(function(response, headerGetter) {
					lrqMenu.data = response.headers['x-total-count'];
				}, function() {
					lrqMenu.data = '-';
				});
			}

			var leqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.luc.LucRiskQueue"];
			if (leqMenu) {
				LUC.search({
					'accountNumber': '',
					'currentStage':"LUCEscalate",
					'centreId': centreId[0],
					'branchName': branch.branchName,
					'page': 1,
					'per_page': 1,
					'applicantName': '',
					'businessName': '',
				}).$promise.then(function(response, headerGetter) {
					leqMenu.data = response.headers['x-total-count'];
				}, function() {
					leqMenu.data = '-';
				});
			}

			var llrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.luc.LucLegalRecoveryQueue"];
			if (llrqMenu) {
				LUC.search({
					'accountNumber': '',
					'currentStage':"LUCLegalRecovery",
					'centreId': centreId[0],
					'branchName': branch.branchName,
					'page': 1,
					'per_page': 1,
					'applicantName': '',
					'businessName': '',
				}).$promise.then(function(response, headerGetter) {
					llrqMenu.data = response.headers['x-total-count'];
				}, function() {
					llrqMenu.data = '-';
				});
			}
		});

	}
]);