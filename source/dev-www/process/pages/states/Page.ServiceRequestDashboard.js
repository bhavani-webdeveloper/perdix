irf.pages.controller("ServiceRequestDashboardCtrl", [ '$log', '$scope', 'PagesDefinition', 'SessionStore', 'Worklist', 'Queries',
    function ($log, $scope, PagesDefinition, SessionStore, Worklist, Queries) {
        $log.info("Service Request Dashboard loaded");

        var fullDefinition = {
            "title": "Service Request Dashboard",
            "iconClass": "fa fa-check-square-o",
            "items": [
                "Page/Engine/request.LocRenewalQueue",
                "Page/Engine/request.NextTrancheQueue",
                "Page/Engine/request.PreClosureQueue",
                "Page/Engine/request.CloseRequest",
                "Page/Engine/request.ProfileSummaryQueue"
            ]
        };

        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;
            var branch = SessionStore.getCurrentBranch();
            var centres = SessionStore.getCentres();
            var centreId=[];
                
            if (centres && centres.length) {
                for (var i = 0; i < centres.length; i++) {
                    centreId.push(centres[i].centreId);
                }
            }

            var locMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/request.NextTrancheQueue"];
            if (locMenu) {
                Worklist.findWorklists({requestType:'next-tranche'}).$promise.then(function(response, headerGetter) {
                    locMenu.data = response.headers['x-total-count']; 
                }, function() {
                    locMenu.data = '';
                });
            }

            var nextMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/request.LocRenewalQueue"];
            if (nextMenu) {
                Worklist.findWorklists({requestType:'loc-renewal'}).$promise.then(function(response, headerGetter) {
                    nextMenu.data = response.headers['x-total-count']; 
                }, function() {
                    nextMenu.data = '';
                });
            }

            var preMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/request.PreClosureQueue"];
            if (preMenu) {
                Worklist.findWorklists({requestType:'pre-closure'}).$promise.then(function(response, headerGetter) {
                    preMenu.data = response.headers['x-total-count']; 
                }, function() {
                    preMenu.data = '';
                });
            }
            var profileMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/request.ProfileSummaryQueue"];
            if (profileMenu) {
                Queries.getProfileSummary().then(function(response, headerGetter) {
                    profileMenu.data = response.headers['x-total-count']; 
                }, function() {
                    profileMenu.data = '';
                });
            }

            // var creqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/request.closeRequest"];
            // if (creqMenu) {

            // }

        });

    }   
]);