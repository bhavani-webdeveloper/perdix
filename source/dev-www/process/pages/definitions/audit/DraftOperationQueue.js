irf.pageCollection.factory(irf.page("audit.DraftOperationQueue"), ["$log", "Utils", "PageHelper", "irfNavigator", "$stateParams", "formHelper", "Audit", "$state", "$q", "SessionStore","User", "Queries",
    function($log, Utils, PageHelper, irfNavigator, $stateParams, formHelper, Audit, $state, $q, SessionStore, User, Queries) {
        var localFormController;
        var returnObj = {
            "type": "search-list",
            "title": "DRAFT_OPERATION_QUEUE",
            initialize: function(model, form, formCtrl) {
                model.Audits = model.Audits || {};
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
                var bankName = SessionStore.getBankName();
                var banks = formHelper.enum('bank').data;
                for (var i = 0; i < banks.length; i++) {
                    if (banks[i].name == bankName) {
                        model.bankId = banks[i].value;
                        model.bankName = banks[i].name;
                    }
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
                    if (SessionStore.session.offline) {
                        return Audit.utils.processDisplayRecords(null, 1, 'D');
                    }
                    var deferred = $q.defer();
                    Audit.online.getAuditList({
                        'auditor_id': searchOptions.auditor_id,
                        'branch_id': searchOptions.branch_id,
                        'start_date': searchOptions.start_date ? searchOptions.start_date + " 00:00:00" : "",
                        'end_date': searchOptions.end_date ? searchOptions.end_date + " 23:59:59" : "",
                        'report_date': searchOptions.report_date ? searchOptions.report_date + " 00:00:00" : "",
                        'current_stage': 'draft',
                        'status': "D",
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage
                    }).$promise.then(function(res) {
                        Audit.utils.processDisplayRecords(res.body, 1, 'D').then(deferred.resolve, deferred.reject);
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
                            data: 'audit_id',
                            render: function(data, type, full, meta) {
                                return Audit.utils.auditStatusHtml(full, false) + data;
                            }
                        }, {
                            title: 'AUDITOR_ID',
                            data: 'auditor_id'
                        },{
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
                        }, {
                            title: 'Days left',
                            data: 'days_left'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "SYNC",
                            icon: "fa fa-refresh",
                            fn: function(item, index) {
                                PageHelper.showLoader();
                                Audit.online.getAuditFull({
                                    audit_id: item.audit_id
                                }).$promise.then(function(response) {
                                    item._offline = true;
                                    PageHelper.showProgress("audit", "Synchronized successfully", 3000);
                                    return Audit.offline.setAudit(item.audit_id, response);
                                }).finally(function() {
                                    PageHelper.hideLoader();
                                });
                            },
                            isApplicable: function(item, index) {
                                return !SessionStore.session.offline && !item._offline && item._online;
                            }
                        }, {
                            name: "VIEW_DRAFT",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    'state': 'Page.Adhoc',
                                    'pageName': 'audit.AuditDetails',
                                    'pageId': item.audit_id,
                                    'pageData': {
                                        "type": "operation",
                                        "readonly": item.current_stage !== 'draft'
                                    }
                                }, {
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.DraftOperationQueue',
                                    'pageData': {
                                        "page": returnObj.definition.listOptions.tableConfig.page
                                    }
                                });
                            },
                            isApplicable: function(item, index) {
                                return true;
                            }
                        }, {
                            name: "DELETE_OFFLINE",
                            icon: "fa fa-trash",
                            fn: function(item, index) {
                                Utils.confirm('Do You Want to Delete?').then(function() {
                                    PageHelper.showLoader();
                                    Audit.offline.deleteAudit(item.audit_id).then(function() {
                                        item._offline = false;
                                        delete item._dirty;
                                        delete item._sync;
                                    }).finally(PageHelper.hideLoader);
                                });
                            },
                            isApplicable: function(item, index) {
                                return item._offline;
                            }
                        }];
                    },
                    getBulkActions: function() {
                        return [{
                            name: "SYNC_ALL",
                            icon: "fa fa-refresh",
                            fn: function(items, index) {
                                PageHelper.showLoader();
                                var sy = function(item) {
                                    var p = Audit.online.getAuditFull({
                                        audit_id: item.audit_id
                                    }).$promise;
                                    p.then(function(response) {
                                        PageHelper.hideLoader();
                                        item._offline = true;
                                        Audit.offline.setAudit(item.audit_id, response);
                                    });
                                    return p;
                                };
                                var ps = [];
                                for (i in items) {
                                    ps.push(sy(items[i]));
                                }
                                $q.all(ps).then(function() {
                                    PageHelper.showProgress("audit", "All audits synchronized successfully", 3000);
                                }, function() {
                                    PageHelper.showProgress("audit", "Audits failed to synchronize", 3000);
                                }).finally(function() {
                                    PageHelper.hideLoader();
                                });
                            },
                            isApplicable: function(item, index) {
                                if (!SessionStore.session.offline) {
                                    return true;
                                }
                                return false;
                            }
                        }];
                    },
                }
            }
        };
        return returnObj;
    }
]);