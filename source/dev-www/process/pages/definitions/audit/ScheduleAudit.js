irf.pageCollection.factory(irf.page("audit.ScheduleAudit"), ["$log", "translateFilter", "PageHelper", "User", "irfNavigator", "formHelper", "Audit", "$stateParams", "SessionStore", "$q",
    function($log, translateFilter, PageHelper, User, irfNavigator, formHelper, Audit, $stateParams, SessionStore, $q) {
        var validateDates = function(model) {
            var reportDate = moment(model.auditInfo.report_date, SessionStore.getSystemDateFormat());
            var startDate = moment(model.auditInfo.start_date, SessionStore.getSystemDateFormat());
            var endDate = moment(model.auditInfo.end_date, SessionStore.getSystemDateFormat());
            if (reportDate.isBefore(moment(), 'days')) {
                PageHelper.setError({
                    message: "Report date should not be past date"
                });
                return false;
            }
            if (startDate.isBefore(reportDate, 'days')) {
                PageHelper.setError({
                    message: "Start date should not be before report date"
                });
                return false;
            }
            if (startDate.isAfter(endDate, 'days')) {
                PageHelper.setError({
                    message: "End date should not be before start date"
                });
                return false;
            }
            return true;
        };
        return {
            "type": "schema-form",
            "title": "SCHEDULE_AUDIT",
            initialize: function(model, form, formCtrl) {
                model.auditInfo = model.auditInfo || {};
                model.branchName = SessionStore.getBranch();
                model.roleUsers = model.roleUsers || {};
                model.master = Audit.offline.getAuditMaster();
                if ($stateParams.pageId) {
                    Audit.online.getAuditInfo({
                        audit_id: $stateParams.pageId
                    }).$promise.then(function(res) {
                        model.auditInfo = res;
                        model.auditInfoOriginal = _.cloneDeep(res);
                    }, function(errRes) {
                        PageHelper.showErrors(errRes);
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });
                } else {
                    model.auditInfo = {};
                };
                model.actions = this.actions;
            },
            form: [{
                "type": "box",
                "title": "SCHEDULE_AUDIT",
                "items": [{
                    "key": "auditInfo.audit_id",
                    "condition": "model.auditInfo.audit_id",
                    "title": "AUDIT_ID",
                    readonly: true
                }, {
                    key: "auditInfo.branch_id",
                    type: "select",
                    required: true,
                    "onChange": function(modelValue, form, model) {
                        delete model.auditInfo.auditor_id;
                    }
                }, {
                    key: "auditInfo.report_date",
                    type: "date",
                    required: true,
                    "onChange": function(modelValue, form, model) {
                        if (modelValue) {
                            var reportDate = moment(modelValue, SessionStore.getSystemDateFormat());
                            var startDate = moment(model.auditInfo.start_date, SessionStore.getSystemDateFormat());
                            var endDate = moment(model.auditInfo.end_date, SessionStore.getSystemDateFormat());
                            if (!model.auditInfo.start_date || !reportDate.isBefore(startDate, 'days')) {
                                model.auditInfo.start_date = reportDate.add(1, 'days').format(SessionStore.getSystemDateFormat());
                                startDate = moment(model.auditInfo.start_date, SessionStore.getSystemDateFormat());
                            }
                            if (!model.auditInfo.end_date || startDate.isAfter(endDate, 'days')) {
                                model.auditInfo.end_date = model.auditInfo.start_date;
                            }
                        } else {
                            delete model.auditInfo.start_date;
                            delete model.auditInfo.end_date;
                        }
                        delete model.auditInfo.auditor_id;
                    }
                }, {
                    key: "auditInfo.start_date",
                    type: "date",
                    "required": true,
                    "onChange": function(modelValue, form, model) {
                        if (modelValue) {
                            var startDate = moment(modelValue, SessionStore.getSystemDateFormat());
                            var endDate = moment(model.auditInfo.end_date, SessionStore.getSystemDateFormat());
                            if (!model.auditInfo.end_date || startDate.isAfter(endDate, 'days')) {
                                model.auditInfo.end_date = model.auditInfo.start_date;
                            }
                        } else {
                            delete model.auditInfo.end_date;
                        }
                        delete model.auditInfo.auditor_id;
                    }
                }, {
                    key: "auditInfo.end_date",
                    type: "date",
                    "required": true,
                    "onChange": function(modelValue, form, model) {
                        delete model.auditInfo.auditor_id;
                    }
                }, {
                    key: "auditInfo.auditor_id",
                    title: "AUDITOR_USERID",
                    type: "lov",
                    lovonly: true,
                    required: true,
                    outputMap: {
                        "auditor_id": "auditInfo.auditor_id",
                        "auditor_name": "auditInfo.auditor_name"
                    },
                    searchHelper: formHelper,
                    search: function(inputModel, form, model) {
                        if (model.auditInfo.branch_id && model.auditInfo.start_date && model.auditInfo.end_date) {
                            return Audit.online.getAvailableAuditorList({
                                'audit_id': model.auditInfo.audit_id,
                                'branch_id': model.auditInfo.branch_id,
                                'from_date': model.auditInfo.start_date,
                                'to_date': model.auditInfo.end_date
                            }).$promise;
                        } else {
                            PageHelper.setError({
                                message: "Branch ID, Start date, End date are required to find available auditors"
                            });
                            return $q.reject();
                        }
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.auditor_id,
                            item.auditor_name
                        ];
                    }
                }, {
                    "key": "auditInfo.message",
                    "condition": "model.auditInfo.audit_id",
                    "title": "COMMENT",
                    "type": "textarea",
                    "required": true
                }]
            }, {
                "type": "box",
                "condition": "model.auditInfo.messages.length",
                "title": "MESSAGE_HISTORY",
                "readonly": true,
                "items": [{
                    "key": "auditInfo.messages",
                    "type": "array",
                    "view": "fixed",
                    "titleExpr": "actions.getStageTitle(model, arrayIndex)",
                    "items": [{
                        "type": "section",
                        "htmlClass": "",
                        "html": '<i class="fa fa-user text-gray">&nbsp;</i> {{model.actions.getUsername(model.auditInfo.messages[arrayIndex].created_by)}}\
                        <br><i class="fa fa-clock-o text-gray">&nbsp;</i> {{model.auditInfo.messages[arrayIndex].created_on}}\
                        <br><i class="fa fa-commenting text-gray">&nbsp;</i> <strong>{{model.auditInfo.messages[arrayIndex].comment}}</strong><br>'
                    }]
                }]
            }, {
                "type": "actionbox",
                "condition": "!model.auditInfo.audit_id",
                "items": [{
                    title: "SCHEDULE",
                    type: "button",
                    "onClick": "actions.submit(model, form, formCtrl, 'scheduled')"
                }]
            }, {
                "type": "actionbox",
                "condition": "model.auditInfo.audit_id",
                "items": [{
                    title: "RESCHEDULE",
                    type: "button",
                    "onClick": "actions.submit(model, form, formCtrl, 'scheduled')"
                }, {
                    title: "CANCEL_REQUEST",
                    type: "button",
                    "onClick": "actions.cancelRequest(model, form, formCtrl)"
                }]
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "auditInfo": {
                        "type": "object",
                        "title": "Address",
                        "properties": {
                            "auditor_id": {
                                "type": "string",
                                "title": "AUDITOR"
                            },
                            "report_date": {
                                "type": "string",
                                "title": "REPORT_DATE"
                            },
                            "branch_id": {
                                "title": "BRANCH_NAME",
                                "type": "integer",
                                "enumCode": "branch_id",
                                "x-schema-form": {
                                    "type": "select"
                                }
                            },
                            "start_date": {
                                "type": "string",
                                "title": "START_DATE",
                                "x-schema-form": {
                                    "type": "date"
                                }
                            },
                            "end_date": {
                                "type": "string",
                                "title": "END_DATE",
                                "x-schema-form": {
                                    "type": "date"
                                }
                            },
                        }
                    },
                },
            },

            actions: {
                submit: function(model, form, formCtrl, nextStage) {
                    PageHelper.clearErrors();
                    formHelper.validate(formCtrl).then(function() {
                        if (!validateDates(model)) return;
                        if (model.auditInfo.current_stage == 'postpone') {
                            if (model.auditInfo.start_date == model.auditInfoOriginal.start_date && model.auditInfo.end_date == model.auditInfoOriginal.end_date) {
                                PageHelper.setError({
                                    message: "Start date/end date should be different"
                                });
                                return false;
                            } else if (model.auditInfo.auditor_id != model.auditInfoOriginal.auditor_id) {
                                PageHelper.setError({
                                    message: "Auditor should be a same user"
                                });
                                return false;
                            }
                        } else if (model.auditInfo.current_stage == 'cancel') {
                            if (model.auditInfo.auditor_id == model.auditInfoOriginal.auditor_id) {
                                PageHelper.setError({
                                    message: "Auditor should be a different user"
                                });
                                return false;
                            } else if (model.auditInfo.start_date != model.auditInfoOriginal.start_date || model.auditInfo.end_date != model.auditInfoOriginal.end_date) {
                                PageHelper.setError({
                                    message: "Start date/end date should be same"
                                });
                                return false;
                            }
                        }
                        model.auditInfo.next_stage = nextStage;
                        model.auditInfo.audit_type = 1;
                        model.auditInfo.status = "S";
                        PageHelper.showLoader();
                        Audit.online.updateAuditInfo(model.auditInfo).$promise.then(function(res) {
                            model.auditInfo = res;
                            PageHelper.showProgress("Audit", "Successfully scheduled", 3000);
                            irfNavigator.goBack();
                        }, function(errRes) {
                            PageHelper.showErrors(errRes);
                        }).finally(function() {
                            PageHelper.hideLoader();
                        });
                    });
                },
                cancelRequest: function(model, form, formCtrl) {
                    PageHelper.clearErrors();
                    formHelper.validate(formCtrl).then(function() {
                        if (!validateDates(model)) return;
                        var auditInfoToCancel = _.cloneDeep(model.auditInfoOriginal);
                        auditInfoToCancel.next_stage = "scheduled";
                        auditInfoToCancel.message = model.auditInfo.message;
                        PageHelper.showLoader();
                        Audit.online.updateAuditInfo(auditInfoToCancel).$promise.then(function(res) {
                            model.auditInfo = res;
                            PageHelper.showProgress("Audit", "Reschedule request cancelled successfully", 3000);
                            irfNavigator.goBack();
                        }, function(errRes) {
                            PageHelper.showErrors(errRes);
                        }).finally(function() {
                            PageHelper.hideLoader();
                        });
                    });
                },
                getUsername: function(userId) {
                    return User.offline.getDisplayName(userId);
                },
                getStageTitle: function(model, arrayIndex) {
                    var preStage = model.auditInfo.messages.length - 1 == arrayIndex ? '' : model.auditInfo.messages[arrayIndex + 1].type;
                    var postStage = model.auditInfo.messages[arrayIndex].type;
                    preStage = preStage ? translateFilter(model.master.stages[preStage].stage_label) || preStage : '*';
                    postStage = translateFilter(model.master.stages[postStage].stage_label) || postStage;
                    return preStage == '*' ? postStage : preStage + ' ⤑ ' + postStage; // &DDotrahd;
                }
            }
        };
    }
]);