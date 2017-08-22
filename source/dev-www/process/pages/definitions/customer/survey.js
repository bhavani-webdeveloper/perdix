irf.pageCollection.controller(irf.controller("bank.survey"), ["$log", "$q", "Utils", "$stateParams", "$scope", "PagesDefinition", "PageHelper", "irfNavigator", "Enrollment", "formHelper", "SessionStore", "elementsUtils",
    function($log, $q, Utils, $stateParams, $scope, PagesDefinition, PageHelper, irfNavigator, Enrollment, formHelper, SessionStore, elementsUtils) {
        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "SURVEY",
            initialize: function(model, form, formCtrl) {
                model.bank_survey = model.bank_survey || {};
                model.branchName = SessionStore.getBranch();
            },
            form: [{
                    "type": "box",
                    "htmlClass": "col-sm-12 col-xs-12",
                    "title": "GENERAL",
                    "items": [{
                            key: "bank_survey.date",
                            type: "date",
                            required: true,
                            readonly: true
                        }, {
                            key: "bank_survey.branch_name",
                            readonly: true
                        }, {
                            key: "bank_survey.fso_name",
                            required: true
                        }, {
                            key: "bank_survey.village",
                            required: true
                        },
                        "bank_survey.block",
                        "bank_survey.population",
                        "bank_survey.region",
                        "bank_survey.house_hold" {
                            key: "bank_survey.area_type",
                            type: "select",
                            titleMap: {
                                "Rural": "Rural",
                                "Market": "Market",
                                "SubUrban": "SubUrban",
                                "Urban": "Urban"
                            }

                        }, {
                            key: "bank_survey.migration",
                            type: "select",
                            titleMap: {
                                "Yes": "Yes",
                                "No": "No"
                            }

                        }, {
                            key: "bank_survey.poverty_level",
                            type: "select",
                            titleMap: {
                                "25%": "25%",
                                "50%": "50%",
                                "75%": "75%",
                                "100%": "100%",
                            }

                        }, {
                            key: "bank_survey.communities",
                            type: "select",
                            titleMap: {
                                "SC": "SC",
                                "ST": "ST",
                                "General": "General",
                                "Other": "Other",
                            }
                        }
                    ],
                }, {
                    "type": "box",
                    "htmlClass": "col-sm-12 col-xs-12",
                    "title": "DISTANCE(IN_KMS)_FROM",
                    "items": [
                        "bank_survey.unit",
                        "bank_survey.market",
                        "bank_survey.main_road",
                        "bank_survey.highway",
                        "bank_survey.block_hq",
                        "bank_survey.bank",
                        "bank_survey.post_office",
                        "bank_survey.school",
                        "bank_survey.phc",
                        "bank_survey.qualified_doctor",
                    ],
                }, {
                    "type": "box",
                    "htmlClass": "col-sm-12 col-xs-12",
                    "title": "INFRASTRUCTIRE/SOCIAL_ORDER",
                    "items": [{
                            key: "bank_survey.electricity",
                            type: "select",
                            titleMap: {
                                "Always": "Always",
                                "Regular": "Regular",
                                "Rare": "Rare",
                                "Never": "Never"
                            },
                            required: true
                        }, {
                            key: "bank_survey.drinking_water",
                            type: "select",
                            titleMap: {
                                "Easily": "Easily",
                                "Available": "Available",
                                "Difficult": "Difficult",
                                "None": "None"
                            },
                            required: true
                        }, {
                            key: "bank_survey.irrigation_source",
                            type: "select",
                            titleMap: {
                                "Well": "Well",
                                "River": "River",
                                "Rain": "Rain",
                                "Others": "Others"
                            },
                            required: true
                        }, {
                            key: "bank_survey.raod_quality",
                            type: "select",
                            titleMap: {
                                "RCC": "RCC",
                                "Tar": "Tar",
                                "Kaccha": "Kaccha"
                            },
                            required: true
                        }, {
                            key: "bank_survey.public_transport",
                            type: "select",
                            titleMap: {
                                "Bus": "Bus",
                                "Jeep": "Jeep",
                                "Others": "Others"
                            },
                            required: true
                        },
                        "bank_survey.irrigation_available",
                        "bank_survey.kinara_shop",
                        "bank_survey.tea_shops",
                        "bank_survey.well",
                        "bank_survey.hand_pumps", {
                            key: "bank_survey.business_location",
                            type: "select",
                            titleMap: {
                                "Good": "Good",
                                "OK": "Ok",
                                "Poor": "Poor"
                            },
                            required: true
                        },
                        "bank_survey.sarpanch_councillor_name",
                        "bank_survey.workBy_panchayat", {
                            key: "bank_survey.law_order",
                            type: "select",
                            titleMap: {
                                "Good": "Good",
                                "OK": "Ok",
                                "Poor": "Poor",
                                "None": "None",
                            },
                            required: true
                        }, {
                            key: "bank_survey.social_relation",
                            type: "select",
                            titleMap: {
                                "Good": "Good",
                                "OK": "Ok",
                                "Poor": "Poor",
                                "None": "None",
                            },
                            required: true
                        }, {
                            key: "bank_survey.political_climate ",
                            type: "select",
                            titleMap: {
                                "Clean": "Clean",
                                "Normal": "Normal",
                                "Bad": "Bad"
                            },
                            required: true
                        }
                    ],
                }, {
                    "type": "box",
                    "htmlClass": "col-sm-12 col-xs-12",
                    "title": "ECONOMIC_ACTIVITIES/LIVELYHOOD_OF_THE_DWELLERS",
                    "items": [{
                        key: "bank_survey.activity",
                        type: "textarea"
                    }],
                }, {
                    "type": "box",
                    "htmlClass": "col-sm-12 col-xs-12",
                    "title": "SOURCE_OF_CREDIT_IN_THE_VILLAGE/SLUM",
                    "items": [{
                            key: "bank_survey.source",
                            type: "select",
                            titleMap: {
                                "Bank": "Bank",
                                "MFI": "MFI",
                                "MoneyLender": "MoneyLender",
                                "Wholesaler": "Wholesaler"
                            }
                        },
                        "bank_survey.institute_name", {
                            key: "bank_survey.difficult_source",
                            type: "select",
                            titleMap: {
                                "High": "High",
                                "Medium": "Medium",
                                "Low": "Low"
                            }
                        },
                        "bank_survey.minimum_loan_size",
                        "bank_survey.maximum_loan_size",
                        "bank_survey.interest_rates",
                        "bank_survey.repayment_period", 
                        {
                            key: "bank_survey.repayment_frequency",
                            type: "select",
                            titleMap: {
                                "Daily": "Daily",
                                "Weekly": "Weekly",
                                "Fortnightly": "Fortnightly",
                                "Monthly": "Monthly",
                                "Quarterly": "Quarterly",
                                "Yearly": "Yearly"
                            }
                        }, 
                        "bank_survey.collateral",
                        "bank_survey.penalty_action",
                        "bank_survey.client_base",
                        "bank_survey.operation_since"                        
                    ],
                }, {
                    "type": "box",
                    "htmlClass": "col-sm-12 col-xs-12",
                    "title": "SOURCE_OF_SAVING,INSURENCE,MONEY_TRANSFER",
                    "items": [{
                        key: "bank_survey.bank",
                        type: "radios"
                    }, {
                        key: "bank_survey.mfi",
                        type: "radios"
                    }, {
                        key: "bank_survey.money_leader",
                        type: "radios"
                    }, {
                        key: "bank_survey.whole_saler",
                        type: "radios"
                    }, {
                        key: "bank_survey.post_office1",
                        type: "radios"
                    }],
                }, {
                    "type": "box",
                    "htmlClass": "col-sm-12 col-xs-12",
                    "title": "MICROFINANCE_DEMAND",
                    "items": [{
                        key: "bank_survey.microfinance_village",
                        type: "select",
                        titleMap: {
                            "Yes": "Yes",
                            "No": "No"
                        },
                        required: true
                    }, {
                        key: "bank_survey.potential_village",
                        type: "string",
                        required: true
                    }, {
                        key: "bank_survey.member_profile",
                        type: "select",
                        titleMap: {
                            "High": "High",
                            "Medium": "Medium",
                            "Low": "Low"
                        },
                    }, {
                        key: "bank_survey.motivation_required",
                        type: "select",
                        titleMap: {
                            "High": "High",
                            "Medium": "Medium",
                            "Low": "Low"
                        },
                    }, {
                        key: "bank_survey.comment",
                        type: "select",
                        titleMap: {
                            "Positive": "Positive",
                            "Negative": "Negative"
                        },
                    }],
                }, {
                    "type": "box",
                    "htmlClass": "col-sm-12 col-xs-12",
                    "title": "MAP_INCLUDE",
                    "items": [{
                        key: "bank_survey.geo_tag",
                        type: "geotag",
                        required: true,
                        title: "GEO_TAG"
                    }],
                }, {
                    "type": "box",
                    "htmlClass": "col-sm-12 col-xs-12",
                    "title": "DETAILS_OF_PERSONS_CONTACTED",
                    "items": [{
                        key: "bank_survey.name",
                        required: true
                    }, {
                        key: "bank_survey.contact",
                        required: true
                    }],
                },
                // {
                //     "type": "actionbox",
                //     "condition": "!model.bank_survey.audit_id",
                //     "items": [{
                //         "type": "button",
                //         "title": "CREATE",
                //         "style": "text-right",
                //         onClick: "actions.createAudit(model, formCtrl, form, $event)"
                //     }]
                // }, {
                //     "type": "actionbox",
                //     "condition": "model.bank_survey.audit_id",
                //     "items": [{
                //         "type": "submit",
                //         "title": "START_AUDIT"
                //     }]
                // }
            ],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "bank_survey": {
                        "type": "object",
                        "properties": {
                            "auditor_id": {
                                "title": "AUDITOR_ID",
                                "type": "string",
                            },
                            "branch_id": {
                                "title": "BRANCH_NAME",
                                "type": "integer",
                                "enumCode": "branch_id",
                                "required": true
                            },
                            "audit_type": {
                                "type": "string",
                                "title": "AUDIT_TYPE"
                            },
                            "report_date": {
                                "type": "string",
                                "title": "AUDIT_REPORT_CREATE_DATE"
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
                    },

                }
            },
            actions: {
                submit: function(model, form, formName) {

                },

            },

        };
    }
]);