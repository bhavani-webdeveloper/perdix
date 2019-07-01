irf.pageCollection.directive("irfPvGrid", function () {
    return {
        restrict: 'E',
        scope: {
            gridData: '=',
        },
        templateUrl: 'modules/directives/templates/irf-pv-grid.html',
        controller: 'irfPvGridController'
    }
}).controller('irfPvGridController', ["$scope", "irfCurrencyFilter","BASE_URL","$window",function ($scope, irfCurrencyFilter,BASE_URL,$window) {
    var baseurl=BASE_URL;
    $scope.fullurl= function (id){
     $scope.fullUrl= baseurl+'/api/stream/'+id;
     }
     $scope.openInNewWindow = function(index){
        $window.open(index);
      }

}]);