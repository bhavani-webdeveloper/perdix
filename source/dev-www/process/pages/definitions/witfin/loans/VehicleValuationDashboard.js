irf.pageCollection.controller(irf.controller("witfin.loans.VehicleValuationDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons", "Lead", "PageHelper","Queries",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Lead, PageHelper,Queries) {
        $scope.$templateUrl = "process/pages/templates/Page.VehicleValuationDashboard.html";
        var currentBranch = SessionStore.getCurrentBranch();
        PageHelper.clearErrors();
        var fullDefinition = {
            "title": "VehicleValuation",
            "iconClass": "fa fa-users",
            "items": [               
                "Page/Engine/witfin.loans.individual.screening.vehiclevaluation.VehicleValuationQueue",                
                "Page/Engine/witfin.loans.individual.screening.vehiclevaluation.ReassignVehicleValuationQueue"            
            ]
        };
        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {

            $scope.loanDashboardDefinition = resp;
            var branchId = SessionStore.getBranchId();
            var branchName = SessionStore.getBranch();
            var centres = SessionStore.getCentres();

            var prqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.vehiclevaluation.VehicleValuationQueue"];
            if (prqMenu) {
                IndividualLoan.search({
                    'stage': ['FieldInvestigation1','FieldInvestigation2','FieldInvestigation3','TeleVerification'],
                    'enterprisePincode': '',
                    'applicantName': '',
                    'area': '',
                    'villageName': '',
                    'customerName': '',
                    'page': 1,
                    'per_page': 1,
                    'valuator': SessionStore.session.login
                }).$promise.then(function(response, headerGetter) {
                    prqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    prqMenu.data = '-';
                });
            }
            var rjqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.vehiclevaluation.ReassignVehicleValuationQueue"];
            if (rjqMenu) {

                Queries.searchReAssignment(branchName).then(function(response, headerGetter) {
                    debugger;
                    rjqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    rjqMenu.data = '-';
                });
            }

        });
    }
]);
