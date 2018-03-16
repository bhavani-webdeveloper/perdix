define({
    pageUID: "management.audit.AuditStageActivities",
    pageType: "Engine",
    dependencies: ["$log", "SessionStore", "PageHelper", "RolesPages", "formHelper", "Audit", "Utils"],
    $pageFn: function($log, SessionStore, PageHelper, RolesPages, formHelper, Audit, Utils) {
        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "AUDIT_STAGE_MAPPING",
            initialize: function(model, form, formCtrl) {
                model.stagemap = model.stagemap || {};
                model.stagemap.activities = [];
            },
            form: [{
                "type": "box",
                "title": "AUDIT_STAGE_MAPPING",
                "items": [{
                    key: "stagemap.stage_name",
                    type: "lov",
                    "title": "STAGE_NAME",
                    lovonly: true,
                    outputMap: {
                        "stage_id": "stagemap.stage_id",
                        "stage_name": "stagemap.stage_name",
                        "stage_type": "stagemap.stage_type",
                        "tat_days": "stagemap.tat_days",
                        "stage_order": "stagemap.stage_order"
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
                    },
                    onSelect: function(result, model, context) {
                        Audit.online.getStageActivities({
                                staging_id: model.stagemap.stage_id
                            }).$promise.then(function(res) {
                                model.stagemap.activities = res.body;
                            }, function(httpRes) {
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                    }
                }, {
                    "key": "stagemap.activities",
                    "title": "ACTIVITIES",
                    "type": "array",
                    "condition": "model.stagemap.stage_id",
                    "items": [{
                        key: "stagemap.activities[].activity_name",
                        type: "lov",
                        "title": "ACTIVITY_NAME",
                        lovonly: true,
                        outputMap: {
                            "stage_id": "stagemap.stage_id",
                            "stage_name": "stagemap.stage_name",
                            "stage_type": "stagemap.stage_type",
                            "tat_days": "stagemap.tat_days",
                            "stage_order": "stagemap.stage_order"
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
                        },
                        onSelect: function(result, model, context) {
                            model.stagemap.activities = result;
                        }
                    }, {
                        key: "stagemap.activities[].exec_order",
                        title: "EXEC_ORDER",
                        required: true
                    }, {
                        key: "stagemap.activities[].config",
                        title: "CONFIG",
                        type: "string",
                        required: true
                    }]
                }]
            }, {
                type: "actionbox",
                condition: "model.stagemap.stage_id",
                items: [{
                    type: "submit",
                    title: "UPDATE_STAGE_MAPPING"
                }]
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "stagemap": {
                        "type": "object",
                        "properties": {
                            "activities": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "activity_id": {
                                            "type": "number",
                                            "title": "ACTIVITY_ID"
                                        },
                                        "activity_name": {
                                            "type": ["string", "null"],
                                            "title": "ACTIVITY_NAME"
                                        },
                                        "exec_order": {
                                            "type": "number",
                                            "title": "EXEC_ORDER"
                                        },
                                        "config": {
                                            "type": ["string", "null"],
                                            "title": "COMMENTS"
                                        }
                                    }
                                }
                            },
                            "stage_id": {
                                "type": "number",
                                "title": "Stage ID"
                            },
                            "stage_name": {
                                "type": "string",
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
                        Audit.online.updateStageActivities(model.stagemap).$promise.then(function(resp) {
                            PageHelper.showProgress("audit_stage", "Stage Mapping updated ", 3000);
                            model.stagemap = '';
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
})