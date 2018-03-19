irf.pageCollection.factory(irf.page("loans.individual.InventoryTracking.InventoryUpdate"), ["$log", "$state", "$stateParams","Inventory", "InventoryHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "PagesDefinition", "Queries",


    function($log, $state,$stateParams, Inventory, InventoryHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "UPDATE_INVENTORY",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.inventory = model.inventory || {};
                model.inventory.branchId = SessionStore.getBranchId();
                model.siteCode = SessionStore.getGlobalSetting("siteCode");

                if($stateParams.pageId)
                {
                    var inventoryId = $stateParams.pageId;
                    if (!inventoryId) {
                        PageHelper.hideLoader();
                    }
                    Inventory.get({
                            id: inventoryId
                        },
                        function(res) {
                            $log.info(res.consumableInventoryDetailsDTOs);
                            _.assign(model.inventory, res);
                            PageHelper.hideLoader();
                        }
                    );

                }

                var promise = Inventory.searchInventory({
                        'branchId': model.inventory.branchId,
                    }).$promise;

                promise.then(function(response)
                {
                    $log.info(response.body.inventryTrackingDetails);
                    if (response.body.inventryTrackingDetails && response.body.inventryTrackingDetails.length)
                    {
                        model.inventory.inventryTrackingDetails= response.body.inventryTrackingDetails;
                    }

                },function(error){
                    PageHelper.showErrors(error);

                });

                $log.info(model.inventory);

                $log.info(model.inventory.inventryTrackingDetails);
                $log.info(model.inventory.consumableInventoryDetailsDTOs);

                if(model.inventory.inventryTrackingDetails && model.inventory.inventryTrackingDetails.length)
                {
                    if(model.inventory.consumableInventoryDetailsDTOs && model.inventory.consumableInventoryDetailsDTOs.length )
                    {
                        for(i=0;i<model.inventory.inventryTrackingDetails.length;i++)
                        {
                            for(j=0;j<model.inventory.consumableInventoryDetailsDTOs.length;j++)
                            {
                                if(model.inventory.inventryTrackingDetails[i].inventoryName==model.inventory.consumableInventoryDetailsDTOs[j].inventoryName)
                                {
                                   model.inventory.inventryTrackingDetails[i].inventoryReceived= model.inventory.consumableInventoryDetailsDTOs[j].numberOfInventories;
                                }
                            }
                        }
                    }
                }
              
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
                    title: "INVENTORY_AVAILABLE",
                    items: [{
                            key: "inventory.branchId",
                            readonly:true,
                            "type": "select",
                            "enumCode": "branch_id",
                        },
                        {
                            key: "inventory.inventryTrackingDetails",
                            type: "array",
                            startEmpty: true,
                            view: "fixed",
                            title: "INVENTORY",
                            items: [{
                                key: "inventory.inventryTrackingDetails[].inventoryName",
                                "title": "DOCUMENT_NAME",
                                type:"select",
                                enumCode:"inventory"
                            }, {
                                key: "inventory.inventryTrackingDetails[].numberOfInventories",
                            }]
                        },
                    ]
                },

                {
                    type:"box",
                    title:"RECEIVED_DOCUMENTS",
                    condition: "model.inventory.id",
                    items:[
                    {
                            key: "inventory.consumableInventoryDetailsDTOs",
                            type: "array",
                            view: "fixed",
                            readonly:true,
                            title: "INVENTORY",
                            items: [{
                                key: "inventory.consumableInventoryDetailsDTOs[].inventoryName",
                                type:"select",
                                enumCode:"inventory"
                            }, {
                                key: "inventory.consumableInventoryDetailsDTOs[].numberOfInventories",
                            }]
                    }, 
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
                                            "type": "number"
                                        },

                            "inventryTrackingDetails": {
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
                                        },
                                         "inventoryReceived": {
                                            "title": "RECEIVED_DOCUMENTS",
                                            "type": "number"
                                        }
                                    }
                                }
                            },
                            "consumableInventoryDetailsDTOs": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "required": [
                                                "inventoryName",
                                                "numberOfInventories"
                                            ],
                                            "properties": {
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
                        $log.info(response);
                        PageHelper.showProgress('inventory', 'Data Updated.', 5000);
                        model.inventory = response;
                        $state.go('Page.InventoryDashboard', null);

                    }, function(error) {
                        PageHelper.showProgress('inventory', 'Oops. Some error.', 5000);
                        PageHelper.showErrors(error);
                        $state.go('Page.InventoryDashboard', null);
                    })
                }
            }
        };

    }
]);