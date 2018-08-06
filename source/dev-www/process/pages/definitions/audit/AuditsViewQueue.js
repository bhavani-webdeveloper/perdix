irf.pageCollection.factory(irf.page("audit.AuditsViewQueue"), ["$log", "$q", "Queries", "User", "Audit", "formHelper", "$stateParams", "irfNavigator", "$state", "$stateParams", "irfNavigator", "SessionStore", "PageHelper", "translateFilter",
    function($log, $q, Queries, User, Audit, formHelper, $stateParams, irfNavigator, $state, $stateParams, irfNavigator, SessionStore, PageHelper, translateFilter) {
        var returnObj = {
            "type": "search-list",
            "title": "AUDIT_VIEW",
            initialize: function(model, form, formCtrl) {
                model.Audits = model.Audits || {};
                model.branch = SessionStore.getCurrentBranch().branchId;
                var bankName = SessionStore.getBankName();
                var banks = formHelper.enum('bank').data;
                for (var i = 0; i < banks.length; i++) {
                    if (banks[i].name == bankName) {
                        model.bankId = banks[i].value;
                        model.bankName = banks[i].name;
                    }
                }
                localFormController = formCtrl;
                syncCheck = false;
                if ($stateParams.pageData && $stateParams.pageData.page) {
                    returnObj.definition.listOptions.tableConfig.page = $stateParams.pageData.page;
                } else {
                    returnObj.definition.listOptions.tableConfig.page = 0;
                }
                var userRole = SessionStore.getUserRole();
                if (userRole && userRole.accessLevel && userRole.accessLevel === 5) {
                    model.fullAccess = true;
                }
                Queries.getGlobalSettings("audit.auditor_role_id").then(function(value) {
                    model.auditor_role_id = Number(value);
                }, PageHelper.showErrors);
            },
            definition: {
                title: "SEARCH_AUDIT",
                searchForm: [{
                        key: "bankId",
                        readonly: true,
                        condition: "!model.fullAccess"
                    }, {
                        key: "bankId",
                        condition: "model.fullAccess"
                    }, {
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
                    "audit_type",
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
                    }
                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SEARCH_OPTION',
                    "properties": {
                        "bankId": {
                            "title": "BANK_NAME",
                            "type": ["integer", "null"],
                            "enumCode": "bank",
                            "x-schema-form": {
                                "type": "select",
                                "screenFilter": true,

                            }
                        },
                        "auditor_id": {
                            "title": "AUDITOR_USERID"
                        },
                        "branch_id": {
                            "title": "BRANCH_NAME",
                            "type": "integer",
                            "enumCode": "branch_id",
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                        "audit_type": {
                            "title": "AUDIT_TYPE",
                            "type": "number",
                            "enumCode": "audit_type",
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
                    return Audit.online.findAuditInfo({
                        'audit_id': searchOptions.auditor_id,
                        'userId': searchOptions.userId,
                        'branch_id': searchOptions.branch_id,
                        'bankId': searchOptions.bankId,
                        'audit_type': searchOptions.audit_type,
                        'start_date': searchOptions.start_date ? searchOptions.start_date + " 00:00:00" : "",
                        'end_date': searchOptions.end_date ? searchOptions.end_date + " 23:59:59" : "",
                        'report_date': searchOptions.report_date ? searchOptions.report_date + " 00:00:00" : "",
                        'current_stage': searchOptions.current_stage,
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage
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
                        var master = Audit.offline.getAuditMaster();
                        return [{
                            title: 'AUDIT_ID',
                            data: 'audit_id'
                        }, {
                            title: 'AUDITOR_ID',
                            data: 'auditor_id'
                        }, {
                            title: 'AUDIT_TYPE',
                            data: 'audit_type',
                            render: function(data, type, full, meta) {
                                return master.audit_type[data].audit_type;
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
                        }, {
                            title: 'STAGE',
                            data: 'current_stage',
                            render: function(data) {
                                return (data && master.stages[data])? (translateFilter(master.stages[data].stage_label) || data): data;
                            }
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "VIEW_AUDIT",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                if (item.audit_type = 1) {
                                    var goparam = {
                                        'state': 'Page.Adhoc',
                                        'pageName': 'audit.AuditDetails',
                                        'pageId': item.audit_id,
                                        'pageData': {
                                            "type": "audit",
                                            "view": "all",
                                            "readonly": true
                                        }
                                    };
                                    var backparam = {
                                        'state': 'Page.Engine',
                                        'pageName': 'audit.AuditsViewQueue',
                                        'pageId': null,
                                        'pageData': {
                                            "page": returnObj.definition.listOptions.tableConfig.page
                                        }
                                    };
                                    irfNavigator.go(goparam, backparam);
                                } else if (item.audit_type = 0) {
                                    var goparam = {
                                        'state': 'Page.Engine',
                                        'pageName': 'audit.detail.SnapAuditDetails',
                                        'pageId': item.audit_id,
                                        'pageData': {
                                            "readonly": true
                                        }
                                    };
                                    var backparam = {
                                        'state': 'Page.Engine',
                                        'pageName': 'audit.AuditsViewQueue',
                                        'pageId': null,
                                        'pageData': {
                                            "page": returnObj.definition.listOptions.tableConfig.page
                                        }
                                    };
                                    irfNavigator.go(goparam, backparam);
                                }

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
