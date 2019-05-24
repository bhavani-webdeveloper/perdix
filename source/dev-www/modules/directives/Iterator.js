irf.pageCollection.directive("irfPvIterator", function () {
    return {
        restrict: 'E',
        scope: {
            iteratorData: '=',
        },
        templateUrl: 'modules/directives/templates/irf-pv-iterator.html',
        controller: 'irfPvIteratorController'
    }
}).controller('irfPvIteratorController', ["$scope", function ($scope) {
    console.log($scope.iteratorData)
}]);