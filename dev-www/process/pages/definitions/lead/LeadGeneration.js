irf.pageCollection.factory(irf.page("lead.LeadGeneration"), ["$log", "$state", "Lead", "LeadHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries",


    function($log, $state, Lead, LeadHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, BiometricService, PagesDefinition, Queries) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "LEAD_GENERATION",
            "subTitle": "Lead",
            initialize: function(model, form, formCtrl) {
                model.lead = model.lead || {};
                model.branchId = SessionStore.getBranchId() + '';
                model.lead.currentDate = model.lead.currentDate || Utils.getCurrentDate();
                model = Utils.removeNulls(model, true);
                model.lead.branchName = SessionStore.getBranch();
                $log.info("create new lead generation page ");
            },

            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return [
                    item.lead.leadName
                ]
            },

            form: [{
                    "type": "box",
                    "title": "LEAD_PROFILE",
                    "items": [{
                            key: "lead.branchName",
                            readonly: true
                        }, {
                            key: "lead.spokeName",
                            type: "select"
                        }, {
                            key: "lead.leadId",
                            condition: "model.lead.leadId",
                            readonly: true
                        }, {
                            key: "lead.urnNo",
                            condition: "model.lead.urnNo",
                            readonly: true
                        }, {
                            type: "fieldset",
                            title: "LEAD_DETAILS",
                            items: [{
                                    key: "lead.leadName",
                                }, {
                                    key: "lead.customerType",
                                    type: "select",
                                    titleMap: {
                                        "Individual": "Individual",
                                        "Enterprise": "Enterprise"
                                    }

                                }, {
                                    type: "fieldset",
                                    title: "ENTERPRISE_DETAILS",
                                    items: [{
                                        key: "lead.businessName"
                                    }, {
                                        key: "lead.businessType"
                                    }, {
                                        key: "lead.businessActivity"
                                    }, {
                                        key: "lead.companyOperatingSince",
                                        type:"date"
                                    }, {
                                        key: "lead.ownership",
                                        type: "select",
                                        "enumCode":"ownership"
                                    }, {
                                        key: "lead.companyRegistered",
                                        type: "radios",
                                        enumCode: "decisionmaker"
                                    }]
                                }, {
                                    type: "fieldset",
                                    title: "INDIVIDUAL_DETAILS",
                                    items: [{
                                            key: "lead.gender",
                                            type: "radios"
                                        }, {
                                            key: "lead.age",
                                            type: "number",
                                            "onChange": function(modelValue, form, model) {
                                                if (model.lead.age > 0) {
                                                    if (model.lead.dob) {
                                                        model.lead.dob = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-') + moment(model.lead.dob, 'YYYY-MM-DD').format('MM-DD');
                                                    } else {
                                                        model.lead.dob = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-MM-DD');
                                                    }
                                                }
                                            }
                                        }, {
                                            key: "lead.dob",
                                            type: "date",
                                            "onChange": function(modelValue, form, model) {
                                                if (model.lead.dob) {
                                                    model.lead.age = moment().diff(moment(model.lead.dob, SessionStore.getSystemDateFormat()), 'years');
                                                }
                                            }
                                        }, {
                                            key: "lead.maritalStatus",
                                            type: "select"
                                        }, {
                                            key: "lead.educationStatus",
                                            type: "select",
                                        }, {
                                            key: "lead.incomeSource",
                                            type: "select",
                                        },
                                        "lead.incomeEarned", {
                                            key: "lead.frequency",
                                            type: "select"
                                        }
                                    ]
                                }, {
                                    type: "fieldset",
                                    title: "CONTACT_DETAILS",
                                    condition: "model.lead.customerType === 'Individual'||model.lead.customerType === 'Enterprise'",
                                    items: [{
                                            key: "lead.mobileNo",
                                        }, {
                                            key: "lead.alternateMobileNo",
                                        }, {
                                            key: "lead.addressLine1",
                                        }, {
                                            key: "lead.addressLine2",
                                        },
                                        "lead.district", {
                                            key: "lead.pincode",
                                            type: "lov",
                                            autolov: true,
                                            inputMap: {
                                                "pincode": "lead.pincode",
                                                "district": {
                                                    key: "lead.district"
                                                },
                                                "state": {
                                                    key: "lead.state"
                                                }
                                            },
                                            outputMap: {

                                                "pincode": "lead.pincode",
                                                "district": "lead.district",
                                                "state": "lead.state"
                                            },
                                            searchHelper: formHelper,
                                            search: function(inputModel, form, model) {
                                                return Queries.searchPincodes(inputModel.pincode, inputModel.district, inputModel.state);
                                            },
                                            getListDisplayItem: function(item, index) {
                                                return [
                                                    item.pincode,
                                                    item.district + ', ' + item.state
                                                ];
                                            }
                                        },
                                        "lead.state", {
                                            "key": "lead.latitude",
                                            "type": "geotag",
                                            "latitude": "latitude",
                                            "longitude": "longitude",
                                        },
                                        "lead.area",

                                    ]
                                },
                            ]
                        },
                    ]
                },
                {
                    type: "box",
                    title: "PRODUCT_DETAILS",
                    items: [{
                        key: "lead.productCategory",
                        type: "select",
                        titleMap: {
                            "Asset": "Asset",
                            "Liability": "Liability",
                            "others": "others"
                        }
                    }, {
                        key: "lead.productSubCategory",
                        type: "select",
                        titleMap: {
                            "Loan": "Loan",
                            "investment": "investment"
                        }
                    }, {
                        key: "lead.interestedInProduct",
                        type: "radios",
                        enumCode: "decisionmaker",
                    }, {
                        key: "lead.productRequiredBy",
                        type: "select",
                        condition: "model.lead.interestedInProduct==='YES'",
                        titleMap: {
                            "In this week": "In this week",
                            "In this month": "In this month",
                            "Next 2 -3 months": "Next 2 -3 months",
                            "Next 4-6 months": "Next 4-6 months",

                        },
                    }, {
                        key: "lead.screeningDate",
                        condition: "(model.lead.interestedInProduct==='YES' && model.lead.productRequiredBy ==='In this week')",
                        type: "date",
                    }, {
                        key: "lead.followUpDate",
                        condition: "(model.lead.interestedInProduct==='YES' && model.lead.productRequiredBy === 'In this month'||model.lead.ProductRequiredBy ==='Next 2 -3 months'|| model.lead.ProductRequiredBy === 'Next 4-6 months')",
                        type: "date",

                    }, {
                        key: "lead.loanPurpose1",
                        condition: "model.lead.interestedInProduct==='YES'",
                        type: "select",
                        titleMap: {
                            "AssetPurchase": "AssetPurchase",
                            "WorkingCapital": "WorkingCapital",
                            "BusinessDevelopment": "BusinessDevelopment",
                            "LineOfCredit": "LineOfCredit",

                        }
                    }, {
                        key: "lead.loanAmountRequested",
                        condition: "model.lead.interestedInProduct==='YES'",
                        title: "Loan_Amount_Requested"

                    }, {
                        type: "fieldset",
                        title: "PRODUCT_REJECTION_REASON",
                        condition: "model.lead.interestedInProduct==='NO'",
                        items: [{
                            key: "lead.productRejectReason",
                            type: "select",
                            titleMap: {
                                "Reason1": "Reason1",
                                "Reason2": "Reason2"
                            }
                        }, {
                            key: "lead.additionalRemarks",
                        }, ]
                    }, {
                        type: "fieldset",
                        condition: "model.lead.interestedInProduct==='YES'",
                        title: "PRODUCT_ELIGIBILITY",
                        items: [{
                                key: "lead.eligibleForProduct",
                                type: "radios",
                                enumCode: "decisionmaker",
                            }, {
                                key: "lead.productAcceptReason",
                                condition: "model.lead.eligibleForProduct ==='NO'",
                                type: "select",
                                titleMap: {
                                    "Reason1": "Reason1",
                                    "Reason2": "Reason2"
                                }
                            },

                        ]

                    }, {
                        type: "fieldset",
                        title: "LEAD_STATUS",
                        items: [{
                            key: "lead.leadStatus",
                            type: "select",
                            titleMap: {
                                "Screening": "Screening",
                                "FollowUP": "FollowUp",
                                "Incomplete": "Incomplete",
                                "Reject": "Reject"
                            }
                        }]
                    }]
                }, {
                    type: "box",
                    title: "CUSTOMER_INTERACTIONS",
                    items: [{
                        key: "lead.leadInteractions",
                        title: "INTERACTION_HISTORY",
                        type: "array",
                        remove: null,
                        add: null,

                        items: [{
                            key: "lead.leadInteractions[].interactionDate",
                            type: "date",
                        }, {
                            key: "lead.leadInteractions[].loanOfficerId",
                        }, {
                            key: "lead.leadInteractions[].leadStatus",
                        }, {
                            key: "lead.leadInteractions[].typeOfInteraction",
                            type: "select",
                            titleMap: {
                                "Call": "Call",
                                "Visit": "Visit",

                            },
                        }, {
                            key: "lead.leadInteractions[].customerResponse",
                        }, {
                            key: "lead.leadInteractions[].additionalRemarks",
                        }, {
                            "key": "lead.leadInteractions[].latitude",
                            "type": "geotag",
                            "latitude": "latitude",
                            "longitude": "longitude",
                            //"condition": "model.lead.leadInteractions[].TypeOfInteraction === 'Visit'",
                        }, {
                            "key": "lead.leadInteractions[].picture",
                            "type": "file",
                            "fileType": "image/*",
                            //"condition": "model.lead.leadInteractions[].TypeOfInteraction === 'Visit'",
                        }, ]
                    }]

                },

                {
                    type: "box",
                    title: "PREVIOUS_INTERACTIONS",
                    condition: "model.lead.id",
                    items: [{
                        key: "lead.leadInteractions",
                        title: "INTERACTION_HISTORY",
                        type: "array",
                        remove: null,
                        add: null,
                        /* startEmpty: true, */
                        items: [{
                            key: "lead.leadInteractions[].interactionDate",
                            type: "date",
                            readonly: true
                        }, {
                            key: "lead.leadInteractions[].loanOfficerId",
                            readonly: true
                        }, {
                            key: "lead.leadInteractions[].leadStatus",
                            readonly: true
                        }, {
                            key: "lead.leadInteractions[].typeOfInteraction",
                            type: "select",
                            titleMap: {
                                "Call": "Call",
                                "Visit": "Visit",

                            },
                            readonly: true
                        }, {
                            key: "lead.leadInteractions[].customerResponse",
                            readonly: true
                        }, {
                            key: "lead.leadInteractions[].additionalRemarks",
                            readonly: true
                        }, {
                            "key": "lead.leadInteractions[].latitude",
                            "type": "geotag",
                            "latitude": "latitude",
                            "longitude": "longitude",
                            //"condition": "model.lead.leadInteractions[].TypeOfInteraction === 'Visit'",
                            readonly: true
                        }, {
                            "key": "lead.leadInteractions[].picture",
                            "type": "file",
                            "fileType": "image/*",
                            //"condition": "model.lead.leadInteractions[].TypeOfInteraction === 'Visit'",
                            readonly: true
                        }, ]
                    }]
                },


                {
                    "type": "actionbox",
                    "items": [{
                        "type": "save",
                        "title": "SAVE_OFFLINE",
                    }, {
                        "type": "submit",
                        "title": "Submit"
                    }]
                },
            ],

            schema: function() {
                return Lead.getLeadSchema().$promise;
            },

            actions: {
                preSave: function(model, form, formName) {
                    var deferred = $q.defer();
                    if (model.lead.leadName) {
                        deferred.resolve();
                    } else {
                        irfProgressMessage.pop('lead-save', 'lead Name is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },

                submit: function(model, form, formName) {
                    $log.info("Inside submit()");
                    $log.warn(model);
                    var sortFn = function(unordered) {
                        var out = {};
                        Object.keys(unordered).sort().forEach(function(key) {
                            out[key] = unordered[key];
                        });
                        return out;
                    };
                    var reqData = _.cloneDeep(model);
                    if (reqData.lead.id) {
                        LeadHelper.proceedData(reqData).then(function(resp) {
                            // $state.go('Page.Landing', null);
                        });
                    } else {
                        LeadHelper.saveData(reqData).then(function(res) {
                            LeadHelper.proceedData(res).then(function(resp) {
                                //$state.go('Page.Landing', null);
                            }, function(err) {
                                Utils.removeNulls(res.lead, true);
                                model.lead = res.lead;
                            });
                        });
                    }



                }
            }
        };
    }
]);