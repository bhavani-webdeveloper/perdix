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
                "Page/Engine/kgfs.loans.individual.booking.InitiationQueue",
                "Page/Engine/kgfs.loans.individual.booking.Checker1",
                "Page/Engine/kgfs.loans.individual.booking.Checker2",
               "Page/Engine/kgfs.loans.individual.booking.Checker2Queue",
               "Page/Engine/kgfs.loans.individual.booking.Checker1Queue"


            ]
        };


       
        PagesDefinition.getUserAllowedDefinition(loanDefinition).then(function(resp) {
            console.log(resp);
            $scope.dashboardDefinition = _.cloneDeep(resp);
           
        });
    }
]);
