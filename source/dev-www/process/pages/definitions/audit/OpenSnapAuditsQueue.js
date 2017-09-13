irf.pageCollection.factory(irf.page("audit.OpenSnapAuditsQueue"), ["$log","Utils", "PageHelper", "irfNavigator", "$stateParams", "formHelper", "Audit", "$state", "$q", "SessionStore",
    function($log,Utils, PageHelper, irfNavigator, $stateParams, formHelper, Audit, $state, $q, SessionStore) {
        var localFormController;
        var returnObj = {
            "type": "search-list",
            "title": "OPEN_SNAP_AUDIT",
            initialize: function(model, form, formCtrl) {
                model.Audits = model.Audits || {};
                localFormController = formCtrl;
                syncCheck = false;
                if ($stateParams.pageData && $stateParams.pageData.page) {
                    returnObj.definition.listOptions.tableConfig.page = $stateParams.pageData.page;
                } else {
                    returnObj.definition.listOptions.tableConfig.page = 0;
                }
                $stateParams.pageData = $stateParams.pageData || {};
                if (typeof($stateParams.pageData.readonly) == 'undefined') {
                    $stateParams.pageData.readonly = true;
                }
            },
            definition: {
                title: "SEARCH_AUDITS",
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
                        }
                    }
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    if (SessionStore.session.offline) {
                        return Audit.utils.processDisplayRecords();
                    }
                    var deferred = $q.defer();
                    Audit.online.getAuditList({
                        'audit_id': searchOptions.audit_id,
                        'auditor_id': SessionStore.getLoginname(),
                        'branch_id': searchOptions.branch_id,
                        'start_date': searchOptions.start_date ? searchOptions.start_date + " 00:00:00" : "",
                        'end_date': searchOptions.end_date ? searchOptions.end_date + " 23:59:59" : "",
                        'report_date': searchOptions.report_date ? searchOptions.report_date + " 00:00:00" : "",
                        'current_stage': 'start',
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage
                    }).$promise.then(function(res) {
                        Audit.utils.processDisplayRecords(res.body).then(deferred.resolve, deferred.reject);
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
                        return [{
                            title: 'AUDIT_ID',
                            data: 'audit_id',
                            render: function(data, type, full, meta) {
                                return Audit.utils.auditStatusHtml(full, false) + data;
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
                            name: "DO_AUDIT",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    'state': 'Page.Adhoc',
                                    'pageName': 'audit.AuditDetails',
                                    'pageId': item.audit_id,
                                    'pageData': {
                                        "readonly": item.current_stage !== 'start'
                                    }
                                }, {
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.OpenSnapAuditsQueue',
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