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