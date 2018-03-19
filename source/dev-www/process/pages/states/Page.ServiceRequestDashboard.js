irf.pages.controller("ServiceRequestDashboardCtrl", [ '$log', '$scope', 'PagesDefinition', 'SessionStore', 'Worklist', 
    function ($log, $scope, PagesDefinition, SessionStore, Worklist) {
        $log.info("Service Request Dashboard loaded");

        var fullDefinition = {
            "title": "Service Request Dashboard",
            "iconClass": "fa fa-check-square-o",
            "items": [
                "Page/Engine/request.LocRenewalQueue",
                "Page/Engine/request.NextTrancheQueue",
                "Page/Engine/request.PreClosureQueue",
                "Page/Engine/request.CloseRequest"
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

            var oreqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/request.openRequestQueue"];
            if (oreqMenu) {
                worklist.findWorklists().$promise.then(function(response, headerGetter) {
                   oreqMenu.data = response.headers['x-total-count']; 
                }, function() {
                    oreqMenu.data = '';
                });
            }

            // var creqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/request.closeRequest"];
            // if (creqMenu) {

            // }

        });

    }   
]);