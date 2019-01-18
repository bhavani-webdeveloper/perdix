irf.pageCollection.controller(irf.controller("kgfs.loans.LoanBookingDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons", "Lead",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Lead) {
        $log.info("Page.LoanOriginationDashboard.html loaded");
       //$scope.$templateUrl = "process/pages/templates/Page.LoanOriginationDashboard.html";
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        var currentBranch = SessionStore.getCurrentBranch();

      
        var loanDefinition = {
            "title": "Loan",
            "iconClass": "fa fa-users",
            "items": [
                "Page/Bundle/kgfs.loans.individual.booking.LoanInput",
                "Page/Engine/kgfs.loans.individual.booking.LoanInitiationQueue",
                "Page/Engine/kgfs.loans.individual.booking.DscOverrideQueue",
               "Page/Engine/kgfs.loans.individual.booking.DocumentUploadQueue",
               "Page/Engine/kgfs.loans.individual.booking.Checker1Queue",
               "Page/Engine/kgfs.loans.individual.booking.Checker2Queue"
               
            ]
        };


       
        PagesDefinition.getUserAllowedDefinition(loanDefinition).then(function(resp) {
            console.log(resp);
            $scope.dashboardDefinition = _.cloneDeep(resp);
            var userPartner = SessionStore.session.partnerCode;
            var branchId = "" + SessionStore.getBranchId();

            var liqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/kgfs.loans.individual.booking.LoanInitiationQueue"];
            var dscoverrideMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/kgfs.loans.individual.booking.DscOverrideQueue"];
            var DocUplMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/kgfs.loans.individual.booking.DocumentUploadQueue"];
            var checker1Menu = $scope.dashboardDefinition.$menuMap["Page/Engine/kgfs.loans.individual.booking.Checker1Queue"];
            var checker2Menu = $scope.dashboardDefinition.$menuMap["Page/Engine/kgfs.loans.individual.booking.Checker2Queue"];


            if(liqMenu){
                liqMenu.data = '-';
                IndividualLoan.search({
                    'branchId': branchId,
                    'partner': userPartner,
                    'stage': "LoanInitiation"
                }, function(response) {
                    liqMenu.data = Number(response.headers['x-total-count']) || 0;
                });
            }
            if(dscoverrideMenu){
                dscoverrideMenu.data = '-';
                IndividualLoan.search({
                    'branchId': branchId,
                    'partner': userPartner,
                    'stage': "DSCOverride"
                }, function(response) {
                    dscoverrideMenu.data = Number(response.headers['x-total-count']) || 0;
                });
            }
            if(DocUplMenu){
                DocUplMenu.data = '-';
                IndividualLoan.search({
                    'branchId': branchId,
                    'partner': userPartner,
                    'stage': "DocumentUpload"
                }, function(response) {
                    DocUplMenu.data = Number(response.headers['x-total-count']) || 0;
                });

            }
            if(checker1Menu){
                checker1Menu.data = '-';
                IndividualLoan.search({
                    'branchId': branchId,
                    'partner': userPartner,
                    'stage': "Checker1"
                }, function(response) {
                    checker1Menu.data = Number(response.headers['x-total-count']) || 0;
                });

            }
            if(checker2Menu){
                checker2Menu.data = '-';
                IndividualLoan.search({
                    'branchId': branchId,
                    'partner': userPartner,
                    'stage': "Checker2"
                }, function(response) {
                    checker2Menu.data = Number(response.headers['x-total-count']) || 0;
                });

            }
        });
    }
]);
