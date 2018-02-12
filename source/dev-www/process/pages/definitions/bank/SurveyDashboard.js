irf.pageCollection.controller(irf.controller("bank.Survey.SurveyDashboard"),
["$log", "SessionStore","$scope", "$state","$stateParams","Utils", "formHelper", "$q", "irfProgressMessage",
 "PageHelper", "SurveyInformation","PagesDefinition",
function($log, SessionStore,$scope, $state,$stateParams,Utils, formHelper, $q, irfProgressMessage,
 PageHelper, SurveyInformation,PagesDefinition) {
    $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";

    PageHelper.clearErrors();

    var siteCode = SessionStore.getGlobalSetting('siteCode');

    var fullDefinition = {
        "title": "SURVEY_DASHBOARD",
        "items": [
            "Page/Engine/bank.Survey",
            "Page/Engine/bank.SurveyQueue"
        ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
        $scope.dashboardDefinition = _.cloneDeep(resp);
        var branchId = "" + SessionStore.getBranchId();

        var survey = $scope.dashboardDefinition.$menuMap["Page/Engine/bank.Survey"];
        var survey2 = $scope.dashboardDefinition.$menuMap["Page/Engine/bank.SurveyQueue"];

        if (survey2) {
            survey2.data = '-';
            SurveyInformation.search({
                'page': 1,
                'per_page': 1,
            }, function(response) {
                survey2.data = Number(response.headers['x-total-count']) || 0;
            });
        }
    });
}]);