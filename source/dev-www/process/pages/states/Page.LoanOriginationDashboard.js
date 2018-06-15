irf.pages.controller("LoanOriginationDashboardCtrl", ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan","Messaging",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, Messaging) {
        $log.info("Page.LoanOriginationDashboard.html loaded");

        var currentBranch = SessionStore.getCurrentBranch();


        var fullDefinition = {
            "title": "Loan Origination Dashboard",
            "iconClass": "fa fa-users",
            "items": [
                "Page/Bundle/loans.individual.screening.ScreeningInput",
                "Page/Engine/loans.individual.screening.ScreeningQueue",
                "Page/Engine/loans.individual.screening.DedupeQueue",
                "Page/Engine/loans.individual.screening.ScreeningReviewQueue",
                "Page/Engine/loans.individual.screening.ApplicationQueue",
                "Page/Engine/loans.individual.screening.ApplicationReviewQueue",
                "Page/Engine/loans.individual.screening.FieldAppraisalQueue",
                "Page/Engine/loans.individual.screening.FieldAppraisalReviewQueue",
                "Page/Engine/loans.individual.screening.ZonalRiskReviewQueue",
                "Page/Engine/loans.individual.screening.CentralRiskReviewQueue",
                "Page/Engine/loans.individual.screening.CreditCommitteeReviewQueue",
                "Page/Engine/loans.individual.screening.LoanSanctionQueue",
                "Page/Engine/loans.individual.screening.RejectedQueue",
                "Page/Engine/loans.individual.screening.RejectedAdminQueue",
                "Page/Engine/loans.individual.screening.BranchNewConversationQueue",
                "Page/Engine/loans.individual.screening.BranchRepliedConversationQueue",
                "Page/Engine/loans.individual.screening.SpokeNewConversationQueue",
                "Page/Engine/loans.individual.screening.SpokeRepliedConversationQueue"
            ]
        };

        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;
            var branchId = SessionStore.getBranchId();
            var branchName = SessionStore.getBranch();
            var centres = SessionStore.getCentres();

            var sqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.screening.ScreeningQueue"];

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


            var dqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.screening.DedupeQueue"];

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
                    'branchName': currentBranch.branchName
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
                    'branchName': currentBranch.branchName
                }).$promise.then(function(response, headerGetter) {
                    farqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    farqMenu.data = '-';
                });
            }

            var zrrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.screening.ZonalRiskReviewQueue"];
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
                    'per_page': 1
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

            var lrq1Menu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.screening.RejectedAdminQueue"];
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

            var bncqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.screening.BranchNewConversationQueue"];
            if (bncqMenu) {
                Messaging.findConversation({
                    'replied':  'false',
                    'page': 1,
                    'per_page': 1,
                    'branchName': currentBranch.branchName
                }).$promise.then(function(response, headerGetter) {
                    bncqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    bncqMenu.data = '-';
                });
            }

            var brcqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.screening.BranchRepliedConversationQueue"];
            if (brcqMenu) {
                Messaging.findConversation({
                    'replied':  'true',
                    'page': 1,
                    'per_page': 1,
                    'branchName': currentBranch.branchName
                }).$promise.then(function(response, headerGetter) {
                    brcqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    brcqMenu.data = '-';
                });
            }

            var sncqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.screening.SpokeNewConversationQueue"];
            if (sncqMenu) {
                var centreCode = [];
                _.forEach(centres, function(centre) {
                    centreCode.push(centre.centreCode);
                });
                centreCode = _.join(centreCode, ',');
                $log.info(centreCode);
                Messaging.findConversation({
                    'replied':  'false',
                    'page': 1,
                    'per_page': 1,
                    'branchName': currentBranch.branchName,
                    'centreCode': centreCode
                }).$promise.then(function(response, headerGetter) {
                    sncqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    sncqMenu.data = '-';
                });
            }

            var srcqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.screening.SpokeRepliedConversationQueue"];
            if (srcqMenu) {
                var centreCode = [];
                _.forEach(centres, function(centre) {
                    centreCode.push(centre.centreCode);
                });
                centreCode = _.join(centreCode, ',');
                Messaging.findConversation({
                    'replied':  'true',
                    'page': 1,
                    'per_page': 1,
                    'branchName': currentBranch.branchName,
                    'centreCode': centreCode
                }).$promise.then(function(response, headerGetter) {
                    srcqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    srcqMenu.data = '-';
                });
            }

        });
    }
]);
