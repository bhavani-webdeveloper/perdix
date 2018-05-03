define({
    pageUID: "management.product.NewProduct",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "Product", "PageHelper", "$state", "SessionStore", "Utils", "irfNavigator", "$stateParams", "RolesPages", "$filter", "Enrollment", "Queries", "$q", "$timeout"],
    $pageFn: function($log, formHelper, Product, PageHelper, $state, SessionStore, Utils, irfNavigator, $stateParams, RolesPages, $filter, Enrollment, Queries, $q, $timeout) {
        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "PRODUCT_MAINTENANCE",
            initialize: function(model, form, formCtrl) {
                model.product = model.product || {};
                model.userLoginDate = SessionStore.getCBSDate();
                model.allPurposes = [];
                var productId = $stateParams.pageId;
                PageHelper.showLoader();
                Queries.getAllLoanPurposesMapping().then(function(value) {
                    PageHelper.hideLoader();
                    model.product.purposes = model.product.purposes || value;
                    if (!productId) {
                        model.allPurposes = model.product.purposes;
                    } else {
                        PageHelper.showLoader();
                        Product.get({
                                id: productId
                            },
                            function(res) {
                                PageHelper.hideLoader();
                                $log.info(res);
                                model.allPurposes = model.product.purposes;
                                model.product = res;
                                model.selectedPurposes = res.purposes;
                                _.filter(model.allPurposes, function(allPurposesValues) {
                                    _.filter(model.selectedPurposes, function(selectedPurposesValues) {
                                        if (allPurposesValues.purpose1 == selectedPurposesValues.purpose1 && allPurposesValues.purpose2 == selectedPurposesValues.purpose2 &&
                                            allPurposesValues.purpose3 == selectedPurposesValues.purpose3) {
                                            allPurposesValues.$selected = true;
                                        }
                                    })
                                });
                            });
                    };
                }, function(err) {
                    $log.info("allPurposeValues are not available");
                });
            },
            form: [{
                "type": "box",
                "title": "PRODUCT_INFORMATION",
                "items": [{
                    "key": "product.productCategory",
                    "type": "select",
                    "enumCode": "loan_product_category",
                    "required": true,
                }, {
                    "key": "product.productCode",
                    "type": "string",
                }, {
                    "key": "product.productName",
                    "type": "string",
                }, {
                    "key": "product.productType",
                    "type": "select",
                    "titleMap": [{
                        "name": "EQ",
                        "value": "EQ"
                    }, {
                        "name": "OD",
                        "value": "OD"
                    }, {
                        "name": "BULLET",
                        "value": "BULLET",
                    }]
                }, {
                    "key": "product.partnerCode",
                    "type": "select",
                    "enumCode": "partner",
                }, {
                    "key": "product.loanType",
                    "type": "select",
                    "titleMap": [{
                        "name": "JLG",
                        "value": "JLG"
                    }, {
                        "name": "JEWEL",
                        "value": "JEWEL"
                    }, {
                        "name": "SECURED",
                        "value": "SECURED",
                    }, {
                        "name": "UNSECURED",
                        "value": "UNSECURED",
                    }]
                }, {
                    "key": "product.frequency",
                    "type": "select",
                    "titleMap": [{
                        "name": "Monthly",
                        "value": "M"
                    }, {
                        "name": "Weekly",
                        "value": "W"
                    }, {
                        "name": "Fornightly",
                        "value": "F",
                    }, {
                        "name": "Quarterly",
                        "value": "Q",
                    }, {
                        "name": "Half Yearly",
                        "value": "H",
                    }, {
                        "name": "Yearly",
                        "value": "Y",
                    }, {
                        "name": "Daily",
                        "value": "D",
                    }]
                }, {
                    "key": "product.processType",
                    "type": "select",
                    "titleMap": [{
                        "name": "OWN",
                        "value": "OWN"
                    }, {
                        "name": "BC",
                        "value": "BC"
                    }],
                    "onChange": function(modelValue, form, model) {
                        if (model.product.processType == 'BC') {
                            model.product.tenureSlabs = [];
                            model.product.amountSlabs = [];

                        }
                    }
                }, {
                    "key": "product.effectiveDate",
                    "type": "date",
                    //     "pickadate" : {
                    //     //"min" : "1995-09-01",
                    //     "max" : new Date(),
                    //     "modelFormat" : "yyyy-mm-dd", // this is the only "non-standard" pickadate options
                    //     "format": "d mmmm, yyyy"
                    // }
                    // "min": new Date(),
                }, {
                    "key": "product.expiryDate",
                    "type": "date",
                }, {
                    "key": "product.insuranceRateCode",
                    "type": "select",
                    "enumCode":"fee_master"
                }, {
                    "key": "product.insuranceRequired",
                }, {
                    "key": "product.insuranceType",
                    "type": "select",
                    "titleMap": [{
                        "name": "Term Life Insurance",
                        "value": "TLI"
                    }, {
                        "name": "Personal Accident Insurance",
                        "value": "PAI"
                    }, {
                        "name": "Live Stoke Insurance",
                        "value": "LSI",
                    }, {
                        "name": "Shop Keeper Insurance",
                        "value": "SKI",
                    }, {
                        "name": "Health Insurance",
                        "value": "HI",
                    }]
                }]
            }, {
                "type": "box",
                "title": "INTEREST_RATE",
                "items": [{
                    "key": "product.minInterestRate",
                    "type": "number",
                    "schema": {
                        "minimum": 0,
                        "maximum": 99.99
                    }
                }, {
                    "key": "product.maxInterestRate",
                    "type": "number"
                }],
            }, {
                "type": "box",
                "title": "GROUP_SIZE",
                "condition": "model.product.loanType === 'JLG'",
                "items": [{
                    "key": "product.groupMemberMinimum",
                    "type": "number"
                }, {
                    "key": "product.groupMemberMaximum",
                    "type": "number",
                }],
            }, {
                "type": "box",
                "title": "LOAN_TENURE_DETAILS",
                "condition": "model.product.processType === 'BC'",
                "items": [{
                    "key": "product.emiLookupCode",
                    "title": "PICK EMI code",
                    "type": "lov",
                    "required": true,
                    type: "lov",
                    autolov: true,
                    bindMap: {},
                    searchHelper: formHelper,
                    lovonly: true,
                    search: function(inputModel, form, model, context) {
                        return Queries.getLookUpCodeByFrequencyList(model.product.frequency)
                            .then(function(out) {
                                return $q.resolve({
                                    headers: {
                                        "x-total-count": out.length
                                    },
                                    body: out
                                });
                            })
                    },
                    onSelect: function(value, model, context) {
                        model.product.emiLookupCode = value.lookup_code;
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.lookup_code
                        ];
                    }
                }],
            }, {
                "type": "box",
                "title": "LOAN_TENURE_DETAILS",
                "condition": "model.product.processType  != 'BC'",
                "items": [{
                    "key": "product.tenureFrom",
                    "type": "number",
                    "required":true
                }, {
                    "key": "product.tenureTo",
                    "type": "number",
                     "required":true
                }, {
                    "type": "section",
                    "html": "<h3 style='text-align:center'>OR</h3>"
                }, {
                    "key": "product.tenureSlabs",
                    "type": "array",
                    "startEmpty": true,

                    "items": [{
                        "key": "product.tenureSlabs[].tenure",
                        "required":true,
                    }]
                }],
            }, {
                "type": "box",
                "title": "LOAN_AMOUNT_DETAILS",
                "condition": "model.product.processType  != 'BC'",
                "items": [{
                    "key": "product.amountFrom",
                    "type": "number",
                    "disable":true,
                    "required":true
                }, {
                    "key": "product.amountTo",
                    "type": "number",
                    "required":true
                }, {
                    "key": "product.amountMultiples",
                    "type": "number",
                    "required":true
                }, {
                    "type": "section",
                    "html": "<h3 style='text-align:center'>OR</h3>"
                }, {
                    "key": "product.amountSlabs",
                    "type": "array",
                    "startEmpty": true,
                    "items": [{
                        "key": "product.amountSlabs[].amount",
                        "required":true
                    }]
                }],
            }, {
                "type": "box",
                "title": "LOAN_PRODUCT_PARAMETERS",
                "items": [{
                    "key": "product.sbAccountCheckRequired",
                }, {
                    "key": "product.urnCheckRequired"
                }, {
                    "key": "product.nomineeRequired"
                }, {
                    "key": "product.coBorrowerRequired"
                }, {
                    "key": "product.collateralRequired"
                }, {
                    "key": "product.documentTrackingRequired"
                }, {
                    "key": "product.applicationFormUploadRequired"
                }, {
                    "key": "product.checkerRequired"
                }, {
                    "key": "product.chk1FileUploadRequired"
                }, {
                    "key": "product.numberOfGuarantors",
                    "type": "select",
                    "required": true,
                    "titleMap": [{
                        "name": 0,
                        "value": 0
                    }, {
                        "name": 1,
                        "value": 1
                    }, {
                        "name": 2,
                        "value": 2
                    }]
                }],
            }, {
                "type": "box",
                "title": "LUC_DETAILS",
                "items": [{
                    "key": "product.lucCycle",
                    "type": "select",
                    "titleMap": [{
                        "name": "ONCE",
                        "value": "ONCE"
                    }, {
                        "name": "RECURRING",
                        "value": "RECURRING"
                    }]

                }, {
                    "key": "product.lucDays",
                    "type": "number",
                }, {
                    "key": "product.lucForDisbursement",
                    "type": "select",
                    "titleMap": [{
                        "name": "FIRST_DISP",
                        "value": "LAST_DISP"
                    }, {
                        "name": "LAST_DISP",
                        "value": "LAST_DISP"
                    }]
                }, {
                    "key": "product.creditMonitoringCycle",
                    "type": "select",
                    "titleMap": [{
                        "name": "ONCE",
                        "value": "ONCE"
                    }, {
                        "name": "RECURRING",
                        "value": "RECURRING"
                    }]
                }, {
                    "key": "product.creditMonitoringDays",
                    "type": "number",
                }],
            }, {
                "type": "box",
                //  "condition": "model.product.purposes.length",
                "required" : true,
                "title": "LOAN_PURPOSES",
                "items": [{
                    key: "product.allLoanPurposesApplicable",
                    "onChange": function(modelValue, form, model) {
                        $log.info(model.product.allLoanPurposesApplicable == true)
                        var ap = model.allPurposes;
                        model.allPurposes = null;
                        $timeout(function() {
                            for (i in ap) {
                                if (ap[i].$selected === undefined || ap[i].$selected == false || model.product.allLoanPurposesApplicable == true) {
                                    ap[i].$selected = true;
                                } else {
                                    ap[i].$selected = false;
                                }
                            }
                            model.allPurposes = ap;
                        });
                    }
                }, {
                    type: "tableview",
                    listStyle: "table",
                    key: "allPurposes",
                    title: "PURPOSE",
                    required : true,
                    selectable: true,
                    editable: true,
                    paginate: false,
                    searching: false,
                    getColumns: function() {
                        return [{
                            title: 'PURPOSE1',
                            data: 'purpose1',
                            // render: function(data, type, full, meta) {
                            //     return (full.purpose1 === 'Business Development' ? '<input type="checkbox" value= data.Checked checked>' : '<input type="checkbox" value="Checked">') + data;
                            // }
                        }, {
                            title: 'PURPOSE2',
                            data: 'purpose2'
                        }, {
                            title: 'PURPOSE3',
                            data: 'purpose3'
                        }]
                    },
                    getActions: function(item) {
                        return [];
                    }
                }]
            }, {
                "type": "box",
                "title": "CUSTOM_TEXT_FIELDS",
                "items": [{
                    "key": "product.userDefinedFields",
                    "type": "array",
                    "items": [{
                        "key": "product.userDefinedFields[].label",
                        "required": true
                    }, {
                        "key": "product.userDefinedFields[].dataType",
                        "required":true,
                        "type": "select",
                        "titleMap": [{
                            "name": "ALPHABET",
                            "value": "ALPHABET"
                        }, {
                            "name": "NUMERIC",
                            "value": "NUMERIC"
                        }, {
                            "name": "ALPHANUMERIC",
                            "value": "ALPHANUMERIC",
                        }, {
                            "name": "SPECIAL",
                            "value": "SPECIAL",
                        }]
                    }, {
                        "key": "product.userDefinedFields[].size",
                        "required":true
                    }, {
                        "key": "product.userDefinedFields[].isMandatory"
                    }, {
                        "key": "product.userDefinedFields[].valueForDropDown",
                        "type": "select",
                        "enumCode": "partner"
                    }]
                }],
            }, {
                "type": "box",
                "title": "CUSTOM_DATA_FIELDS",
                "items": [{
                    "key": "product.userDefinedDateFields",
                    "type": "array",
                    "items": [{
                        "key": "product.userDefinedDateFields[].label"
                    }, {
                        "key": "product.userDefinedDateFields[].isMandatory"
                    }]
                }]
            }, {
                "type": "box",
                "title": "MODULE_CONFIG_MASTERS",
                "items": [{
                    "key": "product.moduleConfigMasters",
                    "type": "array",
                    "items": [{
                        "key": "product.moduleConfigMasters[].agentModuleStatus",
                    }, {
                        "key": "product.moduleConfigMasters[].bankId",
                        "type": "select",
                        "enumCode": "bank",
                        "required":true
                    }, {
                        "key": "product.moduleConfigMasters[].cmsProductName",
                        "type": "string",
                    }, {
                        "key": "product.moduleConfigMasters[].moduleStatus"
                    }, {
                        "key": "product.moduleConfigMasters[].smsEnabled"
                    }]
                }],
            }, {
                "type": "box",
                "title": "LMS_PRODUCT_MASTER",
                "items": [{
                    "key": "product.lmsProductMasters",
                    "type": "array",
                    "items": [{
                        "key": "product.lmsProductMasters[].bankId",
                        "type": "select",
                        "enumCode": "bank",
                        "required": true,
                    }, {
                        "key": "product.lmsProductMasters[].investorId",
                        "type": "select",
                        "enumCode": "investor_id",
                        "required": true,
                    }, {
                        "key": "product.lmsProductMasters[].smsProductName",
                        "type": "string",
                    }, {
                        "key": "product.lmsProductMasters[].status",
                        "type": "select",
                        "title": "STATUS",
                        "titleMap": [{
                            "name": "ACTIVE",
                            "value": "active"
                        }, {
                            "name": "INACTIVE",
                            "value": "inActive"
                        }]
                    }]

                }],
            }, {
                "type": "actionbox",
                "condition": "!model.product.id",
                "items": [{
                    "type": "submit",
                    "title": "CREATE_PRODUCT"
                }]
            }, {
                "type": "actionbox",
                "condition": "model.product.id",
                "items": [{
                    "type": "submit",
                    "title": "UPDATE_PRODUCT"
                }]
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "product": {
                        "type": "object",
                        "title": "LOAN_PRODUCT",
                        "properties": {
                            "productCode": {
                                "type": "string",
                                "title": "PRODUCT_CODE"
                            },
                            "productCategory": {
                                "type": "string",
                                "title": "PRODUCT_CATEGORY",
                            },
                            "productName": {
                                "type": "string",
                                "title": "PRODUCT_NAME"
                            },
                            "productType": {
                                "type": "string",
                                "title": "PRODUCT_TYPE"
                            },
                            "partnerCode": {
                                "type": "string",
                                "title": "PARTNER_CODE"
                            },
                            "loanType": {
                                "type": "string",
                                "title": "LOAN_TYPE"
                            },
                            "frequency": {
                                "type": "string",
                                "title": "FREQUENCY"
                            },
                            "processType": {
                                "type": "string",
                                "title": "PROCESS_TYPE"
                            },
                            "effectiveDate": {
                                "title": "EFFECTIVE_DATE",
                                "type": "string",
                                "min": new Date()
                            },
                            "expiryDate": {
                                "type": "string",
                                "title": "EXPIRY_DATE"
                            },
                            "minInterestRate": {
                                "type": "number",
                                "title": "MIN_INTEREST_RATE"
                            },
                            "maxInterestRate": {
                                "type": "number",
                                "title": "MAX_INTEREST_RATE",
                                "minimum": 0,
                                "maximum": 99.99
                            },
                            "groupMemberMinimum": {
                                "type": "number",
                                "title": "MINIMUM_MEMBERS",
                                "maxLength": 2,
                            },
                            "groupMemberMaximum": {
                                "type": "number",
                                "title": "MAXIMUM_MEMBERS",
                                "maxLength": 2,
                            },
                            "tenureFrom": {
                                "type": "number",
                                "title": "MIN_TENURE",
                                "maxLength": 2,
                            },
                            "tenureTo": {
                                "type": "number",
                                "title": "MAX_TENURE",
                                "maxLength": 2,
                            },
                            "tenureSlabs": {
                                "type": "array",
                                "title": "TENURE_SLABS",
                                "items": {
                                    "type": "object",
                                    "title": "TENURE",
                                    "properties": {
                                        "tenure": {
                                            "type": ["string", "null"],
                                            "title": "TENURE",
                                        },
                                    }
                                }
                            },
                            "insuranceRateCode": {
                                "type": "string",
                                "title": "INSURANCE_RATE_CODE"
                            },
                            "amountFrom": {
                                "type": "number",
                                "title": "MINIMUM"
                            },
                            "amountTo": {
                                "type": "number",
                                "title": "MAXIMUM"
                            },
                            "amountMultiples": {
                                "type": "number",
                                "title": "IN_MULTIPLES_OF"
                            },

                            "amountSlabs": {
                                "type": "array",
                                "title": "LOAN_AMOUNT_SLABS",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "amount": {
                                            "type": ["string", "null"],
                                        },
                                    }
                                }
                            },
                            "insuranceRequired": {
                                "type": "boolean",
                                "title": "INSURANCE_REQUIRED"
                            },
                            "insuranceType": {
                                "type": ["string", 'null'],
                                "title": "INSURANCE_TYPE"
                            },
                            "sbAccountCheckRequired": {
                                "type": "boolean",
                                "title": "SB_ACCOUNT_REQUIRED"
                            },
                            "urnCheckRequired": {
                                "type": "boolean",
                                "title": "URN_REQUIRED"
                            },
                            "nomineeRequired": {
                                "type": "boolean",
                                "title": "NOMINEE_REQUIRED"
                            },
                            "coBorrowerRequired": {
                                "type": "boolean",
                                "title": "CO_BORROWER_REQUIRED"
                            },
                            "collateralRequired": {
                                "type": "boolean",
                                "title": "COLLATERAL_REQUIRED"
                            },
                            "documentTrackingRequired": {
                                "type": "boolean",
                                "title": "DOCUMENT_TRACKING_REQUIRED"
                            },
                            "applicationFormUploadRequired": {
                                "type": "boolean",
                                "title": "APPLICATION_UPLOAD_REQUIRED"
                            },
                            "checkerRequired": {
                                "type": "boolean",
                                "title": "CHECK_PROCESS_REQUIRED"
                            },
                            "chk1FileUploadRequired": {
                                "type": "boolean",
                                "title": "CHK1_FILE_UPLOAD_REQUIRED"
                            },
                            "numberOfGuarantors": {
                                "type": "number",
                                "title": "GUARANTORS_REQUIRED"
                            },
                            "allLoanPurposesApplicable": {
                                "type": "boolean",
                                "title": "ALL_LOAN_PURPOSE_APPLICABLE"
                            },
                            "lucCycle": {
                                "type": ["string", "null"],
                                "title": "LUC_CYCLE"
                            },
                            "lucDays": {
                                "type": ["number", "null"],
                                "title": "LUC_DAYS"
                            },
                            "lucForDisbursement": {
                                "type": ["string", "null"],
                                "title": "LUC_FOR_DISBURSEMENT"
                            },
                            "creditMonitoringCycle": {
                                "type": ["string", "null"],
                                "title": "CREDIT_MONITORING_CYCLE"
                            },
                            "creditMonitoringDays": {
                                "type": ["number", "null"],
                                "title": "CREDIT_MONITORING_DAYS"
                            },
                            "selectField": {
                                "type": "boolean",
                                "title": "select"
                            },
                            "leadInteractions": {
                                "type": "array",
                                "title": "Lead Interactions",
                                "items": {
                                    "type": "object",
                                    "required": ["interactionDate"],
                                    "properties": {
                                        "interactionDate": {
                                            "type": ["string", "null"],
                                            "title": "INTER_ACTION_DATE"
                                        },
                                        "loanOfficerId": {
                                            "type": ["string", "null"],
                                            "title": "ACTION_TAKEN_BY"
                                        },
                                        "typeOfInteraction": {
                                            "type": ["string", "null"],
                                            "title": "TYPE_OF_INTERACTION"
                                        },
                                        "customerResponse": {
                                            "type": ["string", "null"],
                                            "title": "CUSTOMER_RESPONSE"
                                        },
                                        "additionalRemarks": {
                                            "type": ["string", "null"],
                                            "title": "REMARKS"
                                        },
                                        "location": {
                                            "type": ["string", "null"],
                                            "title": "LOCATION"
                                        },
                                        "picture": {
                                            "type": ["string", "null"],
                                            "title": "PHOTO",
                                            "category": "Loan",
                                            "subCategory": "COLLATERALPHOTO"
                                        }
                                    }
                                }
                            },
                            "userDefinedFields": {
                                "type": "array",
                                "title": "USER_DEFINED_FIELDS",
                                "required": [
                                    "label"
                                ],
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "label": {
                                            "type": ["string", "null"],
                                            "title": "FIELD_LABEL",
                                        },
                                        "dataType": {
                                            "type": "string",
                                            "title": "DATA_TYPE"
                                        },
                                        "size": {
                                            "type": "number",
                                            "title": "SIZE"
                                        },
                                        "valueForDropDown": {
                                            "title": "ALLOWED_VALUES",
                                            "type": "string"
                                        },
                                        "isMandatory": {
                                            "type": "boolean",
                                            "title": "MANDATORY"
                                        }
                                    }
                                }
                            },
                            "userDefinedDateFields": {
                                "type": "array",
                                "title": "USER_DEFINED_DATE_FIELDS",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "label": {
                                            "type": ["string", "null"],
                                            "title": "FIELD_LABEL",
                                        },
                                        "isMandatory": {
                                            "type": "boolean",
                                            "title": "MANDATORY"
                                        }
                                    }
                                }
                            },
                            "moduleConfigMasters": {
                                "type": "array",
                                "title": "MODULE_CONFIG_MASTERS",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "agentModuleStatus": {
                                            "type": "boolean",
                                            "title": "AGENT_MODULE_STATUS"
                                        },
                                        "bankId": {
                                            "type": ["number", "null"],
                                            "title": "BANK_ID"
                                        },
                                        "cmsProductName": {
                                            "type": "string",
                                            "title": "ENCORE_PRODUCT_NAME"
                                        },
                                        "moduleStatus": {
                                            "type": "boolean",
                                            "title": "MODULE_STATUS"
                                        },
                                        "smsEnabled": {
                                            "type": "boolean",
                                            "title": "SMS_ENABLED"
                                        }
                                    }
                                }
                            },
                            "lmsProductMasters": {
                                "type": "array",
                                "title": "LMS_PRODUCT_MASTER",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "bankId": {
                                            "type": ["number", "null"],
                                            "title": "BANK_ID"
                                        },
                                        "investorId": {
                                            "type": ["number", "null"],
                                            "title": "INVESTOR_ID"
                                        },
                                        "smsProductName": {
                                            "type": "string",
                                            "title": "SMS_PRODUCT_NAME"
                                        },
                                    }
                                }
                            }
                        },
                        "required": [
                            "productCode",
                            "productName",
                            "productType",
                            "loanType",
                            "partnerCode",
                            "frequency",
                            "processType",
                            "effectiveDate",
                            "expiryDate",
                            "minInterestRate",
                            "maxInterestRate",
                            "groupMemberMinimum",
                            "groupMemberMaximum",
                            "numberOfGuarantors",
                            "lmsProductMasters[].investorId",
                            "lmsProductMasters[].bankId",
                            "status",
                        ]
                    }
                }
            },
            actions: {
                preSave: function(model, form, formName) {
                    var deferred = $q.defer();
                    if (model.product.transactionName) {
                        deferred.resolve();
                    } else {
                        PageHelper.showProgress('product Save', 'Transaction Name is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },
                submit: function(model, form, formName) {
                    PageHelper.showLoader();
                    date1 = new Date(model.product.effectiveDate);
                    date2 = new Date(model.product.expiryDate);
                    date3 = new Date(model.userLoginDate);
                    if (date2 < date1) {
                        PageHelper.showErrors("");
                    }
                    if (date1 < date3) {
                        PageHelper.showErrors({
                            data: {
                                error: "EffectiveDate should not be less than Branch working date "
                            }
                        });
                        PageHelper.hideLoader();
                    } else {
                        console.log(date1, date2, date2 < date1)
                        PageHelper.showProgress("New product", "Working...");
                        model.product.lmsProductMasters.maxAmt = 0;
                        model.product.lmsProductMasters.minAmt = 0;
                        model.product.lmsProductMasters.newProduct = 'Y';
                        model.product.purposes = [];
                        //if (model.product.allPurposes)
                        _.filter(model.allPurposes, function(allPurposesValues) {
                            if (allPurposesValues.$selected == true) {
                                model.product.purposes.push(allPurposesValues);
                            }
                            delete model.product.purposes["$selected"];
                        });
                        if (model.product.id) {
                            Product.update(model.product)
                                .$promise
                                .then(function(res) {
                                    PageHelper.showProgress("product Save", "product Updated with id" + '  ' + res.id, 3000);
                                    $log.info(res);
                                    model.product = res;
                                    irfNavigator.goBack();
                                }, function(httpRes) {
                                    PageHelper.showProgress("product Save", "Oops. Some error occured.", 3000);
                                    PageHelper.showErrors(httpRes);
                                }).finally(function() {
                                    PageHelper.hideLoader();
                                })
                        } else {
                            if (model.product.purposes)
                                Product.createProduct(model.product)
                                .$promise
                                .then(function(res) {
                                    PageHelper.showProgress("Product Save", "Product Created with id" + '  ' + res.id, 3000);
                                    $log.info("PRODUCT CREATED");
                                    model.product = res;
                                    irfNavigator.goBack();
                                }, function(httpRes) {
                                    PageHelper.showProgress("Product Save", "Oops. Some error occured.", 3000);
                                    PageHelper.showErrors(httpRes);
                                    $state.go('LoanProductDashboard', null);
                                }).finally(function() {
                                    PageHelper.hideLoader();
                                })
                        }
                    }
                }
            }
        }
    }
})