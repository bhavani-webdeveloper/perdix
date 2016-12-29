irf.pages.controller("ReportsCtrl",
["$log", "$scope", "SessionStore", "$stateParams", "$q", "BIReports", "PageHelper",
    function($log, $scope, SessionStore, $stateParams, $q, BIReports, PageHelper){
    $log.info("ReportsCtrl loaded");

    var userName = SessionStore.getLoginname();

	//sample
    PageHelper.showLoader();
	
	BIReports.reportMenuList().$promise.then(function(response) {
        $scope.dashboardDefinition = response;
    });
	
	BIReports.reportFilterList().$promise.then(function(response) {
        $scope.regionName = [
		{id: '1', name: 'Option A'},
      {id: '2', name: 'Option B'},
      {id: '3', name: 'Option C'}
		];
    });
	
	
	$scope.listHubs = function(){
		alert($scope.selectedRegion.id);
		$scope.HubNames = [{id: '1', hubname: 'Option A'},
      {id: '2', hubname: 'Option B'},
      {id: '3', hubname: 'Option C'}];
	}
	
	$scope.listBranches = function(){
		alert($scope.selectedHub.id);
		$scope.loanOfficers = [{id: '1', user: 'Option A'},
      {id: '2', user: 'Option B'},
      {id: '3', user: 'Option C'}];
	}
	
	$scope.processForm = function(){
    alert($scope.selectedRegion.id+'/'+$scope.selectedHub.id+'/'+$scope.selectedUser.id);
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