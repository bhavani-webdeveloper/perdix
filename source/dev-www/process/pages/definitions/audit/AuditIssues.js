irf.pageCollection.factory(irf.page("audit.AuditIssues"), ["$log", "PageHelper", "User", "formHelper", "irfNavigator", "$stateParams", "Audit", "$state", "$q", "SessionStore",
    function($log, PageHelper, User, formHelper, irfNavigator, $stateParams, Audit, $state, $q, SessionStore) {
        var returnObj = {
            "type": "search-list",
            "title": "AUDIT_ISSUES",
            initialize: function(model, form, formCtrl) {
                model.Audits = model.Audits || {};
                localFormController = formCtrl;
                syncCheck = false;
                if (!$stateParams.pageId) {
                    irfNavigator.goBack();
                    PageHelper.showProgress("audit", "Audit ID is empty", 5000);
                    return;
                }
                $stateParams.pageData = $stateParams.pageData || {};
                if (typeof($stateParams.pageData.readonly) == 'undefined') {
                    $stateParams.pageData.readonly = true;
                }
                var $this = this;
                if ($stateParams.pageData && $stateParams.pageData.page) {
                    returnObj.definition.listOptions.tableConfig.page = $stateParams.pageData.page;
                } else {
                    returnObj.definition.listOptions.tableConfig.page = 0;
                }
                model.role_id = SessionStore.getUserRole().id;
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
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
                    var deferred = $q.defer();
                    $q.all([
                        Audit.online.findIssues({
                            'branch_id': searchOptions.branch_id,
                            'issue_status': "",
                            'issue_publish': "NO",
                            'assignee_designation_id': searchOptions.role_id,
                            'page': pageOpts.pageNo,
                            'per_page': pageOpts.itemsPerPage
                        }).$promise,
                    ]).then(function(data) {
                        var returnObj = {
                            headers: {},
                            body: data[0].body
                        };
                        var maxCount = 0;
                        if (data[0].headers['x-total-count']) {
                            maxCount = returnObj.headers['x-total-count'] = Number(data[0].headers['x-total-count']);
                        }
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
                        return headers['x-total-count']
                    }
                },
                listOptions: {
                    selectable: false,
                    expandable: true,
                    listStyle: "table",
                    itemCallback: function(item, index) {},
                    getItems: function(response, headers) {
                        return response && response.length ? response : [];
                    },
                    getListItem: function(item) {
                        return [
                            item.auditor_id,
                            item.branch_id,
                            item.start_date,
                            item.end_date,
                            item.report_date
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
                            title: 'AUDITOR_ID',
                            data: 'auditor_id'
                        }, {
                            title: 'BRANCH_NAME',
                            data: 'branch_id',
                            render: function(data, type, full, meta) {
                                return master.branch_name[full.branch_id].node_code;
                            }
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
                                        "readonly": $stateParams.pageData.readonly,
                                        "type": $stateParams.pageData.type
                                    }
                                }, {
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.AuditIssues'
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