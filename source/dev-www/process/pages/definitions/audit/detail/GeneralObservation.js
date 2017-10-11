irf.pageCollection.factory(irf.page("audit.detail.GeneralObservation"), ["$log", "$q", "formHelper", "PageHelper", "irfNavigator", "$stateParams", "Audit", "SessionStore", "filterFilter",
    function($log, $q, formHelper, PageHelper, irfNavigator, $stateParams, Audit, SessionStore, filterFilter) {
        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "GENERAL_OBSERVATION",
            initialize: function(model, form, formCtrl) {
                if (!$stateParams.pageId) {
                    irfNavigator.goBack();
                    return;
                }
                $stateParams.pageData = $stateParams.pageData || {};
                if (typeof($stateParams.pageData.readonly) == 'undefined') {
                    $stateParams.pageData.readonly = true;
                }
                var pageData = {
                    "readonly": $stateParams.pageData.readonly
                };
                model.audit_id = Number($stateParams.pageId);
                model.general_observations = model.general_observations || {};
                model.auditObservation = model.auditObservation || {};
                var masters = Audit.offline.getAuditMaster() || {};
                var self = this;
                self.form = [];
                var init = function(response) {
                    $log.info(response)
                    model.masters = masters;
                    model.general_observations = response;
                    for (i in model.general_observations) {
                        for (j in model.masters.general_observation.particulars) {
                            var particulars = model.masters.general_observation.particulars[i];
                            if (model.general_observations[i].particular_id = particulars.particular_id) {
                                model.general_observations[i].particular_id = particulars.particular_name;
                            }
                        }
                        for (k in model.masters.general_observation.particular_options) {
                            var particularOption = model.masters.general_observation.particular_options[i];
                            if (model.general_observations[i].option_id = particularOption.particular_id) {
                                model.general_observations[i].option_id = particularOption.name;
                            }
                        }
                    }
                    if ($stateParams.pageData.readonly) {
                        self.form = [{
                            type: "box",
                            "readonly": pageData.readonly,
                            title: "GENERAL_OBSERVATION",
                            items: [{
                                key: "general_observations",
                                type: "array",
                                title: "",
                                view: "fixed",
                                startEmpty: true,
                                items: [{
                                    key: "general_observations[].particular_id",
                                    "type": "lov",
                                    lovonly: true,
                                    outputMap: {},
                                    searchHelper: formHelper,
                                    search: function(inputModel, form, model, context) {
                                        return $q.resolve({
                                            headers: {
                                                "x-total-count": masters.general_observation.particulars.length
                                            },
                                            body: masters.general_observation.particulars
                                        });
                                    },
                                    getListDisplayItem: function(item, index, context) {
                                        return [
                                            item.particular_id,
                                            item.particular_name,
                                        ];
                                    },
                                    onSelect: function(result, model, context) {
                                        model.general_observations[context.arrayIndex].particular_id = result.particular_name;
                                        model.general_observations[context.arrayIndex].particularId = result.particular_id;
                                    },
                                }, {
                                    key: "general_observations[].option_id",
                                    "type": "lov",
                                    lovonly: true,
                                    outputMap: {},
                                    searchHelper: formHelper,
                                    search: function(inputModel, form, model, context) {
                                        var optionsToShow = filterFilter(masters.general_observation.particular_options, {
                                            particular_id: model.general_observations[context.arrayIndex].particularId
                                        }, true);
                                        return $q.resolve({
                                            headers: {
                                                "x-total-count": optionsToShow.length
                                            },
                                            body: optionsToShow
                                        });
                                    },
                                    getListDisplayItem: function(item, index, context) {
                                        $log.info(item)
                                        return [
                                            item.name
                                        ];
                                    },
                                    onSelect: function(result, model, context) {
                                        model.general_observations[context.arrayIndex].option_id = result.name;
                                    }
                                }, {
                                    key: "general_observations[].comments"
                                }]
                            }]
                        }]
                    } else {
                        self.form = [{
                            type: "box",
                            title: "GENERAL_OBSERVATION",
                            items: [{
                                key: "general_observations",
                                type: "array",
                                title: "GENERAL_OBSERVATION",
                                startEmpty: true,
                                items: [{
                                    key: "general_observations[].particular_id",
                                    "type": "lov",
                                    lovonly: true,
                                    outputMap: {},
                                    searchHelper: formHelper,
                                    search: function(inputModel, form, model, context) {
                                        return $q.resolve({
                                            headers: {
                                                "x-total-count": masters.general_observation.particulars.length
                                            },
                                            body: masters.general_observation.particulars
                                        });
                                    },
                                    getListDisplayItem: function(item, index, context) {
                                        return [
                                            item.particular_id,
                                            item.particular_name,
                                        ];
                                    },
                                    onSelect: function(result, model, context) {
                                        model.general_observations[context.arrayIndex].particular_id = result.particular_name;
                                        model.general_observations[context.arrayIndex].particularId = result.particular_id;
                                    },
                                }, {
                                    key: "general_observations[].option_id",
                                    "type": "lov",
                                    lovonly: true,
                                    outputMap: {},
                                    searchHelper: formHelper,
                                    search: function(inputModel, form, model, context) {
                                        var optionsToShow = filterFilter(masters.general_observation.particular_options, {
                                            particular_id: model.general_observations[context.arrayIndex].particularId
                                        }, true);
                                        return $q.resolve({
                                            headers: {
                                                "x-total-count": optionsToShow.length
                                            },
                                            body: optionsToShow
                                        });
                                    },
                                    getListDisplayItem: function(item, index, context) {
                                        $log.info(item)
                                        return [
                                            item.name
                                        ];
                                    },
                                    onSelect: function(result, model, context) {
                                        model.general_observations[context.arrayIndex].option_id = result.name;
                                    }
                                }, {
                                    key: "general_observations[].comments"
                                }]
                            }]
                        }, {
                            type: "actionbox",
                            items: [{
                                type: "submit",
                                title: "UPDATE"
                            }]
                        }]
                    }
                };
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
            form: [],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "general_observations": {
                        "type": "array",
                        "title": "VERIFICATIONS",
                        "items": {
                            "type": "object",
                            "properties": {
                                "order_id": {
                                    "type": ["string", "null"],
                                    "title": "ORDER_ID"
                                },
                                "option_id": {
                                    "type": ["string", "null"],
                                    "title": "OPTION_NAME"
                                },
                                "particular_id": {
                                    "type": ["string", "null"],
                                    "title": "PARTICULAR_NAME"
                                },
                                "comments": {
                                    "type": ["string", "null"],
                                    "title": "COMMENTS"
                                }
                            }
                        }
                    }
                },
            },
            actions: {
                submit: function(model, form, formName) {
                    if (model.$isOffline) {
                        Audit.offline.setGeneralObservation(model.audit_id, model.general_observations).then(function(res) {
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