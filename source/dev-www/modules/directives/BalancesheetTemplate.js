irf.pageCollection.directive("irfPvBalancesheetTemplate", function () {
    return {
        restrict: 'E',
        scope: {
            balancesheettempData: '=',
        },
        templateUrl: 'modules/directives/templates/irf-pv-balancesheet-template.html',
        controller: 'irfPvBalancesheettemplateController'
    }
}).controller('irfPvBalancesheettemplateController', ["$scope", function ($scope) {
    $scope.enableUI=false;
    console.log($scope.balancesheettempData);
    if(typeof($scope.balancesheettempData.data[0].data)=='string'){
        $scope.enableUI=true;
        $scope.returnshowData=$scope.balancesheettempData;
        $scope.returnData='';
    }else{
        $scope.returnData=$scope.balancesheettempData.data;
    }
    // $scope.returnData=$scope.balancesheettempData.data;
    
    // console.log('anaba'+typeof($scope.returnData.data)=='object');
    $scope.balancesheettempData='';
}]);