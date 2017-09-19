irf.pageCollection.factory(irf.page("audit.detail.SnapAuditDetails"), ["$log", "PageHelper", "$q", "Utils", "Audit", "formHelper", "$state", "$stateParams", "irfNavigator", "SessionStore",
    function($log, PageHelper, $q, Utils, Audit, formHelper, $state, $stateParams, irfNavigator, SessionStore) {
        return {
            "type": "schema-form",
            "title": "SNAP_AUDIT_DETAILS",
            initialize: function(model, form, formCtrl) {
                PageHelper.showLoader();
                model.snap_audit_data = model.snap_audit_data || [];
                model.snap_audit_info = model.snap_audit_info || {};
                model.masters = Audit.offline.getAuditMaster() || {};
                var self = this;
                if (!$stateParams.pageId) {
                    irfNavigator.goBack();
                    return;
                }
                self.form = [];
                var init = function(response) {
                    model.snap_audit = response;
                    model.snap_audit_data = response.snap_audit_data;
                    model.snap_audit_info = response.snap_audit_info;
                    model.audit_id = $stateParams.pageId;
                    var snapAuditDetails = [];
                    for (i in model.snap_audit_data) {
                        var saaid = model.snap_audit_data[i].snap_audit_area_id;
                        var snap_audit_data = model.snap_audit_data[i];
                        snapAuditDetails.push({
                            "type": "section",
                            "htmlClass": "row",
                            "items": [{
                                "type": "section",
                                "htmlClass": "col-sm-6",
                                "items": [{
                                    "key": "snap_audit_data[" + i + "].description",
                                    "type": "string",
                                    "readonly": true
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-6",
                                "items": [{
                                    "key": "snap_audit_data[" + i + "].observations",
                                    "type": "string"
                                }]
                            }]
                        });

                    };

                    self.form = [{
                        "type": "box",
                        "title": "SNAP_AUDIT_DATA",
                        "items": snapAuditDetails
                    }, {
                        "type": "box",
                        "title": "SNAP_AUDIT_INFORMATION",
                        "items": [{
                            "key": "snap_audit_info.audit_id",
                            "type": "string",
                            "readonly": true,
                        }, {
                            "key": "snap_audit_info.auditor_id",
                            "type": "string",
                            "readonly": true,
                        }, {
                            "key": "snap_audit_info.branch_id",
                            "type": "select",
                            "readonly": true,
                        }, {
                            "key": "snap_audit_info.start_date",
                            "type": "date",
                            "readonly": true,
                        }, {
                            "key": "snap_audit_info.end_date",
                            "type": "date",
                            "readonly": true,
                        }]
                    }, {
                        type: "actionbox",
                        items: [{
                            type: "submit",
                            title: "SAVE"
                        }]
                    }];
                };

                Audit.online.getSnapAuditData({
                    audit_id: $stateParams.pageId
                }).$promise.then(function(res) {
                    PageHelper.hideLoader();
                    init(res)
                }, function(errRes) {
                    PageHelper.showErrors(errRes);
                }).finally(function() {
                    PageHelper.hideLoader();
                });
            },

            form: [],

            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "snap_audit_info": {
                        "type": "object",
                        "properties": {
                            "branch_id": {
                                "title": "BRANCH_NAME",
                                "type": "integer",
                                "enumCode": "branch_id",
                                "x-schema-form": {
                                    "type": "select"
                                }
                            },
                            "audit_id": {
                                "type": ["number", "null"],
                                "title": "AUDIT_ID"
                            },
                            "auditor_id": {
                                "type": ["string", "null"],
                                "title": "AUDIT_NAME"
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
                    }
                }
            },
            actions: {
                submit: function(model, form, formName) {
                    PageHelper.clearErrors();
                    PageHelper.showLoader();
                    var reqData = model.snap_audit;                    
                    Audit.online.updateSnapAudit(reqData.snap_audit_data).$promise.then(function(res) {
                        model.snap_audit_data = res.snap_audit_data;
                        PageHelper.showProgress("auditId", "Snap Audit Updated Successfully.", 3000);
                        irfNavigator.goBack();
                    }, function(errRes) {
                        PageHelper.showErrors(errRes);
                    }).finally(function() {
                        PageHelper.hideLoader();
                    })
                },
                goBack: function(model, form, formName) {
                    irfNavigator.goBack();
                },
            }
        };
    }
]);