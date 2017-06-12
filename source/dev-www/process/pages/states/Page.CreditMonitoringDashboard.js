irf.pages.controller("CreditMonitoringDashboardCtrl", ['$log', '$scope', 'PagesDefinition', 'SessionStore', 'creditMonitoring',
    function($log, $scope, PagesDefinition, SessionStore, creditMonitoring) {
        $log.info("Page.creditMonitoringDashboard.html loaded");

        var fullDefinition = {
            "title": "creditMonitoring Dashboard",
            "iconClass": "fa fa-check-square-o",
            "items": [
                "Page/Engine/loans.individual.creditMonitoring.CreditMonitoringScheduleQueue",
                "Page/Engine/loans.individual.creditMonitoring.CreditMonitoringRescheduledQueue",
                "Page/Engine/loans.individual.creditMonitoring.CreditMonitoringLegalRecoveryQueue",
            ]
        };

        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;
            var branch = SessionStore.getCurrentBranch();
            var centres = SessionStore.getCentres();
            var centreId = [];
            if (centres && centres.length) {
                for (var i = 0; i < centres.length; i++) {
                    centreId.push(centres[i].centreId);
                }
            }
            var lsqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.creditMonitoring.CreditMonitoringScheduleQueue"];
            if (lsqMenu) {
                creditMonitoring.search({
                    'accountNumber': '',
                    'currentStage': "creditMonitoringSchedule",
                    'centreId': centreId[0],
                    'branchName': branch.branchName,
                    'page': 1,
                    'per_page': 1,
                    'applicantName': '',
                    'businessName': '',
                }).$promise.then(function(response, headerGetter) {
                    lsqMenu.data = response.headers['x-total-count'];
                }, function() {
                    lsqMenu.data = '-';
                });
            },
            var lsqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.creditMonitoring.CreditMonitoringRescheduledQueue"];
            if (lsqMenu) {
                creditMonitoring.search({
                    'accountNumber': '',
                    'currentStage': "CreditMonitoringRescheduledQueue",
                    'centreId': centreId[0],
                    'branchName': branch.branchName,
                    'page': 1,
                    'per_page': 1,
                    'applicantName': '',
                    'businessName': '',
                }).$promise.then(function(response, headerGetter) {
                    lsqMenu.data = response.headers['x-total-count'];
                }, function() {
                    lsqMenu.data = '-';
                });
            },
            var lsqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.creditMonitoring.CreditMonitoringLegalRecoveryQueue"];
            if (lsqMenu) {
                creditMonitoring.search({
                    'accountNumber': '',
                    'currentStage': "CreditMonitoringLegalRecoveryQueue",
                    'centreId': centreId[0],
                    'branchName': branch.branchName,
                    'page': 1,
                    'per_page': 1,
                    'applicantName': '',
                    'businessName': '',
                }).$promise.then(function(response, headerGetter) {
                    lsqMenu.data = response.headers['x-total-count'];
                }, function() {
                    lsqMenu.data = '-';
                });
            }

        });

    }
]);