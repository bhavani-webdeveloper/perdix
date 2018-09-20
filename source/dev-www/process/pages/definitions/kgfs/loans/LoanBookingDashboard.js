irf.pageCollection.controller(irf.controller("kgfs.loans.LoanBookingDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons", "Lead",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Lead) {
        $log.info("Page.LoanOriginationDashboard.html loaded");
       //$scope.$templateUrl = "process/pages/templates/Page.LoanOriginationDashboard.html";
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        var currentBranch = SessionStore.getCurrentBranch();

      
        var loanDefinition = {
            "title": "Loan",
            "iconClass": "fa fa-users",
            "items": [
                "Page/Bundle/kgfs.loans.individual.booking.LoanInput",
            ]
        };


       
        PagesDefinition.getUserAllowedDefinition(loanDefinition).then(function(resp) {
            $scope.dashboardDefinition = _.cloneDeep(resp);
           
        });
    }
]);
