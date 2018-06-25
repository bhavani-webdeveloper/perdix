irf.pageCollection.controller(irf.controller("MutualFund.MutualFundEKYC"), ["$log", "Enrollment", "$q", "Utils", "$stateParams", "$scope", "PagesDefinition", "PageHelper", "irfNavigator", "Audit", "formHelper", "SessionStore", "elementsUtils",
    function($log, Enrollment, $q, Utils, $stateParams, $scope, PagesDefinition, PageHelper, irfNavigator, Audit, formHelper, SessionStore, elementsUtils) {
        $scope.$templateUrl = "process/pages/templates/mutualFund/MutualFundEKYC.html";


        
        Enrollment.getCustomerById ({
            id: $stateParams.pageId
        }).then(function(data) {
            irfProgressMessage.clear();
            $scope.ekycdashboard = 
            PageHelper.hideLoader();
        }, function(err) {
            irfProgressMessage.clear();
            PageHelper.hideLoader();
            PageHelper.showProgress('EKYC', 'EKYC login failed.', 5000);
            PageHelper.showErrors(err);
        });


    }
]);