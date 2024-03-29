irf.pageCollection.factory(irf.page("audit.ApprovedAuditsViewQueue"), ["$log", "Queries", "User", "formHelper", "$stateParams", "irfNavigator", "Audit", "$state", "$q", "SessionStore", "PageHelper",
    function($log, Queries, User, formHelper, $stateParams, irfNavigator, Audit, $state, $q, SessionStore, PageHelper) {
        var returnObj = {
            "type": "search-list",
            "title": "PENDING_PUBLISH_VIEW",
            initialize: function(model, form, formCtrl) {
                model.Audits = model.Audits || {};
                // model.branch_id = SessionStore.getCurrentBranch().branchId;
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
                $log.info("Regular audit queue got initialized");
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
                title: "SEARCH_AUDITS",
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
                            }
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
                    "end_date"
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
                                "type": "select",
                                "screenFilter": true,

                            }
                        },
                        "auditor_id": {
                            "title": "AUDITOR_USERID"
                        },
                        "branch_id": {
                            "title": "BRANCH_ID",
                            "type": "number",
                            "enumCode": "branch_id",
                            "x-schema-form": {
                                "type": "userbranch",
                            }
                        },
                        "audit_type": {
                            "title": "AUDIT_TYPE",
                            "type": "number",
                            "enumCode": "audit_type",
                            "x-schema-form": {
                                "type": "select",
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
                        },
                    },
                    "required": []
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    var promise = Audit.online.findAuditInfo({
                        'auditor_id': searchOptions.auditor_id,
                        'branch_id': searchOptions.branch_id,
                        'bank_id': searchOptions.bankId,
                        'audit_type': searchOptions.audit_type,
                        'start_date': searchOptions.start_date ? searchOptions.start_date + " 00:00:00" : "",
                        'end_date': searchOptions.end_date ? searchOptions.end_date + " 23:59:59" : "",
                        'report_date': searchOptions.report_date ? searchOptions.report_date + " 00:00:00" : "",
                        'current_stage': "approve",
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage
                    }).$promise;
                    return promise;
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
                        return []
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
                            title: 'AUDIT_TYPE',
                            data: 'audit_type',
                            render: function(data, type, full, meta) {
                                return masterJson.audit_type[data].audit_type;
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
                            title: 'DAYS_LEFT',
                            data: 'days_left'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "VIEW_AUDIT",
                            icon: "fa fa-eye",
                            fn: function(item, index) {
                                if (item.audit_type = 1) {
                                    var goparam = {
                                        'state': 'Page.Adhoc',
                                        'pageName': 'audit.AuditDetails',
                                        'pageId': item.audit_id,
                                        'pageData': {
                                            "page": returnObj.definition.listOptions.tableConfig.page,
                                            "readonly": true,
                                            "view": "all",
                                            "type": "audit"
                                        }
                                    };
                                    var backparam = {
                                        'state': 'Page.Engine',
                                        'pageName': 'audit.ApprovedAuditsViewQueue',
                                        'pageId': item.audit_id,
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
                                        // 'pageData': {
                                        //     "page": returnObj.definition.listOptions.tableConfig.page,
                                        //     "readonly": true
                                        // }
                                    };
                                    var backparam = {
                                        'state': 'Page.Engine',
                                        'pageName': 'audit.ApprovedAuditsViewQueue',
                                        'pageId': item.audit_id,
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