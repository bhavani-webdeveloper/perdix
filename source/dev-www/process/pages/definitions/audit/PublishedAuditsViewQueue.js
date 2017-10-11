irf.pageCollection.factory(irf.page("audit.PublishedAuditsViewQueue"), ["$log", "Utils", "formHelper", "Queries", "User", "$stateParams", "irfNavigator", "Audit", "$state", "$q", "SessionStore", "PageHelper",
    function($log, Utils, formHelper, Queries, User, $stateParams, irfNavigator, Audit, $state, $q, SessionStore, PageHelper) {
        var returnObj = {
            "type": "search-list",
            "title": "PUBLISHED_AUDITS_VIEW",
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
                            return User.query({
                                'login': inputModel.login,
                                'userName': inputModel.userName,
                                'roleId': model.auditor_role_id,
                                'branchName': inputModel.branch_id
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
                            "title": "AUDITOR_ID",
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
                    return Audit.online.getAuditList({
                        'auditor_id': searchOptions.auditor_id,
                        'branch_id': searchOptions.branch_id,
                        'start_date': searchOptions.start_date ? searchOptions.start_date + " 00:00:00" : "",
                        'end_date': searchOptions.end_date ? searchOptions.end_date + " 23:59:59" : "",
                        'report_date': searchOptions.report_date ? searchOptions.report_date + " 00:00:00" : "",
                        'current_stage': 'publish',
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
                            name: "VIEW_AUDIT",
                            icon: "fa fa-eye",
                            fn: function(item, index, model) {
                                if (item.audit_type = "Regular") {
                                    var goparam = {
                                        'state': 'Page.Adhoc',
                                        'pageName': 'audit.AuditDetails',
                                        'pageId': item.audit_id,
                                        'pageData': {
                                            "readonly": true
                                        }
                                    };
                                    var backparam = {
                                        'state': 'Page.Engine',
                                        'pageName': 'audit.PublishedAuditsViewQueue',
                                        'pageData': {
                                            "page": returnObj.definition.listOptions.tableConfig.page
                                        }
                                    };
                                    irfNavigator.go(goparam, backparam);

                                } else if (item.audit_type = "SNAP") {
                                    var goparam = {
                                        'state': 'Page.Engine',
                                        'pageName': 'audit.detail.SnapAuditDetails',
                                        'pageId': item.audit_id,
                                        // 'pageData': {
                                        //     "readonly": true
                                        // }
                                    };
                                    var backparam = {
                                        'state': 'Page.Engine',
                                        'pageName': 'audit.PublishedAuditsViewQueue',
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