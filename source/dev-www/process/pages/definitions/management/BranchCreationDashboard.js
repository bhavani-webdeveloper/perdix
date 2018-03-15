irf.pageCollection.controller(irf.controller("management.BranchCreationDashboard"), 
    ['$log', '$scope', 'PageHelper', '$stateParams',
    'irfStorageService', 'SessionStore', 'PagesDefinition', 'BranchCreationResource',
    function($log, $scope, PageHelper, $stateParams,
        irfStorageService, SessionStore, PagesDefinition, BranchCreationResource) {
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        PageHelper.clearErrors();
        var fullDefinition = {
            "title": "BRANCH_CREATION_DASHBOARD",
            "items": [
                "Page/Engine/management.BranchMaintenance",
                "Page/Engine/management.BranchCreationSearch",
                "Page/Engine/management.BranchDeleteQueue"
            ]
        };
        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = _.cloneDeep(resp);
            
            var branchCreationSearch = $scope.dashboardDefinition.$menuMap["Page/Engine/management.BranchCreationSearch"];
            if (branchCreationSearch) {
                branchCreationSearch.data = '-';
                BranchCreationResource.branchSearch({
                    'per_page': 1,
                    'page': 1
                }, function(response) {
                    branchCreationSearch.data = Number(response.headers['x-total-count']) || 0;
                });
            }
            var branchDeleteQueue = $scope.dashboardDefinition.$menuMap["Page/Engine/management.BranchDeleteQueue"];
            if (branchDeleteQueue) {
                branchDeleteQueue.data = '-';
                BranchCreationResource.branchSearch({
                    'per_page': 1,
                    'page': 1
                }, function(response) {
                    branchDeleteQueue.data = Number(response.headers['x-total-count']) || 0;
                });
            }

        });
    }
]);