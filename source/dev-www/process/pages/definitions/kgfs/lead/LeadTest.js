define([], function() {
    

    return {
        pageUID: "pahal.lead.LeadTest",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$filter", "$stateParams", "Lead", "LeadHelper", "SessionStore", "formHelper", "entityManager", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "entityManager", "BiometricService", "PagesDefinition", "Queries", "IrfFormRequestProcessor", "$injector", "irfNavigator", "User"],

        $pageFn: function($log, $state, $filter, $stateParams, Lead, LeadHelper, SessionStore, formHelper, entityManager, $q, irfProgressMessage,
            PageHelper, Utils, entityManager, BiometricService, PagesDefinition, Queries, IrfFormRequestProcessor, $injector, irfNavigator, User) {

            var branch = SessionStore.getBranch();
            
        

           
            return {
                "type": "schema-form",
                "title": "LEAD_GENERATION",
                "subTitle": "Lead",
                initialize: function(model, form, formCtrl) {

                    model.siteCode = SessionStore.getGlobalSetting('siteCode');
                    model.lead = model.lead || {};
                    model.lead.leadInteractions1 = [{
                        'interactionDate':'03-03-2018',
                        'interested':'YES',
                        'loanOfficerId':'ABC',
                        'typeOfInteraction':'Call',
                        'customerResponse':'Yes1',
                        'additionalRemarks':'Yes1'
                    }, {
                        'interactionDate':'03-03-2018',
                        'interested':'NO',
                        'loanOfficerId':'XYZ',
                        'typeOfInteraction':'Visit',
                        'customerResponse':'NO',
                        'additionalRemarks':'NO'
                    }]
                   
                   

                },
                offline: true,
                getOfflineDisplayItem: function(item, index) {
                    return [
                        item.lead.leadName
                    ]
                },

                form: [{
                    
                        type: "box",
                        title: "PREVIOUS_INTERACTIONS",
                        
                        items: [{
                            
                                key: "lead.leadInteractions1",
                                type: "pivotarray",
                                addButtonExpr: " ('ADD' | translate ) + ' ' + (pivotValue | translate)",
                                // "('CUSTOMER_ID'|translate)+' (Artoo)'",
                                pivotFieldEnumCode:'decisionmaker',
                                pivotField:"interested",
                                view: "fixed",
                                title: "Interaction History",
                                items: [{
                                    
                                        key: "lead.leadInteractions1[].interactionDate",
                                        type: "date",
                                        
                                    },
                                    {
                                        key:"lead.leadInteractions1[].interested",
                                        type:"select",
                                        title:"INTERESTED",
                                        enumCode:"decisionmaker"
                                    },
                                    {
                                        key: "lead.leadInteractions1[].loanOfficerId",
                                        readonly: true,
                                    },
                                   {
                                        key: "lead.leadInteractions1[].typeOfInteraction",
                                        type: "select",
                                        
                                        titleMap: {
                                            "Call": "Call",
                                            "Visit": "Visit",
                                        },
                                    },
                                     {
                                        key: "lead.leadInteractions1[].customerResponse",
                                        
                                    },
                                    {
                                        key: "lead.leadInteractions1[].additionalRemarks",
                                    }
                                ]
                            
                        }]
                    
                }],

                schema: function() {
                    return Lead.getLeadSchema().$promise;
                },

                actions: {
                    changeStatus: function(modelValue, form, model) {

                         if (model.lead.interestedInProduct == 'NO' || model.lead.eligibleForProduct == 'NO') {
                            model.lead.leadStatus = "Reject";
                        } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == '< 1 month') {
                            model.lead.leadStatus = "Screening";
                        } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == '> 1 month' ) {
                            model.lead.leadStatus = "FollowUp";
                        } else {
                            model.lead.leadStatus = "Incomplete";
                        }
                    },
                    preSave: function(model, form, formName) {
                        var deferred = $q.defer();
                        if (model.lead.leadName) {
                            deferred.resolve();
                        } else {
                            irfProgressMessage.pop('lead-save', 'Applicant Name is required', 3000);
                            deferred.reject();
                        }
                        return deferred.promise;
                    }

                    
                }
            };
        }
    }
})


