irf.pageCollection.factory(irf.page("audit.UnconfirmedIssuesQueue"), ["$log", "formHelper", "irfNavigator", "$stateParams", "Audit", "$state", "$q", "SessionStore",
    function($log, formHelper, irfNavigator, $stateParams, Audit, $state, $q, SessionStore) {

        var returnObj = {
            "type": "search-list",
            "title": "UNCONFIRMED_ISSUES",
            initialize: function(model, form, formCtrl) {
                var bankName = SessionStore.getBankName();
                var banks = formHelper.enum('bank').data;
                for (var i = 0; i < banks.length; i++) {
                    if (banks[i].name == bankName) {
                        model.bankId = banks[i].value;
                    }
                }
                var userRole = SessionStore.getUserRole();
                if (userRole && userRole.accessLevel && userRole.accessLevel === 5) {
                    model.fullAccess = true;
                }
                if ($stateParams.pageData && $stateParams.pageData.page) {
                    returnObj.definition.listOptions.tableConfig.page = $stateParams.pageData.page;
                } else {
                    returnObj.definition.listOptions.tableConfig.page = 0;
                }
            },
            definition: {
                title: "SEARCH_ISSUES",
                searchForm: [
                    {
                        key: "bankId",
                        readonly: true,
                        condition: "!model.fullAccess"
                    }, {
                        key: "bankId",
                        condition: "model.fullAccess"
                    },
                    "branch_id"
                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SEARCH_OPTIONS',
                    "properties": {
                        "bankId": {
                            "title": "BANK_NAME",
                            "type": ["integer", "null"],
                            "enumCode": "bank",
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                        "branch_id": {
                            "title": "BRANCH_ID",
                            "type": ["integer", "null"],
                            "enumCode": "branch_id",
                            "x-schema-form": {
                                "type": "select",
                                "parentEnumCode": "bank",
                                "parentValueExpr": "model.bankId"
                            }
                        }
                    },
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    return Audit.online.getIssuesList({
                        'bank_id': searchOptions.bankId,
                        'branch_id': searchOptions.branch_id,
                        'issue_status': "P",
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage
                    }).$promise;
                },
                paginationOptions: {
                    "getItemsPerPage": function(response, headers) {
                        return 15;
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
                            item.auditorId,
                            item.branchId,
                            item.startDate,
                            item.endDate,
                            item.reportDate,
                            item.status
                        ]
                    },
                    tableConfig: {
                        "serverPaginate": true,
                        "paginate": false,
                        "pageLength": 15
                    },
                    getTableConfig: function() {
                        return this.tableConfig;
                    },

                    getColumns: function() {
                        var master = Audit.offline.getAuditMaster();
                        return [{
                            title: 'ISSUE',
                            data: 'id',
                            render: function(data, type, full, meta) {
                                return master.typeofissues[full.type_of_issue_id].description;
                            }
                        }, {
                            title: 'BRANCH_NAME',
                            data: 'branch_id',
                            render: function(data, type, full, meta) {
                                return master.branch_name[full.branch_id]? master.branch_name[full.branch_id].node_code: data;
                            }
                        }, {
                            title: 'CLOSED_ON',
                            data: 'closed_on'
                        }, {
                            title: 'CLOSED_BY',
                            data: 'closed_by'
                        }, {
                            title: 'AUDIT_REPORT_DATE',
                            data: 'audit_report_date'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "VIEW_ISSUE",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                var goparam = {
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.IssueDetails',
                                    'pageId': item.id,
                                    'pageData': {
                                        "readonly": true
                                    }
                                };
                                var backparam = {
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.UnconfirmedIssuesQueue'
                                };
                                irfNavigator.go(goparam, backparam);
                            },
                            isApplicable: function(item, index) {
                                return true;
                            }
                        }];
                    }
                }
            }
        };
        return returnObj;
    }
]);