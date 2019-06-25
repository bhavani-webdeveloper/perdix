define({
    pageUID: "Journal.JournalQueue",
    pageType: "Engine",
    dependencies: ["$log", "$state", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"],
    $pageFn: function($log, $state, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

        return {
            "type": "search-list",
            "title": "BRANCH_POSTING_JOURNAL_SEARCH",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("Journal Queue got initialized");
            },
            definition: {
                title: "SEARCH_BRANCH_JOURNAL",
                searchForm: [
                    "transactionName",
                   
                    "transactionDescription",
                    {   
                        key: 'debitGLNo',
                        title: "DEBIT_GL_NO",

                        "type": "lov",
                        searchHelper: formHelper,
                        lovonly: true,
                        "inputMap": {
                            "productCode": {
                                "key": "productCode",
                                "title": "PRODUCT_CODE",
                                "type": "string"
                                
                            },
                            "glName": {
                                "key": "glName",
                                "title": "GL_NAME",
                                "type": "string"
                                
                            },
                            "category": {
                                "key": "category",
                                "title": "CATEGORY",
                                "type": "select",
                                "enumCode":"gl_category"
                            }
                        },
                        "outputMap": {
                            "debitGLNo": "productCode",
                        },
                        "searchHelper": formHelper,
                        "search": function(inputModel, form,model) {
                            var ret = [];
                            var defered = $q.defer();
                            Journal.listAccountCode({
                                'productCode': inputModel.productCode,
                                'glName': inputModel.glName,
                                'category': inputModel.category,
                                'glType': 'LEDGER'
                            }).$promise.then(function(response){
                                defered.resolve(response);
                            });
                            return defered.promise;
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                data.category,
                                data.productCode,
                                data.glType
                            ];
                        },
                        onSelect: function(valueObj, model, context) {
                            model.debitGLNo = valueObj.productCode;
                        }
                    
                    },
                   
                    {   
                        key: 'creditGLNo',
                        title: "CREDIT_GL_NO",
                        "type": "lov",
                        searchHelper: formHelper,
                        lovonly: true,
                        "inputMap": {
                            "productCode": {
                                "key": "productCode",
                                "title": "PRODUCT_CODE",
                                "type": "string"
                                
                            },
                            "glName": {
                                "key": "glName",
                                "title": "GL_NAME",
                                "type": "string"
                                
                            },
                            "category": {
                                "key": "category",
                                "title": "CATEGORY",
                                "type": "select",
                                "enumCode":"gl_category"
                            }
                        },
                        "outputMap": {
                            "creditGLNo": "productCode",
                        },
                        "searchHelper": formHelper,
                        "search": function(inputModel, form,model) {
                            var ret = [];
                            var defered = $q.defer();
                            Journal.listAccountCode({
                                'productCode': inputModel.productCode,
                                'glName': inputModel.glName,
                                'category': inputModel.category,
                                'glType': 'LEDGER'
                            }).$promise.then(function(response){
                                defered.resolve(response);
                            });
                            return defered.promise;
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                data.category,
                                data.productCode,
                                data.glType
                            ];
                        },
                        onSelect: function(valueObj, model, context) {
                            model.creditGLNo = valueObj.productCode;
                        }
                    
                    },

                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        productCode:{
                            "key": "productCode"
                            
                        },
                        glName:{
                            "key": "glName"
                        },
                        category:{
                            "key": "category"
                        },
                        "transactionName": {
                            "title": "TRANSACTION_NAME",
                            "type": "string"
                        },
                        "transactionDescription": {
                            "title": "TRANSACTION_DESCRIPTION",
                            "type": "string"
                        },
                        "debitGLNo":{
                            "key": "debitGLNo"
                        },
                        "creditGLNo":{
                            "key": "creditGLNo"
                        }
                       

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
                        'per_page': pageOpts.itemsPerPage
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