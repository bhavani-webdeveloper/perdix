irf.pages.controller("ReportsCtrl",
["$log", "$scope", "SessionStore", "$stateParams",
    function($log, $scope, SessionStore, $stateParams){
    $log.info("ReportsCtrl loaded");

    var userName = SessionStore.getLoginname();

}]);