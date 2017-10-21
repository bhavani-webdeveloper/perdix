irf.pageCollection.factory(irf.page("audit.detail.JewelAppraisal"),
["$log", "formHelper", "PageHelper", "irfNavigator", "$stateParams", "Audit", "SessionStore", "translateFilter",
    function($log, formHelper, PageHelper, irfNavigator, $stateParams, Audit, SessionStore, translateFilter) {
        var branch = SessionStore.getBranch();
        var validateFields = function(model) {
            for (i in model.jewel_appraisal.jewel_details) {
                var jd = model.jewel_appraisal.jewel_details[i];
                if (jd.net > jd.gross) {
                    PageHelper.setError({
                        message: "Net weight should be less than Gross weight"
                    });
                    return false;
                }
                if (jd.reapp_net > jd.reapp_gross) {
                    PageHelper.setError({
                        message: translateFilter("RE_APP/NET(IN_GRAMS)")+" weight Should be less than the " + translateFilter("RE_APP/GROSS(IN_GRAMS)") + " Weight"
                    });
                    return false;
                }
            }
            return true;
        };

        return {
            "type": "schema-form",
            "title": "JEWEL_APPRAISAL",
            initialize: function(model, form, formCtrl) {
                if (!$stateParams.pageId) {
                    irfNavigator.goBack();
                    return;
                }
                $stateParams.pageData = $stateParams.pageData || {};
                if (typeof($stateParams.pageData.readonly) == 'undefined') {
                    $stateParams.pageData.readonly = true;
                }
                model.readonly = $stateParams.pageData.readonly;
                model.audit_id = Number($stateParams.pageId);
                model.jewel_appraisal = model.jewel_appraisal || {};
                // var master = Audit.offline.getAuditMaster() || {};
                var self = this;
                self.form = [];
                var init = function(response) {
                    model.jewel_appraisal = response;
                    
                    if (_.isObject(model.jewel_appraisal.jewel_assets)) {
                        var addedVal = model.jewel_appraisal.jewel_assets.number_of_pouches_in_hand + model.jewel_appraisal.jewel_assets.number_of_pouches_in_hq - model.jewel_appraisal.jewel_assets.total_on_hand;
                        model.jewel_appraisal.jewel_assets.CMS_difference = String(addedVal);
                    }

                    self.form = [{
                        type: "box",
                        readonly: model.readonly,
                        title: "JEWEL_APPRAISALS",
                        items: [{
                            key: "jewel_appraisal.jewel_details",
                            type: "array",
                            title: "ADD_DETAILS",
                            startEmpty: true,
                            items: [{
                                key: "jewel_appraisal.jewel_details[].account_number",
                                required: true
                            }, {
                                key: "jewel_appraisal.jewel_details[].loan_amount",
                                required: true
                            }, {
                                key: "jewel_appraisal.jewel_details[].description_of_jewel",
                                required: true
                            }, {
                                key: "jewel_appraisal.jewel_details[].gross",
                                required: true
                            }, {
                                key: "jewel_appraisal.jewel_details[].net",
                                required: true
                            }, {
                                key: "jewel_appraisal.jewel_details[].reapp_gross",
                                required: true
                            }, {
                                key: "jewel_appraisal.jewel_details[].reapp_net",
                                required: true
                            }, {
                                key: "jewel_appraisal.jewel_details[].sticker_number",
                                required: true
                            }, {
                                key: "jewel_appraisal.jewel_details[].reapp_sticker_number",
                                required: true
                            }, {
                                key: "jewel_appraisal.jewel_details[].comments",
                                required: true
                            }]

                        }]

                    }, {
                        type: "box",
                        readonly: model.readonly,
                        title: "JEWEL_ASSETS",
                        items: [{
                            key: "jewel_appraisal.jewel_assets.number_of_pouches_in_hand",
                            type: "number"
                        }, {
                            key: "jewel_appraisal.jewel_assets.number_of_pouches_in_hq",
                            type: "number",
                        }, {
                            key: "jewel_appraisal.jewel_assets.total_on_hand",
                            type: "number",
                            "onChange": function(modelValue, form, model) {
                                var addedVal = model.jewel_appraisal.jewel_assets.number_of_pouches_in_hand + model.jewel_appraisal.jewel_assets.number_of_pouches_in_hq - model.jewel_appraisal.jewel_assets.total_on_hand;
                                model.jewel_appraisal.jewel_assets.CMS_difference = String(addedVal);
                            }
                        }, {
                            key: "jewel_appraisal.jewel_assets.CMS_difference",
                            readonly:true
                        }]
                    }, {
                        type: "actionbox",
                        condition: "!model.readonly",
                        items: [{
                            type: "submit",
                            title: "UPDATE"
                        }]
                    }];
                };
                model.$isOffline = false;
                if ($stateParams.pageData && $stateParams.pageData.auditData && $stateParams.pageData.auditData.jewel_appraisal) {
                    init($stateParams.pageData.auditData.jewel_appraisal);
                } else {
                    Audit.offline.getJewelAppraisal(model.audit_id).then(function(res) {
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
                    "jewel_appraisal": {
                        "type": "object",
                        "properties": {                           
                            "jewel_details": {
                                "type": "array",
                                "title": "CUSTOMER_BANK_ACCOUNT",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "account_number": {
                                            "type": ["string", "null"],
                                            "title": "ACCOUNT_NUMBER",
                                            "maxLength": 14,
                                            "minLength": 14,
                                        },
                                        "loan_amount": {
                                            "type": ["number", "null"],
                                            "title": "LOAN_AMOUNT"
                                        },
                                        "description_of_jewel": {
                                            "type": ["string", "null"],
                                            "title": "DESCRIPTION"
                                        },
                                        "gross": {
                                            "type": ["number", "null"],
                                            "title": "GROSS(IN_GRAMS)"
                                        },
                                        "net": {
                                            "type": ["number", "null"],
                                            "title": "NET(IN_GRAMS)"
                                        },
                                        "reapp_gross": {
                                            "type": ["number", "null"],
                                            "title": "RE_APP/GROSS(IN_GRAMS)"
                                        },
                                        "reapp_net": {
                                            "type": ["number", "null"],
                                            "title": "RE_APP/NET(IN_GRAMS)"
                                        },
                                        "sticker_number": {
                                            "type": ["string", "null"],
                                            "title": "STICKER_NUMBER"
                                        },
                                        "reapp_sticker_number": {
                                            "type": ["string", "null"],
                                            "title": "RE_APP_STICKER_NUMBER"
                                        },
                                        "comments": {
                                            "type": ["string", "null"],
                                            "title": "COMMENTS"
                                        }
                                    }
                                }
                            },
                            "jewel_assets": {
                                "type": "object",
                                "properties": {
                                    "number_of_pouches_in_hand": {
                                        "type": ["integer", "null"],
                                        "title": "POUNCHES_IN_THE_BRANCH"
                                    },
                                    "number_of_pouches_in_hq": {
                                        "type": ["integer", "null"],
                                        "title": "POUNCHES_IN_THE_HUB"
                                    },
                                    "total_on_hand": {
                                        "type": ["integer", "null"],
                                        "title": "TOTAL_BY_CMS"
                                    },
                                    "CMS_difference": {
                                        "type": "string",
                                        "title": "DIFFERENCE"
                                    },
                                    
                                }
                            },
                        },

                    }
                },
            },
            actions: {
                submit: function(model, formCtrl, form, $event) {
                    PageHelper.clearErrors();
                    formHelper.validate(formCtrl).then(function() {
                        if (!validateFields(model)) return;
                        if (model.$isOffline) {
                            Audit.offline.setJewelAppraisal(model.audit_id, model.jewel_appraisal).then(function() {
                                PageHelper.showProgress("auditId", "Jewel Appraisal updated successfully.", 3000);
                                irfNavigator.goBack();
                            }, PageHelper.showErrors).finally(PageHelper.hideLoader);
                        } else {
                            $stateParams.pageData.auditData.jewel_appraisal = model.jewel_appraisal;
                            irfNavigator.goBack();
                        }
                    })
                },
                // submit: function(model, formCtrl, form, $event) {
                //     PageHelper.clearErrors();
                //     formHelper.validate(formCtrl).then(function() {
                //         if (model.$isOffline) {
                //             Audit.offline.setJewelAppraisal(model.auditId, model.jewel_appraisal).then(function(res) {
                //                 model.jewel_appraisal = res;
                //                 PageHelper.showProgress("auditId", "Audit Updated Successfully.", 3000);
                //                 irfNavigator.goBack();
                //             }, function(errRes) {
                //                 PageHelper.showErrors(errRes);
                //             }).finally(function() {
                //                 PageHelper.hideLoader();
                //             })
                //         } else {
                //             $stateParams.pageData.auditData.jewel_appraisal = model.jewel_appraisal;
                //             irfNavigator.goBack();
                //         }
                //     });
                // },
                goBack: function(model, form, formName) {
                    irfNavigator.goBack();
                },
            }
        };
    }
]);