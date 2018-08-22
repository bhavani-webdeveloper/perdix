irf.pageCollection.factory(irf.page("loans.individual.booking.PendingForPartnerQueue"), ["$log", "formHelper", "entityManager", "PagesDefinition", "IndividualLoan", "$state", "SessionStore", "Utils", "irfNavigator",
    function($log, formHelper, EntityManager, PagesDefinition, IndividualLoan, $state, SessionStore, Utils, irfNavigator) {


        var branch = SessionStore.getBranch();


        var returnObj = {
            "type": "search-list",
            "title": "LOANS_SEARCH",
            "subTitle": "",

            initialize: function(model, form, formCtrl) {
                model.branch = SessionStore.getCurrentBranch().branchId;
                model.DoPartnerView = true;
                PagesDefinition.getRolePageConfig("Page/Engine/loans.individual.booking.PendingForPartnerQueue").then(function(data) {
                    $log.info(data);
                    $log.info(data.DoPartnerView);
                    if (data) {
                        model.DoPartnerView = data.DoPartnerView;
                    }
                }, function(err) {
                    model.DoPartnerView = true;
                });
            },
            definition: {
                title: "SEARCH_LOANS",
                autoSearch: true,
                searchForm: [
                    "*"
                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        'branch': {
                            'title': "BRANCH",
                            "type": ["string", "null"],
                            "x-schema-form": {
                                "type": "userbranch",
                                "screenFilter": true
                            }
                        },
                        "centre": {
                            "title": "CENTRE",
                            "type": ["integer", "null"],
                            "x-schema-form": {
                                "type": "select",
                                "enumCode": "centre",
                                "parentEnumCode": "branch",
                                "parentValueExpr": "model.branch",
                                "screenFilter": true
                            }
                        },
                        "customerId": {
                            "title": "CUSTOMER_ID",
                            "type": "number"
                        },
                        "accountNumber": {
                            "title": "ACCOUNT_NUMBER",
                            "type": "string"
                        }
                    },
                    "required": ["branchName"]
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) { /* Should return the Promise */
                    var promise = IndividualLoan.search({
                        'stage': 'PendingForPartner',
                        'branchId': searchOptions.branch,
                        'centreCode': searchOptions.centre,
                        'customerId': searchOptions.customerId,
                        'accountNumber': searchOptions.accountNumber,
                        'page': pageOpts.pageNo
                    }).$promise;
                    return promise;
                },
                paginationOptions: {
                    "getItemsPerPage": function(response, headers) {
                        return 100;
                    },
                    "getTotalItemsCount": function(response, headers) {
                        return headers['x-total-count']
                    }
                },
                listOptions: {
                    selectable: true,
                    expandable: true,
                    listStyle: "table",
                    itemCallback: function(item, index) {},
                    getItems: function(response, headers) {
                        if (response != null && response.length && response.length != 0) {
                            return response;
                        }
                        return [];
                    },
                    getListItem: function(item) {
                        return [
                            item.auditor_id,
                            item.branch_id,
                            item.start_date,
                            item.end_date,
                            item.report_date,
                            item.status
                        ]
                    },
                    tableConfig: {
                        "serverPaginate": true,
                        "paginate": true,
                        "pageLength": 10
                    },
                    getTableConfig: function() {
                        return this.tableConfig;
                    },

                    getColumns: function() {
                        return [{
                            "title": "ACCOUNT_NUMBER",
                            "data": "accountNumber"
                        }, {
                            "title": "ENTITY_NAME",
                            "data": "customerName"
                        }, {
                            "title": "LOAN_AMOUNT",
                            "data": "loanAmount"
                        }, {
                            "title": "LOAN_TYPE",
                            "data": "loanType"
                        }, {
                            "title": "PARTNER_CODE",
                            "data": "partnerCode"
                        }, {
                            "title": "PROCESS_TYPE",
                            "data": "processType"
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "REVIEW",
                            desc: "",
                            icon: "fa fa-book",
                            fn: function(item, model) {
                                if (!model.searchOptions.DoPartnerView) {
                                    EntityManager.setModel("loans.individual.booking.IFMRDO", {
                                        _loan: item
                                    });
                                    irfNavigator.go({
                                        state: 'Page.Engine',
                                        pageName: "loans.individual.booking.PendingForPartner",
                                        pageId: item.loanId
                                    });
                                } else {
                                    irfNavigator.go({
                                        state: "Page.Bundle",
                                        pageName: "loans.individual.screening.DoPartnerView",
                                        pageId: item.loanId
                                    }, {
                                        state: 'Page.Engine',
                                        pageName: "loans.individual.booking.PendingForPartnerQueue"
                                    });

                                }
                            },
                            isApplicable: function(item, index) {
                                return true;
                            }
                        }];
                    },
                    getBulkActions: function() {
                        return [{
                            name: "Decision",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(items) {
                                $log.info(items);
                                $log.info("items");
                                if (items.length == 0) {
                                    PageHelper.showProgress("bulk-create", "Atleast one loan should be selected for Batch creation", 5000);
                                    return false;
                                }
                                irfNavigator.go({
                                    'state': 'Page.Engine',
                                    'pageName': 'loans.individual.screening.DoPartnerReview',
                                    'pageData': items
                                });

                            },
                            isApplicable: function(items) {
                                return true;
                            }
                        }];
                    }
                }
            }
        };
        return returnObj;
    }
]);