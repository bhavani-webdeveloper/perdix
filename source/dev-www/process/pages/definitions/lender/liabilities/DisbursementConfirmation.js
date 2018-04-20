define(['perdix/domain/model/lender/LoanBooking/LiabilityLoanAccountBookingProcess', 'perdix/infra/api/AngularResourceService'], function (LiabilityLoanAccountBookingProcess, AngularResourceService) {
    LiabilityLoanAccountBookingProcess = LiabilityLoanAccountBookingProcess['LiabilityLoanAccountBookingProcess'];
    return {
        pageUID: "lender.liabilities.DisbursementConfirmation",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator", "Utils", "Files", "IndividualLoan"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                           PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator, Utils, Files, IndividualLoan) {

            var configFile = function () {
                return {
                }
            }
            var overridesFields = function (bundlePageObj) {
                return {
                    "DisbursementConfirmation": {
                        "orderNo": 10
                    },
                    "DisbursementConfirmation.disbursementDate": {
                        "required": true 
                    },
                    "DisbursementConfirmation.modeOfDisbursement": {
                        "required": true 
                    },
                    "DisbursementConfirmation.referenceNumber": {
                        "required": true 
                    }

                }
            }
            var getIncludes = function (model) {

                return [
                    "DisbursementConfirmation",
                    "DisbursementConfirmation.disbursementDate",
                    "DisbursementConfirmation.modeOfDisbursement",
                    "DisbursementConfirmation.referenceNumber"
                ];

            }

            return {
                "type": "schema-form",
                "title": "DISBURSEMENT_CONFIRMATION",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    if(_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId) ) {
                        PageHelper.showLoader();
                        LiabilityLoanAccountBookingProcess.get($stateParams.pageId)
                            .subscribe(function(res){
                                PageHelper.hideLoader();
                                if(res.liabilityAccount.currentStage != "DisbursementConfirmation") {
                                   irfNavigator.goBack();
                                }
                                model.LiabilityLoanAccountBookingProcess = res; 
                                model.liabilityAccount = res.liabilityAccount;
                            });
                    } else {
                        irfNavigator.goBack();
                    }

                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {  
                            },
                            "additions": [
                                {
                                    "type": "actionbox",
                                    "orderNo": 10000,
                                    "items": [
                                        {
                                            "type": "button",
                                            "title": "UPDATE",
                                            "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                        }
                                    ]
                                }
                            ]
                        }
                    };
                // var p1 = UIRepository.getLenderLiabilitiesLoanAccountBookingProcess().$promise;
                //     p1.then(function(repo){
                //         self.form = IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model);
                //     });

                      UIRepository.getLenderLiabilitiesLoanAccountBookingProcess().$promise
                        .then(function(repo){
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function(form){
                            self.form = form;
                            console.log("INSIDE HERE 111");
                        });
                    /* Form rendering ends */
                },

                preDestroy: function (model, form, formCtrl, bundlePageObj, bundleModel) {

                },
                eventListeners: {
                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                },
                form: [],
                schema: function () {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    proceed: function (model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("loan", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }

                        PageHelper.showLoader();
                        model.LiabilityLoanAccountBookingProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                PageHelper.showProgress('loan', 'Disbursement Confirmed', 5000);
                                PageHelper.clearErrors();
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showProgress('loan', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    }
                }
            };
        }
    }
})
