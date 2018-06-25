irf.pageCollection.controller(irf.controller("MutualFund.MutualFundEKYC"), ["$log", "$q", "Utils", "$stateParams", "$scope", "PagesDefinition", "PageHelper", "irfNavigator", "Audit", "formHelper", "SessionStore", "elementsUtils",
    function($log, $q, Utils, $stateParams, $scope, PagesDefinition, PageHelper, irfNavigator, Audit, formHelper, SessionStore, elementsUtils) {
        $scope.$templateUrl = "process/pages/templates/mutualFund/MutualFundEKYC.html";
        
        var ekycForm = function() {

        }

        Enrollment.getCustomerById({
            id: $stateParams.pageId
        }).$promise.then(ekycForm, PageHelper.showErrors).finally(PageHelper.hideLoader);
    }
]);