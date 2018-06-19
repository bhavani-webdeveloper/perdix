irf.pageCollection.controller(irf.controller("coa.ChartOfAccountDashboard"), 
    ['$log', '$scope', 'PageHelper', '$stateParams',
    'irfStorageService', 'SessionStore', 'PagesDefinition',
    function($log, $scope, PageHelper, $stateParams,
        irfStorageService, SessionStore, PagesDefinition) {
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        PageHelper.clearErrors();
        var fullDefinition = {
            "title": "CHART_OF_ACCOUNT_DASHBOARD",
            "iconClass": "fa fa-users",     
            "items": [
                "Page/Engine/coa.ListOfAccount"
            ]
        };
        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = _.cloneDeep(resp);
            var userPartner = SessionStore.session.partnerCode;
            var branch = SessionStore.getCurrentBranch();
            var branchId = "" + SessionStore.getBranchId();
            var centres = SessionStore.getCentres();
            var centreId = [];
            if (centres && centres.length) {
                for (var i = 0; i < centres.length; i++) {
                    centreId.push(centres[i].centreId);
                }
            }
            // var coaQueue = $scope.dashboardDefinition.$menuMap["Page/Engine/coa.ListOfAccount"];
            // if (coaQueue) {
            //     // coaQueue.data = '-';
            //     // Product.search({}, function(response) {
            //     //     edtLoanProduct.data = Number(response.headers['x-total-count']) || 0;
            //     // });
            // }
        });
    }
]);