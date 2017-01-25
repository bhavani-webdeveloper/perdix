irf.pageCollection.factory(irf.page("management.SpokeMerger"), ["$log", "Maintenance", "Enrollment", "$state", "$stateParams", "Lead", "SessionStore",
    "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries",
    function($log, Maintenance, Enrollment, $state, $stateParams, Lead, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "Spoke Merger",

            initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                model.customer = model.customer || {};
                model = Utils.removeNulls(model, true);
                $log.info("Spoke Merger page ");
            },

            offline: false,
            getOfflineDisplayItem: function(item, index) {
                return []
            },

            "form": [{
                    "type": "box",
                    "title": "Spoke Merger",
                    "items": [{
                            key: "branchId",
                            title: "Hub Name",
                            type: "select",
                            enumCode: "branch_id"
                        }, {
                            key: "customer.fromCentreId",
                            title: "From Spoke Name",
                            type: "select",
                            enumCode: "centre",
                            parentEnumCode: "branch_id",
                            parentValueExpr: "model.branchId",
                            screenFilter: true
                        }, {
                            key: "customer.toCentreId",
                            title: "To Spoke Name",
                            type: "select",
                            enumCode: "centre",
                            parentEnumCode: "branch_id",
                            parentValueExpr: "model.branchId",
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
                                        "kgfsName": {
                                            "key": "customer.kgfsName",
                                            "type": "select",
                                            "enumCode": "branch_id"
                                        },
                                        "centreId": {
                                            "key": "customer.centreId",
                                            "type": "select",
                                            "enumCode": "centre",
                                            "parentEnumCode": "branch_id"
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
                                        for (var i = 0; i < branches.length; i++) {
                                            if (branches[i].id == inputModel.firstName)
                                                branchId = branches[i].id;
                                        }
                                        var promise = Enrollment.search({
                                            'branchName': branchId || SessionStore.getBranch(),
                                            'firstName': inputModel.firstName,
                                            'centreId': inputModel.centreId,
                                            'customerType': ""
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
                                    onSelect: function(valueObj, model, context) {}
                                }, {
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
                },
            }
        };
    }
]);