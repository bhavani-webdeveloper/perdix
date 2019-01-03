irf.pageCollection.controller(irf.controller("base.dashboard.loans.LoanOriginationDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons", "Lead", "Messaging",
function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Lead, Messaging) {
    $log.info("Dashboard.Page.LoanOriginationDashboard.html loaded");
    $scope.$templateUrl = "process/pages/templates/Page.LoanOriginationDashboard.html";
    var currentBranch = SessionStore.getCurrentBranch();

    
    var loanDefinition = {
        "title": "Loan",
        "iconClass": "fa fa-users",
        "items": [
            "Page/Engine/base.dashboard.lead.ReadyForScreeningQueue",
            "Page/Engine/base.dashboard.loans.individual.screening.ScreeningQueue",
            "Page/Engine/base.dashboard.loans.individual.screening.ScreeningReviewQueue",
            "Page/Engine/base.dashboard.loans.individual.screening.ApplicationQueue",  
            "Page/Engine/base.dashboard.loans.individual.screening.ApplicationReviewQueue", 
            "Page/Engine/base.dashboard.loans.individual.screening.FieldAppraisalQueue",
            "Page/Engine/base.dashboard.loans.individual.screening.LoanSanctionQueue",
            "Page/Engine/base.dashboard.loans.individual.screening.RejectedQueue",
            "Page/Engine/base.dashboard.loans.individual.screening.BranchNewConversationQueue",
            "Page/Engine/base.dashboard.loans.individual.screening.BranchRepliedConversationQueue",
            "Page/Engine/base.dashboard.loans.individual.screening.SpokeNewConversationQueue", // sql done
            "Page/Engine/base.dashboard.loans.individual.screening.SpokeRepliedConversationQueue",
           ]
    };

    PagesDefinition.getUserAllowedDefinition(loanDefinition).then(function(resp) {

        $scope.loanDashboardDefinition = resp;
        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();
        var centres = SessionStore.getCentres();

       var rfqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/base.dashboard.lead.ReadyForScreeningQueue"];
        
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

        var sqMenu=$scope.loanDashboardDefinition.$menuMap["Page/Engine/base.dashboard.loans.individual.screening.ScreeningQueue"];
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

       var srqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/base.dashboard.loans.individual.screening.ScreeningReviewQueue"];
        
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


var aqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/base.dashboard.loans.individual.screening.ApplicationQueue"];

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

var faqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/base.dashboard.loans.individual.screening.FieldAppraisalQueue"];
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
        var arqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/base.dashboard.loans.individual.screening.ApplicationReviewQueue"];
        if (arqMenu) {
            IndividualLoan.search({
                'stage': 'ApplicationReview',
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

        var tvq1Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/base.dashboard.loans.individual.screening.TeleVerificationQueue"];
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

       
        var caq3Menu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/base.dashboard.loans.individual.screening.CreditApproval3Queue"];

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

        var rjqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/base.dashboard.loans.individual.screening.RejectedQueue"];
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

       var bncqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/base.dashboard.loans.individual.screening.BranchNewConversationQueue"];
       
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

       var brcqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/base.dashboard.loans.individual.screening.BranchRepliedConversationQueue"];
       
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

       var sncqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/base.dashboard.loans.individual.screening.SpokeNewConversationQueue"];
       
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

        var srcqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/base.dashboard.loans.individual.screening.SpokeRepliedConversationQueue"];
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
