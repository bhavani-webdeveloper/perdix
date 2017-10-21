irf.pageCollection.factory(irf.page("audit.detail.PortfolioStats"), ["$log", "PageHelper", "irfNavigator", "$stateParams", "Audit", "SessionStore",
    function($log, PageHelper, irfNavigator, $stateParams, Audit, SessionStore) {

        var branch = SessionStore.getBranch();

        var recomputeCashTotals = function(model, initialize) {
            var total = model.portfolio_stats.cash_holding.coin_balance;
            for (i in model.portfolio_stats.cash_holding.cash_on_hand) {
                var c = model.portfolio_stats.cash_holding.cash_on_hand[i];
                initialize && c.total_cash = c.units_on_hand * c.denomination;
                total += c.total_cash;
            }
            model.portfolio_stats.cash_holding.sum_total_cash = total;
            model.portfolio_stats.cash_holding.deviation = total - model.portfolio_stats.cash_holding.cbs_balance;
        }

        return {
            "type": "schema-form",
            "title": "PORTFOLIO_STATS",
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
                var master = Audit.offline.getAuditMaster() || {};
                model.portfolio_stats = model.portfolio_stats || {};
                var self = this;
                self.form = [];

                model.cashDeviationHTML = '<div style="text-align:right;margin-right:11px;color:tomato;font-weight:bold">{{model.portfolio_stats.cash_holding.deviation}}</div>';
                
                var init = function(response) {
                    model.master = master;
                    model.portfolio_stats = response;

                    if (!model.portfolio_stats) {
                        model.portfolio_stats = {};
                    }
                    if (!model.portfolio_stats.cash_holding)
                        model.portfolio_stats.cash_holding = {};
                    if (!model.portfolio_stats.cash_holding.cash_on_hand || !model.portfolio_stats.cash_holding.cash_on_hand.length) {
                        model.portfolio_stats.cash_holding.cash_on_hand = [];
                        for (i in model.master.portfolio_stats.cash_holding.notes) {
                            var notes = model.master.portfolio_stats.cash_holding.notes[i];
                            model.portfolio_stats.cash_holding.cash_on_hand.push({
                                "currency_id": notes.currency_id,
                                "units_on_hand": 0,
                                "total_cash": 0
                            })
                        }
                    }
                    if (!model.portfolio_stats.cash_holding.coin_balance) {
                        model.portfolio_stats.cash_holding.coin_balance = 0;
                    }
                    if (!model.portfolio_stats.cash_holding.cbs_balance) {
                        model.portfolio_stats.cash_holding.cbs_balance = 0;
                    }

                    var cashDetails = [];
                    var notesForm = [];
                    var coinsSheetForm = [];
                    model.total = 0;
                    var notesMap = model.master.portfolio_stats.cash_holding.notes.reduce(function(map, obj) {
                        map[obj.currency_id] = obj;
                        return map;
                    }, {});

                    for (i in model.portfolio_stats.cash_holding.cash_on_hand) {
                        var auditData_notes = model.portfolio_stats.cash_holding.cash_on_hand[i];
                        model.portfolio_stats.cash_holding.cash_on_hand[i].denomination = notesMap[auditData_notes.currency_id].denomination;
                        if (notesMap[auditData_notes.currency_id].currency_type == "N") {
                            if (!model.portfolio_stats.cash_holding.cash_on_hand[i].units_on_hand) {
                                model.portfolio_stats.cash_holding.cash_on_hand[i].units_on_hand = 0;
                                model.portfolio_stats.cash_holding.cash_on_hand[i].total_cash = 0;
                            }
                            notesForm.push({
                                "type": "section",
                                "htmlClass": "row",
                                "items": [{
                                    "type": "section",
                                    "htmlClass": "col-sm-4",
                                    "items": [{
                                        "html": notesMap[auditData_notes.currency_id].denomination + 'X',
                                        "htmlClass": "control-label",
                                        "type": "section"
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-4",
                                    "items": [{
                                        "key": "portfolio_stats.cash_holding.cash_on_hand[" + i + "].units_on_hand",
                                        "notitle": true,
                                        "type": "number",
                                        "fieldHtmlClass": "text-right",
                                        "onChange": function(modelValue, form, model) {
                                            if (!modelValue) {
                                                model.portfolio_stats.cash_holding.cash_on_hand[form.arrayIndex].units_on_hand = 0;
                                                model.portfolio_stats.cash_holding.cash_on_hand[form.arrayIndex].total_cash = 0;
                                            }
                                            model.portfolio_stats.cash_holding.cash_on_hand[form.arrayIndex].total_cash = model.portfolio_stats.cash_holding.cash_on_hand[form.arrayIndex].units_on_hand * model.portfolio_stats.cash_holding.cash_on_hand[form.arrayIndex].denomination;
                                            recomputeCashTotals(model);
                                        }
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-4",
                                    "items": [{
                                        "key": "portfolio_stats.cash_holding.cash_on_hand[" + i + "].total_cash",
                                        "notitle": true,
                                        "type": "number",
                                        "fieldHtmlClass": "text-right",
                                        "readonly": true

                                    }]
                                }]
                            });
                        }
                        /*if (notesMap[auditData_notes.currency_id].currency_type == "C") {
                            coinsSheetForm.push({
                                "type": "section",
                                "htmlClass": "row",
                                "items": [{
                                    "type": "section",
                                    "htmlClass": "col-sm-3",
                                    "items": [{
                                        "html": notesMap[auditData_notes.currency_id].denomination + "X",
                                        "key": "portfolio_stats.cash_holding.cash_on_hand[" + i + "].denomination" + "X",
                                        "type": "section"
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-4",
                                    "items": [{
                                        "key": "portfolio_stats.cash_holding.cash_on_hand[" + i + "].units_on_hand",
                                        "type": "number",
                                        "onChange": function(modelValue, form, model) {
                                            model.portfolio_stats.cash_holding.cash_on_hand[form.arrayIndex].total_coin = model.portfolio_stats.cash_holding.cash_on_hand[form.arrayIndex].units_on_hand * model.portfolio_stats.cash_holding.cash_on_hand[form.arrayIndex].denomination;
                                        }
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-3",
                                    "items": [{
                                        "key": "portfolio_stats.cash_holding.cash_on_hand[" + i + "].total_coin",
                                        "type": "number",
                                        "readonly": true,
                                        "onChange": function(modelValue, form, model) {
                                            model.portfolio_stats.sum_total_coin = model.portfolio_stats.cash_holding.cash_on_hand[form.arrayIndex].total_coin + model.portfolio_stats.cash_holding.cash_on_hand[form.arrayIndex].total_coin;
                                        }
                                    }]
                                }]
                            });
                        }*/
                    }
                    recomputeCashTotals(model, true);

                    var goldDetails = [];
                    if (!model.portfolio_stats.gold_coin_tally || !model.portfolio_stats.gold_coin_tally.length) {
                        model.portfolio_stats.gold_coin_tally = [];
                        for (j in model.master.portfolio_stats.gold_coin) {
                            var goldCoins = model.master.portfolio_stats.gold_coin[j];
                            model.portfolio_stats.gold_coin_tally.push({
                                "gold_coin_id": goldCoins.gold_coin_id,
                                "coins_in_vault": 0,
                                "coins_as_per_cms": 0
                            });
                        }
                    }

                    var goldCoinMap = model.master.portfolio_stats.gold_coin.reduce(function(map, obj) {
                        map[obj.gold_coin_id] = obj;
                        return map;
                    }, {});

                    for (k in model.portfolio_stats.gold_coin_tally) {
                        var goind_coin = model.portfolio_stats.gold_coin_tally[k];
                        goldDetails.push({
                            "type": "section",
                            "htmlClass": "row",
                            "items": [{
                                "type": "section",
                                "htmlClass": "col-sm-3",
                                "items": [{
                                    "html": goldCoinMap[goind_coin.gold_coin_id].description + "X",
                                    "type": "section",
                                    "htmlClass": "control-label"
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-3",
                                "items": [{
                                    "key": "portfolio_stats.gold_coin_tally[" + k + "].coins_in_vault",
                                    "type": "number",
                                    "fieldHtmlClass": "text-right",
                                    "notitle": true,
                                    "onChange": function(modelValue, form, model) {
                                        model.portfolio_stats.gold_coin_tally[form.arrayIndex].differnce = model.portfolio_stats.gold_coin_tally[form.arrayIndex].coins_in_vault - model.portfolio_stats.gold_coin_tally[form.arrayIndex].coins_as_per_cms;
                                    }
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-3",
                                "items": [{
                                    "key": "portfolio_stats.gold_coin_tally[" + k + "].coins_as_per_cms",
                                    "type": "number",
                                    "fieldHtmlClass": "text-right",
                                    "notitle": true,
                                    "onChange": function(modelValue, form, model) {
                                        model.portfolio_stats.gold_coin_tally[form.arrayIndex].differnce = model.portfolio_stats.gold_coin_tally[form.arrayIndex].coins_in_vault - model.portfolio_stats.gold_coin_tally[form.arrayIndex].coins_as_per_cms;
                                    }
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-3",
                                "items": [{
                                    "type": "section",
                                    "condition": 'model.portfolio_stats.gold_coin_tally['+k+'].differnce',
                                    "htmlClass": "control-label",
                                    "html": '<div style="text-align:right;margin-right:11px;color:tomato;font-weight:bold">{{model.portfolio_stats.gold_coin_tally['+k+'].differnce}}</div>'
                                }]
                            }]
                        });
                    }

                    var cashHoldingBoxItems = [{
                        "type": "section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-sm-4",
                            "items": [{
                                "type": "section",
                                "htmlClass": "control-label",
                                "html": "{{'NOTES'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-4",
                            "items": [{
                                "type": "section",
                                "htmlClass": "control-label",
                                "html": "{{'VALUE'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-4",
                            "items": [{
                                "type": "section",
                                "htmlClass": "control-label",
                                "html": "{{'TOTAL'|translate}}"
                            }]
                        }]
                    }];
                    cashHoldingBoxItems.push.apply(cashHoldingBoxItems, notesForm);
                    cashHoldingBoxItems.push.apply(cashHoldingBoxItems, [{
                        "key": "portfolio_stats.cash_holding.sum_total_cash",
                        "type": "number",
                        "fieldHtmlClass": "text-right",
                        "title": "TOTAL_CASH_BALANCE_ON_HAND",
                        "readonly": true
                    }, {
                        "key": "portfolio_stats.cash_holding.cbs_balance",
                        "type": "number",
                        "fieldHtmlClass": "text-right",
                        "title": "CBS_BALANCE",
                        "onChange": function(modelValue, form, model) {
                            if (!modelValue) {
                                model.portfolio_stats.cash_holding.cbs_balance = 0;
                            }
                            recomputeCashTotals(model);
                        }
                    }, {
                        "key": "cashDeviationHTML",
                        "type": "html",
                        "title": "CASH_DEVIATION",
                        "readonly": true
                    }]);

                    var goldCoinTallyBoxItems = [{
                        "type": "section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-sm-3",
                            "items": [{
                                "type": "section",
                                "htmlClass": "control-label",
                                "html": "{{'NOTES'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-3",
                            "items": [{
                                "type": "section",
                                "htmlClass": "control-label",
                                "html": "{{'GOLD_COIN(IN_GRAMS)'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-3",
                            "items": [{
                                "type": "section",
                                "htmlClass": "control-label",
                                "html": "{{'COINS_IN_VALUT'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-3",
                            "items": [{
                                "type": "section",
                                "htmlClass": "control-label",
                                "html": "{{'CMS_DIFFERENCES'|translate}}"
                            }]
                        }]
                    }];
                    goldCoinTallyBoxItems.push.apply(goldCoinTallyBoxItems, goldDetails);

                    /*var boxItemsTwo = [{
                        "type": "section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-sm-4",
                            "items": [{
                                "type": "section",
                                "htmlClass": "control-label",
                                "html": "{{'NOTES'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-4",
                            "items": [{
                                "type": "section",
                                "htmlClass": "control-label",
                                "html": "{{'VALUE'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-4",
                            "items": [{
                                "type": "section",
                                "htmlClass": "control-label",
                                "html": "{{'TOTAL'|translate}}"
                            }]
                        }]
                    }];
                    boxItemsTwo.push.apply(boxItemsTwo, coinsSheetForm);*/

                    self.form = [{
                        "type": "box",
                        "title": "CASH_HOLDING",
                        "readonly": model.readonly,
                        "items": [{
                            "key": "portfolio_stats.cash_holding.coin_balance",
                            "type": "number",
                            "fieldHtmlClass": "text-right",
                            "title": "COIN_BALANCE",
                            "onChange": function(modelValue, form, model) {
                                if (!modelValue) {
                                    model.portfolio_stats.cash_holding.coin_balance = 0;
                                }
                                recomputeCashTotals(model);
                            }
                        }, {
                            "type": "section",
                            "html": '<hr>'
                        }, {
                            "type": "fieldset",
                            "items": cashHoldingBoxItems
                        }]
                    }, {
                        "type": "box",
                        "title": "GOLD_COIN_TALLY",
                        "readonly": model.readonly,
                        "items": goldCoinTallyBoxItems
                    }, {
                        "type": "box",
                        "title": "COMMENTS",
                        "readonly": model.readonly,
                        "items": [{
                            key: "portfolio_stats.comments",
                            type: "textarea",
                            title: "COMMENTS"
                        }]
                    }, {
                        type: "actionbox",
                        condition: "!model.readonly",
                        items: [{
                            type: "submit",
                            title: "UPDATE"
                        }]
                    }];

                };

                model.$isOffline = false;
                if ($stateParams.pageData && $stateParams.pageData.auditData && $stateParams.pageData.auditData.portfolio_stats) {
                    init($stateParams.pageData.auditData.portfolio_stats);
                } else {
                    Audit.offline.getPortfolioStats($stateParams.pageId).then(function(res) {
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
                    "portfolio_stats": {
                        "type": "object",
                        "title": "",
                        "properties": {
                            "cash_holding": {
                                "type": "object",
                                "properties": {
                                    "coin_balance": {
                                        "type": "number",
                                        "title": "COIN_BALANCE"
                                    },
                                    "cbs_balance": {
                                        "type": "number",
                                        "title": "CBS_BALANCE"
                                    }
                                }
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