irf.pageCollection.factory(irf.page("audit.detail.PortfolioStats"), ["$log", "PageHelper", "irfNavigator", "$stateParams", "Audit", "SessionStore",
    function($log, PageHelper, irfNavigator, $stateParams, Audit, SessionStore) {

        var branch = SessionStore.getBranch();

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
                var pageData = {
                    "readonly": $stateParams.pageData.readonly
                };
                model.audit_id = Number($stateParams.pageId);
                var master = Audit.offline.getAuditMaster() || {};
                model.portfolio_stats = model.portfolio_stats || {};
                model.portfolio_stats.values_total = 0;
                model.portfolio_stats.values_deviation = 0;
                var self = this;
                self.form = [];
                var init = function(response) {
                    $log.info(response)
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
                            // if (notes.status == 1 && notes.currency_type == "N") {
                            model.portfolio_stats.cash_holding.cash_on_hand.push({
                                "currency_id": notes.currency_id,
                                "units_on_hand": ""
                            })
                        }
                    }

                    var cashDetails = [];
                    var portfolioSheetForm = [];
                    var coinsSheetForm = [];
                    model.total = 0;
                    var notesMap = model.master.portfolio_stats.cash_holding.notes.reduce(function(map, obj) {
                        map[obj.currency_id] = obj;
                        return map;
                    }, {});

                    for (i in model.portfolio_stats.cash_holding.cash_on_hand) {
                        auditData_notes = model.portfolio_stats.cash_holding.cash_on_hand[i];
                        model.portfolio_stats.cash_holding.cash_on_hand[i].denomination = notesMap[auditData_notes.currency_id].denomination;
                        if (notesMap[auditData_notes.currency_id].currency_type == "N") {
                            portfolioSheetForm.push({
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
                                            if (!model.portfolio_stats.cash_holding.cash_on_hand[form.arrayIndex].units_on_hand) {
                                                model.portfolio_stats.cash_holding.cash_on_hand[form.arrayIndex].total_cash = null;
                                            } else {
                                                model.portfolio_stats.cash_holding.cash_on_hand[form.arrayIndex].total_cash = model.portfolio_stats.cash_holding.cash_on_hand[form.arrayIndex].units_on_hand * model.portfolio_stats.cash_holding.cash_on_hand[form.arrayIndex].denomination;
                                            }
                                            model.total = model.total + model.portfolio_stats.cash_holding.cash_on_hand[form.arrayIndex].total_cash;
                                            model.portfolio_stats.sum_total_cash = model.total;
                                        }
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-3",
                                    "items": [{
                                        "key": "portfolio_stats.cash_holding.cash_on_hand[" + i + "].total_cash",
                                        "type": "number",
                                        "readonly": true

                                    }]
                                }]
                            });
                        }
                        if (notesMap[auditData_notes.currency_id].currency_type == "C") {
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
                        }
                    }
                    var boxItems = [{
                        "type": "section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-sm-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'NOTES'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-4",
                            "items": [{
                                "type": "section",
                                "html": "{{'VALUE'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'TOTAL'|translate}}"
                            }]
                        }]
                    }];
                    var boxItemsTwo = [{
                        "type": "section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-sm-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'NOTES'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-4",
                            "items": [{
                                "type": "section",
                                "html": "{{'VALUE'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'TOTAL'|translate}}"
                            }]
                        }]
                    }];

                    var goldDetails = [];
                    if (!model.portfolio_stats.gold_coin)
                        model.portfolio_stats.gold_coin = [];
                    if (!model.portfolio_stats.gold_coin || !model.portfolio_stats.gold_coin.length) {
                        model.portfolio_stats.gold_coin = [];
                        for (j in model.master.portfolio_stats.gold_coin) {
                            var goldCoins = model.master.portfolio_stats.gold_coin[j];
                            model.portfolio_stats.gold_coin_tally.push({
                                "gold_coin_id": goldCoins.gold_coin_id,
                                "coins_in_vault": "",
                                "coins_as_per_cms": "",
                            })

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
                                "htmlClass": "col-sm-1",
                                "items": [{
                                    "html": goldCoinMap[goind_coin.gold_coin_id].description + "X",
                                    "type": "section"
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-3",
                                "items": [{
                                    "key": "portfolio_stats.gold_coin[" + k + "].coins_in_vault",
                                    "type": "number"
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-3",
                                "items": [{
                                    "key": "portfolio_stats.gold_coin[" + k + "].coins_as_per_cms",
                                    "notitle": true,
                                    "onChange": function(modelValue, form, model) {
                                        model.portfolio_stats.gold_coin[form.arrayIndex].differnce = model.portfolio_stats.gold_coin[form.arrayIndex].coins_in_vault - model.portfolio_stats.gold_coin[form.arrayIndex].coins_as_per_cms;
                                    }
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-3",
                                "items": [{
                                    "key": "portfolio_stats.gold_coin[" + k + "].differnce",
                                    "notitle": true,
                                    "readonly": true
                                }]
                            }]
                        });
                    }

                    var boxItemsOne = [{
                        "type": "section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-sm-1",
                            "items": [{
                                "type": "section",
                                "html": "{{'NOTES'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'GOLD_COIN(IN_GRAMS)'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'COINS_IN_VALUT'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'CMS_DIFFERENCES'|translate}}"
                            }]
                        }]
                    }];

                    boxItems.push.apply(boxItems, portfolioSheetForm);
                    boxItems.push.apply(boxItems, [{
                        "key": "portfolio_stats.sum_total_cash",
                        "type": "number",
                        "title": "TOTAL_CASH_BALANCE_ON_HAND"                        
                    }, {
                        "key": "portfolio_stats.cbs_balance",
                        "type": "number",
                        "title": "CBS_BALANCE",
                        "onChange": function(modelValue, form, model) {
                            model.portfolio_stats.deviation = model.portfolio_stats.sum_total_cash - model.portfolio_stats.cbs_balance;
                        }
                    }, {
                        "key": "portfolio_stats.deviation",
                        "type": "number",
                        "title": "DEVIATION"
                    }]);
                    boxItemsOne.push.apply(boxItemsOne, goldDetails);
                    boxItemsTwo.push.apply(boxItemsTwo, coinsSheetForm);
                    self.form = [{
                        "type": "box",
                        "title": "CASH_HOLDING",
                        "colClass": "col-sm-6",
                        "items": [{
                            "key": "portfolio_stats.coin_balance",
                            "type": "number",
                            "title": "COIN_BALANCE",
                            "onChange": function(modelValue, form, model) {
                                model.total = model.total + model.portfolio_stats.coin_balance;
                                model.portfolio_stats.sum_total_cash = model.total;
                            }
                        }, {
                            "type": "section",
                            "html": '<br>'
                        }, {
                            "type": "fieldset",
                            "items": boxItems
                        }]
                    }, {
                        "type": "box",
                        "title": "GOLD_COIN_TALLY",
                        "colClass": "col-sm-6",
                        "items": boxItemsOne
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