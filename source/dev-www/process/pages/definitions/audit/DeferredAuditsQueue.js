irf.pageCollection.factory(irf.page("audit.DeferredAuditsQueue"), ["$log", "PageHelper", "Queries", "User", "formHelper", "$stateParams", "irfNavigator", "Audit", "$state", "$q", "SessionStore",
    function($log, PageHelper, Queries, User, formHelper, $stateParams, irfNavigator, Audit, $state, $q, SessionStore) {
        var returnObj = {
            "type": "search-list",
            "title": "POSTPONED/CANCELLED_AUDITS",
            initialize: function(model, form, formCtrl) {
                model.audits = model.audits || {};
                model.branch = SessionStore.getCurrentBranch().branchId;
                model.roleUsers = model.roleUsers || {};
                localFormController = formCtrl;
                syncCheck = false;
                if ($stateParams.pageData && $stateParams.pageData.page) {
                    returnObj.definition.listOptions.tableConfig.page = $stateParams.pageData.page;
                } else {
                    returnObj.definition.listOptions.tableConfig.page = 0;
                }
                Queries.getGlobalSettings("audit.auditor_role_id").then(function(value) {
                    model.auditor_role_id = Number(value);
                }, function(err) {
                    PageHelper.showErrors(err);
                });
            },
            definition: {
                title: "SEARCH_AUDITS",
                searchForm: [{
                        key: "auditor_id",
                        title: "AUDITOR_USERID",
                        type: "lov",
                        inputMap: {
                            "userName": {
                                "key": "user_name"
                            },
                            "login": {
                                "key": "login"
                            },
                            "branch_id": {
                                "key": "branch_id"
                            }
                        },
                        outputMap: {
                            "login": "auditor_id",
                            "userName": "user_name",
                            "branch_id": "branch_id"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            return User.query({
                                'login': inputModel.login,
                                'userName': inputModel.userName,
                                'roleId': model.auditor_role_id,
                                'branchName': inputModel.branch_id,
                            }).$promise;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.login + ': ' + item.userName,
                                item.branchName
                            ];
                        }
                    },
                    "branch_id",
                    "report_date",
                    "start_date",
                    "end_date"
                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SEARCH_OPTIONS',
                    "properties": {
                        "auditor_id": {
                            "title": "AUDITOR_USERID",
                            "type": "string"
                        },
                        "branch_id": {
                            "title": "BRANCH_ID",
                            "type": "number",
                            "enumCode": "branch_id",
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                        "start_date": {
                            "title": "START_DATE",
                            "type": "string",
                            "x-schema-form": {
                                "type": "date"
                            }
                        },
                        "end_date": {
                            "title": "END_DATE",
                            "type": "string",
                            "x-schema-form": {
                                "type": "date"
                            }
                        },
                        "report_date": {
                            "title": "REPORT_DATE",
                            "type": "string",
                            "x-schema-form": {
                                "type": "date"
                            }
                        },
                        "user_name": {
                            "title": "USER_NAME",
                            "type": "string"
                        },
                        "login": {
                            "title": "LOGIN",
                            "type": "string"
                        }

                    }
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    var deferred = $q.defer();
                    $q.all([
                        Audit.online.getAuditList({
                            'auditor_id': searchOptions.auditor_id,
                            'branch_id': searchOptions.branch_id,
                            'start_date': searchOptions.start_date ? searchOptions.start_date + " 00:00:00" : "",
                            'end_date': searchOptions.end_date ? searchOptions.end_date + " 23:59:59" : "",
                            'report_date': searchOptions.report_date ? searchOptions.report_date + " 00:00:00" : "",
                            'current_stage': 'postpone',
                            'page': pageOpts.pageNo,
                            'per_page': pageOpts.itemsPerPage
                        }).$promise,
                        Audit.online.getAuditList({
                            'auditor_id': searchOptions.auditor_id,
                            'branch_id': searchOptions.branch_id,
                            'start_date': searchOptions.start_date ? searchOptions.start_date + " 00:00:00" : "",
                            'end_date': searchOptions.end_date ? searchOptions.end_date + " 23:59:59" : "",
                            'report_date': searchOptions.report_date ? searchOptions.report_date + " 00:00:00" : "",
                            'current_stage': 'cancel',
                            'page': pageOpts.pageNo,
                            'per_page': pageOpts.itemsPerPage
                        }).$promise
                    ]).then(function(data) {
                        var returnObj = {
                            headers: {
                                'x-total-count': data[0].headers['x-total-count']
                            },
                            body: data[0].body
                        };
                        returnObj.headers['x-total-count'] += data[1].headers['x-total-count'];
                        returnObj.body.push.apply(returnObj.body, data[1].body);
                        deferred.resolve(returnObj);
                    }, function(data) {
                        deferred.reject(data[0]);
                    });
                    return deferred.promise;
                },
                paginationOptions: {
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
                        "paginate": true,
                        "pageLength": 10
                    },
                    getTableConfig: function() {
                        return this.tableConfig;
                    },

                    getColumns: function() {
                        var masterJson = Audit.offline.getAuditMaster();
                        return [{
                            title: 'AUDIT_ID',
                            data: 'audit_id'
                        }, {
                            title: 'AUDITOR_ID',
                            data: 'auditor_id'
                        }, {
                            title: 'STATUS',
                            data: 'current_stage',
                            render: function(data, type, full, meta) {
                                return data == 'postpone' ? 'Rescheduled' : 'Cancelled';
                            }
                        }, {
                            title: 'BRANCH_NAME',
                            data: 'branch_name'
                        }, {
                            title: 'REPORT_DATE',
                            data: 'report_date',
                            render: Audit.utils.dateRenderer
                        }, {
                            title: 'START_DATE',
                            data: 'start_date',
                            render: Audit.utils.dateRenderer
                        }, {
                            title: 'END_DATE',
                            data: 'end_date',
                            render: Audit.utils.dateRenderer
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "UPDATE",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                var goparam = {
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.ScheduleAudit',
                                    'pageId': item.audit_id,
                                    'pageData': {
                                        "page": returnObj.definition.listOptions.tableConfig.page,
                                        "type": "deferred"
                                    }
                                };
                                var backparam = {
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.DeferredAuditsQueue',
                                    'pageId': item.audit_id,
                                    'pageData': {
                                        "page": 1,
                                        "readonly": true
                                    }
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
