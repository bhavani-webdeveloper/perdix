irf.pageCollection.factory(irf.page("lead.LeadGeneration"), ["$log", "$state", "$stateParams", "Lead", "LeadHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries",

    function($log, $state, $stateParams, Lead, LeadHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, BiometricService, PagesDefinition, Queries) {

        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "LEAD_GENERATION",
            "subTitle": "Lead",
            initialize: function(model, form, formCtrl) {

                model.lead = model.lead || {};
                //model.branchId = SessionStore.getBranchId() + '';
                model.lead.currentDate = model.lead.currentDate || Utils.getCurrentDate();
                model = Utils.removeNulls(model, true);
                model.lead.branchId = SessionStore.getBranchId() + '';
                $log.info("lead generation page got initiated");

                if (!(model && model.lead && model.lead.id && model.$$STORAGE_KEY$$)) {
                    PageHelper.showLoader();
                    PageHelper.showProgress("page-init", "Loading...");
                    var leadId = $stateParams.pageId;
                    if (!leadId) {
                        PageHelper.hideLoader();
                    }
                    Lead.get({
                            id: leadId
                        },
                        function(res) {
                            _.assign(model.lead, res);
                            model = Utils.removeNulls(model, true);
                            PageHelper.hideLoader();
                        }
                    );
                }
            },
            offline: false,
            getOfflineDisplayItem: function(item, index) {
                return [
                    item.lead.leadName
                ]
            },

            form: [{
                    "type": "box",
                    "title": "LEAD_PROFILE",
                    "items": [{
                            key: "lead.branchId",
                            type: "select",
                        }, {
                            key: "lead.centreId",
                            type: "select",
                            parentEnumCode: "branch_id",
                            screenFilter: true
                        }, {
                            key: "lead.id",
                            condition: "model.lead.id",
                            readonly: true
                        }, {
                            key: "lead.urnNo",
                            condition: "model.lead.urnNo",
                            readonly: true
                        },

                        {
                            type: "fieldset",
                            title: "LEAD_DETAILS",
                            items: [{
                                    key: "lead.leadName",
                                }, {
                                    key: "lead.customerType",
                                    type: "select",
                                    titleMap: {
                                        "Individual": "Individual",
                                        "Enterprise": "Individual and Enterprise"
                                    }

                                }, {
                                    type: "fieldset",
                                    title: "ENTERPRISE_DETAILS",
                                    condition: "model.lead.customerType === 'Enterprise'",
                                    items: [{
                                        key: "lead.businessName"
                                    }, {
                                        key: "lead.businessType",
                                        type: "select",
                                        enumCode: "businessType"
                                    }, {
                                        key: "lead.businessActivity",
                                        type: "select",
                                        enumCode: "businessSector",
                                        parentEnumCode: "businessType"
                                    }, {
                                        key: "lead.companyOperatingSince",
                                        type: "date"
                                    }, {
                                        key: "lead.ownership",
                                        type: "select",
                                        "enumCode": "ownership"
                                    }, {
                                        key: "lead.companyRegistered",
                                        type: "radios",
                                        enumCode: "decisionmaker"
                                    }, {
                                        type: "fieldset",
                                        title: "INDIVIDUAL_DETAILS",
                                        items: [{
                                            key: "lead.gender",
                                            type: "radios"
                                        }, {
                                            key: "lead.dob",
                                            type: "date",
                                            "onChange": function(modelValue, form, model) {
                                                if (model.lead.dob) {
                                                    model.lead.age = moment().diff(moment(model.lead.dob, SessionStore.getSystemDateFormat()), 'years');
                                                }
                                            }
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
                                            key: "lead.maritalStatus",
                                            type: "select",
                                            titleMap: {
                                                "MARRIED": "MARRIED",
                                                "UNMARRIED": "UNMARRIED",
                                                "DIVORCED": "DIVORCED",
                                                "SEPARATED": "SEPARATED",
                                                "WIDOW(ER)": "WIDOW(ER)",
                                            }
                                        }, {
                                            key: "lead.educationStatus",
                                            type: "select",
                                            titleMap: {
                                                "Below SSLC": "Below SSLC",
                                                "ITI/Diploma/Professional Qualification": "ITI/Diploma/ProfessionalQualification",
                                                "Graduate/Equivalent to graduate": "Graduate/Equivalent",
                                                "Post graduate&equivalent": "PostGraduate & Equivalent",
                                                "More than post graduation": "MoreThanPostGraduation",
                                            }
                                        }]
                                    }]
                                },

                                {
                                    type: "fieldset",
                                    title: "INDIVIDUAL_DETAILS",
                                    condition: "model.lead.customerType === 'Individual'",
                                    items: [{
                                        key: "lead.gender",
                                        type: "radios"
                                    }, {
                                        key: "lead.dob",
                                        type: "date",
                                        "onChange": function(modelValue, form, model) {
                                            if (model.lead.dob) {
                                                model.lead.age = moment().diff(moment(model.lead.dob, SessionStore.getSystemDateFormat()), 'years');
                                            }
                                        }
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
                                        key: "lead.maritalStatus",
                                        type: "select",
                                        titleMap: {
                                            "MARRIED": "MARRIED",
                                            "UNMARRIED": "UNMARRIED",
                                            "DIVORCED": "DIVORCED",
                                            "SEPARATED": "SEPARATED",
                                            "WIDOW(ER)": "WIDOW(ER)",
                                        }
                                    }, {
                                        key: "lead.educationStatus",
                                        type: "select",
                                        titleMap: {
                                            "Below SSLC": "Below SSLC",
                                            "ITI/Diploma/Professional Qualification": "ITI/Diploma/ProfessionalQualification",
                                            "Graduate/Equivalent to graduate": "Graduate/Equivalent",
                                            "Post graduate&equivalent": "PostGraduate & Equivalent",
                                            "More than post graduation": "MoreThanPostGraduation",
                                        }
                                    }]
                                },

                                {
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
                                        }, {
                                            key: "lead.pincode",
                                            type: "lov",
                                            fieldType: "number",
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
                                                "division": "lead.area",
                                                "region": "lead.cityTownVillage",
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
                                                    item.division + ', ' + item.region,
                                                    item.pincode,
                                                    item.district + ', ' + item.state
                                                ];
                                            }
                                        },
                                        "lead.area",
                                        "lead.cityTownVillage",
                                        "lead.district",
                                        "lead.state", {
                                            "key": "lead.location",
                                            "type": "geotag",
                                            "latitude": "latitude",
                                            "longitude": "longitude",
                                        },
                                    ]
                                },
                            ]
                        }
                    ]
                },

                {
                    type: "box",
                    title: "PRODUCT_DETAILS",
                    items: [{
                        key: "lead.interestedInProduct",
                        type: "radios",
                        enumCode: "decisionmaker",
                        onChange: "actions.changeStatus(modelValue, form, model)"
                    }, {
                        key: "lead.productCategory",
                        condition: "model.lead.interestedInProduct==='YES'",
                        type: "select",
                        titleMap: {
                            "Asset": "Asset",
                            "Liability": "Liability",
                            "others": "others"
                        }
                    }, {
                        key: "lead.productSubCategory",
                        condition: "model.lead.interestedInProduct==='YES'",
                        type: "select",
                        titleMap: {
                            "Loan": "Loan",
                            "investment": "investment"
                        }
                    }, {
                        key: "lead.loanAmountRequested",
                        type: "amount",
                        condition: "model.lead.interestedInProduct==='YES'&& model.lead.productSubCategory !== 'investment'",
                    }, {
                        key: "lead.loanPurpose1",
                        condition: "model.lead.interestedInProduct==='YES'&& model.lead.productSubCategory !== 'investment'",
                        type: "select",
                        titleMap: {
                            "AssetPurchase": "AssetPurchase",
                            "WorkingCapital": "WorkingCapital",
                            "BusinessDevelopment": "BusinessDevelopment",
                            "LineOfCredit": "LineOfCredit",

                        }
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
                        onChange: "actions.changeStatus(modelValue, form, model)"
                    }, {
                        key: "lead.screeningDate",
                        condition: "(model.lead.interestedInProduct==='YES' && model.lead.productRequiredBy ==='In this week')",
                        type: "date",
                        onChange: "actions.changeStatus(modelValue, form, model)"
                    }, {
                        key: "lead.followUpDate",
                        condition: "(model.lead.interestedInProduct==='YES' && model.lead.productRequiredBy =='In this month'||model.lead.productRequiredBy =='Next 2 -3 months'||model.lead.productRequiredBy =='Next 4-6 months')",
                        type: "date",
                        onChange: "actions.changeStatus(modelValue, form, model)"
                    }, {
                        type: "fieldset",
                        condition: "model.lead.interestedInProduct==='YES'",
                        title: "PRODUCT_ELIGIBILITY",
                        items: [{
                            key: "lead.eligibleForProduct",
                            type: "radios",
                            enumCode: "decisionmaker",
                            onChange: "actions.changeStatus(modelValue, form, model)",
                        }]
                    }, {
                        type: "fieldset",
                        title: "PRODUCT_REJECTION_REASON",
                        condition: "model.lead.interestedInProduct==='NO'||model.lead.eligibleForProduct ==='NO'",
                        items: [{
                            key: "lead.productRejectReason",
                            type: "select",
                            condition: "model.lead.interestedInProduct==='NO'",
                            titleMap: {
                                "Has many running loans": "Has many running loans",
                                "Available from banks": "Available from banks",
                                "Not planned for now": "Not planned for now",
                                "Available from banks": "Available from banks",
                                "Interest rate is not satisfactory": "Interest rate is not satisfactory",
                                "Too many documents": "Too many documents",
                                "Interested only for cash collection": "Interested only for cash collection"
                            }
                        }, {
                            key: "lead.productRejectReason",
                            type: "select",
                            condition: "model.lead.eligibleForProduct ==='NO'",
                            titleMap: {
                                "High Interest rate": "High Interest rate",
                                "Negative": "Negative",
                                "Not Kinara's target segment": "Not Kinara's target segment",
                                "Not having proper documents": "Not having proper documents",
                            }
                        }, {
                            key: "lead.additionalRemarks",
                        }, ]
                    }, {
                        type: "fieldset",
                        title: "LEAD_STATUS",
                        items: [{
                            key: "lead.leadStatus",
                            //type: "select",
                            readonly: true,
                            /*titleMap: {
                                "Screening": "Screening",
                                "FollowUp": "FollowUp",
                                "Incomplete": "Incomplete",
                                "Reject": "Reject"
                            },*/
                            onChange: "actions.changeStatus(modelValue, form, model)"
                        }]
                    }]
                },

                {
                    type: "box",
                    title: "LEAD_INTERACTIONS",
                    items: [{
                        key: "lead.leadInteractions",
                        type: "array",
                        startEmpty: true,
                        title: "LEAD_INTERACTIONS",
                        items: [{
                            key: "lead.leadInteractions[].interactionDate",
                            type: "date",
                        }, {
                            key: "lead.leadInteractions[].loanOfficerId",
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
                            "key": "lead.leadInteractions[].location",
                            "type": "geotag",
                            "latitude": "latitude",
                            "longitude": "longitude",
                            "condition": "model.lead.leadInteractions[arrayIndex].typeOfInteraction == 'Visit'",
                        }, {
                            "key": "lead.leadInteractions[].picture",
                            "type": "file",
                            "fileType": "image/*",
                            "condition": "model.lead.leadInteractions[arrayIndex].typeOfInteraction === 'Visit'",
                        }, ]
                    }]
                },


                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Submit"
                    }]
                },
            ],

            schema: function() {
                return Lead.getLeadSchema().$promise;
            },

            actions: {
                changeStatus: function(modelValue, form, model) {

                    if (model.lead.interestedInProduct == 'NO' || model.lead.eligibleForProduct == 'NO') {
                        model.lead.leadStatus = "Reject";
                    } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == 'In this week') {
                        model.lead.leadStatus = "Screening";
                    } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == 'In this month' || model.lead.productRequiredBy == 'Next 2 -3 months' || model.lead.productRequiredBy == 'Next 4-6 months') {
                        model.lead.leadStatus = "FollowUp";
                    } else {
                        model.lead.leadStatus = "Incomplete";
                    }
                },
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
                    var centres = formHelper.enum('centre').data;
                    for (var i = 0; i < centres.length; i++) {
                        if ((centres[i].code) == reqData.lead.centreId) {
                            reqData.lead.centreName = centres[i].name;
                        }
                    }
                    if (reqData.lead.id) {
                        if (reqData.lead.leadStatus == "FollowUp") {
                            LeadHelper.followData(reqData).then(function(resp) {
                                $state.go('Page.LeadDashboard', null);
                            });
                        } else {
                            LeadHelper.proceedData(reqData).then(function(resp) {
                                $state.go('Page.LeadDashboard', null);
                            }, function(err) {
                                Utils.removeNulls(res.lead, true);
                                model.lead = res.lead;
                            });
                        }
                    } else {
                        LeadHelper.saveData(reqData).then(function(res) {
                            LeadHelper.proceedData(res).then(function(resp) {
                                $state.go('Page.LeadDashboard', null);
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