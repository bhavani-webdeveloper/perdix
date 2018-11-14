irf.pageCollection.controller(irf.controller("customer360.FinancialWellbeingReport"),
["$log", "$scope", "$stateParams", "irfNavigator", "$sce", "PageHelper", "SessionStore", "Queries", "irfProgressMessage",
function($log, $scope, $stateParams, irfNavigator, $sce, PageHelper, SessionStore, Queries, irfProgressMessage) {
    var customerId = $stateParams.pageId;
    if (!customerId) {
        irfNavigator.goBack();
    }
    var setFWRFrameHeight = function() {
        $(".analytics-iframe, .analytics-root").css('height', ($(window).height()-139)+'px');
    };
    var handleError = function(err) {
        irfProgressMessage.clear();
        PageHelper.hideLoader();
        PageHelper.showProgress('FWR', 'FWR login failed.', 5000);
        err && PageHelper.showErrors(err);
        irfNavigator.goBack();
    };
    PageHelper.showLoader();
    Queries.getResult('userBasic.one', { userId: SessionStore.getLoginname() }).then(function(records) {
        if (records && records.results && records.results[0] && records.results[0].id) {
            irfProgressMessage.clear();
            $scope.fwrDashboardURL = $sce.trustAsResourceUrl(irf.FWR_BASE_URL + '/fwr_input.php?customer_id='+customerId+'&s_id='+records.results[0].id);
            $($window).resize(setFWRFrameHeight);
            setFWRFrameHeight();
        } else {
            handleError();
        }
    }, handleError).finally(PageHelper.hideLoader);
}]);
