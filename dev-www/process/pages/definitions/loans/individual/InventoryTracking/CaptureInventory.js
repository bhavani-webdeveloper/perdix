irf.pageCollection.factory(irf.page("loans.individual.InventoryTracking.CaptureInventory"), ["$log", "$state", "Inventory", "InventoryHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "PagesDefinition", "Queries",


    function($log, $state, Inventory, InventoryHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "CAPTURE_INVENTORY",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.inventory = model.inventory || {};
                var branch1 = formHelper.enum('branch_id').data;
                //model.inventory.branchId = SessionStore.getBranchId();
                $log.info("Capture Inventory page  is initiated ");
            },

            modelPromise: function(pageId, _model) {

            },

            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return []
            },

            form: [{
                    type: "box",
                    title: "CAPTURE_INVENTORY",
                    items: [{
                            key: "inventory.branchId",
                            "type": "select",
                            "enumCode": "branch_code",
                        },
                        {
                            key: "inventory.consumableInventoryDetails",
                            type: "array",
                            startEmpty: true,
                            view: "fixed",
                            title: "INVENTORY",
                            items: [{
                                key: "inventory.consumableInventoryDetails[].inventoryName",
                            }, {
                                key: "inventory.consumableInventoryDetails[].numberOfInventories",
                            }]
                        }
                    ]
                },



                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Submit"
                    }]
                },
            ],


            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "inventory": {
                        "type": "object",
                        "required": [],
                        "properties": {
                            "branchId": {
                                            "title": "BRANCH_NAME",
                                            "type": "string"
                                        },

                            "consumableInventoryDetails": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "required": [
                                        "inventoryName",
                                        "numberOfInventories"
                                    ],
                                    "properties": {
                                        "branchId": {
                                            "title": "BRANCH_NAME",
                                            "type": "string"
                                        },
                                        "inventoryName": {
                                            "title": "DOCUMENT_NAME",
                                            "type": "string"
                                        },
                                        "numberOfInventories": {
                                            "title": "NO_OF_DOCUMENTS",
                                            "type": "number"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            actions: {
                /*preSave: function(model, form, formName) {
                    $log.info("Inside save()");
                    var deferred = $q.defer();
                    if (model.doc) {
                        deferred.resolve();
                    } else {
                        irfProgressMessage.pop('Dispatch-save', ' PodNumber is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },*/

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
                    var reqData = _.cloneDeep(model.inventory);
                    var promise = Inventory.captureInventory(reqData).$promise;
                    promise.then(function(response) {
                        $log.info(resonse);
                        PageHelper.showProgress('inventory', 'Done.', 5000);
                        Utils.removeNulls(response, true);
                        model.inventory = response;
                    }, function(error) {
                        PageHelper.showProgress('inventory', 'Oops. Some error.', 5000);
                        PageHelper.showErrors(httpRes);
                    })
                }
            }
        };

    }
]);