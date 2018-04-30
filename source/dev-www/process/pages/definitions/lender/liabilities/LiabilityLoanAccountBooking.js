define(['perdix/domain/model/lender/LoanBooking/LiabilityLoanAccountBookingProcess', 'perdix/infra/api/AngularResourceService','perdix/domain/model/lender/LoanBooking/LiabilityLenderDocuments','perdix/domain/model/lender/LoanBooking/LiabilityComplianceDocuments'], function(LiabilityLoanAccountBookingProcess, AngularResourceService,LiabilityLenderDocuments,LiabilityComplianceDocuments) {
    LiabilityLoanAccountBookingProcess = LiabilityLoanAccountBookingProcess['LiabilityLoanAccountBookingProcess'];
    LiabilityLenderDocuments = LiabilityLenderDocuments['LiabilityLenderDocuments'];
    LiabilityComplianceDocuments  = LiabilityComplianceDocuments['LiabilityComplianceDocuments']
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
            var lenderDetails = function(model, index) {
                model.liabilityAccount.liabilityLenderDocuments[index].documentType = model.liabilityAccount.liabilityLenderDocuments["0"].documentType
                model.liabilityAccount.liabilityLenderDocuments[index].lenderAccountNumber = model.liabilityAccount.lenderAccountNumber
                model.liabilityAccount.liabilityLenderDocuments[index].lenderId = model.liabilityAccount.lenderId
                model.liabilityAccount.liabilityLenderDocuments[index].liablityAccountId = model.liabilityAccount.id
            };
            var complianceDetails = function(model, index) {
                model.liabilityAccount.liabilityComplianceDocuments[index].documentType = model.liabilityAccount.liabilityComplianceDocuments["0"].documentType
                model.liabilityAccount.liabilityComplianceDocuments[index].lenderAccountNumber = model.liabilityAccount.lenderAccountNumber
                model.liabilityAccount.liabilityComplianceDocuments[index].lenderId = model.liabilityAccount.lenderId
                model.liabilityAccount.liabilityComplianceDocuments[index].liablityAccountId = model.liabilityAccount.id
            };

            var overridesFields = function(bundlePageObj) {
                return {
                    "LenderAccountDetails": {
                        "orderNo": 10,
                        
                    },
                    "DisbursementDetails": {
                        "orderNo": 20
                    },
                    "LoanAmountDeduction": {
                        "orderNo": 30
                    },
                    "LenderDocumentation":{
                        "orderNo": 40,
                        "condition":"model.showLenderDcoument",
                    },
                    "LenderDocumentation.liabilityLenderDocuments": {
                        onArrayAdd: function(modelValue, form, model, formCtrl, $event) {
                           var index = model.liabilityAccount.liabilityLenderDocuments.length -1;
                            model.liabilityAccount.liabilityLenderDocuments[index] = new LiabilityLenderDocuments();
                            model.liabilityAccount.liabilityLenderDocuments[index].uploadedDate =  moment(new Date()).format('YYYY-MM-DD')
                        }
                    },
                     "LenderDocumentation.liabilityLenderDocuments.documentName": {
                        "required": true,
                        "type": "lov",
                        lovonly: true,
                        searchHelper: formHelper,
                        search: function(inputModel, form, model, context) {
                            var f = $filter('filter')(model.document, {
                                "field1": model.liabilityAccount.productType
                            }, true);
                            return $q.resolve({
                                "header": {
                                    "x-total-count": f && f.length
                                },
                                "body": f
                            });
                        },  
                        getListDisplayItem: function(item, index) {
                            return [item.name];
                        },
                        onSelect: function(result, model, context) {
                            model.liabilityAccount.liabilityLenderDocuments[context.arrayIndex].documentName = result.name;
                        },
                        "onChange": function(modelValue, form, model) {
                            model.floatingRate = (modelValue == 'Floating Rate') ? true : false;
                        },

                    },
                     "LegalCompliance.liabilityComplianceDocuments.documentName": {
                        "required": true,
                         "type": "lov",
                        lovonly: true,
                        searchHelper: formHelper,
                        search: function(inputModel, form, model, context) {
                            var f = $filter('filter')(model.complianceDocument, {
                                "field1": model.liabilityAccount.productType
                            }, true);
                            return $q.resolve({
                                "header": {
                                    "x-total-count": f && f.length
                                },
                                "body": f
                            });
                        },
                        getListDisplayItem: function(item, index) {
                            return [item.name];
                        },
                        onSelect: function(result, model, context) {
                            model.liabilityAccount.liabilityComplianceDocuments[context.arrayIndex].documentName = result.name;
                        }
                    },
                    "LenderDocumentation.liabilityLenderDocuments.otherDocumentName": {
                        "condition": "model.liabilityAccount.liabilityLenderDocuments[arrayIndex].documentName == 'Other'",
                        "required": true
                    },
                    "LegalCompliance": {
                        "orderNo": 50,
                        "condition":"model.showComplianceDcoument",
                    },
                    "LegalCompliance.liabilityComplianceDocuments": {
                        onArrayAdd: function(modelValue, form, model, formCtrl, $event) {
                            var index = model.liabilityAccount.liabilityComplianceDocuments.length - 1;
                            model.liabilityAccount.liabilityComplianceDocuments[index] = new LiabilityComplianceDocuments();
                            model.liabilityAccount.liabilityComplianceDocuments[index].uploadedDate = moment(new Date()).format('YYYY-MM-DD')
                        }
                    },
                    "LegalCompliance.liabilityComplianceDocuments.otherDocumentName": {
                        "condition": "model.liabilityAccount.liabilityComplianceDocuments[arrayIndex].documentName == 'Other'",
                        "required": true
                    },
                    "LenderDocumentation.liabilityLenderDocuments.otherDocumentName": {
                        "condition": "model.liabilityAccount.liabilityLenderDocuments[arrayIndex].documentName == 'Others'",
                        "required": true
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
                    "Document.liabilityLenderDocuments.liabilityLenderDocuments": {
                        onArrayAdd: function(modelValue, form, model, formCtrl, $event) {
                            model.showLenderDcoument = true;
                            var index = model.liabilityAccount.liabilityLenderDocuments.length - 1;
                            model.liabilityAccount.liabilityLenderDocuments[index] = new LiabilityLenderDocuments();
                            model.liabilityAccount.liabilityLenderDocuments[index].uploadedDate = moment(new Date()).format('YYYY-MM-DD');
                            lenderDetails(model, index);
                        }
                    },
                    "Document.liabilityComplianceDocuments.liabilityComplianceDocuments":{
                        onArrayAdd: function(modelValue, form, model, formCtrl, $event) {
                            model.showComplianceDcoument = true;
                            var index = model.liabilityAccount.liabilityComplianceDocuments.length - 1;
                            model.liabilityAccount.liabilityComplianceDocuments[index] = new LiabilityComplianceDocuments();
                            model.liabilityAccount.liabilityComplianceDocuments[index].uploadedDate = moment(new Date()).format('YYYY-MM-DD');
                            lenderDetails(model, index);
                        }
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
                                name: "PARTIAL_UPADTE",
                                desc: "",
                                fn: function(item, index) {
                                    if (item.paidStatus != "PartiallyPaid") {
                                        PageHelper.showProgress("Repayment", "Only PartiallyPaid are allowed to Schedule Update", 10000);
                                    } else {
                                        $state.go('Page.Engine', {
                                            pageName: 'lender.liabilities.LiabilityPartialRepaymentScreen',
                                            pageId: item.id,
                                            pageData:$stateParams.pageId
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

                    "LenderDocumentation",
                    "LenderDocumentation.liabilityLenderDocuments",
                    "LenderDocumentation.liabilityLenderDocuments.documentName",
                    "LenderDocumentation.liabilityLenderDocuments.otherDocumentName",
                    "LenderDocumentation.liabilityLenderDocuments.upload",
                    // "LenderDocumentation.liabilityLenderDocuments.isSignOff",
                    "LenderDocumentation.liabilityLenderDocuments.uploadedDate",

                    "LegalCompliance",
                    "LegalCompliance.liabilityComplianceDocuments",
                    "LegalCompliance.liabilityComplianceDocuments.upload",
                    "LegalCompliance.liabilityComplianceDocuments.documentName",
                    "LegalCompliance.liabilityComplianceDocuments.otherDocumentName",
                    // "LegalCompliance.liabilityComplianceDocuments.isSignOff",
                    "LegalCompliance.liabilityComplianceDocuments.uploadedDate",



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
                                                    "key": "liabilityAccounts.liabilityLenderDocuments",
                                                    "add": false,
                                                    "title": "ADD_DOCUMENT",
                                                    "startEmpty": false,
                                                    "schema":{
                                                        "minimum":1
                                                    },
                                                    "titleExpr": "model.liabilityAccounts.liabilityLenderDocuments[arrayIndex].documentName",
                                                    "items": {
                                                        "fileId": {
                                                            "title": "DOWNLOAD_FORM",
                                                            "notitle": true,
                                                            "fieldHtmlClass": "btn-block",
                                                            "style": "btn-default",
                                                            "icon": "fa fa-download",
                                                            "type": "button",
                                                            "condition": "model.liabilityAccounts.liabilityLenderDocuments[arrayIndex].fileId",
                                                            "key": "liabilityAccount.liabilityLenderDocuments[].fileId",
                                                            "onClick": function(model, form, schemaForm, event) {
                                                                var fileId = model.liabilityAccounts.liabilityLenderDocuments[schemaForm.arrayIndex].fileId;
                                                                Utils.downloadFile(Files.getFileDownloadURL(fileId));
                                                            }
                                                        },
    
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
                                                    "key": "liabilityAccounts.liabilityComplianceDocuments",
                                                    "add": true,
                                                    "startEmpty": false,
                                                    "remove": null,
                                                    "title": "ADD_DOCUMENT",
                                                    "titleExpr": "model.liabilityAccounts.liabilityComplianceDocuments[arrayIndex].documentName",
                                                    "items": {
                                                        "fileId": {
                                                            "title": "DOWNLOAD_FORM",
                                                            "notitle": true,
                                                            "fieldHtmlClass": "btn-block",
                                                            "style": "btn-default",
                                                            "icon": "fa fa-download",
                                                            "type": "button",
                                                            "key": "liabilityAccounts.liabilityComplianceDocuments[].fileId",
                                                            "onClick": function(model, form, schemaForm, event) {
                                                                var fileId = model.liabilityAccounts.liabilityComplianceDocuments[schemaForm.arrayIndex].fileId;
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
                            model.LiabilityLoanAccountBookingProcess = res;
                            res.liabilityAccount.liabilityComplianceDocuments.pop();
                            res.liabilityAccount.liabilityLenderDocuments.pop()
                            _.forEach(model.liabilityAccount.liabilitySchedules, function(schedule) {
                                if (schedule.totalInstallmentAmountDue == null) {
                                    schedule.totalInstallmentAmountDue = schedule.principalDue + schedule.penalityDue + schedule.interestDue + schedule.otherFeeChargesDue
                                }
                            });
                            model.document = formHelper.enum('lender_document').data;
                            model.complianceDocument = formHelper.enum('compliance_document').data;
                            model.liabilityAccount = res.liabilityAccount;
                            model.liabilityAccounts = model.liabilityAccount;
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