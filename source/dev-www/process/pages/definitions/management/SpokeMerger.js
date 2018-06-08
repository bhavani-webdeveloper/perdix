irf.pageCollection.factory(irf.page("management.SpokeMerger"), ["$log", "Maintenance", "Enrollment", "$state", "$stateParams", "Lead", "SessionStore",
    "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries",
    function($log, Maintenance, Enrollment, $state, $stateParams, Lead, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "SPOKE_MERGER",

            initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                model.customer = model.customer || {};
                model.interbranchMerge = ($stateParams.pageId === "interbranch") ? true : false;
                form[0].title = ($stateParams.pageId === "interbranch") ? 'SPOKE_MERGER' : 'INTRA_HUB_SPOKE_MERGER',
                model = Utils.removeNulls(model, true);
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
                $log.info("Spoke Merger page ");
                var branches = formHelper.enum('branch_id').data;
                $log.info(branches);
            },

            offline: false,
            getOfflineDisplayItem: function(item, index) {
                return []
            },

            "form": [{
                    "type": "box",
                    "title": "SPOKE_MERGER",
                    "items": [{
                            key: "branchId1",
                            title: "Hub Name",
                            type: "select",
                            condition:"model.siteCode.toLowerCase()!='sambandh'",
                            enumCode: "branch_id",
                            onChange: function(modelValue, form, model, formCtrl, event) {
                                console.log("inside");
                                if(model.branchId1 === model.branchId2){
                                    Utils.alert("From Hub Name and To Hub Name can not be same. Select a different Hub");
                                    model.branchId1 = undefined;
                                }
                            }
                        }, {
                            key: "customer.fromCentreId",
                            title: "From Spoke Name",
                            type: "select",
                            enumCode: "centre",
                            condition:"model.siteCode.toLowerCase()!='sambandh'",
                            parentEnumCode: "branch_id",
                            parentValueExpr: "model.branchId1",
                            screenFilter: true
                        },{
                            key: "branchId2",
                            title: "Hub Name",
                            condition: "model.interbranchMerge && model.siteCode.toLowerCase() !='sambandh'",
                            type: "select",
                            enumCode: "branch_id",
                            onChange: function(modelValue, form, model, formCtrl, event) {
                                console.log("inside");
                                if(model.branchId1 === model.branchId2){
                                    Utils.alert("From Hub Name and To Hub Name can not be same. Select a different Hub");
                                    model.branchId2 = undefined;
                                }
                            }
                        }, {
                            key: "customer.toCentreId",
                            title: "To Spoke Name",
                            condition: "!model.interbranchMerge && model.siteCode.toLowerCase()!='sambandh'",
                            type: "select",
                            enumCode: "centre",
                            parentEnumCode: "branch_id",
                            parentValueExpr: "model.branchId1",
                            screenFilter: true
                        },{
                            key: "customer.toCentreId",
                            title: "To Spoke Name",
                            condition: "model.interbranchMerge && model.siteCode.toLowerCase()!='sambandh'",
                            type: "select",
                            enumCode: "centre",
                            parentEnumCode: "branch_id",
                            parentValueExpr: "model.branchId2",
                            screenFilter: true
                        }, {
                            key: "branchId1",
                            title: "Branch Name",
                            type: "select",
                            condition:"model.siteCode.toLowerCase()=='sambandh'",
                            enumCode: "branch_id",
                            onChange: function(modelValue, form, model, formCtrl, event) {
                                console.log("inside");
                                if(model.branchId1 === model.branchId2){
                                    Utils.alert("From Branch Name and To Branch Name can not be same. Select a different Branch");
                                    model.branchId1 = undefined;
                                }
                            }
                        }, {
                            key: "customer.fromCentreId",
                            title: "From Centre Name",
                            type: "select",
                            enumCode: "centre",
                            condition:"model.siteCode.toLowerCase()=='sambandh'",
                            parentEnumCode: "branch_id",
                            parentValueExpr: "model.branchId1",
                            screenFilter: true
                        },{
                            key: "branchId2",
                            title: "Branch Name",
                            condition: "model.interbranchMerge && model.siteCode.toLowerCase() =='sambandh'",
                            type: "select",
                            enumCode: "branch_id",
                            onChange: function(modelValue, form, model, formCtrl, event) {
                                console.log("inside");
                                if(model.branchId1 === model.branchId2){
                                    Utils.alert("From Branch Name and To Branch Name can not be same. Select a different Branch");
                                    model.branchId2 = undefined;
                                }
                            }
                        }, {
                            key: "customer.toCentreId",
                            title: "To Centre Name",
                            condition: "!model.interbranchMerge && model.siteCode.toLowerCase()=='sambandh'",
                            type: "select",
                            enumCode: "centre",
                            parentEnumCode: "branch_id",
                            parentValueExpr: "model.branchId1",
                            screenFilter: true
                        },{
                            key: "customer.toCentreId",
                            title: "To Centre Name",
                            condition: "model.interbranchMerge && model.siteCode.toLowerCase()=='sambandh'",
                            type: "select",
                            enumCode: "centre",
                            parentEnumCode: "branch_id",
                            parentValueExpr: "model.branchId2",
                            screenFilter: true
                        }, {
                            key: "customer.allMembers",
                            title: "Is All Customer",
                            type: "select",
                            titleMap: {
                                1: "YES",
                                0: "NO"
                            }
                        },

                        {
                            type: "fieldset",
                            condition:"model.customer.allMembers== 0",
                            title: "Customer Ids",
                            items: [{
                                key: "customer.customerid",
                                type: "array",
                                title: "Add CustomerIds",
                                items: [{
                                    "key": "customer.customerid[].id",
                                    "title": "Customer Id",
                                    "type": "lov",
                                    "inputMap": {
                                        "firstName": {
                                            "key": "customer.firstName",
                                            "title": "CUSTOMER_NAME"
                                        },
                                        "urnNo": {
                                            "key": "customer.urnNo",
                                            "title": "URN_NO",
                                            "type": "string"
                                        },
                                        "kgfsName": {
                                            "key": "customer.kgfsName",
                                            "type": "select",
                                            "required": true,
                                            "enumCode": "branch_id"
                                        },
                                        "centreId": {
                                            "key": "customer.centreId",
                                            "type": "select",
                                            "enumCode": "centre",
                                            "parentEnumCode": "branch_id"
                                        },
                                        "customerType": {
                                            "key": "customer.customerType",
                                            "type": "select",
                                            "titleMap":{
                                                "enterprise":"enterprise",
                                                "individual":"individual"
                                            }
                                            
                                        }
                                    },
                                    "outputMap": {
                                        "firstName": "customer.customerid[arrayIndex].firstName",
                                        "id": "customer.customerid[arrayIndex].id",
                                    },
                                    "searchHelper": formHelper,
                                        "search": function(inputModel, form) {
                                        $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                        var branches = formHelper.enum('branch_id').data;
                                        var branchId;
                                        $log.info(inputModel.kgfsName);
                                        for (var i = 0; i < branches.length; i++) {
                                            if (branches[i].code == inputModel.kgfsName)
                                                branchId = branches[i].name;  
                                        }
                                        var promise = Enrollment.search({
                                            'branchName': branchId || SessionStore.getBranch(),
                                            'firstName': inputModel.firstName,
                                            'centreId': inputModel.centreId,
                                            'customerType':inputModel.customerType||"",
                                            'urnNo': inputModel.urnNo
                                        }).$promise;
                                        return promise;
                                    },
                                    getListDisplayItem: function(data, index) {
                                        return [
                                            [data.firstName, data.fatherFirstName].join(' | '),
                                            data.id,
                                            data.urnNo
                                        ];
                                    },
                                    onSelect: function(valueObj, model, context) {

                                       $log.info(valueObj);

                                        if(valueObj.customerType=="Enterprise")
                                        {
                                            $log.info(valueObj.id);
                                            Queries.getEnterpriseRelations(valueObj.id)
                                                .then(function(result){
                                                    $log.info("Result Came");
                                                    $log.info(result);
                                                    for(i in result)
                                                    {
                                                        model.customer.customerid.push(result[i]);
                                                    }

                                                }
                                            );
                                        }
                                    }
                                }, 

                                {
                                    key: "customer.customerid[].firstName",
                                }]
                            }]
                        },

                        {
                            type: "actionbox",
                            items: [{
                                type: "submit",
                                title: "submit"
                            }]
                        },


                    ]
                },



            ],

            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "customer": {
                        "type": "object",
                        "required": [
                        "fromCentreId",
                        "toCentreId",
                        "allMembers"
                        ],
                        "properties": {
                            "branchId": {
                                "type": "number",
                                "title": "BRANCH_NAME"
                            },
                            "fromCentreId": {
                                "type": "number",
                                "title": "HUB_NAME",
                                "enumCode": "FROM_CENTRE"
                            },
                            "toCentreId": {
                                "type": "number",
                                "title": "SPOKE_NAME",
                                "enumCode": "TO_CENTRE"
                            },
                            "firstName": {
                                "type": "string",
                                "title": "CUSTOMER_NAME"
                            },
                            "kgfsName": {
                                "type": ["number", "null"],
                                "title": "HUB_NAME"
                            },
                            "allMembers": {
                                "type": ["string", "null"],
                            },
                            "centreId": {
                                "type": ["number", "null"],
                                "title": "SPOKE_NAME"
                            },
                            "customerType": {
                                "type": ["string", "null"],
                                "title": "Customer Type"
                            },
                            "urnNo": {
                                "title": "URN_NO",
                                "type": ["string", "null"]
                            },

                            "customerid": {
                                "type": "array",
                                "title": "CUSTOMER_ID",
                                "items": {
                                    "type": "object",
                                    "required": ["id"],
                                    "properties": {
                                        "firstName": {
                                            "type": ["string", "null"],
                                            "title": "CUSTOMER_NAME"
                                        },
                                        "id": {
                                            "type": ["number", "null"],
                                            "title": "CUSTOMER_ID"
                                        }
                                    }
                                }
                            },

                        }
                    }
                }
            },
            actions: {
                submit: function(model, form, formName) {
                    Utils.confirm("Are You Sure").then(function(){
                    $log.info('on submit action ....');


                    var idtemp = [];
                    if (model.customer.customerid && model.customer.customerid.length) {
                        for (i = 0; i < model.customer.customerid.length; i++) {
                            idtemp.push(model.customer.customerid[i].id);
                        }
                    }

                    if (idtemp && idtemp.length) {
                        model.customer.customerIds = idtemp;
                    }

                    $log.warn(model);

                    var sortFn = function(unordered) {
                        var out = {};
                        Object.keys(unordered).sort().forEach(function(key) {
                            out[key] = unordered[key];
                        });
                        return out;
                    };
                    var reqData = _.cloneDeep(model.customer);
                    Maintenance.updateSpoke(reqData, null).$promise.then(
                        function(response) {
                            PageHelper.hideLoader();
                            PageHelper.showProgress("Spoke updated", "Done.", 2000);
                        },
                        function(errorResponse) {
                            PageHelper.hideLoader();
                            PageHelper.showErrors(errorResponse);
                        }
                    );
                    })
                },
            }
        };
    }
]);