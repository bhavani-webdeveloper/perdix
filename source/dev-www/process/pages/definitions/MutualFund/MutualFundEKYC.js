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

            /* if (!data.aadhaarNo) {
                PageHelper.setError({
                    "message": "Customer does not have aadhar number. eKYC is not possible"
                });
                irfNavigator.goBack();
                return;
            } */
            var kyc_data = [
                data.panNo || "PANEXEMPT",
                data.email || '',
                data.mobilePhone || '',
                'KGFS', // APP_ID
                'UECH_IFMR', // USER_ID
                'IF@mr123', // PASSWORD
                'P', // INTERMEDIARY_ID
                'MFKYC3', // RETURN_DATA_STRU
                '', // Sess_id
                '' // Devicetype (Mandatory for Biometric)
            ];
            
            document.getElementById("ekyctype").value = 'I';
            document.getElementById("kyc_data").value = kyc_data.join('|');
            document.getElementById("url").value = irf.MANAGEMENT_BASE_URL + '/server-ext/camsResponse.php?customer_id='+$stateParams.pageId+'&url='+irf.CLIENT_URL;
            document.getElementById('ekycForm').action = irf.CAMS_EKYC_INTEG_URL;
            document.getElementById('ekycForm').submit();
        }, function(err) {
            PageHelper.showProgress('EKYC', 'EKYC login failed.', 5000);
            PageHelper.showErrors(err);
        }).finally(PageHelper.hideLoader);
    }
]);