irf.pages.controller("LoansDashboardCtrl", ['$log', '$scope','PageHelper', '$stateParams',
    'irfStorageService', 'PagesDefinition',
    function($log, $scope,PageHelper, $stateParams, irfStorageService, PagesDefinition){
    $log.info("Page.LoansDashboard.html loaded");
    PageHelper.clearErrors();
    var fullDefinition = {
        "title": "Loans Dashboard",
        "items": [
            "Page/Engine/loans.individual.booking.LoanBookingQueue",
            "Page/Engine/loans.individual.PendingClearingQueue",
            "Page/Engine/loans.individual.PendingCashQueue",
            "Page/Engine/loans.individual.BounceQueue"
        ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp){
        $scope.dashboardDefinition = resp;
        $log.info(resp);
        $scope.dashboardDefinition.$menuMap['Page/Engine/loans.individual.booking.LoanBookingQueue'].data=10; // TODO remove hardcoding
    });

}]);
