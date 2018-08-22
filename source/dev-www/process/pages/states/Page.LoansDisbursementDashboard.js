irf.pages.controller("LoansDisbursementDashboardCtrl",
['$log', '$scope', 'PagesDefinition', 'SessionStore', 'IndividualLoan',
function($log, $scope, PagesDefinition, SessionStore, IndividualLoan) {
    $log.info("Page.LoansDisbursementDashboard.html loaded");

    var fullDefinition = {
        "title": "Disbursement Dashboard",
        "iconClass": "fa fa-share",
        "items": [
            "Page/Engine/loans.individual.disbursement.ReadyForDisbursementQueue",
            "Page/Engine/loans.individual.disbursement.DisbursementConfirmationQueue",
            "Page/Engine/loans.individual.disbursement.DisbursementReversalQueue",
            "Page/Engine/loans.individual.disbursement.DisbursementConfirmationUpload",
            "Page/Engine/loans.individual.disbursement.DisbursementDocumentUploadQueue",
            "Page/Engine/loans.individual.booking.DisbursementDocumentUploadQueue",
            "Page/Engine/loans.individual.disbursement.RejectedDisbursementQueue",
            "Page/Engine/loans.individual.disbursement.MultiTrancheQueue",
            "Page/Engine/loans.individual.disbursement.PendingFROQueue",
            "Page/Engine/loans.individual.disbursement.PendingCROQueue",
            "Page/Engine/loans.individual.disbursement.MultiTrancheBookingQueue",
            "Page/Engine/loans.individual.disbursement.EMIScheduleGenQueue",
            "Page/Engine/loans.individual.disbursement.MultiDocVerificationQueue",
            "Page/Engine/loans.individual.disbursement.LOCDisbursement",
            "Page/Engine/loans.individual.disbursement.LOCDisbursementQueue"
        ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
        $scope.dashboardDefinition = resp;
        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();

        var rfdqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.ReadyForDisbursementQueue"];
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

        var dcqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.DisbursementConfirmationQueue"];
        if (dcqMenu) {
            IndividualLoan.searchDisbursement({
                'currentStage': 'DisbursementConfirmation',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                dcqMenu.data = response.headers['x-total-count'];
            }, function() {
                dcqMenu.data = '-';
            });
        }

        var drqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.DisbursementReversalQueue"];
        if (dcqMenu) {
            IndividualLoan.searchDisbursement({
                'currentStage': 'Completed',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                dcqMenu.data = response.headers['x-total-count'];
            }, function() {
                dcqMenu.data = '-';
            });
        }

        var rdqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.RejectedDisbursementQueue"];
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

        var mtqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.MultiTrancheQueue"];
        if (mtqMenu) {
            IndividualLoan.searchDisbursement({
                'currentStage': 'MTDisbursementDataCapture',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                mtqMenu.data = response.headers['x-total-count'];
            }, function() {
                mtqMenu.data = '-';
            });
        }

        var pfroqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.PendingFROQueue"];
        if (pfroqMenu) {
            IndividualLoan.searchDisbursement({
                'currentStage': 'FROApproval',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                pfroqMenu.data = response.headers['x-total-count'];
            }, function() {
                pfroqMenu.data = '-';
            });
        }

        var pcroqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.PendingCROQueue"];
        if (pcroqMenu) {
            IndividualLoan.searchDisbursement({
                'currentStage': 'CROApproval',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                pcroqMenu.data = response.headers['x-total-count'];
            }, function() {
                pcroqMenu.data = '-';
            });
        }

        var mtbqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.MultiTrancheBookingQueue"];
        if (mtbqMenu) {
            IndividualLoan.searchDisbursement({
                'currentStage': 'MTBooking',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                mtbqMenu.data = response.headers['x-total-count'];
            }, function() {
                mtbqMenu.data = '-';
            });
        }

        var emisgqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.EMIScheduleGenQueue"];
        if (emisgqMenu) {
            IndividualLoan.searchDisbursement({
                'currentStage': 'DocumentUpload',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                emisgqMenu.data = response.headers['x-total-count'];
            }, function() {
                emisgqMenu.data = '-';
            });
        }

        var mdvqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.MultiDocVerificationQueue"];
        if (mdvqMenu) {
            IndividualLoan.searchDisbursement({
                'currentStage': 'DocumentVerification',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                mdvqMenu.data = response.headers['x-total-count'];
            }, function() {
                mdvqMenu.data = '-';
            });
        }

        var dduMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.DisbursementDocumentUploadQueue"];
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

}]);