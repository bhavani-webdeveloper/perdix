irf.pageCollection.directive("irfPvDashboard", function () {
    return {
        restrict: 'E',
        scope: {
            visualizationData: '='
          },
        templateUrl: 'modules/directives/templates/irf-pv-dashboard.html',
        controller: 'irfPvDashboardController'
    }
}).controller('irfPvDashboardController', ["$scope", "VisualizationCodeResource", "$q","Utils","PageHelper", function ($scope, VisualizationCodeResource, $q, Utils, PageHelper) {
    var deferred = $q.defer();
    PageHelper.showLoader();
    VisualizationCodeResource.getDashboardData({
        "dashboardName": "business_financials",
        "parameters": {
            "CustomerId": $scope.visualizationData.customerId,
            "LoanId": $scope.visualizationData.loanId,
        }
    }).$promise.then(function (res) {
        $scope.dashboardData = res;
        PageHelper.hideLoader();
        deferred.resolve();
    }, function (err) {
        PageHelper.hideLoader();
        Utils.alert(err.data.error).finally(function () {
            deferred.reject();
        });
    });
// $scope.dashboardData = {}
    }]);

