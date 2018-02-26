irf.pageCollection.factory(irf.page("audit.detail.processcompliance.SampleSetSummary"), ["$log", "$state", "irfNavigator", "$stateParams", "$http", "Enrollment", "Audit", "SessionStore", "Files", "PageHelper", "$q",
    function($log, $state, irfNavigator, $stateParams, $http, Enrollment, Audit, SessionStore, Files, PageHelper, $q) {
        var branch = SessionStore.getBranch();
        var returnObj = {
            "type": "schema-form",
            "title": "SAMPLE_SET_SUMMARY",
            initialize: function(model, form, formCtrl) {
                var self = this;
                if (!$stateParams.pageId || $stateParams.pageId.split(':').length != 2) {
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

                model.siteCode = SessionStore.getGlobalSetting('siteCode');
                self.form = [];
                var auditId = $stateParams.pageId.split(':')[0];
                var sampleTypeId = $stateParams.pageId.split(':')[1];
                var master = Audit.offline.getAuditMaster();
                var sampleColumnsConfig = null;
                // TODO: below this point
                var tableColumnsConfig = [{
                    "title": "SAMPLE",
                    "data": "sub_id",
                    render: function(data, type, full, meta) {
                        if (full.sample_newgen_uid) {
                            return data = 'NEW';
                        } else {
                            return data = data;
                        }
                    }
                }];
                for (i in master.sampling_columns_config) {
                    sampleColumnsConfig = master.sampling_columns_config[i];
                    if (sampleColumnsConfig.scoring_sample_type_id == sampleTypeId) {
                        for (j in sampleColumnsConfig.columns) {
                            tableColumnsConfig.push({
                                "title": sampleColumnsConfig.columns[j].user_friendly_name,
                                "data": "column_values." + j
                            });
                        }
                    }
                };
                tableColumnsConfig.push({
                    "title": "ISSUES",
                    "data": "issue_details",
                    "className": "none",
                    render: function(data, type, full, meta) {
                        var columns = null;
                        if (model.siteCode == "KGFS") {
                            columns = ["Process", "Sub Process", "Issue", "Comment", "Responsibility", "Additional Responsibility", "Spot fix", "Spot action"];
                        } else if (model.siteCode == "kinara") {
                            columns = ["Process", "Sub Process", "Issue", "Option", "Comment", "Responsibility", "Additional Responsibility"];
                        }

                        var table = [
                            '<tr style="border-bottom:1px solid lightgray"><th>&nbsp;' + columns.join('&nbsp;</th><th>&nbsp;') + '&nbsp;</th></tr>'
                        ];
                        for (i in data) {
                            var r = data[i];
                            if (r.assignee_det[0].assignee_id || r.deviation) {
                                var row = [
                                    master.process[master.typeofissues[r.type_of_issue_id].process_id].process_name,
                                    master.subprocess[master.typeofissues[r.type_of_issue_id].sub_process_id].sub_process_name,
                                    master.typeofissues[r.type_of_issue_id].description
                                ];
                                if (model.siteCode == "kinara") {
                                    var options = master.autosampling_typeofissue_sets[r.type_of_issue_id].options.type_of_issue_options;
                                    for (j in options) {
                                        if (options[j].option_id == r.option_id) {
                                            row.push(options[j].option_label);
                                            break;
                                        }
                                    }
                                    if (row.length == 3) {
                                        row.push('&nbsp;');
                                    }
                                }
                                row.push(r.deviation || '&nbsp;');
                                row.push(r.assignee_det[0].assignee_id || '&nbsp;');
                                if (r.assignee_det[1]) {
                                    row.push(r.assignee_det[1].assignee_id || '&nbsp;');
                                } else {
                                    row.push('&nbsp;');
                                }
                                if (model.siteCode == "kinara") {
                                    row.push(r.spot_fixed || '&nbsp;');
                                    row.push(r.spot_action || '&nbsp;');
                                }
                                table.push('<tr style="border-bottom:1px solid lightgray"><td>' + row.join('</td><td>') + '</td></tr>');
                            }
                        }

                        return data && data.length ? '<table style="border:1px solid lightgray;margin-top:5px"><caption style="border:1px solid lightgray;border-bottom:0;text-align:center;padding:0">Issues</caption>' + table.join('') + '</table>' : '';
                    }
                });

                var processData = function(response) {
                    if (!model.$isOffline && $stateParams.pageData.auditData) {
                        pageData.auditData = $stateParams.pageData.auditData;
                    }

                    model.processCompliance = response;
                    for (i in response.auto_sampling) {
                        if (response.auto_sampling[i].scoring_sample_type_id == sampleTypeId) {
                            model.sampleSet = response.auto_sampling[i].sample_set;
                            break;
                        }
                    }
                    for (i = 0, model.sampleSetSummary = []; i < model.sampleSet.length; i++)
                        if (model.sampleSet[i].status == "0") model.sampleSetSummary.push(model.sampleSet[i]);
                    self.form = [{
                        "type": "box",
                        "colClass": "col-md-12",
                        "title": master.process_tabs[master.scoring_sample_sets[sampleTypeId].scoring_process_type_id].scoring_process_type,
                        "items": [{
                            "key": "sampleSetSummary",
                            "title": master.scoring_sample_sets[sampleTypeId].scoring_sample_type,
                            "type": "tableview",
                            "selectable": false,
                            "editable": false,
                            "tableConfig": {
                                "searching": true,
                                "paginate": true,
                                "lengthMenu": [
                                    [1, 2, 5, 10, 25, 50, -1],
                                    [1, 2, 5, 10, 25, 50, "All"]
                                ],
                                "pageLength": 5,
                                "responsive": {
                                    "details": {
                                        "display": $.fn.dataTable.Responsive.display.childRowImmediate,
                                        renderer: function(api, rowIdx, columns) {
                                            var html = '<ul data-dtr-index="' + rowIdx + '" class="dtr-details">';
                                            var issuesIndex = columns.length - 2;
                                            for (i in columns) {
                                                if (columns[i].hidden) {
                                                    if (i != issuesIndex) {
                                                        html += '<li data-dtr-index="' + columns[i].rowIndex + '" data-dt-row="' + rowIdx + '" data-dt-column="' + columns[i].rowIndex + '">' +
                                                            '<span class="dtr-title">' + columns[i].title + '</span>' +
                                                            '<span class="dtr-data">' + columns[i].data + '</span>' +
                                                            '</li>';
                                                    }
                                                }
                                            }
                                            return html + '</ul>' + columns[issuesIndex].data;
                                        }
                                    }
                                },
                                "dom": '<"top"pl>rt<"bottom"p><"clear">'
                            },
                            getColumns: function() {
                                return tableColumnsConfig;
                            },
                            initializeDataTable: function(dataTable, datatableConfig, tableData) {
                                // $log.info(dataTable);
                            },
                            getActions: function() {
                                return [{
                                    name: "SKIP_SAMPLE",
                                    icon: "",
                                    fn: function(item, index) {
                                        item.status = "0";
                                        delete item.issue_details;
                                        for (i = 0, model.sampleSetSummary = []; i < model.sampleSet.length; i++)
                                            if (model.sampleSet[i].status == "0") model.sampleSetSummary.push(model.sampleSet[i]);
                                        if (model.$isOffline) {
                                            Audit.offline.setProcessCompliance(auditId, model.processCompliance);
                                        }
                                    },
                                    isApplicable: function(item, index) {
                                        return !$stateParams.pageData.readonly && item.status != "0";
                                    }
                                }, {
                                    name: "NO_ISSUES",
                                    icon: "",
                                    fn: function(item, index) {
                                        item.status = "1";
                                        delete item.issue_details;
                                        for (i = 0, model.sampleSetSummary = []; i < model.sampleSet.length; i++)
                                            if (model.sampleSet[i].status == "1") model.sampleSetSummary.push(model.sampleSet[i]);
                                        if (model.$isOffline) {
                                            Audit.offline.setProcessCompliance(auditId, model.processCompliance);
                                        }
                                    },
                                    isApplicable: function(item, index) {
                                        return model.siteCode == 'KGFS' && !$stateParams.pageData.readonly && item.status != "1";
                                    }
                                }, {
                                    name: "DO_AUDIT",
                                    icon: "",
                                    fn: function(item, index) {
                                        irfNavigator.go({
                                            'state': 'Page.Engine',
                                            'pageName': 'audit.detail.processcompliance.SampleIssues',
                                            'pageId': auditId + ":" + sampleTypeId + ":" + (item.sub_id ? item.sub_id : (item.sample_newgen_uid ? '_' + item.sample_newgen_uid : '')),
                                            'pageData': pageData
                                        }, {
                                            'state': 'Page.Engine',
                                            'pageName': 'audit.detail.processcompliance.SampleSetSummary',
                                            'pageId': auditId + ":" + sampleTypeId,
                                            'pageData': pageData
                                        });
                                    },
                                    isApplicable: function(item, index) {
                                        return !$stateParams.pageData.readonly;
                                    }
                                }, {
                                    name: "VIEW_ISSUES",
                                    icon: "",
                                    fn: function(item, index) {
                                        irfNavigator.go({
                                            'state': 'Page.Engine',
                                            'pageName': 'audit.detail.processcompliance.SampleIssues',
                                            'pageId': auditId + ":" + sampleTypeId + ":" + (item.sub_id ? item.sub_id : (item.sample_newgen_uid ? '_' + item.sample_newgen_uid : '')),
                                            'pageData': pageData
                                        }, {
                                            'state': 'Page.Engine',
                                            'pageName': 'audit.detail.processcompliance.SampleSet',
                                            'pageId': auditId + ":" + sampleTypeId,
                                            'pageData': pageData
                                        });
                                    },
                                    isApplicable: function(item, index) {
                                        return $stateParams.pageData.readonly
                                    }
                                }];
                            }
                        }]
                    }];
                };
                model.$isOffline = false;
                if ($stateParams.pageData.auditData && $stateParams.pageData.auditData.process_compliance) {
                    processData($stateParams.pageData.auditData.process_compliance);
                } else {
                    PageHelper.showLoader();
                    Audit.offline.getProcessCompliance(auditId).then(function(response) {
                        model.$isOffline = true;
                        processData(response);
                    }, function(errRes) {
                        PageHelper.showErrors(errRes);
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });
                }
            },
            form: [],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "sampleset": {
                        "type": "string"
                    }
                }
            },
            actions: {}
        };
        return returnObj;
    }
]);