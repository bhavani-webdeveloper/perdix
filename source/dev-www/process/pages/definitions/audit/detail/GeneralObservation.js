irf.pageCollection.factory(irf.page("audit.detail.GeneralObservation"), ["$log", "formHelper","PageHelper", "irfNavigator", "$stateParams", "Audit", "SessionStore",
    function($log, formHelper ,PageHelper, irfNavigator, $stateParams, Audit, SessionStore) {
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
                var auditId = Number($stateParams.pageId);
                model.general_observations = model.general_observations || {};
                model.auditObservation = model.auditObservation || {};
                var masters = Audit.offline.getAuditMaster() || {};
                var self = this;
                self.form = [];
                var init = function(response) {
                    $log.info(response)                    
                    model.masters = masters;
                    $log.info(masters)
                    $log.info("response")
                    $log.info(response)
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
                    for (i in model.general_observations) {
                        for (j in model.masters.general_observation) {
                            for(k in model.masters.general_observation[j].particulars)
                            if (model.general_observations[i].particular_id == model.masters.general_observation[j].particulars[k].particular_id) {
                                $log.info(model.masters.general_observation[j].particulars[k].particular_id)
                                $log.info("model.masters.general_observation[j].particulars[k].particular_id")
                                $log.info(model.masters.general_observation)


                            }

                        }

                    }


                    self.form = [{
                        type: "box",
                        title: "GENERAL_OBSERVATION",
                        items: [{
                            key: "general_observations",
                            type: "array",
                            title: "GENERAL_OBSERVATION",
                            startEmpty: true,
                            items: [
                                // {
                                //     key: "general_observations[].order_id",
                                //     type: "string",
                                //     "titleMap": orderIdTitleMap,
                                // },
                                {
                                    key: "general_observations[].particular_name",                                    
                                    "type": "lov",
                                    lovonly: true,
                                    outputMap: {
                                    },
                                    searchHelper: formHelper,
                                    search: function(inputModel, form, model) {

                                        if (model.group.productCode)
                                            return Queries.getLoanPurpose1(model.group.productCode);
                                        else
                                            return Queries.getAllLoanPurpose1();

                                    },
                                    getListDisplayItem: function(item, index) {
                                        return [
                                            item.purpose1
                                        ];
                                    },
                                    onSelect: function(result, model, context) {
                                        model.group.jlgGroupMembers[context.arrayIndex].loanPurpose1 = result.purpose1;
                                        model.group.jlgGroupMembers[context.arrayIndex].loanPurpose2 = undefined;
                                    }
                                }, {
                                    key: "general_observations[].option_name",
                                    type: "select",
                                }, {
                                    key: "general_observations[].comments"
                                }
                            ]
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
                                "option_name": {
                                    "type": ["string", "null"],
                                    "title": "OPTION_NAME"
                                },
                                "particular_name": {
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