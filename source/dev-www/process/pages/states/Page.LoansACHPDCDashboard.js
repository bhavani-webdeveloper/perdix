irf.pages.controller("LoansACHPDCDashboardCtrl", ['$log', '$scope', 'PagesDefinition', 'SessionStore',
    function($log, $scope, PagesDefinition, SessionStore) {
        $log.info("Page.LoansACHPDCDashboard.html loaded");

        var achpdcMaintenanceDefinition = {
            "title": "ACH / PDC Maintenance",
            "iconClass": "fa fa-cc",
            "items": [
                "Page/Engine/loans.individual.achpdc.ACHPDCQueue",
                "Page/Engine/loans.individual.achpdc.ACHMandateDownload",
                "Page/Engine/loans.individual.achpdc.ACHMandateQueue",
                "Page/Engine/loans.individual.achpdc.ACHClose",
                "Page/Engine/loans.individual.achpdc.PDCRegistration"
            ]
        };
        var achpdcTransactionDefinition = {
            "title": "ACH / PDC Transactions",
            "iconClass": "fa fa-cc",
            "items": [
                "Page/Engine/loans.individual.achpdc.ACHPDCDemandRequest",
                "Page/Engine/loans.individual.achpdc.ACHDemandDownload",
                "Page/Engine/loans.individual.achpdc.ACHClearingCollection",
                "Page/Engine/loans.individual.achpdc.PDCDemandDownload",
                "Page/Engine/loans.individual.achpdc.PDCCollections",
                "Page/Engine/loans.individual.achpdc.DemandDownloads",
                "Page/Engine/loans.individual.achpdc.BatchMonitoringQueue"
            ]
        };

        PagesDefinition.getUserAllowedDefinition(achpdcMaintenanceDefinition).then(function(resp) {
            $scope.maintenanceDashboardDefinition = resp;
        });
        PagesDefinition.getUserAllowedDefinition(achpdcTransactionDefinition).then(function(resp) {
            $scope.transactionDashboardDefinition = resp;
        });
    }
]);