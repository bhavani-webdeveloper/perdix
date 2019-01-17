irf.pages.controller("JournalPostingDashboardCtrl",
    ['$log', '$scope', 'PagesDefinition', 'SessionStore', 'Lead','Journal',
    function($log, $scope, PagesDefinition, SessionStore, Lead,Journal) {
        $log.info("Page.JournalPostingDashboard.html loaded");

        var fullDefinition = {
            "title": "BRANCH_POSTING_ENTRY_DASHBOARD",
            "iconClass": "fa fa-exchange",
            "items": [
                "Page/Engine/Journal.JournalPosting",
                "Page/Engine/Journal.JournalPostingSearch",
                "Page/Engine/Journal.JournalEntryReviewQueue",
                "Page/Engine/Journal.JournalEntryPostingSearch",
                "Page/Engine/Journal.JournalRejected",
                // "Page/Engine/Journal.JournalPostingQueue",
                "Page/Engine/Journal.JournalEntryUpload"
            ]
        };

        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;

            // var jqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/Journal.JournalPostingQueue"];

            // if (jqMenu) {
            //     var promise = Journal.journalEntrySearch({
            //             'transactionName': '',
            //             'transactionDescription':'',
            //             'page': 1,
            //             'per_page': 1,
            //             'transactionType':"Entry",
            //             'currentStage': "journalPosting"
            //         }).$promise.then(function(response, headerGetter) {
            //         jqMenu.data = Number(response.headers['x-total-count']);
            //     }, function() {
            //         jqMenu.data = '-';
            //     });
            // }

            var jeMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/Journal.JournalEntryReviewQueue"];

            if (jeMenu) {
                var promise = Journal.journalEntrySearch({
                        'transactionName': '',
                        'transactionDescription':'',
                        'page': 1,
                        'per_page': 1,
                        'transactionType':"Entry",
                        'currentStage': "branchPostingReview"
                    }).$promise.then(function(response, headerGetter) {
                    jeMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    jeMenu.data = '-';
                });
            }

            var beMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/Journal.JournalEntryPostingSearch"];

            if (beMenu) {
                var promise = Journal.journalEntrySearch({
                        'transactionName': '',
                        'transactionDescription':'',
                        'page': 1,
                        'per_page': 1,
                        'transactionType':"Entry",
                        'currentStage': "branchPostingSearch"
                    }).$promise.then(function(response, headerGetter) {
                    beMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    beMenu.data = '-';
                });
            }

            var ceMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/Journal.JournalPostingSearch"];

            if (ceMenu) {
                var promise = Journal.journalEntrySearch({
                        'transactionName': '',
                        'transactionDescription':'',
                        'page': 1,
                        'per_page': 1,
                        'transactionType':"Entry",
                        'currentStage': "branchPostingEntry"
                    }).$promise.then(function(response, headerGetter) {
                    ceMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    ceMenu.data = '-';
                });
            }

            var deMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/Journal.JournalRejected"];

            if (deMenu) {
                var promise = Journal.journalEntrySearch({
                        'transactionName': '',
                        'transactionDescription':'',
                        'page': 1,
                        'per_page': 1,
                        'transactionType':"Entry",
                        'currentStage': "Rejected"
                    }).$promise.then(function(response, headerGetter) {
                    deMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    deMenu.data = '-';
                });
            }
        });
    }
]);
