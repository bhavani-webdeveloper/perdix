irf.pageCollection.factory(irf.page("audit.ScheduledAuditsQueue"), ["$log", "formHelper", "$stateParams", "irfNavigator", "Audit", "$state", "$q", "SessionStore",
    function($log, formHelper, $stateParams, irfNavigator, Audit, $state, $q, SessionStore) {
        var returnObj = {
            "type": "search-list",
            "title": "SCHEDULED_AUDITS",
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
                    var deferred = $q.defer();
                    $q.all([
                        Audit.online.getAuditList({
                            'auditor_id': SessionStore.getLoginname(),
                            'branch_id': searchOptions.branch_id,
                            'start_date': searchOptions.start_date ? searchOptions.start_date + " 00:00:00" : "",
                            'end_date': searchOptions.end_date ? searchOptions.end_date + " 23:59:59" : "",
                            'report_date': searchOptions.report_date ? searchOptions.report_date + " 00:00:00" : "",
                            'current_stage': 'scheduled',
                            'page': pageOpts.pageNo,
                            'per_page': pageOpts.itemsPerPage
                        }).$promise,
                        // Audit.online.getAuditList({
                        //     'auditor_id': SessionStore.getLoginname(),
                        //     'branch_id': searchOptions.branch_id,
                        //     'start_date': searchOptions.start_date ? searchOptions.start_date + " 00:00:00" : "",
                        //     'end_date': searchOptions.end_date ? searchOptions.end_date + " 23:59:59" : "",
                        //     'report_date': searchOptions.report_date ? searchOptions.report_date + " 00:00:00" : "",
                        //     'current_stage': 'reassign',
                        //     'page': pageOpts.pageNo,
                        //     'per_page': pageOpts.itemsPerPage
                        // }).$promise
                    ]).then(function(data) {
                        var returnObj = {
                            headers: {
                                'x-total-count': data[0].headers['x-total-count']
                            },
                            body: data[0].body
                        };
                        // returnObj.headers['x-total-count'] += data[1].headers['x-total-count'];
                        // returnObj.body.push.apply(returnObj.body, data[1].body);
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
                            title: 'STAGE',
                            data: 'current_stage',
                            render: function(data, type, full, meta) {
                                return data == 'scheduled' ? 'Scheduled' : 'Reassigned';
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
                        }, {
                            title: 'DAYS_LEFT',
                            data: 'days_left'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "UPDATE",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.ScheduledAuditDetails',
                                    'pageId': item.audit_id,
                                    'pageData': {
                                        "readonly": false
                                    }
                                }, {
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.ScheduledAuditsQueue',
                                    'pageId': null
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