irf.pageCollection.factory(irf.page("audit.detail.ScoreSheet"), ["$log", "PageHelper", "Audit", "$stateParams", "irfNavigator", "SessionStore",
    function($log, PageHelper, Audit, $stateParams, irfNavigator, SessionStore) {
        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "AUDIT_SCORE_SHEET",
            initialize: function(model, form, formCtrl) {
                if (!$stateParams.pageId) {
                    irfNavigator.goBack();
                    return;
                }
                $stateParams.pageData = $stateParams.pageData || {};
                if (typeof($stateParams.pageData.readonly) == 'undefined') {
                    $stateParams.pageData.readonly = true;
                }
                var self = this;
                var master = Audit.offline.getAuditMaster();
                model.audit_scoresheet_data = model.audit_scoresheet_data || {};
                self.form = [];
                var processScoreSheetForm = function(response) {
                    model.audit_scoresheet_data = response;
                    var moduleMap = {};

                    var auditScoreSheetForm = [];
                    for (i in model.audit_scoresheet_data.audit_score) {
                        var v = model.audit_scoresheet_data.audit_score[i];
                        v.module_name = master.modules[v.module_id].module_name;
                        v.sub_module_name = master.sub_modules[v.sub_module_id].sub_module_name;
                        var scoreTitleMap = [];
                        var scoreEnum = master.scoresheet_values[v.sub_module_id];
                        for (j in scoreEnum) {
                            scoreTitleMap.push({
                                "name": scoreEnum[j],
                                "value": scoreEnum[j] == "Not Applicable"? -1: scoreEnum[j]
                            });
                        }
                        auditScoreSheetForm.push({
                            "type": "section",
                            "htmlClass": "row",
                            "items": [{
                                "type": "section",
                                "htmlClass": "col-sm-3",
                                "items": [{
                                    "key": "audit_scoresheet_data.audit_score["+i+"].module_name",
                                    "notitle": true,
                                    "readonly": true
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-4",
                                "items": [{
                                    "key": "audit_scoresheet_data.audit_score["+i+"].sub_module_name",
                                    "notitle": true,
                                    "readonly": true
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-3",
                                "items": [{
                                    "key": "audit_scoresheet_data.audit_score["+i+"].awarded_score",
                                    "type": "select",
                                    "notitle": true,
                                    "titleMap": scoreTitleMap
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-2",
                                "items": [{
                                    "key": "audit_scoresheet_data.audit_score["+i+"].help_text",
                                    "readonly": true,
                                    "notitle": true
                                }]
                            }]
                        });
                    }
                    var boxItems = [{
                        "type": "section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-sm-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'MODULE'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-4",
                            "items": [{
                                "type": "section",
                                "html": "{{'SUB_MODULE'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'SCORE'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-2",
                            "items": [{
                                "type": "section",
                                "html": "{{'DESCRIPTION'|translate}}"
                            }]
                        }]
                    }];
                    boxItems.push.apply(boxItems, auditScoreSheetForm);
                    boxItems.push.apply(boxItems, [{
                        "type": "section",
                        "html": '<hr>'
                    }, {
                        "key": "audit_scoresheet_data.comments",
                        "type": "textarea",
                        "title": "COMMENTS"
                    }]);
                    self.form = [{
                        "type": "box",
                        "title": "MANUAL_SCORES",
                        "colClass": "col-sm-12",
                        "readonly": $stateParams.pageData.readonly,
                        "items": boxItems
                    }];
                    if (!$stateParams.pageData.readonly) {
                            self.form.push({
                            "type": "actionbox",
                            "items": [{
                                "type": "button",
                                "title": "UPDATE",
                                "onClick": "actions.update(model, form, formName)"
                            }]
                        });
                    }
                };
                model.$isOffline = false;
                if ($stateParams.pageData && $stateParams.pageData.auditData && $stateParams.pageData.auditData.audit_scoresheet_data) {
                    processScoreSheetForm($stateParams.pageData.auditData.audit_scoresheet_data);
                } else {
                    Audit.offline.getAuditScoreSheet($stateParams.pageId).then(function(res) {
                        model.$isOffline = true;
                        processScoreSheetForm(res);
                    }, PageHelper.showErrors).finally(PageHelper.hideLoader);
                }
            },
            form: [],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "audit_scoresheet_data": {
                        "type": "string"
                    }
                },
            },
            actions: {
                update: function(model, form, formName) {
                    if (model.$isOffline) {
                        Audit.offline.setAuditScoreSheet($stateParams.pageId, model.audit_scoresheet_data).then(function(res) {
                            PageHelper.showProgress("Audit", "Scoresheet successfully updated", 3000)
                            irfNavigator.goBack();
                        }, PageHelper.showErrors).finally(PageHelper.hideLoader);
                    } else {
                        irfNavigator.goBack();
                    }
                }
            }
        };
    }
]);