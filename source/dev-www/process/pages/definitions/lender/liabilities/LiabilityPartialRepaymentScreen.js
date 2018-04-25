define(['perdix/domain/model/lender/LoanBooking/LiabilityLoanAccountBookingProcess','perdix/domain/model/lender/LoanBooking/LiabilityRepayment'], function(LiabilityLoanAccountBookingProcess, LiabilityRepayment) {
    LiabilityLoanAccountBookingProcess = LiabilityLoanAccountBookingProcess['LiabilityLoanAccountBookingProcess'];
    LiabilityRepayment = LiabilityRepayment['LiabilityRepayment'];
   
    return {
        pageUID: "lender.liabilities.LiabilityPartialRepaymentScreen",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator", "Schedule"
        ],
        $pageFn: function($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
            PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator, Schedule) {
            var branch = SessionStore.getBranch();
           
            var configFile = function() {
                return {}
            }
            var overridesFields = function(bundlePageObj) {
                return {
                    "LiabilityPartialDue":{
                        "orderNo": 110,
                       // "readonly":true
                    },
                    "LiabilityRepayment": {
                       "orderNo": 500,
                        "readonly":true
                    }
                }
            }
            var getIncludes = function(model) {
                return [
                    "LiabilityPartialDue",
                    "LiabilityPartialDue.installmentDueDate",
                    "LiabilityPartialDue.principalDue",
                    "LiabilityPartialDue.interestDue",
                    "LiabilityPartialDue.penalityDue",
                    "LiabilityPartialDue.otherFeeChargesDue",
                    "LiabilityPartialDue.totalInstallmentAmountDue",
                    "LiabilityRepayment",
                    "LiabilityRepayment.principalPaid",
                    "LiabilityRepayment.interestPaid",
                    "LiabilityRepayment.penalityPaid",
                    "LiabilityRepayment.otherFeeChargesPaid",
                    "LiabilityRepayment.totalAmountPaid",
                   // "LiabilityRepayment.transactionDate",
                    "LiabilityRepayment.preClosureCharges",
                ];
            }

            return {
                "type": "schema-form",
                "title": "LIABILITY_REPAYMENT",
                "subTitle": "",
                
                initialize: function(model, form, formCtrl) {
                    var self = this;
                    UIRepository.getLiabilityRepayment().$promise
                        .then(function(repo) {
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function(form) {
                            self.form = form;
                        });
                    if (_.hasIn($stateParams, 'pageData')) {
                        LiabilityRepayment.createNewProcess()
                            .subscribe(function(res) {
                            model.LiabilityRepayment = res;
                            model.liabilityRepay = res.liabilityRepay;
                            });
                        console.log($stateParams.pageData)
                        model.liabilityRepay = $stateParams.pageData
                       // model.liabilityRepayment = model.liabilityRepay;
                        console.log(model.liabilityRepay)
                    }
                    else{
                        irfNavigator.goBack();
                        PageHelper.showProgress('Repayment','No data found',5000);
                    }
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {
                                "LiabilityPartialDue": {
                                    "type": "box",
                                    "orderNo": 235,
                                    "title": "LIABILITY_PARTIAL_DUE",
                                    "items": {
                                        "installmentDueDate":{
                                            "key":"liabilityRepay.installmentDueDate",
                                            "title":"INSTALLMENT_DATE",
                                            "type":"date",
                                          
                                        },
                                        "principalDue": {
                                            "key": "liabilityRepay.principalDue",
                                            "type": "number",
                                            "title": "PRINCIPAL_DUE",
                                           
                                        },
                                        "interestDue": {
                                            "key": "liabilityRepay.interestDue",
                                            "type": "number",
                                            "title": "INTEREST_DUE",
                                           
                                        },
                                        "penalityDue": {
                                            "key": "liabilityRepay.penalityDue",
                                            "type": "number",
                                            "title": "PENALITY_DUE",
                                            
                                        },
                                        "otherFeeChargesDue": {
                                            "key": "liabilityRepay.otherFeeChargesDue",
                                            "type": "number",
                                            "title": "OTHER_FEE_CHARGES_DUE",
                                            
                                        },
                                        "totalInstallmentAmountDue": {
                                            "key": "liabilityRepay.totalInstallmentAmountDue",
                                            "type": "number",
                                            "title": "TOTAL_INSTALLMENT_AMOUNT_DUE",
                                            
                                        }
                                    }
                                 },
                            },
                            "additions": [{
                                "type": "actionbox",
                                "orderNo": 10000,
                                "items": [{
                                    "type": "button",
                                    "title": "SAVE",
                                    "onClick": "actions.save(model, formCtrl, form, $event)"
                                }]
                            }]
                        }
                    };
                },
                preDestroy: function(model, form, formCtrl, bundlePageObj, bundleModel) {

                },
                eventListeners: {},
                offline: false,
                getOfflineDisplayItem: function(item, index) {},
                form: [],
                schema: function() {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    save: function(model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("loan", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }
        
                                PageHelper.showLoader();
                                model.LiabilityRepayment.liabilityRepay = model.liabilityRepay;
                                model.LiabilityRepayment.update()
                                    .finally(function() {
                                        PageHelper.hideLoader();
                                    })
                                    .subscribe(function(value) {
                                        PageHelper.showProgress('Repayment', 'SCHEDULE UPDATED.', 5000);
                                        //irfNavigator.goBack();
                                        PageHelper.clearErrors();
                                       return irfNavigator.goBack();
                                    }, function(err) {
                                        $log.info(err.data.error);
                                        $log.info("err");
                                        PageHelper.showProgress('loan', err.data.error, 50000);
                                        PageHelper.showErrors({
                                            'message': err
                                        });
                                        //PageHelper.showErrors(err.data.error);
                                        PageHelper.hideLoader();
                                    })
                     }                       
                     
                }
            };
        }
    }
})