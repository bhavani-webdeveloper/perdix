irf.pageCollection.factory(irf.page("audit.detail.AuditIssueSummary"), ["$log", "irfNavigator", "$stateParams", "Audit", "PageHelper",
    function($log, irfNavigator, $stateParams, Audit, PageHelper) {
        return {
            "type": "schema-form",
            "title": "AUDIT_ISSUE_SUMMARY",
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
                var processIssueSummaryData = function(auditIssueSummary) {
                    var processArray = [];
                    _.forOwn(master.process, function(v, k) {
                        processArray.push(v);
                    });
                    var summaryWeightageArray = [];
                    _.forOwn(master.summary_weightage, function(v, k) {
                        summaryWeightageArray.push(v);
                    });
                    model.process = [];
                    var processTotal = {
                        "process_name": "Total"
                    };
                    for (i in auditIssueSummary) {
                        var is = auditIssueSummary[i];
                        model.process[i] = _.cloneDeep(processArray);
                        for (n in model.process[i]) {
                            var pro = model.process[i][n];
                            for (j in summaryWeightageArray) {
                                var traitList = is.trait_score[k];
                                if (pro.process_id == traitList.process_id) {
                                    pro[master.summary_weightage[traitList.rating_id].name] = traitList.rating_count;
                                    pro.total = pro.total? pro.total + traitList.rating_count: 0;
                                }
                            }
                        }
                    }
                        self.form = [{
                            "type": "box",
                            "title": is.node_type ? (is.node_type + " - " + is.node_ + "ISSUE_SUMMARY") : "ISSUE_SUMMARY",
                            "colClass": "col-sm-12",
                            "items": [{
                                "key": "process[0]",
                                "type": "tableview",
                                "selectable": false,
                                "notitle": true,
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
                                    var columns = [{
                                        "title": "PROCESS_NAME",
                                        "data": "process_name"
                                    }];
                                    _.forOwn(master.summary_weightage, function(v, k) {
                                        columns.push.apply(columns, [{
                                            "title": v.name,
                                            "data": "rating_id",
                                            render: function(data, type, full, meta) {
                                                return data ? full.rating_count : "0";
                                            }
                                        }]);
                                    });
                                    columns.push({
                                        "title": "TOTAL",
                                        "data": "total"
                                    })
                                    return columns;
                                },
                                getActions: function() {}

                            }]
                        }];

                    $log.info(model.process)

                };
                PageHelper.showLoader();
                Audit.online.getAuditIssueSummary().$promise.then(function(resp) {
                    processIssueSummaryData(resp);
                }, PageHelper.showErrors).finally(PageHelper.hideLoader);
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