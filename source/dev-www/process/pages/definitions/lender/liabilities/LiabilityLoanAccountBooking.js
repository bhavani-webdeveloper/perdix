define(['perdix/domain/model/lender/LoanBooking/LiabilityLoanAccountBookingProcess', 'perdix/infra/api/AngularResourceService'], function(LiabilityLoanAccountBookingProcess, AngularResourceService) {
    LiabilityLoanAccountBookingProcess = LiabilityLoanAccountBookingProcess['LiabilityLoanAccountBookingProcess'];
    return {
        pageUID: "lender.liabilities.LiabilityLoanAccountBooking",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator", "Files"
        ],

        $pageFn: function($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
            PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator, Files) {

            var configFile = function() {
                return {}
            }
            var edit = function(data) {
                console.log(data);
            };

            var overridesFields = function(bundlePageObj) {
                return {
                    "LenderAccountDetails": {
                        "orderNo": 10
                    },
                    "DisbursementDetails": {
                        "orderNo": 20
                    },
                    "LoanAmountDeduction": {
                        "orderNo": 30
                    },
                    "LenderDocumentation": {
                        "orderNo": 40
                    },
                    "LegalCompliance": {
                        "orderNo": 50
                    },
                    "DisbursementConfirmation": {
                        "orderNo": 60
                    },
                    "LiabilitySchedules": {
                        "orderNo": 70
                    },
                    "LiabilityRepayments": {
                        "orderNo": 80
                    },
                    "LenderAccountDetails.lenderId": {
                        // searchHelper: formHelper,
                        "resolver": "LenderIDLOVConfiguration",
                        "orderNo": 90
                    },
                    "LenderAccountDetails.lenderAccountNumber": {
                        "required": true
                    },
                    "DisbursementDetails.productType": {
                        "orderNo": 100,
                        "required": true
                    },
                    "DisbursementDetails.loanAmount": {
                        "required": true,
                        "orderNo": 110
                    },
                    "DisbursementDetails.disbursementDate": {
                        "required": true,
                        "orderNo": 120
                    },
                    "DisbursementDetails.interestRateType": {
                        "required": true,
                        "onChange": function(modelValue, form, model) {
                            model.floatingRate = (modelValue == 'Floating Rate') ? true : false;
                        },
                        "orderNo": 130

                    },
                    "DisbursementDetails.rateOfInterest": {
                        "required": true,
                        "orderNo": 140
                    },
                    "DisbursementDetails.markDown": {
                        "condition": "model.floatingRate",
                        "required": true,
                        "orderNo": 150
                    },
                    "DisbursementDetails.markUp": {
                        "condition": "model.floatingRate",
                        "required": true,
                        "orderNo": 160
                    },
                    "DisbursementDetails.interestCalculationMethod": {
                        "required": true,
                        "orderNo": 170
                    },
                    "DisbursementDetails.repaymentTenure": {
                        "required": true,
                        "orderNo": 180
                    },
                    "DisbursementDetails.repaymentFrequency": {
                        "required": true,
                        "orderNo": 190
                    },
                    "DisbursementDetails.repaymentMode": {
                        "required": true,
                        "orderNo": 200
                    },
                    "LoanAmountDeduction.liabilityFeeDetails.feeName": {
                        "required": true
                    },
                    "LoanAmountDeduction.liabilityFeeDetails.feeType": {
                        "required": true
                    },
                    "LoanAmountDeduction.liabilityFeeDetails.feeAmount": {
                        "required": true
                    },
                    "LoanAmountDeduction.totalDeductions": {
                        "required": true
                    },
                    "LoanAmountDeduction.netDisbursementAmount": {
                        "required": true
                    },
                    "LoanAmountDeduction.expectedDisbursementDate": {
                        "required": true
                    },
                    "LoanAmountDeduction.installmentAmount": {

                    },
                    "LoanAmountDeduction.scheduleStartDate": {
                        "required": true
                    },
                    "LoanAmountDeduction.firstInstallmentDate": {
                        "required": true
                    },
                    "LoanAmountDeduction.maturityDate": {
                        "required": true
                    },
                    "LiabilitySchedules.liabilitySchedules": {
                        "type": "tableview",
                        "listStyle": "table",
                        "title": "SCHEDULE_DETAILS",
                        paginate: false,
                        searching: false,
                        getColumns: function() {
                            return [{
                                title: 'LENDER_ACCOUNT_NUMBER',
                                data: 'lenderAccountNumber',
                            }, {
                                title: 'INSTALLMENT_DUE_DATE',
                                data: 'installmentDueDate'
                            }, {
                                title: 'PAID_STATUS',
                                data: 'paidStatus'
                            }, {
                                title: 'PRINCIPAL_DUE',
                                data: 'principalDue'
                            }, {
                                title: 'INTEREST_DUE',
                                data: 'interestDue'
                            }, {
                                title: 'PENALTY_DUE',
                                data: 'penalityDue'
                            }, {
                                title: 'OTHER_FEE_CHARGES_DUE',
                                data: 'otherFeeChargesDue'
                            }, {
                                title: 'TOTAL_INSTALLMENT_AMOUNT_DUE',
                                data: 'totalInstallmentAmountDue'
                            }]
                        },
                        getActions: function(item) {
                            return [{
                                name: "Edit_PARTIAL_PAID",
                                desc: "",
                                fn: function(item, index) {
                                    if (item.paidStatus != "PartiallyPaid") {
                                        PageHelper.showProgress("Repayment", "Only PartiallyPaid are allowed to Schedule Update", 10000);
                                    } else {
                                        $state.go('Page.Engine', {
                                            pageName: 'lender.liabilities.LiabilityPartialRepaymentScreen',
                                            pageData: item
                                        })
                                    }
                                },
                                isApplicable: function(item, index) {
                                    return true;
                                }
                            }];
                        }
                    },
                    "LiabilityRepayments.liabilityRepayments": {

                        "type": "tableview",
                        "listStyle": "table",
                        "title": "REPAYMENT_DETAILS",
                        paginate: false,
                        searching: false,
                        getColumns: function() {
                            return [{
                                title: 'LENDER_ACCOUNT_NUMBER',
                                data: 'lenderAccountNumber',
                            }, {
                                title: 'TRANSACTION_DATE',
                                data: 'transactionDate'
                            }, {
                                title: 'TRANSACTION_TYPE',
                                data: 'transactionType'
                            }, {
                                title: 'PRINCIPAL',
                                data: 'principalPaid'
                            }, {
                                title: 'INTEREST',
                                data: 'interestPaid'
                            }, {
                                title: 'PENALTY',
                                data: 'penalityPaid'
                            }, {
                                title: 'OTHER_FEE_CHARGES',
                                data: 'otherFeeChargesPaid'
                            }, {
                                title: 'PRE_CLOSURE_CHARGES',
                                data: 'preClosureCharges'
                            }, {
                                title: 'TOTAL_INSTALLMENT_AMOUNT',
                                data: 'totalAmountPaid'
                            }]
                        },
                        getActions: function(item) {
                            return [];
                        }
                    }
                }
            }
            var getIncludes = function(model) {

                return [
                    "LenderAccountDetails",
                    "LenderAccountDetails.lenderId",
                    "LenderAccountDetails.lenderAccountNumber",
                    "LenderAccountDetails.sourcingAgent",

                    "DisbursementDetails",
                    "DisbursementDetails.productType",
                    "DisbursementDetails.loanAmount",
                    // "DisbursementDetails.numberOfDisbursement",
                    // "DisbursementDetails.trancheNumber",
                    "DisbursementDetails.disbursementDate",
                    // "DisbursementDetails.trancheCondition",
                    "DisbursementDetails.interestRateType",
                    "DisbursementDetails.rateOfInterest",
                    "DisbursementDetails.markUp",
                    "DisbursementDetails.markDown",
                    "DisbursementDetails.interestCalculationMethod",
                    "DisbursementDetails.repaymentTenure",
                    "DisbursementDetails.repaymentFrequency",
                    "DisbursementDetails.repaymentMode",

                    "LoanAmountDeduction",
                    "LoanAmountDeduction.liabilityFeeDetails",
                    "LoanAmountDeduction.liabilityFeeDetails.processingFeeInPercentage",
                    "LoanAmountDeduction.liabilityFeeDetails.feeName",
                    "LoanAmountDeduction.liabilityFeeDetails.feeType",
                    "LoanAmountDeduction.liabilityFeeDetails.feeAmount",
                    "LoanAmountDeduction.securityAmount",
                    "LoanAmountDeduction.totalDeductions",
                    "LoanAmountDeduction.netDisbursementAmount",
                    "LoanAmountDeduction.expectedDisbursementDate",
                    "LoanAmountDeduction.installmentAmount",
                    "LoanAmountDeduction.scheduleStartDate",
                    "LoanAmountDeduction.firstInstallmentDate",
                    "LoanAmountDeduction.maturityDate",


                    "Document",
                    "Document.liabilityLenderDocuments",
                    "Document.liabilityLenderDocuments.liabilityLenderDocuments",
                    "Document.liabilityLenderDocuments.liabilityLenderDocuments.fileId",
                    "Document.liabilityLenderDocuments.liabilityLenderDocuments.upload",
                    "Document.liabilityComplianceDocuments",
                    "Document.liabilityComplianceDocuments.liabilityComplianceDocuments",
                    "Document.liabilityComplianceDocuments.liabilityComplianceDocuments.fileId",
                    "Document.liabilityComplianceDocuments.liabilityComplianceDocuments.upload ",

                    "LiabilityRepayments",
                    "LiabilityRepayments.liabilityRepayments",
                    "LiabilityRepayments.liabilityRepayments.lenderAccountNumber",
                    "LiabilityRepayments.liabilityRepayments.installmentDate",
                    "LiabilityRepayments.liabilityRepayments.principalPaid",
                    "LiabilityRepayments.liabilityRepayments.interestPaid",
                    "LiabilityRepayments.liabilityRepayments.penalityPaid",
                    "LiabilityRepayments.liabilityRepayments.otherFeeChargespaid",
                    "LiabilityRepayments.liabilityRepayments.totalAmountPaid",

                    "LiabilitySchedules",
                    "LiabilitySchedules.liabilitySchedules",
                    "LiabilitySchedules.liabilitySchedules.lenderAccountNumber",
                    "LiabilitySchedules.liabilitySchedules.installmentDueDate",
                    "LiabilitySchedules.liabilitySchedules.paidStatus",
                    "LiabilitySchedules.liabilitySchedules.principalDue",
                    "LiabilitySchedules.liabilitySchedules.interestDue",
                    "LiabilitySchedules.liabilitySchedules.penalityDue",
                    "LiabilitySchedules.liabilitySchedules.otherFeeChargesDue",
                    "LiabilitySchedules.liabilitySchedules.totalInstallmentAmountDue",


                ]
            }
            return {
                "type": "schema-form",
                "title": "LIABILITY_REGISTRATION",
                "subTitle": "",
                initialize: function(model, form, formCtrl) {
                    var self = this;
                    console.log(model);
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {
                                "Document": {
                                    "type": "box",
                                    "title": "LOAN_DOCUMENTS",
                                    "condition": "model.liabilityAccount.currentStage == 'Completed'",
                                    "orderNo": 40,
                                    "items": {
                                        "liabilityLenderDocuments": {
                                            "type": "fieldset",
                                            "title": "LENDER_DOCUMENTS",
                                            "items": {
                                                "liabilityLenderDocuments": {
                                                    "type": "array",
                                                    "key": "liabilityAccount.liabilityLenderDocuments",
                                                    "add": true,
                                                    "title": "ADD_DOCUMENT",
                                                    "startEmpty": false,
                                                    "remove": null,
                                                    "titleExpr": "model.liabilityAccount.liabilityLenderDocuments[arrayIndex].documentName",
                                                    "items": {
                                                        "fileId": {
                                                            "title": "DOWNLOAD_FORM",
                                                            "notitle": true,
                                                            "fieldHtmlClass": "btn-block",
                                                            "style": "btn-default",
                                                            "icon": "fa fa-download",
                                                            "type": "button",
                                                            "key": "liabilityAccount.liabilityLenderDocuments[].fileId",
                                                            "onClick": function(model, form, schemaForm, event) {
                                                                var fileId = model.liabilityAccount.liabilityLenderDocuments[schemaForm.arrayIndex].fileId;
                                                                Utils.downloadFile(Files.getFileDownloadURL(fileId));
                                                            }
                                                        }
                                                        // },
                                                        // "upload": {
                                                        //     // "key" :"liabilityAccount.liabilityLenderDocuments[].fileId ",
                                                        //     // "title": "ADD_DOCUMENT",
                                                        //     // "notitle": true,
                                                        //     // "fieldHtmlClass": "btn-block",
                                                        //     // "style": "btn-default",
                                                        //     // "fileType": "application/pdf",
                                                        //     // "category": "Loan",
                                                        //     // "subCategory": "DOC1",
                                                        //     // //"icon": "fa fa-download", 
                                                        //     // "type": "file",
                                                        //     "condition":""
                                                        //     "title": "Upload",
                                                        //     "key": "liabilityAccount.liabilityLenderDocuments[].fileId",
                                                        //     "type": "file",
                                                        //     "fileType": "application/pdf",
                                                        //     "category": "Loan",
                                                        //     "subCategory": "DOC1",
                                                        //     "using": "scanner"
                                                        // }
                                                    }
                                                }
                                            }
                                        },
                                        "liabilityComplianceDocuments": {
                                            "type": "fieldset",
                                            "title": "COMPLIANCE_DOCUMENTS",
                                            "items": {
                                                "liabilityComplianceDocuments": {
                                                    "type": "array",
                                                    "key": "liabilityAccount.liabilityComplianceDocuments",
                                                    "add": true,
                                                    "startEmpty": false,
                                                    "remove": null,
                                                    "title": "ADD_DOCUMENT",
                                                    "titleExpr": "model.liabilityAccount.liabilityComplianceDocuments[arrayIndex].documentName",
                                                    "items": {
                                                        "fileId": {
                                                            "title": "DOWNLOAD_FORM",
                                                            "notitle": true,
                                                            "fieldHtmlClass": "btn-block",
                                                            "style": "btn-default",
                                                            "icon": "fa fa-download",
                                                            "type": "button",
                                                            "key": "liabilityAccount.liabilityComplianceDocuments[].fileId",
                                                            "onClick": function(model, form, schemaForm, event) {
                                                                var fileId = model.liabilityAccount.liabilityComplianceDocuments[schemaForm.arrayIndex].fileId;
                                                                Utils.downloadFile(Files.getFileDownloadURL(fileId));
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },

                            },
                            "additions": [{
                                "condition": "!model.liabilityAccount.id",
                                "type": "actionbox",
                                "orderNo": 300000000,
                                "items": [{
                                    "type": "button",
                                    "title": "SUBMIT",
                                    "onClick": "actions.save(model, formCtrl, form, $event)"
                                }]
                            }, {
                                "condition": "model.liabilityAccount.id && model.liabilityAccount.currentStage!='Completed'",
                                "type": "actionbox",
                                "orderNo": 300000000,
                                "items": [{
                                    "type": "button",
                                    "title": "SAVE",
                                    "onClick": "actions.save(model, formCtrl, form, $event)"
                                }, {
                                    "type": "button",
                                    "title": "PROCEED",
                                    "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                }]
                            }, {
                                "condition": "model.liabilityAccount.id && model.liabilityAccount.currentStage=='Completed'",
                                "type": "actionbox",
                                "orderNo": 300000000,
                                "items": [{
                                    "type": "button",
                                    "title": "UPDATE",
                                    "onClick": "actions.update(model, formCtrl, form, $event)"
                                }]
                            }]
                        }
                    };

                    PageHelper.showLoader();
                    var pLoadInit;
                    if (!_.hasIn($stateParams, 'pageId') || _.isNull($stateParams.pageId)) {
                        var obs = LiabilityLoanAccountBookingProcess.createNewProcess();
                        pLoadInit = obs.toPromise();
                        obs.subscribe(function(res) {
                            model.LiabilityLoanAccountBookingProcess = res;
                            model.liabilityAccount = res.liabilityAccount;
                        })
                    } else {
                        var obs = LiabilityLoanAccountBookingProcess.get($stateParams.pageId);
                        pLoadInit = obs.toPromise();
                        obs.subscribe(function(res) {
                            PageHelper.hideLoader();
                            /* if(res.liabilityAccount.currentStage != "LiabilityAccount") {
                                 irfNavigator.goBack();
                             }*/
                            model.LiabilityLoanAccountBookingProcess = res;
                            res.liabilityAccount.liabilityComplianceDocuments.pop();
                            res.liabilityAccount.liabilityLenderDocuments.pop()
                            _.forEach(model.liabilityAccount.liabilitySchedules, function(schedule) {
                                if (schedule.totalInstallmentAmountDue == null) {
                                    schedule.totalInstallmentAmountDue = schedule.principalDue + schedule.penalityDue + schedule.interestDue + schedule.otherFeeChargesDue
                                }
                            });
                            model.liabilityAccount = res.liabilityAccount;
                            console.log(model.liabilityAccount.liabilitySchedules)
                        })

                    }

                    UIRepository.getLenderLiabilitiesLoanAccountBookingProcess().$promise
                        .then(function(repo) {
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function(form) {
                            console.log(form)
                            self.form = form;
                            PageHelper.hideLoader();
                        });



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
                        model.LiabilityLoanAccountBookingProcess.save()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(value) {
                                PageHelper.showProgress('loan', 'Loan Saved.', 5000);
                                PageHelper.clearErrors();
                                if (!model.liabilityAccount.id) {
                                    model.liabilityAccount = value.liabilityAccount;
                                    model.LiabilityLoanAccountBookingProcess.liabilityAccount = value.liabilityAccount;
                                    //irfNavigator.goBack();
                                }
                            }, function(err) {
                                PageHelper.showProgress('loan', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    },
                    proceed: function(model, formCtrl, form, $event) {
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
                        model.LiabilityLoanAccountBookingProcess.proceed()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(value) {
                                PageHelper.showProgress('loan', 'Loan Proceed.', 5000);
                                PageHelper.clearErrors();
                                irfNavigator.goBack();
                            }, function(err) {
                                PageHelper.showProgress('loan', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    },
                    update: function(model, formCtrl, form, $event) {
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
                        model.LiabilityLoanAccountBookingProcess.proceed()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(value) {
                                PageHelper.showProgress('loan', 'Loan Updated.', 5000);
                                PageHelper.clearErrors();
                            }, function(err) {
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