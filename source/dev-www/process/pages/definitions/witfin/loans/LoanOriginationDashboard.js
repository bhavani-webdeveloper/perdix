irf.pageCollection.controller(irf.controller("witfin.loans.LoanOriginationDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons", "Lead",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Lead) {
        $log.info("Page.LoanOriginationDashboard.html loaded");
        $scope.$templateUrl = "process/pages/templates/Page.LoanOriginationDashboard.html";
        var currentBranch = SessionStore.getCurrentBranch();

        var leadDefinition = {
            "title": "Lead",
            "iconClass": "fa fa-users",
            "items": [
                "Page/Engine/witfin.lead.LeadGeneration",
                "Page/Engine/witfin.lead.IncompleteLeadQueue",
                "Page/Engine/witfin.lead.LeadFollowUpQueue",
                "Page/Engine/witfin.lead.LeadBulkUpload",
                "Page/Engine/witfin.lead.LeadAssignmentPendingQueue",
                "Page/Engine/witfin.lead.LeadRejectedQueue",
            ]
        };
        var loanDefinition = {
            "title": "Loan",
            "iconClass": "fa fa-users",
            "items": [
                "Page/Engine/witfin.lead.ReadyForScreeningQueue",
                "Page/Engine/witfin.loans.individual.screening.ScreeningQueue",
                "Page/Engine/witfin.loans.individual.screening.ScreeningReviewQueue",
                "Page/Engine/witfin.loans.individual.screening.VehicleValuationQueue",
                "Page/Engine/witfin.loans.individual.screening.ApplicationQueue",
                "Page/Engine/witfin.loans.individual.screening.ApplicationReviewQueue",
                "Page/Engine/witfin.loans.individual.screening.BranchCrAppraisalQueue",
                "Page/Engine/witfin.loans.individual.screening.HOCrAppraisalQueue",
                "Page/Engine/witfin.loans.individual.screening.ManagementCommitteeQueue",
                "Page/Engine/witfin.loans.individual.screening.RejectedQueue"
            ]
        };
        

        PagesDefinition.getUserAllowedDefinition(leadDefinition).then(function(resp) {
            $scope.leadDashboardDefinition = resp;
            var branchId = SessionStore.getBranchId();
            var branchName = SessionStore.getBranch();
            var centres = SessionStore.getCentres();

            var lapqMenu = $scope.leadDashboardDefinition.$menuMap["Page/Engine/witfin.lead.LeadAssignmentPendingQueue"];
            var lfuqMenu = $scope.leadDashboardDefinition.$menuMap["Page/Engine/witfin.lead.LeadFollowUpQueue"];
            var ilqMenu = $scope.leadDashboardDefinition.$menuMap["Page/Engine/witfin.lead.IncompleteLeadQueue"];
            
            var rMenu = $scope.leadDashboardDefinition.$menuMap["Page/Engine/witfin.lead.LeadRejectedQueue"];

            if (rMenu) rMenu.data = 0;
            if (lapqMenu) lapqMenu.data = 0;
            if (lfuqMenu) lfuqMenu.data = 0;
            if (ilqMenu) ilqMenu.data = 0;
            

               _.forEach(centres, function(centre) {

                
                if (lfuqMenu) {
                    Lead.search({
                        'branchName': branchName,
                        'currentStage': "Inprocess",
                        'leadStatus': "FollowUp",
                        'leadName': '',
                        'area': '',
                        'cityTownVillage': '',
                        'businessName': '',
                        'page': 1,
                        'per_page': 1,
                        'centreName': centre.centreName
                    }).$promise.then(function(response, headerGetter) {
                        if (!_.isNumber(lfuqMenu.data)) {
                            lfuqMenu.data = 0;
                        }
                        lfuqMenu.data = lfuqMenu.data + Number(response.headers['x-total-count']);
                    }, function() {
                        lfuqMenu.data = '-';
                    });
                }

                if (ilqMenu) {
                    Lead.search({
                        'branchName': branchName,
                        'currentStage': "Incomplete",
                        'leadName': '',
                        'area': '',
                        'cityTownVillage': '',
                        'businessName': '',
                        'page': 1,
                        'per_page': 1,
                        'centreName': centre.centreName
                    }).$promise.then(function(response, headerGetter) {
                        if (!_.isNumber(ilqMenu.data)) {
                            ilqMenu.data = 0;
                        }
                        ilqMenu.data = ilqMenu.data + Number(response.headers['x-total-count']);
                    }, function() {
                        ilqMenu.data = '-';
                    });
                }

                if (rMenu) {
                    Lead.search({
                        'branchName': branchName,
                        'currentStage': "Inprocess",
                        'leadStatus': "Reject",
                        'leadName': '',
                        'area': '',
                        'cityTownVillage': '',
                        'businessName': '',
                        'page': 1,
                        'per_page': 1,
                        'centreName': centre.centreName
                    }).$promise.then(function(response, headerGetter) {
                        if (!_.isNumber(rMenu.data)) {
                            rMenu.data = 0;
                        }
                        rMenu.data = rMenu.data + Number(response.headers['x-total-count']);
                    }, function() {
                        rMenu.data = '-';
                    });
                }
            })


            if (lapqMenu) {
                Lead.search({
                    'branchName': branchName,
                    'currentStage': "Assignment Pending",
                    'leadName': '',
                    'area': '',
                    'cityTownVillage': '',
                    'businessName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    lapqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    lapqMenu.data = '-';
                });
            }

            
        });
        PagesDefinition.getUserAllowedDefinition(loanDefinition).then(function(resp) {

            $scope.loanDashboardDefinition = resp;
            var branchId = SessionStore.getBranchId();
            var branchName = SessionStore.getBranch();
            var centres = SessionStore.getCentres();

            var rfqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.lead.ReadyForScreeningQueue"];
            if (rfqMenu) rfqMenu.data = 0;
            _.forEach(centres, function(centre) {
                if (rfqMenu) {
                    Lead.search({
                        'branchName': branchName,
                        'currentStage': "ReadyForScreening",
                        'leadName': '',
                        'area': '',
                        'cityTownVillage': '',
                        'businessName': '',
                        'page': 1,
                        'per_page': 1,
                        'centreName': centre.centreName
                    }).$promise.then(function(response, headerGetter) {
                        if (!_.isNumber(rfqMenu.data)) {
                            rfqMenu.data = 0;
                        }
                        rfqMenu.data = rfqMenu.data + Number(response.headers['x-total-count']);
                    }, function() {
                        rfqMenu.data = '-';
                    });
                }

            });

            var sqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.ScreeningQueue"];

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

            var srqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.ScreeningReviewQueue"];
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

            var prqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.VehicleValuationQueue"];
            if (prqMenu) {
                IndividualLoan.search({
                    'stage': 'VehicleValuation',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    prqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    prqMenu.data = '-';
                });
            }

            var aqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.ApplicationQueue"];

            if (aqMenu) {
                aqMenu.data = 0;
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

            var arqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.ApplicationReviewQueue"];
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


            var bcaqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.BranchCrAppraisalQueue"];
            if (bcaqMenu) {
                IndividualLoan.search({
                    'stage': 'BranchCreditAppraisal',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                    'branchName': currentBranch.branchName
                }).$promise.then(function(response, headerGetter) {
                    bcaqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    bcaqMenu.data = '-';
                });
            }

            var hocaqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.HOCrAppraisalQueue"];
            if (hocaqMenu) {
                IndividualLoan.search({
                    'stage': 'HOCreditAppraisal',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                    'branchName': currentBranch.branchName
                }).$promise.then(function(response, headerGetter) {
                    hocaqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    hocaqMenu.data = '-';
                });
            }

            var mcqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.ManagementCommitteeQueue"];
            if (mcqMenu) {
                IndividualLoan.search({
                    'stage': 'ManagementCommittee',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                    'branchName': currentBranch.branchName
                }).$promise.then(function(response, headerGetter) {
                    mcqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    mcqMenu.data = '-';
                });
            }


            var drqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.RejectedQueue"];
            if (drqMenu) {
                IndividualLoan.search({
                    'stage': 'Rejected',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    drqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    drqMenu.data = '-';
                });
            }




        });
    }
]);
