irf.pageCollection.directive("irfPvMultimedia", function () {
    return {
        restrict: 'E',
        scope: {
            multimediaData: '=',
        },
        templateUrl: 'modules/directives/templates/irf-pv-multimedia.html',
        controller: 'irfPvMultimediaController'
    }
}).controller('irfPvMultimediaController', ["$scope", "irfCurrencyFilter","$window",function ($scope,irfCurrencyFilter,$window) {
    $scope.fullurl= function (id){
        $scope.fullUrl= baseurl+'/api/stream/'+id;
        }
    $scope.openInNewWindow = function(index){
        $window.open(index);
      }
}]);