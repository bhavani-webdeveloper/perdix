irf.pages.controller("JewelDashboardCtrl",['$log', '$scope', 'PagesDefinition', 'SessionStore', 'JewelLoan',
    function($log, $scope, PagesDefinition, SessionStore, JewelLoan){
        $log.info("Page.JewelDashboard.html loaded");

         var fullDefinition = {
             "title": "Jewel Dashboard",
             "iconClass": "fa fa-book",
             "items": [
				 "Page/Engine/jewelloan.BranchJewelQueue",
				 "Page/Engine/jewelloan.PendingTransitQueue", 
				 "Page/Engine/jewelloan.IncomingTransitQueue",
				 "Page/Engine/jewelloan.ReturnRequestQueue"
             ]
         };


         PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
		 	$scope.dashboardDefinition = resp;
		 	var branch = SessionStore.getCurrentBranch();
		        

			 var jlqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/jewelloan.BranchJewelQueue"];
			 if (jlqMenu) {
				jlqMenu.data = 0;	 
			 	JewelLoan.search({
			 		        'accountNumber': '',
			 		        'currentStage':"JewelLoanSummary",
			 		        'monitoringType':"JewelLoan",
			 		        'branchName': branch.branchName,
			 		        'page': 1,
			 		        'per_page': 1,
			 		        'urnNo': '',
                            'transitStatus': '',
                            'fromDate': '' , 
                            'toDate'  :  ''
			 	}).$promise.then(function(response, headerGetter) {
			 		jlqMenu.data = Number(response.headers['x-total-count']);
			 	}, function() {
			 		jlqMenu.data = '-';
			 	});
			 }


			var ptqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/jewelloan.PendingTransitQueue"];
			if (ptqMenu) {
				JewelLoan.search({
							'accountNumber': '',
							'currentStage':"PendingTransit",
							'monitoringType':"JewelLoan",
							'branchName': branch.branchName,
							'page': 1,
							'per_page': 1,
							'urnNo': '',
							'transitStatus': '',
							'fromDate': '' , 
							'toDate'  :  ''
						}).$promise.then(function(response, headerGetter) {
							ptqMenu.data = response.headers['x-total-count'];
						}, function() {
							ptqMenu.data = '-';
						});
					}
			
			var itqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/jewelloan.IncomingTransitQueue"];		
			if (itqMenu) {
				JewelLoan.search({
							'accountNumber': '',
							'currentStage':"PendingTransit",
							'monitoringType':"JewelLoan",
							'branchName': branch.branchName,
							'page': 1,
							'per_page': 1,
							'urnNo': '',
							'transitStatus': '',
							'fromDate': '' , 
							'toDate'  :  ''
						}).$promise.then(function(response, headerGetter) {
							itqMenu.data = response.headers['x-total-count'];
						}, function() {
							itqMenu.data = '-';
						});
					}
			var rrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/jewelloan.ReturnRequestQueues"];		
			if (rrqMenu) {
				JewelLoan.search({
							'accountNumber': '',
							'currentStage':"PendingTransit",
							'monitoringType':"JewelLoan",
							'branchName': branch.branchName,
							'page': 1,
							'per_page': 1,
							'urnNo': '',
							'transitStatus': '',
							'fromDate': '' , 
							'toDate'  :  ''
						}).$promise.then(function(response, headerGetter) {
							rrqMenu.data = response.headers['x-total-count'];
						}, function() {
							rrqMenu.data = '-';
						});
					}				
           
        });       
    }

        
]);
