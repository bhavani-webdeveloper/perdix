irf.pageCollection.directive("irfPvPnl", function () {
    return {
        restrict: 'E',
        scope: {
            pnlData: '=',
        },
        templateUrl: 'modules/directives/templates/irf-pv-pnl.html',
        controller: 'irfPvPnLController'
    }
}).controller('irfPvPnLController', ["$scope", function ($scope) {
    $scope.romanNumaric=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'];
    $scope.romanNumaricSmall=['i','ii','iii','iv','v','vi','vii','viii','ix','x','xi','xii','xiii','xiv','xv','xvi','xvii','xviii','xix','xx'];

// get the index and return the letter of the alphabet
$scope.getromanNumaric = function(index) {
  return $scope.romanNumaric[index];
};console.log($scope.pnlData.data.dataset[0].data.label)
$scope.getromanNumaricSmall = function(index) {
    return $scope.romanNumaricSmall[index];
  };
 $scope.getalphabetSmall = function(index) {
    return String.fromCharCode(97+index);
  };
}]);