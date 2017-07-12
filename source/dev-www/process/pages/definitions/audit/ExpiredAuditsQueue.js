irf.pageCollection.factory(irf.page("audit.ExpiredAuditsQueue"), ["$log", "formHelper", "Lead", "$stateParams", "irfNavigator", "Audit", "$state", "$q", "SessionStore", "Utils",
    function($log, formHelper, Lead, $stateParams, irfNavigator, Audit, $state, $q, SessionStore, Utils) {

        var returnObj = {
            "type": "search-list",
            "title": "EXPIRED_AUDITS",
            initialize: function(model, form, formCtrl) {
                model.Audits = model.Audits || {};
                model.branch = SessionStore.getCurrentBranch().branchId;
                localFormController = formCtrl;
                syncCheck = false;
                if ($stateParams.pageData && $stateParams.pageData.page) {
                    returnObj.definition.listOptions.tableConfig.page = $stateParams.pageData.page;
                } else {
                    returnObj.definition.listOptions.tableConfig.page = 0;
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
                        "auditor_id": {
                            "title": "AUDITOR_ID",
                            "type": "number"
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
                        }
                    },
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    return Audit.online.getAuditList({
                        'audit_id': searchOptions.auditor_id,
                        'branch_id': searchOptions.branch_id,
                        'start_date': searchOptions.start_date ? searchOptions.start_date + " 00:00:00" : "",
                        'end_date': searchOptions.end_date ? searchOptions.end_date + " 23:59:59" : "",
                        'report_date': searchOptions.report_date ? searchOptions.report_date + " 00:00:00" : "",
                        'current_stage': 'expired',
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
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                var goparam = {
                                    'state': 'Page.Adhoc',
                                    'pageName': 'audit.AuditDetails',
                                    'pageId': item.audit_id,
                                    'pageData': {
                                        "page": returnObj.definition.listOptions.tableConfig.page,
                                        "readonly": true
                                    }
                                };
                                var backparam = {
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.ExpiredAuditsQueue',
                                    'pageData': {
                                        "page": returnObj.definition.listOptions.tableConfig.page
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