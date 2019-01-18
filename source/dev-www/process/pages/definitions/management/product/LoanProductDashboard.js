irf.pageCollection.controller(irf.controller("management.product.LoanProductDashboard"), ['$log', '$scope', 'PageHelper', '$stateParams',
    'irfStorageService', 'SessionStore', 'PagesDefinition', 'GroupProcess', 'Product',
    function($log, $scope, PageHelper, $stateParams,
        irfStorageService, SessionStore, PagesDefinition, GroupProcess, Product) {
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        PageHelper.clearErrors();
        var fullDefinition = {
            "title": "LOAN_PRODUCT_DASHBOARD",
            "items": [
                "Page/Engine/management.product.NewProduct",
                "Page/Engine/management.product.SearchProductQueue",
                "Page/Engine/management.product.ProductBranch",
                "Page/Engine/management.product.BranchProduct"
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
            var edtLoanProduct = $scope.dashboardDefinition.$menuMap["Page/Engine/management.product.SearchProductQueue"];
            if (edtLoanProduct) {
                edtLoanProduct.data = '-';
                Product.search({}, function(response) {
                    edtLoanProduct.data = Number(response.headers['x-total-count']) || 0;
                });
            }
        });
    }
]);