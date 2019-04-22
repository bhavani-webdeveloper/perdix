irf.pageCollection.directive("irfPvCharts", function () {
  return {
    restrict: 'E',
    scope: {
      chartData: '='
    },
    templateUrl: 'modules/directives/templates/irf-pv-charts.html',
    controller: 'irfPvChartsController'
  }
}).controller('irfPvChartsController', ["$scope", function ($scope) {
  $scope.colors = [];
  $scope.type = $scope.chartData.subType;
  $scope.labels = $scope.chartData.data.XLabels;
  $scope.filterdata = $scope.chartData.data;
  $scope.series = [];
  $scope.data = [];
  for (i = 0; i < $scope.chartData.data.dataset.length; i++) {
    $scope.series.push($scope.chartData.data.dataset[i].label);
  }
  getColor = function (colorValue) {
    return {
      backgroundColor: colorValue.backgroundColor,
      borderColor: colorValue.borderColor,
      pointBackgroundColor: colorValue.backgroundColor,
      pointHoverBackgroundColor: colorValue.backgroundColor
    };
  }

  for (i = 0; i < $scope.chartData.data.dataset.length; i++) {
    $scope.data.push($scope.chartData.data.dataset[i].data)
    $scope.colors.push(getColor($scope.chartData.data.dataset[i]));
  }

  $scope.onClick = function (points, evt) {
  };

  $scope.lineoption = {}
  if ($scope.type == "line") {
    $scope.lineoption = {
      line: {
        fill: false,
        tension: 0
      }
    }

  }
  if ($scope.type == "pie" || $scope.type == "doughnut") {
    $scope.options = {
      legend: {
        display: true
      },
      elements: $scope.lineoption

    };
  } else {
    $scope.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          },
        ]
      },
      legend: {
        display: true
      },
      elements: $scope.lineoption

    };
  }
}]);
