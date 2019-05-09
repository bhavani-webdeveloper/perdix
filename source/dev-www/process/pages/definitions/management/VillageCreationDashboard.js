irf.pageCollection.controller(irf.controller("management.VillageCreationDashboard"),
    ['$log', '$scope', 'PageHelper', '$stateParams',
        'irfStorageService', 'SessionStore', 'PagesDefinition',
        function ($log, $scope, PageHelper, $stateParams,
            irfStorageService, SessionStore, PagesDefinition) {
            $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
            PageHelper.clearErrors();
            var fullDefinition = {
                "title": "VILLAGE_CREATION_DASHBOARD",
                "items": [
                    "Page/Engine/management.VillageCreation",
                    "Page/Engine/management.VillageCreationSearch"
                ]
            };
            PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function (resp) {
                $scope.dashboardDefinition = _.cloneDeep(resp);
            });
        }
    ]);