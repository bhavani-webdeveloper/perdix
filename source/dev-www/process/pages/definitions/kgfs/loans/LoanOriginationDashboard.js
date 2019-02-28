irf.pageCollection.controller(irf.controller("kgfs.loans.LoanOriginationDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons", "Lead", "Messaging",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Lead, Messaging) {
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        var currentBranch = SessionStore.getCurrentBranch();


        var fullDefinition = {
            "title": "Loan Origination Dashboard",
            "iconClass": "fa fa-users",
            "items": [
                "Page/Engine/kgfs.loans.individual.screening.Input",
               // "Page/Bundle/kgfs.loans.individual.screening.ScreeningInput",
                "Page/Engine/kgfs.loans.individual.screening.ScreeningQueue",
                "Page/Engine/kgfs.loans.individual.screening.MELApplicationFormQueue",
                "Page/Engine/kgfs.loans.individual.screening.ApplicationQueue",
                "Page/Engine/kgfs.loans.individual.screening.CreditAppraisalQueue",
                "Page/Engine/kgfs.loans.individual.screening.DscQueue",
                "Page/Engine/kgfs.loans.individual.screening.DscOverrideQueue",
                "Page/Engine/kgfs.loans.individual.screening.KYCCheckQueue",
                "Page/Engine/kgfs.loans.individual.screening.RiskReviewAndLoanSanctionQueue",
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
                            'per_page': 1
                        }).$promise.then(function(response, headerGetter) {
                            sqMenu.data = Number(response.headers['x-total-count']);
                        }, function() {
                            sqMenu.data = '-';
                        });
                    });   
            }

            var mafqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/kgfs.loans.individual.screening.MELApplicationFormQueue"];

            if (mafqMenu) {
                mafqMenu.data = 0;
                    _.forEach(centres, function(centre) {
                        IndividualLoan.search({
                            'stage': 'MELApplication',
                            'enterprisePincode': '',
                            'applicantName': '',
                            'area': '',
                            'villageName': '',
                            'customerName': '',
                            'page': 1,
                            'per_page': 1,
                        }).$promise.then(function(response, headerGetter) {
                            mafqMenu.data = Number(response.headers['x-total-count']);
                        }, function() {
                            mafqMenu.data = '-';
                        });
                    });   
            }



            var aqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/kgfs.loans.individual.screening.ApplicationQueue"];
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

             var caqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/kgfs.loans.individual.screening.CreditAppraisalQueue"];
            if (caqMenu) {
                IndividualLoan.search({
                    'stage': 'CreditAppraisal',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    caqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    caqMenu.data = '-';
                });
            }

             var daqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/kgfs.loans.individual.screening.DscQueue"];
            if (daqMenu) {
                IndividualLoan.search({
                    'stage': 'DscApproval',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    daqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    daqMenu.data = '-';
                });
            }

             var doqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/kgfs.loans.individual.screening.DscOverrideQueue"];
            if (doqMenu) {
                IndividualLoan.search({
                    'stage': 'LosDscOverride',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    doqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    doqMenu.data = '-';
                });
            }

             var kyccqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/kgfs.loans.individual.screening.KYCCheckQueue"];
            if (kyccqMenu) {
                IndividualLoan.search({
                    'stage': 'KYCCheck',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    kyccqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    kyccqMenu.data = '-';
                });
            }

            var rralsMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/kgfs.loans.individual.screening.RiskReviewAndLoanSanctionQueue"];
            if (rralsMenu) {
                IndividualLoan.search({
                    'stage': 'RiskReviewAndLoanSanction',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    rralsMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    rralsMenu.data = '-';
                });
            }


            var rqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/kgfs.loans.individual.screening.RejectedQueue"];
            if (rqMenu) {
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
                    rqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    rqMenu.data = '-';
                });
            }

        });
    }
]);
