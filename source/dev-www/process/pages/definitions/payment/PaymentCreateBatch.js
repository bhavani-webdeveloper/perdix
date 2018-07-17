define([], function() {      

    return {
        pageUID: "payment.PaymentCreateBatch",
        pageType: "Engine",
        dependencies: ["$log", "irfElementsConfig", "Enrollment", "SessionStore", "formHelper", "$q",
            "PageHelper", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator", "Payment",
        ],

        $pageFn: function($log, elementsConfig, Enrollment, SessionStore, formHelper, $q,
            PageHelper, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator, Payment) {

            var configFile = function() {
                return {}
            }
            var overridesFields = function() {
                return {
                    "CreateBatch":{
                        colClass: "col-sm-8",
                        "orderNo": 10,
                    },
                    "BatchSummary":{
                            "condition": "model.dispatch",
                    },
                    "CreateBatch.debitAccountName":{
                        "resolver": "PaymentBankAccountsLOVConfiguration"
                    },
                }
            } 
            var getIncludes = function(model) {
                return [                  
                    "CreateBatch",
                    "CreateBatch.paymentDate",
                    "CreateBatch.beneficiaryBankBranch",
                    "CreateBatch.spokeName",
                    "CreateBatch.debitAccountName",
                    "CreateBatch.beneficiaryName",
                    "CreateBatch.paymentType",
                    "CreateBatch.paymentPurpose",
                    "CreateBatch.beneficiaryAccountName",
                    "CreateBatch.submit",
                    "BatchSummary",
                    "BatchSummary.dispatchId",
                    "BatchSummary.bankCode",
                    "BatchSummary.debitAccountNumbe",
                    "BatchSummary.count",
                    "BatchSummary.totalAmount",

                ]
            }
            return {
                "type": "schema-form",
                "title": "READY_FOR_DISPATCH",
                "subTitle": "",
                initialize: function(model, form, formCtrl) {                   
                    var self = this;                  
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {
                                "CreateBatch":  {
                                "items":{
                                    "submit": {                                         
                                        "type": "submit",
                                        "title": "Create Batch",
                                        "onClick": "actions.submit(model, formCtrl, form, $event)"  
                                    }
                                }                                                           }
                            }
                        }
                    };
                   
                    PageHelper.showLoader();

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
                                "debitAccountName": {
                                    "title": "DEBIT_ACCOUNT_NAME",
                                    "type": "string"
                                },
                                "debitAccountNumber": {
                                    "title": "DEBIT_ACCOUNT_NO",
                                    "type": "string"
                                }
                            }
                        }
                    }
                },
                actions: {
                    submit: function(model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("payment", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }                       
                        
                        model.payment.currentStage = "ReadyForManualDispatch";
                        model.payment.paymentType = "Manual";
                        PageHelper.showLoader();
                        Payment.search(model.payment).$promise.then(function(resp) {  
                          // response = resp                         
                           if(resp.body.length > 0){
                            Payment.createBatch(resp.body).$promise.then(function(res) {                              //return res;    
                                model.dispatch = res;
                            }, function(err){                                
                                PageHelper.showErrors(err); 
                            }).finally(function() {                       
                                PageHelper.hideLoader();                            
                            });
                           } else {
                                PageHelper.showProgress("payment", "Transaction details are not available for the search.", 5000);
                                PageHelper.hideLoader();                     
                           }                            
                     
                    }, function(errResp) {
                            PageHelper.showErrors(errResp);
                            PageHelper.hideLoader();
                        });                                
                    },
                }
            };
        }
    }
})