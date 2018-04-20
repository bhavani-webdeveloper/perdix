define(['perdix/domain/model/lender/LoanBooking/LiabilityLoanAccountBookingProcess','perdix/domain/model/lender/LoanBooking/LiabilityLenderDocuments', 'perdix/infra/api/AngularResourceService','perdix/domain/model/lender/LoanBooking/LiabilityComplianceDocuments'], function (LiabilityLoanAccountBookingProcess, LiabilityLenderDocuments, AngularResourceService,LiabilityComplianceDocuments) {
  LiabilityLoanAccountBookingProcess = LiabilityLoanAccountBookingProcess['LiabilityLoanAccountBookingProcess'];
    LiabilityLenderDocuments = LiabilityLenderDocuments['LiabilityLenderDocuments'];
    LiabilityComplianceDocuments  = LiabilityComplianceDocuments['LiabilityComplianceDocuments']
    return {
        pageUID: "lender.liabilities.LiabilityLoanDocumentUpload",
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
                    "LenderDocumentation": {
                        "orderNo": 40
                    },
                    "LegalCompliance": {
                        "orderNo": 50
                    },
                    "LegalCompliance.liabilityComplianceDocuments.otherDocumentName": {
                        "condition": "model.liabilityAccount.liabilityComplianceDocuments[arrayIndex].documentName == 'Other'",
                        "required": true
                    },
                    "LenderDocumentation.liabilityLenderDocuments.otherDocumentName": {
                        "condition": "model.liabilityAccount.liabilityLenderDocuments[arrayIndex].documentName == 'Other'",
                        "required": true
                    },
                    "LenderDocumentation.liabilityLenderDocuments.documentName": {
                        "required": true
                    },
                    "LenderDocumentation.liabilityLenderDocuments.upload": {
                        "required": true,
                    },
                    "LenderDocumentation.liabilityLenderDocuments": {
                        onArrayAdd: function(modelValue, form, model, formCtrl, $event) {
                            console.log(LiabilityLenderDocuments)
                            var index = model.liabilityAccount.liabilityLenderDocuments.length -1;
                            model.liabilityAccount.liabilityLenderDocuments[index] = new LiabilityLenderDocuments();
                            model.liabilityAccount.liabilityLenderDocuments[index].uploadedDate =  moment(new Date()).format('YYYY-MM-DD')
                        }
                    },
                    "LenderDocumentation.liabilityLenderDocuments.uploadedDate": {
                        "required": true,
                        "readonly":true
                    },
                     "LegalCompliance.liabilityComplianceDocuments": {
                        onArrayAdd: function(modelValue, form, model, formCtrl, $event) {
                            console.log(LiabilityLenderDocuments)
                            var index = model.liabilityAccount.liabilityComplianceDocuments.length -1;
                            model.liabilityAccount.liabilityComplianceDocuments[index] = new LiabilityComplianceDocuments();
                            model.liabilityAccount.liabilityComplianceDocuments[index].uploadedDate =  moment(new Date()).format('YYYY-MM-DD')
                        }
                    },
                    "LegalCompliance.liabilityComplianceDocuments.documentName": {
                        "required": true
                    },
                    "LegalCompliance.liabilityComplianceDocuments.upload": {
                        "required": true
                    },
                    "LegalCompliance.liabilityComplianceDocuments.uploadedDate": {
                        "required": true,
                        "readonly":true
                    }
                }
            }
            var getIncludes = function (model) {

                return [
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
                    "LegalCompliance.liabilityComplianceDocuments.uploadedDate"

                ];

            }

            return {
                "type": "schema-form",
                "title": "DOCUMENT_UPLOAD",
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
                                }
                            ]
                        }
                    };
                
                    UIRepository.getLenderLiabilitiesLoanAccountBookingProcess().$promise
                        .then(function(repo){
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function(form){
                            self.form = form;
                        });

                    if(_.hasIn($stateParams, 'pageId')) {
                        PageHelper.showLoader();
                        LiabilityLoanAccountBookingProcess.get($stateParams.pageId)
                            .subscribe(function(res){
                                PageHelper.hideLoader();
                                if(res.liabilityAccount.currentStage != "DocumentUpload") {
                                    irfNavigator.goBack();
                                }
                                model.LiabilityLoanAccountBookingProcess = res; 
                                model.liabilityAccount = res.liabilityAccount
                            });
                    } else {        
                        irfNavigator.goBack();
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

                        _.map(model.LiabilityLoanAccountBookingProcess.liabilityAccount.liabilityLenderDocuments, function(n) {
                            return n.documentType = "LenderDocuments";
                        });
                        _.map(model.LiabilityLoanAccountBookingProcess.liabilityAccount.liabilityComplianceDocuments, function(n) {
                            return n.documentType = "ComplianceDocuments";
                        });

                        PageHelper.showLoader();
                        model.LiabilityLoanAccountBookingProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                PageHelper.showProgress('loan', 'Documents Saved.', 5000);
                                PageHelper.clearErrors();
                                //irfNavigator.goBack();
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

                        _.map(model.LiabilityLoanAccountBookingProcess.liabilityAccount.liabilityLenderDocuments, function(n) {
                            return n.documentType = "LenderDocuments";
                        });
                        _.map(model.LiabilityLoanAccountBookingProcess.liabilityAccount.liabilityComplianceDocuments, function(n) {
                            return n.documentType = "ComplianceDocuments";
                        });

                        PageHelper.showLoader();
                        model.LiabilityLoanAccountBookingProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                PageHelper.showProgress('loan', 'Documents Uploaded', 5000);
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
