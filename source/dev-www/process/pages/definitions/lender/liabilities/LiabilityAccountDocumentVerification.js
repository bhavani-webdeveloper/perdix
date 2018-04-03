define(['perdix/domain/model/lender/LoanBooking/LiabilityLoanAccountBookingProcess', 'perdix/infra/api/AngularResourceService'], function (LiabilityLoanAccountBookingProcess, AngularResourceService) {
    LiabilityLoanAccountBookingProcess = LiabilityLoanAccountBookingProcess['LiabilityLoanAccountBookingProcess'];
    return {
        pageUID: "lender.liabilities.LiabilityAccountDocumentVerification",
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
                    "LegalComplianceNew": {
                        "orderNo": 10
                    },
                    "LegalComplianceNew.liabilityComplianceDocuments.liabilityComplianceDocuments.section.upload.upload": {
                        "onClick": function(model, form, schemaForm, event) {
                            var fileId = model.liabilityAccount.liabilityComplianceDocuments[schemaForm.arrayIndex].fileId;
                            Utils.downloadFile(Files.getFileDownloadURL(fileId));
                        }
                    },
                    "LegalComplianceNew.lenderDocuments.lenderDocuments.section.upload.upload": {
                        "onClick": function(model, form, schemaForm, event) {
                            var fileId = model.liabilityAccount.liabilityLenderDocuments[schemaForm.arrayIndex].fileId;
                            Utils.downloadFile(Files.getFileDownloadURL(fileId));
                        }
                    },
                    "LegalComplianceNew.formDownload": {
                         "onClick": function(model, form, schemaForm, event) {
                            var fileUrl = IndividualLoan.getAllDocumentsUrl(model.liabilityAccount.id);
                            Utils.downloadFile(fileUrl);
                        }
                    }
                }
            }
            var getIncludes = function (model) {

                return [
                    "LegalComplianceNew",
                    "LegalComplianceNew.lenderId",
                    "LegalComplianceNew.lenderName",
                    "LegalComplianceNew.formDownload",
                    "LegalComplianceNew.liabilityComplianceDocuments",
                    "LegalComplianceNew.liabilityComplianceDocuments.liabilityComplianceDocuments",
                    "LegalComplianceNew.liabilityComplianceDocuments.liabilityComplianceDocuments.section",
                    "LegalComplianceNew.liabilityComplianceDocuments.liabilityComplianceDocuments.section.documentType",
                    "LegalComplianceNew.liabilityComplianceDocuments.liabilityComplianceDocuments.section.documentType.documentType",
                    "LegalComplianceNew.liabilityComplianceDocuments.liabilityComplianceDocuments.section.upload",
                    "LegalComplianceNew.liabilityComplianceDocuments.liabilityComplianceDocuments.section.upload.upload",
                    "LegalComplianceNew.lenderDocuments",
                    "LegalComplianceNew.lenderDocuments.lenderDocuments",
                    "LegalComplianceNew.lenderDocuments.lenderDocuments.section",
                    "LegalComplianceNew.lenderDocuments.lenderDocuments.section.documentType",
                    "LegalComplianceNew.lenderDocuments.lenderDocuments.section.documentType.documentType",
                    "LegalComplianceNew.lenderDocuments.lenderDocuments.section.upload",
                    "LegalComplianceNew.lenderDocuments.lenderDocuments.section.upload.upload"
                ];

            }

            return {
                "type": "schema-form",
                "title": "DOCUMENT_VERIFICATION",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    if(_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId) ) {
                        LiabilityLoanAccountBookingProcess.get($stateParams.pageId)
                            .subscribe(function(res){
                                //if(res.liabilityAccount.currentStage != "LiabilityAccount") {
                                   // irfNavigator.goBack();
                                //}
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

                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {
                                "documentVerification": {
                                    "type": "box",
                                    "colClass": "col-sm-12",
                                    "title": "LENDER_DOCUMENT_VERIFICATION",
                                    "htmlClass": "text-danger",
                                    "items": {
                                        "type": "fieldset",
                                        "title": "LENDER_DOCUMENT_VERIFICATION",
                                        "items": {
                                            "liabilityLenderDocuments": {
                                                "type": "array",
                                                "notitle": true,
                                                "view": "fixed",
                                                "key": "liabilityAccount.liabilityLenderDocuments",
                                                "add": null,
                                                "remove": null,
                                                "items": {
                                                    "liabilityLenderDocuments": {
                                                        "type": "section",
                                                        "htmlClass": "row",
                                                        "items": {
                                                            "documentType": {
                                                                "type": "section",
                                                                "htmlClass": "col-sm-3",
                                                                "items": [{
                                                                    "key": "liabilityAccount.liabilityLenderDocuments[].documentType",
                                                                    "notitle": true,
                                                                    "title": " ",
                                                                    "readonly": true
                                                                }]
                                                            }, 
                                                            "fileId": {
                                                                "type": "section",
                                                                "htmlClass": "col-sm-2",
                                                                "key": "liabilityAccount.liabilityLenderDocuments[].fileId",
                                                                "items": [{
                                                                    "title": "DOWNLOAD_FORM",
                                                                    "notitle": true,
                                                                    "fieldHtmlClass": "btn-block",
                                                                    "style": "btn-default",
                                                                    "icon": "fa fa-download", 
                                                                    "type": "button",
                                                                    "readonly": false,
                                                                    "key": "liabilityAccount.liabilityLenderDocuments[].fileId",
                                                                    "onClick": function(model, form, schemaForm, event) {
                                                                        var fileId = model.liabilityAccount.liabilityLenderDocuments[schemaForm.arrayIndex].fileId;
                                                                        Utils.downloadFile(Files.getFileDownloadURL(fileId));
                                                                    }
                                                                }]
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
                                    "condition": "model.liabilityAccount.id",
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
                    var p1 = UIRepository.getLenderLiabilitiesLoanAccountBookingProcess().$promise;
                    p1.then(function(repo){
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, configFile(), model);
                        console.log(self);
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

                        model.LiabilityLoanAccountBookingProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                PageHelper.showProgress('loan', 'Loan Saved.', 5000);
                                PageHelper.clearErrors();   
                                if(!model.liabilityAccount.id) {
                                    irfNavigator.goBack();
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
                    }
                }
            };
        }
    }
})
