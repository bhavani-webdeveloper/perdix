irf.pages.controller("DocumentTrackingDashboardCtrl", ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "DocumentTracking",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, DocumentTracking) {
        $log.info("Page.DocumentTrackingDashboard.html loaded");

        var currentBranch = SessionStore.getCurrentBranch();


        var fullDefinition = {
            "title": "Document Tracking Dashboard",
            "iconClass": "fa fa-users",
            "items": [
                "Page/Engine/loans.individual.documentTracking.PendingDispatchQueue",
                "Page/Engine/loans.individual.documentTracking.PendingDispatchConfirmationQueue",
                "Page/Engine/loans.individual.documentTracking.BatchInTransitQueue",
                "Page/Engine/loans.individual.documentTracking.PendingVerificationQueue",
                "Page/Engine/loans.individual.documentTracking.PendingFilingQueue"
            ]
        };

        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;
            var branchId = SessionStore.getBranchId();
            var branchName = SessionStore.getBranch();

            var pdMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.documentTracking.PendingDispatchQueue"];
            if (pdMenu) {
                DocumentTracking.search({
                    'stage': 'BatchInitiation',
                    'branchId': branchId,
                    'centerId': null,
                    'page': 1,
                    'per_page': 1
                }).$promise.then(function(response, headerGetter) {
                    pdMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    pdMenu.data = '-';
                });
            }

            var pdcMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.documentTracking.PendingDispatchConfirmationQueue"];
            if (pdcMenu) {
                DocumentTracking.search({
                    'stage': 'BatchConfirmation',
                    'branchId': branchId,
                    'centerId': null,
                    'page': 1,
                    'per_page': 1
                }).$promise.then(function(response, headerGetter) {
                    pdcMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    pdcMenu.data = '-';
                });
            }

            var bitMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.documentTracking.BatchInTransitQueue"];
            if (bitMenu) {
                DocumentTracking.search({
                    'stage': 'BatchInTransit',
                    'branchId': null,
                    'centerId': null,
                    'page': 1,
                    'per_page': 1
                }).$promise.then(function(response, headerGetter) {
                    bitMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    bitMenu.data = '-';
                });
            }

            var pvMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.documentTracking.PendingVerificationQueue"];
            if (pvMenu) {
                DocumentTracking.search({
                    'stage': 'PendingVerification',
                    'branchId': null,
                    'centerId': null,
                    'page': 1,
                    'per_page': 1
                }).$promise.then(function(response, headerGetter) {
                    pvMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    pvMenu.data = '-';
                });
            }

            var pfMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.documentTracking.PendingFilingQueue"];
            if (pfMenu) {
                DocumentTracking.search({
                    'stage': 'PendingFiling',
                    'branchId': null,
                    'centerId': null,
                    'page': 1,
                    'per_page': 1
                }).$promise.then(function(response, headerGetter) {
                    pfMenu.data = Number(response.headers['x-total-count']);
                }, function() {
                    pfMenu.data = '-';
                });
            }

        });
    }
]);