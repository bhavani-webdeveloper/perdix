define({
    pageUID: "management.audit.AuditStage",
    pageType: "Engine",
    dependencies: ["$log", "SessionStore", "PageHelper", "RolesPages", "formHelper", "Audit", "Utils"],
    $pageFn: function($log, SessionStore, PageHelper, RolesPages, formHelper, Audit, Utils) {
        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "AUDIT_STAGE",
            initialize: function(model, form, formCtrl) {
                model.auditStage = model.auditStage || {};
            },
            form: [{
                "type": "box",
                "title": "CREATE/UPDATE_STAGE",
                "items": [{
                    key: "auditStage.stage_id",
                    type: "lov",
                    "title": "STAGE_ID",
                    lovonly: true,
                    outputMap: {
                        "stage_id": "auditStage.stage_id",
                        "stage_name": "auditStage.stage_name",
                        "stage_type": "auditStage.stage_type",
                        "tat_days": "auditStage.tat_days",
                        "stage_order": "auditStage.stage_order",
                        "stage_label": "auditStage.stage_label",
                    },
                    searchHelper: formHelper,
                    search: function(inputModel, form, model) {
                        return Audit.online.findStage().$promise;
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.stage_order + ': ' + item.stage_name,
                            item.stage_label,
                            item.stage_type
                        ];
                    }
                }, {
                    key: "auditStage.stage_name",
                    condition: "model.auditStage.stage_id",
                    title: "STAGE_NAME",
                    readonly: true
                }, {
                    key: "auditStage.stage_name",
                    condition: "!model.auditStage.stage_id",
                    title: "STAGE_NAME",
                    required: true
                }, {
                    key: "auditStage.stage_label",
                    title: "STAGE_LABEL",
                    required: true
                }, {
                    key: "auditStage.stage_type",
                    title: "PROCESS",
                    "type": "radios",
                    "titleMap": {
                        "AUDIT": "Audit",
                        "ISSUE": "Issue"
                    },
                    required: true
                }, {
                    key: "auditStage.tat_days",
                    title: "TAT_DAYS",
                    required: true
                }, {
                    key: "auditStage.stage_order",
                    title: "STAGE_ORDER",
                    // required: true
                }]
            }, {
                type: "actionbox",
                condition: "!model.auditStage.stage_id",
                items: [{
                    type: "submit",
                    title: "ADD_STAGE"
                }]
            }, {
                type: "actionbox",
                condition: "model.auditStage.stage_id",
                items: [{
                    type: "submit",
                    title: "UPDATE_STAGE"
                }, {
                    type: "button",
                    icon: "fa fa-refresh",
                    style: "btn-default",
                    title: "RESET",
                    onClick: function(model) {
                        model.auditStage = {};
                    }
                }]
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "auditStage": {
                        "type": "object",
                        "properties": {
                            "stage_id": {
                                "type": "number",
                                "title": "Stage ID"
                            },
                            "stage_name": {
                                "type": "string",
                                "title": "Stage Name"
                            },
                            "tat_days": {
                                "type": "number",
                                "title": "Stage Name"
                            }
                        }
                    }
                }
            },
            actions: {
                submit: function(model, form, formName) {
                    Utils.confirm('Are you sure?').then(function() {
                        PageHelper.clearErrors();
                        PageHelper.showLoader();
                        Audit.online.updateStage(model.auditStage).$promise.then(function(resp) {
                            PageHelper.showProgress("audit_stage", "Audit stage created/updated", 3000);
                            model.auditStage = '';
                        }, function(err) {
                            PageHelper.showErrors(err);
                        }).finally(function() {
                            PageHelper.hideLoader();
                        });
                    });
                }
            }
        };
    }
});