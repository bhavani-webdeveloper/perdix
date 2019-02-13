irf.pageCollection.controller(irf.controller("shramsarathi.dashboard.loans.individual.collections.LoansCollectionsDashboard"),
['$log', '$scope', 'PagesDefinition','formHelper', 'SessionStore', 'LoanProcess','RepaymentReminder', 'LoanCollection',
function($log, $scope, PagesDefinition,formHelper, SessionStore, LoanProcess,RepaymentReminder, LoanCollection) {
    $log.info("Page.LoansCollectionsDashboard.html loaded");
     $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";



    var fullDefinition = {
        "title": "Collections Dashboard",
        "iconClass": "fa fa-reply",
        "items": [
          
            "Page/Engine/shramsarathi.dashboard.loans.individual.collections.BounceQueue",
            // "Page/Engine/shramsarathi.dashboard.loans.individual.collections.BouncePromiseQueue",
            // "Page/Engine/shramsarathi.dashboard.loans.individual.collections.BounceRecoveryQueue",
            // "Page/Engine/loans.individual.collections.PreDepositQueue",
            "Page/Engine/shramsarathi.dashboard.loans.individual.collections.CollectionDepositQueue",
            "Page/Engine/shramsarathi.dashboard.loans.individual.collections.BRSMultiApproval",
            "Page/Engine/shramsarathi.dashboard.loans.individual.collections.CreditValidationQueue",
            "Page/Engine/shramsarathi.dashboard.loans.individual.collections.TransactionAuthorizationQueue",
            //"Page/Engine/shramsarathi.dashboard.loans.individual.collections.DepositStage"
        ]
    };
    var assignedTo ;
    PagesDefinition.getPageConfig("Page/Engine/shramsarathi.dashboard.loans.individual.collections.BounceQueue")
    .then(function(data){
        console.log(data);
        // var defaultConfig = {
        //     IncludeUserFilter: false
        // };
        // _.defaults(data, defaultConfig);
        // model.pageConfig = _.extend(model.pageConfig, data);
        if (data.IncludeUserFilter)
             assignedTo = SessionStore.getLoginname();
    });

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
        $scope.dashboardDefinition = resp;
        var branchId = SessionStore.getBranchId();
        var branches = formHelper.enum('branch').data;
        var branchName = null;
        for (var i = 0; i < branches.length; i++) {
            var branch = branches[i];
            if (branch.code == branchId) {
                branchName = branch.name;
            }
        }

        var currentBranchId = SessionStore.getCurrentBranch().branchId;
       
        var bqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.collections.BounceQueue"];
        if (bqMenu) {
            var centres = SessionStore.getCentres();
            bqMenu.data = 0;
            for (var i = 0; i < centres.length; i++) {
                LoanProcess.bounceCollectionDemand({  'centreId': centres[i].id , 'assignedTo': assignedTo }).$promise.then(function(response,headerGetter){
                    bqMenu.data += response.body.length; // Number(headerGetter()['x-total-count']);
                }, function() {
                    bqMenu.data = '-';
                });
            };
        }
        var dep=$scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.collections.CollectionDepositQueue"];
        if(dep) {
            dep.data = 0;
            LoanCollection.fetchDepositSummary({
                'currentStage': "Deposit",
                'branchName' : branchName,
                'instrumentType': "CASH"
            }).$promise.then(function(response, headerGetter){
                dep.data = dep.data + parseFloat(response.headers['x-total-count']);
            })
            LoanCollection.query({
                'currentStage': "Deposit",
                'accountBranchId' : branchId,
                'instrumentType': "CHQ"
            }).$promise.then(function(response, headerGetter){
                dep.data = dep.data + parseFloat(response.headers['x-total-count']);
            })
        }

        var bpqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.collections.BouncePromiseQueue"];
        if (bpqMenu) {
            LoanProcess.bounceCollectionDemand({ 'branchId': currentBranchId }).$promise.then(function(response,headerGetter){
                bpqMenu.data = response.body.length; // Number(headerGetter()['x-total-count']);
            }, function() {
                bpqMenu.data = '-';
            });
        }

        var brqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.collections.BounceRecoveryQueue"];
        if (brqMenu) {
            LoanProcess.bounceCollectionDemand({ 'branchId': currentBranchId }).$promise.then(function(response,headerGetter){
                brqMenu.data = response.body.length; // Number(headerGetter()['x-total-count']);
            }, function() {
                brqMenu.data = '-';
            });
        }

        var cvqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.collections.CreditValidationQueue"];
        if (cvqMenu) {
            LoanCollection.query({
                    'currentStage':"CreditValidation"
                }).$promise.then(function(response, headerGetter){
                    cvqMenu.data = response.headers['x-total-count'];
                })
        }

     

        var brsMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.collections.BRSApprovalQueue"];
        if (brsMenu) {
            LoanCollection.query({
                    'currentStage':"BRSValidation"
                }).$promise.then(function(response, headerGetter){
                    brsMenu.data = response.headers['x-total-count'];
                })
        }

        var brsmMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.collections.BRSMultiApproval"];
        if (brsmMenu) {
            LoanCollection.findDepositSummaries({
                    'currentStage':"BRSValidation"
                }).$promise.then(function(response, headerGetter){
                    brsmMenu.data = response.headers['x-total-count'];
                })
        }

        var taqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/shramsarathi.dashboard.loans.individual.collections.TransactionAuthorizationQueue"];
        if (taqMenu) {
            LoanCollection.query({
                    'currentStage':"PartialPayment"
                }).$promise.then(function(response, headerGetter){
                    taqMenu.data = response.headers['x-total-count'];
                })
        }

       
    });

}]);
