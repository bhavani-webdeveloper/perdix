irf.pageCollection.controller(irf.controller("irep.loans.LoanOriginationDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons","Messaging",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Messaging) {
        $log.info("Page.LoanOriginationDashboard.html loaded");
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        var currentBranch = SessionStore.getCurrentBranch();


        var fullDefinition = {
            "title": "Loan Origination Dashboard",
            "iconClass": "fa fa-users",
            "items": [
                "Page/Bundle/irep.loans.individual.origination.ScreeningInput",
                "Page/Engine/irep.loans.individual.origination.ScreeningQueue",
                "Page/Engine/irep.loans.individual.origination.ScreeningReviewQueue",
                "Page/Engine/irep.loans.individual.origination.ApplicationQueue",
                "Page/Engine/irep.loans.individual.origination.ApplicationReviewQueue",
                "Page/Engine/irep.loans.individual.origination.ZonalRiskReviewQueue",
                "Page/Engine/irep.loans.individual.origination.CentralRiskReviewQueue",
                "Page/Engine/irep.loans.individual.origination.CreditCommitteeReviewQueue",
                "Page/Engine/irep.loans.individual.origination.LoanSanctionQueue",
                "Page/Engine/irep.loans.individual.origination.RejectedAdminQueue"
            ]
        };

        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;
            var branchId = SessionStore.getBranchId();
            var branchName = SessionStore.getBranch();
            var centres = SessionStore.getCentres();

            var sqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.ScreeningQueue"];

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
                        'branchName': currentBranch.branchName,
                        'centreCode': centre.centreCode
                    }).$promise.then(function(response, headerGetter) {
                        sqMenu.data = sqMenu.data + Number(response.headers['x-total-count']);
                    }, function() {
                        sqMenu.data = '-';
                    });
                });
            }


            /*var dqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.DedupeQueue"];

            if (dqMenu) {
                dqMenu.data = 0;
                _.forEach(centres, function(centre) {
                    IndividualLoan.search({
                        'stage': 'Dedupe',
                        'enterprisePincode': '',
                        'applicantName': '',
                        'area': '',
                        'villageName': '',
                        'customerName': '',
                        'page': 1,
                        'per_page': 1,
                        'branchName': currentBranch.branchName,
                        'centreCode': centre.centreCode
                    }).$promise.then(function(response, headerGetter) {
                        dqMenu.data = dqMenu.data + Number(response.headers['x-total-count']);
                    }, function() {
                        dqMenu.data = '-';
                    });
                });
            }*/


            var srqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.ScreeningReviewQueue"];
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
            var aqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.ApplicationQueue"];

            if (aqMenu) {
                aqMenu.data = 0;
                $log.info("centres");
                $log.info(centres);
                _.forEach(centres, function(centre) {
                    IndividualLoan.search({
                        'stage': 'Application',
                        'enterprisePincode': '',
                        'applicantName': '',
                        'area': '',
                        'villageName': '',
                        'customerName': '',
                        'page': 1,
                        'per_page': 1,
                        'branchName': currentBranch.branchName,
                        'centreCode': centre.centreCode
                    }).$promise.then(function(response, headerGetter) {
                        aqMenu.data = aqMenu.data + Number(response.headers['x-total-count']);
                    }, function() {
                        aqMenu.data = '-';
                    });
                });
            }


            var arqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.ApplicationReviewQueue"];
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
                    'branchName': currentBranch.branchName
                }).$promise.then(function(response, headerGetter) {
                    arqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    arqMenu.data = '-';
                });
            }

      /*      var faqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.FieldAppraisalQueue"];
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

            var farqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.FieldAppraisalReviewQueue"];
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
                    'branchName': currentBranch.branchName
                }).$promise.then(function(response, headerGetter) {
                    farqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    farqMenu.data = '-';
                });
            }*/

            var zrrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.ZonalRiskReviewQueue"];
            if (zrrqMenu) {
                IndividualLoan.search({
                    'stage': 'ZonalRiskReview',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                    'branchName': currentBranch.branchName
                }).$promise.then(function(response, headerGetter) {
                    zrrqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    zrrqMenu.data = '-';
                });
            }

            var crrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.CentralRiskReviewQueue"];
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

            var ccrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.CreditCommitteeReviewQueue"];
            if (ccrqMenu) {
                IndividualLoan.search({
                    'stage': 'CreditCommitteeReview',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1
                }).$promise.then(function(response, headerGetter) {
                    ccrqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    ccrqMenu.data = '-';
                });
            }

            var lsqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.LoanSanctionQueue"];
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
/*
            var lrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.RejectedQueue"];
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
            }*/

            var lrq1Menu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.RejectedAdminQueue"];
            if (lrq1Menu) {
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
                    lrq1Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    lrq1Menu.data = '-';
                });
            }

        });
    }
]);
