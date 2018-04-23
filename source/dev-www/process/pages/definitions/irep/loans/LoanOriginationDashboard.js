irf.pageCollection.controller(irf.controller("irep.loans.LoanOriginationDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons","Messaging",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Messaging) {
        $log.info("Page.LoanOriginationDashboard.html loaded");
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        var currentBranch = SessionStore.getCurrentBranch();
           

        /* ScreeningQueue : KYC & CB SUBMISSION queue,
           ScreeningReviewQueue : Kyc and cb review ,
           Application Queue : Appraisal Queue ,
           Application Review Queue : Appraisal Review Queue,
           Zonal RiskReview Queue : Tele Verification ,
           Central Risk Review Queue : Evaluation , 

         
        */  

        var fullDefinition = {
            "title": "Loan Origination Dashboard",
            "iconClass": "fa fa-users",
            "items": [
                "Page/Bundle/irep.loans.individual.origination.KycCBInput",
                "Page/Engine/irep.loans.individual.origination.KycCbQueue",
                "Page/Engine/irep.loans.individual.origination.KycCbReviewQueue",
                "Page/Engine/irep.loans.individual.origination.AppraisalQueue",
                "Page/Engine/irep.loans.individual.origination.AppraisalReviewQueue",
                "Page/Engine/irep.loans.individual.origination.TeleverificationQueue",
                "Page/Engine/irep.loans.individual.origination.EvaluationReviewQueue",
                "Page/Engine/irep.loans.individual.origination.CreditCommitteeReviewQueue",
                "Page/Engine/irep.loans.individual.origination.GuarantorAdditionQueue",                                
                "Page/Engine/irep.loans.individual.origination.LoanSanctionQueue",
                "Page/Engine/irep.loans.individual.origination.RejectedAdminQueue"
            ]
        };

        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;
            var branchId = SessionStore.getBranchId();
            var branchName = SessionStore.getBranch();
            var centres = SessionStore.getCentres();

            var sqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.KycCbQueue"];

            if (sqMenu) {
                sqMenu.data = 0;
                _.forEach(centres, function(centre) {
                    IndividualLoan.search({
                        'stage': 'KYC',
                        'enterprisePincode': '',
                        'applicantName': '',
                        'area': '',
                        'villageName': '',
                        'customerName': '',
                        'page': 1,
                        'per_page': 1/*,
                        'branchName': currentBranch.branchName,
                        'centreCode': centre.centreCode*/
                    }).$promise.then(function(response, headerGetter) {
                        sqMenu.data = sqMenu.data + Number(response.headers['x-total-count']);
                    }, function() {
                        sqMenu.data = '-';
                    });
                });
            }

            var srqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.KycCbReviewQueue"];
            if (srqMenu) {
                IndividualLoan.search({
                    'stage': 'KYCReview',
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

            var aqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.AppraisalQueue"];

            if (aqMenu) {
                aqMenu.data = 0;
                $log.info("centres");
                $log.info(centres);
                _.forEach(centres, function(centre) {
                    IndividualLoan.search({
                        'stage': 'Appraisal',
                        'enterprisePincode': '',
                        'applicantName': '',
                        'area': '',
                        'villageName': '',
                        'customerName': '',
                        'page': 1,
                        'per_page': 1,
                        // 'branchName': currentBranch.branchName,
                        // 'centreCode': centre.centreCode
                    }).$promise.then(function(response, headerGetter) {
                        aqMenu.data = aqMenu.data + Number(response.headers['x-total-count']);
                    }, function() {
                        aqMenu.data = '-';
                    });
                });
            }


            var arqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.AppraisalReviewQueue"];
            if (arqMenu) {
                IndividualLoan.search({
                    'stage': 'AppraisalReview',
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

            var zrrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.TeleverificationQueue"];
            if (zrrqMenu) {
                IndividualLoan.search({
                    'stage': 'Televerification',
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

            var crrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.EvaluationReviewQueue"];
            if (crrqMenu) {
                IndividualLoan.search({
                    'stage':'Evaluation',
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


            var crrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/irep.loans.individual.origination.GuarantorAdditionQueue"];
            if (crrqMenu) {
                IndividualLoan.search({
                    'stage':'GuarantorAddition',
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
