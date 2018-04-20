define(['perdix/domain/model/lender/LoanBooking/LiabilityLoanAccountBookingProcess', 'perdix/domain/model/lender/LoanBooking/LiabilityRepayment', 'perdix/infra/api/AngularResourceService'], function(LiabilityLoanAccountBookingProcess, LiabilityRepayment, AngularResourceService) {
    LiabilityLoanAccountBookingProcess = LiabilityLoanAccountBookingProcess['LiabilityLoanAccountBookingProcess'];
    LiabilityRepayment = LiabilityRepayment['LiabilityRepayment'];
    return {
        pageUID: "lender.liabilities.LiabilityRepaymentScreen",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator", "Schedule"
        ],
        $pageFn: function($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
            PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator, Schedule) {
            var branch = SessionStore.getBranch();
            var userLoginDate = SessionStore.getCBSDate();
            var configFile = function() {
                return {}
            }
            var overridesFields = function(bundlePageObj) {
                return {
                    "LiabilityRepayment": {
                        "orderNo": 240
                    },
                    "LiabilityRepayment.principalPaid": {
                        "required": true,
                    },
                    "LiabilityRepayment.interestPaid": {
                        "required": true,
                    },
                    "LiabilityRepayment.penalityPaid": {
                        "required": true,
                    },
                    "LiabilityRepayment.otherFeeChargesPaid": {
                        "required": true,
                    },
                    "LiabilityRepayment.totalInstallmentAmountPaid": {
                        "required": true,
                    },
                    "LiabilityRepayment.referencenumber": {
                        "required": true,
                    },
                    "LiabilityRepayment.chequeDate": {
                        "required": true,
                    },
               
                    "LiabilityRepayment.transactionType": {
                        onChange: function(modelValue, form, model) {
                            model.preClosureCharge = false;
                            if (modelValue == 'PreClosure') {
                                model.preClosureCharge = true;
                                model.liabilityClosureRepay.transactionType = modelValue
                                model.liabilityRepay = model.liabilityClosureRepay
                                model.liabilityRepay.lenderAccountNumber = model.lenderAccountNumber
                                model.liabilityRepay.transactionDate = userLoginDate;
                            } else {
                                model.liabilityScheduleRepay.transactionType = modelValue
                                model.liabilityRepay = model.liabilityScheduleRepay;
                            }
                        }
                    },
                    "LiabilityRepayment.instrumentType": {
                        onChange: function(modelValue, form, model) {
                            model.instrTypeCheque = false;
                            model.instrTypeNEFT = false;
                            switch (modelValue) {
                                case 'Cheque':
                                    model.instrTypeCheque = true;
                                    break;
                                case 'NEFT':
                                     model.instrTypeNEFT = true;
                                    break;
                                case 'Cash':
                                    //day = "Tuesday";
                                    break;
                                case 'RTGS':
                                    model.instrTypeRTGS = true;
                                    break;
                                case 'ACH':
                                    model.instrTypeACH = true;
                                    break;
                                case 'PDC':
                                    model.instrTypePDC = true;
                                    break;
                                case 'Internal':
                                    model.instrTypeInternal = true;
                                    break
                            }
                        }
                    },
                    "LiabilityRepayment.preClosureCharges": {
                        "condition": "model.preClosureCharge"
                    },
                    "LiabilityRepayment.chequeNumber": {
                        "condition": "model.instrTypeCheque",
                        "type": "number",
                        "maxLength": 6,
                        "minLength": 6
                    },
                    "LiabilityRepayment.chequeDate": {
                        "condition": "model.instrTypeCheque"
                    },
                    "LiabilityRepayment.referencenumber": {
                        "condition": "model.instrTypeNEFT"
                    },
                    "LiabilityRepayment.preClosureCharges": {
                        "condition": "model.preClosureCharge"
                    }
                }
            }
            var getIncludes = function(model) {
                return [
                    "LiabilityDue",
                    "LiabilityDue.installmentDueDate",
                    "LiabilityDue.principalDue",
                    "LiabilityDue.interestDue",
                    "LiabilityDue.penalityDue",
                    "LiabilityDue.otherFeeChargesDue",
                    "LiabilityDue.totalInstallmentAmountDue",
                    "LiabilityPreClosure",
                    "LiabilityPreClosure.installmentDueDate",
                    "LiabilityPreClosure.principalDue",
                    "LiabilityPreClosure.interestDue",
                    "LiabilityPreClosure.penalityDue",
                    "LiabilityPreClosure.otherFeeChargesDue",
                    "LiabilityPreClosure.totalInstallmentAmountDue",
                    "LiabilityRepayment",
                    "LiabilityRepayment.transactionType",
                    "LiabilityRepayment.principalPaid",
                    "LiabilityRepayment.interestPaid",
                    "LiabilityRepayment.penalityPaid",
                    "LiabilityRepayment.otherFeeChargesPaid",
                    "LiabilityRepayment.totalInstallmentAmountPaid",
                    "LiabilityRepayment.instrumentType",
                    "LiabilityRepayment.transactionDate",
                    "LiabilityRepayment.referencenumber",
                    "LiabilityRepayment.chequeNumber",
                    "LiabilityRepayment.chequeDate",
                    "LiabilityRepayment.preClosureCharges",
                    "LiabilityRepayment.collectionRemarks",
                    "LoanAccount",
                    "LoanAccount.loanAccountId",
                    "LoanAccount.lenderName",
                    "LoanAccount.lenderId",
                    "LoanAccount.productType"
                ];
            }

            return {
                "type": "schema-form",
                "title": "LIABILITY_REPAYMENT",
                "subTitle": "",
                
                initialize: function(model, form, formCtrl) {
                    var self = this;
                   // var userLoginDate = SessionStore.getCBSDate();
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {
                                "LoanAccount": {
                                    "type": "box",
                                    "title": "LOAN_ACCOUNT_DETAILS",
                                    "orderNo": 220,
                                    "items": {
                                        "loanAccountId": {
                                            "key": "LoanAccount.lenderAccountNumber",
                                            "title": "LENDER_ACCOUNT_NUMBER",
                                            "type": "string",
                                            "readonly": true
                                        },
                                        "lenderName": {
                                            "key": "LoanAccount.lenderName",
                                            "title": "LENDER_NAME",
                                            "type": "string",
                                            // "enumCode":"----"
                                            "readonly": true
                                        },
                                        "lenderId": {
                                            "key": "LoanAccount.lenderId",
                                            "title": "LENDER_ID",
                                            "type": "string",
                                            // "enumCode":"----"
                                            "readonly": true
                                        },
                                        "productType": {
                                            "key": "LoanAccount.productType",
                                            "title": "PRODUCT_TYPE",
                                            "type": "string",
                                            //"enumCode":"----"
                                            "readonly": true
                                        }
                                    }
                                },
                                "LiabilityDue": {
                                    "type": "box",
                                    "condition": "model.liabilityRepay.transactionType!='PreClosure'",
                                    "orderNo": 230,
                                    "title": "LIABILITY_SCHEDULE_DUE",
                                    "items": {
                                        "installmentDueDate":{
                                            "key":"liabilityRepay.installmentDueDate",
                                            "title":"INSTALLMENT_DATE",
                                            "type":"date",
                                            "readonly": true
                                        },
                                        "principalDue": {
                                            "key": "liabilityRepay.principalDue",
                                            "type": "number",
                                            "title": "PRINCIPAL_DUE",
                                            "readonly": true
                                        },
                                        "interestDue": {
                                            "key": "liabilityRepay.interestDue",
                                            "type": "number",
                                            "title": "INTEREST_DUE",
                                            "readonly": true
                                        },
                                        "penalityDue": {
                                            "key": "liabilityRepay.penalityDue",
                                            "type": "number",
                                            "title": "PENALITY_DUE",
                                            "readonly": true
                                        },
                                        "otherFeeChargesDue": {
                                            "key": "liabilityRepay.otherFeeChargesDue",
                                            "type": "number",
                                            "title": "OTHER_FEE_CHARGES_DUE",
                                            "readonly": true
                                        },
                                        "totalInstallmentAmountDue": {
                                            "key": "liabilityRepay.totalInstallmentAmountDue",
                                            "type": "number",
                                            "title": "TOTAL_INSTALLMENT_AMOUNT_DUE",
                                            "readonly": true
                                        }
                                    }
                                },
                                "LiabilityPreClosure": {
                                    "type": "box",
                                    "condition": "model.liabilityRepay.transactionType=='PreClosure'",
                                    "orderNo": 230,
                                    "title": "LIABILITY_PRECLOSURE_DUE",
                                    "items": {
                                         "installmentDueDate":{
                                            "key":"liabilityRepay.installmentDueDate",
                                            "title":"INSTALLMENT_DATE",
                                            "type":"date",
                                            "readonly": true
                                        },
                                        "principalDue": {
                                            "key": "liabilityRepay.principalDue",
                                            "type": "number",
                                            "title": "PRINCIPAL_DUE",
                                            "readonly": true
                                        },
                                        "interestDue": {
                                            "key": "liabilityRepay.interestDue",
                                            "type": "number",
                                            "title": "INTEREST_DUE",
                                            "readonly": true
                                        },
                                        "penalityDue": {
                                            "key": "liabilityRepay.penalityDue",
                                            "type": "number",
                                            "title": "PENALITY_DUE",
                                            "readonly": true
                                        },
                                        "otherFeeChargesDue": {
                                            "key": "liabilityRepay.otherFeeChargesDue",
                                            "type": "number",
                                            "title": "OTHER_FEE_CHARGES_DUE",
                                            "readonly": true
                                        },
                                        "totalInstallmentAmountDue": {
                                            "key": "liabilityRepay.totalInstallmentAmountDue",
                                            "type": "number",
                                            "title": "TOTAL_INSTALLMENT_AMOUNT_DUE",
                                            "readonly": true
                                        }
                                    }
                                }

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
                    // var p1 = UIRepository.getLiabilityRepayment().$promise;
                    // p1.then(function(repo) {
                    //     self.form = IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model);
                    // });
                    UIRepository.getLiabilityRepayment().$promise
                        .then(function(repo){
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function(form){
                            self.form = form;
                            console.log("INSIDE HERE 111");
                        });
                    
                    LiabilityRepayment.createNewProcess()
                        .subscribe(function(res) {
                            model.LiabilityRepayment = res;
                            model.liabilityRepay = res.liabilityRepay;
                            console.log("liabilities account");
                            console.log(model);
                        });

                    if (_.hasIn($stateParams, 'pageId')) {
                        PageHelper.showLoader();
                        LiabilityLoanAccountBookingProcess.get($stateParams.pageId)
                            .subscribe(function(res) {
                                model.LoanAccount = res.liabilityAccount;
                                model.LoanAccount.lenderName = res.lenderEnrolmentProcess.customer.firstName;
                                if (res.liabilityAccount.liabilitySchedules.length == 0) {
                                    PageHelper.showProgress("schedule", "No schedule found.", 5000);
                                    PageHelper.hideLoader();
                                    return irfNavigator.goBack();
                                } else {
                                    var scheduleDetails = res.liabilityAccount.liabilitySchedules;
                                    PageHelper.hideLoader();
                                    var liabilityRepayCal;
                                    scheduleDetails.sort(function compare(a, b) {
                                        var dateA = new Date(a.installmentDueDate);
                                        var dateB = new Date(b.installmentDueDate);
                                        return dateA - dateB;
                                    });
                                    model.count = 0
                                    for (i in scheduleDetails) {
                                        var status = scheduleDetails[i].paidStatus;
                                        if (status == "NotPaid") {
                                            this.liabilityRepayCal = scheduleDetails[i]
                                            break;
                                        } else if (status == "PartiallyPaid") {
                                            this.liabilityRepayCal = scheduleDetails[i]
                                            break;
                                        }
                                         else if(scheduleDetails[i].paidStatus == "FullyPaid"){
                                            model.count = model.count +1;
                                        }
                                    }
                                    if (res.liabilityAccount.liabilitySchedules.length == model.count) {
                                    PageHelper.showProgress("schedule", "Schedule is fully paid.", 5000);
                                    PageHelper.hideLoader();
                                    return irfNavigator.goBack();
                                }
                                    if (this.liabilityRepayCal && this.liabilityRepayCal.paidStatus == "PartiallyPaid") {
                                        this.liabilityRepayCal.principalDue = (this.liabilityRepayCal.principalPaid != null) ? this.liabilityRepayCal.principalDue - this.liabilityRepayCal.principalPaid : this.liabilityRepayCal.principalDue;
                                        this.liabilityRepayCal.interestDue = (this.liabilityRepayCal.interestPaid != null) ? this.liabilityRepayCal.interestDue - this.liabilityRepayCal.interestPaid : this.liabilityRepayCal.interestDue;
                                        this.liabilityRepayCal.otherFeeChargesDue = (this.liabilityRepayCal.otherFeeChargesPaid != null) ? this.liabilityRepayCal.otherFeeChargesDue - this.liabilityRepayCal.otherFeeChargesPaid : this.liabilityRepayCal.otherFeeChargesDue;
                                        this.liabilityRepayCal.penalityDue = (this.liabilityRepayCal.penalityPaid != null) ? this.liabilityRepayCal.penalityDue - this.liabilityRepayCal.penalityPaid : this.liabilityRepayCal.penalityDue;
                                        this.liabilityRepayCal.totalInstallmentAmountDue = this.liabilityRepayCal.principalDue + this.liabilityRepayCal.interestDue + this.liabilityRepayCal.otherFeeChargesDue + this.liabilityRepayCal.penalityDue
                                        this.liabilityRepayCal.principalPaid = null;
                                        this.liabilityRepayCal.interestPaid = null;
                                        this.liabilityRepayCal.otherFeeChargesPaid = null;
                                        this.liabilityRepayCal.penalityPaid = null
                                        this.liabilityRepayCal.totalAmountPaid = null
                                    } else if (this.liabilityRepayCal && this.liabilityRepayCal.paidStatus == "NotPaid") {
                                        this.liabilityRepayCal.totalInstallmentAmountDue = this.liabilityRepayCal.principalDue + this.liabilityRepayCal.interestDue + this.liabilityRepayCal.otherFeeChargesDue + this.liabilityRepayCal.penalityDue
                                    }else if(!this.liabilityRepayCal){
                                        model.fullypaid = true;
                                    }


                                    var liabilityClosureRepay = {
                                        "principalDue": 0,
                                        "penalityDue": 0,
                                        "interestDue": 0,
                                        "otherFeeChargesDue": 0,
                                        "totalInstallmentAmountDue": 0,
                                        "transactionType": null,
                                        "installmentDueDate":null
                                    }
                                    for (i in scheduleDetails) {
                                        if (scheduleDetails[i] != null && scheduleDetails[i].paidStatus == "NotPaid") {
                                            console.log(liabilityClosureRepay)
                                            liabilityClosureRepay.principalDue = liabilityClosureRepay.principalDue + scheduleDetails[i].principalDue;
                                            var dateA = new Date(scheduleDetails[i].installmentDueDate);
                                            var dateB = new Date();
                                            if (dateA < dateB) {
                                                liabilityClosureRepay.interestDue = liabilityClosureRepay.interestDue + scheduleDetails[i].interestDue;
                                                liabilityClosureRepay.otherFeeChargesDue = liabilityClosureRepay.otherFeeChargesDue + scheduleDetails[i].otherFeeChargesDue;
                                                liabilityClosureRepay.penalityDue = liabilityClosureRepay.penalityDue + scheduleDetails[i].penalityDue;
                                                liabilityClosureRepay.installmentDueDate = scheduleDetails[i].installmentDueDate
                                            }
                                            liabilityClosureRepay.totalInstallmentAmountDue = liabilityClosureRepay.principalDue + liabilityClosureRepay.interestDue + liabilityClosureRepay.otherFeeChargesDue + liabilityClosureRepay.penalityDue;
                                        } else if (scheduleDetails[i] != null && scheduleDetails[i].paidStatus == "PartiallyPaid") {
                                            liabilityClosureRepay.principalDue = (scheduleDetails[i].principalPaid != null) ? scheduleDetails[i].principalDue - scheduleDetails[i].principalPaid : scheduleDetails[i].principalDue;
                                            liabilityClosureRepay.interestDue = (scheduleDetails[i].interestPaid != null) ? scheduleDetails[i].interestDue - scheduleDetails[i].interestPaid : scheduleDetails[i].interestDue;
                                            liabilityClosureRepay.otherFeeChargesDue = (scheduleDetails[i].otherFeeChargesPaid != null) ? scheduleDetails[i].otherFeeChargesDue - scheduleDetails[i].otherFeeChargesPaid : scheduleDetails[i].otherFeeChargesDue;
                                            liabilityClosureRepay.penalityDue = (scheduleDetails[i].penalityPaid != null) ? scheduleDetails[i].penalityDue - scheduleDetails[i].penalityPaid : scheduleDetails[i].penalityDue;
                                            var dateA = new Date(scheduleDetails[i].installmentDueDate);
                                            var dateB = new Date();
                                            if (dateA < dateB) {
                                                liabilityClosureRepay.interestDue = liabilityClosureRepay.interestDue + scheduleDetails[i].interestDue;
                                                liabilityClosureRepay.otherFeeChargesDue = liabilityClosureRepay.otherFeeChargesDue + scheduleDetails[i].otherFeeChargesDue;
                                                liabilityClosureRepay.penalityDue = liabilityClosureRepay.penalityDue + scheduleDetails[i].penalityDue;
                                                liabilityClosureRepay.installmentDueDate = scheduleDetails[i].installmentDueDate
                                                liabilityClosureRepay.totalInstallmentAmountDue = liabilityClosureRepay.totalInstallmentAmountDue + scheduleDetails[i];
                                            }
                                        }
                                    }

                                    // model.liabilityClosureRepay.transactionType = null;
                                    model.liabilityClosureRepay = liabilityClosureRepay;
                                    model.lenderAccountNumber = this.liabilityRepayCal.lenderAccountNumber
                                    model.liabilityScheduleRepay = this.liabilityRepayCal
                                    model.liabilityRepay = this.liabilityRepayCal;
                                    if(this.liabilityRepayCal){
                                    model.liabilityRepay.liabilityRepaymentScheduleDetailsId = this.liabilityRepayCal.id;
                                    model.liabilityRepay.transactionDate = userLoginDate;

                                };
                                                                    }
                            });
                    }
                    /* Form rendering ends */
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
                        var totalAmountPaid = model.liabilityRepay.principalPaid + model.liabilityRepay.interestPaid + model.liabilityRepay.penalityPaid + model.liabilityRepay.otherFeeChargesPaid
                        if (model.liabilityRepay.totalInstallmentAmountPaid == totalAmountPaid) {
                                PageHelper.showLoader();
                                model.LiabilityRepayment.liabilityRepay = model.liabilityRepay;
                                model.LiabilityRepayment.save()
                                    .finally(function() {
                                        PageHelper.hideLoader();
                                    })
                                    .subscribe(function(value) {
                                        PageHelper.showProgress('Repayment', 'Repayment Saved.', 5000);
                                        irfNavigator.goBack();
                                        PageHelper.clearErrors();
                                        irfNavigator.goBack();
                                    }, function(err) {
                                        $log.info(err.data.error);
                                        $log.info("err");
                                        PageHelper.showProgress('loan', err.data.error, 50000);
                                        PageHelper.showErrors({
                                            'message': err
                                        });
                                        //PageHelper.showErrors(err.data.error);
                                        PageHelper.hideLoader();
                                    });
                            }
                        else {
                            PageHelper.showErrors({
                                data: {
                                    error: "TotalInstallmentAmountPaid is Incorrect"
                                }
                            });
                        }
                    }
                }
            };
        }
    }
})