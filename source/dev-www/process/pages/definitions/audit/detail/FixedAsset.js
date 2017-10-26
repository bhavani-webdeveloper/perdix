irf.pageCollection.factory(irf.page("audit.detail.FixedAsset"),
["$log", "PageHelper", "irfNavigator", "$stateParams", "Audit",
    function($log, PageHelper, irfNavigator, $stateParams, Audit) {
        var validateAsset = function(asset) {
            if (asset.quantity_on_record < asset.quantity_on_hand) {
                if (asset.quantity_on_record != asset.quantity_on_hand - asset.excess_quantity) {
                    throw "Available & excess should add up to quantity on record";
                } else if (asset.lost_quantity !== 0 || asset.transferred_quantity !== 0) {
                    throw "Lost & transfer should be zero";
                }
            } else if (asset.quantity_on_record > asset.quantity_on_hand) {
                if (asset.quantity_on_record == asset.quantity_on_hand + asset.lost_quantity + asset.transferred_quantity) {
                    throw "Available, lost & transferred should add up to quantity on record";
                } else if (asset.excess_quantity !== 0) {
                    throw "Excess should be zero";
                }
            } else if (asset.quantity_on_record == asset.quantity_on_hand) {
                if (asset.excess_quantity !== 0 || asset.transferred_quantity !== 0 || asset.lost_quantity !== 0) {
                    throw "Excess, transfer & lost should be zero";
                }
            }
        };
        var validateFixedAssets = function(model) {
            var i = 0;
            try {
                for (;i < model.fixed_assets.asset_details.length; i++) {
                    validateAsset(model.fixed_assets.asset_details[i]);
                }
            } catch (e) {
                PageHelper.setError({message: e + " for " + model.master.fixed_assets[model.fixed_assets.asset_details[i].asset_id].asset_description});
                return false;
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
                model.readonly = $stateParams.pageData.readonly;
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
                        _.forOwn(model.master.fixed_assets, function(v,k) {
                            if (v.status == 1) {
                                model.fixed_assets.asset_details.push({
                                    "asset_id": v.asset_type_id
                                })
                            }
                        });
                    }
                    var fixedAssetSheetForm = [];
                    var auditData_fixedAsset = [];

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
                                    "html": "{{model.master.fixed_assets[model.fixed_assets.asset_details[" + i + "].asset_id].asset_description}}"
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
                        "readonly": model.readonly,
                        "title": "FIXED_ASSET",
                        "colClass": "col-sm-12",
                        "items": boxItems
                    }, {
                        "type": "box",
                        "condition": "!model.readonly",
                        "title": "COMMENTS",
                        "colClass": "col-sm-6",
                        "items": [{
                            "key": "model.fixed_assets.comments",
                            "type": "textarea",
                            "title": "COMMENTS"
                        }]
                    }, {
                        "type": "actionbox",
                        "condition": "!model.readonly",
                        "items": [{
                            "type": "submit",
                            "title": "UPDATE"
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
                            }
                        }
                    }
                }
            },
            actions: {
                submit: function(model, form, formName) {
                    if (!validateFixedAssets(model)) return;
                    if (model.$isOffline) {
                        Audit.offline.setFixedAssets(model.audit_id, model.fixed_assets).then(function() {
                            PageHelper.showProgress("auditId", "Fixed Asset Audit Updated Successfully.", 3000);
                            irfNavigator.goBack();
                        }, PageHelper.showErrors).finally(PageHelper.hideLoader)
                    } else {
                        $stateParams.pageData.auditData.fixed_assets = model.fixed_assets;
                        irfNavigator.goBack();
                    }
                }
            }
        };
    }
]);