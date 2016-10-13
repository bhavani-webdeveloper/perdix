irf.pages.controller("LoansBookingDashboardCtrl",
['$log', '$scope', 'PagesDefinition', 'SessionStore', 'IndividualLoan',
function($log, $scope, PagesDefinition, SessionStore, IndividualLoan) {
    $log.info("Page.LoansBookingDashboard.html loaded");

    var fullDefinition = {
        "title": "Loan Booking Dashboard",
        "iconClass": "fa fa-book",
        "items": [
            "Page/Engine/loans.individual.booking.LoanInput",
            "Page/Engine/loans.individual.booking.PendingQueue",
            "Page/Engine/loans.individual.booking.DocumentUploadQueue",
            "Page/Engine/loans.individual.booking.PendingVerificationQueue"
        ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
        $scope.dashboardDefinition = resp;
        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();

        var pqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.booking.PendingQueue"];
        if (pqMenu) {
            IndividualLoan.search({
                'stage': 'LoanBooking',
                'branchName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                pqMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var duqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.booking.DocumentUploadQueue"];
        if (duqMenu) {
            IndividualLoan.search({
                'stage': 'DocumentUpload',
                'branchName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                duqMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var pvqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.booking.PendingVerificationQueue"];
        if (pvqMenu) {
            IndividualLoan.search({
                'stage': 'DocumentVerification',
                'branchName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                pvqMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }
    });

}]);