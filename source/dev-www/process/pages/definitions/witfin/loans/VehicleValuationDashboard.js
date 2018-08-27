irf.pageCollection.controller(irf.controller("witfin.loans.VehicleValuationDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons", "Lead", "PageHelper",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Lead, PageHelper) {
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

            var prqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening..vehiclevaluation.VehicleValuationQueue"];
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
            var rjqMenu = $scope.loanDashboardDefinition.$menuMap["Page/Engine/witfin.loans.individual.screening.vehiclevaluation.ReassignVehicleValuationQueue"];
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
