irf.pageCollection.factory(irf.page("audit.AuditIssues"), ["$log", "translateFilter", "Utils", "elementsUtils", "formHelper", "PageHelper", "irfNavigator", "$stateParams", "Audit", "SessionStore",
    function($log, translateFilter, Utils, elementsUtils, formHelper, PageHelper, irfNavigator, $stateParams, Audit, SessionStore) {
        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "AUDIT_ISSUES",
            initialize: function(model, form, formCtrl) {
                var self = this;
                self.form = [];
                model.audit_issues = model.audit_issues || {};
                localFormController = formCtrl;
                syncCheck = false;
                if (!$stateParams.pageId) {
                    irfNavigator.goBack();
                    PageHelper.showProgress("audit", "Audit ID is empty", 5000);
                    return;
                }
                $stateParams.pageData = $stateParams.pageData || [];
                if (typeof($stateParams.pageData.readonly) == 'undefined') {
                    $stateParams.pageData.readonly = true;
                }
                model.type = $stateParams.pageData.type;
                if ($stateParams.pageData.report) {
                    model.report = $stateParams.pageData.report;
                }
                model.stage = $stateParams.pageData.stage;
                var ids = $stateParams.pageId.split(':');
                if (ids.length != 3) {
                    irfNavigator.goBack();
                    return;
                }
                model.auditId = Number(ids[0]);
                model.viewType = String(ids[1]);
                model.viewTypeId = Number(ids[2]);

                model.role_id = SessionStore.getUserRole().id;
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
                var master = Audit.offline.getAuditMaster();
                var processData = function(issuesList) {
                    model.processView = [];
                    var issueMap = {};
                    model.issues = [];
                    if (issuesList) {
                        switch (model.viewType) {
                            case 'SAMPLE':
                                _.map(issuesList, function(iss) {
                                    if (iss.sample_id == model.viewTypeId) {
                                        iss.sampleName = model.report.sampleName;
                                        model.issues.push(iss);
                                    }
                                })
                                break;
                            case 'PROCESS':
                                _.map(issuesList, function(iss) {
                                    if (iss.process_id == model.viewTypeId) {
                                        iss.sampleName = model.report.sampleName;
                                        model.issues.push(iss);
                                    }
                                })
                                break;
                            case 'RISK':
                                _.map(issuesList, function(iss) {
                                    if (master.typeofissues[iss.type_of_issue_id].risk_classification == model.viewTypeId) {
                                        iss.sampleName = model.report.sampleName;
                                        model.issues.push(iss);
                                    }
                                })
                                break;
                        }
                    }

                }
                self.form = [{
                    "type": "box",
                    "colClass": "col-md-12",
                    "items": [{
                        "key": "issues",
                        "type": "tableview",
                        "title": "AUDIT_ISSUES",
                        "selectable": false,
                        "editable": false,
                        "tableConfig": {
                            "searching": true,
                            "paginate": true,
                            "pageLength": 10,
                        },
                        getColumns: function() {
                            var master = Audit.offline.getAuditMaster();
                            if (model.viewType == "SAMPLE") {
                                var columns = [{
                                    "title": "PROCESS_NAME",
                                    "data": "process_id",
                                    render: function(data, type, full, meta) {
                                        return master.process[full.process_id].process_name;
                                    }
                                }, {
                                    "title": "RISK_CLASSIFICATION",
                                    "data": "process_id",
                                    render: function(data, type, full, meta) {
                                        return master.risk_classification[full.process_id].risk_clasification_name;
                                    }
                                }];
                            } else if (model.viewType == "PROCESS") {
                                var columns = [{
                                    "title": "SAMPLE_NAME",
                                    "data": "sampleName"
                                }, {
                                    "title": "RISK_CLASSIFICATION",
                                    "data": "process_id",
                                    render: function(data, type, full, meta) {
                                        return master.risk_classification[master.typeofissues[full.type_of_issue_id].risk_classification].risk_clasification_name;
                                    }
                                }];
                            } else if (model.viewType == "RISK") {
                                var columns = [{
                                    "title": "SAMPLE_NAME",
                                    "data": "sampleName"
                                }, {
                                    "title": "PROCESS_NAME",
                                    "data": "process_id",
                                    render: function(data, type, full, meta) {
                                        return master.process[full.process_id].process_name;
                                    }
                                }];
                            }
                            columns.push.apply(columns, [{
                                "title": "OBSERVATION",
                                "data": "id",
                                render: function(data, type, full, meta) {
                                    return master.typeofissues[full.type_of_issue_id].description;
                                }
                            }, {
                                "title": "DEVIATION",
                                "data": "deviation"
                            }, {
                                "title": "AUDITOR_ID",
                                "data": "auditor_id"
                            }, {
                                "title": "ISSUE_STATUS",
                                "data": "status",
                                render: function(data, type, full, meta) {
                                    var lc = 'AMS_' + model.stage + '_' + data;
                                    var tr = translateFilter(lc);
                                    if (tr == lc)
                                        tr = translateFilter('AMS_' + data);
                                    return tr;
                                }
                            }, {
                                "title": "RESPONSE",
                                "data": "assignee_designation_id",
                                render: function(data, type, full, meta) {
                                    if (full.messages && full.messages.length) {
                                        return full.messages[0].comment;
                                    }
                                    return '';
                                }
                            }])
                            return columns;
                        },
                        getActions: function() {
                            return [{
                                name: "VIEW_ISSUE",
                                fn: function(item, index) {
                                    irfNavigator.go({
                                        'state': 'Page.Engine',
                                        'pageName': 'audit.IssueDetails',
                                        'pageId': item.id,
                                        'pageData': {
                                            "type": model.type,
                                            "readonly": $stateParams.pageData.readonly
                                        }
                                    });
                                },
                                isApplicable: function(item, index) {
                                    return true;
                                }
                            }];
                        }
                    }]
                }]
                PageHelper.showLoader();
                Audit.online.findIssues({
                    'audit_id': model.auditId,
                    'issue_publish': "ALL"
                }).$promise.then(function(data) {
                    processData(data.body);
                }, function(errRes) {
                    PageHelper.showErrors(errRes);
                }).finally(function() {
                    PageHelper.hideLoader();
                });
            },
            form: [],

            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "audit_issues": {
                        "type": "object",
                        "properties": {},
                    }
                },
            },
            actions: {

            }
        };
    }
]);