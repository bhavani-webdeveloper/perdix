irf.pageCollection.factory(irf.page("loans.individual.InventoryTracking.InventoryReceived"), ["$log", "$state","$stateParams", "Inventory", "InventoryHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "PagesDefinition", "Queries",


    function($log, $state, $stateParams,Inventory, InventoryHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "CAPTURE_INVENTORY",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.inventory = model.inventory || {};
                if (!_.hasIn(model.inventory, 'inventoryTrackerDto') || model.inventory.inventoryTrackerDto == null) {
                    model.inventory.inventoryTrackerDto = {};
                }

                if (!(model && model.inventory && model.inventory.id && model.$$STORAGE_KEY$$)) {

                    PageHelper.showLoader();
                    PageHelper.showProgress("page-init", "Loading...");
                    var inventoryId = $stateParams.pageId;
                    if (!inventoryId) {
                        PageHelper.hideLoader();
                    }
                    Inventory.get({
                            id: inventoryId
                        },
                        function(res) {
                            _.assign(model.inventory.inventoryTrackerDto, res);
                            $log.info(model.inventory.inventoryTrackerDto);
                            model = Utils.removeNulls(model, true);
                            PageHelper.hideLoader();
                        }
                    );
                    model.inventory.branchId = SessionStore.getBranchId();
                    $log.info("Capture Inventory page  is initiated ");
                }
            },

        
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return []
            },

            form: [{
                    type: "box",
                    title: "CAPTURE_INVENTORY",
                    items: [{
                            key: "inventory.inventoryTrackerDto.branchId",
                            readonly:true,
                            "type": "select",
                            "enumCode": "branch_id",
                        },
                        {
                            key: "inventory.inventoryTrackerDto.id",
                            readonly:true,
                            condition:"model.inventory.inventoryTrackerDto.id",
                            title:"INVENTORY_ID"
                        },
                        {
                            key: "inventory.inventoryTrackerDto.batchNumber",
                            readonly:true,
                            condition:"model.inventory.inventoryTrackerDto.id",
                            "title": "BATCH_NUMBER"
                        },
                        {
                            key: "inventory.inventoryTrackerDto.consumableInventoryDetailsDTOs",
                            type: "array",
                            startEmpty: true,
                            readonly:true,
                            title: "INVENTORY",
                            items: [{
                                key: "inventory.inventoryTrackerDto.consumableInventoryDetailsDTOs[].inventoryName",
                                type: "select",
                                enumCode: "Inventory_details"
                            }, {
                                key: "inventory.inventoryTrackerDto.consumableInventoryDetailsDTOs[].numberOfInventories",
                            }]
                        }

                    ]
                },
                {
                    type: "box",
                    title: "INVENTORY_TRANSIST_DETAILS",
                    items: [{
                            key: "inventory.inventoryTrackerDto.batchNumber",
                            readonly:true,
                            "title": "BATCH_NUMBER",
                        }, {
                            key: "inventory.inventoryTrackerDto.courierNumber",
                            readonly:true,
                            "title": "COURIER_NUMBER",
                        }, {
                            key: "inventory.inventoryTrackerDto.courierSentDate",
                            readonly:true,
                            "type": "date",
                            "title": "COURIER_SENT_DATE",
                        }, {
                            key: "inventory.inventoryTrackerDto.podNumber",
                            readonly:true,
                            "title": "POD_NUMBER",
                        }
                    ]
                },
                {
                    type: "box",
                    title: "INVENTORY_RECEIVED_DETAILS",
                    items: [{
                            key: "inventory.inventoryTrackerDto.udf1",
                            type:"select",
                            enumCode: "decisionmaker",
                            "title": "IS_BATCH_RECEIVED",
                        },{
                            key: "inventory.inventoryTrackerDto.courierReceivedDate",
                            condition:"model.inventory.inventoryTrackerDto.udf1 =='YES'",
                            "type": "date",
                            "title": "COURIER_RECEIVED_DATE",
                        }, {
                            key: "inventory.inventoryTrackerDto.remarks",
                            "title": "REMARKS",
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
                            "inventoryTrackerDto": {
                                "type": "object",
                                "required": [],
                                "properties": {

                                    "branchId": {
                                        "title": "BRANCH_NAME",
                                        "type": "number"
                                    },
                                    "batchNumber": {
                                        "title": "BATCH_NAME",
                                        "type": "string"
                                    },
                                    "courierNumber": {
                                        "title": "COURIER_NUMBER",
                                        "type": "string"
                                    },
                                    "courierSentDate": {
                                        "title": "COURIER_SENT_DATE",
                                        "type": "string"
                                    },
                                    "podNumber": {
                                        "title": "POD_NUMBER",
                                        "type": "string"
                                    },
                                    "courierReceivedDate": {
                                        "title": "COURIER_RECEIVED_DATE",
                                        "type": "string"
                                    },
                                    "remarks": {
                                        "title": "REMARKS",
                                        "type": "string"
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
                    if(model.inventory.inventoryTrackerDto.udf1 =='NO')
                    {
                        model.inventory.action='SAVE';
                    }
                    else
                    {
                       model.inventory.action='PROCEED';
                    }

                    var sortFn = function(unordered) {
                        var out = {};
                        Object.keys(unordered).sort().forEach(function(key) {
                            out[key] = unordered[key];
                        });
                        return out;
                    };
                    var reqData = _.cloneDeep(model.inventory);
                    
                    if (reqData.inventoryTrackerDto.id) {

                            InventoryHelper.InventoryProceedData(reqData).then(function(resp) {
                                $state.go('Page.InventoryDashboard', null);
                            }, function(err) {
                                Utils.removeNulls(res.inventoryTrackerDto, true);
                                model.inventory.inventoryTrackerDto = res.inventoryTrackerDto;
                            });
                     
                    } else {
                        InventoryHelper.saveData(reqData).then(function(res) {
                            InventoryHelper.InventoryProceedData(res).then(function(resp) {
                                $state.go('Page.InventoryDashboard', null);
                            }, function(err) {
                                Utils.removeNulls(res.inventoryTrackerDto, true);
                                model.inventory.inventoryTrackerDto = res.inventoryTrackerDto;
                            });
                        });
                    }
                }
            }
        };

    }
]);