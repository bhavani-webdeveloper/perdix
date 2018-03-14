define({
    pageUID: "management.product.SearchProductQueue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "Product", "$state", "SessionStore", "Utils", "irfNavigator"],
    $pageFn: function($log, formHelper, Product, $state, SessionStore, Utils, irfNavigator) {
        return {
            "type": "search-list",
            "title": "SEARCH_PRODUCT_QUEUE",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.product = model.product || {};
            },
            definition: {
                title: "SEARCH_PRODUCT",
                searchForm: [
                    "*"
                ],
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        "productCode": {
                            "title": "PRODUCT_CODE",
                            "type": "string"
                        },
                        "partnerCode": {
                            "key": "product.partnerCode",
                            "title": "PARTNER_CODE",
                            "type": "string",
                            "enumCode": "partner",
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                        "loanType": {
                            "key": "product.loanType",
                            "title": "LOAN_TYPE",
                            "type": "string",
                            "x-schema-form": {
                                "type": "select",
                                "titleMap": [{
                                    "name": "JLG",
                                    "value": "JLG"
                                }, {
                                    "name": "JEWEL",
                                    "value": "JEWEL"
                                }, {
                                    "name": "SECURED",
                                    "value": "SECURED",
                                }, {
                                    "name": "UNSECURED",
                                    "value": "UNSECURED",
                                }]
                            }
                        },
                        "productType": {
                            "key": "product.productType",
                            "title": "PRODUCT_TYPE",
                            "type": "string",
                            "x-schema-form": {
                                "type": "select",
                                "titleMap": [{
                                    "name": "EQ",
                                    "value": "EQ"
                                }, {
                                    "name": "OD",
                                    "value": "OD"
                                }, {
                                    "name": "BULLET",
                                    "value": "BULLET",
                                }]
                            }
                        },
                        "frequency": {
                            "key": "product.frequency",
                            "title": "FREQUENCY",
                            "type": "string",
                            "enumCode": "frequency",
                            "x-schema-form": {
                                "type": "select"
                            }

                        },
                        "processType": {
                            "key": "product.processType",
                            "title": "PROCESS_TYPE",
                            "type": "string",
                            "x-schema-form": {
                                "type": "select",
                                "titleMap": [{
                                    "name": "OWN",
                                    "value": "OWN"
                                }, {
                                    "name": "BC",
                                    "value": "BC"
                                }]
                            }
                        },
                    }
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    var promise = Product.search({
                        'partnerCode': searchOptions.partnerCode,
                        'productCode': searchOptions.productCode,
                        'loanType': searchOptions.loanType,
                        'frequency': searchOptions.frequency,
                        'page': pageOpts.loanType,
                        'per_page': pageOpts.itemsPerPage,
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
                    selectable: false,
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
                            item.productCode,
                            item.partnerCode,
                            item.loanType,
                            item.productType,
                            item.processType,
                            item.frequency,
                        ]
                    },
                    getTableConfig: function() {
                        return {
                            // "serverPaginate": true,
                            "paginate": true,
                            "pageLength": 10
                        };
                    },
                    getColumns: function() {
                        return [{
                            title: 'PRODUCT_CODE',
                            data: 'productCode'
                        }, {
                            title: 'PARTNER_CODE',
                            data: 'partnerCode'
                        }, {
                            title: 'LOAN_TYPE',
                            data: 'loanType'
                        }, {
                            title: 'PRODUCT_TYPE',
                            data: 'productType'
                        }, {
                            title: 'PROCESS_TYPE',
                            data: 'processType'
                        }, {
                            title: 'FREQUENCY',
                            data: 'frequency'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "View PRODUCT",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    state: "Page.Engine",
                                    pageName: "management.product.NewProduct",
                                    pageId: item.productCode,
                                    pageData: {
                                        _lucCompleted: true
                                    }
                                }, {
                                    state: "Page.Engine",
                                    pageName: "management.product.SearchProductQueue",
                                });
                            },
                            isApplicable: function(item, index) {

                                return true;
                            }
                        }, {
                            name: "PRODUCT BRANCH",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    state: "Page.Engine",
                                    pageName: "management.product.ProductBranch",
                                    pageId: item.productCode,
                                    pageData: {
                                        _lucCompleted: true
                                    }
                                }, {
                                    state: "Page.Engine",
                                    pageName: "management.product.SearchProductQueue",
                                });
                            },
                            isApplicable: function(item, index) {
                                return true;
                            }
                        }];
                    }
                }
            }
        }
    }
})