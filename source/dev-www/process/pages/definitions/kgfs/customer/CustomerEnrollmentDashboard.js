irf.pageCollection.controller(irf.controller("kgfs.customer.CustomerEnrollmentDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons", "Lead",
    function ($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Lead) {
        // $log.info("Page.LoanOriginationDashboard.html loaded");
        //$scope.$templateUrl = "process/pages/templates/Page.LoanOriginationDashboard.html";
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        var currentBranch = SessionStore.getCurrentBranch();


        var loanDefinition = {
            "title": "FINGER_PRINT_AND_GPS_UPDATE",
            "iconClass": "fa fa-users",
            "items": [
                "Page/Engine/kgfs.customer.CuustomerSearchQueue",
                "Page/Engine/kgfs.customer.Enrollment.js",

            ]
        };

        PagesDefinition.getUserAllowedDefinition(loanDefinition).then(function (resp) {
            console.log(resp);
            $scope.dashboardDefinition = _.cloneDeep(resp);

        });
    }
]);
