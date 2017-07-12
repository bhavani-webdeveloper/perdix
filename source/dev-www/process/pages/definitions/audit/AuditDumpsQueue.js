irf.pageCollection.factory(irf.page("audit.AuditDumpsQueue"), ["$log","Queries","User", "PageHelper", "irfNavigator", "$q", "Audit", "formHelper", "$state", "$stateParams", "irfNavigator", "SessionStore",
    function($log, Queries, User, PageHelper, irfNavigator, $q, Audit, formHelper, $state, $stateParams, irfNavigator, SessionStore) {
        var branch = SessionStore.getBranch();
        var returnObj = {
            "type": "search-list",
            "title": "AUDIT_DUMPS",
            initialize: function(model, form, formCtrl) {
                model.branch = SessionStore.getCurrentBranch().branchId;
                formCtrl.submit();
                if ($stateParams.pageData && $stateParams.pageData.auditData) {
                    returnObj.definition.listOptions.tableConfig.page = $stateParams.pageData.auditData;
                } else {
                    returnObj.definition.listOptions.tableConfig.auditData = 0;
                }
                Queries.getGlobalSettings("audit.auditor_role_id").then(function(value) {
                    model.auditor_role_id = Number(value);
                }, function(err) {
                    PageHelper.showErrors(err);
                });
            },
            definition: {
                title: "SEARCH_AUDIT",
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
                            },

                        },
                        outputMap: {
                            "login": "auditor_id",
                            "userName": "user_name",
                            "branch_id": "branch_id"

                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            var promise = User.query({
                                'login': inputModel.login,
                                'userName': inputModel.userName,
                                'roleId': model.auditor_role_id,
                                'branchName': inputModel.branch_id
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.login + ': ' + item.userName,
                                item.roleId ? (item.roleId + ': ' + item.roleName) : ''
                            ];
                        }
                    },
                    "branch_id",
                    "report_date",
                    "start_date",
                    "end_date", {
                        "key": "current_stage",
                        "title": "STAGE",
                        "type": "string",
                        "type": "select",
                        "titleMap": {
                            "scheduled": "Scheduled",
                            "postpone": "Postpone",
                            "cancel": "Cancel",
                            "reassign": "Reasign",
                            "create": "Create",
                            "start": "Start",
                            "publish": "Publish",
                            "reject": "Reject",
                            "L1-approve": "Level 1 Approved",
                            "approve": "Approve",
                            "close": "Close"
                        }
                    },

                ],
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        "auditor_id": {
                            "title": "AUDITOR_USERID"
                        },
                        "branch_id": {
                            "title": "BRANCH_NAME",
                            "type": ["null", "integer"],
                            "enumCode": "branch_id",
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                        "start_date": {
                            "title": "START_DATE",
                            "type": "string",
                            "x-schema-form": {
                                "type": "date",
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
                        "current_stage": {
                            "title": "STAGE"
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
                    return Audit.online.getAuditList({
                        'audit_id': searchOptions.audit_id,
                        'userId': searchOptions.userId,
                        "branch_id": searchOptions.branch_id,
                        "start_date": searchOptions.start_date ? searchOptions.start_date + " 00:00:00" : "",
                        "end_date": searchOptions.end_date ? searchOptions.end_date + " 23:59:59" : "",
                        "report_date": searchOptions.report_date ? searchOptions.report_date + " 00:00:00" : "",
                        "current_stage": searchOptions.current_stage,
                        "page": pageOpts.pageNo,
                        "per_page": pageOpts.itemsPerPage
                    }).$promise;
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
                            item.branch_name,
                            item.report_date,
                            item.start_date,
                            item.end_date,
                            item.current_stage
                        ]
                    },
                    getTableConfig: function() {
                        return {
                            "serverPaginate": true,
                            "paginate": true,
                            "pageLength": 10
                        };
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
                        return [{
                            title: 'AUDIT_ID',
                            data: 'audit_id'
                        }, {
                            title: 'AUDITOR_ID',
                            data: 'auditor_id'
                        }, {
                            title: 'BRANCH_NAME',
                            data: 'branch_name'
                        }, {
                            title: 'REPORT_DATE',
                            data: 'report_date'
                        }, {
                            title: 'START_DATE',
                            data: 'start_date'
                        }, {
                            title: 'END_DATE',
                            data: 'end_date'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "VIEW",
                            icon: "fa fa-eye",
                            fn: function(item, index) {
                                var auditId = $stateParams.pageId;
                                irfNavigator.go({
                                    state: "Page.Engine",
                                    pageName: "audit.AuditDumps",
                                    pageId: item.audit_id
                                }, {
                                    state: "Page.Engine",
                                    pageName: "audit.AuditDumpsQueue",
                                    pageData: {}
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