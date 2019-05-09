irf.pageCollection.controller(irf.controller("management.branchadmin.BranchAdminDashboard"), 
    ['$log', '$scope', 'PageHelper', '$stateParams',
    'irfStorageService', 'SessionStore', 'PagesDefinition', 'BranchCreationResource',
    function($log, $scope, PageHelper, $stateParams,
        irfStorageService, SessionStore, PagesDefinition, BranchCreationResource) {
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        PageHelper.clearErrors();
    var fullDefinition = {
            "title": "BRANCH_ADMINISTRATION_DASHBOARD",
            "items": [
                "Page/Engine/management.branchadmin.FreezeTransaction",
                "Page/Engine/management.branchadmin.CashManagement",
                "Page/Engine/management.branchadmin.UpdateEod"
            ]
        };
        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = _.cloneDeep(resp);
            
            // var branchCreationSearch = $scope.dashboardDefinition.$menuMap["Page/Engine/management.bankadmin.BankAdminDashboard"];
            // if (branchCreationSearch) {
            //     branchCreationSearch.data = '-';
            //     BranchCreationResource.branchSearch({
            //         'per_page': 1,
            //         'page': 1
            //     }, function(response) {
            //         branchCreationSearch.data = Number(response.headers['x-total-count']) || 0;
            //     });
            // }
            /*var branchDeleteQueue = $scope.dashboardDefinition.$menuMap["Page/Engine/management.BranchDeleteQueue"];
            if (branchDeleteQueue) {
                branchDeleteQueue.data = '-';
                BranchCreationResource.branchSearch({
                    'per_page': 1,
                    'page': 1
                }, function(response) {
                    branchDeleteQueue.data = Number(response.headers['x-total-count']) || 0;
                });
            }*/

        });
    }
]);