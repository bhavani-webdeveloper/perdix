irf.pageCollection.factory(irf.page("audit.ConfirmedIssuesQueue"), ["$log", "irfNavigator", "$stateParams", "formHelper", "Audit", "$state", "$q", "SessionStore",
    function($log, irfNavigator, $stateParams, formHelper, Audit, $state, $q, SessionStore) {
        var returnObj = {
            "type": "search-list",
            "title": "CONFIRMED_ISSUES",
            initialize: function(model, form, formCtrl) {
                model.Audits = model.Audits || {};
                localFormController = formCtrl;
                syncCheck = false;
                if ($stateParams.pageData && $stateParams.pageData.page) {
                    returnObj.definition.listOptions.tableConfig.page = $stateParams.pageData.page;
                } else {
                    returnObj.definition.listOptions.tableConfig.page = 0;
                }
            },
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
                                "type": "select"
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
                        'confirmity_status': "1",
                        'issue_status': "X",
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
                            // render: function(data, type, full, meta) {
                            //     return master.typeofissues[full.type_of_issue_id].description;
                            // }
                        }, {
                            title: 'BRANCH_NAME',
                            data: 'branch_id',
                            // render: function(data, type, full, meta) {
                            //     return master.branch_name[full.branch_id].node_code;
                            // }
                        }, {
                            title: 'CLOSED_ON',
                            data: 'closed_on'
                        }, {
                            title: 'CLOSED_BY',
                            data: 'closed_by'
                        }, {
                            title: 'AUDIT_REPORT_DATE',
                            data: 'audit_report_date'
                        },{
                            title: 'DAYS_LEFT',
                            data: 'days_left'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "VIEW_ISSUE",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.IssueDetails',
                                    'pageId': item.id,
                                    'pageData': {
                                        "readonly": true
                                    }
                                }, {
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.ConfirmedIssuesQueue'
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
