define({
    pageUID: "Journal.JournalQueue",
    pageType: "Engine",
    dependencies: ["$log", "$state", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"],
    $pageFn: function($log, $state, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

        return {
            "type": "search-list",
            "title": "JOURNAL_QUEUE",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("Journal Queue got initialized");
            },
            definition: {
                title: "SEARCH_JOURNAL",
                searchForm: [
                    "*"
                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        "transactionName": {
                            "title": "TRANSACTION_NAME",
                            "type": "string"
                        },
                        "transactionDescription": {
                            "title": "TRANSACTION_DESCRIPTION",
                            "type": "string"
                        },
                        "debitGLNo": {
                            "title": "DEBIT_GL_NO",
                            "type": "string",
                        },
                        "creditGLNo": {
                            "title": "CREDIT_GL_NO",
                            "type": "string",   
                        },
                        "isApplicable": {
                            "title": "IS_APPLICABLE",
                            "type": "string",
                            "x-schema-form": {
                                "type": "select",
                                "titleMap":{
                                    0:"NO",
                                    1:"YES"
                                }
                            }
                        },

                    },
                    "required": []
                },
                
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) { 
                    var promise = Journal.journalSearch({
                        'transactionName': searchOptions.transactionName,
                        'transactionDescription':searchOptions.transactionDescription,
                        'debitGLNo': searchOptions.debitGLNo,
                        'creditGLNo': searchOptions.creditGLNo,
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage,
                        'isApplicable': searchOptions.isApplicable,
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
                            item.applicantName,
                            item.businessName,
                            item.accountNumber,
                            item.loanId,
                            item.disbursementDate,
                            item.lucDate,
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
                            title: 'JOURNAL_ID',
                            data: 'id'
                        },
                        {
                            title: 'TRANSACTION_NAME',
                            data: 'transactionName'
                        },
                        {
                            title: 'TRANSACTION_DESCRIPTION',
                            data: 'transactionDescription'
                        },
                        {
                            title: 'DEBIT_GL_NO',
                            data: 'debitGLNo'
                        }, {
                            title: 'CREDIT_GL_NO',
                            data: 'creditGLNo'
                        }, {
                            title: 'IS_APPLICABLE',
                            data: 'isApplicable'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "UPDATE_JOURNAL",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    state: "Page.Engine",
                                    pageName: "Journal.JournalMaintenance",
                                    pageId: item.id,
                                },
                                {
                                    state: "Page.Engine", 
                                    pageName: "Journal.JournalQueue",
                                });
                            },
                            isApplicable: function(item, index) {

                                return true;
                            }
                        },{
                            name: "CLOSE_JOURNAL",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    state: "Page.Engine",
                                    pageName: "Journal.CloseJournal",
                                    pageId: item.id,
                                },
                                {
                                    state: "Page.Engine", 
                                    pageName: "Journal.JournalQueue",
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