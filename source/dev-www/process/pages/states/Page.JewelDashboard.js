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
		 	var branch = SessionStore.getBranchId();
		        

			 var jlqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/jewelloan.BranchJewelQueue"];
			 if (jlqMenu) {
				jlqMenu.data = 0;	 
				JewelLoan.search({
					"originBranchid"	    : branch,
					'currentStage'		    : "BranchJewelQueue",
					//"fromDate"		    : '',
					//"toDate"			    : '',	
					//"urnNo"			    : '',
					//"accountNo"		    : '',
					//"transitStatus"       : '',
					//"sourceBranchId"	    : originBranchId,	
					//"destinationBranchId" : originBranch
					// 'page'               : 1,
                    // 'per_page'           : 1,
					}).$promise.then(function(response, headerGetter) {
			 		jlqMenu.data = response.headers['x-total-count'];
			 	}, function() {
			 		jlqMenu.data = '-';
			 	});
			 }


			var ptqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/jewelloan.PendingTransitQueue"];
			if (ptqMenu) {
				JewelLoan.search({
							"originBranchid"	  	: branch,
							'currentStage'			:"PendingTransit",
							//"fromDate"			: '',
							//"toDate"			  	: '',	
							//"urnNo"				: '',
							//"accountNo"			: '',
							"transitStatus"		    : 'PENDING_TRANSIT',
							//"sourceBranchId"	    : originBranchId,	
							//"destinationBranchId" : originBranch
							// 'page': 1,
							// 'per_page': 1,
						}).$promise.then(function(response, headerGetter) {
							ptqMenu.data = response.headers['x-total-count'];
						}, function() {
							ptqMenu.data = '-';
						});
					}
			
			var itqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/jewelloan.IncomingTransitQueue"];		
			if (itqMenu) {
				JewelLoan.search({
							"originBranchid"	  	: branch,
							'currentStage'			:"IncomingTransit",
							//"fromDate"			: '',
							//"toDate"			  	: '',	
							//"urnNo"				: '',
							//"accountNo"			: '',
							 "transitStatus"		: 'IN_TRANSIT',
							//"sourceBranchId"	    : originBranchId,	
							//"destinationBranchId" : originBranch
							// 'page'				: 1,
							// 'per_page'			: 1,
						}).$promise.then(function(response, headerGetter) {
							itqMenu.data = response.headers['x-total-count'];
						}, function() {
							itqMenu.data = '-';
						});
					}
			var rrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/jewelloan.ReturnRequestQueue"];		
			if (rrqMenu) {
				JewelLoan.search({
							"originBranchid"	  	: branch,
							'currentStage'			:"ReturnRequest",
							//"fromDate"			: '',
							//"toDate"			  	: '',	
							//"urnNo"				: '',
							//"accountNo"			: '',
							"transitStatus"			: 'RETURN_REQUESTED',
							//"sourceBranchId"	    : originBranchId,	
							//"destinationBranchId" : originBranch
							// 'page'				: 1,
							// 'per_page'			: 1,
						}).$promise.then(function(response, headerGetter) {
							rrqMenu.data = response.headers['x-total-count'];
						}, function() {
							rrqMenu.data = '-';
						});
					}				
           
        });       
    }

        
]);
