define(['perdix/domain/model/payment/PaymentProcess'], function(PaymentProcess) {
    PaymentProcess = PaymentProcess['PaymentProcess'];
    
    return {
        pageUID: "payment.PaymentInitiation",
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
                            "orderNo":10
                    },
                    "BeneficiaryDetails":{
                        "orderNo":20
                    },
                    "DebitAccountDetails":{
                        "orderNo":30
                    },
                    "BeneficiaryDetails.beneficiaryName": {
                        "orderNo":1
                    },
                    "BeneficiaryDetails.beneficiaryAccountName":{
                        "orderNo":20
                    },
                    "BeneficiaryDetails.beneficiaryEmailId":{
                        "orderNo":30
                    },         
                    "BeneficiaryDetails.beneficiaryMobileNumber":{
                        "orderNo":40
                    },
                    "BeneficiaryDetails.creditAccountNo":{
                        "orderNo":50
                    },
                    "BeneficiaryDetails.confirmAccountNo":{
                        "orderNo":60
                    },
                    "BeneficiaryDetails.beneficiaryBankName":{
                        "orderNo":80
                    },
                    "BeneficiaryDetails.beneficiaryBankBranch":{
                        "orderNo":90
                    },
                    "BeneficiaryDetails.beneficiaryTransactionParticulars":{
                        "orderNo":100
                    },
                    "BeneficiaryDetails.beneficiaryTransactionRemarks":{
                        "orderNo":110
                    },
                    "PaymentDetails.accountNumber":{
                        "resolver": "LoanAccountsLOVConfiguration"                      
                    },
                    "DebitAccountDetails.debitAccountName":{
                        "resolver": "PaymentBankAccountsLOVConfiguration"
                    },
                    "BeneficiaryDetails.beneficiaryIfsc":{
                        "resolver": "PaymentBankIFSCLOVConfiguration",
                        "orderNo":70
                    },
                    "BeneficiaryDetails.beneficiaryName":{
                        "type": "lov",
                        "resolver": "CustomerBankAccountsLOVConfiguration"                       
                       
                    }
                    
                };
            }
            var getIncludes = function(model) {
                return [
                    "PaymentDetails",
                    "PaymentDetails.modeOfPayment",
                    "PaymentDetails.amount",
                    "PaymentDetails.fileId",
                    "PaymentDetails.paymentPurpose",
                    "PaymentDetails.accountNumber",
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
                ];
            }
            return {
                "type": "schema-form",
                "title": "PAYMENT_INITIATION",
                "subTitle": "",
                initialize: function(model, form, formCtrl) {                     
                
                    var self = this;

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
                                        "title": "PROCEED",
                                        "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                    },
                                    {
                                        "type": "button",
                                        "title": "SAVE",
                                        "onClick": "actions.save(model, formCtrl, form, $event)"
                                    }
                                ]
                            },
                            {
                                "type": "actionbox",
                                "condition": "!model.payment.id",
                                "orderNo": 1200,
                                "items": [
                                    {
                                        
                                        "type": "button",
                                        "title": "SUBMIT",
                                        "onClick": "actions.submit(model, formCtrl, form, $event)"
                                    }
                                ]
                            }
                        ]
                    }
                    };


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
                    save: function(model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
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
                    submit: function(model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        PageHelper.showLoader();

                        model.PaymentProcess.submit()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                PageHelper.showProgress('payment', 'payment Submited.', 5000);
                                PageHelper.clearErrors(); 
                                $state.go("Page.Engine", {
                                    pageName: "payment.paymentInitiationSearch",
                                    pageId: null
                                }); 
                               
                                                            
                            }, function (err) {
                                PageHelper.showProgress('payment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                      
                    },
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
                                    irfNavigator.goBack();
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