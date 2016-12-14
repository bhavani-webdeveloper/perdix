irf.pageCollection.factory(irf.page("management.SpokeMerger"),
 ["$log", "Maintenance", "$state", "$stateParams", "Lead", "SessionStore",
    "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries",
    function($log, Maintenance, $state, $stateParams, Lead, SessionStore, formHelper, $q, irfProgressMessage,
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
                            type: "actionbox",
                            // condition: "model.spoke.config",
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
                        "required": [],
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
                            }
                        }
                    }
                }
            },
            actions: {
                submit: function(model, form, formName) {
                    $log.info('on submit action ....');
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