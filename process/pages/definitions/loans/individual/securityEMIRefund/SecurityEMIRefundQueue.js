define({
    pageUID: "loans.individual.securityEMIRefund.SecurityEMIRefundQueue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "SecurityEMIRefundResource", "$state", "SessionStore", "Utils", "irfNavigator", "PageHelper"],
    $pageFn: function($log, formHelper, SecurityEMIRefundResource, $state, SessionStore, Utils, irfNavigator, PageHelper) {
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
                    }, {
                        key: "centre",
                    }, {
                        key: "applicant_name",
                    }, {
                        key: "business_name"
                    }, {
                        key: "accountId",
                    }]
                }],
                autoSearch: true,
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
                    var promise = SecurityEMIRefundResource.findSecurityDepositRefundAccounts().$promise;
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
                            'BUSINESS_NAME :' + item.businessName,
                            'LOAN_ACCOUNT_NO :' + item.loanAccountNo,
                            'REFUND_AMOUNT :' + item.refundAmount,
                            'HUB :' + item.hub,
                            'SPOKE :' + item.spoke,
                            'customerId :' + item.customerId,
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
                            title: 'APPLICANT_NAME',
                            data: 'applicantName'
                        }, {
                            title: 'BUSINESS_NAME',
                            data: 'businessName'
                        }, {
                            title: 'LOAN_ACCOUNT_NO',
                            data: 'loanAccountNo'
                        }, {
                            title: 'REFUND_AMOUNT',
                            data: 'refundAmount'
                        }, {
                            title: 'HUB',
                            data: 'hub'
                        }, {
                            title: 'SPOKE',
                            data: 'spoke'
                        }]
                    },
                    getActions: function() {
                        return [{
                                name: "ConfirmRefund",
                                desc: "",
                                icon: "",
                                fn: function(item, model) {
                                    $state.go("Page.Engine", {
                                        pageName: "loans.individual.securityEMIRefund.SecurityEMIRefund",
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