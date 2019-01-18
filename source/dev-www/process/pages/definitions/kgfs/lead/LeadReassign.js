define(['perdix/domain/model/lead/LeadRepository'], function(LeadRepository) {
    return {
        pageUID: "pahal.lead.LeadReassign",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Lead", "SessionStore",
        "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries", "LeadHelper", "irfNavigator"],

        $pageFn: function($log, $state, $stateParams, Lead, SessionStore, formHelper, $q, irfProgressMessage,
            PageHelper, Utils, PagesDefinition, Queries, LeadHelper, irfNavigator) {
            var leadRepo = new LeadRepository();
            return {
                "type": "schema-form",
                "title": "LEAD_ASSIGN",
                "subTitle": "Lead",
                initialize: function(model, form, formCtrl) {
                    model.lead = model.lead || {};
                    model.customer = model.customer || {};
                    model = Utils.removeNulls(model, true);
                    $log.info("create new lead assign page ");

                    if ($stateParams.pageData) {
                        var leadarray = $stateParams.pageData;
                        $log.info(leadarray);
                        model.lead.leads=leadarray;
                        model.customer.branchName=leadarray[0].branchName;
                        var branches = formHelper.enum('branch_id').data;
                        $log.info(branches);
                        for (var i = 0; i < branches.length; i++) {
                            if ((branches[i].name) == model.customer.branchName) {
                                model.customer.branchId = branches[i].value;
                            }
                        }
                    }
                },
                offline: false,
                getOfflineDisplayItem: function(item, index) {
                    return []
                },

                form: [
                    {
                        type: "box",
                        title: "LEAD_PROFILE",
                        items: [{
                            key: "lead.leads",
                            type: "array",
                            add: null,
                            remove: null,
                            startEmpty: true,
                            titleMap:"model.lead.leads[arrayIndex].id",
                            title: "LEADS",
                            items: [{
                                key: "lead.leads[].id",
                                "title": "LEAD_ID",

                                readonly: true,
                            }, {
                                key: "lead.leads[].leadName",
                                "title": "LEAD_NAME",
                                readonly: true,
                            },{
                                key: "lead.leads[].addressLine1",
                                "title": "ADDRESS_LINE1",
                                readonly: true,
                            },{
                                key: "lead.leads[].area",
                                "title": "AREA",
                                readonly: true,
                            },{
                                key: "lead.leads[].cityTownVillage",
                                "title": "CITY/_TOWN_VILLAGE",
                                readonly: true,
                            },{
                                key: "lead.leads[].mobileNo",
                                "title": "MOBILE_NUMBER1",
                                readonly: true,
                            }]
                        }]
                    },

                    {
                        type: "box",
                        title: "ASSIGN_SPOKE",
                        items: [{
                            "key": "customer.branchName",
                            "title": "HUB_NAME",
                            "type": "select",
                            "enumCode": "branch",
                            readonly: true
                        },{
                            key: "lead.centreId",
                            "enumCode": "centre",
                            type: "select",
                            "parentEnumCode": "branch_id",
                            "parentValueExpr": "model.customer.branchId",
                            required: true
                        }]
                    },

                    {
                        "type": "actionbox",
                        "items": [{
                            "type": "submit",
                            "title": "ASSIGN"
                        }, ]
                    }
                ],
                schema: function() {
                    return Lead.getLeadSchema().$promise;
                },
                actions: {
                    submit: function(model, form, formName) {
                        PageHelper.showProgress('enrolment', 'Assigning Lead');
                        PageHelper.showLoader();
                        $log.info("Inside submit()");
                        $log.warn(model.lead);

                        var reqData = _.cloneDeep(model.lead);
                        for(i=0;i<reqData.leads.length;i++)
                        {
                           reqData.leads[i].branchId=model.customer.branchId;
                           $log.info(model.customer.branchId);
                        }
                        leadRepo.assignLead(reqData)
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(val) {
                                irfNavigator.go({
                                    state: "Page.Adhoc",
                                    pageName: "pahal.loans.LoanOriginationDashboard"
                                });
                            }, function(err) {
                                PageHelper.showErrors(err);
                            })


                    }
                }
            };
        }
    }
})
