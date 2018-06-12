irf.pages.controller("PageManagementReportDashboardCtrl",
["$log", "$scope", "SessionStore", "$stateParams", "$q", "ReportMaintenance", "PageHelper", "PagesDefinition",
    function($log, $scope, SessionStore, $stateParams, $q, ReportMaintenance, PageHelper, PagesDefinition){
    $log.info("ReportMasterDashboardCtrl loaded");

    PageHelper.clearErrors();

    var fullDefinition = {
        "title": "REPORTS_MASTER_DASHBOARD",
        "iconClass": "fa fa-bar-chart",
        "items": [
            "Page/Engine/management.ReportMasterCreation",
            "Page/Engine/management.ReportMasterSearch",
            "Page/Engine/management.ReportsParameterMapping",
        ]
    };


    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp){
        $scope.dashboardDefinition = resp;
        $log.info(resp);
        $scope.dashboardDefinition.$menuMap['Page/ManagementReportDashboard'].onClick = function(event, menu) {
            var deferred = $q.defer();
            PagesDefinition.getRolePageConfig('Page/ManagementReportDashboard').then(function(config) {
                if (config.pageId) {
                    menu.stateParams.pageId = config.pageId;
                    menu.stateParams.pageData = null;
                    deferred.resolve(menu);
                }
            });
            return deferred.promise;
        };
    });
    
}]);
