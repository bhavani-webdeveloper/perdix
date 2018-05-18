irf.pageCollection.factory(irf.page("customer360.CustomerSummary"),
["$log", "SessionStore", "PageHelper", "formHelper", "RolesPages", "Utils", "translateFilter","Enrollment",
    function($log, SessionStore, PageHelper, formHelper, RolesPages, Utils, translateFilter,Enrollment) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "CUSTOMER_SUMMARY",
            initialize: function(model, form, formCtrl) {
                model.customerSumary = model.customerSumary || {};

            },
                 form: [ {
                        "type": "box",
                        "readonly": true,
                        "colClass": "col-sm-12",
                        "overrideType": "default-view",
                        "title": "SEGMANT",
                        "items": [{
                            "type": "grid",
                            "orientation": "horizontal",
                            "items": [{
                                "type": "grid",
                                "orientation": "vertical",
                                "items": [{
                                    "key": "customerSumary.segmant_name",
                                    "title": "SEGMANT_NAME",
                                    "type": "string"
                                }, {
                                    "key": "customerSumary.Last_interaction",
                                    "title": "LAST_INTERACTION",
                                    "type": "string"
                                },
                                {
                                    "key": "customerSumary.last_edited_date",
                                    "title": "LAST_EDITED_DATE",
                                    "type": "date"
                                },
                                {
                                    "key": "customerSumary.target_product",
                                    "title": "TARGET_PRODUCT",
                                    "type": "string"
                                }


                                ]
                            }]
                        }]
                    }
            ],
             Enrollment.getCustomerSummary({
                    
                }).$promise.then(function(res) {
                    $log.warn("res");
                    $log.warn(res);                    
                    model.customerSumary = res;
                    

                    
                }, function(e) {
                    model.cibil_highmark = null;
                });
            }
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "customerSumary": {
                        "type": "object",
                        "title": "Address",
                        "properties": {
                            "streetAddress": {
                                "type": "string",
                                "title": "Street Address"
                            },
                            "city": {
                                "type": "string",
                                "title": "City"
                            }
                        }
                    }
                }
            },
            actions: {
                submit: function(model, form, formName) {                }
            }
        };
    }
]);