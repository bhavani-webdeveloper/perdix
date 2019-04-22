irf.pageCollection.directive("irfPvSection", function () {
    return {
        restrict: 'E',
        scope: {
            sectionData: '=',
        },
        templateUrl: 'modules/directives/templates/irf-pv-section.html',
        controller: 'irfPvSectionController'
    }
}).controller('irfPvSectionController', ["$scope", function ($scope) {
}]);