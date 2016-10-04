irf.pageCollection.factory(irf.page("DocumentTracking.DocumentFilling"), ["$log", "$state", "Enrollment", "lead", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries",


    function($log, $state, Enrollment, lead, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
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
                model.lead.ActionTakenBy = model.lead.ActionTakenBy || SessionStore.getLoginname();
                model = Utils.removeNulls(model, true);
                model.lead.BranchName = SessionStore.getBranch();
                $log.info("create new lead generation page ");
            },

            modelPromise: function(pageId, _model) {
                return $q.resolve({
                    lead: {
                        Name: "Ram",
                        id: 1,
                        Applicant: {
                            MobileNumber1: 9888888888
                        },
                        gender: "Male"
                    }
                });
            },

            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return []
            },

            form: [{
                    "type": "box",
                    "title": "LEAD_PROFILE",
                    "items": [{
                            key: "lead.BranchName",
                            title: "BRANCH_NAME",
                            readonly: true
                        }, {
                            key: "lead.Sender",
                            title: "CENTER",
                            "enumCode": "centre",
                            type: "select",
                        }, {
                            key: "lead.id",
                            condition: "model.lead.id",
                            title: "LEAD_ID",
                            readonly: true
                        }, {
                            key: "lead.urnNo",
                            condition: "model.lead.urnNo",
                            title: "URN_NO",
                            readonly: true
                        }, {
                            type: "fieldset",
                            title: "LEAD_DETAILS",
                            items: [{
                                    key: "lead.Name",
                                    title: "LEAD_NAME"

                                }, {
                                    key: "lead.Applicant.Entitytype",
                                    type: "select",
                                    title: "ENTITY_TYPE",
                                    titleMap: {
                                        "Individual": "Individual",
                                        "Enterprise": "Enterprise"
                                    }

                                }, {
                                    type: "fieldset",
                                    title: "ENTERPRISE_DETAILS",
                                    condition: "model.lead.Applicant.Entitytype === 'Enterprise'",
                                    items: [{
                                        key: "lead.Business.BusinessName",
                                        title: "BUSINESS_NAME"
                                    }, {
                                        key: "lead.Business.BusinessType",
                                        title: "BUSINESS_TYPE"
                                    }, {
                                        key: "lead.Business.BusinessActivity",
                                        title: "BUSINESS_ACTIVITY"
                                    }, {
                                        key: "lead.Business.CompanyOperatingSince",
                                        type: "DATE"
                                    }, {
                                        key: "lead.Business.ownership",
                                        title: "OWNERSHIP",
                                        type: "select",
                                        enumCode: "ownership"
                                    }, {
                                        key: "lead.Business.companyRegistered",
                                        type: "radios",
                                        titleMap: {
                                            "YES": "Yes",
                                            "NO": "No"
                                        },
                                        title: "IS REGISTERED"
                                    }]
                                }, {
                                    type: "fieldset",
                                    title: "INDIVIDUAL_DETAILS",
                                    condition: "model.lead.Applicant.Entitytype === 'Individual'",
                                    items: [{
                                            key: "lead.gender",
                                            title: "GENDER",
                                            type: "radios"
                                        }, {
                                            key: "lead.age",
                                            title: "AGE",
                                            type: "number",
                                            "onChange": function(modelValue, form, model) {
                                                if (model.lead.age > 0) {
                                                    if (model.lead.dateOfBirth) {
                                                        model.lead.dateOfBirth = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-') + moment(model.lead.dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                                    } else {
                                                        model.lead.dateOfBirth = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-MM-DD');
                                                    }
                                                }
                                            }
                                        }, {
                                            key: "lead.dateOfBirth",
                                            title: "DATE_OF_BIRTH",
                                            type: "date",
                                            "onChange": function(modelValue, form, model) {
                                                if (model.lead.dateOfBirth) {
                                                    model.lead.age = moment().diff(moment(model.lead.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                                }
                                            }
                                        }, {
                                            key: "lead.maritalStatus",
                                            title: "MARITAL_STATUS",
                                            type: "select"
                                        }, {
                                            key: "lead.educationStatus",
                                            type: "select",
                                            title: "EDUCATION_STATUS"
                                        }, {
                                            key: "lead.incomes[].incomeSource",
                                            type: "select",
                                            titleMap: {
                                                "Occupation1": "Occupation1",
                                                "Occupation2": "Occupation2",
                                            }
                                        },
                                        "lead.incomes[].incomeEarned", {
                                            key: "lead.incomes[].frequency",
                                            type: "select"
                                        }
                                    ]
                                }, {
                                    type: "fieldset",
                                    title: "CONTACT_DETAILS",
                                    condition: "model.lead.Applicant.Entitytype === 'Individual'||model.lead.Applicant.Entitytype === 'Enterprise'",
                                    items: [{
                                            key: "lead.Applicant.MobileNumber1",
                                            title: "MOBILE_NUMBER1"
                                        }, {
                                            key: "lead.Applicant.AlternateMobileNumber",
                                            title: "ALTERNATE_MOBILE_NUMBER"
                                        }, {
                                            key: "lead.Business.BusinessAddressLine1",
                                            title: "ADDRESS_LINE1"
                                        }, {
                                            key: "lead.Business.AddressLine2",
                                            title: "ADDRESS_LINE2"
                                        },
                                        "lead.Business.District", {
                                            key: "lead.Business.PinCode",
                                            title: "PINCODE",
                                            type: "lov",
                                            fieldType: "number",
                                            autolov: true,
                                            inputMap: {
                                                "pincode": "lead.Business.PinCode",
                                                "district": {
                                                    key: "lead.Business.District"
                                                },
                                                "state": {
                                                    key: "lead.Business.State"
                                                }
                                            },
                                            outputMap: {

                                                "pincode": "lead.Business.PinCode",
                                                "district": "lead.Business.District",
                                                "state": "lead.Business.State"
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
                                        "lead.Business.State", {
                                            "key": "lead.latitude",
                                            "title": "LOCATION",
                                            "type": "geotag",
                                            "latitude": "latitude",
                                            "longitude": "longitude",
                                        },
                                        "lead.Business.Area",
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
                        key: "lead.ProductCategory",
                        title: "PRODUCT_CATEGORY",
                        type: "select",
                        titleMap: {
                            "Asset": "Asset",
                            "Liability": "Liability",
                            "others": "others"
                        }
                    }, {
                        key: "lead.productsubcategory",
                        title: "PRODUCT_SUBCATEGORY",
                        type: "select",
                        titleMap: {
                            "Loan": "Loan",
                            "SA1": "SA1",
                            "SA2": "SA2",
                            "SL1": "SL1",
                            "SL2": "SL2",
                            "SL3": "SL3",
                            "SO1": "SO1",
                            "SO2": "SO2",
                            "SO3": "SO3",
                        }
                    }, {
                        key: "lead.InterestedInProduct",
                        title: "INTERESTED_IN_PRODUCT",
                        type: "select",
                        titleMap: {
                            "Yes": "Yes",
                            "No": "No"
                        },
                        "onChange": function(modelValue, form, model) {
                            if (model.lead.InterestedInProduct == 'No' || model.lead.EligibleForProduct == 'No') {
                                model.lead.Status = "Reject";
                            } else if (model.lead.ProductRequiredBy == 'In this week') {
                                model.lead.Status = "Screening";
                            } else if (model.lead.InterestedInProduct =='Yes' && model.lead.ProductRequiredBy == 'In this month' || model.lead.ProductRequiredBy == 'Next 2 -3 months' || model.lead.ProductRequiredBy == 'Next 4-6 months') {
                                model.lead.Status = "FollowUp";

                            } else {
                                model.lead.Status = "Incomplete";
                            }
                        }
                    }, {
                        key: "lead.ProductRequiredBy",
                        type: "select",
                        title: "PRODUCT_REQUIRED_BY",
                        condition: "model.lead.InterestedInProduct==='Yes'",
                        titleMap: {
                            "In this week": "In this week",
                            "In this month": "In this month",
                            "Next 2 -3 months": "Next 2 -3 months",
                            "Next 4-6 months": "Next 4-6 months",

                        },
                        "onChange": function(modelValue, form, model) {
                            if (model.lead.InterestedInProduct == 'No' || model.lead.EligibleForProduct == 'No') {
                                model.lead.Status = "Reject";
                            } else if (model.lead.ProductRequiredBy == 'In this week') {
                                model.lead.Status = "Screening";
                            } else if (model.lead.InterestedInProduct === 'Yes' && model.lead.ProductRequiredBy === 'In this month' || model.lead.ProductRequiredBy === 'Next 2 -3 months' || model.lead.ProductRequiredBy === 'Next 4-6 months') {
                                model.lead.Status = "FollowUp";

                            } else {
                                model.lead.Status = "Incomplete";
                            }
                        }
                    }, {
                        key: "lead.DateOfScreening",
                        title: "DATE_OF_SCREENING",
                        condition: "(model.lead.InterestedInProduct==='Yes' && model.lead.ProductRequiredBy ==='In this week')",
                        type: "date",


                    }, {
                        key: "lead.FollowUpdate",
                        title: "FOLLOW_UP_DATE",
                        condition: "(model.lead.InterestedInProduct==='Yes' && model.lead.ProductRequiredBy === 'In this month'||model.lead.ProductRequiredBy ==='Next 2 -3 months'|| model.lead.ProductRequiredBy === 'Next 4-6 months')",
                        type: "date",

                    }, {
                        key: "lead.LoanPurpose",
                        title: "LOAN_PURPOSE",
                        condition: "model.lead.InterestedInProduct==='Yes'",
                        type: "select",
                        titleMap: {
                            "AssetPurchase": "AssetPurchase",
                            "WorkingCapital": "WorkingCapital",
                            "BusinessDevelopment": "BusinessDevelopment",
                            "LineOfCredit": "LineOfCredit",

                        }
                    }, {
                        key: "lead.LoanamountRequested",
                        title: "LOAN_AMOUNT_REQUIRED",
                        condition: "model.lead.InterestedInProduct==='Yes'",
                        title: "Loan_Amount_Requested"

                    }, {
                        type: "fieldset",
                        title: "PRODUCT_REJECTION_REASON",
                        condition: "model.lead.InterestedInProduct==='No'",
                        items: [{
                            key: "lead.Reason",
                            title: "Reason For Rejection",
                            type: "select",
                            titleMap: {
                                "Reason1": "Reason1",
                                "Reason2": "Reason2"
                            }
                        }, {
                            key: "lead.AdditionalRemarks",
                            title: "Additional Remarks"
                        }, ]
                    }, {
                        type: "fieldset",
                        condition: "model.lead.InterestedInProduct==='Yes'",
                        title: "PRODUCT_ELIGIBILITY",
                        items: [{
                                key: "lead.EligibleForProduct",
                                title: "ELIGIBLE_FOR_PRODUCT ?",
                                type: "radios",
                                titleMap: {
                                    "Yes": "Yes",
                                    "No": "No"
                                },
                                "onChange": function(modelValue, form, model) {
                                    if (model.lead.InterestedInProduct == 'No' || model.lead.EligibleForProduct == 'No') {
                                        model.lead.Status = "Reject";
                                    } else if (model.lead.ProductRequiredBy == 'In this week') {
                                        model.lead.Status = "Screening";
                                    } else if (model.lead.InterestedInProduct === 'Yes' && model.lead.ProductRequiredBy === 'In this month' || model.lead.ProductRequiredBy === 'Next 2 -3 months' || model.lead.ProductRequiredBy === 'Next 4-6 months') {
                                        model.lead.Status = "FollowUp";

                                    } else {
                                        model.lead.Status = "Incomplete";
                                    }
                                }
                            }, {
                                key: "lead.ReasonForRejection",
                                condition: "model.lead.EligibleForProduct ==='No'",
                                type: "select",
                                title: "REASON_FOR_REJECTION",
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
                            key: "lead.Status",
                            title: "LEAD_STATUS",
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
                        key: "lead.currentDate",
                        title: "DATE_OF_INTERACTION",
                        type: "date",
                        readonly: true
                    }, {
                        key: "lead.ActionTakenBy",
                        title: "ACTION_TAKEN_BY",
                    }, {
                        key: "lead.TypeOfInteraction",
                        title: "TYPE_OF_INTERACTION",
                        type: "select",
                        titleMap: {
                            "Call": "Call",
                            "Visit": "Visit",
                        }
                    }, {
                        key: "lead.CustomerResponse",
                        title: "CUSTOMER_RESPONSE"
                    }, {
                        key: "lead.AdditionalRemark",

                        title: "ADDITIONAL_REMARKS"
                    }, {
                        "key": "lead.latitude",
                        "title": "LOCATION_OF_INTERACTION",
                        "type": "geotag",
                        "latitude": "latitude",
                        "longitude": "longitude",
                        "condition": "model.lead.TypeOfInteraction === 'Visit'"
                    }, {
                        "key": "lead.photo",
                        title: "CUSTOMER_PHOTO",
                        "type": "file",
                        "fileType": "image/*",
                        "condition": "model.lead.TypeOfInteraction === 'Visit'"
                    }, ]
                },

                {
                    type: "box",
                    title: "PREVIOUS_INTERACTIONS",
                    condition: "model.lead.id",
                    items: [{
                        key: "lead.Interaction",
                        title: "INTERACTION_HISTORY",
                        type: "array",
                        remove: null,
                        add: null,
                        /* startEmpty: true, */
                        items: [{
                            key: "lead.Interaction[].DateOfInteraction",
                            title: "DATE_OF_INTERACTIONS",
                            type: "date",
                            readonly: true
                        }, {
                            key: "lead.Interaction[].ActionTakenBy",

                            title: "ACTION_TAKEN_BY",
                            readonly: true
                        }, {
                            key: "lead.Interaction[].Status",
                            title: "LEAD_STATUS",
                            readonly: true
                        }, {
                            key: "lead.Interaction[].TypeOfInteraction",
                            title: "TYPE_OF_INTERACTION",
                            type: "select",
                            titleMap: {
                                "Call": "Call",
                                "Visit": "Visit",

                            },
                            readonly: true
                        }, {
                            key: "lead.Interaction[].CustomerResponse",
                            title: "CUSTOMER_RESPONSE",
                            readonly: true
                        }, {
                            key: "lead.Interaction[].AdditionalRemark",
                            title: "ADDITIONAL_REMARKS",
                            readonly: true
                        }, {
                            "key": "lead.Interaction[].latitude",
                            "title": "LOCATION_OF_INTERACTION",
                            "type": "geotag",
                            "latitude": "latitude",
                            "longitude": "longitude",
                            "condition": "model.lead.TypeOfInteraction === 'Visit'",
                            readonly: true
                        }, {
                            "key": "lead.Interaction[].photo",
                            "title": "CUSTOMER_PHOTO",
                            "type": "file",
                            "fileType": "image/*",
                            "condition": "model.lead.TypeOfInteraction === 'Visit'",
                            readonly: true
                        }, ]
                    }]
                },

                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Submit"
                    }, ]
                },
            ],

            schema: function() {
                return lead.getLeadSchema().$promise;
            },

            actions: {
                preSave: function(model, form, formName) {
                    $log.info("Inside save()");
                    var deferred = $q.defer();
                    if (model.lead.Name) {
                        deferred.resolve();
                    } else {
                        irfProgressMessage.pop('LeadGeneration-save', 'Applicant Name is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },

                submit: function(model, form, formName) {
                    $log.info("Inside submit()");
                    irfProgressMessage.pop('LeadGeneration-save', 'Lead is successfully created', 3000);
                    $log.warn(model);
                }
            }
        };
    }
]);