irf.pageCollection.controller(irf.controller("shramsarathi.dashboard.loans.individual.disbursement.LoansDisbursementDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons", "Lead",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Lead) {
        $log.info("Page.LoanOriginationDashboard.html loaded");
       //$scope.$templateUrl = "process/pages/templates/Page.LoanOriginationDashboard.html";
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        var currentBranch = SessionStore.getCurrentBranch();

        var fullDefinition = {
            "title": "Disbursement Dashboard",
            "iconClass": "fa fa-share",
            "items": [
                "Page/Engine/shramsarathi.dashboard.loans.individual.disbursement.ReadyForDisbursementQueue",
                "Page/Engine/shramsarathi.dashboard.loans.individual.disbursement.DisbursementConfirmationQueue",
                "Page/Engine/shramsarathi.dashboard.loans.individual.disbursement.DisbursementConfirmationUpload",
                "Page/Engine/shramsarathi.dashboard.loans.individual.disbursement.RejectedDisbursementQueue"
            ]
        };
    
        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;
            var branchId = SessionStore.getBranchId();
            var branchName = SessionStore.getBranch();
            var customerBranchId = SessionStore.getCurrentBranch().branchId;
    
            var rfdqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.disbursement.ReadyForDisbursementQueue"];
            if (rfdqMenu) {
                IndividualLoan.searchDisbursement({
                    'currentStage': 'ReadyForDisbursement',
                    'page': 1,
                    'per_page': 1
                }).$promise.then(function(response,headerGetter){
                    rfdqMenu.data = response.headers['x-total-count'];
                }, function() {
                    rfdqMenu.data = '-';
                });
            }
    
            var dcqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.disbursement.DisbursementConfirmationQueue"];
            if (dcqMenu) {
                IndividualLoan.searchDisbursement({
                    'currentStage': 'DisbursementConfirmation',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response,headerGetter){
                    dcqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    dcqMenu.data = '-';
                });
            }
    
            var rdqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.disbursement.RejectedDisbursementQueue"];
            if (rdqMenu) {
                IndividualLoan.searchDisbursement({
                    'currentStage': 'RejectedDisbursement',
                    'page': 1,
                    'per_page': 1
                }).$promise.then(function(response,headerGetter){
                    rdqMenu.data = response.headers['x-total-count'];
                }, function() {
                    rdqMenu.data = '-';
                });
            }
    
    
            var dduMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.disbursement.DisbursementConfirmationUpload"];
            if (dduMenu) {
                 IndividualLoan.search({
                    'stage': 'DisbursementDocumentUpload',
                    'branchName': '',
                    'page': 1,
                    'per_page': 1
                }).$promise.then(function(response,headerGetter){
                    dduMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    dduMenu.data = '-';
                });
            }
        });
    
    }
]);
