irf.pageCollection.factory(irf.page("coa.ListOfAccount"), 
    ["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager","IndividualLoan", "LoanBookingCommons", "irfNavigator", "ChartOfAccount",
    function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, IndividualLoan, LoanBookingCommons, irfNavigator, ChartOfAccount) {
        var branch = SessionStore.getBranch();
        var centres = SessionStore.getCentres();
        var centreId=[];
        if (centres && centres.length) {
            for (var i = 0; i < centres.length; i++) {
                centreId.push(centres[i].centreId);
            }
        }
        return {
            "type": "search-list",
            "title": "LIST_OF_ACCOUNT",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                // model.branch = branch;
                $log.info("search-list sample got initialized");

            },
            definition: {
                title: "SEARCH",
                searchForm: [
                    "*"
                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SEARCH_OPTIONS',
                    "properties": {
                        "glName": {
                            "title": "GL_NAME",
                            "type": "string"
                        },
                        "productCode": {
                            "title": "GL_PRODUCT_CODE",
                            "type": "string"
                        },
                        'glType': {
                            'title': "GL_TYPE",
                            "type": "string"
                        },
                        "status": {
                            "title": "STATUS",
                            "type": "string"
                        }
                    },
                    "required": []
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    return ChartOfAccount.list({
                        'productCode':searchOptions.productCode,
                        'branchSetCode':searchOptions.branchSetCode,
                        'glType':searchOptions.glType,
                        'status':searchOptions.status,                   
                        'glName': searchOptions.glName,
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage,
                    }).$promise;
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
                            item.branchSetCode,
                            item.glName,
                            item.glType,
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
                                title: 'GL_NAME',
                                data: 'glName'
                            },
                            {
                                title: 'GL_TYPE',
                                data: 'glType'
                            },
                            {
                                title: 'GL_PRODUCT_CODE',
                                data: 'productCode'
                            },
                            {
                                title: 'STATUS',
                                data: 'status'
                            }
                        ]
                    },
                    getActions: function() {
                        return [{
                            name: "ADD_ACCOUNT",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                entityManager.setModel('coa.AddAccount', {
                                    glAccount: item
                                });
                                irfNavigator.go({
                                    state: "Page.Engine",
                                    pageName: "coa.AddAccount",
                                    pageId: item.loanId
                                }, {
                                    state: 'Page.Engine',
                                    pageName: "coa.ListOfAccount"
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
]);