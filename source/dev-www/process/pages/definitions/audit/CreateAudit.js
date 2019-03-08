irf.pageCollection.factory(irf.page("audit.CreateAudit"), ["$log", "PageHelper", "Audit", "formHelper", "irfNavigator", "SessionStore",
    function($log, PageHelper, Audit, formHelper, irfNavigator, SessionStore) {
        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "CREATE_AUDIT",
            initialize: function(model, form, formCtrl) {
                var self = this;
                model.audit_info = model.audit_info || {};
                model.audit_info.branch_id = SessionStore.getCurrentBranch().branchId;
                var bankName = SessionStore.getBankName();
                var banks = formHelper.enum('bank').data;
                for (var i = 0; i < banks.length; i++) {
                    if (banks[i].name == bankName) {
                        model.audit_info.bankId = banks[i].value;
                    }
                }
                var userRole = SessionStore.getUserRole();
                if (userRole && userRole.accessLevel && userRole.accessLevel === 5) {
                    model.fullAccess = true;
                }
                model.audit_info.auditor_id = SessionStore.getLoginname();
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
                            "key": "audit_info.bankId",
                            "readonly": true,
                            "condition": "!model.fullAccess"
                        }, {
                            "key": "audit_info.bankId",
                            "condition": "model.fullAccess"
                        }, {
                            "key": "audit_info.branch_id",
                            "type": "select",
                            "parentEnumCode": "bank",
                            "parentValueExpr": "model.audit_info.bankId"
                        }, {
                            "key": "audit_info.audit_type",
                            "type": "select",
                            "title": "AUDIT_TYPE",
                            "enumCode": "audit_type"
                        }, {
                            "key": "audit_info.report_date",
                            "condition": "model.audit_info.audit_type == 1", // Regular
                            "type": "date",
                            "required": true,
                            "onChange": function (modelValue, form, model) {
                                var selecteddate = model.audit_info.report_date;
                                var currentdate = moment(new Date()).format("YYYY-MM-DD");
                                if(selecteddate > currentdate){
                                    model.audit_info.report_date = null;
                                    PageHelper.showProgress("Date Error", "Report Date should not contain future." , 5000);
                                    return false;
                                }
                            },
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
                            "bankId": {
                                "title": "BANK_NAME",
                                "type": ["integer", "null"],
                                "enumCode": "bank",	
                                "x-schema-form": {
                                    "type": "select"
                                }
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
                    if (!model.audit_info.report_date || !model.audit_info.start_date || !model.audit_info.end_date) {
                        PageHelper.setError({message: "Report date, start date, and end date are mandatory"});
                        return;
                    }
                    var rDate = moment(model.audit_info.report_date, SessionStore.getSystemDateFormat());
                    var sDate = moment(model.audit_info.start_date, SessionStore.getSystemDateFormat());
                    var eDate = moment(model.audit_info.end_date, SessionStore.getSystemDateFormat());
                    if (rDate.isAfter(sDate)) {
                        PageHelper.setError({message: "Report date should be on or before start date"});
                        return;
                    } else if (sDate.isAfter(eDate)) {
                        PageHelper.setError({message: "Start date should be on or before end date"});
                        return;
                    }
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