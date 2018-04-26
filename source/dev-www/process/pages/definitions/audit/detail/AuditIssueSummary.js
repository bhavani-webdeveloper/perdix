irf.pageCollection.factory(irf.page("audit.detail.AuditIssueSummary"), ["$log", "$filter", "formHelper", "irfNavigator", "$stateParams", "Audit", "PageHelper",
    function($log, $filter, formHelper, irfNavigator, $stateParams, Audit, PageHelper) {
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

                var processArray = [];
                _.forOwn(master.process, function(v, k) {
                    processArray.push(v);
                });
                var summaryWeightageArray = [];
                var weightageColumns = [{
                    "title": "PROCESS_NAME",
                    "data": "process_name"
                }];
                _.forOwn(master.summary_weightage, function(v, k) {
                    summaryWeightageArray.push(v);
                    weightageColumns.push({
                        "title": v.name,
                        "data": v.name
                    })
                });
                weightageColumns.push({
                    "title": "TOTAL",
                    "data": "total",
                    render: function(data) {
                        return '<strong>' + data + '</strong>';
                    }
                });

                var nodes = {};
                for (i in master.nodetype) {
                    nodes[master.nodetype[i].node_id] = master.nodetype[i];
                }

                self.form = [];
                var processIssueSummaryData = function(auditIssueSummary) {
                    model.process = [];
                    self.form = [];
                    for (i = 0; i < auditIssueSummary.length; i++) {
                        var is = auditIssueSummary[i];
                        // if (is.node_type == 1) {
                        //     var branchName = $filter('filter')(formHelper.enum('branch_id').data, {
                        //         'value': is.node_id
                        //     }, true);
                        //     if (branchName && branchName.length) {
                        //         is.branchName = branchName[0].name;
                        //     }
                        // } else {
                        //     is.branchName = null;
                        // }
                        // if (is.node_type == 2) {
                        //     var centreName = $filter('filter')(formHelper.enum('centre').data, {
                        //         'value': is.node_id
                        //     }, true);
                        //     if (centreName && centreName.length) {
                        //         is.centreName = centreName[0].name;
                        //     }
                        // } else {
                        //     is.centreName = null;
                        // }
                        var pr = _.cloneDeep(processArray);
                        model.process[i] = pr;
                        var processTotal = {
                            "process_name": "<strong>Total</strong>",
                            "total": 0
                        };
                        for (k in summaryWeightageArray) {
                            processTotal[summaryWeightageArray[k].name] = 0;
                        }
                        for (j in pr) {
                            var pro = pr[j];
                            pro.total = 0;
                            for (k in summaryWeightageArray) {
                                pro[summaryWeightageArray[k].name] = 0;
                            }
                            for (n in is.trait_score) {
                                var t = is.trait_score[n];
                                if (pro.process_id == t.process_id) {
                                    pro[master.summary_weightage[t.rating_id].name] = t.rating_count;
                                    pro.total += t.rating_count;
                                }
                            }
                            for (k in summaryWeightageArray) {
                                processTotal[summaryWeightageArray[k].name] += pro[summaryWeightageArray[k].name];
                                processTotal.total += pro[summaryWeightageArray[k].name];
                            }
                        }
                        for (j in processTotal) {
                            processTotal[j] = '<strong>' + processTotal[j] + '</strong>';
                        }
                        pr.push(processTotal);
                    }
                    for (i in model.process) {
                        self.form.push({
                            "type": "box",
                            "title": nodes[auditIssueSummary[i].node_type].node_type + " " + "Score board" + ": " + auditIssueSummary[i].node_id,
                            "colClass": "col-sm-12",
                            "items": [{
                                "key": "process[" + i + "]",
                                "type": "tableview",
                                "selectable": false,
                                "notitle": true,
                                "editable": false,
                                "tableConfig": {
                                    "searching": false,
                                    "paginate": false,
                                    "ordering": false
                                },
                                getColumns: function() {
                                    return weightageColumns;
                                },
                                getActions: function() {}

                            }]
                        });
                    }
                };
                PageHelper.showLoader();
                Audit.online.getAuditIssueSummary({
                    'audit_id': auditId
                }).$promise.then(function(resp) {
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