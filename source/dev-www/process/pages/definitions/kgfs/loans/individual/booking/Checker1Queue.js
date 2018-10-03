define({
    pageUID: "kgfs.loans.individual.booking.Checker1Queue",
    pageType: "Engine",
    dependencies: ["$log", "irfNavigator", "formHelper", "entityManager", "IndividualLoan", "$state", "SessionStore", "Utils"],
    $pageFn: function ($log, irfNavigator, formHelper, EntityManager, IndividualLoan, $state, SessionStore, Utils) {
        var branch = SessionStore.getBranch();
        return {
            "type": "search-list",
            "title": "CHECKER1_QUEUE",
            "subTitle": "",

            initialize: function (model, form, formCtrl) {
                // model.branch = branch;
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                model.branch = SessionStore.getCurrentBranch().branchId;
            },

            definition: {
                title: "SEARCH_LOANS",
                autoSearch: true,
                searchForm: [
                    "*"
                ],
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        'branch': 
                        {
                            'title': "BRANCH_NAME",
                            "type": ["string", "null"],
                            "x-schema-form": {
                                "type": "select",
                                "screenFilter": true,
                                "enumCode" : "branch"
                            }
                        },
                        'loanType': 
                        {
                            'title': "LOAN_TYPE",
                            "type": ["string", "null"],
                            "x-schema-form": {
                                "type": "select",
                                "screenFilter": true
                            }
                        },
                        'productName': 
                        {
                            'title': "PRODUCT_NAME",
                            "type": ["string", "null"],
                            "x-schema-form": {
                                "type": "select",
                                "enumCode" : "branch",
                                "screenFilter": true
                            }
                        },
                        'requestType': 
                        {
                            'title': "REQUEST_TYPE",
                            "type": ["string", "null"],
                            "x-schema-form": {
                                "type": "select",
                                "enumCode" : "branch",
                                "screenFilter": true
                            }
                        },
                        "accountNumber": 
                        {
                            "title": "ACCOUNT_NUMBER",
                            "type": "string"
                        }
                    },
                    "required": []
                },

                getSearchFormHelper: function () {
                    return formHelper;
                },

                getResultsPromise: function (searchOptions, pageOpts) {
                    var promise = IndividualLoan.search({
                        'stage': 'LoanInitiation',
                        'branch': searchOptions.branch,
                        'loanType': searchOptions.loanType,
                        'productName': searchOptions.productName,
                        'requestType' : searchOptions.requestType,
                        'accountNumber': searchOptions.accountNumber,
                        'page': pageOpts.pageNo
                    }).$promise;
                    return promise;
                },

                paginationOptions: {
                    "getItemsPerPage": function (response, headers) {
                        return 20;
                    },
                    "getTotalItemsCount": function (response, headers) {
                        return headers['x-total-count']
                    }
                },

                listOptions: {
                    expandable: true,
					listStyle: "table",
                    itemCallback: function (item, index) {},
                    getItems: function (response, headers) {
                        if (response != null && response.length && response.length != 0) {
                            return response;
                        }
                        return [];
                    },
                    getListItem: function (item) {
                        return [

                            "{{'ACCOUNT_NUMBER'|translate}} : " + item.accountNumber,
                            "{{'ENTITY_NAME'|translate}} : " + item.customerName,
                            "{{'LOAN_AMOUNT'|translate}} : " + item.loanAmount,
                            "{{'LOAN_TYPE'|translate}} : " + item.loanType,
                            "{{'PARTNER_CODE'|translate}} : " + item.partnerCode,
                            "{{'PROCESS_TYPE'|translate}} : " + item.processType

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
						return [{
							title: 'ACCOUNT_NUMBER',
							data: 'accountNumber'
						}, {
                            title: 'PRODUCT_TYPE',
                            data: 'productName'
                        }, {
							title: 'APPLICATION_DATE',
							data: 'applicationDate'
						}, 
                    ]
					},
                    getActions: function () {
                        return [
                            {
                            name: "LOAN_INPUT",
                            desc: "",
                            icon: "fa fa-book",
                            fn: function (item, index) 
                            {
                                irfNavigator.go({
                                    'state': 'Page.Engine',
                                    'pageName': 'loans.individual.booking.LoanInput',
                                    'pageId': item.loanId,
                                    'pageData': item
                                });
                            },
                            isApplicable: function (item, model) 
                            {
                                return true;
                            }
                        }];
                    }
                }
            }
        };
    }

})
