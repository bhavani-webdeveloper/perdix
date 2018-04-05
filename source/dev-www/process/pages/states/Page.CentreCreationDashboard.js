irf.pages.controller("CentreCreationDashboardCtrl", ['$log', '$scope', 'PagesDefinition', 'SessionStore', 'Lead',
    function($log, $scope, PagesDefinition, SessionStore, Lead) {
        $log.info("Page.CentreCreationDashboard.html loaded");

        var fullDefinition = {
            "title": "Reference Code Dashboard",
            "iconClass": "fa fa-book",
            "items": [
                "Page/Engine/management.CentreCreation",
                "Page/Engine/management.CentreCreationSearch"
            ]
        };
        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;
             
        });     
    }
]);