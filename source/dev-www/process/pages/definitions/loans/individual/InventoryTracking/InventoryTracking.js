irf.pageCollection.factory(irf.page("loans.individual.InventoryTracking.InventoryTracking"), ["$log", "$state","$stateParams", "Inventory", "InventoryHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "PagesDefinition", "Queries",


    function($log, $state,$stateParams, Inventory, InventoryHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "INVENTORY_TRACKING",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.inventory = model.inventory || {};
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
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
                            PageHelper.hideLoader();
                        }
                    );
                    model.inventory.inventoryTrackerDto.branchId= SessionStore.getBranchId();
                    $log.info("Capture Inventory page  is initiated ");
                }
            },

            modelPromise: function(pageId, _model) {

            },

            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return []
            },

            form: [
                {
                    type: "box",
                    title: "INVENTORY_DETAILS",
                    items: [{
                            key: "inventory.inventoryTrackerDto.branchId",
                            "type": "select",
                            "enumCode": "branch_id",
                        },
                        {
                            key: "inventory.inventoryTrackerDto.id",
                            condition:"model.inventory.inventoryTrackerDto.id",
                            title:"INVENTORY_ID"
                        },
                        {
                            key: "inventory.inventoryTrackerDto.batchNumber",
                            condition:"model.inventory.inventoryTrackerDto.id",
                            "title": "BATCH_NUMBER"
                        },
                        {
                            key: "inventory.inventoryTrackerDto.consumableInventoryDetailsDTOs",
                            type: "array",
                            startEmpty: true,
                            title: "INVENTORY",
                            items: [{
                                key: "inventory.inventryTrackingDetails[].inventoryName",
                                "title": "DOCUMENT_NAME",
                                type:"select",
                                condition:"model.siteCode=='KGFS'",
                                "titleMap":{
                                    "Receipt book":"Receipt book",
                                    "AXIS agreement":"AXIS agreement",
                                    "Stamp paper":"Stamp paper"
                                }
                            },{
                                key: "inventory.inventryTrackingDetails[].inventoryName",
                                "title": "DOCUMENT_NAME",
                                type:"select",
                                condition:"model.siteCode!=='KGFS'",
                                enumCode:"Inventory_details"
                            }, {
                                key: "inventory.inventoryTrackerDto.consumableInventoryDetailsDTOs[].numberOfInventories",
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
                    var sortFn = function(unordered) {
                        var out = {};
                        Object.keys(unordered).sort().forEach(function(key) {
                            out[key] = unordered[key];
                        });
                        return out;
                    };
                    var reqData = _.cloneDeep(model.inventory);
                    
                    if (reqData.inventoryTrackerDto.id) {

                            InventoryHelper.proceedData(reqData).then(function(resp) {
                                $state.go('Page.InventoryDashboard', null);
                            }, function(err) {
                                Utils.removeNulls(res.inventoryTrackerDto, true);
                                model.inventory.inventoryTrackerDto = res.inventoryTrackerDto;
                            });
                     
                    } else {
                        InventoryHelper.saveData(reqData).then(function(res) {
                            InventoryHelper.proceedData(res).then(function(resp) {
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