irf.pages.controller("ReportsCtrl",
["$log", "$scope", "SessionStore", "$stateParams", "$q", "BIReports", "PageHelper",
    function($log, $scope, SessionStore, $stateParams, $q, BIReports, PageHelper){
    $log.info("ReportsCtrl loaded");

    var userName = SessionStore.getLoginname();

    $scope.currentUserRole = SessionStore.getUserRole();

	//sample
    PageHelper.showLoader();
	
	BIReports.reportMenuList().$promise.then(function(response) {
        $scope.dashboardDefinition = response;
    });
	
	//for hub dropdown
	BIReports.reportFilterList({"DropDownType" : "region" , "selectedValue" :""}).$promise.then(function(response) {
        $scope.regionName = response.items;
    });
	
	//for branch dropdown on select
	$scope.listHubs = function(){
		BIReports.reportFilterList({"DropDownType" : "Hub" , "selectedValue" : $scope.selectedRegion.id}).$promise.then(function(response) {
        	$scope.HubNames = response.items;
    	});
	}
	
	//for users dropdown on select
	$scope.listBranches = function(){
		BIReports.reportFilterList({"DropDownType" : "branch" , "selectedValue" : $scope.selectedHub.id}).$promise.then(function(response) {
        	$scope.loanOfficers = response.items;
    	});
	}
	
	//on pressing the button apply filter
	$scope.processForm = function(){
    	alert($scope.selectedRegion.id+'/'+$scope.selectedHub.id+'/'+$scope.selectedHub.id);
	}
	
	
	$scope.ResultDataSet = [];
	
	$scope.onTabLoad = function(tabIndex, activeindex){	
		
		if(!$scope.ResultDataSet[activeindex])
		{
			PageHelper.showLoader();
			BIReports.reportDataList({"report_id":tabIndex}).$promise.then(function(response) {
			
			$scope.dataset = [];
			
			angular.forEach(response.ReportData, function(value, key){
				
				if(value.ReportType == 'CHART')
				{
					$scope.dataset[key] = value;			
		
				//include chart js	
				}			
				else
				$scope.dataset[key] = value;
			});
			$scope.ResultDataSet[activeindex] = $scope.dataset;
			PageHelper.hideLoader();
    	});
		}
		
		$scope.onheaderClick = function(key, report_id){
			
			var drillDownUrl = irf.REPORT_BASE_URL + '/ReportDrilldown.php?report_id='+report_id+'&key='+key;
                    $log.info(drillDownUrl);
                    window.open(drillDownUrl);
		};
		
	};
	
	BIReports.reportTabList({"menu_id":$stateParams.pageId}).$promise.then(function(response) {
        console.log(response);
		$scope.TabDefinition = response;
    });
	
	
	
	
    BIReports.reportList({"sd":"sd"}).$promise.then(function(resp){
        self.formSource[0].items[0].titleMap = resp;
        self.form = self.formSource;
    }, function(errResp){
        PageHelper.showErrors(errResp);
    }).finally(function(){
        PageHelper.hideLoader();
    });

}]);