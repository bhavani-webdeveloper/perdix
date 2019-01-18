define({
    pageUID: "Journal.CompletedFinconAccountingQueue",
    pageType: "Engine",
    dependencies: ["$log", "$state", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],
    $pageFn: function($log, $state, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

        return {
            "type": "search-list",
            "title": "COMPLETED_FINCON_ACCOUNTING_QUEUE",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("FinconAccountingQueue Queue got initialized");
            },
            definition: {
                title: "SEARCH_FINCON_ACCOUNT",
                searchForm: [
                    "*"
                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        "remarks": {
                            "title": "TRANSACTION_NAME",
                            "type": "string"
                        },
                        "transactionDate": {
                            "title": "TRANSACTION_DATE",
                            "type": "string",
                            "x-schema-form": {
                                "type": "date",
                            }
                        },

                    },
                    "required": []
                },

                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    var promise = Journal.journalMultiEntrySearch({
                        'currentStage': "Completed",
                        'page': pageOpts.pageNo,
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
                        return []
                    },
                    getTableConfig: function() {
                        return {
                            "serverPaginate": true,
                            "paginate": true,
                            "pageLength": 10
                        };
                    },
                    getColumns: function() {
                        return [{
                            title: 'JOURNAL_ID',
                            data: 'id'
                        }, {
                            title: 'TRANSACTION_DATE',
                            data: 'transactionDate'
                        }, {
                            title: 'TRANSACTION_NAME',
                            data: 'remarks'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "COMPLETED_FINCON_ACCOUNT",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    state: "Page.Adhoc",
                                    pageName: "Journal.CompletedFinconAccount",
                                    pageId: item.id,
                                });
                            },
                            isApplicable: function(item, index) {

                                return true;
                            }
                        }];
                    }
                }
            }
        };
    }
})