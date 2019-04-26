irf.pageCollection.directive("irfPvContainer", function () {
    return {
        restrict: 'E',
        scope: {
            containerData: '=',
        },
        templateUrl: 'modules/directives/templates/irf-pv-container.html',
        controller: 'irfPvContainerController'
    }
}).controller('irfPvContainerController', ["$scope", function ($scope) {
}]);