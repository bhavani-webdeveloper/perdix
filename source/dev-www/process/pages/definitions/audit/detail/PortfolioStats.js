irf.pageCollection.factory(irf.page("audit.detail.PortfolioStats"), ["$log", "PageHelper", "irfNavigator", "$stateParams", "Audit", "SessionStore",
    function($log, PageHelper, irfNavigator, $stateParams, Audit, SessionStore) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "PORTFOLIO_STATS",
            // "subTitle": "Demo3 page Sub Title",
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
                model.auditId = Number($stateParams.pageId);             
                var master = Audit.offline.getAuditMaster() || {};
                model.portfolio_stats = model.portfolio_stats || {};
                model.portfolio_stats.values_total = 0;
                model.portfolio_stats.values_deviation = 0;
                var self = this;
                Audit.offline.getPortfolioStats("1").then(function(res) {
                    self.form = [];
                    model.portfolio_stats = res;
                    var cashDetails = [];
                    for (i in model.portfolio_stats.cash_holding.cash_on_hand) {
                        cashDetails.push({
                            key: "portfolio_stats.cash_holding.cash_on_hand[" + i + "].units_on_hand",
                            titleExpr: "model.portfolio_stats.cash_holding.cash_on_hand[" + i + "].currency_id + 'X'",
                            title: "10 X"
                        })
                    }
                    var goldDetails = [];
                    for (i in model.portfolio_stats.gold_coin_tally) {
                        goldDetails.push({
                            key: "portfolio_stats.gold_coin_tally[" + i + "].coins_in_vault",
                            titleExpr: "model.portfolio_stats.gold_coin_tally[" + i + "].gold_coin_id + 'X'",
                            title: "Coins in Vault"
                        })
                    }
                    self.form = [{
                        "type": "box",
                        "title": "CASH_HOLDING",
                        "items": [{
                            type: "fieldset",
                            title: "COINS",
                            "items": [{
                                key: "portfolio_stats.cash_holding.coin_balance",
                                type: "number",
                                title: "COIN_BALANCE"
                            }],
                        }, {
                            type: "fieldset",
                            title: "NOTES",
                            items: cashDetails
                        }, {
                            key: "portfolio_stats.values_total",
                            readonly: true,
                        }, {
                            key: "portfolio_stats.cash_holding.cbs_balance",
                            type: "number",
                            title: "CBS_BALANCE"
                        }, {
                            key: "portfolio_stats.values_deviation",
                            readonly: true
                        }]
                    }, {
                        "type": "box",
                        "title": "GOLD_COIN_TALLY",
                        "items": goldDetails
                    }, {
                        "type": "box",
                        "title": " PORTFOLIO_STATUS_COMMENT",
                        "items": [{
                            key: "portfolio_stats.comments",
                            type: "textarea",

                        }]
                    }, {
                        type: "actionbox",
                        items: [{
                                type: "submit",
                                title: "SAVE"
                            }, {
                                type: "submit",
                                title: "PUBLISH"
                            }

                        ]
                    }]

                }, function(errRes) {
                    PageHelper.showErrors(errRes);
                }).finally(function() {
                    PageHelper.hideLoader();
                })
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
                    // $log.info('on submit action ....');
                }
            }
        };
    }
]);