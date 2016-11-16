irf.pageCollection.factory(irf.page("lead.LeadReassign"), ["$log", "$state", "$stateParams", "Lead", "SessionStore",
    "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries", "LeadHelper",

    function($log, $state, $stateParams, Lead, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, LeadHelper) {

        return {
            "type": "schema-form",
            "title": "LEAD_ASSIGN",
            "subTitle": "Lead",
            initialize: function(model, form, formCtrl) {
                model.lead = model.lead || {};
                model = Utils.removeNulls(model, true);
                $log.info("create new lead assign page ");

                if (!(model && model.lead && model.lead.id && model.$$STORAGE_KEY$$)) {
                    PageHelper.showLoader();
                    PageHelper.showProgress("page-init", "Loading...");
                    var leadId = $stateParams.pageId;
                    if (!leadId) {
                        PageHelper.hideLoader();
                    }
                    Lead.get({
                            id: leadId
                        },
                        function(res) {
                            _.assign(model.lead, res);
                            model = Utils.removeNulls(model, true);
                            PageHelper.hideLoader();
                        }
                    );
                }
            },
            offline: false,
            getOfflineDisplayItem: function(item, index) {
                return []
            },

            form: [{
                    "type": "box",
                    readonly: true,
                    "title": "LEAD_PROFILE",
                    "items": [{
                        key: "lead.id",
                        readonly: true
                    }, {
                        key: "lead.leadName",
                        readonly: true
                    }, {
                        key: "lead.businessName",
                        readonly: true
                    }, {
                        key: "lead.addressLine1",
                        readonly: true
                    }, {
                        key: "lead.area",
                        readonly: true
                    }, {
                        key: "lead.cityTownVillage",
                        readonly: true
                    }, {
                        key: "lead.mobileNo",
                        readonly: true
                    }]
                },

                {
                    type: "box",
                    title: "ASSIGN_SPOKE",
                    items: [{
                        "key": "lead.branchName",
                        readonly: true
                    }, {
                        key: "lead.centreId",
                        "enumCode": "centre",
                        type: "select",
                        "filter": {
                            "parentCode": "model.lead.branchName"
                        }
                    }, ]
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
                    $log.info("Inside submit()");
                    $log.warn(model);
                    var sortFn = function(unordered) {
                        var out = {};
                        Object.keys(unordered).sort().forEach(function(key) {
                            out[key] = unordered[key];
                        });
                        return out;
                    };
                    var reqData = _.cloneDeep(model);
                    if (reqData.lead.id) {
                        LeadHelper.proceedData(reqData).then(function(resp) {
                            $state.go('Page.Landing', null);
                        });
                    } else {
                        LeadHelper.saveData(reqData).then(function(res) {
                            LeadHelper.proceedData(res).then(function(resp) {
                                $state.go('Page.Landing', null);
                            }, function(err) {
                                Utils.removeNulls(res.lead, true);
                                model.lead = res.lead;
                            });
                        });
                    }
                }
            }

        };
    }
]);