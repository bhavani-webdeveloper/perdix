irf.pageCollection.factory(irf.page("lead.LeadReassign"), ["$log", "$stateParams", "formHelper", "PageHelper", "Utils", "LeadHelper", "irfNavigator","Lead",

    function($log,$stateParams,formHelper,PageHelper, Utils,LeadHelper,irfNavigator,Lead) {

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
                    for (i in leadarray) {
                        if (i == 0) {
                            var leadIdList = "leadIdList=" + leadarray[i].id
                        } else {
                            var leadIdList = leadIdList + "&leadIdList=" + leadarray[i].id
                        }
                    }
                    var leadArray = []
                    Lead.findLeads({
                        id: leadIdList
                    }).$promise.then(
                        function(res) {
                            model.leadResponse = res;
                            for (i in leadarray) {
                                leadArray[i] = model.leadResponse[i]
                            }
                            console.log(leadArray);
                            model.lead.leads = leadArray;
                            model.customer.branchName = leadarray[0].branchName;
                            var branches = formHelper.enum('branch_id').data;
                            $log.info(branches);
                            for (var i = 0; i < branches.length; i++) {
                                if ((branches[i].name) == model.customer.branchName) {
                                    model.customer.branchId = branches[i].value;
                                }
                            }
                        },
                        function(err) {
                            console.log(err);
                            PageHelper.showError(err);
                        });
                }

                /*if ($stateParams.pageId) {
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
                                model.lead.branchId = res.branchId;
                                model = Utils.removeNulls(model, true);
                                PageHelper.hideLoader();
                            }
                        );
                    }
                }*/
            },
            offline: false,
            getOfflineDisplayItem: function(item, index) {
                return []
            },

            form: [
              /* {
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
                },*/
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
                            key: "lead.leads[].businessName",
                            "title": "BUSINESS_NAME",
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
                    }, {
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
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "lead": {
                        "type": "object",
                        "required": [
                            "centerId"
                        ],
                        "properties": {
                            "currentDate": {
                                "type": "string",
                                "title": "CURRENT_DATE"
                            },
                            "branchName": {
                                "type": "string",
                                "title": "HUB_NAME",
                                "enumCode": "branch_id"
                            },
                            "centreName": {
                                "type": "number",
                                "title": "SPOKE_NAME",
                                "enumCode": "centre"
                            },
                            "centreId": {
                                "type": ["null", "number"],
                                "title": "SPOKE_NAME",
                                "enumCode": "centre"
                            },
                            "id": {
                                "type": "integer",
                                "title": "LEAD_ID"
                            },
                            "leadId": {
                                "type": "integer",
                                "title": "LEAD_ID"
                            },
                            "leadName": {
                                "type": "string",
                                "title": "LEAD_NAME"
                            },
                            "mobileNo": {
                                "type": "string",
                                "maxLength": 10,
                                "minLength": 10,
                                "title": "MOBILE_NUMBER1"
                            },
                            "alternateMobileNo": {
                                "type": "string",
                                "title": "ALTERNATE_MOBILE_NUMBER",
                                "maxLength": 10,
                                "minLength": 10
                            },
                            "businessName": {
                                "type": "string",
                                "title": "BUSINESS_NAME"
                            },
                            "businessType": {
                                "type": "string",
                                "title": "BUSINESS_TYPE"
                            },
                            "addressLine1": {
                                "type": "string",
                                "title": "ADDRESS_LINE1"
                            },
                            "addressLine2": {
                                "type": "string",
                                "title": "ADDRESS_LINE2"
                            },
                            "pincode": {
                                "title": "PIN_CODE",
                                "type": "integer"
                            },
                            "state": {
                                "type": "string",
                                "title": "STATE"
                            },
                            "district": {
                                "type": "string",
                                "title": "DISTRICT"
                            },
                            "location": {
                                "type": "string",
                                "title": "LOCATION"
                            },
                            "latitude": {
                                "type": "string",
                                "title": "LOCATION"
                            },
                            "longitude": {
                                "type": "string",
                                "title": "LONGITUDE"
                            },
                            "area": {
                                "type": "string",
                                "title": "AREA"
                            },
                            "cityTownVillage": {
                                "type": "string",
                                "title": "CITY/_TOWN_VILLAGE"
                            },
                            "loanOfficer": {
                                "type": "string",
                                "title": "LOAN_OFFICER"
                            }
                        }
                    }
                }
            },
            actions: {
/*                submit: function(model, form, formName) {
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
                    var centres = formHelper.enum('centre').data;

                    for (var i = 0; i < centres.length; i++) {
                        if ((centres[i].code) == reqData.lead.centreId) {
                            reqData.lead.centreName = centres[i].name;
                        }
                    }
                    if (reqData.lead.id) {
                        LeadHelper.proceedData(reqData).then(function(resp) {
                            $state.go('Page.LeadDashboard', null);
                        });
                    } else {
                        LeadHelper.saveData(reqData).then(function(res) {
                            LeadHelper.proceedData(res).then(function(resp) {
                                $state.go('Page.LeadDashboard', null);
                            }, function(err) {
                                Utils.removeNulls(res.lead, true);
                                model.lead = res.lead;
                            });
                        });
                    }
                }*/
                submit: function(model, form, formName) {
                    $log.info("Inside submit()");
                    $log.warn(model.lead);
                    Utils.removeNulls(model.lead, true);
                    var sortFn = function(unordered) {
                        var out = {};
                        Object.keys(unordered).sort().forEach(function(key) {
                            out[key] = unordered[key];
                        });
                        return out;
                    };
                    var reqData = _.cloneDeep(model.lead);

                    /*  1)req data will now contain leads with same transaction type because of validation 
                            on assignment pending queue - so no worries with stage on reqdata ie out of lead
                        2) conditional validation if transaction type is not null and also its type is renewal 
                           because that lead has to go to followup queue stage instead of default next stage
                    */
                    for (i = 0; i < reqData.leads.length; i++) {
                        reqData.leads[i].branchId = model.customer.branchId;
                        if(reqData.leads[i].transactionType && reqData.leads[i].transactionType.toLowerCase() == 'renewal'){
                            reqData.stage = 'Inprocess';
                            //reqData.centreId = reqData.leads[i].centreId;
                            reqData.centreId = model.lead.centreId;
                            reqData.leads[i].leadStatus = 'FollowUp'
                        }
                        $log.info(model.customer.branchId);
                    }
                /* 1)Calling assigncentre api in lead to update centre 
                   2) goBack() will go to dashboard because from assignmentPending Lead 
                      queue we have set the backparam to dashboard
                */
                     
                    LeadHelper.AssignLead(reqData).then(function (resp) {
                        PageHelper.showProgress("Assign-lead", "Done. Lead assigned successfull", 5000);
                       irfNavigator.goBack();
                    }, function (err) {
                        PageHelper.showProgress("Assign-Lead", "Error in assigning lead ", 5000);
                    });
                }
            }

        };
    }
]);