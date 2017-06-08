irf.pages.controller("ReferenceCodeDashboardCtrl", ['$log', '$scope', 'PagesDefinition', 'SessionStore', 'Lead',
    function($log, $scope, PagesDefinition, SessionStore, Lead) {
        $log.info("Page.ReferenceCodeDashboard.html loaded");

        var fullDefinition = {
            "title": "Reference Code Dashboard",
            "iconClass": "fa fa-book",
            "items": [
                "Page/Engine/management.ReferenceCode",
                "Page/Engine/management.ReferenceCodeSearch",
            ]
        };


         PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;
             
        });

        
    }
]);