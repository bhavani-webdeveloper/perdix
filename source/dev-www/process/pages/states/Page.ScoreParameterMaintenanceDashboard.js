irf.pages.controller("ScoreParameterMaintenanceDashboardCtrl", ['$log', '$scope', 'PagesDefinition', 'SessionStore', 'Lead',
    function($log, $scope, PagesDefinition, SessionStore, Lead) {
        $log.info("Page.ScoreParameterMaintenanceDashboard.html loaded");

        var fullDefinition = {
            "title": "Score Parameter Maintenance Dashboard",
            "iconClass": "fa fa-book",
            "items": [
                "Page/Engine/management.ScoreCreation",
                "Page/Engine/management.ScoreCreationSearch"
            ]
        };
        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;
             
        });     
    }
]);