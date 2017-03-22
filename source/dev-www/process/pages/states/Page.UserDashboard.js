irf.pages.controller("UserDashboardCtrl",
['$log', '$scope', 'PagesDefinition', 'SessionStore', 'LoanProcess', 'LoanCollection',
function($log, $scope, PagesDefinition, SessionStore, LoanProcess, LoanCollection) {
    $log.info("Page.LoansCollectionsDashboard.html loaded");

    var currentBranchId = SessionStore.getCurrentBranch().branchId;

    var fullDefinition = {
        "title": "User Dashboard",
        "iconClass": "fa fa-reply",
        "items": [
            "Page/Engine/user.UserSearch",
            "Page/Engine/user.UserMaintanence"
        ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
        $scope.dashboardDefinition = resp;
        var branchId = SessionStore.getBranchId();

        // var bqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.collections.BounceQueue"];
        // if (bqMenu) {
        //     var centres = SessionStore.getCentres();
        //     bqMenu.data = 0;
        //     for (var i = 0; i < centres.length; i++) {
        //         LoanProcess.bounceCollectionDemand({ 'branchId': branchId, 'centreId': centres[i].id }).$promise.then(function(response,headerGetter){
        //             bqMenu.data += response.body.length; // Number(headerGetter()['x-total-count']);
        //         }, function() {
        //             bqMenu.data = '-';
        //         });
        //     };
        // }

        
    });

}]);