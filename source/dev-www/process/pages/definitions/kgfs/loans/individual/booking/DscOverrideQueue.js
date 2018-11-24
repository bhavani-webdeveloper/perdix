define({
    pageUID: "kgfs.loans.individual.booking.DscOverrideQueue",
    pageType: "Engine",
    dependencies: ["$log", "irfNavigator", "formHelper", "entityManager", "IndividualLoan", "$state", "SessionStore", "Utils"],
    $pageFn: function ($log, irfNavigator, formHelper, EntityManager, IndividualLoan, $state, SessionStore, Utils) {
        var branch = SessionStore.getBranch();
        return {
            "type": "search-list",
            "title": "DSC_OVERRIDE_SEARCH",
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
                            "x-schema-form": {
                                "type": "select",
                                "enumCode": "centre",
                                "parentEnumCode": "branch",
                                "parentValueExpr": "model.branch",
                                "screenFilter": true
                            }
                        },
                        "customerUrnNo": {
                            "title": "CUSTOMER_URN_NO",
                            "type": "number"
                        }
                    },
                    "required": ["stage"]
                },

                getSearchFormHelper: function () {
                    return formHelper;
                },

                getResultsPromise: function (searchOptions, pageOpts) {
                    var promise = IndividualLoan.search({
                        'stage': 'DSCOverride',
                        'branchId': searchOptions.branch,
                        'centreCode': searchOptions.centre,
                        'customerUrnNo': searchOptions.customerUrnNo,
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

                            "{{'ENTITY_NAME'|translate}} : " + item.customerName,
                            "{{'URN_NO'|translate}} : " + item.urn,
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
							title: 'LOAN_ID',
							data: 'id'
                        }, {
							title: 'URN_NO',
							data: 'urn'
                        }, 
                        {
                            title: 'ENTITY_NAME',
                            data: 'customerName'
                        }, {
							title: 'LOAN_AMOUNT',
							data: 'loanAmount'
                        },{
							title: 'LOAN_TYPE',
							data: 'loanType'
                        },
                        {
							title: 'PARTNER_CODE',
							data: 'partnerCode'
                        },{
							title: 'PROCESS_TYPE',
							data: 'processType'
                        },
                    ]
					},
                    getActions: function () {
                        return [
                        {
                            name: "DO_DSC_OVERRIDE",
                            desc: "",
                            icon: "fa fa-book",
                            fn: function (item, index) {
                                irfNavigator.go({
                                    'state': 'Page.Bundle',
                                    'pageName': 'kgfs.loans.individual.booking.DscCheck',
                                    'pageId': item.loanId,
                                    'pageData': item
                                },{
                                    state: 'Page.Engine',
                                    pageName: "kgfs.loans.individual.booking.DscOverrideQueue"
                                });
                            },
                            isApplicable: function (item, model) {
                                return true;
                            }
                        }];
                    }
                }
            }
        };
    }

})
