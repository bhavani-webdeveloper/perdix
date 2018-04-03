irf.pageCollection.factory(irf.page("audit.detail.AuditSummary"),
["$log", "irfNavigator", "$stateParams", "Audit", "PageHelper", "$q",
    function($log, irfNavigator, $stateParams, Audit, PageHelper, $q) {

        var riskColor = function(risk) {
            switch (risk) {
                case "HIGH":
                    return '<i class="fa fa-circle text-red">&nbsp;</i>';
                case "MEDIUM":
                    return '<i class="fa fa-circle text-yellow">&nbsp;</i>';
                default:
                    return '<i class="fa fa-circle text-green">&nbsp;</i>';
            }
        };

        return {
            "type": "schema-form",
            "title": "AUDIT_SUMMARY",
            initialize: function(model, form, formCtrl) {
                var self = this;
                if (!$stateParams.pageId) {
                    irfNavigator.goBack();
                    return;
                }
                $stateParams.pageData = $stateParams.pageData || {};
                if (typeof($stateParams.pageData.readonly) == 'undefined') {
                    $stateParams.pageData.readonly = true;
                }
                var pageData = {
                    "readonly": $stateParams.pageData.readonly
                };
                model.readonly = pageData.readonly;

                var auditId = Number($stateParams.pageId);
                var master = Audit.offline.getAuditMaster();

                self.form = [];
                var processSummaryData = function(auditSummary, auditScore) {
                    model.audit_summary = auditSummary;
                    model.audit_score = auditScore;

                    var actionsBoxItems = [];
                    self.form = [{
                        "type": "box",
                        "title": "SUMMARY",
                        "colClass": "col-sm-12",
                        "items": [{
                            "key": "audit_summary",
                            "type": "tableview",
                            "selectable": false,
                            "notitle":true,
                            "editable": false,
                            "tableConfig": {
                                "searching": true,
                                "paginate": true,
                                "pageLength": 10,
                                "responsive": {
                                    "details": {
                                        // "display": $.fn.dataTable.Responsive.display.childRowImmediate
                                    }
                                }
                            },
                            getColumns: function() {
                                return [{
                                    "title": "ID",
                                    "data": "audit_summary_id"
                                }, {
                                    "title": "TYPE",
                                    "data": "review_type",
                                    render: function(data, type, full, meta) {
                                        return data == 'TEST_BASED' ? 'Test' : 'Analytical';
                                    }
                                }, {
                                    "title": "PROCESS",
                                    "data": "process_id",
                                    render: function(data, type, full, meta) {
                                        return master.process[data].process_name;
                                    }
                                }, {
                                    title: "SUB_PROCESS",
                                    data: "sub_process_id",
                                    render: function(data, type, full, meta) {
                                        return master.subprocess[data].sub_process_name;
                                    }
                                }, {
                                    title: "PARAMETER",
                                    data: "audit_parameter"
                                }, {
                                    title: "RISK",
                                    data: "risk_classification",
                                    render: function(data, type, full, meta) {
                                        return riskColor(data) + full.risk_involved;
                                    }
                                }, {
                                    title: "SAMPLES_PASS",
                                    data: "pass",
                                    render: function(data, type, full, meta) {
                                        return data != null ? data + '/' + full.tested : '';
                                    }
                                }, {
                                    title: "OBS_STATUS",
                                    data: "observation_status",
                                    render: function(data, type, full, meta) {
                                        return data ? master.summary_observation_status[data].name : '';
                                    }
                                }, {
                                    title: "OBS_CLASSIFICATION",
                                    data: "observation_classification",
                                    render: function(data, type, full, meta) {
                                        return data ? master.observation_classification[data].name : '';
                                    }
                                }, {
                                    title: "OBS_DETAILS",
                                    data: "observation_details"
                                }, {
                                    title: "RECOMENDATION",
                                    data: "recommendation"
                                }, {
                                    title: "AUDITEE_RESPONSE",
                                    data: "auditee_response"
                                }]
                            },
                            getActions: function() {
                                return [{
                                    name: "UPDATE",
                                    icon: "fa fa-pencil-square-o",
                                    fn: function(item, index) {
                                        irfNavigator.go({
                                            'state': 'Page.Engine',
                                            'pageName': 'audit.detail.AuditSummaryDetails',
                                            'pageId': auditId + ":" + item.audit_summary_id,
                                            'pageData': pageData
                                        }, {
                                            'state': 'Page.Engine',
                                            'pageName': 'audit.detail.AuditSummary',
                                            'pageId': auditId,
                                            'pageData': pageData
                                        });
                                    },
                                    isApplicable: function(item, index) {
                                        return !$stateParams.pageData.readonly;
                                    }
                                }, {
                                    name: "VIEW",
                                    icon: "fa fa-eye",
                                    fn: function(item, index) {
                                        irfNavigator.go({
                                            'state': 'Page.Engine',
                                            'pageName': 'audit.detail.AuditSummaryDetails',
                                            'pageId': auditId + ":" + item.audit_summary_id,
                                            'pageData': pageData
                                        }, {
                                            'state': 'Page.Engine',
                                            'pageName': 'audit.detail.AuditSummary',
                                            'pageId': auditId,
                                            'pageData': pageData
                                        });
                                    },
                                    isApplicable: function(item, index) {
                                        return $stateParams.pageData.readonly;
                                    }
                                }];
                            }
                        }]
                    }, {
                        "type": "box",
                        "title": "SUMMARY_SCOREBOARD",
                        "colClass": "col-sm-12",
                        "items": [{
                            "key": "audit_score",
                            "type": "tableview",
                            "selectable": false,
                            "editable": false,
                            "tableConfig": {
                                "searching": false,
                                "paginate": false,
                                "responsive": false,
                                "ordering": false
                            },
                            getColumns: function() {
                                var sw = master.summary_weightage;
                                var cols = [];
                                for (i in sw) {
                                    cols.push({
                                        "title": sw[i].name,
                                        "data": sw[i].id
                                    });
                                }
                                for (i in model.audit_score) {
                                    var d = model.audit_score[i];
                                    for (j in d.summary_set) {
                                        d[d.summary_set[j].rating_id] = d.summary_set[j].count;
                                        for (k in cols) {
                                            if (!d[cols[k].data]) {
                                                d[cols[k].data] = 0;
                                            }
                                        }
                                    }
                                }
                                var columns = [{
                                    "title": "PROCESS",
                                    "data": "process_id",
                                    render: function(data, type, full, meta) {
                                        return master.process[data].process_name;
                                    }
                                }];
                                columns.push.apply(columns, cols);
                                columns.push({
                                    "title": "TOTAL",
                                    "data": "total"
                                });
                                return columns;
                            },

                        }]


                    }];
                };

                model.$isOffline = false;
                if ($stateParams.pageData.auditData && $stateParams.pageData.auditData.audit_summary && $stateParams.pageData.auditData.summary_scoreboard) {
                    pageData.auditData = $stateParams.pageData.auditData;
                    processSummaryData($stateParams.pageData.auditData.audit_summary, $stateParams.pageData.auditData.summary_scoreboard);
                } else {
                    PageHelper.showLoader();
                    $q.all([
                        Audit.offline.getAuditSummary(auditId),
                        Audit.offline.getAuditScoreBoard(auditId)
                    ]).then(function(response) {
                        model.$isOffline = true;
                        processSummaryData(response[0], response[1]);
                    }).finally(PageHelper.hideLoader);
                }
            },
            form: [],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "audit_summary": {
                        "type": "string"
                    }
                }
            },
            actions: {}
        }
    }
]);