irf.pageCollection.controller(irf.controller("insurance.InsuranceRegistrationDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons", "Messaging",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Messaging) {
        $log.info("InsuranceRegistrationDashboard loaded");
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        var currentBranch = SessionStore.getCurrentBranch();

        var fullDefinition = {
            "title": "Insurance Registration Dashboard",
            "iconClass": "fa fa-money",
            "items": [
                "Page/Engine/insurance.Registration",
                "Page/Engine/insurance.RegistrationTLI",
                "Page/Engine/insurance.InsuranceRegistrationQueue"
            ]
        };

        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;
            var branchId = SessionStore.getBranchId();
            var branchName = SessionStore.getBranch();
            var centres = SessionStore.getCentres();
        });
    }
]);