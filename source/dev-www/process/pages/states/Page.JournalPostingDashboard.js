irf.pages.controller("JournalPostingDashboardCtrl", 
    ['$log', '$scope', 'PagesDefinition', 'SessionStore', 'Lead','Journal',
    function($log, $scope, PagesDefinition, SessionStore, Lead,Journal) {
        $log.info("Page.JournalPostingDashboard.html loaded");

        var fullDefinition = {
            "title": "JOURNAL_ENTRY_POSTING_DASHBOARD",
            "iconClass": "fa fa-exchange",
            "items": [
                "Page/Engine/Journal.JournalPosting",
                "Page/Engine/Journal.JournalEntryQueue",
                "Page/Engine/Journal.JournalPostingQueue",
                "Page/Engine/Journal.JournalEntryUpload"
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
                        'currentStage': "journalPosting"
                    }).$promise.then(function(response, headerGetter) {
                    jqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    jqMenu.data = '-';
                });
            }

            var jeMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/Journal.JournalEntryQueue"];

            if (jeMenu) {
                var promise = Journal.journalEntrySearch({
                        'transactionName': '',
                        'transactionDescription':'',
                        'page': 1,
                        'per_page': 1,
                        'transactionType':"Entry",
                        'currentStage': "journalEntry"
                    }).$promise.then(function(response, headerGetter) {
                    jeMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    jeMenu.data = '-';
                });
            }
        });
    }
]);