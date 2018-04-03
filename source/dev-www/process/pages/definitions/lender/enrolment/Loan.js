irf.pageCollection.controller(irf.controller("lender.enrolment.Loan"), 
    ['$log', '$scope', 'PageHelper', '$stateParams',
    'irfStorageService', 'SessionStore', 'PagesDefinition', 'GroupProcess', 'Product',
    function($log, $scope, PageHelper, $stateParams,
        irfStorageService, SessionStore, PagesDefinition, GroupProcess, Product) {
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        PageHelper.clearErrors();
        var fullDefinition = {
            "title": "LOAN_DASHBOARD",
            "items": [
                "Page/Engine/lender.enrolment.ViewLoan",
            ]
        };
        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = (resp);
        });
    }
]);