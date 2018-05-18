irf.pageCollection.factory(irf.page("customer360.CustomerSummaryView"),
["$log", "SessionStore", "PageHelper", "formHelper", "RolesPages", "Utils", "translateFilter","Enrollment",
    function($log, SessionStore, PageHelper, formHelper, RolesPages, Utils, translateFilter,Enrollment) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "CUSTOMER_SUMMARY",
            initialize: function(model, form, formCtrl) {
                model.customerSumary = model.customerSumary || {};
                var init = function(response){
                    model.customerSumary = response;
                }

              Enrollment.getCustomerSummary().$promise.then(
                    function(res) {
                    $log.info("res");
                    $log.warn(res );                    
                    
                    init(res)
                }, function(e) {
                    model.customerSumary = null;
                });
            },

            form: [{
                    "type": "box",
                    "readonly": true,
                    "key":"customerSumary.segmant",
                    "colClass": "col-sm-6",
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
                    },
                    {
                    "type": "box",
                    "readonly": true,
                    "key":"customerSumary.houseHoldingComposition",
                    "colClass": "col-sm-6",
                    "overrideType": "default-view",
                    "title": "HOUSEHOLDINGCOMPOSITION",
                    "items": [{
                            "type": "grid",
                            "orientation": "horizontal",
                            "items": [{
                                "type": "grid",
                                "orientation": "vertical",
                                "items": [{
                                    "key": "customerSumary.dependents",
                                    "title": "SEGMANT_NAME",
                                    "type": "string"
                                }, {
                                    "key": "customerSumary.below_18",
                                    "title": "LAST_INTERACTION",
                                    "type": "number"
                                },
                                  {
                                    "key": "customerSumary.between_18_27",
                                    "title": "TARGET_PRODUCT",
                                    "type": "number"
                                },
                                {
                                    "key": "customerSumary.above_27",
                                    "title": "TARGET_PRODUCT",
                                    "type": "number"
                                }


                                ]
                            },

                            {
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

                        },
                        ]
                    }
                ],

          
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "customerSumary": {
                        "type": "object",
                        "title": "Address",
                        "properties": {
                            "segmantName": {
                                "type": "string",
                                "title": "Segment Name"
                            },
                            "LastInteraction": {
                                "type": "string",  
                                "title": "Last Interaction"
                            },
                            "lastEditedDate": {
                                "type": "date",
                                "title": "Last Edited Date"
                            },
                             "targetProduct": {
                                "type": "string",
                                "title": "Target Product"
                            }
                        }
                    }
                }
            },
           
            actions: {
                submit: function(model, form, formName) {                
                }
            }
        };
    }
]);