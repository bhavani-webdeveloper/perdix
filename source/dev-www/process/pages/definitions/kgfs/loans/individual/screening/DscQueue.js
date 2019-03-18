define({
    pageUID: "kgfs.loans.individual.screening.DscQueue",
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
                        "partner_code": {
                            "title": "PARTNER_CODE",
                            "type":["string","null"],
                            "x-schema-form": {
                                "type":"select",
                                "enumCode": "partner"
                            }
                        },
                        "customerUrnNo": {
                            "title": "CUSTOMER_URN_NO",
                            "type": "number"
                        },
                    },
                    "required": ["stage"]
                },

                getSearchFormHelper: function () {
                    return formHelper;
                },

                getResultsPromise: function (searchOptions, pageOpts) {
                    var promise = IndividualLoan.search({
                        'stage': 'DSCApproval',
                        'branchId': searchOptions.branch,
                        'partnerCode': searchOptions.partner_code,
                        'urn': searchOptions.customerUrnNo,
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
                            "{{'CENTRE_NAME'|translate}} : " + item.centreName,
                            "{{'LOAN_AMOUNT'|translate}} : " + item.loanAmount,
                            "{{'LOAN_TYPE'|translate}} : " + item.loanType,
                            "{{'PARTNER_CODE'|translate}} : " + item.partnerCode,

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
                        },
                        {
                            title: 'URN_NO',
                            data: 'urn'
                        },
                        {
                            title: 'CUSTOMER_NAME',
                            data: 'applicantName'
                        },
                        {
                            title: 'CENTRE_NAME',
                            data: 'centreName'
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
                        }
                    ]
                    },
                    getActions: function () {
                        return [{
                            name: "DSC",
                            desc: "",
                            icon: "fa fa-book",
                            fn: function (item, index) {
                                irfNavigator.go({
                                    'state': 'Page.Bundle',
                                    'pageName': 'kgfs.loans.individual.screening.DscApproval',
                                    'pageId': item.loanId,
                                    'pageData': item,
                                },{
                                    'state': 'Page.Engine',
                                    'pageName': 'kgfs.loans.individual.screening.DscQueue'
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
