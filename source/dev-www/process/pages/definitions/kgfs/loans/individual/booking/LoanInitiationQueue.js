define({
    pageUID: "kgfs.loans.individual.booking.LoanInitiationQueue",
    pageType: "Engine",
    dependencies: ["$log", "irfNavigator", "formHelper", "entityManager", "IndividualLoan", "$state", "SessionStore", "Utils"],
    $pageFn: function ($log, irfNavigator, formHelper, EntityManager, IndividualLoan, $state, SessionStore, Utils) {
        var branch = SessionStore.getBranch();
        return {
            "type": "search-list",
            "title": "LOANS_SEARCH",
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
                        'branch': {
                            'title': "BRANCH",
                            "type": ["string", "null"],
                            "x-schema-form": {
                                "type": "userbranch",
                                "screenFilter": true
                            }
                        },
                        "applicantName": {
                        "title": "CUSTOMER_NAME",
                        "type": "string"
                        },
                        "urn": {
                            "title": "URN_NO",
                            "type": "string"
                        },
                        "loanType": {
                            "title": "PRODUCT_TYPE",
                            "enumCode": "booking_loan_type",
                            "type": "string",
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                        "partner_code": {
                            "title": "PARTNER_CODE",
                            "type":["string","null"],
                            "x-schema-form": {
                                "type":"select",
                                "enumCode": "partner"
                            }
                        }
                    },
                    "required": ["stage"]
                },

                getSearchFormHelper: function () {
                    return formHelper;
                },

                getResultsPromise: function (searchOptions, pageOpts) {
                    var promise = IndividualLoan.search({
                        'stage': 'LoanInitiation',
                        'branchId': searchOptions.branch,
                        'applicantName': searchOptions.applicantName,
                        'urn': searchOptions.urn,
                        'loanType':searchOptions.loanType,
                        'partnerCode': searchOptions.partner_code,
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

                            "{{'CUSTOMER_NAME'|translate}} : " + item.customerName,
                            "{{'URN_NO'|translate}} : " + item.urn,
                            "{{'LOAN_AMOUNT'|translate}} : " + item.loanAmount,

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
                            title: 'CUSTOMER_NAME',
                            data: 'customerName'
                        },{
                            title: 'URN_NO',
                            data: 'urn'
                        },{
							title: 'LOAN_AMOUNT',
							data: 'loanAmount'
                        }
                    ]
					},
                    getActions: function () {
                        return [{
                            name: "VIEW/EDIT_APPLICATION",
                            desc: "",
                            icon: "fa fa-book",
                            fn: function (item, index) {
                                irfNavigator.go({
                                    'state': 'Page.Bundle',
                                    'pageName': 'kgfs.loans.individual.booking.LoanInput',
                                    'pageId': item.loanId,
                                    'pageData': item
                                },{
                                    'state': 'Page.Engine',
                                    'pageName': 'kgfs.loans.individual.booking.LoanInitiationQueue'
                                }
                                );
                            },
                            isApplicable: function (item, model) {
                                return true;
                            }
                        }, 
                        ];
                    }
                }
            }
        };
    }

})
