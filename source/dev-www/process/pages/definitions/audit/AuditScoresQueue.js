irf.pageCollection.factory(irf.page("audit.AuditScoresQueue"), ["$log", "$stateParams", "irfNavigator", "formHelper", "Audit", "$state", "$q", "SessionStore",
    function($log, $stateParams, irfNavigator, formHelper, Audit, $state, $q, SessionStore) {
        var returnObj = {
            "type": "search-list",
            "title": "AUDIT_SCORES",
            initialize: function(model, form, formCtrl) {
                $log.info("search-list sample got initialized");
                model.Audits = model.Audits || {};
                if ($stateParams.pageData && $stateParams.pageData.page) {
                    returnObj.definition.listOptions.tableConfig.page = $stateParams.pageData.page;
                } else {
                    returnObj.definition.listOptions.tableConfig.page = 0;
                }
            },
            definition: {
                title: "SEARCH_SCORES",
                searchForm: [
                    "*"
                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SEARCH_OPTIONS',
                    "properties": {
                        "audit_id": {
                            "title": "AUDIT_ID",
                            "type": "string"
                        },
                        "branch_id": {
                            "title": "BRANCH",
                            "type": ["null", "number"],
                            "enumCode": "branch_id",
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                        "start_date": {
                            "title": "FROM_DATE",
                            "type": "string",
                            "x-schema-form": {
                                "type": "date",
                            }
                        },
                        "to_date": {
                            "title": "TO_DATE",
                            "type": "string",
                            "x-schema-form": {
                                "type": "date",
                            }
                        },
                    }
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    return Audit.online.findAuditScores({
                        'audit_id': searchOptions.audit_id,
                        'branch_id': searchOptions.branch_id,
                        'branch_name': searchOptions.branch_name,
                        'start_date': searchOptions.start_date,
                        'audit_score': searchOptions.audit_score,
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
                        var master = Audit.offline.getAuditMaster();
                        return [{
                            title: 'AUDIT_ID',
                            data: 'audit_id'
                        }, {
                            title: 'BRANCH_NAME',
                            data: 'branch_name'
                        }, {
                            title: 'AUDIT_START_DATE',
                            data: 'start_date'
                        }, {
                            title: 'SCORE',
                            data: 'audit_score'
                        }, {
                            title: 'RATING',
                            data: 'audit_id',
                            render: function(data, type, full, meta) {
                                var rating = "";
                                if (full.audit_score) {
                                    var rate_flow = parseFloat(full.audit_score);
                                    var ratingNumber = Math.round(rate_flow);
                                    rating = Audit.utils.getRatingByScore(master, ratingNumber) || "";
                                }
                                return rating;
                            }
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "VIEW_SCORES_DETAILS",
                            icon: "fa fa-archive",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.AuditScoreDetails',
                                    'pageId': item.audit_id,
                                    'pageData': {
                                        'auditScoresheet': item
                                    }
                                }, {
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.AuditScoresQueue',
                                    'pageData': {
                                        "page": returnObj.definition.listOptions.tableConfig.page
                                    }
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