irf.pages.controller("FinconAccountingDashboardCtrl", ['$log', '$scope', 'PagesDefinition', 'SessionStore', 'Lead', 'Journal',
    function($log, $scope, PagesDefinition, SessionStore, Lead, Journal) {
        $log.info("Page.JournalMultiPostingDashboardCtrl.html loaded");

        var fullDefinition = {
            //"title": "JOURNAL_MULTI_ENTRY_POSTING_DASHBOARD",
            "iconClass": "fa fa-exchange",
            "title": "FINCON_ACCOUTING_DASHBOARD",
            "items": [
                "Page/Adhoc/Journal.FinconAccounting",
                "Page/Engine/Journal.FinconAccountingQueue",
                "Page/Engine/Journal.FinconAccountingReviewQueue",
                "Page/Engine/Journal.RejectedFinconAccountingQueue",
                "Page/Engine/Journal.CompletedFinconAccountingQueue"
            ]
        };

        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;

            var jqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/Journal.FinconAccountingQueue"];

            if (jqMenu) {
                var promise = Journal.journalMultiEntrySearch({
                    'page': 1,
                    'per_page': 1,
                    'currentStage': "multiJournalEntry"
                }).$promise.then(function(response, headerGetter) {
                    jqMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    jqMenu.data = '-';
                });
            }

            var jeMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/Journal.FinconAccountingReviewQueue"];

            if (jeMenu) {
                var promise = Journal.journalMultiEntrySearch({

                    'page': 1,
                    'per_page': 1,
                    'currentStage': "multiJournalPosting"
                }).$promise.then(function(response, headerGetter) {
                    jeMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    jeMenu.data = '-';
                });
            }

            //  var jeMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/Journal.RejectedFinconAccountingQueue"];

            // if (jeMenu) {
            //     var promise = Journal.journalMultiEntrySearch({

            //         'page': 1,
            //         'per_page': 1,
            //         'currentStage': "multiJournalPosting"
            //     }).$promise.then(function(response, headerGetter) {
            //         jeMenu.data = Number(response.headers['x-total-count']);
            //     }, function() {
            //         jeMenu.data = '-';
            //     });
            // }

            //  var jeMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/Journal.CompletedFinconAccountingQueue"];

            // if (jeMenu) {
            //     var promise = Journal.journalMultiEntrySearch({

            //         'page': 1,
            //         'per_page': 1,
            //         'currentStage': "multiJournalPosting"
            //     }).$promise.then(function(response, headerGetter) {
            //         jeMenu.data = Number(response.headers['x-total-count']);
            //     }, function() {
            //         jeMenu.data = '-';
            //     });
            // }
        });
    }
]);