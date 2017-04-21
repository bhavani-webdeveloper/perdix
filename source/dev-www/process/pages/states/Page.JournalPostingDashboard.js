irf.pages.controller("JournalPostingDashboardCtrl", 
    ['$log', '$scope', 'PagesDefinition', 'SessionStore', 'Lead','Journal',
    function($log, $scope, PagesDefinition, SessionStore, Lead,Journal) {
        $log.info("Page.JournalPostingDashboard.html loaded");

        var fullDefinition = {
            "title": "JOURNAL_ENTRY_POSTING_DASHBOARD",
            "iconClass": "fa fa-exchange",
            "items": [
                "Page/Engine/Journal.JournalPosting",
                "Page/Engine/Journal.JournalPostingQueue"
            ]
        };

        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;

            var jqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/Journal.JournalPostingQueue"];

            if (jqMenu) {
                var promise = Journal.journalEntrySearch({
                        'transactionName': '',
                        'transactionDescription':'',
                        'page': 1,
                        'per_page': 1,
                        'transactionType':"Entry",
                        'currentStage': "journalEntry"
                    }).$promise.then(function(response, headerGetter) {
                    jqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    jqMenu.data = '-';
                });
            }
        });
    }
]);