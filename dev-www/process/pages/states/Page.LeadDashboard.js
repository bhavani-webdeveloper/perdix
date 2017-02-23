irf.pages.controller("LeadDashboardCtrl",
['$log', '$scope', 'PagesDefinition', 'SessionStore', 'Lead',
function($log, $scope, PagesDefinition, SessionStore, Lead) {
    $log.info("Page.LeadsDashboard.html loaded");

    var fullDefinition = {
        "title": "Leads Dashboard",
        "iconClass": "fa fa-book",
        "items": [
            "Page/Engine/lead.LeadGeneration",
            "Page/Engine/lead.IncompleteLeadQueue",
            "Page/Engine/lead.LeadFollowUpQueue",
            "Page/Engine/lead.ReadyForScreeningQueue",
            "Page/Engine/lead.LeadRejectedQueue",
            "Page/Engine/lead.LeadBulkUpload",
            "Page/Engine/lead.leadAssignmentPendingQueue"  
        ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
        $scope.dashboardDefinition = resp; 
        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();
        var centres = SessionStore.getCentres();
        var centreName=[];
        if(centres && centres.length)
        {
        for (var i = 0; i < centres.length; i++) {
            centreName.push(centres[i].centreName);
        }
        }

        var lapqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/lead.leadAssignmentPendingQueue"];
        var lfuqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/lead.LeadFollowUpQueue"];
        var ilqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/lead.IncompleteLeadQueue"];
        var rfqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/lead.ReadyForScreeningQueue"];
        var rMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/lead.LeadRejectedQueue"];

        if (rMenu) rMenu.data = 0;
        if (lapqMenu) lapqMenu.data = 0;
        if (lfuqMenu) lfuqMenu.data = 0;
        if (ilqMenu) ilqMenu.data = 0;
        if (rfqMenu) rfqMenu.data = 0;

        _.forEach(centres, function(centre){
            
            if (rfqMenu){
            Lead.search({
                'branchName': branchName,
                'currentStage': "ReadyForScreening",
                'leadName': '',
                'area': '',
                'cityTownVillage': '',
                'businessName': '',
                'page': 1,
                'per_page': 1,
                'centreName': centre.centreName
            }).$promise.then(function(response, headerGetter){
                if (!_.isNumber(rfqMenu.data)){
                    rfqMenu.data = 0;
                } 
                rfqMenu.data = rfqMenu.data +  Number(response.headers['x-total-count']);
            }, function() {
                rfqMenu.data = '-';
                });    
            }

            if (lfuqMenu){
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
            }).$promise.then(function(response,headerGetter){
                if (!_.isNumber(lfuqMenu.data)){
                    lfuqMenu.data = 0;
                } 
                lfuqMenu.data = lfuqMenu.data +  Number(response.headers['x-total-count']);
            }, function() {
                lfuqMenu.data = '-';
                });    
            }

            if (ilqMenu){
            Lead.search({
                'branchName': branchName,
                'currentStage': "Inprocess",
                'centreName': centreName[0],
                'leadStatus': "Reject",
                'leadName': '',
                'area': '',
                'cityTownVillage': '',
                'businessName': '',
                'page': 1,
                'per_page': 1,
                'centreName': centre.centreName
            }).$promise.then(function(response,headerGetter){
                if (!_.isNumber(rMenu.data)){
                    rMenu.data = 0;
                } 
                rMenu.data = rMenu.data +  Number(response.headers['x-total-count']);
            }, function() {
                rMenu.data = '-';
            });


            Lead.search({
                'branchName': branchName,
                'centreName': centreName[0],
                'currentStage': "Incomplete",
                'leadName': '',
                'area': '',
                'cityTownVillage': '',
                'businessName': '',
                'page': 1,
                'per_page': 1,
                'centreName': centre.centreName
            }).$promise.then(function(response,headerGetter){
                if (!_.isNumber(ilqMenu.data)){
                    ilqMenu.data = 0;
                } 
                ilqMenu.data = ilqMenu.data +  Number(response.headers['x-total-count']);
            }, function() {
                ilqMenu.data = '-';
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
            }).$promise.then(function(response,headerGetter){
                lapqMenu.data = Number(response.headers['x-total-count']);
            }, function() {
                lapqMenu.data = '-';
            });
        }

        if (rMenu){
            Lead.search({
                'branchName': branchName,
                'currentStage': "Inprocess",
                'leadStatus': "Reject",
                'leadName': '',
                'area': '',
                'cityTownVillage': '',
                'businessName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                if (!_.isNumber(rMenu.data)){
                    rMenu.data = 0;
                } 
                rMenu.data = rMenu.data +  Number(response.headers['x-total-count']);
            }, function() {
                rMenu.data = '-';
    });
        }

    });

}]);