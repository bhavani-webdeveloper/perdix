define([], function() {

    return {
        pageUID: "payment.PaymentConfirmation",
        pageType: "Engine",
        dependencies: ["$log", "irfElementsConfig", "Enrollment", "SessionStore", "formHelper", "$q",
            "PageHelper", "PagesDefinition", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator", "Payment"
        ],

        $pageFn: function($log, elementsConfig, Enrollment, SessionStore, formHelper, $q,
            PageHelper, PagesDefinition, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator, Payment) {

            var configFile = function() {
                return {}
            }
            var overridesFields = function(bundlePageObj) {
                return {
                    "UploadPaymentConfirmation":{
                        colClass: "col-sm-8",
                        "orderNo": 10,
                    },
                    "UploadPaymentConfirmation.debitAccount":{
                        "resolver": "PaymentBankAccountsLOVConfiguration"
                    },
                }
            } 
            var getIncludes = function(model) {
                return [
                    "UploadPaymentConfirmation",
                    "UploadPaymentConfirmation.uploadPaymentConfirmation"
                ]
            }
            return {
                "type": "schema-form",
                "title": "PAYMENT_CONFIRMATION",
                "subTitle": "",
                initialize: function(model, form, formCtrl) {
                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {                             
                                "UploadPaymentConfirmation": {
                                    "type": "box",
                                    "title": "UPLOAD_PAYMENT_CONFIRMATION",
                                    "colClass": "col-sm-6",
                                    "items": {
                                        "uploadPaymentConfirmation": {
                                            "key": "payment.uploadPaymentConfirmation",                                            
                                            "title": "UPLOAD_PAYMENT_CONFIRMATION",
                                            "category": "ACH",
                                            "subCategory": "cat2",
                                            "type": "file",
                                            "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                            customHandle: function(file, progress, modelValue, form, model) {
                                                Payment.paymentConformation(file, progress).then(function(res) {
                                                    PageHelper.showProgress('payment', 'payment confirm.', 5000);                                   
                                                }, function(err) {
                                                    if(err.data.errorMessage){
                                                        err.data.error = err.data.errorMessage;
                                                    }
                                                    
                                                   PageHelper.showErrors(err)
                                                });
                                            }
                                        }
                                    }
                                }
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
                schema: function () {
                    return Enrollment.getSchema().$promise;
                }
            };
        }
    }
})