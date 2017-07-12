irf.pageCollection.factory("Pages__EDF",
 ["$log", "formHelper", "Enrollment","elementsUtils", "entityManager", '$state', '$stateParams', '$q', 'LoanAccount', 'LoanProcess', 'irfProgressMessage', 'PageHelper',
    'SessionStore', 'Utils', 'authService', 'BiometricService', 'Files',
    function($log, formHelper, Enrollment,elementsUtils, entityManager, $state, $stateParams, $q, LoanAccount, LoanProcess, irfProgressMessage, PageHelper,
        SessionStore, Utils, authService, BiometricService, Files) {
        return {
            "id": "EDF",
            "type": "schema-form",
            "name": "Stage2",
            "title": "EDF",
            "subTitle": "",
            "uri": "Profile/Stage 2",
            initialize: function(model, form, formCtrl) {
                $log.info("I got initialized");
                $log.info($stateParams);

                if (!(model && model.customer && model.customer.id && model.$$STORAGE_KEY$$)) {

                    PageHelper.showLoader();
                    PageHelper.showProgress("page-init", "Loading...");

                    var customerId = $stateParams.pageId;


                    Enrollment.get({
                            id: customerId
                        },
                        function(res) {
                            _.assign(model.customer, res);
                            $log.info(model.customer);
                            model.customer.edf_done_at = model.customer.edf_done_at || Utils.getCurrentDate();
                            model.customer.edf_captured_user_name = model.customer.edf_captured_user_name || SessionStore.getLoginname();
                            if (!model.customer.biometricEnrollment) {
                                model.customer.biometricEnrollment = "PENDING";
                            }
                            model = Utils.removeNulls(model, true);
                            PageHelper.hideLoader();
                            PageHelper.showProgress("page-init", "Done.", 2000);
                        },
                        function(res) {
                            PageHelper.hideLoader();
                            PageHelper.showProgress("page-init", "Error in loading customer.", 2000);
                            PageHelper.showErrors(res);
                        }
                    );
                }
            },
            offline: false,
            getOfflineDisplayItem: function(item, index) {
                return [
                    item["customer"]["urnNo"],
                    item["customer"]["firstName"]
                ]
            },

            form: [

                {
                    "type": "box",
                    "title": "EDF",
                    "items": [{
                            "key": "customer.terms_and_conditions_explained",
                            title: "IS_TERMS_AND_CONDITIONS_EXPLAINED",
                            type: "radios",
                            titleMap: {
                                "YES": "YES",
                                "NO": "NO",
                            }
                        }, {
                            type: "fieldset",
                            condition: "model.customer.terms_and_conditions_explained =='YES'",
                            title: "VALIDATE_BIOMETRIC",
                            items: [{
                                key: "customer.isBiometricValidated",
                                required:true,
                                "title": "CHOOSE_A_FINGER_TO_VALIDATE",
                                type: "validatebiometric",
                                category: 'CustomerEnrollment',
                                subCategory: 'FINGERPRINT',
                                helper: formHelper,
                                biometricMap: {
                                    leftThumb: "model.customer.leftHandThumpImageId",
                                    leftIndex: "model.customer.leftHandIndexImageId",
                                    leftMiddle: "model.customer.leftHandMiddleImageId",
                                    leftRing: "model.customer.leftHandRingImageId",
                                    leftLittle: "model.customer.leftHandSmallImageId",
                                    rightThumb: "model.customer.rightHandThumpImageId",
                                    rightIndex: "model.customer.rightHandIndexImageId",
                                    rightMiddle: "model.customer.rightHandMiddleImageId",
                                    rightRing: "model.customer.rightHandRingImageId",
                                    rightLittle: "model.customer.rightHandSmallImageId"
                                },
                                viewParams: function(modelValue, form, model) {
                                    return {
                                        customerId: model.customer.id
                                    };
                                },
                            }, {
                                "key": "customer.biometricEnrollment",
                                readonly:true,
                                condition:"model.customer.biometricEnrollment == 'AUTHENTICATED'",
                                title: "BIOMETRIC_AUTHENTICATION",
                                type: "select",
                                titleMap: {
                                    "NOT-ENABLE": "NOT-ENABLE",
                                    "PENDING": "PENDING",
                                    "AUTHENTICATED": "AUTHENTICATED"
                                }
                            }, ]
                        },

                    ]
                },

                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Submit"
                    }]
                }

            ],
            schema: function() {
                return Enrollment.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {
                
                    /*if (model.customer.isBiometricValidated || model.customer.isBiometricValidated != true) {
                        elementsUtils.alert('Fingerprint not verified.');
                        return;
                    }*/

                    if (model.customer.isBiometricValidated != true) {
                        elementsUtils.alert('Fingerprint not verified.');
                        return;  
                    }

                    if(model.customer.isBiometricValidated == true)
                    {
                      model.customer.biometricEnrollment =  "AUTHENTICATED";
                    }
                    
                    $log.info("Inside submit()");
                    $log.info(model);
                    var reqData = _.cloneDeep(model);
                    Utils.removeNulls(reqData,true);
                    $log.info(reqData);
                    reqData['enrollmentAction'] = 'SAVE';
                    Enrollment.updateEnrollment(reqData,
                        function(res, headers){
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('enrollment-submit', 'Done. Customer URN Updated : ' + res.customer.urnNo, 5000);
                            $log.info("Inside EDF  Success!");
                            $state.go("Page.Landing");
                        },
                        function(res, headers){
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('enrollment-submit', 'Oops. Some error.', 2000);
                            PageHelper.showErrors(res);
                        })
                    $log.info(reqData);
                }
            }
        }
    }
]);