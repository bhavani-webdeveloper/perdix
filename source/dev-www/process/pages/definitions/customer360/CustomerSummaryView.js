irf.pageCollection.factory(irf.page("customer360.CustomerSummaryView"), ["$log", "$stateParams", "SessionStore", "PageHelper", "formHelper", "RolesPages", "Utils", "translateFilter", "Enrollment", "$q",
    function($log, $stateParams, SessionStore, PageHelper, formHelper, RolesPages, Utils, translateFilter, Enrollment, $q) {
        var strongRender = function(data, type, full, meta) {
            return '<strong>' + data + '</strong>';
        }

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "",
            initialize: function(model, form, formCtrl) {

            },
            modelPromise: function(pageId, model) {
                var deferred = $q.defer();
                PageHelper.showLoader();
                Enrollment.getCustomerSummary({
                    cid: pageId
                }).$promise.then(function(res) {
                    deferred.resolve({
                        customerSummary: res
                    });
                }, deferred.reject).finally(PageHelper.hideLoader);
                return deferred.promise;
            },
            form: [{
                "type": "box",
                "readonly": true,
                "colClass": "col-sm-12",
                "title": "CUSTOMER_SUMMARY",
                "items": [{
                    "type": "section",
                    "htmlClass": "row",
                    "items": [{
                        "type": "section",
                        "htmlClass": "col-sm-6", // left side
                        "items": [{
                            "type": "section",
                            "html": '<h4 style="padding:5px 10px;margin:0 -10px 5px;background-color:powderblue">{{form.title|translate}}</h4>',
                            "title": "Segment"
                        }, {
                            "key": "customerSummary.Segment.Segment",
                            "title": "SEGMENT"
                        }, {
                            "key": "customerSummary.Segment.Last_edited_date",
                            "title": "LAST_EDITED_DATE",
                            "type": "date"
                        }, {
                            "type": "section",
                            "html": '<h4 style="padding:5px 10px;margin:0 -10px 5px;background-color:powderblue">{{form.title|translate}}</h4>',
                            "title": "HOUSEHOLD_COMPOSITION"
                        }, {
                            "type": "section",
                            "htmlClass": "row",
                            "items": [{
                                "type": "section",
                                "htmlClass": "col-sm-6",
                                "items": [{
                                    "key": "customerSummary.Household_Composition.Primary_income_earner",
                                    "title": "PRIMARY_INCOME_EARNER",

                                }, {
                                    "key": "customerSummary.Household_Composition.Size_of_household",
                                    "title": "SIZE_OF_HOUSEHOLD",

                                }, {
                                    "key": "customerSummary.Household_Composition.Primary_earner_age",
                                    "title": "PRIMARY_EARNER_AGE",

                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-6",
                                "items": [{
                                    "key": "customerSummary.Household_Composition.Total_expenses",
                                    "title": "TOTAL_EXPENSES",

                                }, {
                                    "key": "customerSummary.Household_Composition.Total_income",
                                    "title": "TOATL_INCOME",

                                }]
                            }]
                        }, {
                            "type": "tableview",
                            "listStyle": "table",
                            "searching": false,
                            "paginate": false,
                            "title": "",
                            "key": "customerSummary.Household_Composition.dependants",
                            getColumns: function() {
                                return [{
                                    "title": "DEPENDENTS",
                                    "data": "Dependants"
                                }, {
                                    "title": "DEP_LESS_THAN_18",
                                    "data": "dep_less_than_18"

                                }, {
                                    "title": "DEP_BET_18_27",
                                    "data": "dep_bet_18_27"

                                }, {
                                    "title": "DEP_ABV_27",
                                    "data": "dep_abv_27"

                                }];
                            },
                            getActions: function() {
                                return [];
                            }

                        }, {
                            "type": "section",
                            "html": '<h4 style="padding:5px 10px;margin:0 -10px 2px;background-color:powderblue">{{form.title|translate}}</h4>',
                            "title": "LOANS"
                        }, {
                            "type": "section",
                            "items": [{
                                "type": "tableview",
                                "listStyle": "table",
                                "searching": false,
                                "paginate": false,
                                "key": "customerSummary.Loans.Loan_count",
                                getColumns: function() {
                                    return [{
                                        "title": "STATUS",
                                        "data": "Status"
                                    }, {
                                        "title": "JLG",
                                        "data": "JLG"
                                    }, {
                                        "title": "MEL",
                                        "data": "MEL"
                                    }, {
                                        "title": "PERSONAL",
                                        "data": "PERSONAL"

                                    }, {
                                        "title": "OTHERS",
                                        "data": "OTHERS"
                                    }];
                                },
                                getActions: function() {
                                    return [];
                                }
                            }]
                        }, {
                            "type": "section",
                            "items": [{
                                "type": "tableview",
                                "key": "customerSummary.Loans.Outstanding_amount",
                                "title": "Outstanding Amount",
                                "listStyle": "table",
                                "searching": false,
                                "paginate": false,
                                getColumns: function() {
                                    return [{
                                        "title": "PRODUCT",
                                        "data": "product"

                                    }, {
                                        "title": "OUTSTANDING_AMOUNT",
                                        "data": "outstanding_amt"

                                    }, {
                                        "title": "OVERDUE_DAYS",
                                        "data": "overdue_days"

                                    }, {
                                        "title": "MATURITY_DATE",
                                        "data": "maturity_date"
                                    }];
                                },
                                getActions: function() {
                                    return [];
                                }
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "horizontal",
                            "items": [{
                                "type": "grid",
                                "orientation": "vertical",
                                "colClass": "col-sm-6",
                                "items": [{
                                    "key": "customerSummary.Loans.Credit_score",
                                    "title": "CREDIT_SCORE",
                                    "type": "number"
                                }]
                            }, {
                                "type": "grid",
                                "orientation": "vertical",
                                "items": [{
                                    "key": "customerSummary.Loans.Owns_a_shop",
                                    "title": "OWNS_A_SHOP",
                                    "type": ""
                                }]
                            }]
                        }, {
                            "type": "section",
                            "html": '<br><a target="_blank" ng-href="{{model.customerSummary.google_link}}">{{form.title|translate}}</a>',
                            "title": "CUSTOMER_INPUT_FORM"
                        }]
                    }, {
                        "type": "section",
                        "htmlClass": "col-sm-6", // right side
                        "items": [{
                            "type": "section",
                            "html": '<h4 style="padding:5px 10px;margin:0 -10px 5px;background-color:powderblue">{{form.title|translate}}</h4>',
                            "title": "Eligibility Criteria"
                        }, {
                            "type": "tableview",
                            "listStyle": "table",
                            "searching": false,
                            "paginate": false,
                            "key": "customerSummary.Eligibility_Criteria",
                            getColumns: function() {
                                return [{
                                    "title": "PRODUCT",
                                    "data": "product"
                                }, {
                                    "title": "ELIGIBILITY",
                                    "data": "eligibility"

                                }]
                            },
                            getActions: function(item) {
                                return [];
                            }
                        }, {
                            "type": "section",
                            "html": '<h4 style="padding:5px 10px;margin:0 -10px 5px;background-color:powderblue">{{form.title|translate}}</h4>',
                            "title": "INSURANCE"
                        }, {
                            "type": "tableview",
                            "key": "customerSummary.Insurance",
                            "listStyle": "table",
                            "searching": false,
                            "paginate": false,
                            getColumns: function() {
                                return [{
                                    "title": "CUSTOMER",
                                    "data": "customer"

                                }, {
                                    "title": "PRODUCT",
                                    "data": "product"

                                }, {
                                    "title": "EXPIRES_IN",
                                    "data": "expires_in"

                                }, {
                                    "title": "COVERAGE",
                                    "data": "coverage"

                                }, {
                                    "title": "PRODUCT_CLOSE_DATE",
                                    "data": "product_close_date"

                                }];
                            },
                            getActions: function() {
                                return [];
                            }
                        }, {
                            "type": "section",
                            "html": '<h4 style="padding:5px 10px;margin:0 -10px 5px;background-color:powderblue">{{form.title|translate}}</h4>',
                            "title": "Savings"
                        }, {
                            "type": "tableview",
                            "listStyle": "table",
                            "searching": false,
                            "paginate": false,
                            "key": "customerSummary.savings",
                            getColumns: function() {
                                return [{
                                    "title": "DEPOSIT_AMOUNT",
                                    "data": "transaction_amount"
                                }, {
                                    "title": "DEPOSIT_DATE",
                                    "data": "transaction_date"
                                }];
                            },
                            getActions: function() {
                                return [];
                            }
                        }, {
                            "type": "section",
                            "html": '<h4 style="padding:5px 10px;margin:0 -10px 5px;background-color:powderblue">{{form.title|translate}}</h4>',
                            "title": "REMITTANCE"
                        }, {
                            "type": "tableview",
                            "listStyle": "table",
                            "searching": false,
                            "paginate": false,
                            "key": "customerSummary.remittance",
                            getColumns: function() {
                                return [{
                                    "title": "AMOUNT",
                                    "data": "amount"

                                }, {
                                    "title": "WITHDRAWAL_DATE",
                                    "data": "withdrawal_date"

                                }, {
                                    "title": "AGENT",
                                    "data": "agent"

                                }];
                            },
                            getActions: function() {
                                return [];
                            }
                        }]
                    }]
                }]

            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "customerSummary": {
                        "type": "object",
                        "title": "Address",
                        "properties": {
                            "Segmant": {
                                "type": "string",
                                "title": "Segment Name"
                            },
                            "LastInteraction": {
                                "type": "string",
                                "title": "Last Interaction"
                            },
                            "lastEditedDate": {
                                "type": "date",
                                "title": "Last Edited Date"
                            },
                            "targetProduct": {
                                "type": "string",
                                "title": "Target Product"
                            }
                        }
                    }
                }
            },
            actions: {
                submit: function(model, form, formName) {}
            }
        };
    }
]);