irf.pageCollection.controller(irf.controller("pahal.loans.LoanOriginationDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons", "Lead",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Lead) {
        $log.info("Page.LoanOriginationDashboard.html loaded");
        $scope.$templateUrl = "process/pages/templates/Page.LoanOriginationDashboard.html";
        var currentBranch = SessionStore.getCurrentBranch();

        var leadDefinition = {
            "title": "Lead",
            "iconClass": "fa fa-users",
            "items": [
                "Page/Engine/pahal.lead.LeadGeneration",
                "Page/Engine/pahal.lead.IncompleteLeadQueue",
                "Page/Engine/pahal.lead.LeadFollowUpQueue",
                "Page/Engine/pahal.lead.LeadBulkUpload",
                "Page/Engine/pahal.lead.LeadAssignmentPendingQueue",
                "Page/Engine/pahal.lead.LeadRejectedQueue",
            ]
        };
        var loanDefinition = {
            "title": "Loan",
            "iconClass": "fa fa-users",
            "items": [
                "Page/Engine/pahal.lead.ReadyForScreeningQueue",
                "Page/Engine/pahal.loans.individual.screening.ScreeningQueue",
                "Page/Engine/pahal.loans.individual.screening.ScreeningReviewQueue",
                "Page/Engine/pahal.loans.individual.screening.GoNoGoApproval1Queue",
                "Page/Engine/pahal.loans.individual.screening.GoNoGoApproval2Queue",
                "Page/Engine/pahal.loans.individual.screening.ApplicationQueue",
                "Page/Engine/pahal.loans.individual.screening.ApplicationReviewQueue",
                "Page/Engine/pahal.loans.individual.screening.TeleVerificationQueue",
                "Page/Engine/pahal.loans.individual.screening.VehicleValuationQueue",
                "Page/Engine/pahal.loans.individual.screening.FieldInvestigation1Queue",
                "Page/Engine/pahal.loans.individual.screening.FieldInvestigation2Queue",
                "Page/Engine/pahal.loans.individual.screening.FieldInvestigation3Queue",
                "Page/Engine/pahal.loans.individual.screening.CreditAppraisalQueue",
                "Page/Engine/pahal.loans.individual.screening.DeviationApprovalQueue",
                "Page/Engine/pahal.loans.individual.screening.CreditApproval1Queue",
                "Page/Engine/pahal.loans.individual.screening.CreditApproval2Queue",
                "Page/Engine/pahal.loans.individual.screening.RejectedQueue"            
            ]
        };


        PagesDefinition.getUserAllowedDefinition(leadDefinition).then(function(resp) {
            $scope.leadDashboardDefinition = resp;
            var branchId = SessionStore.getBranchId();
            var branchName = SessionStore.getBranch();
            var centres = SessionStore.getCentres();

            var lapqMenu = $scope.leadDashboardDefinition.$menuMap["Page/Engine/pahal.lead.LeadAssignmentPendingQueue"];
            var lfuqMenu = $scope.leadDashboardDefinition.$menuMap["Page/Engine/pahal.lead.LeadFollowUpQueue"];
            var ilqMenu = $scope.leadDashboardDefinition.$menuMap["Page/Engine/pahal.lead.IncompleteLeadQueue"];

            var rMenu = $scope.leadDashboardDefinition.$menuMap["Page/Engine/pahal.lead.LeadRejectedQueue"];

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

            var rfqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/pahal.lead.ReadyForScreeningQueue"];
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

            var sqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/pahal.loans.individual.screening.ScreeningQueue"];

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

            var srqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/pahal.loans.individual.screening.ScreeningReviewQueue"];
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

            var gng1Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/pahal.loans.individual.screening.GoNoGoApproval1Queue"];
            if (gng1Menu) {
                IndividualLoan.search({
                    'stage': 'GoNoGoApproval1',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    gng1Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    gng1Menu.data = '-';
                });
            }

            var gng2Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/pahal.loans.individual.screening.GoNoGoApproval2Queue"];
            if (gng2Menu) {
                IndividualLoan.search({
                    'stage': 'GoNoGoApproval2',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    gng2Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    gng2Menu.data = '-';
                });
            }

            var appMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/pahal.loans.individual.screening.ApplicationQueue"];
            if (appMenu) {
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
                    appMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    appMenu.data = '-';
                });
            }

            var apprMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/pahal.loans.individual.screening.ApplicationReviewQueue"];
            if (apprMenu) {
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
                    apprMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    apprMenu.data = '-';
                });
            }

            var tvq1Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/pahal.loans.individual.screening.TeleVerificationQueue"];
            if (tvq1Menu) {
                IndividualLoan.search({
                    'stage': 'TeleVerification',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    tvq1Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    tvq1Menu.data = '-';
                });
            }


            var prqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/pahal.loans.individual.screening.VehicleValuationQueue"];
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

            var fiq1Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/pahal.loans.individual.screening.FieldInvestigation1Queue"];
            if (fiq1Menu) {
                IndividualLoan.search({
                    'stage': 'FieldInvestigation1',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    fiq1Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    fiq1Menu.data = '-';
                });
            }

            var fiq2Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/pahal.loans.individual.screening.FieldInvestigation2Queue"];
            if (fiq2Menu) {
                IndividualLoan.search({
                    'stage': 'FieldInvestigation2',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    fiq1Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    fiq1Menu.data = '-';
                });
            }

            var fiq3Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/pahal.loans.individual.screening.FieldInvestigation3Queue"];
            if (fiq3Menu) {
                IndividualLoan.search({
                    'stage': 'FieldInvestigation3',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    fiq1Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    fiq1Menu.data = '-';
                });
            }


            var caq1Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/pahal.loans.individual.screening.CreditAppraisalQueue"];
            if (caq1Menu) {
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
                    caq1Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    caq1Menu.data = '-';
                });
            }


            var daq1Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/pahal.loans.individual.screening.DeviationApprovalQueue"];
            if (daq1Menu) {
                IndividualLoan.search({
                    'stage': 'DeviationApproval',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    daq1Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    daq1Menu.data = '-';
                });
            }

            var caq1Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/pahal.loans.individual.screening.CreditApproval1Queue"];

            if (caq1Menu) {
                IndividualLoan.search({
                    'stage': 'CreditApproval1',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    caq1Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    caq1Menu.data = '-';
                });
            }

            var caq2Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/pahal.loans.individual.screening.CreditApproval2Queue"];

            if (caq2Menu) {
                IndividualLoan.search({
                    'stage': 'CreditApproval2',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    caq2Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    caq2Menu.data = '-';
                });
            }

            var rjqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/pahal.loans.individual.screening.RejectedQueue"];
            if (rjqMenu) {
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
                    rjqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    rjqMenu.data = '-';
                });
            }

        });
    }
]);
