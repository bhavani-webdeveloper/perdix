irf.pageCollection.factory(irf.page("audit.detail.FixedAsset"), ["$log", "PageHelper", "irfNavigator", "$stateParams", "Audit", "SessionStore",
    function($log, PageHelper, irfNavigator, $stateParams, Audit, SessionStore) {
        var master = null;
        var validateFields = function(model) {
            for (l in model.fixed_assets.asset_details) {
                var transferValue = model.fixed_assets.asset_details[l].transferred_quantity;
                if (model.fixed_assets.asset_details[l].quantity_on_hand > model.fixed_assets.asset_details[l].quantity_on_record) {
                    model.comOfQE = model.fixed_assets.asset_details[l].quantity_on_hand - model.fixed_assets.asset_details[l].excess_quantity;
                    if (model.fixed_assets.asset_details[l].quantity_on_record == model.comOfQE) {
                        if (!model.fixed_assets.asset_details[l].lost_quantity == 0 && !model.fixed_assets.asset_details[l].transferred_quantity == 0) {
                            PageHelper.setError({
                                message: "Lost and Transfer Value should be zero in " + model.fixed_assets.asset_details[l].asset_description + ""
                            });
                            return false;
                        }
                    } else {
                        if (model.fixed_assets.asset_details[l].excess_quantity > model.fixed_assets.asset_details[l].quantity_on_record) {
                            PageHelper.setError({
                                message: "Excess value should not be greater than ‘available’ value in " + model.fixed_assets.asset_details[l].asset_description + ""
                            });
                            return false;
                        }
                    }


                } else if (model.fixed_assets.asset_details[l].quantity_on_hand < model.fixed_assets.asset_details[l].quantity_on_record) {
                    model.comOfQLT = model.fixed_assets.asset_details[l].quantity_on_hand + (model.fixed_assets.asset_details[l].lost_quantity + model.fixed_assets.asset_details[l].transferred_quantity);
                    if (model.fixed_assets.asset_details[l].quantity_on_hand == model.comOfQLT) {
                        if (!model.fixed_assets.asset_details[l].excess_quantity == 0) {
                            PageHelper.setError({
                                message: "Excess Value should be zero in " + model.fixed_assets.asset_details[l].asset_description + ""
                            });
                            return false;
                        }
                    }

                } else if (model.fixed_assets.asset_details[l].quantity_on_hand == model.fixed_assets.asset_details[l].quantity_on_record) {
                    return true;
                    if (!model.fixed_assets.asset_details[l].excess_quantity == 0 && !model.fixed_assets.asset_details[l].transferred_quantity == 0 && !model.fixed_assets.asset_details[l].lost_quantity == 0) {
                        PageHelper.setError({
                            message: "Excess, Transfer and lost Value should be zero in " + model.fixed_assets.asset_details[l].asset_description + " "
                        });
                        return false;
                    }
                }
            }

            return true;
        };

        return {
            "type": "schema-form",
            "title": "FIXED_ASSET",
            initialize: function(model, form, formCtrl) {
                if (!$stateParams.pageId) {
                    irfNavigator.goBack();
                    return;
                }
                $stateParams.pageData = $stateParams.pageData || {};
                if (typeof($stateParams.pageData.readonly) == 'undefined') {
                    $stateParams.pageData.readonly = true;
                }
                var pageData = {
                    "readonly": $stateParams.pageData.readonly
                };
                model.audit_id = Number($stateParams.pageId);
                master = Audit.offline.getAuditMaster() || {};
                model.fixed_assets = model.fixed_assets || {};
                var self = this;
                self.form = [];
                var init = function(response) {
                    model.master = master;
                    model.fixed_assets = response;

                    if (!model.fixed_assets) {
                        model.fixed_assets = {};
                    }
                    if (!model.fixed_assets.asset_details || !model.fixed_assets.asset_details.length) {
                        model.fixed_assets.asset_details = [];
                        for (i in model.master.fixed_assets) {
                            var asset_details = model.master.fixed_assets[i];
                            if (asset_details.status == 1) {
                                model.fixed_assets.asset_details.push({
                                    "asset_id": asset_details.asset_type_id,
                                    "asset_description": asset_details.asset_description
                                })
                            }
                        }
                    }
                    var fixedAssetSheetForm = [];
                    var auditData_fixedAsset = [];

                    var assetMap = model.master.fixed_assets.reduce(function(map, obj) {
                        map[obj.asset_type_id] = obj;
                        return map;
                    }, {});

                    for (i in model.fixed_assets.asset_details) {
                        auditData_fixedAsset = model.fixed_assets.asset_details[i];
                        fixedAssetSheetForm.push({
                            "type": "section",
                            "htmlClass": "row",
                            "items": [{
                                "type": "section",
                                "htmlClass": "col-sm-5",
                                "items": [{
                                    "type": "section",
                                    "html": "{{model.fixed_assets.asset_details[" + i + "].asset_description}}"
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-1",
                                "items": [{
                                    "key": "fixed_assets.asset_details[" + i + "].quantity_on_record",
                                    "readonly": true,
                                    "notitle": true
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-1",
                                "items": [{
                                    "key": "fixed_assets.asset_details[" + i + "].quantity_on_hand",
                                    "type": "number",
                                    "notitle": true
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-1",
                                "items": [{
                                    "key": "fixed_assets.asset_details[" + i + "].lost_quantity",
                                    "type": "number",
                                    "notitle": true
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-1",
                                "items": [{
                                    "key": "fixed_assets.asset_details[" + i + "].transferred_quantity",
                                    "type": "number",
                                    "notitle": true
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-1",
                                "items": [{
                                    "key": "fixed_assets.asset_details[" + i + "].excess_quantity",
                                    "type": "number",
                                    "notitle": true
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-2",
                                "items": [{
                                    "key": "fixed_assets.asset_details[" + i + "].description",
                                    "notitle": true
                                }]
                            }]
                        });
                    }
                    var boxItems = [{
                        "type": "section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-sm-5",
                            "items": [{
                                "type": "section",
                                "html": "{{'ASSET'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-1",
                            "items": [{
                                "type": "section",
                                "html": "{{'ON_RECORD'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-1",
                            "items": [{
                                "type": "section",
                                "html": "{{'AVAILABLE'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-1",
                            "items": [{
                                "type": "section",
                                "html": "{{'LOST'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-1",
                            "items": [{
                                "type": "section",
                                "html": "{{'TRANFERRED'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-1",
                            "items": [{
                                "type": "section",
                                "html": "{{'EXCESS'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-2",
                            "items": [{
                                "type": "section",
                                "html": "{{'DESCRIPTION'|translate}}"
                            }]
                        }]
                    }];

                    boxItems.push.apply(boxItems, fixedAssetSheetForm);

                    self.form = [{
                        "type": "box",
                        "title": "FIXED_ASSET",
                        "colClass": "col-sm-12",
                        "items": boxItems
                    }, {
                        "type": "box",
                        "title": "COMMENTS",
                        "colClass": "col-sm-6",
                        "items": [{
                            key: "model.fixed_assets.comments",
                            title: "COMMENTS"
                        }]
                    }, {
                        type: "actionbox",
                        items: [{
                            type: "submit",
                            title: "UPDATE"
                        }]
                    }];
                };

                model.$isOffline = false;
                if ($stateParams.pageData && $stateParams.pageData.auditData && $stateParams.pageData.auditData.fixed_assets) {
                    init($stateParams.pageData.auditData.fixed_assets);
                } else {
                    Audit.offline.getFixedAssets($stateParams.pageId).then(function(res) {
                        init(res);
                        model.$isOffline = true;
                    }, function(errRes) {
                        PageHelper.showErrors(errRes);
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });
                }

            },
            form: [],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "fixed_assets": {
                        "type": "object",
                        "title": "",
                        "properties": {
                            "coin_balance": {
                                "type": "number",
                                "title": "COIN_BALANCE"
                            },
                            "values_total": {
                                "type": "number",
                                "title": "TOTAL_CASH_BALANCE_ON_HAND"
                            },
                            "cbs_balance": {
                                "type": "number",
                                "title": "CBS_BALANCE"
                            },
                            "values_deviation": {
                                "type": "number",
                                "title": "DEVIATION"
                            },
                            "comments": {
                                "type": "string",
                                "title": "COMMENTS"
                            },

                        },


                    }
                },
            },
            actions: {
                submit: function(model, form, formName) {
                    if (model.$isOffline) {
                        Audit.offline.setFixedAssets(model.audit_id, model.fixed_assets).then(function(res) {
                            if (!validateFields(model)) return;
                            model.fixed_assets = res;
                            PageHelper.showProgress("auditId", "Fixed Asset Audit Updated Successfully.", 3000);
                            irfNavigator.goBack();
                        }, function(errRes) {
                            PageHelper.showErrors(errRes);
                        }).finally(function() {
                            PageHelper.hideLoader();
                        })
                    } else {
                        $stateParams.pageData.auditData.fixed_assets = model.fixed_assets;
                        irfNavigator.goBack();
                    }
                },
                goBack: function(model, form, formName) {
                    irfNavigator.goBack();
                },
            }
        };
    }
]);