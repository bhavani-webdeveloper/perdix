irf.pageCollection.factory(irf.page("audit.AuditIssues"), ["$log", "Utils", "elementsUtils", "formHelper", "PageHelper", "irfNavigator", "$stateParams", "Audit", "SessionStore",
    function($log, Utils, elementsUtils, formHelper, PageHelper, irfNavigator, $stateParams, Audit, SessionStore) {
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
                    $log.info(issuesList);
                    $log.info("issues1");
                    var issueMap = {};
                    model.issues = [];
                    if (issuesList) {
                        switch (model.viewType) {
                            case 'SAMPLE':
                                _.map(issuesList, function(iss) {
                                    if (iss.sample_id == model.viewTypeId) {
                                        model.issues.push(iss);
                                    }
                                })
                                break;
                            case 'PROCESS':
                                _.map(issuesList, function(iss) {
                                    if (iss.process_id == model.viewTypeId) {
                                        model.issues.push(iss);
                                    }
                                })
                                break;
                            case 'RISK':
                                _.map(issuesList, function(iss) {
                                    if (iss.type_of_issue_id == model.viewTypeId) {
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
                            return [{
                                "title": "OBSERVATION",
                                "data": "id",
                                render: function(data, type, full, meta) {
                                    return master.typeofissues[full.type_of_issue_id].description;
                                }
                            }, {
                                "title": "BRANCH_ID",
                                "data": "branch_id"
                            }, {
                                "title": "AUDITOR_ID",
                                "data": "auditor_id",
                                render: function(data, type, full, meta) {
                                    return master.branch_name[full.branch_id].node_code;
                                }
                            }];
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
                                            "type": "draft",
                                        }
                                    }, {
                                        'state': 'Page.Engine',
                                        'pageName': 'audit.AuditIssues'
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
                    'issue_publish': "NO"
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
                    "add_fv": {
                        "type": "object",
                        "properties": {
                            "urn": {
                                "type": ["string", "null"],
                                "title": "URN",
                                "maxLength": 16,
                                "minLength": 16
                            },
                            "field_verify_date": {
                                "type": ["string", "null"],
                                "title": "FIELD_VERIFY_DATE"
                            },
                            "amount": {
                                "type": "number",
                                "title": "AMOUNT"
                            },
                            "loan_type": {
                                "type": ["string", "null"],
                                "title": "LOAN_TYPE"
                            },

                            "comments": {
                                "type": ["string", "null"],
                                "title": "COMMENTS"
                            },
                        },

                    }
                },
            },
            actions: {

            }
        };
    }
]);