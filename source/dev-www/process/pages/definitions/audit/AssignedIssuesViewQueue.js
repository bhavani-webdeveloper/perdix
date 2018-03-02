irf.pageCollection.factory(irf.page("audit.AssignedIssuesViewQueue"), ["$log","PageHelper", "User", "formHelper", "irfNavigator", "$stateParams", "Audit", "$state", "$q", "SessionStore",
    function($log,PageHelper, User, formHelper, irfNavigator, $stateParams, Audit, $state, $q, SessionStore) {
        var returnObj = {
            "type": "search-list",
            "title": "ASSIGNED_ISSUES_VIEW_QUEUE",
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
                        },
                        "user_name": {
                            "title": "USER_NAME",
                            "type": "string"
                        },
                        "login": {
                            "title": "LOGIN",
                            "type": "string"
                        },
                    },
                    "required": []
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    var deferred = $q.defer();
                    $q.all([
                        Audit.online.findIssues({
                            'branch_id': searchOptions.branch_id,
                            'user_id': searchOptions.userId,
                            'issue_status': "A",
                            'issue_publish': "YES",
                            'page': pageOpts.pageNo,
                            'per_page': pageOpts.itemsPerPage
                        }).$promise,
                        Audit.online.findIssues({
                            'branch_id': searchOptions.branch_id,
                            'user_id': searchOptions.userId,
                            'issue_status': "P",
                            'issue_publish': "YES",
                            'page': pageOpts.pageNo,
                            'per_page': pageOpts.itemsPerPage
                        }).$promise
                    ]).then(function(data) {
                        var returnObj = {
                            headers: {},
                            body: data[0].body
                        };
                        returnObj.headers['max-total-count'] = 0;
                        if (data[0].headers['x-total-count']) {
                            var c1 = Number(data[0].headers['x-total-count']);
                            returnObj.headers['x-total-count'] = c1;
                            returnObj.headers['max-total-count'] = c1;
                        }
                        if (data[1].headers['x-total-count']) {
                            var c1 = returnObj.headers['max-total-count'];
                            var c2 = Number(data[1].headers['x-total-count']);
                            if (c2 > c1) {
                                returnObj.headers['max-total-count'] = c2;
                            }
                            returnObj.headers['x-total-count'] += c2;
                        }
                        returnObj.body.push.apply(returnObj.body, data[1].body);
                        deferred.resolve(returnObj);
                    }, function(data) {
                        deferred.reject(data[0]);
                    });
                    return deferred.promise;
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
                                return data == 'A'? 'Assigned': 'Unconfirmed';
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
                            data: 'audit_report_date'
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
