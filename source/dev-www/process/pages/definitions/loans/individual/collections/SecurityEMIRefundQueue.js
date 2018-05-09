define({
    pageUID: "loans.individual.collections.SecurityEMIRefundQueue",
    pageType: "Engine",
    dependencies: ["$log","$q", "formHelper","IndividualLoan", "SecurityEMIRefundResource", "$state", "SessionStore", "Utils", "irfNavigator", "PageHelper"],
    $pageFn: function($log,$q, formHelper,IndividualLoan, SecurityEMIRefundResource, $state, SessionStore, Utils, irfNavigator, PageHelper) {
        var branch = SessionStore.getBranch();
        return {
            "id": "SecurityEMIRefundQueue",
            "type": "search-list",
            "name": "SecurityEMIRefund",
            "title": "SECURITY_EMI_REFUND_SEARCH",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("search-list sample got initialized");
            },
            definition: {
                title: "SECURITY_EMI_REFUND_SEARCH",
                searchForm: [{
                    "type": "section",
                    items: [{
                        key: "branch",
                    },{
                        key: "accountId",
                    }]
                }],
                //autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        "applicant_name": {
                            "title": "APPLICANT_NAME",
                            "type": "string"
                        },
                        "business_name": {
                            "title": "BUSINESS_NAME",
                            "type": "string"
                        },
                        "accountId": {
                            "title": "ACCOUNT_ID",
                            "type": "number"
                        },
                        "branch": {
                            "title": "BRANCH_NAME",
                            "type": ["integer", "null"],
                            "enumCode": "branch_id",
                            "parentEnumCode": "bank",
                            "parentValueExpr": "model.bankId",
                            "x-schema-form": {
                                "type": "select",
                                "screenFilter": true,
                            }
                        },
                        "centre": {
                            "title": "CENTRE",
                            "type": ["integer", "null"],
                            "enumCode": "centre",
                            "x-schema-form": {
                                "type": "select",
                                "parentEnumCode": "branch_id",
                                "parentValueExpr": "model.branch",
                                "screenFilter": true
                            }
                        }

                    }
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    var branches = formHelper.enum('branch').data;
                    var branchName = null;
                    var brancharray=[];
                    var accountIdarray=[];
                    searchOptions.accountId?(accountIdarray.push(searchOptions.accountId)):[];
                    for (var i = 0; i < branches.length; i++) {
                        var branch = branches[i];
                        if (branch.code == searchOptions.branch) {
                            branchName = branch.name;
                            brancharray.push(branchName);
                        }
                    }
                    var promise = SecurityEMIRefundResource.search({
                        'branches': brancharray,
                        'accountIds': accountIdarray,
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage,
                    }).$promise;


                    /*.then(function(res) {
                        for (i in res.body) {
                            if (res.body[i].accountId) {
                                IndividualLoan.search({
                                    'accountNumber': res.body[i].accountId
                                }).$promise.then(function(response) {
                                    res.body[i].applicantName = response.body[0].applicantName;
                                    res.body[i].businessName = response.body[0].customerName;
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": ret.length
                                        },
                                        body: ret
                                    });
                                }, function(err) {

                                });
                            }
                        }
                    });*/

                    //var promise = SecurityEMIRefundResource.findSecurityDepositRefundAccounts().$promise;
                    return promise;
                },
                paginationOptions: {
                    "viewMode": "page",
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
                    itemCallback: function(item, index) {
                        $log.info(item);
                        $state.goBack();
                    },
                    getItems: function(response, headers) {
                        if (response != null && response.length && response.length != 0) {
                            return response;
                        }
                        return [];
                    },
                    getListItem: function(item) {
                        return [
                            'APPLICANT_NAME :' + item.applicantName,
                            'BUSINESS_NAME :' + item.customerName,
                            'LOAN_ACCOUNT_NO :' + item.accountId,
                            'REFUND_AMOUNT :' + item.amount1,
                        ]
                    },
                    getTableConfig: function() {
                        return {
                            "serverPaginate": true,
                            "paginate": true,
                            "pageLength": 10
                        };
                    },
                    getColumns: function(item) {
                        return [/*{
                            title: 'APPLICANT_NAME',
                            data: 'applicantName'
                        }, {
                            title: 'BUSINESS_NAME',
                            data: 'customerName'
                        },*/ 
                        {
                            title: 'LOAN_ACCOUNT_NO',
                            data: 'accountId'
                        }, {
                            title: 'REFUND_AMOUNT',
                            data: 'amount1'
                        }]
                    },
                    getActions: function() {
                        return [{
                                name: "ConfirmRefund",
                                desc: "",
                                icon: "",
                                fn: function(item, model) {
                                    $state.go("Page.Engine", {
                                        pageName: "loans.individual.collections.SecurityEMIRefund",
                                        pageId: item.accountId,
                                        pageData: item
                                    });
                                },
                                isApplicable: function(item, model) {
                                    return true;
                                }
                            }

                        ];
                    }
                }

            }
        };
    }
});