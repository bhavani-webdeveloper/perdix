irf.pageCollection.factory(irf.page("audit.detail.AllSampleIssueSummary"),
["irfNavigator", "$stateParams", "Audit", "SessionStore", "PageHelper", "$timeout",
    function(irfNavigator, $stateParams, Audit, SessionStore, PageHelper, $timeout) {
        var branch = SessionStore.getBranch();
        var returnObj = {
            "type": "schema-form",
            "title": "ALL_SAMPLE_ISSUE_SUMMARY",
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

                model.siteCode = SessionStore.getGlobalSetting('siteCode');
                self.form = [];
                var auditId = $stateParams.pageId;
                var master = Audit.offline.getAuditMaster();

                var updateComment = function(t, edit, updatedComment, n, sample_id, i) {
                    var ss = model.processCompliance.auto_sampling[n].sample_set;
                    for (x = 0; x < ss.length; x++) {
                        if (ss[x].sample_id == sample_id) {
                            ss = ss[x];
                            break;
                        }
                    }
                    var issue = ss.issue_details[i];
                    console.log(issue);
                    Audit.online.getIssueDetails({
                        issue_id: issue.issue_id
                    }).$promise.then(function(resp) {
                        resp.deviation = updatedComment;
                        Audit.online.updateIssueDetails(resp).$promise.then(function(res) {
                            issue.deviation = res.deviation;
                            t.find('span').text(issue.deviation);
                            edit.find('i').addClass('fa-pencil').removeClass('fa-spinner fa-spin');
                            if (model.$isOffline) {
                                Audit.offline.setProcessCompliance(auditId, model.processCompliance);
                            }
                        }, PageHelper.showErrors);
                    }, PageHelper.showErrors);
                };

                var launchCommentEdit = function(e, n, sample_id, i) {
                    e.preventDefault();
                    var t = $(e.target).closest('.deviation');
                    var edit = t.find('button');
                    if (edit.find('i.fa-spin').length) {
                        return;
                    }
                    edit.hide();
                    var pop = $('<div class="pop-edit" style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:2"></div>');
                    var text = $('<textarea style="width:100%;height:100%" />');
                    pop.append(text);
                    pop.append('<br>');
                    pop.append($('<button class="btn btn-xs btn-success"><i class="fa fa-check"></i></button>').click(function(e1) {
                        e1.preventDefault();
                        pop.remove();
                        edit.find('i').removeClass('fa-pencil').addClass('fa-spinner fa-spin');
                        edit.show();
                        console.log(text.val());
                        updateComment(t, edit, text.val(), n, sample_id, i);
                    }));
                    pop.append('&nbsp;');
                    pop.append($('<button class="btn btn-xs btn-danger"><i class="fa fa-times"></i></button>').click(function(e1) {
                        e1.preventDefault();
                        pop.remove();
                        edit.show();
                        console.log(text.val());
                    }));
                    t.append(pop);
                    text.val(t.find('span').text());
                };

                model.sampleSetSummary = [];
                window.allSampleIssueSummary = {};
                var renderForm = function(n, keyId, scConfig) {
                    self.form.push({
                        "key": "sampleSetSummary[" + n + "]",
                        "title": master.process_tabs[master.scoring_sample_sets[keyId].scoring_process_type_id].scoring_process_type + ' / ' + master.scoring_sample_sets[keyId].scoring_sample_type,
                        "type": "tableview",
                        "selectable": false,
                        "editable": false,
                        "tableConfig": {
                            "searching": true,
                            "ordering": false,
                            "paginate": false,
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
                                        var issuesIndex = columns.length - 1;
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
                            for (j in scConfig.columns) {
                                tableColumnsConfig.push({
                                    "title": scConfig.columns[j].user_friendly_name,
                                    "data": "column_values." + j
                                });
                            }
                            tableColumnsConfig.push({
                                "title": "ISSUES",
                                "data": "issue_details",
                                "className": "none",
                                render: function(data, type, full, meta) {
                                    var columns = null;
                                    if (model.siteCode == "KGFS") {
                                        columns = ["Process", "Sub Process", "Issue", "Comment", "Resp.", "Addl. Resp.", "Spot fix", "Spot Action", "Spotfix Resp."];
                                    } else if (model.siteCode == "kinara") {
                                        columns = ["Process", "Sub Process", "Issue", "Option", "Comment", "Responsibility", "Additional Responsibility"];
                                    }
            
                                    var table = [
                                        '<tr style="border-bottom:1px solid lightgray"><th>&nbsp;&nbsp;' + columns.join('</th><th>') + '</th></tr>'
                                    ];
                                    for (i in data) {
                                        var r = data[i];
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
                                        var deviation = r.deviation || '&nbsp;';
                                        if (model.siteCode == "KGFS") {
                                            var ii = i;
                                            window.allSampleIssueSummary['edit_'+n+'_'+ii] = function(e) {
                                                launchCommentEdit(e, n, full.sample_id, ii);
                                            };
                                            deviation = '<div class="deviation" style="position:relative"><span>' + r.deviation + '</span><button style="position:absolute;bottom:0;right:0;background:transparent" onclick="allSampleIssueSummary.edit_'+n+'_'+ii+'(event);return false"><i class="fa fa-pencil"></i></button></div>';
                                        }
                                        row.push(deviation);
                                        row.push(r.assignee_det[0].assignee_id || '&nbsp;');
                                        if (r.assignee_det[1]) {
                                            row.push(r.assignee_det[1].assignee_id || '&nbsp;');
                                        } else {
                                            row.push('&nbsp;');
                                        }
                                        if (model.siteCode == "KGFS") {
                                            row.push(r.spot_fixed=='0'?'&nbsp;':'Yes' || '&nbsp;');
                                            row.push(r.spot_action || '&nbsp;');
                                            if (r.assignee_det[0]) {
                                                row.push(r.assignee_det[0].spot_assignee_id || '&nbsp;');
                                            } else {
                                                row.push('&nbsp;');
                                            }
                                        }
                                        table.push('<tr style="border-bottom:1px solid lightgray"><td>' + row.join('</td><td style="padding-left:0">') + '</td></tr>');
                                    }
            
                                    return data && data.length ? '<table style="border:1px solid lightgray;margin-top:5px;width:100%"><caption style="border:1px solid lightgray;border-bottom:0;text-align:center;padding:0">Issues</caption>' + table.join('') + '</table>' : '';
                                }
                            });
                            return tableColumnsConfig;
                        },
                        initializeDataTable: function(dataTable, datatableConfig, tableData) {
                            // $log.info(dataTable);
                        },
                        getActions: function() {
                            return [];
                        }
                    });
                }
                var processData = function(response) {
                    if (!model.$isOffline && $stateParams.pageData.auditData) {
                        pageData.auditData = $stateParams.pageData.auditData;
                    }

                    model.processCompliance = response;
                    console.log(response); // TODO to be removed
                    for (i in response.auto_sampling) {
                        var sampleTypeId = response.auto_sampling[i].scoring_sample_type_id;
                        var _sampleSet = response.auto_sampling[i].sample_set;
                        var sampleColumnsConfig = null;
                        model.sampleSetSummary[i] = [];
                        for (j = 0; j < _sampleSet.length; j++) {
                            if (_sampleSet[j].status == "0") {
                                model.sampleSetSummary[i].push(_sampleSet[j]);
                            }
                        }
                        for (j in master.sampling_columns_config) {
                            if (master.sampling_columns_config[j].scoring_sample_type_id == sampleTypeId) {
                                sampleColumnsConfig = master.sampling_columns_config[j];
                            }
                        };
                        renderForm(i, sampleTypeId, sampleColumnsConfig);
                    }
                    self.form = [{
                        "type": "box",
                        "colClass": "col-md-12",
                        "title": "AUTO_SAMPLING",
                        "items": self.form
                    }];
                    console.log('THE END');
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