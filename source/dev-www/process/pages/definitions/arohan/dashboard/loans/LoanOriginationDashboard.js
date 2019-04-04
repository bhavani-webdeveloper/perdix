irf.pageCollection.controller(irf.controller("arohan.dashboard.loans.LoanOriginationDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons", "Lead", "Messaging",
function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Lead, Messaging) {
    $log.info("Dashboard.Page.LoanOriginationDashboard.html loaded");
    //$scope.$templateUrl = "process/pages/templates/Page.LoanOriginationDashboard.html";
    $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
    var currentBranch = SessionStore.getCurrentBranch();

        var fullDefinition={
        "title": "Loan Origination Dashboard",
        "iconClass": "fa fa-users",
        "items": [
            "Page/Bundle/arohan.dashboard.loans.individual.screening.ScreeningInput",
           // "Page/Engine/arohan.dashboard.lead.ReadyForScreeningQueue",
            "Page/Engine/arohan.dashboard.loans.individual.screening.ScreeningQueue",
            "Page/Engine/arohan.dashboard.loans.individual.screening.ScreeningReviewQueue",
            "Page/Engine/arohan.dashboard.loans.individual.screening.ApplicationQueue",  
            "Page/Engine/arohan.dashboard.loans.individual.screening.CmRecommendationReviewQueue",
            "Page/Engine/arohan.dashboard.loans.individual.screening.AcmRecommendationReviewQueue",
            "Page/Engine/arohan.dashboard.loans.individual.screening.AcmApprovalReviewQueue",
            "Page/Engine/arohan.dashboard.loans.individual.screening.NcmApprovalReviewQueue",
            "Page/Engine/arohan.dashboard.loans.individual.screening.BhApprovalReviewQueue",
            "Page/Engine/arohan.dashboard.loans.individual.screening.HorApprovalReviewQueue",
            //"page/Engine/arohan.dashboard.loans.individual.screening.AcmApprovalReviewQueue",
            //"Page/Engine/arohan.dashboard.loans.individual.screening.ScrutinyQueue",  
            //"Page/Engine/arohan.dashboard.loans.individual.screening.FieldAppraisalQueue",
            //"Page/Engine/arohan.dashboard.loans.individual.screening.RcuQueue",  
            //"Page/Engine/arohan.dashboard.loans.individual.screening.FieldAppraisalReviewQueue",
            //"Page/Engine/arohan.dashboard.loans.individual.screening.ZonalRiskReviewQueue",
            //"Page/Engine/arohan.dashboard.loans.individual.screening.CentralRiskReviewQueue",
            // "Page/Engine/arohan.dashboard.loans.individual.screening.FieldAppraisalReview",
            "Page/Engine/arohan.dashboard.loans.individual.screening.CreditCommitteeReviewQueue",
            "Page/Engine/arohan.dashboard.loans.individual.screening.PricingQueue",
            "Page/Engine/arohan.dashboard.loans.individual.screening.PricingApprovalQueue",
            "Pages/Engine/arohan.dashboard.loans.individual.screening.DocumentUploadQueue",
            //"Page/Engine/arohan.dashboard.loans.individual.screening.LoanSanctionQueue",
            "Page/Engine/arohan.dashboard.loans.individual.screening.RejectedQueue",
            //"Page/Engine/arohan.dashboard.loans.individual.screening.BranchNewConversationQueue",
            //"Page/Engine/arohan.dashboard.loans.individual.screening.BranchRepliedConversationQueue",
            //"Page/Engine/arohan.dashboard.loans.individual.screening.SpokeNewConversationQueue", // sql done
            //"Page/Engine/arohan.dashboard.loans.individual.screening.SpokeRepliedConversationQueue",
           ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {

        $scope.dashboardDefinition = resp;
        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();
        var centres = SessionStore.getCentres();

        var crrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.CentralRiskReviewQueue"];
        if (crrqMenu) {
            IndividualLoan.search({
                'stage':'CentralRiskReview',
                'enterprisePincode': '',
                'applicantName': '',
                'area': '',
                'villageName': '',
                'customerName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response, headerGetter) {
                crrqMenu.data = Number(response.headers['x-total-count']);
            }, function() {
                crrqMenu.data = '-';
            });
        }
        var zrrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.ZonalRiskReviewQueue"];
        if (zrrqMenu) {
            IndividualLoan.search({
                'stage': 'ZonalRiskReview',
                'enterprisePincode': '',
                'applicantName': '',
                'area': '',
                'villageName': '',
                'customerName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response, headerGetter) {
                zrrqMenu.data = Number(response.headers['x-total-count']);
            }, function() {
                zrrqMenu.data = '-';
            });
        }
        var acmMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.AcmApprovalReviewQueue"];
        if (acmMenu) {
            IndividualLoan.search({
                'stage': 'AcmApprovalReviewQueue',
                'enterprisePincode': '',
                'applicantName': '',
                'area': '',
                'villageName': '',
                'customerName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response, headerGetter) {
                acmMenu.data = Number(response.headers['x-total-count']);
            }, function() {
                acmMenu.data = '-';
            });
        }
        var ncmMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.NcmApprovalReviewQueue"];
        if (ncmMenu) {
            IndividualLoan.search({
                'stage': 'NcmApprovalReviewQueue',
                'enterprisePincode': '',
                'applicantName': '',
                'area': '',
                'villageName': '',
                'customerName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response, headerGetter) {
                ncmMenu.data = Number(response.headers['x-total-count']);
            }, function() {
                ncmMenu.data = '-';
            });
        }
        var bhMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.BhApprovalReviewQueue"];
        if (bhMenu) {
            IndividualLoan.search({
                'stage': 'BhApprovalReviewQueue',
                'enterprisePincode': '',
                'applicantName': '',
                'area': '',
                'villageName': '',
                'customerName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response, headerGetter) {
                bhMenu.data = Number(response.headers['x-total-count']);
            }, function() {
                bhMenu.data = '-';
            });
        }
        var horMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.HorApprovalReviewQueue"];
        if (horMenu) {
            IndividualLoan.search({
                'stage': 'HorApprovalReviewQueue',
                'enterprisePincode': '',
                'applicantName': '',
                'area': '',
                'villageName': '',
                'customerName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response, headerGetter) {
                horMenu.data = Number(response.headers['x-total-count']);
            }, function() {
                horMenu.data = '-';
            });
        }
        var ccrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.CreditCommitteeReviewQueue"];
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

        var prqv = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.PriceQueue"];
        if (prqv) {
            IndividualLoan.search({
                'stage': 'Pricing',
                'enterprisePincode': '',
                'applicantName': '',
                'area': '',
                'villageName': '',
                'customerName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response, headerGetter) {
                prqv.data = Number(response.headers['x-total-count']);
            }, function() {
                prqv.data = '-';
            });
        }

        var ccrqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.PriceApprovalQueue"];
        if (ccrqMenu) {
            IndividualLoan.search({
                'stage': 'PricingApproval',
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


        var  duq= $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.CreditCommitteeReviewQueue"];
        if (duq) {
            IndividualLoan.search({
                'stage': 'DocumentUploadQueue',
                'enterprisePincode': '',
                'applicantName': '',
                'area': '',
                'villageName': '',
                'customerName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response, headerGetter) {
                duq.data = Number(response.headers['x-total-count']);
            }, function() {
                duq.data = '-';
            });
        }


        var lsqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.LoanSanctionQueue"];
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
       var rfqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.lead.ReadyForScreeningQueue"];
        
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

        var sqMenu=$scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.ScreeningQueue"];
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

       var srqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.ScreeningReviewQueue"];
        
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


var aqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.ApplicationQueue"];

if (aqMenu) {
    aqMenu.data = 0;
    $log.info("centres");
    $log.info(centres);
    if(centres.length){
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
                'centreCode': centre.centreCode
            }).$promise.then(function(response, headerGetter) {
                aqMenu.data = aqMenu.data + Number(response.headers['x-total-count']);
            }, function() {
                aqMenu.data = '-';
            });
        });

    }else{
        IndividualLoan.search({
            'stage': 'Application',
            'enterprisePincode': '',
            'applicantName': '',
            'area': '',
            'villageName': '',
            'customerName': '',
            'page': 1,
            'per_page': 1
        }).$promise.then(function(response, headerGetter) {
            aqMenu.data = Number(response.headers['x-total-count']);
        }, function() {
            aqMenu.data = '-';
        });
    }
    
}

var faqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.FieldAppraisalQueue"];
if (faqMenu) {
    IndividualLoan.search({
        'stage': 'FieldAppraisal',
        'enterprisePincode': '',
        'applicantName': '',
        'area': '',
        'villageName': '',
        'customerName': '',
        'page': 1,
        'per_page': 1
    }).$promise.then(function(response, headerGetter) {
        faqMenu.data = Number(response.headers['x-total-count']);
    }, function() {
        faqMenu.data = '-';
    });
}

//
// var farMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.FieldAppraisalReview"];
// if (farMenu) {
//     IndividualLoan.search({
//         'stage': 'FieldAppraisalReview',
//         'enterprisePincode': '',
//         'applicantName': '',
//         'area': '',
//         'villageName': '',
//         'customerName': '',
//         'page': 1,
//         'per_page': 1
//     }).$promise.then(function(response, headerGetter) {
//         faqMenu.data = Number(response.headers['x-total-count']);
//     }, function() {
//         faqMenu.data = '-';
//     });
// }

var farqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.FieldAppraisalReviewQueue"];
            if (farqMenu) {
                IndividualLoan.search({
                    'stage': 'FieldAppraisalReview',
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1
                }).$promise.then(function(response, headerGetter) {
                    farqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    farqMenu.data = '-';
                });
            }
//
        var arqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.CmRecommendationReviewQueue"];
        if (arqMenu) {
            IndividualLoan.search({
                'stage': 'CmRecommendationReviewQueue',
                'enterprisePincode': '',
                'applicantName': '',
                'area': '',
                'villageName': '',
                'customerName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response, headerGetter) {
                arqMenu.data = Number(response.headers['x-total-count']);
            }, function() {
                arqMenu.data = '-';
            });
        }

        var acmrMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.AcmRecommendationReviewQueue"];
        if (acmrMenu) {
            IndividualLoan.search({
                'stage': 'AcmRecommendationReviewQueue',
                'enterprisePincode': '',
                'applicantName': '',
                'area': '',
                'villageName': '',
                'customerName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response, headerGetter) {
                acmrMenu.data = Number(response.headers['x-total-count']);
            }, function() {
                acmrMenu.data = '-';
            });
        }

        var scqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.ScrutinyQueue"];
        if (scqMenu) {
            IndividualLoan.search({
                'stage': 'Scrutiny',
                'enterprisePincode': '',
                'applicantName': '',
                'area': '',
                'villageName': '',
                'customerName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response, headerGetter) {
                scqMenu.data = Number(response.headers['x-total-count']);
            }, function() {
                scqMenu.data = '-';
            });
        }

        var rcuMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.RcuQueue"];
        if (rcuMenu) {
            IndividualLoan.search({
                'stage': 'RCU',
                'enterprisePincode': '',
                'applicantName': '',
                'area': '',
                'villageName': '',
                'customerName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response, headerGetter) {
                rcuMenu.data = Number(response.headers['x-total-count']);
            }, function() {
                rcuMenu.data = '-';
            });
        }

        var gng1Menu = $scope.dashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.GoNoGoApproval1Queue"];
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

        var gng2Menu = $scope.dashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.GoNoGoApproval2Queue"];
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

        var tvq1Menu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.TeleVerificationQueue"];
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


        var caq1Menu = $scope.dashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.CreditAppraisalQueue"];
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


        var daq1Menu = $scope.dashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.DeviationApproval1Queue"];
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

        var daq2Menu = $scope.dashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.DeviationApproval2Queue"];
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

       
        var caq3Menu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.CreditApproval3Queue"];

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

        var caq4Menu = $scope.dashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.CreditApproval4Queue"];

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


        var caq5Menu = $scope.dashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.CreditApproval5Queue"];

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

        var rjqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.RejectedQueue"];
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

       var bncqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.BranchNewConversationQueue"];
       
        if (bncqMenu) {
            Messaging.findConversation({
                'replied': 'false',
                'page': 1,
                'per_page': 1
            }).$promise.then(function (response, headerGetter) {
                bncqMenu.data = Number(response.headers['x-total-count']);
            }, function () {
                bncqMenu.data = '-';
            });
        }

       var brcqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.BranchRepliedConversationQueue"];
       
        if (brcqMenu) {
            Messaging.findConversation({
                'replied': 'true',
                'page': 1,
                'per_page': 1
            }).$promise.then(function (response, headerGetter) {
                brcqMenu.data = Number(response.headers['x-total-count']);
            }, function () {
                brcqMenu.data = '-';
            });
        }

       var sncqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.SpokeNewConversationQueue"];
       
        if (sncqMenu) {
            var centreCode = [];
            _.forEach(centres, function (centre) {
                centreCode.push(centre.centreCode);
            });
            centreCode = _.join(centreCode, ',');
            $log.info(centreCode);
            Messaging.findConversation({
                'replied': 'false',
                'page': 1,
                'per_page': 1,
                'centreCode': centreCode
            }).$promise.then(function (response, headerGetter) {
                sncqMenu.data = Number(response.headers['x-total-count']);
            }, function () {
                sncqMenu.data = '-';
            });
        }

        var srcqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/arohan.dashboard.loans.individual.screening.SpokeRepliedConversationQueue"];
        if (srcqMenu) {
            var centreCode = [];
            _.forEach(centres, function (centre) {
                centreCode.push(centre.centreCode);
            });
            centreCode = _.join(centreCode, ',');
            Messaging.findConversation({
                'replied': 'true',
                'page': 1,
                'per_page': 1,
                'centreCode': centreCode
            }).$promise.then(function (response, headerGetter) {
                srcqMenu.data = Number(response.headers['x-total-count']);
            }, function () {
                srcqMenu.data = '-';
            });
        }

    });
}
]);
