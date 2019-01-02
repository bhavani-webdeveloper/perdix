irf.pageCollection.controller(irf.controller("base.dashboard.lead.LeadDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons", "Lead", "Messaging",
function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Lead, Messaging) {
    $log.info("Dashboard.Page.LoanOriginationDashboard.html loaded");
    $scope.$templateUrl = "process/pages/templates/Page.LoanOriginationDashboard.html";
    var currentBranch = SessionStore.getCurrentBranch();

    var leadDefinition = {
        "title": "Lead",
        "iconClass": "fa fa-users",
        "items": [
            "Page/Engine/base.dashboard.lead.LeadGeneration",
            "Page/Engine/base.dashboard.lead.IncompleteLeadQueue",
            "Page/Engine/base.dashboard.lead.LeadFollowUpQueue",
            "Page/Engine/base.dashboard.lead.LeadBulkUpload",
            "Page/Engine/base.dashboard.lead.LeadAssignmentPendingQueue",
            "Page/Engine/base.dashboard.lead.LeadRejectedQueue",
        ]
       
    };
    

    PagesDefinition.getUserAllowedDefinition(leadDefinition).then(function(resp) {
        $scope.leadDashboardDefinition = resp;
        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();
        var centres = SessionStore.getCentres();

        var lapqMenu = $scope.leadDashboardDefinition.$menuMap["Page/Engine/base.dashboard.lead.LeadAssignmentPendingQueue"];
        var lfuqMenu = $scope.leadDashboardDefinition.$menuMap["Page/Engine/base.dashboard.lead.LeadFollowUpQueue"];
        var ilqMenu = $scope.leadDashboardDefinition.$menuMap["Page/Engine/base.dashboard.lead.IncompleteLeadQueue"];
        var rMenu = $scope.leadDashboardDefinition.$menuMap["Page/Engine/base.dashboard.lead.LeadRejectedQueue"];

       
        if (rMenu) rMenu.data = 0;
        if (lapqMenu) lapqMenu.data = 0;
        if (lfuqMenu) lfuqMenu.data = 0;
        if (ilqMenu) ilqMenu.data = 0;

          _.forEach(centres, function(centre) {
            if (lfuqMenu) {
                Lead.search({
                    'branchName': branchName,
                    'currentStage': "Inprocess",
                    'leadStatus': "FollowUp",
                    'leadName': '',
                    'area': '',
                    'cityTownVillage': '',
                    'businessName': '',
                    'page': 1,
                    'per_page': 1,
                    'centreName': centre.centreName
                }).$promise.then(function(response, headerGetter) {
                    if (!_.isNumber(lfuqMenu.data)) {
                        lfuqMenu.data = 0;
                    }
                    lfuqMenu.data = lfuqMenu.data + Number(response.headers['x-total-count']);
                }, function() {
                    lfuqMenu.data = '-';
                });
            }

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
                    'centreName': centre.centreName
                }).$promise.then(function(response, headerGetter) {
                    if (!_.isNumber(ilqMenu.data)) {
                        ilqMenu.data = 0;
                    }
                    ilqMenu.data = ilqMenu.data + Number(response.headers['x-total-count']);
                }, function() {
                    ilqMenu.data = '-';
                });
            }

            if (rMenu) {
                Lead.search({
                    'branchName': branchName,
                    'currentStage': "Inprocess",
                    'leadStatus': "Reject",
                    'leadName': '',
                    'area': '',
                    'cityTownVillage': '',
                    'businessName': '',
                    'page': 1,
                    'per_page': 1,
                    'centreName': centre.centreName
                }).$promise.then(function(response, headerGetter) {
                    if (!_.isNumber(rMenu.data)) {
                        rMenu.data = 0;
                    }
                    rMenu.data = rMenu.data + Number(response.headers['x-total-count']);
                }, function() {
                    rMenu.data = '-';
                });
            }
        })


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
            }).$promise.then(function(response, headerGetter) {
                lapqMenu.data = Number(response.headers['x-total-count']);
            }, function() {
                lapqMenu.data = '-';
            });
        }


    });
   
}
]);
