irf.pageCollection.factory(irf.page("audit.AuditScoreDetails"), ["$log", "PageHelper", "$q", "Audit", "formHelper", "$state", "$stateParams", "irfNavigator", "SessionStore",
    function($log, PageHelper, $q, Audit, formHelper, $state, $stateParams, irfNavigator, SessionStore) {
        return {
            "type": "schema-form",
            "title": "AUDIT_SCORE_DETAILS",
            initialize: function(model, form, formCtrl) {
                var master = Audit.offline.getAuditMaster();
                if (!$stateParams.pageData || !$stateParams.pageData.auditScoresheet) {
                    irfNavigator.goBack();
                    return;
                }
                model.auditScoresheet = $stateParams.pageData.auditScoresheet;
                model.master = Audit.offline.getAuditMaster();
                var rate = model.auditScoresheet.audit_score;
                var rate_flow = parseFloat(rate);
                var ratingNumber = Math.round(rate_flow);
                model.auditScoresheet.name = Audit.utils.getRatingByScore(master, ratingNumber);
            },
            form: [{
                "type": "box",
                "colClass": "col-sm-12",
                "title": "SCORESHEET",
                "readonly": true,
                "items": [{
                    "type": "section",
                    "htmlClass": "row",
                    "items": [{
                        "type": "section",
                        "htmlClass": "col-sm-6",
                        "items": [{
                            "key": "auditScoresheet.audit_id",
                            "title": "AUDIT_ID"
                        }, {
                            "key": "auditScoresheet.branch_name",
                            "title": "BRANCH_NAME"
                        }, {
                            "key": "auditScoresheet.start_date",
                            "title": "START_DATE"
                        }]
                    }, {
                        "type": "section",
                        "htmlClass": "col-sm-6",
                        "items": [{
                            "key": "auditScoresheet.audit_score",
                            "title": "AUDIT_SCORE"
                        }, {
                            "key": "auditScoresheet.name",
                            "title": "Rating"
                        }]
                    }]
                }, {
                    "type": "tableview",
                    "key": "auditScoresheet.detail_score",
                    "title": "Audit Score Sheet",
                    "searching": false,
                    "paginate": false,
                    "tableConfig": {
                        "searching": false,
                        "paginate": false,
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
                        return [{
                            "title": "Module",
                            "data": "module_name"
                        }, {
                            "title": "Module Score",
                            "data": "module_score"
                        }, {
                            "title": "SUBMODULE",
                            "data": "sub_module_score",
                            "className": "none",
                            render: function(data, type, full, meta) {
                                var table = ['<tr style="border-bottom:1px solid lightgray"><th>&nbsp;' + [
                                    'Sub Module', 'Risk Level', 'Awarded Score'
                                ].join('&nbsp;</th><th>&nbsp;') + '&nbsp;</th></tr>'];
                                for(i in data) {
                                    table.push('<tr><td>'+[
                                        data[i].sub_module_name,
                                        Audit.utils.getRiskLevel(data[i].risk_level_id),
                                        data[i].awarded_score + ' out of ' + data[i].max_score
                                    ].join('</td><td>')+'</td></tr>');
                                }
                                return data && data.length ? '<table style="border:1px solid lightgray;margin-top:5px;width:100%">' + table.join('') + '</table>' : '';
                            }
                        }];
                    },
                    getActions: function() { return []; }
                }]
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "sample_info": {
                        "type": "object",
                        "properties": {}
                    }
                }
            }
        };
    }
]);