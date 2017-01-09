irf.pages.controller("LoanOriginationDashboardCtrl", ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons) {
        $log.info("Page.LoanOriginationDashboard.html loaded");

        var currentBranch = SessionStore.getCurrentBranch();


        var fullDefinition = {
            "title": "Loan Origination Dashboard",
            "iconClass": "fa fa-users",
            "items": [
                "Page/Bundle/loans.individual.screening.ScreeningInput",
                "Page/Engine/loans.individual.screening.ScreeningQueue",
                "Page/Engine/loans.individual.screening.ScreeningReviewQueue",
                "Page/Engine/loans.individual.screening.ApplicationQueue",
                "Page/Engine/loans.individual.screening.ApplicationReviewQueue",
                "Page/Engine/loans.individual.screening.FieldAppraisalQueue",
                "Page/Engine/loans.individual.screening.FieldAppraisalReviewQueue",
                "Page/Engine/loans.individual.screening.CentralRiskReviewQueue",
                "Page/Engine/loans.individual.screening.CreditCommitteeReviewQueue",
                "Page/Engine/loans.individual.screening.LoanSanctionQueue",
                "Page/Engine/loans.individual.screening.RejectedQueue"
            ]
        };

        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;
            var branchId = SessionStore.getBranchId();
            var branchName = SessionStore.getBranch();

            var sqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.screening.ScreeningQueue"];
            if (sqMenu) {
                IndividualLoan.search({
                    'stage': 'Screening',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    sqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    sqMenu.data = '-';
                });
            }

            var srqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.screening.ScreeningReviewQueue"];
            if (srqMenu) {
                IndividualLoan.search({
                    'stage': 'ScreeningReview',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    srqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    srqMenu.data = '-';
                });
            }
/*
            var pqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/psychometric.Queue"];
            if (pqMenu) {
                IndividualLoan.search({
                    'stage': 'Psychometric',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    pqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    pqMenu.data = '-';
                });
            }
*/
            var aqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.screening.ApplicationQueue"];
            if (aqMenu) {
                IndividualLoan.search({
                    'stage': 'Application',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    aqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    aqMenu.data = '-';
                });
            }

            var arqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.screening.ApplicationReviewQueue"];
            if (arqMenu) {
                IndividualLoan.search({
                    'stage': 'ApplicationReview',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    arqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    arqMenu.data = '-';
                });
            }

            var faqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.screening.FieldAppraisalQueue"];
            if (faqMenu) {
                IndividualLoan.search({
                    'stage': 'FieldAppraisal',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                    'branchName': currentBranch.branchName
                }).$promise.then(function(response, headerGetter) {
                    faqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    faqMenu.data = '-';
                });
            }

            var farqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.screening.FieldAppraisalReviewQueue"];
            if (farqMenu) {
                IndividualLoan.search({
                    'stage': 'FieldAppraisalReview',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    farqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    farqMenu.data = '-';
                });
            }

            var crrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.screening.CentralRiskReviewQueue"];
            if (crrqMenu) {
                IndividualLoan.search({
                    'stage':'CentralRiskReview',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                    'branchName': currentBranch.branchName
                }).$promise.then(function(response, headerGetter) {
                    crrqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    crrqMenu.data = '-';
                });
            }

            var ccrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.screening.CreditCommitteeReviewQueue"];
            if (ccrqMenu) {
                IndividualLoan.search({
                    'stage': 'CreditCommitteeReview',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    ccrqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    ccrqMenu.data = '-';
                });
            }

            var lsqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.screening.LoanSanctionQueue"];
            if (lsqMenu) {
                IndividualLoan.search({
                    'stage':  'Sanction',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    lsqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    lsqMenu.data = '-';
                });
            }

            var lrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.screening.RejectedQueue"];
            if (lrqMenu) {
                IndividualLoan.search({
                    'stage':  'Rejected',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    lrqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    lrqMenu.data = '-';
                });
            }

        });
    }
]);