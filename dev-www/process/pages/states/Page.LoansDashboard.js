irf.pages.controller("LoansDashboardCtrl", ['$log', '$scope','PageHelper', '$stateParams',
    'irfStorageService','SessionStore', 'PagesDefinition',
    function($log, $scope,PageHelper, $stateParams, irfStorageService, SessionStore, PagesDefinition){
    $log.info("Page.LoansDashboard.html loaded");
    PageHelper.clearErrors();
    var fullDefinition = {
        "title": "Actions",
        "items": [
            "Page/Engine/loans.individual.LoanBookingQueue",
            "Page/Engine/loans.individual.PendingClearingQueue",
            "Page/Engine/loans.individual.PendingCashQueue",
            "Page/Engine/loans.individual.BounceQueue"
        ]
    };

    PagesDefinition.getUserAllowedDefinition(SessionStore.getLoginname(), fullDefinition).then(function(resp){
        $scope.dashboardDefinition = resp;
        $log.info(resp);
        $scope.dashboardDefinition.$menuMap['Page/Engine/loans.individual.LoanBookingQueue'].data=10;
    });

}]);
