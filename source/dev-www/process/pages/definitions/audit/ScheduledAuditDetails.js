irf.pageCollection.factory(irf.page("audit.ScheduledAuditDetails"), ["$log", "PageHelper", "User", "translateFilter", "irfNavigator", "formHelper", "Audit", "$stateParams",
    function($log, PageHelper, User, translateFilter, irfNavigator, formHelper, Audit, $stateParams) {
        return {
            "type": "schema-form",
            "title": "SCHEDULED_AUDIT_DETAILS",
            initialize: function(model, form, formCtrl) {
                if (typeof($stateParams.pageData.readonly) == 'undefined') {
                    $stateParams.pageData.readonly = true;
                }
                model.master = Audit.offline.getAuditMaster();
                model.auditInfo = model.auditInfo || {};
                model.readonly = $stateParams.pageData.readonly;
                if ($stateParams.pageId) {
                    PageHelper.showLoader();
                    Audit.online.getAuditInfo({
                        audit_id: $stateParams.pageId
                    }).$promise.then(function(res) {
                        model.auditInfo = res;
                        PageHelper.setWarning({
                            message: model.auditInfo.days_left + " days left to start"
                        });
                        model.startable = moment().isBetween(moment(model.auditInfo.start_date, 'YYYY-MM-DD'), moment(model.auditInfo.end_date, 'YYYY-MM-DD'), 'days', '[]');
                    }, function(errRes) {
                        PageHelper.showErrors(errRes);
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });
                } else {
                    irfNavigator.goBack();
                    return;
                };
                model.actions = this.actions;
            },
            form: [{
                "type": "box",
                "title": "SCHEDULED_AUDIT_DETAILS",
                "items": [{
                    key: "auditInfo.audit_id",
                    title: "AUDIT_ID",
                    readonly: true
                }, {
                    key: "auditInfo.branch_id",
                    type: "select",
                    readonly: true
                }, {
                    key: "auditInfo.report_date",
                    type: "date",
                    readonly: true
                }, {
                    key: "auditInfo.start_date",
                    type: "date",
                    readonly: true
                }, {
                    key: "auditInfo.end_date",
                    type: "date",
                    readonly: true
                }, {
                    key: "auditInfo.message",
                    "condition": "!model.readonly && !model.startable",
                    title: "COMMENTS",
                    type: "textarea",
                    "required": true
                }, {
                    key: "auditInfo.message",
                    "condition": "!model.readonly && model.startable",
                    title: "COMMENTS",
                    type: "textarea"
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
                    "title": "",
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
                "condition": "!model.readonly && !model.startable",
                "items": [{
                    type: "button",
                    title: "REQUEST_RESCHEDULE",
                    onClick: "actions.update(model, form, formCtrl, 'postpone')"
                }, {
                    type: "button",
                    title: "REQUEST_CANCEL",
                    onClick: "actions.update(model, form, formCtrl, 'cancel')"
                }]
            }, {
                "type": "actionbox",
                "condition": "!model.readonly && model.startable",
                "items": [{
                    title: "START_AUDIT",
                    type: "button",
                    onClick: "actions.update(model, form, formCtrl, 'start')"
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
                            "start_date": {
                                "type": "string",
                                "title": "START_DATE"
                            },
                            "end_date": {
                                "type": "string",
                                "title": "END_DATE"
                            },
                            "report_date": {
                                "type": "string",
                                "title": "REPORT_DATE"
                            },
                            "branch_id": {
                                "title": "BRANCH_NAME",
                                "type": "integer",
                                "x-schema-form": {
                                    "type": "select"
                                },
                                "enumCode": "branch_id",
                                "required": true
                            }
                        }
                    }
                },
            },
            actions: {
                update: function(model, form, formCtrl, nextStage) {
                    formHelper.validate(formCtrl).then(function() {
                        PageHelper.showLoader();
                        model.auditInfo.next_stage = nextStage;
                        Audit.online.updateAuditInfo(model.auditInfo).$promise.then(function(res) {
                            model.auditInfo = res;
                            PageHelper.showProgress("audit", _.upperFirst(nextStage) + " request submitted successfully.", 3000);
                            irfNavigator.goBack();
                        }, function(errRes) {
                            PageHelper.showErrors(errRes)
                        }).finally(function() {
                            PageHelper.hideLoader();
                        })
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