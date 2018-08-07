irf.pageCollection.controller(irf.controller("MutualFund.MutualFundDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons", "Messaging",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Messaging) {
        $log.info("MutualFundDashboard loaded");
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        var currentBranch = SessionStore.getCurrentBranch();

        var fullDefinition = {
            "title": "Mutual Fund Dashboard",
            "iconClass": "fa fa-money",
            "items": [
                "Page/Engine/MutualFund.MutualFundCustomerSearch",
                "Page/Engine/MutualFund.MutualFundDownloadFeed",
                "Page/Engine/MutualFund.MutualFundUploadFeed"
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