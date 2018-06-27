irf.pageCollection.controller(irf.controller("MutualFund.MutualFundEKYC"), ["$log", "irfProgressMessage", "Enrollment", "$q", "Utils", "$stateParams", "$scope", "PagesDefinition", "PageHelper", "irfNavigator", "Audit", "formHelper", "SessionStore", "elementsUtils",
    function($log, irfProgressMessage, Enrollment, $q, Utils, $stateParams, $scope, PagesDefinition, PageHelper, irfNavigator, Audit, formHelper, SessionStore, elementsUtils) {
        // $scope.$templateUrl = "process/pages/templates/mutualFund/MutualFundEKYC.html";

        if (!$stateParams.pageId) {
            irfNavigator.goBack();
        }
        PageHelper.showLoader();
        Enrollment.getCustomerById({
            id: $stateParams.pageId
        }).$promise.then(function(data) {
            $scope.customer = data;

            if (!data.aadhaarNo) {
                PageHelper.setError({
                    "error": "Customer does not have aadhar number. eKYC is not possible"
                });
                return;
            }
            document.getElementById("Aadhar").value = data.aadhaarNo;
            document.getElementById("kyc_data").value = (data.panNo ? data.panNo : "PANEXEMPT") + "|" + data.mobilePhone + "|" + (data.email || '');

            document.getElementById('ekycForm').action = irf.CAMS_EKYC_INTEG_URL;
            document.getElementById('ekycForm').submit();

        }, function(err) {
            PageHelper.showProgress('EKYC', 'EKYC login failed.', 5000);
            PageHelper.showErrors(err);
        }).finally(PageHelper.hideLoader);
    }
]);