irf.pages.controller("JournalMaintenanceDashboardCtrl", 
    ['$log', '$scope', 'PagesDefinition', 'SessionStore', 'Lead','Journal',
    function($log, $scope, PagesDefinition, SessionStore, Lead,Journal) {
        $log.info("Page.JournalMaintenanceDashboard.html loaded");

        var fullDefinition = {
            "title": "JOURNAL_ENTRY_MAINTENANCE_DASHBOARD",
            "iconClass": "fa fa-exchange",
            "items": [
                "Page/Engine/Journal.JournalMaintenance",
                "Page/Engine/Journal.JournalQueue"
            ]
        };

        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;

            var jqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/Journal.JournalQueue"];

            if (jqMenu) {
                var promise = Journal.journalSearch({
                        'transactionName': '',
                        'transactionDescription':'',
                        'debitGLNo': '',
                        'creditGLNo': '',
                        'page': 1,
                        'per_page': 1,
                        'isApplicable': '',
                    }).$promise.then(function(response, headerGetter) {
                    jqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    jqMenu.data = '-';
                });
            }
        });
    }
]);