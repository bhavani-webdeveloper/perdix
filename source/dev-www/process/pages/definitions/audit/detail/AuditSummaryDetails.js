irf.pageCollection.factory(irf.page("audit.detail.AuditSummaryDetails"),
["$log", "$state", "irfNavigator", "$stateParams", "$http", "Audit", "PageHelper", "$q", "elementsUtils", "formHelper", "User",
function($log, $state, irfNavigator, $stateParams, $http, Audit, PageHelper, $q, elementsUtils, formHelper, User) {
    return {
        "type": "schema-form",
        "title": "AUDIT_SUMMARY_DETAILS",
        initialize: function(model, form, formCtrl) {
            var self = this;
            if (!$stateParams.pageId || $stateParams.pageId.split(':').length != 2) {
                irfNavigator.goBack();
                return;
            }
            $stateParams.pageData = $stateParams.pageData || {};
            if (typeof($stateParams.pageData.readonly) == 'undefined') {
                $stateParams.pageData.readonly = true;
            }
            var master = Audit.offline.getAuditMaster();
            var auditId = Number($stateParams.pageId.split(':')[0]);
            var summaryId = Number($stateParams.pageId.split(':')[1]);
            self.form = [];
            var processSummaryDetails = function(response) {
                model.audit_summary = response;
                model.auditId = auditId;
                model.master = master;
                for (i in model.audit_summary) {
                    if (model.audit_summary[i].audit_summary_id == summaryId) {
                        model.audit_summary_details = model.audit_summary[i];
                        break;
                    }
                }
                var observationStatusTitleMap = [];
                _.forOwn(master.summary_observation_status, function(v, k) {
                    observationStatusTitleMap.push({
                        "name": v.name,
                        "value": v.id
                    });
                });
                var observationClassificationTitleMap = [];
                _.forOwn(master.observation_classification, function(v, k) {
                    observationClassificationTitleMap.push({
                        "name": v.name,
                        "value": v.id
                    });
                });
                var summaryRatingTitleMap = [];
                _.forOwn(master.summary_rating, function(v, k) {
                    summaryRatingTitleMap.push({
                        "name": v.name + " (" + v.from + " - " + v.to + ")",
                        "value": v.id
                    });
                });
                var observationRatingTitleMap = [];
                _.forOwn(master.summary_weightage, function(v, k) {
                    observationRatingTitleMap.push({
                        "name": v.name + " (" + v.weightage + ")",
                        "value": v.id
                    });
                });
                self.form = [{
                    "type": "box",
                    "readonly": $stateParams.pageData.readonly,
                    "title": "AUDIT_SUMMARY_DETAILS",
                    "items": [{
                        "key": "audit_summary_details.audit_summary_id",
                        "title": "SUMMARY_ID",
                        "readonly": true
                    }, {
                        "key": "master.process["+ model.audit_summary_details.process_id +"].process_name",
                        "title": "PROCESS",
                        "readonly": true
                    }, {
                        "key": "master.subprocess["+ model.audit_summary_details.process_id +"].sub_process_name",
                        "title": "SUB_PROCESS",
                        "readonly": true
                    }, {
                        "key": "audit_summary_details.review_type",
                        "title": "REVIEW_TYPE",
                        "readonly": true
                    }, {
                        "key": "audit_summary_details.audit_parameter",
                        "title": "PARAMETER",
                        "type": "textarea",
                        "readonly": true
                    }, {
                        "key": "audit_summary_details.pass",
                        "title": "SAMPLES_PASS",
                        "readonly": true
                    }, {
                        "key": "audit_summary_details.fail",
                        "title": "SAMPLES_FAIL",
                        "readonly": true
                    }, {
                        "key": "audit_summary_details.tested",
                        "title": "SAMPLES_TESTED",
                        "readonly": true
                    }, {
                        "key": "audit_summary_details.risk_involved",
                        "title": "RISK_INVOLVED",
                        "type": "textarea",
                        "readonly": true
                    }, {
                        "key": "audit_summary_details.risk_classification",
                        "title": "RISK_CLASSIFICATION",
                        "readonly": true
                    }, {
                        "key": "audit_summary_details.observation_status",
                        "title": "OBS_STATUS",
                        "type": "select",
                        "titleMap": observationStatusTitleMap,
                        "readonly": $stateParams.pageData.readonly || model.audit_summary_details.review_type == "TEST_BASED",
                        "required": !$stateParams.pageData.readonly && model.audit_summary_details.review_type == "ANALYTICAL_BASED"
                    }, {
                        "key": "audit_summary_details.observation_classification",
                        "type": "select",
                        "title": "OBS_CLASSIFICATION",
                        "titleMap": observationClassificationTitleMap,
                        "required": true
                    }, {
                        "key": "audit_summary_details.observation_details",
                        "title": "OBS_DETAILS",
                        "type": "textarea",
                        "required": true
                    }, {
                        "key": "audit_summary_details.observation_rating",
                        "title": "OBS_RATING",
                        "type": "select",
                        "titleMap": observationRatingTitleMap,
                        "readonly": $stateParams.pageData.readonly || model.audit_summary_details.review_type == "TEST_BASED",
                        "required": !$stateParams.pageData.readonly && model.audit_summary_details.review_type == "ANALYTICAL_BASED"
                    }, {
                        "key": "audit_summary_details.recommendation",
                        "title": "RECOMMENDATION",
                        "type": "textarea",
                        "required": true
                    }, {
                        "key": "audit_summary_details.auditee_response",
                        "title": "AUDITEE_RESPONSE",
                        "type": "textarea"
                    }]
                }];

                if (!$stateParams.pageData.readonly) {
                    self.form.push({
                        "type": "actionbox",
                        "items": [{
                            "type": "submit",
                            "title": "UPDATE"
                        }]
                    });
                }
            };

            model.$isOffline = false;
            if ($stateParams.pageData.auditData && $stateParams.pageData.auditData.audit_summary) {
                processSummaryDetails($stateParams.pageData.auditData.audit_summary);
            } else {
                PageHelper.showLoader();
                Audit.offline.getAuditSummary(auditId).then(function(response) {
                    model.$isOffline = true;
                    processSummaryDetails(response);
                }, PageHelper.showErrors).finally(PageHelper.hideLoader);
            }
        },
        form: [],
        schema: {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "audit_summary_details": {
                    "type": "object",
                    "properties": {
                        "review_type": {
                            "type": "string",
                            "enum": ["TEST_BASED", "ANALYTICAL_BASED"],
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                        "risk_classification": {
                            "type": "string",
                            "enum": ["HIGH", "MEDIUM", "LOW"],
                            "x-schema-form": {
                                "type": "select"
                            }
                        }
                    }
                }
            }
        },
        actions: {
            submit: function(model, formCtrl, form, $event) {
                if (model.$isOffline) {
                    PageHelper.showLoader();
                    Audit.offline.setAuditSummary(model.auditId, model.audit_summary).then(function() {
                        PageHelper.showProgress('audit', 'Summary updated successfully', 3000);
                        irfNavigator.goBack();
                    }, PageHelper.hideLoader).finally(PageHelper.showErrors);
                } else {
                    PageHelper.showProgress('audit', 'Summary updated successfully', 3000);
                    irfNavigator.goBack();
                }
            }
        }
    };
}]);