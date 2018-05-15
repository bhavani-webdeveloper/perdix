define(['perdix/domain/model/lender/LoanBooking/LiabilityLoanAccountBookingProcess', 'perdix/infra/api/AngularResourceService'], function (LiabilityLoanAccountBookingProcess, AngularResourceService) {
    LiabilityLoanAccountBookingProcess = LiabilityLoanAccountBookingProcess['LiabilityLoanAccountBookingProcess'];
    return {
        pageUID: "lender.liabilities.LiabilityAccountDocumentVerification",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator", "Utils", "Files", "LiabilityAccountProcess"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                           PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator, Utils, Files, LiabilityAccountProcess) {

            var configFile = function () {
                return {
                }
            }
            var overridesFields = function (bundlePageObj) {
                return {
                    "DocumentVerification": {
                        "orderNo": 10
                    },
                    "DocumentVerification.liabilityComplianceDocuments.liabilityComplianceDocuments.section.upload.upload": {
                        "onClick": function(model, form, schemaForm, event) {
                            var fileId = model.liabilityAccount.liabilityComplianceDocuments[schemaForm.arrayIndex].fileId;
                            Utils.downloadFile(Files.getFileDownloadURL(fileId));
                        }
                    },
                    "DocumentVerification.lenderDocuments.lenderDocuments.section.upload.upload": {
                        "onClick": function(model, form, schemaForm, event) {
                            var fileId = model.liabilityAccount.liabilityLenderDocuments[schemaForm.arrayIndex].fileId;
                            Utils.downloadFile(Files.getFileDownloadURL(fileId));
                        }
                    },
                    "DocumentVerification.documentDownload": {
                         "onClick": function(model, form, schemaForm, event) {
                            var fileUrl = LiabilityAccountProcess.documentDownload(model.liabilityAccount.id);
                            Utils.downloadFile(fileUrl);
                        }
                    },
                    "DocumentVerification.liabilityComplianceDocuments.liabilityComplianceDocuments.section.isSignOff.isSignOff": {
                        "required": true,
                         "onChange": function(modelValue, form, model) {
                            model.rejectCompliancedocument = false
                            _.forEach(model.liabilityAccount.liabilityComplianceDocuments, function(value){
                                    if (value.isSignOff == 'REJECTED') {
                                        model.rejectCompliancedocument = true                                    }
                                });
                        }
                    },
                    "DocumentVerification.lenderDocuments.lenderDocuments.section.isSignOff.isSignOff":{
                        "required": true,
                         "onChange": function(modelValue, form, model) {
                            model.rejectLenderDocument = false
                            _.forEach(model.liabilityAccount.liabilityLenderDocuments, function(value){
                                    if (value.isSignOff == 'REJECTED') {
                                        model.rejectLenderDocument = true                                    }
                                });
                        }
                      },
                    "DocumentVerification.lenderDocuments.lenderDocuments.section.remarks.remarks": {
                        "required": true,
                    }
                }
            }
            var getIncludes = function (model) {

                return [
                    "DocumentVerification",
                    "DocumentVerification.lenderId",
                    "DocumentVerification.lenderName",
                    "DocumentVerification.documentDownload",
                    "DocumentVerification.lenderDocuments",
                    "DocumentVerification.lenderDocuments.lenderDocuments",
                    "DocumentVerification.lenderDocuments.lenderDocuments.section",
                    "DocumentVerification.lenderDocuments.lenderDocuments.section.documentType",
                    "DocumentVerification.lenderDocuments.lenderDocuments.section.documentType.documentName",
                    "DocumentVerification.lenderDocuments.lenderDocuments.section.documentType.otherDocumentName",
                    "DocumentVerification.lenderDocuments.lenderDocuments.section.upload",
                    "DocumentVerification.lenderDocuments.lenderDocuments.section.upload.upload",
                    "DocumentVerification.lenderDocuments.lenderDocuments.section.isSignOff",
                    "DocumentVerification.lenderDocuments.lenderDocuments.section.isSignOff.isSignOff",
                    "DocumentVerification.lenderDocuments.lenderDocuments.section.reason",
                    "DocumentVerification.lenderDocuments.lenderDocuments.section.reason.reason",
                    "DocumentVerification.lenderDocuments.lenderDocuments.section.remarksSection5",
                    "DocumentVerification.lenderDocuments.lenderDocuments.section.remarksSection5.remarks",
                    "DocumentVerification.lenderDocuments.lenderDocuments.section.remarksSection2",
                    "DocumentVerification.lenderDocuments.lenderDocuments.section.remarksSection2.remarks",
                    "DocumentVerification.liabilityComplianceDocuments",
                    "DocumentVerification.liabilityComplianceDocuments.liabilityComplianceDocuments",
                    "DocumentVerification.liabilityComplianceDocuments.liabilityComplianceDocuments.section",
                    "DocumentVerification.liabilityComplianceDocuments.liabilityComplianceDocuments.section.documentType",
                    "DocumentVerification.liabilityComplianceDocuments.liabilityComplianceDocuments.section.documentType.documentName",
                    "DocumentVerification.liabilityComplianceDocuments.liabilityComplianceDocuments.section.documentType.otherDocumentName",
                    "DocumentVerification.liabilityComplianceDocuments.liabilityComplianceDocuments.section.upload",
                    "DocumentVerification.liabilityComplianceDocuments.liabilityComplianceDocuments.section.upload.upload",
                    "DocumentVerification.liabilityComplianceDocuments.liabilityComplianceDocuments.section.isSignOff",
                    "DocumentVerification.liabilityComplianceDocuments.liabilityComplianceDocuments.section.isSignOff.isSignOff",
                    "DocumentVerification.liabilityComplianceDocuments.liabilityComplianceDocuments.section.reason",
                    "DocumentVerification.liabilityComplianceDocuments.liabilityComplianceDocuments.section.reason.reason",
                    "DocumentVerification.liabilityComplianceDocuments.liabilityComplianceDocuments.section.remarksSection5",
                    "DocumentVerification.liabilityComplianceDocuments.liabilityComplianceDocuments.section.remarksSection5.remarks",
                    "DocumentVerification.liabilityComplianceDocuments.liabilityComplianceDocuments.section.remarksSection2",
                    "DocumentVerification.liabilityComplianceDocuments.liabilityComplianceDocuments.section.remarksSection2.remarks"
                ];

            }
            var lenderDocuments = [];
            Queries.getLoanProductDocumentsRejectReasons("lender_document").then(function(resp){
                lenderDocuments = resp;
                console.log(resp)
            });

            var complianceDocument = [];
            Queries.getLoanProductDocumentsRejectReasons("compliance_document").then(function(resp){
                complianceDocument = resp;
                console.log(resp)
            });

            return {
                "type": "schema-form",
                "title": "DOCUMENT_VERIFICATION",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    if(_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId) ) {
                        PageHelper.showLoader();
                        LiabilityLoanAccountBookingProcess.get($stateParams.pageId)
                            .subscribe(function(res){
                                PageHelper.hideLoader();
                                if(res.liabilityAccount.currentStage != "DocumentVerification") {
                                   irfNavigator.goBack();
                                }
                                model.LiabilityLoanAccountBookingProcess = res; 
                                res.liabilityAccount.liabilityComplianceDocuments.pop();
                                res.liabilityAccount.liabilityLenderDocuments.pop()
                                _.forEach(res.liabilityAccount.liabilityComplianceDocuments, function(value){
                                    if (value.isSignOff == 'REJECTED') {
                                        model.rejectCompliancedocument = true                                    }
                                });
                                _.forEach(res.liabilityAccount.liabilityLenderDocuments, function(value){
                                    if (value.isSignOff == 'REJECTED') {
                                        model.rejectLenderDocument = true
                                    }
                                });
                                model.liabilityAccount = res.liabilityAccount;
                                model.rejectProceed = false
                            });
                    } else {
                       irfNavigator.goBack();
                    }

                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {
                                "DocumentVerification":{
                                    "type": "box",
                                    "colClass": "col-sm-12",
                                    "title": "DOCUMENT_VERIFICATION",
                                    "htmlClass": "text-danger",
                                    "items": {
                                        "lenderId": {
                                            "key": "liabilityAccount.lenderId",
                                            "title": "LENDER_ID",
                                            "readonly": true
                                        },
                                        "lenderName": {
                                            "key": "LiabilityLoanAccountBookingProcess.lenderEnrolmentProcess.customer.firstName",
                                            "title": "LENDER_NAME",
                                            "readonly": true
                                        },
                                        "documentDownload": {
                                            "type": "button",
                                            "title": "DOWNLOAD_ALL_DOCUMENTS"
                                        },
                                        "liabilityComplianceDocuments": {
                                            "type": "fieldset",
                                            "title": "COMPLIANCE_DOCUMENT_VERIFICATION",
                                            "items": {
                                                "liabilityComplianceDocuments": {
                                                    "key": "liabilityAccount.liabilityComplianceDocuments",
                                                    "type": "array",
                                                    "title": "LEGAL_COMPLIANCE",
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
                                                                    "htmlClass": "col-sm-2",
                                                                    "items": {
                                                                        "documentName": {
                                                                            "key": "liabilityAccount.liabilityComplianceDocuments[].documentName",
                                                                            "condition": "model.liabilityAccount.liabilityComplianceDocuments[arrayIndex].documentName!='Other'",
                                                                            "notitle": true,
                                                                            "readonly": true
                                                                        },
                                                                        "otherDocumentName": {
                                                                            "key": "liabilityAccount.liabilityComplianceDocuments[].otherDocumentName",
                                                                            "condition": "model.liabilityAccount.liabilityComplianceDocuments[arrayIndex].documentName=='Other'",
                                                                            "notitle": true,
                                                                            "readonly": true
                                                                        }
                                                                    }
                                                                },
                                                                "upload": {                                        
                                                                    "type": "section",
                                                                    "htmlClass": "col-sm-2",
                                                                    "items": {
                                                                        "upload":{
                                                                            "key": "liabilityAccount.liabilityComplianceDocuments[].fileId",
                                                                            "title": "DOWNLOAD_FORM",
                                                                            "notitle": true,
                                                                            "fieldHtmlClass": "btn-block",
                                                                            "style": "btn-default",
                                                                            "icon": "fa fa-download", 
                                                                            "type": "button",
                                                                            "readonly": false
                                                                        }
                                                                    }
                                                                },
                                                                "isSignOff": {
                                                                    "type": "section",
                                                                    "htmlClass": "col-sm-2",
                                                                    
                                                                    "items": {
                                                                        "isSignOff": {
                                                                            "key": "liabilityAccount.liabilityComplianceDocuments[].isSignOff",
                                                                            "notitle": true,
                                                                            "type": "select",
                                                                            "titleMap": [{
                                                                                "name": "Rejected",
                                                                                "value": "REJECTED"
                                                                            },{
                                                                                "name": "Approved",
                                                                                "value": "APPROVED"
                                                                            }],
                                                                            "onChange": function(modelValue, form, model) {
                                                                                model.rejectProceed =  (modelValue == 'REJECTED') ? true : false;
                    
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                "reason":{
                                                                    "type": "section",
                                                                    "htmlClass": "col-sm-3",
                                                                    "condition": "model.liabilityAccount.liabilityComplianceDocuments[arrayIndex].isSignOff === 'REJECTED'",
                                                                    "items": {
                                                                        "reason": {
                                                                            title: "Reason",
                                                                            notitle: true,
                                                                            placeholder: "Reason",
                                                                            key: "liabilityAccount.liabilityComplianceDocuments[].rejectReason",
                                                                            type: "lov",
                                                                            lovonly: true,
                                                                            searchHelper: formHelper,
                                                                            search: function(inputModel, form, model, context) {
                                                                                var f = $filter('filter')(complianceDocument, {"document_code": model.liabilityAccount.liabilityComplianceDocuments[context.arrayIndex].documentName},true);
                                                                                return $q.resolve({
                                                                                    "header": {
                                                                                        "x-total-count": f && f.length
                                                                                    },
                                                                                    "body": f
                                                                                });
                                                                            },
                                                                            getListDisplayItem: function(item, index) {
                                                                                return [item.reject_reason];
                                                                            },
                                                                            onSelect: function(result, model, context) {
                                                                                model.liabilityAccount.liabilityComplianceDocuments[context.arrayIndex].rejectReason = result.reject_reason;
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                "remarksSection5": {                                        
                                                                    "type": "section",
                                                                    "htmlClass": "col-sm-5",
                                                                    "condition": "model.liabilityAccount.liabilityComplianceDocuments[arrayIndex].isSignOff !== 'REJECTED'",
                                                                    "items": {
                                                                        "remarks":{
                                                                            "key": "liabilityAccount.liabilityComplianceDocuments[].remarks",
                                                                            "notitle": true,
                                                                            "placeholder": "Remarks"
                                                                        }
                                                                    }
                                                                },
                                                                "remarksSection2": {                                        
                                                                    "type": "section",
                                                                    "htmlClass": "col-sm-2",
                                                                    "condition": "model.liabilityAccount.liabilityComplianceDocuments[arrayIndex].isSignOff === 'REJECTED'",
                                                                    "items": {
                                                                        "remarks":{
                                                                            "key": "liabilityAccount.liabilityComplianceDocuments[].remarks",
                                                                            "notitle": true,
                                                                            "placeholder": "Remarks"
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    } 
                                                } 
                                            }
                                        },
                                        "lenderDocuments": {
                                            "type": "fieldset",
                                            "title": "LENDER_DOCUMENT_VERIFICATION",
                                            "items": {
                                                "lenderDocuments": {
                                                    "key": "liabilityAccount.liabilityLenderDocuments",
                                                    "type": "array",
                                                    "title": "LEGAL_COMPLIANCE",
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
                                                                    "htmlClass": "col-sm-2",
                                                                    "items": {
                                                                        "documentName": {
                                                                            "key": "liabilityAccount.liabilityLenderDocuments[].documentName",
                                                                            "condition": "model.liabilityAccount.liabilityLenderDocuments[arrayIndex].documentName!='Other'",
                                                                            "notitle": true,
                                                                            "readonly": true
                                                                        },
                                                                        "otherDocumentName": {
                                                                            "key": "liabilityAccount.liabilityLenderDocuments[].otherDocumentName",
                                                                            "condition": "model.liabilityAccount.liabilityLenderDocuments[arrayIndex].documentName=='Other'",
                                                                            "notitle": true,
                                                                            "readonly": true
                                                                        }
                                                                    }
                                                                },
                                                                "upload": {                                        
                                                                    "type": "section",
                                                                    "htmlClass": "col-sm-2",
                                                                    "items": {
                                                                        "upload":{
                                                                            "key": "liabilityAccount.liabilityLenderDocuments[].fileId",
                                                                            "title": "DOWNLOAD_FORM",
                                                                            "notitle": true,
                                                                            "fieldHtmlClass": "btn-block",
                                                                            "style": "btn-default",
                                                                            "icon": "fa fa-download", 
                                                                            "type": "button",
                                                                            "readonly": false
                                                                        }
                                                                    }
                                                                },
                                                                "isSignOff": {
                                                                    "type": "section",
                                                                    "htmlClass": "col-sm-2",
                                                                    "items": {
                                                                        "isSignOff": {
                                                                            "key": "liabilityAccount.liabilityLenderDocuments[].isSignOff",
                                                                            "notitle": true,
                                                                            "required":true,
                                                                            "type": "select",
                                                                            "titleMap": [{
                                                                                "name": "Rejected",
                                                                                "value": "REJECTED"
                                                                            },{
                                                                                "name": "Approved",
                                                                                "value": "APPROVED"
                                                                            }]
                                                                        }
                                                                    }
                                                                },
                                                                "reason":{
                                                                    "type": "section",
                                                                    "htmlClass": "col-sm-3",
                                                                    "condition": "model.liabilityAccount.liabilityLenderDocuments[arrayIndex].isSignOff === 'REJECTED'",
                                                                    "items": {
                                                                        "reason": {
                                                                            title: "Reason",
                                                                            notitle: true,
                                                                            placeholder: "Reason",
                                                                            key: "liabilityAccount.liabilityLenderDocuments[].rejectReason",
                                                                            type: "lov",
                                                                            lovonly: true,
                                                                            searchHelper: formHelper,
                                                                            search: function(inputModel, form, model, context) {
                                                                                var f = $filter('filter')(lenderDocuments, {"document_code": model.liabilityAccount.liabilityLenderDocuments[context.arrayIndex].documentName},true);
                                                                                return $q.resolve({
                                                                                    "header": {
                                                                                        "x-total-count": f && f.length
                                                                                    },
                                                                                    "body": f = _.uniq(f, f.reject_reason)
                                                                                });
                                                                            },
                                                                            getListDisplayItem: function(item, index) {
                                                                               // var mySubArray = _.uniq(item, item.reject_reason);
                                                                                return [item.reject_reason];
                                                                            },
                                                                            onSelect: function(result, model, context) {
                                                                                model.liabilityAccount.liabilityLenderDocuments[context.arrayIndex].rejectReason = result.reject_reason;
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                "remarksSection5": {                                        
                                                                    "type": "section",
                                                                    "htmlClass": "col-sm-5",
                                                                    "condition": "model.liabilityAccount.liabilityLenderDocuments[arrayIndex].isSignOff !== 'REJECTED'",
                                                                    "items": {
                                                                        "remarks":{
                                                                            "key": "liabilityAccount.liabilityLenderDocuments[].remarks",
                                                                            "notitle": true,
                                                                            "placeholder": "Remarks"
                                                                        }
                                                                    }
                                                                },
                                                                "remarksSection2": {                                        
                                                                    "type": "section",
                                                                    "htmlClass": "col-sm-2",
                                                                    "condition": "model.liabilityAccount.liabilityLenderDocuments[arrayIndex].isSignOff === 'REJECTED'",
                                                                    "items": {
                                                                        "remarks":{
                                                                            "key": "liabilityAccount.liabilityLenderDocuments[].remarks",
                                                                            "notitle": true,
                                                                            "placeholder": "Remarks"
                                                                        }
                                                                    }
                                                                }
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
                                        },
                                        {
                                            "type": "button",
                                            "title": "SEND BACK",
                                            "onClick": "actions.back(model, formCtrl, form, $event)"
                                        }
                                    ]
                                }
                            ]
                        }
                    };

                    UIRepository.getLenderLiabilitiesLoanAccountBookingProcess().$promise
                        .then(function(repo) {
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function(form) {
                            self.form = form;
                            console.log("INSIDE HERE 111");
                        })
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
                        
                        PageHelper.showLoader();
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
                        if (model.rejectCompliancedocument || model.rejectLenderDocument) {
                            PageHelper.showProgress('loan', 'Cant proceed as documents is rejected', 5000);
                        } else {
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
                        }
                    },
                    back :function (model, formCtrl, form, $event)
                    {
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("loan", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }
                         model.LiabilityLoanAccountBookingProcess.sendBack("DocumentUpload")
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                PageHelper.showProgress('loan', 'Document SentBack', 5000);
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
