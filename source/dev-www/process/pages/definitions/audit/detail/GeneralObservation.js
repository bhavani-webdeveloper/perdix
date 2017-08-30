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
                model.auditId = Number($stateParams.pageId);
                model.general_observations = model.general_observations || {};
                model.auditObservation = model.auditObservation || {};
                var masters = Audit.offline.getAuditMaster() || {};
                var self = this;
                self.form = [];
                var init = function(response) {
                    $log.info(response)
                    model.masters = masters;
                    model.general_observations = response;
                    var tableDetails = [];
                    // for (i in model.general_observations) {
                    //     for (j in model.masters.general_observations) {
                    //         if (model.general_observations[i].particular_id == model.masters.particular_id[j].id) {
                    //             model.general_observations[i].particular_name = model.masters.particular_id[j].particular_name;
                    //             model.general_observations[i].order_id = model.masters.particular_id[j].particular_order;
                    //         }
                    //         for (k in model.masters.particular_id[i].Particular_options) {
                    //             if (model.general_observations[i].option_id == model.masters.particular_id[i].Particular_options[k].id) {
                    //                 model.general_observations[i].option_name = model.masters.particular_id[i].Particular_options[k].name;
                    //             }
                    //         }
                    //     }
                    // };
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
                                    $log.info(optionsToShow)
                                    $log.info("optionsToShow")
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
                            title: "ADD"
                        }]
                    }]
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