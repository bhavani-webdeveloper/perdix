irf.pageCollection.controller(irf.controller("shramsarathi.dashboard.loans.LoanOriginationDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons", "Lead", "Messaging",
function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Lead, Messaging) {
    $log.info("Dashboard.Page.LoanOriginationDashboard.html loaded");
    //$scope.$templateUrl = "process/pages/templates/Page.LoanOriginationDashboard.html";
    $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
    var currentBranch = SessionStore.getCurrentBranch();

        var fullDefinition={
        "title": "Loan Origination Dashboard",
        "iconClass": "fa fa-users",
        "items": [
            "Page/Bundle/shramsarathi.dashboard.loans.individual.screening.ScreeningInput",
            "Page/Engine/shramsarathi.dashboard.loans.individual.screening.ScreeningQueue",
            "Page/Engine/shramsarathi.dashboard.loans.individual.screening.ScreeningReviewQueue",
            "Page/Engine/shramsarathi.dashboard.loans.individual.screening.ApplicationQueue",  
            "Page/Engine/shramsarathi.dashboard.loans.individual.screening.ApplicationReviewQueue", 
            "Page/Engine/shramsarathi.dashboard.loans.individual.screening.TeleverificationQueue",
            "Page/Engine/shramsarathi.dashboard.loans.individual.screening.CreditCommitteeReviewQueue",
            "Page/Engine/shramsarathi.dashboard.loans.individual.screening.LoanSanctionQueue",
            "Page/Engine/shramsarathi.dashboard.loans.individual.screening.RejectedQueue"
           ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {

        $scope.dashboardDefinition = resp;
        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();
        var centres = SessionStore.getCentres();

        var sqMenu=$scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.screening.ScreeningQueue"];
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

       var srqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.screening.ScreeningReviewQueue"];
        
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


var aqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.screening.ApplicationQueue"];

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

        var arqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.screening.ApplicationReviewQueue"];
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

        var tvq1Menu = $scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.screening.TeleverificationQueue"];
        if (tvq1Menu) {
            IndividualLoan.search({
                'stage': 'Televerification',
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


        // var caq1Menu = $scope.dashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.CreditAppraisalQueue"];
        // if (caq1Menu) {
        //     IndividualLoan.search({
        //         'stage': 'CreditAppraisal',
        //         'enterprisePincode': '',
        //         'applicantName': '',
        //         'area': '',
        //         'villageName': '',
        //         'customerName': '',
        //         'page': 1,
        //         'per_page': 1,
        //     }).$promise.then(function(response, headerGetter) {
        //         caq1Menu.data = Number(response.headers['x-total-count']);
        //     }, function() {
        //         caq1Menu.data = '-';
        //     });
        // }


       
        var lsqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.screening.LoanSanctionQueue"];

        if (lsqMenu) {
            IndividualLoan.search({
                'stage': 'Sanction',
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

        var ccrMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.screening.CreditCommitteeReviewQueue"];

        if (ccrMenu) {
            IndividualLoan.search({
                'stage': 'CreditCommitteeReview',
                'enterprisePincode': '',
                'applicantName': '',
                'area': '',
                'villageName': '',
                'customerName': '',
                'page': 1,
                'per_page': 1,
            }).$promise.then(function(response, headerGetter) {
                ccrMenu.data = Number(response.headers['x-total-count']);
            }, function() {
                ccrMenu.data = '-';
            });
        }


        // var caq5Menu = $scope.dashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.CreditApproval5Queue"];

        // if (caq5Menu) {
        //     IndividualLoan.search({
        //         'stage': 'CreditApproval5',
        //         'enterprisePincode': '',
        //         'applicantName': '',
        //         'area': '',
        //         'villageName': '',
        //         'customerName': '',
        //         'page': 1,
        //         'per_page': 1,
        //     }).$promise.then(function(response, headerGetter) {
        //         caq5Menu.data = Number(response.headers['x-total-count']);
        //     }, function() {
        //         caq5Menu.data = '-';
        //     });
        // }

        var rjqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.screening.RejectedQueue"];
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
