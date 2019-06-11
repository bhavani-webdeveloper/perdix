irf.pages.controller("FormsDashboardCtrl",
['$log', '$scope', 'PagesDefinition', 'SessionStore', 'LoanProcess', 'LoanCollection',
function($log, $scope, PagesDefinition, SessionStore, LoanProcess, LoanCollection) {
    $log.info("Page.FormsDashboard.html loaded");

    var currentBranchId = SessionStore.getCurrentBranch().branchId;

    var fullDefinition = {
        "title": "User Dashboard",
        "iconClass": "fa fa-reply",
        "items": [
            "Page/Engine/forms.FormsSearch",
            "Page/Engine/forms.FormsMaintanence",
            "Page/Engine/forms.DownloadForm"
            //"Page/Engine/user.LogoutUser",
            //"Page/Engine/user.MultipleUserLogout",
            //"Page/Engine/user.UserAttendance"

        ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
        $scope.dashboardDefinition = resp;
        var branchId = SessionStore.getBranchId();

        
    });

}]);