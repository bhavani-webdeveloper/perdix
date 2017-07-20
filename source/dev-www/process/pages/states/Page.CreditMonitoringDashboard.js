irf.pages.controller("CreditMonitoringDashboardCtrl", ['$log', '$scope', 'PagesDefinition', 'SessionStore', 'CreditMonitoring',
    function($log, $scope, PagesDefinition, SessionStore, CreditMonitoring) {
        $log.info("Page.CreditMonitoringDashboard.html loaded");

        PagesDefinition.getUserAllowedDefinition({
            "title": "creditMonitoring Dashboard",
            "iconClass": "fa fa-check-square-o",
            "items": [
                "Page/Engine/loans.individual.creditMonitoring.CreditMonitoringScheduleQueue",
                "Page/Engine/loans.individual.creditMonitoring.CreditMonitoringRescheduledQueue",
                "Page/Engine/loans.individual.creditMonitoring.CreditMonitoringLegalRecoveryQueue",
                "Page/Engine/loans.individual.creditMonitoring.CreditMonitoringRiskQueue",
                "Page/Engine/loans.individual.creditMonitoring.CreditMonitoringCompletedQueue",
            ]
        }).then(function(resp) {
            $scope.dashboardDefinition = resp;
            // var branch = SessionStore.getCurrentBranch();
            // var centres = SessionStore.getCentres();
            // var centreId = [];
            // if (centres && centres.length) {
            //     for (var i = 0; i < centres.length; i++) {
            //         centreId.push(centres[i].centreId);
            //     }
            // }
            var cmsq = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.creditMonitoring.CreditMonitoringScheduleQueue"];
            var cmrq = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.creditMonitoring.CreditMonitoringRescheduledQueue"];
            var cmlrq = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.creditMonitoring.CreditMonitoringLegalRecoveryQueue"];
            var cmrqq = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.creditMonitoring.CreditMonitoringRiskQueue"];
            var cmcq = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.creditMonitoring.CreditMonitoringCompletedQueue"];

            if (cmsq) cmsq.data = '-';
            if (cmrq) cmrq.data = '-';
            if (cmlrq) cmlrq.data = '-';
            if (cmrqq) cmrqq.data = '-';
            if (cmcq) cmcq.data = '-';

            if (cmsq) {
                CreditMonitoring.search({
                    'monitoringType': "CM",
                    'currentStage': "CMSchedule",
                }).$promise.then(function(response, headerGetter) {
                    cmsq.data = response.headers['x-total-count'];
                }, function() {
                    cmsq.data = '-';
                });
            }

            if (cmrq) {
                CreditMonitoring.search({
                    'monitoringType': "CM",
                    'currentStage': "CMReschedule",
                }).$promise.then(function(response, headerGetter) {
                    cmrq.data = response.headers['x-total-count'];
                }, function() {
                    cmrq.data = '-';
                });
            }

            if (cmlrq) {
                CreditMonitoring.search({
                    'monitoringType': "CM",
                    'currentStage': "CMLegalRecovery",
                }).$promise.then(function(response, headerGetter) {
                    cmlrq.data = response.headers['x-total-count'];
                }, function() {
                    cmlrq.data = '-';
                });
            }

            if (cmrqq) {
                CreditMonitoring.search({
                    'monitoringType': "CM",
                    'currentStage': "CMEscalate",
                }).$promise.then(function(response, headerGetter) {
                    cmrqq.data = response.headers['x-total-count'];
                }, function() {
                    cmrqq.data = '-';
                });
            }

            if (cmcq) {
                CreditMonitoring.search({
                    'monitoringType': "CM",
                    'currentStage': "CMCompleted",
                }).$promise.then(function(response, headerGetter) {
                    cmcq.data = response.headers['x-total-count'];
                }, function() {
                    cmcq.data = '-';
                });
            }
        })

    }
]);