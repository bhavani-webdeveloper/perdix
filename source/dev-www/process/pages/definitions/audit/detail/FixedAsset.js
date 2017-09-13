irf.pageCollection.factory(irf.page("audit.detail.FixedAsset"), ["$log", "PageHelper", "irfNavigator", "$stateParams", "Audit", "SessionStore",
    function($log, PageHelper, irfNavigator, $stateParams, Audit, SessionStore) {
        var master = null;
        var validateFields = function(model) {
            for (i in model.fixed_assets.asset_details) {
                var id = model.fixed_assets.asset_details[i];
                var master_id = master.fixed_assets[id.asset_id]
                var lostValue = model.fixed_assets.asset_details[i].lost_quantity;
                    $log.info(lostValue)
                    $log.info("lostValue")

                // var transferValue = model.fixed_assets.asset_details[id.asset_id].transferred_quantity;
                // var excessValue = model.fixed_assets.asset_details[id.asset_id].excess_quantity;
                // var availableValue = model.fixed_assets.asset_details[id.asset_id].quantity_on_hand;
            }
            // if (!lostValue == 0 || !transferValue == 0) {
            //     PageHelper.setError({
            //         message: "Value should be zero"
            //     });
            //     return false;
            // }
            // if (excessValue > availableValue) {
            //     PageHelper.setError({
            //         message: "Excess value should not be greater than ‘available’ value"
            //     });
            //     return false;
            // }
            
            // return true;
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
                    $log.info(response)
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
                                    "asset_description": asset_details.asset_description,
                                    "quantity_on_record": "",
                                    "quantity_on_hand": "",
                                    "lost_quantity": "",
                                    "transferred_quantity": "",
                                    "excess_quantity": "",
                                    "description": "",
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
                                "htmlClass": "col-sm-2",
                                "items": [{
                                    "key": "fixed_assets.asset_details[" + i + "].asset_description",
                                    "type": "string",
                                    "readonly": true
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-1",
                                "items": [{
                                    "key": "fixed_assets.asset_details[" + i + "].quantity_on_record",
                                    "readonly": true,
                                    "type": "string"
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-2",
                                "items": [{
                                    "key": "fixed_assets.asset_details[" + i + "].quantity_on_hand",
                                    "type": "number",
                                    // "required": true,

                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-1",
                                "items": [{
                                    "key": "fixed_assets.asset_details[" + i + "].lost_quantity",
                                    "type": "number",
                                    // "required": true

                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-2",
                                "items": [{
                                    "key": "fixed_assets.asset_details[" + i + "].transferred_quantity",
                                    "type": "number",
                                    // "required": true

                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-2",
                                "items": [{
                                    "key": "fixed_assets.asset_details[" + i + "].excess_quantity",
                                    "type": "number",
                                    // "required": true,
                                    // "onChange": function(modelValue, form, model) {
                                    //     if (model.fixed_assets.asset_details[form.arrayIndex].quantity_on_hand > model.fixed_assets.asset_details[form.arrayIndex].quantity_on_record) {
                                    //         model.fixed_assets.asset_details[form.arrayIndex].quantity_on_record = model.fixed_assets.asset_details[form.arrayIndex].quantity_on_hand - model.fixed_assets.asset_details[form.arrayIndex].excess_quantity;
                                    //         if (!model.fixed_assets.asset_details[form.arrayIndex].lost_quantity == 0 && !model.fixed_assets.asset_details[form.arrayIndex].transferred_quantity) {
                                    //             PageHelper.setError({
                                    //                 message: "Value should be zero"
                                    //             });
                                    //             return false;
                                    //         }
                                    //     } else if (model.fixed_assets.asset_details[form.arrayIndex].quantity_on_hand < model.fixed_assets.asset_details[form.arrayIndex].quantity_on_record) {
                                    //         model.fixed_assets.asset_details[form.arrayIndex].quantity_on_record = model.fixed_assets.asset_details[form.arrayIndex].quantity_on_hand + (model.fixed_assets.asset_details[form.arrayIndex].lost_quantity + fixed_assets.asset_details[form.arrayIndex].transferred_quantity)
                                    //     }

                                    // }

                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-2",
                                "items": [{
                                    "key": "fixed_assets.asset_details[" + i + "].description",
                                    "type": "string",
                                    // "required": true

                                }]
                            }]
                        });
                    }
                    var boxItems = [{
                        "type": "section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-sm-2",
                            "items": [{
                                "type": "section",
                                "html": "{{'ASSET'|translate}}",
                                "required": true

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
                            "htmlClass": "col-sm-2",
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
                            "htmlClass": "col-sm-2",
                            "items": [{
                                "type": "section",
                                "html": "{{'TRANFERRED'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-2",
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
                    // boxItems.push.apply(boxItems, [{
                    //     "key": "portfolio_stats.sum_total_cash",
                    //     "type": "number",
                    //     "title": "TOTAL_CASH_BALANCE_ON_HAND"
                    // }, {
                    //     "key": "portfolio_stats.cbs_balance",
                    //     "type": "number",
                    //     "title": "CBS_BALANCE",
                    //     "onChange": function(modelValue, form, model) {
                    //         model.portfolio_stats.deviation = model.portfolio_stats.sum_total_cash - model.portfolio_stats.cbs_balance;
                    //     }
                    // }, {
                    //     "key": "portfolio_stats.deviation",
                    //     "type": "number",
                    //     "title": "DEVIATION"
                    // }]);


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
                            key: "model.portfolio_stats.comments",
                            title: "COMMENTS"
                        }]
                    }, {
                        type: "actionbox",
                        items: [{
                            type: "submit",
                            title: "SAVE"
                        }]
                    }];

                };

                model.$isOffline = false;
                if ($stateParams.pageData && $stateParams.pageData.auditData && $stateParams.pageData.auditData.getFixedAssets) {
                    init($stateParams.pageData.auditData.getFixedAssets);
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
                    "getFixedAssets": {
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
                        Audit.offline.setPortfolioStats(model.audit_id, model.portfolio_stats).then(function(res) {
                            if (!validateFields(model)) return;
                            model.portfolio_stats = res;
                            PageHelper.showProgress("auditId", "Portfolio Audit Updated Successfully.", 3000);
                            irfNavigator.goBack();
                        }, function(errRes) {
                            PageHelper.showErrors(errRes);
                        }).finally(function() {
                            PageHelper.hideLoader();
                        })
                    } else {
                        $stateParams.pageData.auditData.portfolio_stats = model.portfolio_stats;
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