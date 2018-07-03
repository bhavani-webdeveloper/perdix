define(['perdix/domain/model/payment/PaymentProcess'], function(PaymentProcess) {
    PaymentProcess = PaymentProcess['PaymentProcess'];
    
    return {
        pageUID: "payment.PaymentRejectedQueue",
        pageType: "Engine",
        dependencies: ["$http","$log", "irfElementsConfig","$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "PagesDefinition", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator", "Files"
        ],

        $pageFn: function($http,$log, elementsConfig,$state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
            PageHelper, Utils, PagesDefinition, $filter, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator, Files) {

            var configFile = function() {
                return {}
            }         
            var overridesFields = function(bundlePageObj) {
                return {    
                    "PaymentDetails":{
                        "orderNo": 20,
                    },

                    "BeneficiaryDetails":{
                        "orderNo": 10,
                    },

                    "DebitAccountDetails":{
                        "orderNo": 30,
                    }, "PaymentDetails.modeOfPayment":{
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
                        "type": "lov",
                        "resolver": "CustomerBankAccountsLOVConfiguration" ,
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
                        "resolver": "PaymentBankIFSCLOVConfiguration",  
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

                        "resolver": "PaymentBankAccountsLOVConfiguration",
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
                    "PaymentDetails.accountNumber":{
                        "resolver": "LoanAccountsLOVConfiguration"                      
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
                                        "title": "REPROCESS",
                                        "onClick": "actions.proceed(model, formCtrl, form, $event)"
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
                schema: function() {
                    return Enrollment.getSchema().$promise;
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