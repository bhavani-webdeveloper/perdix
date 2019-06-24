irf.pageCollection.directive("irfPvGrid", function () {
    return {
        restrict: 'E',
        scope: {
            gridData: '=',
        },
        templateUrl: 'modules/directives/templates/irf-pv-grid.html',
        controller: 'irfPvGridController'
    }
}).controller('irfPvGridController', ["$scope", "irfCurrencyFilter",function ($scope, irfCurrencyFilter) {
}]);