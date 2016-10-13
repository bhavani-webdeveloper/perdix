irf.pages.controller("LoansACHPDCDashboardCtrl",
['$log', '$scope', 'PagesDefinition', 'SessionStore', 'IndividualLoan',
function($log, $scope, PagesDefinition, SessionStore, IndividualLoan) {
    $log.info("Page.LoansACHPDCDashboard.html loaded");

    var fullDefinition = {
        "title": "ACH / PDC Dashboard",
        "iconClass": "fa fa-cc",
        "items": [
            "Page/Engine/loans.individual.achpdc.ACHPDCQueue",
            "Page/Engine/loans.individual.achpdc.ACHRegistration",
            "Page/Engine/loans.individual.achpdc.ACHMandateDownload",
            "Page/Engine/loans.individual.achpdc.ACHMandateQueue",
            "Page/Engine/loans.individual.achpdc.ACHDemandDownload",
            "Page/Engine/loans.individual.achpdc.ACHClearingCollection",
            "Page/Engine/loans.individual.achpdc.PDCRegistration",
            "Page/Engine/loans.individual.achpdc.PDCDemandDownload",
            "Page/Engine/loans.individual.achpdc.PDCCollections",
            "Page/Engine/loans.individual.achpdc.DemandDownloads"
        ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
        $scope.dashboardDefinition = resp;
        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();

        var qMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.achpdc.ACHPDCQueue"];
        if (qMenu) {
            IndividualLoan.searchDisbursement({
                'currentStage': 'ReadyForDisbursement',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                qMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }
    });

}]);