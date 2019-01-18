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
                model.status=2;
                model.branch=SessionStore.getCurrentBranch().branchId;
            },
            definition: {
                title: "SECURITY_EMI_REFUND_SEARCH",
                searchForm: [{
                    "type": "section",
                    items: [{
                        key: "branch",
                    },{
                        key: "accountId",
                    },
                    {
                        key: "status",
                        title: "STATUS",
                        "type":"select",
                        "readonly":true,
                        "titleMap": [{
                            name: "open",
                            value: 0
                        }, {
                            "name": "Inactive",
                            "value": 1
                        }, {
                            "name": "closed",
                            "value": 2
                        }]
                    }
                    ]
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
                            "type": "string"
                        },
                        "branch": {
                            'title': "BRANCH",
                            "type": ["string", "null"],
                            "x-schema-form": {
                                "type":"userbranch",
                                "screenFilter": true
                            }
                        },
                        "centre": {
                            "title": "CENTRE",
                            "type": ["integer", "null"],
                            "x-schema-form": {
                                "type": "select",
                                "enumCode": "centre",
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
                        'branchId': searchOptions.branch,
                        'accountIds': accountIdarray,
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage,
                    }).$promise.then(function(res){
                        var ret = [];
                        angular.forEach(res.body, function(value, key) {
                            if(value.status== searchOptions.status){
                                ret.push(value);
                            }
                        });
                        return $q.resolve({
                            headers: {
                                "x-total-count": ret.length
                            },
                            body: ret
                        });
                    });
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
                        return [{
                            title: 'BRANCH_NAME',
                            data: 'description'
                        }, 
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