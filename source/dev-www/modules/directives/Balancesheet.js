irf.pageCollection.directive("irfPvBalancesheet", function () {
    return {
        restrict: 'E',
        scope: {
            balancesheetData: '=',
        },
        templateUrl: 'modules/directives/templates/irf-pv-balancesheet.html',
        controller: 'irfPvBalancesheetController'
    }
}).controller('irfPvBalancesheetController', ["$scope","irfCurrencyFilter", function ($scope,irfCurrencyFilter) {
    $scope.romanNumaric=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'];
    $scope.romanNumaricSmall=['i','ii','iii','iv','v','vi','vii','viii','ix','x','xi','xii','xiii','xiv','xv','xvi','xvii','xviii','xix','xx'];

// get the index and return the letter of the alphabet
$scope.getromanNumaric = function(index) {
  return $scope.romanNumaric[index];
};
$scope.getromanNumaricSmall = function(index) {
    return $scope.romanNumaricSmall[index];
  };
 $scope.getalphabetSmall = function(index) {
    return String.fromCharCode(97+index);
  };
  $scope.innerdata = false;
    $scope.getBType = function(test){
        return( typeof test);
    }
}]);