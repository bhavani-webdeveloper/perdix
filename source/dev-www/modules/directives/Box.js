
irf.pageCollection.directive("irfPvBox", function () {
    return {
        restrict: 'E',
        scope: {
            boxData: "="
        },
        templateUrl: 'modules/directives/templates/irf-pv-box.html',
        controller: 'irfPvBoxController'
    }
}).controller('irfPvBoxController', ["$scope", function ($scope) {
    $scope.getIncresePercentage = function (data) {
        return ((data.data / data.total) * 100).toFixed(2);
    }
    $scope.getProgresswidth = function (data) {
        return $scope.progresswidth = $scope.getIncresePercentage(data) + "%";
    }
    $scope.getProgressStyle = function (data) {
        var progresswidth = $scope.getProgresswidth(data)
        return {
            width: progresswidth
        }
    }
    var iconClasses = ["calendar-week", "arrows", "university", "building", "eraser"];
    var randomIcon = function (i) {
        return iconClasses[i];
    }
    $scope.getIconClass = function (iconName, index) {
        if (!iconName) {
            $scope.iconClass = "fa fa-" + randomIcon(index);
        } else {
            $scope.iconClass = "fa fa-" + iconName;
        }
        return $scope.iconClass;
    }
    var bgclasses = ["aqua", "red", "yellow", "green", "blue"];
    var randomColor = function (i) {
        return bgclasses[i];
    }
    $scope.getBoxClass = function (bgClass, index) {
        if (!bgClass) {
            $scope.boxclass = "bg-" + randomColor(index);

        } else {
            $scope.boxclass = "bg-" + bgClass;
        }
        return $scope.boxclass;
    }
}]);