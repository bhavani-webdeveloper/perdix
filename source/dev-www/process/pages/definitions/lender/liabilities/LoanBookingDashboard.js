irf.pageCollection.controller(irf.controller("lender.liabilities.LoanBookingDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "LiabilityAccountProcess", "LoanBookingCommons","Messaging",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, LiabilityAccountProcess, LoanBookingCommons, Messaging) {
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";

        var fullDefinition = {
            "title": "Loan Booking Dashboard",
            "iconClass": "fa fa-users",
            "items": [
                "Page/Engine/lender.liabilities.LiabilityLoanAccountBooking",
                "Page/Engine/lender.liabilities.LoanBookingQueue",
                "Page/Engine/lender.liabilities.DocumentUpoadQueue",
                "Page/Engine/lender.liabilities.DocumentVerificationQueue",
                "Page/Engine/lender.liabilities.DisbursementConfirmationQueue",
                "Page/Engine/lender.liabilities.ScheduleUploadQueue"
            ]
        };

        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;

            var lbqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/lender.liabilities.LoanBookingQueue"];
            if (lbqMenu) {
                LiabilityAccountProcess.search({
                    'status': 'LiabilityAccount',
                    'page': 1,
                    'per_page': 1
                }).$promise.then(function(response, headerGetter) {
                    lbqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    lbqMenu.data = '-';
                });
            }

            var duqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/lender.liabilities.DocumentUpoadQueue"];
            if (duqMenu) {
                LiabilityAccountProcess.search({
                    'status': 'LenderDocumentUpload',
                    'page': 1,
                    'per_page': 1
                }).$promise.then(function(response, headerGetter) {
                    duqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    duqMenu.data = '-';
                });
            }

            var dvMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/lender.liabilities.DocumentVerificationQueue"];
            if (dvMenu) {
                LiabilityAccountProcess.search({
                    'status': 'LenderDocumentVerification',
                    'page': 1,
                    'per_page': 1
                }).$promise.then(function(response, headerGetter) {
                    dvMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    dvMenu.data = '-';
                });
            }

            var dcMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/lender.liabilities.DisbursementConfirmationQueue"];
            if (dcMenu) {
                LiabilityAccountProcess.search({
                    'status': 'DisbursementConfirmation',
                    'page': 1,
                    'per_page': 1
                }).$promise.then(function(response, headerGetter) {
                    dcMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    dcMenu.data = '-';
                });
            }

            var suMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/lender.liabilities.ScheduleUploadQueue"];
            if (suMenu) {
                LiabilityAccountProcess.search({
                    'status': 'ScheduleUpload',
                    'page': 1,
                    'per_page': 1
                }).$promise.then(function(response, headerGetter) {
                    suMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    suMenu.data = '-';
                });
            }
        });
    }
]);
