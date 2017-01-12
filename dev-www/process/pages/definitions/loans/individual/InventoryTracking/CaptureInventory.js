irf.pageCollection.factory(irf.page("loans.individual.InventoryTracking.CaptureInventory"), ["$log", "$state", "document", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "PagesDefinition", "Queries",


    function($log, $state, document, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "CAPTURE_INVENTORY",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.inventory = model.inventory || {};
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
                        key: "inventory.inventoryTrackerDto",
                        type: "array",
                        startEmpty: true,
                        view: "fixed",
                        title: "INVENTORY",
                        items: [{
                            key: "inventory.inventoryTrackerDto[].branchId",
                            type: "date",
                            readonly: true,
                        }, {
                            key: "inventory.inventoryTrackerDto[].inventoryName",
                            readonly: true,
                        }, {
                            key: "inventory.inventoryTrackerDto[].numberOfInventories",

                        }]
                    }]
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
                        "required": [
                        ],
                        "properties": {
                            "inventoryTrackerDto": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "required": [
                                        "branchId",
                                        "inventoryName",
                                        "numberOfInventories"
                                    ],
                                    "properties": {
                                        "branchId": {
                                            "title": "MAKE",
                                            "type": "string"
                                        },
                                        "inventoryName": {
                                            "title": "TYPE",
                                            "type": "string"
                                        },
                                        "numberOfInventories": {
                                            "title": "YEAR",
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            actions: {
                preSave: function(model, form, formName) {
                    $log.info("Inside save()");
                    var deferred = $q.defer();
                    if (model.doc) {
                        deferred.resolve();
                    } else {
                        irfProgressMessage.pop('Dispatch-save', ' PodNumber is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },

                submit: function(model, form, formName) {
                    $log.info("Inside submit()");
                    irfProgressMessage.pop('Dispatch-save', 'Dispatch is successfully created', 3000);
                    $log.warn(model);
                }
            }
        };

    }
]);