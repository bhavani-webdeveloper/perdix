define(['perdix/domain/model/lender/LoanBooking/LiabilityLoanAccountBookingProcess','perdix/domain/model/lender/LoanBooking/LiabilityRepayment'], function(LiabilityLoanAccountBookingProcess, LiabilityRepayment) {
    LiabilityLoanAccountBookingProcess = LiabilityLoanAccountBookingProcess['LiabilityLoanAccountBookingProcess'];
    LiabilityRepayment = LiabilityRepayment['LiabilityRepayment'];
   
    return {
        pageUID: "lender.liabilities.LiabilityPartialRepaymentScreen",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator", "Schedule",
        ],
        $pageFn: function($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
            PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator, Schedule) {
            var branch = SessionStore.getBranch();
           
            var configFile = function() {
                return {}
            }
            var totalAmountPaidSum = function(modelValue, model) {
                var total = 0;
                if (_.isNumber(model.liabilityRepay.principalDue)) {
                    total = total + model.liabilityRepay.principalDue;
                }

                if (_.isNumber(model.liabilityRepay.interestDue)) {
                    total = total + model.liabilityRepay.interestDue;
                }

                if (_.isNumber(model.liabilityRepay.penalityDue)) {
                    total = total + model.liabilityRepay.penalityDue;
                }

                if (_.isNumber(model.liabilityRepay.otherFeeChargesDue)) {
                    total = total + model.liabilityRepay.otherFeeChargesDue;
                }

                model.liabilityRepay.totalInstallmentAmountDue = total;
            }
            var overridesFields = function(bundlePageObj) {
                return {
                    "LoanAccount":{
                        "orderNo":10
                    },
                    "LiabilityDue":{
                        "orderNo":20
                    },
                    "LiabilityPartialDue":{
                        "orderNo": 30
                       // "readonly":true
                    },
                    "LiabilityRepayment":{
                        "orderNo":40,
                        "readonly":true,
                        "title":"REPAYMENT_DEATILS"
                    },
                    "LiabilityPartialDue.principalDue": {
                        "required": true,
                         onChange: function(modelValue, form, model) {
                           totalAmountPaidSum(modelValue,model);
                        }
                    },
                    "LiabilityPartialDue.penalityDue": {
                        "required": true,
                         onChange: function(modelValue, form, model) {
                           totalAmountPaidSum(modelValue,model);
                        }
                    },
                    "LiabilityPartialDue.interestDue": {
                        "required": true,
                         onChange: function(modelValue, form, model) {
                           totalAmountPaidSum(modelValue,model);
                        }
                    },
                    "LiabilityPartialDue.otherFeeChargesDue": {
                        "required": true,
                         onChange: function(modelValue, form, model) {
                           totalAmountPaidSum(modelValue,model);
                        }
                    }
                }
            }
            var getIncludes = function(model) {
                return [
                    "LiabilityDue",
                    "LiabilityDue.principalDue",
                    "LiabilityDue.interestDue",
                    "LiabilityDue.penalityDue",
                    "LiabilityDue.otherFeeChargesDue",
                    "LiabilityDue.totalInstallmentAmountDue",
                    "LiabilityPartialDue",
                    "LiabilityPartialDue.installmentDueDate",
                    "LiabilityPartialDue.principalDue",
                    "LiabilityPartialDue.interestDue",
                    "LiabilityPartialDue.penalityDue",
                    "LiabilityPartialDue.otherFeeChargesDue",
                    "LiabilityPartialDue.totalInstallmentAmountDue",
                    "LiabilityRepayment",
                   // "LiabilityRepayment.principalDue",
                    "LiabilityRepayment.principalPaid",
                    "LiabilityRepayment.interestPaid",
                    "LiabilityRepayment.penalityPaid",
                    "LiabilityRepayment.otherFeeChargesPaid",
                    "LiabilityRepayment.totalAmountPaid",
                    "LoanAccount",
                    "LoanAccount.loanAccountId",
                    "LoanAccount.lenderId",
                    "LoanAccount.productType"
                ];
            }

            return {
                "type": "schema-form",
                "title": "LIABILITY_SCHEDULE_DETAILS",
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
                    if (!_.hasIn($stateParams, 'pageId') || _.isNull($stateParams.pageId) || _.isNull($stateParams.pageData)) {
                        LiabilityRepayment.createNewProcess()
                            .subscribe(function(res) {
                            model.LiabilityRepayment = res;
                            model.liabilityRepay = res.liabilityRepay;
                            });
                        irfNavigator.goBack();
                        PageHelper.showProgress('Repayment',"page shouldn't be refreshed",3000);
                    }
                    else{
                        LiabilityRepayment.createNewProcess()
                            .subscribe(function(res) {
                            model.LiabilityRepayment = res;
                            model.liabilityRepay = res.liabilityRepay;
                            });
                        Schedule.getSchedule({id:$stateParams.pageId})
                            .$promise
                            .then(function(res) {
                                model.liabilityRepay = _.cloneDeep(res);
                                model.repayment = _.cloneDeep(res);
                                
                            },function(err){
                                console.log(err)
                            });
                        var obs = LiabilityLoanAccountBookingProcess.get($stateParams.pageData);
                        pLoadInit = obs.toPromise();
                        obs.subscribe(function(res) {
                            PageHelper.hideLoader();
                          model.loanAccount = res.liabilityAccount
                        })
                    }
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {
                                "LoanAccount": {
                                    "type": "box",
                                    "title": "LOAN_ACCOUNT_DETAILS",
                                    //"orderNo": 220,
                                    "items": {
                                        "loanAccountId": {
                                            "key": "loanAccount.lenderAccountNumber",
                                            "title": "LENDER_ACCOUNT_NUMBER",
                                            "type": "string",
                                            "readonly": true
                                        },
                                        "lenderId": {
                                            "key": "loanAccount.lenderId",
                                            "title": "LENDER_ID",
                                            "type": "string",
                                            // "enumCode":"----"
                                            "readonly": true
                                        }
                                    }
                                },
                                "LiabilityDue": {
                                    "type": "box",
                                    //"orderNo": 235,
                                    "title": "CURRENT_SCHEDULE_DUE",
                                    "items": {
                                        "principalDue": {
                                            "key": "repayment.principalDue",
                                            "type": "number",
                                            "title": "PRINCIPAL_DUE",
                                            "readonly":true
                                        },
                                        "interestDue": {
                                            "key": "repayment.interestDue",
                                            "type": "number",
                                            "title": "INTEREST_DUE",
                                            "readonly":true
                                        },
                                        "penalityDue": {
                                            "key": "repayment.penalityDue",
                                            "type": "number",
                                            "title": "PENALITY_DUE",
                                            "readonly":true
                                        },
                                        "otherFeeChargesDue": {
                                            "key": "repayment.otherFeeChargesDue",
                                            "type": "number",
                                            "title": "OTHER_FEE_CHARGES_DUE",
                                            "readonly":true
                                        },
                                        "totalInstallmentAmountDue": {
                                            "key": "repayment.totalInstallmentAmountDue",
                                            "type": "number",
                                            "title": "TOTAL_INSTALLMENT_AMOUNT_DUE",
                                            "readonly":true
                                        }
                                    }
                                },
                                "LiabilityPartialDue": {
                                    "type": "box",
                                   // "orderNo": 235,
                                    "title": "UPDATED_SCHEDULE_DUE",
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
                                var scheduleInitialdata = model.repayment
                                var scheduleUpdatedDatae = model.liabilityRepay

                                if(scheduleUpdatedDatae.principalDue<scheduleInitialdata.principalDue){
                                    PageHelper.showErrors({'data':{'error':"updated schedule PrincipalDue cant be less than current PrincipalDue"}})
                                    PageHelper.hideLoader();
                                }
                                else if(scheduleUpdatedDatae.interestDue<scheduleInitialdata.interestDue){
                                     PageHelper.showErrors({'data':{'error':"updated schedule InterestDue cant be less than current InterestDue"}})
                                    PageHelper.hideLoader();
                                }
                               else if(scheduleUpdatedDatae.penalityDue<scheduleInitialdata.penalityDue){
                                     PageHelper.showErrors({'data':{'error':"updated schedule PenaltyDue cant be less than current PenaltyDue"}})
                                    PageHelper.hideLoader();
                                }
                                else if(scheduleUpdatedDatae.otherFeeChargesDue<scheduleInitialdata.otherFeeChargesDue){
                                     PageHelper.showErrors({'data':{'error':"updated schedule OtherFeeChargesDue cant be less than current OtherFeeChargesDue"}})
                                    PageHelper.hideLoader();
                                }
                                else{
                                    model.LiabilityRepayment.update()
                                    .finally(function() {
                                        PageHelper.hideLoader();
                                    })
                                    .subscribe(function(value) {
                                        PageHelper.showProgress('Repayment', 'SCHEDULE UPDATED.', 5000);
                                        //irfNavigator.goBack();
                                        PageHelper.clearErrors();
                                        irfNavigator.goBack();
                                    }, function(err) {
                                        $log.info(err.data.error);
                                        $log.info("err");
                                        PageHelper.showProgress('loan', err.data.error, 50000);
                                        PageHelper.showErrors(err);
                                        //PageHelper.showErrors(err.data.error);
                                        PageHelper.hideLoader();
                                    })
                                }
                                
                     }                       
                     
                }
            };
        }
    }
})