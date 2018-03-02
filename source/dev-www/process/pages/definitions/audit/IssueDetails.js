irf.pageCollection.factory(irf.page("audit.IssueDetails"),
["irfNavigator", "Audit", "$stateParams", "SessionStore", "PageHelper", "User",
    function(irfNavigator, Audit, $stateParams, SessionStore, PageHelper, User) {
        return {
            "type": "schema-form",
            "title": "ISSUE_DETAILS",
            initialize: function(model, form, formCtrl) {
                model.auditIssue = model.auditIssue || {};
                var master = Audit.offline.getAuditMaster();
                var self = this;
                $stateParams.pageData = $stateParams.pageData || {};
                model.readonly = $stateParams.pageData.readonly !== false;
                model.type = $stateParams.pageData.type;
                if ($stateParams.pageId) {
                    PageHelper.showLoader();
                    Audit.online.getIssueDetails({
                        issue_id: $stateParams.pageId
                    }).$promise.then(function(res) {
                        model.auditIssue = res;
                        var optionData = res.options;
                        if (optionData.type == "dropdown") {
                            model.auditIssue.option = optionData.type_of_issue_options[0].option_label;
                        };
                        model.type_of_issue_id = model.auditIssue.type_of_issue_id;
                        model.auditIssue.title = master.typeofissues[model.type_of_issue_id].description;
                        model.auditIssue.branch_name = master.branch_name[res.branch_id].node_code;
                    }, function(errorResponse) {
                        PageHelper.showErrors(errorResponse);
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });
                } else {
                    irfNavigator.goBack();
                    return;
                }
                model.actions = self.actions;
            },
            form: [{
                "type": "box",
                "title": "ISSUE_DETAILS",
                "items": [{
                    key: "auditIssue.branch_name",
                    type: "string",
                    "readonly": true
                }, {
                    key: "auditIssue.id",
                    "title": "ISSUE_ID",
                    "readonly": true
                }, {
                    "key": "auditIssue.title",
                    "title": "ISSUE",
                    "type": "html",
                    "readonly": true
                }, {
                    "key": "auditIssue.option",
                    "title": "OPTION",
                    "readonly": true
                }, {
                    "key": "auditIssue.deviation",
                    "title": "AUDITOR_DEVIATION",
                    "readonly": true
                }, {
                    key: "auditIssue.closed_on",
                    type: "date",
                    "readonly": true
                }, {
                    key: "auditIssue.closed_by",
                    "readonly": true
                }, {
                    key: "auditIssue.audit_report_date",
                    type: "date",
                    "readonly": true
                }, {
                    "key": "auditIssue.latitude",
                    "title": "LOCATION",
                    "type": "geotag",
                    "readonly": true,
                    "latitude": "auditIssue.latitude",
                    "longitude": "auditIssue.longitude"
                }, {
                    key: "auditIssue.document_id",
                    type: "file",
                    fileType: "application/pdf",
                    using: "scanner",
                    title: "DOCUMENT",
                    "category": "Audit",
                    "subCategory": "AUDITISSUEDOC",
                    "readonly": true
                }, {
                    key: "auditIssue.draft_document_id",
                    "condition": "!model.readonly && model.type == 'operation'",
                    type: "file",
                    fileType: "application/pdf",
                    using: "scanner",
                    title: "DRAFT_DOCUMENT",
                    "category": "Audit",
                    "subCategory": "AUDITISSUEDRAFTDOC"
                }, {
                    key: "auditIssue.draft_document_id",
                    "condition": "model.readonly || model.type == 'audit'",
                    type: "file",
                    fileType: "application/pdf",
                    using: "scanner",
                    title: "DRAFT_DOCUMENT",
                    "category": "Audit",
                    "subCategory": "AUDITISSUEDRAFTDOC",
                    "readonly": true
                }, {
                    "key": "auditIssue.confirmity_status",
                    "title": "STATUS",
                    "condition": "!model.readonly && model.type=='audit' && model.auditIssue.status == 'X'",
                    "type": "radios",
                    "titleMap": [{
                        "name": "Confirm",
                        "value": 1
                    }, {
                        "name": "Unconfirm",
                        "value": 2
                    }]
                }, {
                    "key": "auditIssue.confirmity_status",
                    "title": "STATUS",
                    "condition": "model.readonly || model.type!='audit'",
                    "type": "radios",
                    "titleMap": [{
                        "name": "Confirmed",
                        "value": 1
                    }, {
                        "name": "Unconfirmed",
                        "value": 2
                    }],
                    "readonly": true
                }, {
                    type: "textarea",
                    key: "auditIssue.comments",
                    "condition": "model.actions.showComments(model, true)",
                    "readonly": true
                }, {
                    type: "textarea",
                    key: "auditIssue.comments",
                    "condition": "model.actions.showComments(model, false)"
                }]
            }, {
                "type": "box",
                "title": "MESSAGE_HISTORY",
                "items": [{
                    "key": "auditIssue.messages",
                    "type": "array",
                    "add": null,
                    "remove": null,
                    "view": "fixed",
                    "titleExpr": "actions.getStageTitle(model.auditIssue.messages[arrayIndex].stage)",
                    "items": [{
                        "type": "section",
                        "htmlClass": "",
                        "html": '<i class="fa fa-user text-gray">&nbsp;</i> {{model.actions.getUsername(model.auditIssue.messages[arrayIndex].created_id)}}\
                        <br><i class="fa fa-clock-o text-gray">&nbsp;</i> {{model.auditIssue.messages[arrayIndex].created_on}}\
                        <br><i class="fa fa-commenting text-gray">&nbsp;</i> <strong>{{model.auditIssue.messages[arrayIndex].comment}}</strong><br>'
                    }]
                }]
            }, {
                "type": "actionbox",
                "condition": "!model.readonly && model.type=='audit' && model.auditIssue.status=='X'",
                "items": [{
                    "type": "button",
                    "title": "UPDATE_ISSUE",
                    "onClick": "actions.updateIssue(model, formCtrl, form, 'assign')"
                }]
            }, {
                "type": "actionbox",
                "condition": "!model.readonly && model.type=='operation' && (model.auditIssue.status == 'A' || model.auditIssue.status == 'P')",
                "items": [{
                    "type": "button",
                    "title": "CLOSE",
                    "onClick": "actions.updateIssue(model, formCtrl, form , 'close')"
                }]
            }, {
                "type": "actionbox",
                "condition": "!model.readonly && model.type == 'operation' && model.auditIssue.status=='DO'",
                "items": [{
                    "type": "button",
                    "title": "UPDATE_ISSUE",
                    "onClick": "actions.updateIssue(model, formCtrl, form, 'update')"
                }, {
                    "type": "button",
                    "title": "ACCEPT",
                    "onClick": "actions.updateIssue(model, formCtrl, form, 'accept')"
                }, {
                    "type": "button",
                    "title": "REJECT",
                    "onClick": "actions.updateIssue(model, formCtrl, form, 'reject')"
                }]
            }, {
                "type": "actionbox",
                "condition": "!model.readonly && model.type == 'audit' && model.auditIssue.status=='DR'",
                "items": [{
                    "type": "button",
                    "title": "UPDATE_ISSUE",
                    "onClick": "actions.updateIssue(model, formCtrl, form, 'update')"
                }, {
                    "type": "button",
                    "title": "ACCEPT",
                    "onClick": "actions.updateIssue(model, formCtrl, form, 'draftAccept')"
                }, {
                    "type": "button",
                    "title": "REJECT",
                    "onClick": "actions.updateIssue(model, formCtrl, form, 'draftReject')"
                }]
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "auditIssue": {
                        "type": "object",
                        "properties": {
                            "type_of_issue_id": {
                                "type": "string",
                                "title": "ISSUE_TYPE"
                            },
                            "description": {
                                "type": "string",
                                "title": "ISSUE"
                            },
                            "branch_name": {
                                "type": "string",
                                "title": "BRANCH_NAME"
                            },
                            "closed_on": {
                                "type": "string",
                                "title": "CLOSED_ON"
                            },
                            "closed_by": {
                                "type": "string",
                                "title": "CLOSED_BY"
                            },
                            "audit_report_date": {
                                "type": "string",
                                "title": "AUDIT_REPORT_DATE"
                            },
                            "comments": {
                                "type": "string",
                                "title": "COMMENTS"
                            },
                            "created_on": {
                                "type": "string",
                                "title": "POSTED_ON"
                            }

                        }
                    }
                }
            },
            actions: {
                showComments: function(model, readonly) {
                    if (!model.readonly) {
                        if (model.auditIssue.status.startsWith('D')
                            || (model.type == 'operation' && (model.auditIssue.status == 'A' || model.auditIssue.status == 'P'))
                            || (model.type == 'audit' && model.auditIssue.confirmity_status != 1)) {
                            return !readonly;
                        } else {
                            return readonly;
                        }
                    } else {
                        return readonly;
                    }
                },
                updateIssue: function(model, form, formName, actionType) {
                    PageHelper.showLoader();
                    if (actionType == 'close') {
                        model.auditIssue.close_message = model.auditIssue.comments;
                        model.auditIssue.status = 'X';
                        model.auditIssue.next_stage = 'close';
                        model.auditIssue.closed_by = SessionStore.getLoginname();
                        model.auditIssue.closed_on = moment().format('YYYY-MM-DD HH:mm:ss');
                    } else if (actionType == 'assign') {
                        if (model.auditIssue.confirmity_status == 2) {
                            model.auditIssue.status = 'A';
                            model.auditIssue.next_stage = 'assign';
                        }
                    } else if (model.auditIssue.status == 'DO' && model.type == 'operation') {
                        if (actionType == 'accept') {
                            model.auditIssue.status = 'DA';
                            model.auditIssue.next_stage = 'draftaccept';
                        } else if (actionType == 'reject') {
                            model.auditIssue.status = 'DR';
                            model.auditIssue.next_stage = 'draftreject';
                        }
                    } else if (model.auditIssue.status == 'DR' && model.type == 'audit') {
                        if (actionType == 'draftAccept') {
                            model.auditIssue.status = 'DRA';
                            model.auditIssue.next_stage = 'draftrejectaccept';
                        } else if (actionType == 'draftReject') {
                            model.auditIssue.status = 'DRR';
                            model.auditIssue.next_stage = 'draftrejectreject';
                        }
                    }
                    Audit.online.updateIssueDetails(model.auditIssue).$promise.then(function(res) {
                        PageHelper.showProgress("audit", "Issue Updated Successfully.", 3000);
                        irfNavigator.goBack();
                    }, PageHelper.showErrors).finally(PageHelper.hideLoader);
                },
                getStageTitle: function(stage) {
                    return _.capitalize(stage)
                },
                getUsername: function(userId) {
                    return User.offline.getDisplayName(userId);
                }
            }
        };
    }
]);