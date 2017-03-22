irf.pages.controller("ReportsDashboardCtrl",
["$log", "$scope", "SessionStore", "$stateParams", "$q", "BIReports", "PageHelper", "PagesDefinition",
    function($log, $scope, SessionStore, $stateParams, $q, BIReports, PageHelper, PagesDefinition){
    $log.info("ReportsDashboardCtrl loaded");

    PageHelper.clearErrors();
    var fullDefinition = {
        "title": "Reports Dashboard",
        "items": [
            "Page/Engine/bi.BIReports",
            "Page/Reports"
        ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp){
        $scope.dashboardDefinition = resp;
        $log.info(resp);
        $scope.dashboardDefinition.$menuMap['Page/Reports'].onClick = function(event, menu) {
            var deferred = $q.defer();
            PagesDefinition.getRolePageConfig('Page/Reports').then(function(config) {
                if (config.pageId) {
                    menu.stateParams.pageId = config.pageId;
                    menu.stateParams.pageData = null;
                    deferred.resolve(menu);
                }
            });
            return deferred.promise;
        };
    });
/*
	//sample
    PageHelper.showLoader();
	
	BIReports.reportMenuList().$promise.then(function(response) {
		console.log(response);
        $scope.dashboardDefinition = response;
    });
	
    BIReports.reportList({"sd":"sd"}).$promise.then(function(resp){
        self.formSource[0].items[0].titleMap = resp;
        self.form = self.formSource;
    }, function(errResp){
        PageHelper.showErrors(errResp);
    }).finally(function(){
        PageHelper.hideLoader();
    });
*/
}]);