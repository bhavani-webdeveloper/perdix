irf.pageCollection.controller(irf.controller("kgfs.loans.LoanOriginationDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons", "Lead", "Messaging",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Lead, Messaging) {
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        var currentBranch = SessionStore.getCurrentBranch();


        var fullDefinition = {
            "title": "Loan Origination Dashboard",
            "iconClass": "fa fa-users",
            "items": [
                "Page/Bundle/kgfs.loans.individual.screening.ScreeningInput",
                "Page/Engine/kgfs.loans.individual.screening.ScreeningQueue",
                "Page/Engine/kgfs.loans.individual.screening.MELApplicationForm",
                "Page/Engine/kgfs.loans.individual.screening.ScreeningReviewQueue",
                "Page/Engine/kgfs.loans.individual.screening.CreditAppraisalQueue",
                "Page/Engine/kgfs.loans.individual.screening.DscApprovalQueue",
                "Page/Engine/kgfs.loans.individual.screening.DscOverrideQueue",
                "Page/Engine/kgfs.loans.individual.screening.KYCCheck",
                "Page/Engine/kgfs.loans.individual.screening.RejectedQueue"
            ]
        };

        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;
            var branchId = SessionStore.getBranchId();
            var branchName = SessionStore.getBranch();
            var centres = SessionStore.getCentres();

            var sqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/kgfs.loans.individual.screening.ScreeningQueue"];

            if (sqMenu) {
                sqMenu.data = 0;
                    _.forEach(centres, function(centre) {
                        IndividualLoan.search({
                            'stage': 'Screening',
                            'enterprisePincode': '',
                            'applicantName': '',
                            'area': '',
                            'villageName': '',
                            'customerName': '',
                            'page': 1,
                            'per_page': 1,
                            'centreCode': centre.centreCode
                        }).$promise.then(function(response, headerGetter) {
                            sqMenu.data = sqMenu.data + Number(response.headers['x-total-count']);
                        }, function() {
                            sqMenu.data = '-';
                        });
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
