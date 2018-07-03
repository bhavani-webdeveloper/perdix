define(['perdix/domain/model/payment/PaymentProcess'], function(PaymentProcess) {
    PaymentProcess = PaymentProcess['PaymentProcess'];
    
    return {
        pageUID: "payment.PaymentApproval",
        pageType: "Engine",
        dependencies: ["$http","$log", "irfElementsConfig","$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "PagesDefinition", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator", "Files", "Payment"
        ],

        $pageFn: function($http,$log, elementsConfig,$state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
            PageHelper, Utils, PagesDefinition, $filter, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator, Files, Payment) {

            var configFile = function() {
                return {}
            }         
            var overridesFields = function(bundlePageObj) {
                return {    
                    "PaymentDetails":{
                        "orderNo": 20,
                    },

                    "PostReviewDecision.rejectsectionremarks":{

                        "condition": "model.payment.status=='REJECT'",
                    },
                    "PostReviewDecision.rejectsectionbutton":{

                        "condition": "model.payment.status=='REJECT'",
                    },
                    "PostReviewDecision.sendbacksectionremarks":{

                        "condition": "model.payment.status=='SEND_BACK'",
                    },
                    "PostReviewDecision.sendbacksectionbutton":{

                        "condition": "model.payment.status=='SEND_BACK'",
                    },
                    "PostReviewDecision.proceedsectionremarks":{

                        "condition": "model.payment.status=='PROCEED'",
                    },
                    "PostReviewDecision.proceedsectionbutton":{

                        "condition": "model.payment.status=='PROCEED'",
                    },                   

                    "BeneficiaryDetails":{
                        "orderNo": 10,
                    },

                    "DebitAccountDetails":{
                        "orderNo": 30,
                    },
                    "PaymentDetails.modeOfPayment":{
                        "readonly":true,
                        "orderNo": 1,
                    },
                    "PaymentDetails.amount":{
                        "readonly":true,
                        "orderNo": 2,
                    },
                    "PaymentDetails.fileId":{
                        "readonly":true,
                        "orderNo": 3,
                    },
                    "PaymentDetails.paymentPurpose":{
                        "readonly":true,
                        "orderNo": 4,
                    },
                    "PaymentDetails.transactionType":{
                        "readonly":true,
                        "orderNo": 5,
                    },
                    "PaymentDetails.paymentDate":{
                        "readonly":true,
                        "orderNo": 6,
                    },
                    "BeneficiaryDetails.beneficiaryName":{
                        "readonly":true,
                        "orderNo": 1,
                    },
                    "BeneficiaryDetails.beneficiaryAccountName":{
                        "readonly":true,
                        "orderNo": 2,
                    },
                    "BeneficiaryDetails.beneficiaryEmailId":{
                        "readonly":true,
                        "orderNo": 3,
                    },                  
                    "BeneficiaryDetails.beneficiaryMobileNumber":{
                        "readonly":true,
                        "orderNo": 4,
                    },
                    "BeneficiaryDetails.creditAccountNo":{
                        "readonly":true,
                        "orderNo": 5,
                    },
                    "BeneficiaryDetails.confirmAccountNo":{
                        "readonly":true,
                         "orderNo": 6,
                    },
                    "BeneficiaryDetails.beneficiaryIfsc":{
                        "readonly":true,
                        "orderNo": 7,
                    },
                    "BeneficiaryDetails.beneficiaryBankName":{
                        "readonly":true,
                        "orderNo": 8,
                    },
                    "BeneficiaryDetails.beneficiaryBankBranch":{
                        "readonly":true,
                        "orderNo": 9,
                    },
                    "BeneficiaryDetails.beneficiaryTransactionParticulars":{
                        
                        "orderNo": 10,
                    },
                    "BeneficiaryDetails.beneficiaryTransactionRemarks":{
                       
                        "orderNo": 11,
                    },
                    "DebitAccountDetails.debitAccountName":{
                        "readonly":true,
                        "orderNo": 1,
                    },
                    "DebitAccountDetails.debitAccountNumber":{
                        "readonly":true,
                        "orderNo": 2,
                    },
                    "DebitAccountDetails.debitMobileNumber":{
                        "readonly":true,
                        "orderNo": 3,
                    },  
                    "DebitAccountDetails.debitTransactionParticulars":{                       
                        "orderNo": 4,
                    },
                    "DebitAccountDetails.debitTransactionRemarks":{                       
                        "orderNo": 5,
                    },                 
                    
                };
            }
            var getIncludes = function(model) {
                return [
                    "PaymentDetails",
                    "PaymentDetails.modeOfPayment",
                    "PaymentDetails.amount",
                    "PaymentDetails.fileId",
                    "PaymentDetails.paymentPurpose",
                    "PaymentDetails.transactionType",
                    "PaymentDetails.paymentDate",
                    "BeneficiaryDetails",
                    "BeneficiaryDetails.beneficiaryName",
                    "BeneficiaryDetails.beneficiaryAccountName",
                    "BeneficiaryDetails.beneficiaryEmailId",                  
                    "BeneficiaryDetails.beneficiaryMobileNumber",
                    "BeneficiaryDetails.creditAccountNo",
                    "BeneficiaryDetails.confirmAccountNo",
                    "BeneficiaryDetails.beneficiaryIfsc",
                    "BeneficiaryDetails.beneficiaryBankName",
                    "BeneficiaryDetails.beneficiaryBankBranch",
                    "BeneficiaryDetails.beneficiaryTransactionParticulars",
                    "BeneficiaryDetails.beneficiaryTransactionRemarks",
                    "DebitAccountDetails",
                    "DebitAccountDetails.debitAccountName",
                    "DebitAccountDetails.debitAccountNumber",
                    "DebitAccountDetails.debitMobileNumber",
                    "DebitAccountDetails.debitTransactionParticulars",
                    "DebitAccountDetails.debitTransactionRemarks",
                    "PostReviewDecision",
                    "PostReviewDecision.status",
                    "PostReviewDecision.rejectsectionremarks",
                    "PostReviewDecision.rejectsectionbutton",
                    "PostReviewDecision.sendbacksectionremarks",
                    "PostReviewDecision.sendbacksectionbutton",
                    "PostReviewDecision.proceedsectionremarks",
                    "PostReviewDecision.proceedsectionbutton",
                ];
            }
            return {
                "type": "schema-form",
                "title": "PAYMENT_APPROVAL",
                "subTitle": "",
                initialize: function(model, form, formCtrl) {                     
                
                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "additions": [
                            {
                                "type": "actionbox",
                                "orderNo": 1000,
                                "items": [
                                    {
                                        "type": "button",
                                        "title": "Save",
                                        "onClick": "actions.save(model, formCtrl, form, $event)"
                                    }
                                ]
                            }
                        ]
                    }
                    };

                    PageHelper.showLoader();                  
                    var pLoadInit;
                    if (!_.hasIn($stateParams, 'pageId') || _.isNull($stateParams.pageId)) {
                        var obs = PaymentProcess.create();
                        pLoadInit = obs.toPromise();
                        obs.subscribe(function(res) {
                            model.PaymentProcess = res;
                            model.payment = res.payment;
                        })
                    } else {
                        var obs = PaymentProcess.get($stateParams.pageId);
                        pLoadInit = obs.toPromise();
                        obs.subscribe(function(res) {
                            PageHelper.hideLoader();
                            model.PaymentProcess = res;
                            model.payment = res.payment;
                        })
                    }

                    UIRepository.getPaymentDetails().$promise
                        .then(function(repo) {
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function(form) {
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
                schema: {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "type": "object",
                    "properties": {
                        "payment": {
                            "type": "object",
                            "required": [],
                            "properties": {
                                "beneficiaryIfsc": {
                                    "title": "BANK_IFSC",
                                    "type": "string"
                                },
                                "beneficiaryBankName": {
                                    "title": "BANK_NAME",
                                    "type": "string"
                                },
                                "beneficiaryBankBranch": {
                                    "title": "BRANCH_NAME",
                                    "type": "string"
                                },
                                "debitAccountName": {
                                    "title": "DEBIT_ACCOUNT_NAME",
                                    "type": "string"
                                },
                                "debitAccountNumber": {
                                    "title": "DEBIT_ACCOUNT_NO",
                                    "type": "string"
                                }
                            }
                        },
                        "customer": {
                            "type": "object",
                            "required": [],
                            "properties": {
                                "urnNo": {
                                    "type": ["string","null"],
                                    "title": "URN_NO"
                                }
                            }
                        },
                        "loanAccount": {
                            "type": "object",
                            "required": [],
                            "properties": {
                                "accountNumber": {
                                    "title": "ACCOUNT_NUMBER",
                                    "type": ["string", "null"]
                                }
                            }
                        }
                    }
                },
                actions: {
                    proceed: function(model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("payment", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }
                            PageHelper.showLoader();
                            model.PaymentProcess.proceed()
                                .finally(function() {
                                    PageHelper.hideLoader();
                                })
                                .subscribe(function(value) {
                                    PageHelper.showProgress('payment', 'payment Proceed.', 5000);
                                    PageHelper.clearErrors();
                                    $state.go("Page.PaymentDashboard");
                                }, function(err) {
                                    PageHelper.showProgress('payment', 'Oops. Some error.', 5000);
                                    PageHelper.showErrors(err);
                                    PageHelper.hideLoader();
                                });
                        
                    },
                    save: function(model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("payment", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }
                        PageHelper.showLoader();
                        model.PaymentProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                PageHelper.showProgress('payment', 'payment Saved.', 5000);
                                PageHelper.clearErrors();  
                                                            
                            }, function (err) {
                                PageHelper.showProgress('payment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                      
                    },
                    reject: function(model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("payment", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }
                            PageHelper.showLoader();
                            model.PaymentProcess.reject()
                                .finally(function() {
                                    PageHelper.hideLoader();
                                })
                                .subscribe(function(value) {
                                    PageHelper.showProgress('payment', 'payment Reject.', 5000);
                                    PageHelper.clearErrors(); $state.go("Page.Engine", {
                                    pageName: "payment.paymentRejected",
                                    pageId: null
                                }); 
                                }, function(err) {
                                    PageHelper.showProgress('payment', 'Oops. Some error.', 5000);
                                    PageHelper.showErrors(err);
                                    PageHelper.hideLoader();
                                });
                        
                    },
                    sendBack: function(model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("payment", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }
                            PageHelper.showLoader();
                            model.PaymentProcess.sendBack()
                                .finally(function() {
                                    PageHelper.hideLoader();
                                })
                                .subscribe(function(value) {
                                    PageHelper.showProgress('payment', 'payment Send Back.', 5000);
                                    PageHelper.clearErrors();
                                    $state.go("Page.PaymentDashboard");
                                }, function(err) {
                                    PageHelper.showProgress('payment', 'Oops. Some error.', 5000);
                                    PageHelper.showErrors(err);
                                    PageHelper.hideLoader();
                                });
                        
                    }
                }
            };
        }
    }
})