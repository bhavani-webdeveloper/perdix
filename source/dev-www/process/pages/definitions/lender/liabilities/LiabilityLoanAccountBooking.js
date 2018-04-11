define(['perdix/domain/model/lender/LoanBooking/LiabilityLoanAccountBookingProcess', 'perdix/infra/api/AngularResourceService'], function (LiabilityLoanAccountBookingProcess, AngularResourceService) {
    LiabilityLoanAccountBookingProcess = LiabilityLoanAccountBookingProcess['LiabilityLoanAccountBookingProcess'];
    return {
        pageUID: "lender.liabilities.LiabilityLoanAccountBooking",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator", "Files"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                           PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator, Files) {

            var configFile = function () {
                return {
                }
            }
            var overridesFields = function (bundlePageObj) {
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
                   "LenderAccountDetails.lenderId": {
                        searchHelper: formHelper,
                        "resolver": "LenderIDLOVConfiguration"
                    },
                    "LenderAccountDetails.lenderAccountNumber": {
                        "required": true
                    },
                    "DisbursementDetails.productType": {
                        "required": true
                    },
                    "DisbursementDetails.loanAmount": {
                        "required": true
                    },
                    "DisbursementDetails.disbursementDate": {
                        "required": true
                    },
                    "DisbursementDetails.interestRateType": {
                        "required": true
                    },
                    "DisbursementDetails.rateOfInterest": {
                        "required": true
                    },
                    "DisbursementDetails.markUpOrDown": {
                        "required": true
                    },
                    "DisbursementDetails.interestCalculationMethod": {
                        "required": true
                    },
                    "DisbursementDetails.repaymentTenure": {
                        "required": true
                    },
                    "DisbursementDetails.repaymentFrequency": {
                        "required": true
                    },
                    "DisbursementDetails.repaymentMode": {
                        "required": true
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
                        "required": true
                    },
                    "LoanAmountDeduction.scheduleStartDate": {
                        "required": true
                    },
                    "LoanAmountDeduction.firstInstallmentDate": {
                        "required": true
                    },
                    "LoanAmountDeduction.maturityDate": {
                        "required": true
                    }/*,
                    "LoanAmountDeduction.loanAccountStatus": {
                        "required": true
                    }*/
                }
            }
            var getIncludes = function (model) {

                return [
                    "LenderAccountDetails",
                    "LenderAccountDetails.lenderId",
                    "LenderAccountDetails.lenderAccountNumber",

                    "DisbursementDetails",
                    "DisbursementDetails.productType",
                    "DisbursementDetails.loanAmount",
                    // "DisbursementDetails.numberOfDisbursement",
                    // "DisbursementDetails.trancheNumber",
                    "DisbursementDetails.disbursementDate",
                    // "DisbursementDetails.trancheCondition",
                    "DisbursementDetails.interestRateType",
                    "DisbursementDetails.rateOfInterest",
                    "DisbursementDetails.markUpOrDown",
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
                    // "LoanAmountDeduction.loanAccountStatus"

                    "Document",
                    "Document.liabilityLenderDocuments",
                    "Document.liabilityLenderDocuments.liabilityLenderDocuments",
                    "Document.liabilityLenderDocuments.liabilityLenderDocuments.fileId",
                    "Document.liabilityComplianceDocuments",
                    "Document.liabilityComplianceDocuments.liabilityComplianceDocuments",
                    "Document.liabilityComplianceDocuments.liabilityComplianceDocuments.fileId"
                ];

            }

            return {
                "type": "schema-form",
                "title": "LIABILITY_REGISTRATION",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {
                                "Document":{
                                    "type": "box",
                                    "title": "LOAN_DOCUMENTS",
                                    "condition": "model.liabilityAccount.currentStage == 'Completed'",
                                    "orderNo": 40,
                                    "items": {
                                        "liabilityLenderDocuments": {
                                            "type":"fieldset",
                                            "title": "LENDER_DOCUMENTS",
                                            "items": {
                                                "liabilityLenderDocuments": {
                                                    "type": "array",
                                                    "key": "liabilityAccount.liabilityLenderDocuments",
                                                    "add": null,
                                                    "startEmpty":false,
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
                                                    }
                                                }
                                            }
                                        },
                                        "liabilityComplianceDocuments": {
                                            "type":"fieldset",
                                            "title": "COMPLIANCE_DOCUMENTS",
                                            "items": {
                                                "liabilityComplianceDocuments": {
                                                    "type": "array",
                                                    "key": "liabilityAccount.liabilityComplianceDocuments",
                                                    "add": null,
                                                    "startEmpty":false,
                                                    "remove": null,
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
                                }
                            },
                            "additions": [
                                {
                                    "condition": "!model.liabilityAccount.id",
                                    "type": "actionbox",
                                    "orderNo": 10000,
                                    "items": [
                                        {
                                            "type": "button",
                                            "title": "SUBMIT",
                                            "onClick": "actions.save(model, formCtrl, form, $event)"
                                        }
                                    ]
                                },
                                {
                                    "condition": "model.liabilityAccount.id && model.liabilityAccount.currentStage!='Completed",
                                    "type": "actionbox",
                                    "orderNo": 10000,
                                    "items": [
                                        {
                                            "type": "button",
                                            "title": "SAVE",
                                            "onClick": "actions.save(model, formCtrl, form, $event)"
                                        },
                                        {
                                            "type": "button",
                                            "title": "PROCEED",
                                            "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                        }
                                    ]
                                },
                                {
                                    "condition": "model.liabilityAccount.id && model.liabilityAccount.currentStage=='Completed'",
                                    "type": "actionbox",
                                    "orderNo": 10000,
                                    "items": [
                                        {
                                            "type": "button",
                                            "title": "UPDATE",
                                            "onClick": "actions.update(model, formCtrl, form, $event)"
                                        }
                                    ]
                                }
                            ]
                        }
                    };
                    var p1 = UIRepository.getLenderLiabilitiesLoanAccountBookingProcess().$promise;
                    p1.then(function(repo){
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, configFile(), model);
                    });

                    if(_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId) ) {
                        PageHelper.showLoader();
                        LiabilityLoanAccountBookingProcess.get($stateParams.pageId)
                            .subscribe(function(res){
                                PageHelper.hideLoader();
                               /* if(res.liabilityAccount.currentStage != "LiabilityAccount") {
                                    irfNavigator.goBack();
                                }*/
                                model.LiabilityLoanAccountBookingProcess = res; 
                                model.liabilityAccount = res.liabilityAccount;
                            });
                    } else {
                        LiabilityLoanAccountBookingProcess.createNewProcess()
                            .subscribe(function(res) {
                                model.LiabilityLoanAccountBookingProcess = res; 
                                model.liabilityAccount = res.liabilityAccount;
                                console.log("liabilities account");
                                console.log(model);
                            });
                    }
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
                        PageHelper.showLoader();
                        model.LiabilityLoanAccountBookingProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                PageHelper.showProgress('loan', 'Loan Saved.', 5000);
                                PageHelper.clearErrors(); 
                                if(!model.liabilityAccount.id) {
                                    model.liabilityAccount = value.liabilityAccount;
                                    model.LiabilityLoanAccountBookingProcess.liabilityAccount = value.liabilityAccount;
                                    //irfNavigator.goBack();
                                }                             
                            }, function (err) {
                                PageHelper.showProgress('loan', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    },
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
                                PageHelper.showProgress('loan', 'Loan Proceed.', 5000);
                                PageHelper.clearErrors();
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showProgress('loan', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    },
                    update: function (model, formCtrl, form, $event) {
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
                                PageHelper.showProgress('loan', 'Loan Updated.', 5000);
                                PageHelper.clearErrors();
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
