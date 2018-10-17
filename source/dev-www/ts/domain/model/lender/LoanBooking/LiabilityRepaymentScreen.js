

define(['perdix/domain/model/lender/LoanBooking/LiabilityRepayment', 'perdix/infra/api/AngularResourceService'], function (LiabilityRepayment, AngularResourceService) {
    LiabilityRepayment = LiabilityRepayment['LiabilityRepayment'];
    return {
        pageUID: "lender.liabilities.LiabilityRepaymentScreen",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                           PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator) {

            var configFile = function () {
                return {
                }
            }
            var overridesFields = function (bundlePageObj) {
                return {
                    "LiabilityRepayment": {
                        "orderNo": 10
                    },
                   
                    
                }
            }
            var getIncludes = function (model) {

                return [
                    "LiabilityRepayment",
                    "LiabilityRepayment.transactionType",
                    "LiabilityRepayment.totalAmountPaid",
                    "LiabilityRepayment.instrumentType",
                    "LiabilityRepayment.chequeNumber",
                    "LiabilityRepayment.chequeDate",
                    "LiabilityRepayment.referencenumber",
                    "LiabilityRepayment.transactionDate"

                ];

            }

            return {
                "type": "schema-form",
                "title": "LIABILITY_REPAYMENT",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "additions": [
                                {
                                    //"condition": "!model.liabilityAccount.id",
                                    "type": "actionbox",
                                    "orderNo": 10000,
                                    "items": [
                                        {
                                            "type": "button",
                                            "title": "SAVE",
                                            "onClick": "actions.save(model, formCtrl, form, $event)"
                                        }
                                    ]
                                },
                            ]
                        }
                    };
                    var p1 = UIRepository.getLiabilityRepayment().$promise;
                    p1.then(function(repo){
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, configFile(), model);
                    });

                     LiabilityRepayment.createNewProcess()
                            .subscribe(function(res) {
                                model.LiabilityRepayment = res; 
                                model.liabilityRepayment = res.liabilityRepayment;
                                console.log("liabilities account");
                                console.log(model);
                            });

                    // if(_.hasIn($stateParams, 'pageId')) {
                    //     LiabilityLoanAccountBookingProcess.get($stateParams.pageId)
                    //         .subscribe(function(res){
                    //             if(res.liabilityAccount.currentStage != "LiabilityAccount") {
                    //                 irfNavigator.goBack();
                    //             }
                    //             model.LiabilityLoanAccountBookingProcess = res; 
                    //             model.liabilityAccount = res.liabilityAccount;
                    //         });
                    // } else {
                    //     LiabilityLoanAccountBookingProcess.createNewProcess()
                    //         .subscribe(function(res) {
                    //             model.LiabilityLoanAccountBookingProcess = res; 
                    //             model.liabilityAccount = res.liabilityAccount;
                    //             console.log("liabilities account");
                    //             console.log(model);
                    //         });
                    // }
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
                    save: function (model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("loan", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }

                        model.LiabilityRepayment.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                PageHelper.showProgress('Repayment', 'Repayment Saved.', 5000);
                                PageHelper.clearErrors();
                            }, function (err) {
                                PageHelper.showProgress('loan', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                                irfNavigator.go({
                                    state: 'Page.Adhoc',
                                    pageName: "lender.liabilities.LoanBookingDashboard"
                                });
                            });
                    },
                    // proceed: function (model, formCtrl, form, $event) {
                    //     PageHelper.clearErrors();
                    //     if(PageHelper.isFormInvalid(formCtrl)) {
                    //         return false;
                    //     }
                    //     formCtrl.scope.$broadcast('schemaFormValidate');

                    //     if (formCtrl && formCtrl.$invalid) {
                    //         PageHelper.showProgress("loan", "Your form have errors. Please fix them.", 5000);
                    //         return false;
                    //     }

                    //     model.LiabilityLoanAccountBookingProcess.proceed()
                    //         .finally(function () {
                    //             PageHelper.hideLoader();
                    //         })
                    //         .subscribe(function (value) {
                    //             PageHelper.showProgress('loan', 'Loan Proceed.', 5000);
                    //             PageHelper.clearErrors();
                    //             irfNavigator.go({
                    //                 state: 'Page.Adhoc',
                    //                 pageName: "lender.liabilities.LoanBookingDashboard"
                    //             });
                    //         }, function (err) {
                    //             PageHelper.showProgress('loan', 'Oops. Some error.', 5000);
                    //             PageHelper.showErrors(err);
                    //             PageHelper.hideLoader();
                    //         });
                    // }
                }
            };
        }
    }
})
