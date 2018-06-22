define([], function() {

    return {
        pageUID: "payment.PaymentConfirmation",
        pageType: "Engine",
        dependencies: ["$log", "irfElementsConfig", "Enrollment", "SessionStore", "formHelper", "$q",
            "PageHelper", "PagesDefinition", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator"
        ],

        $pageFn: function($log, elementsConfig, Enrollment, SessionStore, formHelper, $q,
            PageHelper, PagesDefinition, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator) {

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
                        "required": true,
                        "type": "lov",
                        lovonly: true,
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            return $q.resolve({
                                headers: {
                                    "x-total-count": [].length
                                },
                                body: []
                            });
                        },
                        getListDisplayItem: function(item, index) {
                            return [];
                        },
                        onSelect: function(result, model, context) {
                            
                        }
                    },
                }
            } 
            var getIncludes = function(model) {
                return [
                    "UploadPaymentConfirmation",
                    "UploadPaymentConfirmation.debitAccount",
                    "UploadPaymentConfirmation.uploadPaymentConfirmation"
                ]
            }
            return {
                "type": "schema-form",
                "title": "PAYMENT_CONFORMATION",
                "subTitle": "",
                initialize: function(model, form, formCtrl) {
                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "additions": [{
                                "type": "actionbox",
                                "orderNo": 1000,
                                "items": [
                                    {
                                    "type": "submit",
                                    "title": "UPDATE"
                                }]
                            }]
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
                schema: function() {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    save: function(model, formCtrl, form, $event) {
                        
                    },
                    proceed: function(model, formCtrl, form, $event) {
                        
                    },
                    update: function(model, formCtrl, form, $event) {
                    
                    }
                }
            };
        }
    }
})