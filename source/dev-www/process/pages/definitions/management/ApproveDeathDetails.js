define({
    pageUID: "management.ApproveDeathDetails",
    pageType: "Engine",
    dependencies:  ["$log", "irfNavigator", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "translateFilter", "$stateParams", "Queries", "DeathMarking"],
    $pageFn:function($log, irfNavigator, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, translateFilter, $stateParams, Queries, DeathMarking) {
            return {
            "type": "schema-form",
            "title": "APPROVE_DEATH_DETAILS",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.approveDeathDetails = {};
                model.approveDeathDetails = $stateParams.pageData;
            },
            form: [
                {
                    "type": "box",
                    colClass: "col-sm-12",
                    "title": "DETAILS",
                    "items": [
                        {  
                            "key": "approveDeathDetails.name",
                            "type": "string",
                            "title": "APPROVE_DEATH_NAME",
                            readonly:true
                        },
                        {
                            "key": "approveDeathDetails.urnNo",
                            "type": "string",
                            "title": "APPROVE_DEATH_URN",
                            readonly:true
                        },
                        {
                            "key": "approveDeathDetails.customer",
                            "type": "string",
                            "title": "APPROVE_DEATH_CUSTOMER_OR_MEMBER",
                            readonly:true
                        },
                        {
                            "key": "approveDeathDetails.natureOfDeath",
                            "type": "string",
                            "title": "APPROVE_DEATH_NATURE_OF_DEATH",
                            readonly:true
                        },
                        {
                            "key": "approveDeathDetails.dateOfIncident",
                            "type": "string",
                            "title": "APPROVE_DEATH_DATE_OF_INCIDENT",
                            readonly:true
                        },
                        {
                            "key": "approveDeathDetails.details",
                            "type": "string",
                            "title": "APPROVE_DEATH_DETAILS",
                            readonly:true
                        },
                        {
                            "key": "approveDeathDetails.comments",
                            "type": "string",
                            "title": "APPROVE_DEATH_COMMENTS",
                            readonly: true
                        },
                    ]
                },
                {
                    type: "actionbox",
                    items: [
                        {
                            type: "submit",
                            title: "APPROVE",                           
                        },
                        {
                            type: "button",
                            title: "BACK",
                            onClick: function(model, form, formName) {
                                irfNavigator.goBack();
                            }
                        }                      
                    ]
                },
                
            ],
            schema: function() {               
                return DeathMarking.deathMarkingSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {
                },
            }
        };
    }
});