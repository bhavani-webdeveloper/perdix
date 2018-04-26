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
                        "orderNo": 40,
                        "condition":"!model.rejectLenderDocumentFlag"
                    },
                    "LegalCompliance": {
                        "orderNo": 50,
                         "condition":"!model.rejectLenderDocumentFlag"
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
                    "LenderDocumentation.liabilityLenderDocuments.upload": {
                        "required": true,
                    },
                    "LenderDocumentation.liabilityLenderDocuments": {
                        "view":"fixed",
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
                        "required": true,
                        onArrayAdd: function(modelValue, form, model, formCtrl, $event) {
                            console.log(LiabilityLenderDocuments)
                            var index = model.liabilityAccount.liabilityComplianceDocuments.length -1;
                            model.liabilityAccount.liabilityComplianceDocuments[index] = new LiabilityComplianceDocuments();
                            model.liabilityAccount.liabilityComplianceDocuments[index].uploadedDate =  moment(new Date()).format('YYYY-MM-DD')
                        }
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
                    "LegalCompliance.liabilityComplianceDocuments.uploadedDate",

                    "LenderDocumentationRejected",
                    "LenderDocumentationRejected.liabilityLenderDocument",
                    "LenderDocumentationRejected.liabilityLenderDocument.liabilityLenderDocument",
                    "LenderDocumentationRejected.liabilityLenderDocument.liabilityLenderDocument.section",
                    "LenderDocumentationRejected.liabilityLenderDocument.liabilityLenderDocument.section.documentType",
                    "LenderDocumentationRejected.liabilityLenderDocument.liabilityLenderDocument.section.documentType.documentName",
                    "LenderDocumentationRejected.liabilityLenderDocument.liabilityLenderDocument.section.rejectReasons",
                    "LenderDocumentationRejected.liabilityLenderDocument.liabilityLenderDocument.section.rejectReasons.rejectReason",
                    "LenderDocumentationRejected.liabilityLenderDocument.liabilityLenderDocument.section.isSignOff",
                    "LenderDocumentationRejected.liabilityLenderDocument.liabilityLenderDocument.section.isSignOff.isSignOff",
                    "LenderDocumentationRejected.liabilityLenderDocument.liabilityLenderDocument.section.upload",
                    "LenderDocumentationRejected.liabilityLenderDocument.liabilityLenderDocument.section.upload.upload",
                    
                    "LegalComplianceRejected",
                    "LegalComplianceRejected.liabilityComplianceDocument",
                    "LegalComplianceRejected.liabilityComplianceDocument.liabilityComplianceDocument",
                    "LegalComplianceRejected.liabilityComplianceDocument.liabilityComplianceDocument.section",
                    "LegalComplianceRejected.liabilityComplianceDocument.liabilityComplianceDocument.section.documentType",
                    "LegalComplianceRejected.liabilityComplianceDocument.liabilityComplianceDocument.section.documentType.documentName",
                    "LegalComplianceRejected.liabilityComplianceDocument.liabilityComplianceDocument.section.rejectReasons",
                    "LegalComplianceRejected.liabilityComplianceDocument.liabilityComplianceDocument.section.rejectReasons.rejectReason",
                    //"LenderDocumentationRejected.liabilityLenderDocument.liabilityLenderDocument.section.rejectReason",
                    "LegalComplianceRejected.liabilityComplianceDocument.liabilityComplianceDocument.section.isSignOff",
                    "LegalComplianceRejected.liabilityComplianceDocument.liabilityComplianceDocument.section.isSignOff.isSignOff",
                    "LegalComplianceRejected.liabilityComplianceDocument.liabilityComplianceDocument.section.upload",
                    "LegalComplianceRejected.liabilityComplianceDocument.liabilityComplianceDocument.section.upload.upload"
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
                         "repositoryAdditions": {
                                "LenderDocumentationRejected":{
                                    "type": "box",
                                    "condition":"model.rejectLenderDocumentFlag",
                                    "orderNo":10,
                                    "colClass": "col-sm-12",
                                    "title": "LENDER_DOCUMENT",
                                    "htmlClass": "text-danger",
                                    "items": {
                                        "liabilityLenderDocument": {
                                            "type": "fieldset",
                                            "title": "LENDER_DOCUMENT",
                                            "items": {
                                                "liabilityLenderDocument": {
                                                    "key": "liabilityAccount.liabilityLenderDocuments",
                                                    "type": "array",
                                                    "title": "LENDER_DOCUMENT",
                                                    "view": "fixed",
                                                    "add": null,
                                                    "remove": null,
                                                    "notitle": true,
                                                    "items": {
                                                        "section":{
                                                            "type": "section",
                                                            "htmlClass": "row",
                                                            "items":{
                                                                "documentType": {
                                                                    "type": "section",
                                                                    "htmlClass": "col-sm-3",
                                                                    "items": {
                                                                        "documentName": {
                                                                            "key": "liabilityAccount.liabilityLenderDocuments[].documentName",
                                                                            "notitle": true,
                                                                            "readonly": true
                                                                        }
                                                                    }
                                                                },
                                                                 "rejectReasons": {
                                                                    "type": "section",
                                                                    "htmlClass": "col-sm-3",
                                                                    "items": {
                                                                        "rejectReason": {
                                                                            "key": "liabilityAccount.liabilityLenderDocuments[].rejectReason",
                                                                           // "condition": "model.liabilityAccount.liabilityComplianceDocuments[arrayIndex].documentName=='Other'",
                                                                            "notitle": true,
                                                                            "readonly": true
                                                                        }
                                                                    }
                                                                },
                                                                "isSignOff": {
                                                                    "type": "section",
                                                                    "htmlClass": "col-sm-3",
                                                                    "items": {
                                                                        "isSignOff": {
                                                                            "key": "liabilityAccount.liabilityLenderDocuments[].isSignOff",
                                                                            "notitle": true,
                                                                            "readonly": true
                                                                            
                                                                        }
                                                                    }
                                                                },
                                                                "upload": {                                        
                                                                    "type": "section",
                                                                    "condition":"liabilityAccount.liabilityLenderDocuments.length != 0",
                                                                    "htmlClass": "col-sm-3",
                                                                    "items": {
                                                                        "upload":{
                                                                            "key": "liabilityAccount.liabilityLenderDocuments[].fileId",
                                                                            "title": "DOWNLOAD_FORM",
                                                                            "notitle": true,
                                                                            "fieldHtmlClass": "btn-block",
                                                                            "style": "btn-default",
                                                                            "fileType": "application/pdf",
                                                                            "category": "Loan",
                                                                            "subCategory": "DOC1",
                                                                            //"icon": "fa fa-download", 
                                                                            "type": "file",
                                                                            //"readonly": false
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    } 
                                                } 
                                            }
                                        },
                                    }
                                },
                                "LegalComplianceRejected":{
                                    "type": "box",
                                    "condition":"model.rejectLenderDocumentFlag",
                                    "orderNo":10,
                                    "colClass": "col-sm-12",
                                    "title": "COMPLIANCE_DOCUMENT",
                                    "htmlClass": "text-danger",
                                    "items": {
                                        "liabilityComplianceDocument": {
                                            "type": "fieldset",
                                            "title": "COMPLIANCE_DOCUMENT",
                                            "items": {
                                                "liabilityComplianceDocument": {
                                                    "key": "liabilityAccount.liabilityComplianceDocuments",
                                                    "type": "array",
                                                    "title": "COMPLIANCE_DOCUMENT",
                                                    "view": "fixed",
                                                    "add": null,
                                                    "remove": null,
                                                    "notitle": true,
                                                    "items": {
                                                        "section":{
                                                            "type": "section",
                                                            "htmlClass": "row",
                                                            "items":{
                                                                "documentType": {
                                                                    "type": "section",
                                                                    "htmlClass": "col-sm-3",
                                                                    "items": {
                                                                        "documentName": {
                                                                            "key": "liabilityAccount.liabilityComplianceDocuments[].documentName",
                                                                            "notitle": true,
                                                                            "readonly": true
                                                                        }
                                                                    }
                                                                },
                                                                 "rejectReasons": {
                                                                    "type": "section",
                                                                    "htmlClass": "col-sm-3",
                                                                    "items": {
                                                                        "rejectReason": {
                                                                            "key": "liabilityAccount.liabilityComplianceDocuments[].rejectReason",
                                                                           // "condition": "model.liabilityAccount.liabilityComplianceDocuments[arrayIndex].documentName=='Other'",
                                                                            "notitle": true,
                                                                            "readonly": true
                                                                        }
                                                                    }
                                                                },
                                                                "isSignOff": {
                                                                    "type": "section",
                                                                    "htmlClass": "col-sm-3",
                                                                    "items": {
                                                                        "isSignOff": {
                                                                            "key": "liabilityAccount.liabilityComplianceDocuments[].isSignOff",
                                                                            "notitle": true,
                                                                            "readonly": true
                                                                            
                                                                        }
                                                                    }
                                                                },
                                                                "upload": {                                        
                                                                    "type": "section",
                                                                    "htmlClass": "col-sm-3",
                                                                    "items": {
                                                                        "upload":{
                                                                           // "condition":"liabilityAccount.liabilityComplianceDocuments.fileId",
                                                                            "condition":"liabilityAccount.liabilityComplianceDocuments.length != 0",
                                                                            "key": "liabilityAccount.liabilityComplianceDocuments[].fileId",
                                                                            "title": "DOWNLOAD_FORM",
                                                                            "notitle": true,
                                                                            "fieldHtmlClass": "btn-block",
                                                                            "style": "btn-default",
                                                                            "fileType": "application/pdf",
                                                                            "category": "Loan",
                                                                            "subCategory": "DOC1",
                                                                            //"icon": "fa fa-download", 
                                                                            "type": "file",
                                                                            //"readonly": false
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    } 
                                                } 
                                            }
                                        },
                                    }
                                }
                            },
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
                            if (res.liabilityAccount.currentStage != "DocumentUpload") {
                                irfNavigator.goBack();
                            }
                            model.document = formHelper.enum('lender_document').data;
                            model.complianceDocument = formHelper.enum('compliance_document').data;
                            console.log(model.document);
                            model.LiabilityLoanAccountBookingProcess = res;
                            model.liabilityAccount = res.liabilityAccount;

                            res.liabilityAccount.liabilityComplianceDocuments.pop();
                            res.liabilityAccount.liabilityLenderDocuments.pop();
                            model.liabilityAccount = res.liabilityAccount
                            model.rejectLenderDocumentFlag = false;
                            model.rejectLenderDocumentFlag = false;

                            _.forEach(model.liabilityAccount.liabilityComplianceDocuments, function(value) {
                                if (value.isSignOff == 'REJECTED') {
                                    model.rejectLenderDocumentFlag = true
                                }

                            });
                            _.forEach(model.liabilityAccount.liabilityLenderDocuments, function(value) {
                                if (value.isSignOff == 'REJECTED') {
                                    model.rejectLenderDocumentFlag = true
                                }
                            });
                            model.liabilityComplianceApproved = _.remove(model.liabilityAccount.liabilityComplianceDocuments, function(n) {
                                return n.isSignOff != "REJECTED"
                            });
                            model.liabilityDocumentApproved = _.remove(model.liabilityAccount.liabilityLenderDocuments, function(n) {
                                return n.isSignOff != "REJECTED"
                            });
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
                         model.liabilityAccount.liabilityLenderDocuments = _.union(model.liabilityDocumentApproved, model.liabilityAccount.liabilityLenderDocuments);
                         model.liabilityAccount.liabilityComplianceDocuments = _.union(model.liabilityComplianceApproved, model.liabilityAccount.liabilityComplianceDocuments);
                        console.log(_.union(model.liabilityDocumentApproved, model.liabilityAccount.liabilityLenderDocuments));
                        console.log(_.union(model.liabilityComplianceApproved, model.liabilityAccount.liabilityComplianceDocuments));

                        PageHelper.showLoader();
                        model.LiabilityLoanAccountBookingProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                PageHelper.showProgress('loan', 'Documents Uploaded', 5000);
                                PageHelper.clearErrors();
                                irfNavigator.go({
                                    state: 'Page.Adhoc',
                                    pageName: "lender.liabilities.LoanBookingDashboard"
                                });
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
