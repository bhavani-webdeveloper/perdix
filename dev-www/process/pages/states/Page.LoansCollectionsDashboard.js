irf.pages.controller("LoansCollectionsDashboardCtrl",
['$log', '$scope', 'PagesDefinition', 'SessionStore', 'LoanProcess', 'LoanCollection',
function($log, $scope, PagesDefinition, SessionStore, LoanProcess, LoanCollection) {
    $log.info("Page.LoansCollectionsDashboard.html loaded");

    var fullDefinition = {
        "title": "Collections Dashboard",
        "iconClass": "fa fa-reply",
        "items": [
            "Page/Engine/loans.individual.collections.BounceQueue",
            "Page/Engine/loans.individual.collections.BouncePromiseQueue",
            "Page/Engine/loans.individual.collections.BounceRecoveryQueue",
            "Page/Engine/loans.individual.collections.CreditValidationQueue",
            "Page/Engine/loans.individual.collections.TransactionAuthorizationQueue",
            "Page/Engine/loans.individual.collections.DepositStage"
        ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
        $scope.dashboardDefinition = resp;
        var branchId = SessionStore.getBranchId();

        var bqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.collections.BounceQueue"];
        if (bqMenu) {
            var centres = SessionStore.getCentres();
            bqMenu.data = 0;
            for (var i = 0; i < centres.length; i++) {
                LoanProcess.bounceCollectionDemand({ 'branchId': branchId, 'centreId': centres[i].id }).$promise.then(function(response,headerGetter){
                    bqMenu.data += response.body.length; // Number(headerGetter()['x-total-count']);
                }, function() {
                    cvqMenu.data = '-';
                });
            };
        }

        var bpqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.collections.BouncePromiseQueue"];
        if (bpqMenu) {
            LoanProcess.bounceCollectionDemand({ 'branchId': branchId }).$promise.then(function(response,headerGetter){
                bpqMenu.data = response.body.length; // Number(headerGetter()['x-total-count']);
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var brqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.collections.BounceRecoveryQueue"];
        if (brqMenu) {

            LoanProcess.p2pKGFSList({
                'branchId': branchId,
                'customerCategoryHubManager':'C,D'
            }).$promise.then(function(response,headerGetter){
                brqMenu.data = response.body.length; // Number(headerGetter()['x-total-count']);
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var cvqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.collections.CreditValidationQueue"];
        if (cvqMenu) {
            LoanCollection.query({
                    'currentStage':"CreditValidation"
                }).$promise.then(function(response, headerGetter){
                    cvqMenu.data = response.headers['x-total-count'];
                })
        }

        var taqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.collections.TransactionAuthorizationQueue"];
        if (taqMenu) {
            LoanCollection.query({
                    'currentStage':"PartialPayment"
                }).$promise.then(function(response, headerGetter){
                    taqMenu.data = response.headers['x-total-count'];
                })
        }
    });

}]);