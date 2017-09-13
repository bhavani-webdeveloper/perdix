irf.pageCollection.factory(irf.page("audit.CreateRegularAudit"), ["$log", "PageHelper", "Audit", "$stateParams", "irfNavigator", "SessionStore",
    function($log, PageHelper, Audit, $stateParams, irfNavigator, SessionStore) {
        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "CREATE_REGULAR_AUDIT",
            initialize: function(model, form, formCtrl) {
                model.audit_info = model.audit_info || {};
                model.branchName = SessionStore.getBranch();
                model.audit_info.auditor_id = SessionStore.getLoginname();
                // model.audit_info.audit_type = "Regular";
            },
            form: [{
                "type": "box",
                "htmlClass": "col-sm-12 col-xs-12",
                "title": "CREATE_AUDIT",
                "items": [{
                    key: "audit_info.auditor_id",
                }, {
                    key: "audit_info.branch_id",
                    type: "select",
                }, {
                    key: "audit_info.report_date",
                    type: "date",
                    required: true,
                }, {
                    "key": "audit_info.audit_type",
                    "type": "select",
                    "titleMap": [{
                        "name": "Regular",
                        "value": "Regular"
                    }, {
                        "name": "Snap Audit",
                        "value": "Snap Audit"
                    }]
                },{
                    key: "audit_info.start_date",
                    "condition": "model.audit_info.audit_id",
                    type: "date",
                    required: true,
                    readonly: true
                }, {
                    key: "audit_info.end_date",
                    "condition": "model.audit_info.audit_id",
                    type: "date",
                    required: true
                }],
            }, {
                "type": "actionbox",
                "condition": "!model.audit_info.audit_id",
                "items": [{
                    "type": "button",
                    "title": "CREATE",
                    "style": "text-right",
                    onClick: "actions.createAudit(model, formCtrl, form, $event)"
                }]
            }, {
                "type": "actionbox",
                "condition": "model.audit_info.audit_id",
                "items": [{
                    "type": "submit",
                    "title": "START_AUDIT"
                }]
            }],
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
                                "enumCode": "branch_id",
                                "required": true
                            },
                            "audit_type": {
                                "type": "string",
                                "title": "AUDIT_TYPE"
                            },
                            "report_date": {
                                "type": "string",
                                "title": "AUDIT_REPORT_CREATE_DATE"
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
                        "report_date",
                        "start_date",
                        "end_date"
                    ]
                }
            },
            actions: {
                submit: function(model, form, formName) {
                    var auditId = $stateParams.pageId;
                    PageHelper.showLoader();
                    if (model.audit_info.start_date && model.audit_info.end_date) {
                         model.audit_info.next_stage = "start";
                        Audit.online.updateAuditInfo(model.audit_info).$promise.then(function(res) {
                            model.audit_info = res;
                            PageHelper.showProgress("page-init", "successfully Created.", 5000);
                            irfNavigator.goBack();
                        }, function(errRes) {
                            PageHelper.showErrors(errRes);
                        }).finally(function() {
                            PageHelper.hideLoader();
                        });
                    } else {
                        PageHelper.showProgress("page-init", "No Empty Column.", 5000);
                        PageHelper.hideLoader();
                    }

                },
                createAudit: function(model, formCtrl, form, $event) {
                    PageHelper.showLoader();
                    if (model.audit_info.auditor_id && model.audit_info.branch_id && model.audit_info.report_date) {
                        model.audit_info.next_stage = "create";
                        Audit.online.updateAuditInfo(model.audit_info).$promise.then(function(res) {
                            model.audit_info = res;
                            PageHelper.showProgress("page-init", "Audit Updated Successfully.", 5000);
                        }, function(errRes) {
                            PageHelper.showErrors(errRes);
                        }).finally(function() {
                            PageHelper.hideLoader();
                        })
                    } else {
                        PageHelper.showProgress("page-init", "No Empty Column.", 5000);
                        PageHelper.hideLoader();
                    }
                },
            },

        };
    }
]);