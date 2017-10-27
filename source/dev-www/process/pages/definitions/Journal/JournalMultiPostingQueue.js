define({
    pageUID: "Journal.JournalMultiPostingQueue",
    pageType: "Engine",
    dependencies: ["$log", "$state", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"],
    $pageFn: function($log, $state, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

        return {
            "type": "search-list",
            "title": "MULTI_POSTING_SEARCH",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("Journal Queue got initialized");
            },
            definition: {
                title: "SEARCH_JOURNAL_ENTRY",
                searchForm: [
                    "*"
                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        // "transactionName": {
                        //     "title": "TRANSACTION_NAME",
                        //     "type": "string"
                        // },
                        // "transactionDescription": {
                        //     "title": "TRANSACTION_DESCRIPTION",
                        //     "type": "string"
                        // },
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
                        'currentStage': "multiJournalPosting",
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
                        return [
                        ]
                    },
                    getTableConfig: function() {
                        return {
                            "serverPaginate": true,
                            "paginate": true,
                            "pageLength": 10
                        };
                    },
                    getColumns: function() {
                        return [
                        {
                            title: 'JOURNAL_ENTRY_ID',
                            data: 'id'
                        },
                        // {
                        //     title: 'TRANSACTION_NAME',
                        //     data: 'transactionName'
                        // },
                        // {
                        //     title: 'TRANSACTION_DESCRIPTION',
                        //     data: 'transactionDescription'
                        // },
                        {
                            title: 'TRANSACTION_DATE',
                            data: 'transactionDate'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "UPDATE_JOURNAL_ENTRY",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    state: "Page.Engine",
                                    pageName: "Journal.JournalMultiPostingApproval",
                                    pageId: item.id,
                                },
                                {
                                    state: "Page.Engine", 
                                    pageName: "Journal.JournalMultiPostingQueue",
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