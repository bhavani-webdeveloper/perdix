irf.pageCollection.factory(irf.page("audit.detail.GeneralObservation"), ["$log", "PageHelper", "irfNavigator", "$stateParams", "Audit", "SessionStore",
    function($log, PageHelper, irfNavigator, $stateParams, Audit, SessionStore) {
        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "GENERAL_OBSERVATION",
            initialize: function(model, form, formCtrl) {
                if (!$stateParams.pageId) {
                    irfNavigator.goBack();
                    return;
                }
                model.general_observations = model.general_observations || {};
                model.auditObservation = model.auditObservation || {};
                model.masters = Audit.offline.getAuditMaster() || {};
                var self = this;
                self.form = [];
                var init = function(response) {
                    model.general_observations = response;
                    var tableDetails = [];
                    for (i in model.general_observations) {
                        for (j in model.masters.go_particulars) {
                            if (model.general_observations[i].particular_id == model.masters.go_particulars[j].id) {
                                model.general_observations[i].particular_name = model.masters.go_particulars[j].particular_name;
                                model.general_observations[i].order_id = model.masters.go_particulars[j].particular_order;
                            }
                            for (k in model.masters.go_particulars[i].Particular_options) {
                                if (model.general_observations[i].option_id == model.masters.go_particulars[i].Particular_options[k].id) {
                                    model.general_observations[i].option_name = model.masters.go_particulars[i].Particular_options[k].name;
                                }
                            }
                        }
                    };
                    for (i in model.general_observations) {
                        tableDetails.push({
                            "type": "section",
                            "htmlClass": "row col-md-12",
                            "items": [{
                                "type": "section",
                                "htmlClass": "col-sm-3 col-xs-3",
                                "items": [{
                                    key: "general_observations[" + i + "].order_id",
                                    readonly: true,
                                    type: "string",
                                    notitle: true
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-2 col-xs-3",
                                "items": [{
                                    "key": "general_observations[" + i + "].particular_name",
                                    "type": "text",
                                    "notitle": true,
                                    "readonly": true
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-3 col-xs-3",
                                "items": [{
                                    "key": "general_observations[" + i + "].option_name",
                                    type: "select"
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-3 col-xs-3",
                                "items": [{
                                    "key": "general_observations[" + i + "].comments",
                                    "type": "text",
                                    "notitle": true 
                                }]
                            }]

                        })
                    };
                    self.form = [{
                        "type": "box",
                        "title": "GENERAL_OBSERVATION",
                        "colClass": "col-md-12",
                        "items": [{
                            "type": "section",
                            "htmlClass": "row",
                            "items": [{
                                "type": "section",
                                "htmlClass": "col-sm-3 col-xs-3",
                                "items": [{
                                    "type": "section",
                                    "html": "{{'ORDER'|translate}}"
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-2 col-xs-3",
                                "items": [{
                                    "type": "section",
                                    "html": "{{'PARTICULAR'|translate}}"
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-3 col-xs-3",
                                "items": [{
                                    "type": "section",
                                    "html": "{{'OPTION'|translate}}"
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-3 col-xs-3",
                                "items": [{
                                    "type": "section",
                                    "html": "{{'COMMENTS'|translate}}"
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "row",
                                "items": [{
                                    "type": "section",
                                    "htmlClass": "col-md-12",
                                    "items": tableDetails
                                }]

                            }]

                        }]
                    }, {
                        "type": "actionbox",
                        "items": [{
                            "type": "submit",
                            "title": "UPDATE",
                            onClick: "actions.goBack(model, formCtrl, form, $event)"
                        }]
                    }]
                };
                form: [],
                    model.$isOffline = false;
                if ($stateParams.pageData && $stateParams.pageData.auditData && $stateParams.pageData.auditData.general_observations) {
                    init($stateParams.pageData.auditData.general_observations);
                } else {
                    Audit.offline.getGeneralObservation($stateParams.pageId).then(function(res) {
                        init(res);
                        model.$isOffline = true;
                    }, function(errRes) {
                        PageHelper.showErrors(errRes);
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });
                }

            },
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "general_observations": {
                        "type": "object",
                        "title": "Address",
                        "properties": {
                            "comments": {
                                "type": "string",
                                "title": "COMMENTS"
                            }
                        }
                    }
                },
            },
            actions: {
                submit: function(model, form, formName) {
                    if (model.$isOffline) {
                        Audit.offline.setGeneralObservation(model.general_observations.audit_id, model.general_observations).then(function(res) {
                            model.general_observations = res;
                            PageHelper.showProgress("auditId", "Audit Updated Successfully.", 3000);
                            irfNavigator.goBack();
                        }, function(errRes) {
                            PageHelper.showErrors(errRes);
                        }).finally(function() {
                            PageHelper.hideLoader();
                        })
                    } else {
                        $stateParams.pageData.auditData.general_observations = model.general_observations;
                        irfNavigator.goBack();
                    }
                },
                goBack: function(model, form, formName) {
                    irfNavigator.goBack();
                },
            }
        };
    }
]);