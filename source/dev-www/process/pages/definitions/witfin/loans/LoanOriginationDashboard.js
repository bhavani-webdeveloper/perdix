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
                "Page/Engine/witfin.loans.individual.screening.GoNoGoApproval1Queue",
                "Page/Engine/witfin.loans.individual.screening.GoNoGoApproval2Queue",
                "Page/Engine/witfin.loans.individual.screening.VehicleValuationQueue",
                "Page/Engine/witfin.loans.individual.screening.FieldInvestigation1Queue",
                "Page/Engine/witfin.loans.individual.screening.FieldInvestigation2Queue",
                "Page/Engine/witfin.loans.individual.screening.FieldInvestigation3Queue",
                "Page/Engine/witfin.loans.individual.screening.TeleVerificationQueue",
                "Page/Engine/witfin.loans.individual.screening.CreditAppraisalQueue",
                "Page/Engine/witfin.loans.individual.screening.DeviationApproval1Queue",
                "Page/Engine/witfin.loans.individual.screening.DeviationApproval2Queue",
                "Page/Engine/witfin.loans.individual.screening.BusinessApproval1Queue",
                "Page/Engine/witfin.loans.individual.screening.BusinessApproval2Queue",
                "Page/Engine/witfin.loans.individual.screening.BusinessApproval3Queue",
                "Page/Engine/witfin.loans.individual.screening.BusinessApproval4Queue",
                "Page/Engine/witfin.loans.individual.screening.BusinessApproval5Queue",
                "Page/Engine/witfin.loans.individual.screening.CreditApproval1Queue",
                "Page/Engine/witfin.loans.individual.screening.CreditApproval2Queue",
                "Page/Engine/witfin.loans.individual.screening.CreditApproval3Queue",
                "Page/Engine/witfin.loans.individual.screening.CreditApproval4Queue",
                "Page/Engine/witfin.loans.individual.screening.CreditApproval5Queue",
                "Page/Engine/witfin.loans.individual.screening.RejectedQueue"            ]
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

            var gng1Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.GoNoGoApproval1Queue"];
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

            var gng2Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.GoNoGoApproval2Queue"];
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

            var fiq1Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.FieldInvestigation1Queue"];
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

            var fiq2Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.FieldInvestigation2Queue"];
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

            var fiq3Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.FieldInvestigation3Queue"];
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
            var tvq1Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.TeleVerificationQueue"];
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


            var caq1Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.CreditAppraisalQueue"];
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


            var daq1Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.DeviationApproval1Queue"];
            if (daq1Menu) {
                IndividualLoan.search({
                    'stage': 'DeviationApproval1',
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

            var daq2Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.DeviationApproval2Queue"];
            if (daq2Menu) {
                IndividualLoan.search({
                    'stage': 'DeviationApproval2',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    daq2Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    daq2Menu.data = '-';
                });
            }

            var baq1Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.BusinessApproval1Queue"];

            if (baq1Menu) {
                IndividualLoan.search({
                    'stage': 'BusinessApproval1',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    baq1Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    baq1Menu.data = '-';
                });
            }

            var baq2Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.BusinessApproval2Queue"];

            if (baq2Menu) {
                IndividualLoan.search({
                    'stage': 'BusinessApproval2',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    baq2Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    baq2Menu.data = '-';
                });
            }

            var baq3Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.BusinessApproval3Queue"];

            if (baq3Menu) {
                IndividualLoan.search({
                    'stage': 'BusinessApproval3',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    baq3Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    baq3Menu.data = '-';
                });
            }

            var baq4Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.BusinessApproval4Queue"];

            if (baq4Menu) {
                IndividualLoan.search({
                    'stage': 'BusinessApproval4',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    baq4Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    baq4Menu.data = '-';
                });
            }

            var baq5Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.BusinessApproval5Queue"];

            if (baq5Menu) {
                IndividualLoan.search({
                    'stage': 'BusinessApproval5',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    baq5Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    baq5Menu.data = '-';
                });
            }

            var caq1Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.CreditApproval1Queue"];

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

            var caq2Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.CreditApproval2Queue"];

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

            var caq3Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.CreditApproval3Queue"];

            if (caq3Menu) {
                IndividualLoan.search({
                    'stage': 'CreditApproval3',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    caq3Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    caq3Menu.data = '-';
                });
            }

            var caq4Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.CreditApproval4Queue"];

            if (caq4Menu) {
                IndividualLoan.search({
                    'stage': 'CreditApproval4',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    caq4Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    caq4Menu.data = '-';
                });
            }


            var caq5Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.CreditApproval5Queue"];

            if (caq5Menu) {
                IndividualLoan.search({
                    'stage': 'CreditApproval5',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                }).$promise.then(function(response, headerGetter) {
                    caq5Menu.data = Number(response.headers['x-total-count']);
                }, function() {
                    caq5Menu.data = '-';
                });
            }

            var rjqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.RejectedQueue"];
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
