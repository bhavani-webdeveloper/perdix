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
                        "centre": {
                            "title": "CENTRE",
                            "type": ["integer", "null"],
                            "x-schema-form":{
                                "type": "select",
                                "enumCode": "usercentre",
                            }
                        },
                        "applicantName": {
                            "title": "CUSTOMER_NAME",
                            "type": "string",
                            "type": ["string", "null"],
                        },
                        "urn": {
                            "title": "URN_NO",
                            "type": ["string", "null"]
                        },
                        "loanType": {
                            "title": "LOAN_TYPE",
                            "enumCode": "booking_loan_type",
                            "type": ["string", "null"],
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                        "productCategory": {
                            "title": "PRODUCT_CATEGORY",
                            "type": ["string", "null"],
                            "x-schema-form": {
                                "type": "select",
                                "enumCode": "loan_product_category_master",
                                "parentEnumCode":"booking_loan_type",
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
                        'centreCode': searchOptions.centre,
                        'applicantName': searchOptions.applicantName,
                        'urn': searchOptions.urn,
                        'loanType':searchOptions.loanType,
                        'partnerCode': searchOptions.partner_code,
                        'productCategory':searchOptions.productCategory,
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
                            "{{'PRODUCT_TYPE'|translate}} : " + item.loanType,
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
                            title: 'LOAN_ID',
                            data: 'id'
                        },{
                            title: 'CUSTOMER_NAME',
                            data: 'customerName'
                        },{
                            title: 'URN_NO',
                            data: 'urn'
                        },{
							title: 'LOAN_AMOUNT',
							data: 'loanAmount'
                        },{
                            title: 'PRODUCT_TYPE',
                            data: 'loanType'
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
