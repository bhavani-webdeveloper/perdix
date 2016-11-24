irf.pages.controller("LeadDashboardCtrl",
['$log', '$scope', 'PagesDefinition', 'SessionStore', 'Lead',
function($log, $scope, PagesDefinition, SessionStore, Lead) {
    $log.info("Page.LeadsDashboard.html loaded");

    var fullDefinition = {
        "title": "Leads Dashboard",
        "iconClass": "fa fa-book",
        "items": [
            "Page/Engine/lead.LeadBulkUpload",
            "Page/Engine/lead.LeadGeneration",
            "Page/Engine/lead.leadAssignmentPendingQueue",
            "Page/Engine/lead.ReadyForScreeningQueue",
            "Page/Engine/lead.LeadFollowUpQueue",
            "Page/Engine/lead.IncompleteLeadQueue"
        ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
        $scope.dashboardDefinition = resp;
        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();

        var lapqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/lead.leadAssignmentPendingQueue"];
        if (lapqMenu) {
            Lead.search({
                'branchName': branchName,
                'currentStage': "Assignment Pending",
                'leadName': '',
                'area': '',
                'cityTownVillage': '',
                'businessName': '',
                'page': 1,
                'per_page': 1,
            }).$promise.then(function(response,headerGetter){
                lapqMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var lfuqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/lead.LeadFollowUpQueue"];
        if (lfuqMenu) {
            Lead.search({
                'branchName': branchName,
                'currentStage': "Inprocess",
                'leadName': '',
                'area': '',
                'cityTownVillage': '',
                'businessName': '',
                'page': 1,
                'per_page': 1,
            }).$promise.then(function(response,headerGetter){
                lfuqMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var ilqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/lead.IncompleteLeadQueue"];
        if (ilqMenu) {
            Lead.search({
                'branchName': branchName,
                'currentStage': "Incomplete",
                'leadName': '',
                'area': '',
                'cityTownVillage': '',
                'businessName': '',
                'page': 1,
                'per_page': 1,
            }).$promise.then(function(response,headerGetter){
                ilqMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var rfqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/lead.ReadyForScreeningQueue"];
        if (rfqMenu){
            Lead.search({
                'branchName': branchName,
                'currentStage': "ReadyForScreening",
                'leadName': '',
                'area': '',
                'cityTownVillage': '',
                'businessName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response, headerGetter){
                rfqMenu.data = response.headers['x-total-count'];
            }, function() {
                rfqMenu.data = '-';
            })
        }
    });

}]);