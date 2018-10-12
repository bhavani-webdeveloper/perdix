irf.pageCollection.factory(irf.page("audit.AssignedIssuesViewQueue"), ["$log", "formHelper", "irfNavigator", "$stateParams", "Audit",
    function($log, formHelper, irfNavigator, $stateParams, Audit) {
        var returnObj = {
            "type": "search-list",
            "title": "ASSIGNED_ISSUES_VIEW_QUEUE",
            initialize: function(model, form, formCtrl) {},
            definition: {
                title: "SEARCH_ISSUES",
                searchForm: [
                    "*"
                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SEARCH_OPTIONS',
                    "properties": {
                        "branch_id": {
                            "title": "BRANCH_ID",
                            "type": "number",
                            "enumCode": "branch_id",
                            "x-schema-form": {
                                "type": "userbranch"
                            }
                        }
                    },
                    "required": []
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    return Audit.online.findIssues({
                        'branch_id': searchOptions.branch_id,
                        'current_stage': "assign",
                        //'assignee_designation_id': searchOptions.role_id,
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage
                    }).$promise;
                },
                paginationOptions: {
                    "getItemsPerPage": function(response, headers) {
                        return 15;
                    },
                    "getTotalItemsCount": function(response, headers) {
                        return headers['max-total-count']
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
                            item.auditor_id,
                            item.branch_id,
                            item.start_date,
                            item.end_date,
                            item.report_date,
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
                            title: 'STATUS',
                            data: 'status',
                            render: function(data, type, full, meta) {
                                return data == 'A' ? 'Assigned' : 'Unconfirmed';
                            }
                        }, {
                            title: 'AUDITOR_ID',
                            data: 'auditor_id'
                        }, {
                            title: 'BRANCH_NAME',
                            data: 'branch_id',
                            render: function(data, type, full, meta) {
                                return master.branch_name[full.branch_id].node_code;
                            }
                        }, {
                            title: 'CLOSED_ON',
                            data: 'closed_on'
                        }, {
                            title: 'CLOSED_BY',
                            data: 'closed_by'
                        }, {
                            title: 'AUDIT_REPORT_DATE',
                            data: 'audit_report_date',
                            render: Audit.utils.dateRenderer
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "UPDATE_ISSUE",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.IssueDetails',
                                    'pageId': item.id,
                                    'pageData': {
                                        "readonly": false,
                                        "type": "operation",
                                        "readonly": true
                                    }
                                }, {
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.AssignedIssuesQueue'
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
        return returnObj;
    }
]);