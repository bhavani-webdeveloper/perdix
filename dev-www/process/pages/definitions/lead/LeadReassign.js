irf.pageCollection.factory(irf.page("lead.LeadReassign"), ["$log", "$state", "$stateParams", "Lead", "SessionStore",
 "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries",


    function($log, $state, $stateParams, Lead, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "LEAD_ASSIGN",
            "subTitle": "Lead",
            initialize: function(model, form, formCtrl) {

                model.lead = model.lead || {};
                model.branch = branch;
                model.branchId = SessionStore.getBranchId() + '';

                model.lead.currentDate = model.lead.currentDate || Utils.getCurrentDate();
                model.lead.ActionTakenBy = model.lead.ActionTakenBy || SessionStore.getLoginname();

                model = Utils.removeNulls(model, true);
                model.lead.BranchName = SessionStore.getBranch();

                $log.info("create new lead generation page ");

            },
            modelPromise: function(pageId, _model) {
                return $q.resolve({
                    lead: {
                        Name: "Ram",
                        leadId: 1,
                        branchName:"madurai",
                        mobileNo: 9888888888
                    }
                });
            },

            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return []
            },

            form: [{
                    "type": "box",
                    readonly: true,
                    "title": "",
                    "items": [{
                        key: "lead.currentDate",
                        title: "CURRENT_DATE",
                        type: "date",
                        readonly: true
                    }, {
                        key: "lead.branchName",
                        title: "BRANCH_NAME",
                        readonly: true
                    }, {
                        key: "lead.leadId",
                        readonly: true
                    }, {
                        key: "lead.mobileNo",
                        readonly: true
                    }]
                },

                {
                    type: "box",
                    title: "ASSIGN_LEAD",
                    items: [{
                        key: "lead.LoanOfficer",
                        type: "lov",
                        title: "LOAN_OFFICER",
                        inputMap: {
                            "HubName": {
                                "key": "lead.branchName",
                                type: "select",
                                "enumCode": "branch" 
                            },
                            "SpokeName": {
                               key: "lead.spokeName",
                               "enumCode": "centre",
                               type: "select",
                               "filter": {
                                    "parentCode as branch": "model.branch"
                                }
                            },
                        },
                        outputMap: {

                            "LoanOfficer": "lead.LoanOfficer"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            /*
                                 if (!inputModel.branchName)
                                     inputModel.branchName = SessionStore.getBranch();
                                 var promise = Enrollment.search({
                                     'branchName': inputModel.branchName,
                                     'firstName': inputModel.firstName,
                                     'centreCode': inputModel.centreCode,
                                     'customerType': 'Individual'
                                 }).$promise;

                                 */
                            return $q.resolve({
                                headers: {
                                    "x-total-count": 4
                                },
                                body: [{

                                        "LoanOfficer": "Stalin",

                                    }, {
                                        "LoanOfficer": "Ravi",

                                    }, {
                                        "LoanOfficer": "Raj",

                                    }, {
                                        "LoanOfficer": "Ram",
                                    },

                                ]
                            });
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                data.LoanOfficer,
                            ];
                        }
                    }, ]
                }, {
                    "type": "actionbox",

                    "items": [

                        {
                            "type": "submit",
                            "title": "ASSIGN"
                        },
                    ]
                },
            ],
            schema: function() {
                return Lead.getLeadSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {
                    $log.info("Inside submit()");
                    irfProgressMessage.pop('Lead-ASSIGN', 'Lead is successfully assigned to LoanOfficer', 3000);
                    $log.warn(model);
                }
            }

        };
    }
]);