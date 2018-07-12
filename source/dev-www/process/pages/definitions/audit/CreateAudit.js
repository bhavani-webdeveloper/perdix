irf.pageCollection.factory(irf.page("audit.CreateAudit"), ["$log", "PageHelper", "Audit", "$stateParams", "irfNavigator", "SessionStore",
    function($log, PageHelper, Audit, $stateParams, irfNavigator, SessionStore) {
        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "CREATE_AUDIT",
            initialize: function(model, form, formCtrl) {
                var self = this;
                model.audit_info = model.audit_info || {};
                model.branchName = SessionStore.getBranch();
                model.audit_info.auditor_id = SessionStore.getLoginname();
                var master = Audit.offline.getAuditMaster();
                var auditTypeValue = [];
                self.form = [];
                var init = function() {
                    self.form = [{
                        "type": "box",
                        "htmlClass": "col-sm-12 col-xs-12",
                        "title": "CREATE_AUDIT",
                        "items": [{
                            "key": "audit_info.auditor_id",
                            "title": "AUDITOR_ID",
                            "readonly": true
                        }, {
                            "key": "audit_info.branch_id",
                            "type": "select",
                        }, {
                            "key": "audit_info.audit_type",
                            "type": "select",
                            "title": "AUDIT_TYPE",
                            "enumCode": "audit_type"
                        }, {
                            "key": "audit_info.report_date",
                            "condition": "model.audit_info.audit_type == 1", // Regular
                            "type": "date",
                            "required": true
                        }, {
                            "key": "audit_info.start_date",
                            "type": "date",
                            "required": true
                        }, {
                            "key": "audit_info.end_date",
                            "type": "date",
                            "required": true
                        }],
                    }, {
                        "type": "actionbox",
                        "items": [{
                            "type": "submit",
                            "title": "CREATE",
                        }]
                    }]
                }
                init();
            },
            form: [],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "audit_info": {
                        "type": "object",
                        "title": "Address",
                        "properties": {
                            "auditor_id": {
                                "title": "AUDITOR_ID",
                                "type": "string",
                            },
                            "branch_id": {
                                "title": "BRANCH_NAME",
                                "type": "integer",
                                "enumCode": "branch_id"
                            },
                            "report_date": {
                                "type": "string",
                                "title": "REPORT_DATE"
                            },
                            "start_date": {
                                "type": "string",
                                "title": "START_DATE"
                            },
                            "end_date": {
                                "type": "string",
                                "title": "END_DATE"
                            }
                        }
                    },
                    "required": [
                        "branch_id",
                        "audit_type",
                        "start_date",
                        "report_date",
                        "end_date"
                    ]
                }
            },
            actions: {
                submit: function(model, formCtrl, form, $event) {
                    PageHelper.showLoader();
                    model.audit_info.status = "O";
                    model.audit_info.next_stage = "create";
                    var p = null;
                    if (model.audit_info.audit_type == 1) {
                        p = Audit.online.updateAuditInfo(model.audit_info).$promise;
                    } else {
                        p = Audit.online.createSnapAudit(model.audit_info).$promise;
                    }
                    p.then(function(res) {
                        model.audit_info = res;
                        PageHelper.showProgress("page-init", "Audit " + res.audit_id + " created Successfully.", 5000);
                        irfNavigator.goBack();
                    }, PageHelper.showErrors).finally(PageHelper.hideLoader);
                }
            }
        };
    }
]);