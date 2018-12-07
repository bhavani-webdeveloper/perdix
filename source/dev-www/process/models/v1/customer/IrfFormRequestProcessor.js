irf.pageCollection.factory("IrfFormRequestProcessor", ['$log', '$filter', 'Enrollment', "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "jsonPath", "BundleManager", "CustomerBankBranch", "User",
    function ($log, $filter, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage, PageHelper, Utils, BiometricService, PagesDefinition, Queries, jsonPath, BundleManager, CustomerBankBranch, User) {
        var formRepository = {}

        formRepository['IndividualEnrollment'] = {
            "CustomerInformation": {
                "type": "box",
                "title": "CUSTOMER_INFORMATION",
                orderNo: 10,
                "items": {
                    "firstName": {
                        orderNo: 10,
                        key: "customer.firstName",
                        title: "FULL_NAME",
                        type: "qrcode",
                        onCapture: EnrollmentHelper.customerAadhaarOnCapture
                    },
                    "photoImageId": {
                        orderNo: 20,
                        key: "customer.photoImageId",
                        type: "file",
                        fileType: "image/*",
                        "viewParams": function(modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                        //"offline": true
                    },
                    "customerBranchId": {
                        orderNo: 30,
                        "required": true,
                        "type": "select",
                        key: "customer.customerBranchId",
                        "title": "BRANCH_NAME",
                        "readonly": true
                    },
                    "centreCode": {
                        orderNo: 40,
                        "required": true,
                        key: "customer.centreCode",
                        type: "select",
                        parentEnumCode: "userbranches",
                        parentValueExpr: "model.customer.customerBranchId",
                    },
                    "centreId": {
                        orderNo: 40,
                        key: "customer.centreId",
                        "required": true,
                        type: "select",
                        parentEnumCode: "userbranches",
                        parentValueExpr: "model.customer.customerBranchId",
                    },
                    "area": {
                        orderNo: 50,
                        key: "customer.area",
                        "title": "Area",
                        "type": "select",
                        "titleMap": {
                            "Rural": "Rural",
                            "Urban": "Urban"
                        }
                    },
                    "groupName": {
                        orderNo: 60,
                        key: "customer.groupName",
                        "title": "GROUP_NAME"
                    },
                    "loanCycle": {
                        orderNo: 70,
                        key: "customer.loanCycle",
                        "title": "LOAN_CYCLE"
                    },
                    "enrolledAs": {
                        orderNo: 80,
                        key: "customer.enrolledAs",
                        type: "radios"
                    },
                    "gender": {
                        orderNo: 90,
                        key: "customer.gender",
                        type: "radios"
                    },
                    "age": {
                        orderNo: 100,
                        key: "customer.age",
                        title: "AGE",
                        type: "number",
                        "onChange": function (modelValue, form, model) {
                            if (model.customer.age > 0) {
                                if (model.customer.dateOfBirth) {
                                    model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-') + moment(model.customer.dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                } else {
                                    model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-MM-DD');
                                }
                            }
                        }
                    },
                    "dateOfBirth": {
                        orderNo: 110,
                        key: "customer.dateOfBirth",
                        type: "date",
                        "onChange": function (modelValue, form, model) {
                            if (model.customer.dateOfBirth) {
                                model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                            }
                        }
                    },
                    "maritalStatus": {
                        orderNo: 120,
                        key: "customer.maritalStatus",
                        type: "select"
                    },
                    "religion": {
                        orderNo: 130,
                        key: "customer.religion",
                        type: "select"
                    },
                    "caste": {
                        orderNo: 140,
                        key: "customer.caste",
                        type: "select"
                    },
                    "fatherFirstName": {
                        orderNo: 150,
                        // condition: "model.customer.maritalStatus !== 'MARRIED'",
                        key: "customer.fatherFirstName",
                        title: "FATHER/FATHER_IN_LAW'S_NAME"
                    },
                    "spouseFirstName": {
                        orderNo: 160,
                        key: "customer.spouseFirstName",
                        title: "SPOUSE_FULL_NAME",
                        condition: "model.customer.maritalStatus==='MARRIED' || model.customer.maritalStatus === 'WIDOWER' || model.customer.maritalStatus === 'WIDOW'",
                        type: "qrcode",
                        onCapture: function (result, model, form) {
                            $log.info(result); // spouse id proof
                            var aadhaarData = EnrollmentHelper.parseAadhaar(result.text);
                            $log.info(aadhaarData);
                            model.customer.udf.userDefinedFieldValues.udf33 = 'Aadhar card';
                            model.customer.udf.userDefinedFieldValues.udf36 = aadhaarData.uid;
                            model.customer.spouseFirstName = aadhaarData.name;
                            if (aadhaarData.yob) {
                                model.customer.spouseDateOfBirth = aadhaarData.yob + '-01-01';
                                model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                            }
                        }
                    },
                    "spouseAge": {
                        orderNo: 170,
                        key: "customer.spouseAge",
                        title: "SPOUSE_AGE",
                        type: "number",
                        condition: "model.customer.maritalStatus==='MARRIED'",
                        "onChange": function (modelValue, form, model) {
                            if (model.customer.spouseAge > 0) {
                                if (model.customer.spouseDateOfBirth) {
                                    model.customer.spouseDateOfBirth = moment(new Date()).subtract(model.customer.spouseAge, 'years').format('YYYY-') + moment(model.customer.spouseDateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                } else {
                                    model.customer.spouseDateOfBirth = moment(new Date()).subtract(model.customer.spouseAge, 'years').format('YYYY-MM-DD');
                                }
                            }
                        }
                    },
                    "spouseDateOfBirth": {
                        orderNo: 180,
                        key: "customer.spouseDateOfBirth",
                        type: "date",
                        condition: "model.customer.maritalStatus==='MARRIED'",
                        "onChange": function (modelValue, form, model) {
                            if (model.customer.spouseDateOfBirth) {
                                model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                            }
                        }
                    },
                    "udf1": {
                        orderNo: 190,
                        key: "customer.udf.userDefinedFieldValues.udf1",
                        condition: "model.customer.maritalStatus==='MARRIED'",
                        title: "SPOUSE_LOAN_CONSENT"
                    }
                }
            },
            "ContactInformation": {
                "type": "box",
                orderNo: 20,
                "title": "CONTACT_INFORMATION",
                "items": {
                    "mobilePhone": {
                        orderNo: 10,
                        key: "customer.mobilePhone",
                        inputmode: "number",
                        numberType: "tel"
                    },
                    "landLineNo": {
                        orderNo: 20,
                        key: "customer.landLineNo",
                        inputmode: "number",
                        numberType: "tel",
                        schema: {
                            "minLength": 0,
                        }
                    },
                    "CustomerResidentialAddress": {
                        type: "fieldset",
                        orderNo: 30,
                        title: "CUSTOMER_RESIDENTIAL_ADDRESS",
                        items: {
                            "doorNo": {
                                orderNo: 30,
                                key: "customer.doorNo",
                            },
                            "street": {
                                orderNo: 40,
                                key: "customer.street",
                            },
                            "postOffice": {
                                orderNo: 50,
                                key: "customer.postOffice",
                            },
                            "pincode": {
                                orderNo: 60,
                                key: "customer.pincode",
                                type: "lov",
                                "title": "PIN_CODE",
                                fieldType: "number",
                                autolov: true,
                                inputMap: {
                                    "pincode": "customer.pincode",
                                    "division": {
                                        key: "customer.locality"
                                    },
                                    "region": {
                                        key: "customer.villageName"
                                    },
                                    "taluk": {
                                        key: "customer.taluk"
                                    },
                                    "district": {
                                        key: "customer.district"
                                    },
                                    "state": {
                                        key: "customer.state"
                                    }
                                },
                                outputMap: {
                                    "division": "customer.locality",
                                    "region": "customer.villageName",
                                    "pincode": "customer.pincode",
                                    "district": "customer.district",
                                    "state": "customer.state",
                                },
                                searchHelper: formHelper,
                                initialize: function (inputModel) {
                                    $log.warn('in pincode initialize');
                                    $log.info(inputModel);
                                },
                                search: function (inputModel, form, model) {
                                    if (!inputModel.pincode) {
                                        return $q.reject();
                                    }
                                    return Queries.searchPincodes(
                                        inputModel.pincode,
                                        inputModel.district,
                                        inputModel.state,
                                        inputModel.division,
                                        inputModel.region,
                                        inputModel.taluk
                                    );
                                },
                                getListDisplayItem: function (item, index) {
                                    return [
                                        item.division + ', ' + item.region,
                                        item.pincode,
                                        item.district + ', ' + item.state,
                                    ];
                                },
                                onSelect: function (result, model, context) {
                                    $log.info(result);
                                }
                            },
                            "locality": {
                                readonly: true,
                                orderNo: 70,
                                key: "customer.locality",
                            },
                            "villageName": {
                                orderNo: 80,
                                readonly: true,
                                key: "customer.villageName",
                                screenFilter: true
                            },
                            "district": {
                                orderNo: 90,
                                readonly: true,
                                key: "customer.district",
                                screenFilter: true
                            },
                            "state": {
                                orderNo: 100,
                                readonly: true,
                                key: "customer.state",
                                screenFilter: true
                            },
                            "stdCode": {
                                orderNo: 110,
                                key: "customer.stdCode",
                            },
                            "mailSameAsResidence": {
                                orderNo: 120,
                                key: "customer.mailSameAsResidence"
                            },
                            "landLordName": {
                                "title": "IF_HOUSE_RENTED_NAME_OF_LANDLORD",
                                orderNo: 111,
                                key: "customer.udf.userDefinedFieldValues.udf6",
                                "type": "string",
                                schema: {
                                    type: ['string', 'null']
                                }
                            },
                        }
                    },
                    "CustomerPermanentAddress": {
                        type: "fieldset",
                        orderNo: 40,
                        title: "CUSTOMER_PERMANENT_ADDRESS",
                        condition: "!model.customer.mailSameAsResidence",
                        items: {
                            "mailingDoorNo": {
                                orderNo: 10,
                                key: "customer.mailingDoorNo",
                            },
                            "mailingStreet": {
                                orderNo: 20,
                                key: "customer.mailingStreet",
                            },
                             "mailingPostoffice": {
                                orderNo: 30,
                                key: "customer.mailingPostoffice",
                            },
                            "mailingPincode": {
                                orderNo: 40,
                                key: "customer.mailingPincode",
                                type: "lov",
                                fieldType: "string",
                                autolov: true,
                                inputMap: {
                                    "mailingPincode": "customer.mailingPincode",
                                    "mailingDivision": "customer.mailingLocality",
                                    "mailingtaluk": "customer.mailingtaluk",
                                    "region": "customer.villageName",
                                    "mailingDistrict": {
                                        key: "customer.mailingDistrict"
                                    },
                                    "mailingState": {
                                        key: "customer.mailingState"
                                    }
                                },
                                outputMap: {
                                    "mailingDivision": "customer.mailingLocality",
                                    "mailingPincode": "customer.mailingPincode",
                                    "mailingDistrict": "customer.mailingDistrict",
                                    "mailingState": "customer.mailingDivision"
                                },
                                searchHelper: formHelper,
                                initialize: function (inputModel) {
                                    $log.warn('in pincode initialize');
                                    $log.info(inputModel);
                                    inputModel.region = undefined;
                                },
                                search: function (inputModel, form, model) {
                                    if (!inputModel.mailingPincode) {
                                        return $q.reject();
                                    }
                                    return Queries.searchPincodes(
                                        inputModel.mailingPincode,
                                        inputModel.mailingDistrict,
                                        inputModel.mailingState,
                                        inputModel.mailingDivision,
                                        inputModel.region,
                                        inputModel.mailingtaluk
                                    );
                                },
                                getListDisplayItem: function (item, index) {
                                    return [
                                        item.division + ', ' + item.region,
                                        item.pincode,
                                        item.district + ', ' + item.state
                                    ];
                                },
                                onSelect: function (result, model, context) {
                                    model.customer.mailingPincode = (new Number(result.pincode)).toString();
                                    model.customer.mailingLocality = result.division;
                                    model.customer.mailingState = result.state;
                                    model.customer.mailingDistrict = result.district;
                                }
                            },
                            "mailingLocality": {
                                orderNo: 50,
                                readonly: true,
                                key: "customer.mailingLocality",
                            },

                            "mailingDistrict": {
                                orderNo: 60,
                                readonly: true,
                                key: "customer.mailingDistrict",
                                type: "select",
                                screenFilter: true
                            },
                            "mailingState": {
                                orderNo: 70,
                                readonly: true,
                                key: "customer.mailingState",
                                screenFilter: true
                            },
                            "landLordName": {
                                "title": "IF_HOUSE_RENTED_NAME_OF_LANDLORD",
                                orderNo: 71,
                                key: "customer.udf.userDefinedFieldValues.udf38",
                                "type": "string",
                            },
                            "residenceSameAsMail": {
                                orderNo: 80,
                                key: "customer.udf.userDefinedFieldValues.udf37",
                                title: "RESIDENCE_ADDRESS_SAME_AS_PERMANANT",
                                type: "checkbox",
                                schema: {
                                    "type": ["boolean", "null"],
                                },
                            },
                        }
                    }
                }
            },
            "KYC": {
                type: "box",
                orderNo: 30,
                title: "KYC",
                items: {
                    "aadhaarNo": {
                        "key": "customer.aadhaarNo",
                        orderNo: 10,
                        type: "qrcode",
                        onChange: "actions.setProofs(model)",
                        onCapture: EnrollmentHelper.customerAadhaarOnCapture
                    },
                    "IdentityProof1": {
                        type: "fieldset",
                        orderNo: 20,
                        title: "IDENTITY_PROOF",
                        items: {
                            "identityProof": {
                                key: "customer.identityProof",
                                type: "select"
                            },
                            "identityProofImageId": {
                                key: "customer.identityProofImageId",
                                type: "file",
                                offline: true,
                                fileType:"application/pdf",
                                using: "scanner"
                            },
                            "identityProofReverseImageId": {
                                key: "customer.identityProofReverseImageId",
                                type: "file",
                                fileType: "application/pdf",
                                using: "scanner"
                            },
                            "identityProofNo": {
                                key: "customer.identityProofNo",
                                type: "qrcode",
                                condition: "model.customer.identityProof == 'Aadhar Card'",
                                schema: {
                                    "pattern": "^[2-9]{1}[0-9]{11}$",
                                    "type": ["string", "null"],
                                },
                                onCapture: function (result, model, form) {
                                    $log.info(result);
                                    var aadhaarData = EnrollmentHelper.parseAadhaar(result.text);
                                    model.customer.identityProofNo = aadhaarData.uid;
                                }
                            },
                            "identityProofNo1": {
                                key: "customer.identityProofNo",
                                type: "barcode",
                                condition: "model.customer.identityProof == 'Pan Card'",
                                schema: {
                                    "pattern": "[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}",
                                    "type": ["string", "null"],
                                },
                                onCapture: function (result, model, form) {
                                    $log.info(result);
                                    model.customer.identityProofNo = result.text;
                                }
                            },
                            "identityProofNo2": {
                                key: "customer.identityProofNo",
                                type: "barcode",
                                condition: "model.customer.identityProof == 'Passport'",
                                schema: {
                                    "pattern": "^([A-PR-WY]){1}([1-9]){1}([0-9]){5}([1-9]){1}$",
                                    "type": ["string", "null"],
                                },
                                onCapture: function (result, model, form) {
                                    $log.info(result);
                                    model.customer.identityProofNo = result.text;
                                }
                            },
                            "identityProofNo3": {
                                key: "customer.identityProofNo",
                                type: "barcode",
                                condition: "model.customer.identityProof !== 'Aadhar Card' && model.customer.identityProof !== 'Pan Card' && model.customer.identityProof !== 'Passport'",
                                // "pattern": ".*",
                                onCapture: function (result, model, form) {
                                    $log.info(result);
                                    model.customer.identityProofNo = result.text;
                                }
                            },
                            "idProofIssueDate": {
                                key: "customer.idProofIssueDate",
                                type: "date"
                            },
                            "idProofValidUptoDate": {
                                key: "customer.idProofValidUptoDate",
                                type: "date"
                            },
                            "addressProofSameAsIdProof": {
                                key: "customer.addressProofSameAsIdProof",
                                condition: "model.customer.identityProof != 'Pan Card'"
                            }
                        }
                    },
                    "addressProof1": {
                        type: "fieldset",
                        orderNo: 30,
                        title: "ADDRESS_PROOF",
                        condition: "!model.customer.addressProofSameAsIdProof",
                        items: {
                            "addressProof": {
                                key: "customer.addressProof",
                                type: "select"
                            },
                            "addressProofImageId": {
                                key: "customer.addressProofImageId",
                                type: "file",
                                fileType: "application/pdf",
                                using: "scanner",
                                "offline": true
                            },
                            "addressProofReverseImageId": {
                                key: "customer.addressProofReverseImageId",
                                type: "file",
                                fileType: "application/pdf",
                                using: "scanner",
                                "offline": true
                            },
                            "addressProofNo": {
                                key: "customer.addressProofNo",
                                type: "barcode",
                                condition: "model.customer.addressProof == 'Aadhar Card'",
                                schema: {
                                    "pattern": "^[2-9]{1}[0-9]{11}$",
                                    "type": ["string", "null"],
                                },
                                onCapture: function (result, model, form) {
                                    $log.info(result);
                                    model.customer.addressProofNo = result.text;
                                }
                            },
                            "addressProofNo1": {
                                key: "customer.addressProofNo",
                                type: "barcode",
                                condition: "model.customer.addressProof == 'Passport'",
                                schema: {
                                    "pattern": "^([A-PR-WY]){1}([1-9]){1}([0-9]){5}([1-9]){1}$",
                                    "type": ["string", "null"],
                                },
                                onCapture: function (result, model, form) {
                                    $log.info(result);
                                    model.customer.addressProofNo = result.text;
                                }
                            },
                            "addressProofNo2": {
                                key: "customer.addressProofNo",
                                type: "barcode",
                                condition: "model.customer.addressProof !== 'Aadhar Card' && model.customer.addressProof !== 'Passport'",
                                schema: {
                                    "pattern": ".*",
                                    "type": ["string", "null"],
                                },
                                onCapture: function (result, model, form) {
                                    $log.info(result);
                                    model.customer.addressProofNo = result.text;
                                }
                            },
                            "addressProofIssueDate": {
                                key: "customer.addressProofIssueDate",
                                type: "date"
                            },
                            "addressProofValidUptoDate": {
                                key: "customer.addressProofValidUptoDate",
                                type: "date"
                            },
                        }
                    },
                    "spouseIdProof": {
                        type: "fieldset",
                        orderNo: 40,
                        title: "SPOUSE_IDENTITY_PROOF",
                        condition: "model.customer.maritalStatus=='MARRIED' || model.customer.maritalStatus=='married'",
                        items: {
                            "udf33": {
                                key: "customer.udf.userDefinedFieldValues.udf33",
                                type: "select",
                                onChange: function (modelValue) {
                                    $log.info(modelValue);
                                }
                            },
                            "udf34": {
                                key: "customer.udf.userDefinedFieldValues.udf34",
                                type: "file",
                                fileType: "image/*",
                                offline: true,
                            },
                            "udf35": {
                                key: "customer.udf.userDefinedFieldValues.udf35",
                                type: "file",
                                fileType: "application/pdf",
                                using: "scanner",
                            },
                            "udf36": {
                                key: "customer.udf.userDefinedFieldValues.udf36",
                                condition: "model.customer.udf.userDefinedFieldValues.udf33 != 'Aadhar Card'",
                                //type: "barcode",
                                onCapture: function (result, model, form) {
                                    $log.info(result); // spouse id proof
                                    model.customer.udf.userDefinedFieldValues.udf36 = result.text;
                                }
                            },
                            "udf36_1": {
                                key: "customer.udf.userDefinedFieldValues.udf36",
                                condition: "model.customer.udf.userDefinedFieldValues.udf33 == 'Aadhar Card'",
                                //type: "qrcode",
                                schema: {
                                    "pattern": "^[2-9]{1}[0-9]{11}$",
                                    "type": ["string", "null"],
                                },
                                onCapture: function (result, model, form) {
                                    $log.info(result); // spouse id proof
                                    var aadhaarData = EnrollmentHelper.parseAadhaar(result.text);
                                    $log.info(aadhaarData);
                                    model.customer.udf.userDefinedFieldValues.udf36 = aadhaarData.uid;
                                    model.customer.spouseFirstName = aadhaarData.name;
                                    if (aadhaarData.yob) {
                                        model.customer.spouseDateOfBirth = aadhaarData.yob + '-01-01';
                                        model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "AdditionalKYC": {
                "type": "box",
                orderNo: 40,
                "title": "ADDITIONAL_KYC",
                "items": {
                    "additionalKYCs": {
                        "key": "customer.additionalKYCs",
                        "type": "array",
                        "title": "ADDITIONAL_KYC",
                        "items": {
                            "kyc1ProofType": {
                                orderNo: 10,
                                key: "customer.additionalKYCs[].kyc1ProofType",
                                type: "select",
                                enumCode: "identity_proof",
                            },
                            "kyc1ImagePath": {
                                orderNo: 20,
                                key: "customer.additionalKYCs[].kyc1ImagePath",
                                type: "file",
                                fileType:"application/pdf",
                                using: "scanner",
                                offline: true
                            },
                            "kyc1ReverseImagePath": {
                                orderNo: 30,
                                key: "customer.additionalKYCs[].kyc1ReverseImagePath",
                                type: "file",
                                fileType: "image/*",
                                "viewParams": function(modelValue, form, model) {
                                    return {
                                        customerId: model.customer.id
                                    };
                                },
                                //using: "scanner",
                                offline: true
                            },
                            "kyc1ProofNumber": {
                                orderNo: 40,
                                key: "customer.additionalKYCs[].kyc1ProofNumber",
                                type: "barcode",
                                condition: "model.customer.additionalKYCs[arrayIndex].kyc1ProofType == 'Aadhar Card'",
                                schema: {
                                    "pattern": "^[2-9]{1}[0-9]{11}$",
                                    "type": ["string", "null"],
                                },
                                onCapture: function (result, model, form) {
                                    $log.info(result);
                                    model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                                }
                            },
                            "kyc1ProofNumber1": {
                                orderNo: 40,
                                key: "customer.additionalKYCs[].kyc1ProofNumber",
                                type: "barcode",
                                condition: "model.customer.additionalKYCs[arrayIndex].kyc1ProofType == 'Pan Card'",
                                schema: {
                                    "pattern": "[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}",
                                    "type": ["string", "null"],
                                },
                                onCapture: function (result, model, form) {
                                    $log.info(result);
                                    model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                                }
                            },
                            "kyc1ProofNumber2": {
                                orderNo: 40,
                                key: "customer.additionalKYCs[].kyc1ProofNumber",
                                type: "barcode",
                                condition: "model.customer.additionalKYCs[arrayIndex].kyc1ProofType == 'Passport'",
                                schema: {
                                    "pattern": "^([A-PR-WY]){1}([1-9]){1}([0-9]){5}([1-9]){1}$",
                                    "type": ["string", "null"],
                                },
                                onCapture: function (result, model, form) {
                                    $log.info(result);
                                    model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                                }
                            },
                            "kyc1ProofNumber3": {
                                orderNo: 40,
                                key: "customer.additionalKYCs[].kyc1ProofNumber",
                                type: "barcode",
                                condition: "model.customer.additionalKYCs[arrayIndex].kyc1ProofType !== 'Aadhar Card' && model.customer.additionalKYCs[arrayIndex].kyc1ProofType !== 'Pan Card' && model.customer.additionalKYCs[arrayIndex].kyc1ProofType !== 'Passport'",
                                onCapture: function (result, model, form) {
                                    $log.info(result);
                                    model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                                }
                            },
                            "kyc1ProofNumber4": {
                                orderNo: 40,
                                key: "customer.additionalKYCs[].kyc1ProofNumber",
                                type: "barcode",
                                onCapture: function (result, model, form) {
                                    $log.info(result);
                                    model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                                }
                            },
                            "kyc1IssueDate": {
                                orderNo: 50,
                                key: "customer.additionalKYCs[].kyc1IssueDate",
                                type: "date"
                            },
                            "kyc1ValidUptoDate": {
                                orderNo: 60,
                                key: "customer.additionalKYCs[].kyc1ValidUptoDate",
                                type: "date"
                            },
                            "kyc2ProofType": {
                                orderNo: 70,
                                key: "customer.additionalKYCs[].kyc2ProofType",
                                type: "select"
                            },
                            "kyc2ImagePath": {
                                orderNo: 80,
                                key: "customer.additionalKYCs[].kyc2ImagePath",
                                type: "file",
                                fileType: "image/*",
                                "viewParams": function(modelValue, form, model) {
                                    return {
                                        customerId: model.customer.id
                                    };
                                },
                                //"offline": true
                            },
                            "kyc2ReverseImagePath": {
                                orderNo: 90,
                                key: "customer.additionalKYCs[].kyc2ReverseImagePath",
                                type: "file",
                                fileType: "image/*",
                                "viewParams": function(modelValue, form, model) {
                                    return {
                                        customerId: model.customer.id
                                    };
                                },
                                //"offline": true
                            },
                            "kyc2ProofNumber": {
                                orderNo: 100,
                                key: "customer.additionalKYCs[].kyc2ProofNumber",
                                type: "barcode",
                                onCapture: function (result, model, form) {
                                    $log.info(result);
                                    model.customer.additionalKYCs[form.arrayIndex].kyc2ProofNumber = result.text;
                                }
                            },
                            "kyc2IssueDate": {
                                orderNo: 110,
                                key: "customer.additionalKYCs[].kyc2IssueDate",
                                type: "date"
                            },
                            "kyc2ValidUptoDate": {
                                orderNo: 120,
                                key: "customer.additionalKYCs[].kyc2ValidUptoDate",
                                type: "date"
                            }
                        }
                    }
                }
            },
            "familyDetails": {
                "type": "box",
                orderNo: 50,
                "title": "T_FAMILY_DETAILS",
                "items": {
                    "familyMembers": {
                        key: "customer.familyMembers",
                        type: "array",
                        startEmpty: true,
                        items: {
                            "relationShip": {
                                key: "customer.familyMembers[].relationShip",
                                orderNo: 10,
                                condition: "model.customer.familyMembers[form.arrayIndex].relationShip != 'self'",
                                type: "select",
                                title: "T_RELATIONSHIP",
                                "onChange": function (modelValue, form, model, formCtrl, event) {
                                    if (model.customer.familyMembers[form.arrayIndex].relationShip == 'self') {

                                        for (var index = 0; index < model.customer.familyMembers.length; index++) {
                                            if(index != form.arrayIndex && model.customer.familyMembers[index].relationShip == 'self'){
                                                model.customer.familyMembers[form.arrayIndex].relationShip = undefined;
                                                Utils.alert("self relationship is already selected");
                                                return;
                                            }
                                        }
                                    }
                                    if (model.customer.familyMembers[form.arrayIndex].relationShip == 'self') {
                                        model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender;
                                        model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.dateOfBirth;
                                        model.customer.familyMembers[form.arrayIndex].age = model.customer.age;
                                        model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                                        model.customer.familyMembers[form.arrayIndex].mobilePhone = model.customer.mobilePhone;
                                    }
                                    else {
                                        if (model.customer.familyMembers[form.arrayIndex].customerId)
                                            return;

                                        model.customer.familyMembers[form.arrayIndex].dateOfBirth = undefined;
                                        model.customer.familyMembers[form.arrayIndex].age = undefined;
                                        model.customer.familyMembers[form.arrayIndex].maritalStatus = undefined;
                                        model.customer.familyMembers[form.arrayIndex].gender = undefined;
                                        model.customer.familyMembers[form.arrayIndex].mobilePhone = undefined;
                                        if (model.customer.familyMembers[form.arrayIndex].relationShip == 'Father' || model.customer.familyMembers[form.arrayIndex].relationShip == 'Father-In-Law') {
                                            model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.fatherFirstName;
                                        }
                                        else if (model.customer.familyMembers[form.arrayIndex].relationShip == "Husband" || model.customer.familyMembers[form.arrayIndex].relationShip == "Wife") {
                                            model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.spouseFirstName;
                                            model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.spouseDateOfBirth;
                                            model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.spouseDateOfBirth), 'years');
                                        }
                                        else {
                                            model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = undefined;
                                            model.customer.familyMembers[form.arrayIndex].dateOfBirth = undefined;
                                            model.customer.familyMembers[form.arrayIndex].age = undefined;
                                        }
                                    }
                                }
                            },
                            "customerId": {
                                key: "customer.familyMembers[].customerId",
                                orderNo: 20,
                                condition: "model.customer.familyMembers[arrayIndex].relationShip !== 'self'",
                                type: "lov",
                                "inputMap": {
                                    "firstName": {
                                        "key": "customer.firstName",
                                        "title": "CUSTOMER_NAME"
                                    },
                                    "branchName": {
                                        "key": "customer.kgfsName",
                                        "type": "select"
                                    }
                                    /*,
                                     "centreCode": {
                                     "key": "customer.centreCode",
                                     "type": "select"
                                     }*/
                                },
                                "outputMap": {
                                    "id": "customer.familyMembers[arrayIndex].customerId",
                                    "firstName": "customer.familyMembers[arrayIndex].familyMemberFirstName"
                                },
                                "searchHelper": formHelper,
                                "search": function (inputModel, form) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = Enrollment.search({
                                        'branchName': inputModel.branchName || SessionStore.getBranch(),
                                        'firstName': inputModel.firstName,
                                    }).$promise;
                                    return promise;
                                },
                                onSelect: function (valueObj, model, context) {
                                    var rowIndex = context.arrayIndex;
                                    PageHelper.showLoader();
                                    Enrollment.getCustomerById({
                                        id: valueObj.id
                                    }, function (resp, header) {

                                        model.customer.familyMembers[rowIndex].gender = resp.gender;
                                        model.customer.familyMembers[rowIndex].dateOfBirth = resp.dateOfBirth;
                                        model.customer.familyMembers[rowIndex].maritalStatus = resp.maritalStatus;
                                        model.customer.familyMembers[rowIndex].age = moment().diff(moment(resp.dateOfBirth), 'years');
                                        model.customer.familyMembers[rowIndex].mobilePhone = resp.mobilePhone;
                                        model.customer.familyMembers[rowIndex].relationShip = "";

                                        var selfIndex = _.findIndex(resp.familyMembers, function (o) {
                                            return o.relationShip.toUpperCase() == 'SELF'
                                        });

                                        if (selfIndex != -1) {
                                            model.customer.familyMembers[rowIndex].healthStatus = resp.familyMembers[selfIndex].healthStatus;
                                            model.customer.familyMembers[rowIndex].educationStatus = resp.familyMembers[selfIndex].educationStatus;
                                        }
                                        PageHelper.hideLoader();
                                        irfProgressMessage.pop("cust-load", "Load Complete", 2000);
                                    }, function (resp) {
                                        PageHelper.hideLoader();
                                        irfProgressMessage.pop("cust-load", "An Error Occurred. Failed to fetch Data", 5000);

                                    });

                                },
                                getListDisplayItem: function (data, index) {
                                    return [
                                        [data.firstName, data.fatherFirstName].join(' '),
                                        data.id
                                    ];
                                }
                            },
                            "familyMemberFirstName": {
                                orderNo: 30,
                                key: "customer.familyMembers[].familyMemberFirstName",
                                condition: "model.customer.familyMembers[arrayIndex].relationShip !== 'self'",
                                title: "FAMILY_MEMBER_FULL_NAME"
                            },
                            "gender": {
                                key: "customer.familyMembers[].gender",
                                orderNo: 40,
                                condition: "model.customer.familyMembers[arrayIndex].relationShip != 'self'",
                                type: "radios",
                                title: "T_GENDER"
                            },
                            "age": {
                                key: "customer.familyMembers[].age",
                                orderNo: 50,
                                title: "AGE",
                                condition: "model.customer.familyMembers[arrayIndex].relationShip != 'self'",
                                type: "number",
                                "onChange": function (modelValue, form, model, formCtrl, event) {
                                    if (model.customer.familyMembers[form.arrayIndex].age > 0) {
                                        if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                            model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-') + moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                        } else {
                                            model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-MM-DD');
                                        }
                                    }
                                }
                            },
                            "dateOfBirth": {
                                key: "customer.familyMembers[].dateOfBirth",
                                orderNo: 60,
                                type: "date",
                                condition: "model.customer.familyMembers[arrayIndex].relationShip != 'self'",
                                title: "T_DATEOFBIRTH",
                                "onChange": function (modelValue, form, model, formCtrl, event) {
                                    if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                        model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                    }
                                }
                            },
                            "educationStatus": {
                                key: "customer.familyMembers[].educationStatus",
                                orderNo: 70,
                                type: "select",
                                title: "T_EDUCATION_STATUS"
                            },
                            "maritalStatus": {
                                orderNo: 80,
                                key: "customer.familyMembers[].maritalStatus",
                                condition: "model.customer.familyMembers[arrayIndex].relationShip != 'self'",
                                type: "select",
                                title: "T_MARITAL_STATUS"
                            },
                            "mobilePhone": {
                                orderNo: 90,
                                key: "customer.familyMembers[].mobilePhone",
                                condition: "model.customer.familyMembers[arrayIndex].relationShip != 'self'",
                                inputmode: "number",
                                numberType: "tel",
                            },
                            "healthStatus": {
                                orderNo: 100,
                                key: "customer.familyMembers[].healthStatus",
                                type: "radios",
                                titleMap: {
                                    "GOOD": "GOOD",
                                    "BAD": "BAD"
                                },
                            },
                            "contributionToExpenditure": {
                                orderNo: 110,
                                key: "customer.familyMembers[].contributionToExpenditure",
                                type: "amount",
                            },
                            "incomes": {
                                key: "customer.familyMembers[].incomes",
                                orderNo: 120,
                                type: "array",
                                startEmpty: false,
                                items: {
                                    "incomeSource": {
                                        key: "customer.familyMembers[].incomes[].incomeSource",
                                        type: "select"
                                    },
                                    "incomeEarned": {
                                        key: "customer.familyMembers[].incomes[].incomeEarned",
                                        type: "amount",
                                    },
                                    "frequency": {
                                        key: "customer.familyMembers[].incomes[].frequency",
                                        type: "select"
                                    },
                                    "monthsPerYear": {
                                        key: "customer.familyMembers[].incomes[].monthsPerYear",
                                        "title": "MONTHS_PER_YEAR",
                                    }
                                }
                            },
                            "gender_readonly": {
                                key: "customer.familyMembers[].gender",
                                orderNo: 40,
                                condition: "model.customer.familyMembers[arrayIndex].relationShip == 'self'",
                                readonly: true,
                                type: "radios",
                                title: "T_GENDER"
                            },
                            "age_readonly": {
                                key: "customer.familyMembers[].age",
                                orderNo: 50,
                                condition: "model.customer.familyMembers[arrayIndex].relationShip == 'self'",
                                readonly: true,
                                title: "AGE",
                                type: "number",
                                "onChange": function (modelValue, form, model, formCtrl, event) {
                                    if (model.customer.familyMembers[form.arrayIndex].age > 0) {
                                        if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                            model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-') + moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                        } else {
                                            model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-MM-DD');
                                        }
                                    }
                                }
                            },
                            "dateOfBirth_readonly": {
                                key: "customer.familyMembers[].dateOfBirth",
                                orderNo: 60,
                                condition: "model.customer.familyMembers[arrayIndex].relationShip == 'self'",
                                readonly: true,
                                type: "date",
                                title: "T_DATEOFBIRTH",
                                "onChange": function (modelValue, form, model, formCtrl, event) {
                                    if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                        model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                    }
                                }
                            },
                            "educationStatus": {
                                key: "customer.familyMembers[].educationStatus",
                                orderNo: 70,
                                type: "select",
                                title: "T_EDUCATION_STATUS"
                            },
                            "maritalStatus_readonly": {
                                orderNo: 80,
                                key: "customer.familyMembers[].maritalStatus",
                                condition: "model.customer.familyMembers[arrayIndex].relationShip == 'self'",
                                readonly: true,
                                type: "select",
                                title: "T_MARITAL_STATUS"
                            },
                            "mobilePhone_readonly": {
                                orderNo: 90,
                                key: "customer.familyMembers[].mobilePhone",
                                condition: "model.customer.familyMembers[arrayIndex].relationShip == 'self'",
                                readonly: true,
                                inputmode: "number",
                                numberType: "tel",
                            },
                            "healthStatus": {
                                orderNo: 100,
                                key: "customer.familyMembers[].healthStatus",
                                type: "radios",
                                titleMap: {
                                    "GOOD": "GOOD",
                                    "BAD": "BAD"
                                },
                            },
                            "contributionToExpenditure": {
                                orderNo: 110,
                                key: "customer.familyMembers[].contributionToExpenditure",
                                type: "amount",
                            },
                            "incomes": {
                                key: "customer.familyMembers[].incomes",
                                orderNo: 120,
                                type: "array",
                                startEmpty: false,
                                items: {
                                    "incomeSource": {
                                        key: "customer.familyMembers[].incomes[].incomeSource",
                                        type: "select"
                                    },
                                    "incomeEarned": {
                                        key: "customer.familyMembers[].incomes[].incomeEarned",
                                        type: "amount",
                                    },
                                    "frequency": {
                                        key: "customer.familyMembers[].incomes[].frequency",
                                        type: "select"
                                    },
                                    "monthsPerYear": {
                                        key: "customer.familyMembers[].incomes[].monthsPerYear",
                                        //"title": "MONTHS_PER_YEAR",
                                    }
                                }
                            }
                        }
                    },
                    "additionalDetails": {
                        key: "customer",
                        type: "section",
                        items: {
                            "medicalCondition": {
                                key: "customer.udf.userDefinedFieldValues.udf38",
                                orderNo: 10,
                            },
                            "privateHospitalTreatment": {
                                key: "customer.udf.userDefinedFieldValues.udf39",
                                orderNo: 20,
                            },
                            "householdFinanceRelatedDecision": {
                                key: "customer.udf.userDefinedFieldValues.udf40",
                                orderNo: 30,
                            },
                        }
                    }
                }
            },
            "Expenditures1": {
                "type": "box",
                orderNo: 60,
                "title": "EXPENDITURES",
                "items": {
                    "expenditures": {
                        key: "customer.expenditures",
                        type: "array",
                        view: "fixed",
                        titleExpr: "model.customer.expenditures[arrayIndex].expenditureSource | translate",
                        items: {
                            "expendituresSection": {
                                type: 'section',
                                htmlClass: 'row',
                                items: {
                                    "expenditureSource": {
                                        key: "customer.expenditures[].expenditureSource",
                                        type: "select"
                                    },
                                    "customExpenditureSource": {
                                        key: "customer.expenditures[].customExpenditureSource",
                                        title: "CUSTOM_EXPENDITURE_SOURCE",
                                        condition: "model.customer.expenditures[arrayIndex].expenditureSource=='Others'"
                                    },
                                    "frequencySection": {
                                        type: 'section',
                                        htmlClass: 'col-xs-6',
                                        items: {
                                            "frequency": {
                                                key: "customer.expenditures[].frequency",
                                                type: "select",
                                                notitle: true
                                            }
                                        }
                                    },
                                    "annualExpensesSection": {
                                        type: 'section',
                                        htmlClass: 'col-xs-6',
                                        items: {
                                            "annualExpenses": {
                                                key: "customer.expenditures[].annualExpenses",
                                                type: "amount",
                                                notitle: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                }
            },
            "BusinessOccupationDetails": {
                "type": "box",
                orderNo: 70,
                "title": "OCCUPATION_DETAILS",
                "items": {
                    "customerOccupationType": {
                        key: "customer.udf.userDefinedFieldValues.udf13",
                        type: "select",
                        enumCode: "broad_occupation_type"
                    },
                    "businessDetails": {
                        type: "fieldset",
                        "title": "BUSINESS_OCCUPATION_DETAILS",
                        condition: "model.customer.udf.userDefinedFieldValues.udf13=='Business' || model.customer.udf.userDefinedFieldValues.udf13=='Employed'",
                        items: {
                            "relationshipWithBusinessOwner": {
                                key: "customer.udf.userDefinedFieldValues.udf14",
                                type: "select",
                                orderNo: 20,
                            },
                            "business/employerName": {
                                key: "customer.udf.userDefinedFieldValues.udf7",
                                orderNo: 10,
                            },
                            "ageOfEnterprise": {
                                key: "customer.udf.userDefinedFieldValues.udf23",
                                orderNo: 30,
                                type: "select",
                            },
                            "businessRegNo": {
                                key: "customer.udf.userDefinedFieldValues.udf22",
                                orderNo: 30,
                            },
                            "businessVillage": {
                                key: "customer.udf.userDefinedFieldValues.udf8",
                                orderNo: 40,
                            },
                            "businessLandmark": {
                                key: "customer.udf.userDefinedFieldValues.udf9",
                                orderNo: 50,
                            },
                            "businessPincode": {
                                key: "customer.udf.userDefinedFieldValues.udf10",
                                orderNo: 60,
                            },
                            "businessPhone": {
                                key: "customer.udf.userDefinedFieldValues.udf11",
                                orderNo: 70,
                            },
                            "OwnerOfShop": {
                                key: "customer.udf.userDefinedFieldValues.udf12",
                                orderNo: 80,
                            },
                            "workPeriod": {
                                key: "customer.udf.userDefinedFieldValues.udf17",
                                orderNo: 100,
                            },
                            "workPlaceType": {
                                key: "customer.udf.userDefinedFieldValues.udf16",
                                type: "select",
                                orderNo: 110,
                            },
                            "workPlaceBuildType": {
                                key: "customer.udf.userDefinedFieldValues.udf18",
                                orderNo: 120,
                                "type": "select",
                            },
                            "workPlaceCondition": {
                                key: "customer.udf.userDefinedFieldValues.udf19",
                                orderNo: 130,
                                type: "radios"
                            },
                            "WorkPlace": {
                                key: "customer.udf.userDefinedFieldValues.udf20",
                                orderNo: 140,
                                type: "select"
                            },
                            "WorkPlaceOthers": {
                                key: "customer.udf.userDefinedFieldValues.udf21",
                                orderNo: 150,
                                condition: "model.customer.udf.userDefinedFieldValues.udf20=='OTHERS'"
                            }
                        }
                    },
                    "agricultureDetails": {
                        type: "fieldset",
                        condition: "model.customer.udf.userDefinedFieldValues.udf13=='Agriculture'",
                        title: "AGRICULTURE_DETAILS",
                        items: {
                            "relationwithFarmer": {
                                key: "customer.udf.userDefinedFieldValues.udf24",
                                orderNo: 10,
                                type: "select",
                                titleMap: {
                                    "Self": "Self",
                                    "Partner": "Partner",
                                    "Others": "Others",
                                }
                            },
                            "landOwnership": {
                                key: "customer.udf.userDefinedFieldValues.udf25",
                                orderNo: 20,
                                type: "select",
                            },
                            "cropName": {
                                key: "customer.udf.userDefinedFieldValues.udf30",
                                orderNo: 30,
                            },
                            "irrigated": {
                                key: "customer.udf.userDefinedFieldValues.udf26",
                                orderNo: 40,
                            },
                            "nonIrrigated": {
                                key: "customer.udf.userDefinedFieldValues.udf15",
                                orderNo: 50,
                            },
                            "harvestMonth": {
                                key: "customer.udf.userDefinedFieldValues.udf27",
                                orderNo: 60,
                                type: "select"
                            },
                            "landArea": {
                                key: "customer.udf.userDefinedFieldValues.udf28",
                                orderNo: 70,
                            }
                        }
                    }
                }
            },

            "HouseVerification": {
                "type": "box",
                orderNo: 80,
                "title": "T_HOUSE_VERIFICATION",
                "items": {
                    "firstName": {
                        "key": "customer.firstName",
                        orderNo: 10,
                        "title": "CUSTOMER_NAME",
                        "readonly": true
                    },
                    "fullName": {
                        "key": "customer.fullName",
                        orderNo: 10,
                        "title": "CUSTOMER_NAME",
                        "readonly": true
                    },
                    "nameInLocalLanguage": {
                        orderNo: 20,
                        key: "customer.nameInLocalLanguage"
                    },
                    "addressInLocalLanguage": {
                        orderNo: 30,
                        key: "customer.addressInLocalLanguage",
                        type: "textarea"
                    },

                    "religion": {
                        orderNo: 40,
                        key: "customer.religion",
                        type: "select"
                    },
                    "caste": {
                        key: "customer.caste",
                        orderNo: 50,
                        type: "select"
                    },
                    "language": {
                        key: "customer.language",
                        orderNo: 60,
                        type: "select"
                    },
                    "HouseDetails": {
                        type: "fieldset",
                        orderNo: 70,
                        title: "HOUSE_DETAILS",
                        items: {
                            "HouseOwnership": {
                                order: 10,
                                key: "customer.udf.userDefinedFieldValues.udf3",
                                type: "select"

                            },
                            "buildType": {
                                order: 20,
                                key: "customer.udf.userDefinedFieldValues.udf31",
                                title: "BUILD_TYPE",
                                "type": "select",
                                enumCode: "houseBuildTypes",
                                "titleMap": {
                                    "CONCRETE": "Kachha",
                                    "MUD": "Pucca",
                                    "BRICK": "Ardha Pucca"
                                }
                            },
                            "landLordName": {
                                order: 30,
                                key: "customer.udf.userDefinedFieldValues.udf2",
                                //condition: "model.customer.udf.userDefinedFieldValues.udf3=='RENTED'"
                            },
                            "HouseVerification": {
                                order: 40,
                                key: "customer.udf.userDefinedFieldValues.udf5",

                            },
                            "Toilet1": {
                                order:40,
                                key: "customer.udf.userDefinedFieldValues.udf6"
                            },
                            "durationOfStay": {
                                order: 50,
                                key: "customer.udf.userDefinedFieldValues.udf4",
                                type: "radios"
                            },
                            "YearsOfBusinessPresentAddress": {
                                order: 60,
                                key: "customer.udf.userDefinedFieldValues.udf32"
                            }
                        }
                    },
                    "latitude": {
                        "key": "customer.latitude",
                        orderNo: 80,
                        "title": "HOUSE_LOCATION",
                        "type": "geotag",
                        //readonly: true,
                        "latitude": "customer.latitude",
                        "longitude": "customer.longitude",
                        "onChange": "fillGeolocation(modelValue, form)"
                    },
                    "nameOfRo": {
                        key: "customer.nameOfRo"
                    },
                    "houseVerificationPhoto": {
                        key: "customer.houseVerificationPhoto",
                        offline: true,
                        type: "file",
                        fileType: "image/*"
                    },
                    "verifications": {
                        "key": "customer.verifications",
                        "title": "VERIFICATION",
                        "type": 'array',
                        "add": null,
                        "remove": null,
                        "items": {
                            "houseNo": {
                                key: "customer.verifications[].houseNo"
                            },
                            "houseNoIsVerified1":{
                                key:"customer.verifications[].houseNoIsVerified1",
                                "required":true,
                                "type": "checkbox",
                                "title": "HOUSE_NO_IS_VERIFIED",
                                "required": true,
                                "schema": {
                                    "default": false
                                }
                            },
                            "houseNoIsVerified": {
                                key: "customer.verifications[].houseNoIsVerified"
                            },
                            "referenceFirstName": {
                                key: "customer.verifications[].referenceFirstName"
                            },
                            "referenceLastName": {
                                key: "customer.verifications[].referenceLastName",
                                "condition": "model.customer.verifications[arrayIndex].referenceLastName"
                            },
                            "relationship": {
                                key: "customer.verifications[].relationship",
                                type: "select"
                            }
                        }
                    },
                    "date": {
                        key: "customer.date",
                        type: "date"
                    },
                    "place": {
                        key: "customer.place",
                    },
                }
            },
            "EDF":{
                "type": "box",
                "title": "EDF",
                "items": {
                    "condition":{
                        "key": "customer.udf.userDefinedFieldValues.udf40",
                        title: "Agree with the terms and conditions",
                        type: "radios",
                        titleMap: {
                            "ACCEPT": "ACCEPT",
                            "REJECT": "REJECT",
                        }
                    },
                }
            },
            "assets": {
                "type": "box",
                orderNo: 90,
                "title": "T_ASSETS",
                "items": {
                    "physicalAssets": {
                        key: "customer.physicalAssets",
                        type: "array",
                        startEmpty: true,
                        items: {
                            "assetType": {
                                key: "customer.physicalAssets[].assetType",
                                "title": "ASSET_TYPE",
                                type: "select",
                                enumCode: "asset_type"
                            },
                            "ownedAssetDetails": {
                                key: "customer.physicalAssets[].ownedAssetDetails",
                                type: "select",
                                screenFilter: true,
                                enumCode: "asset_Details",
                                parentEnumCode: "asset_type",
                                parentValueExpr: "model.customer.physicalAssets[arrayIndex].assetType",
                            },
                            "unit": {
                                key: "customer.physicalAssets[].unit",
                                "title": "UNIT",
                                type: "select",
                                screenFilter: true,
                                parentEnumCode: "asset_type",
                                parentValueExpr: "model.customer.physicalAssets[arrayIndex].assetType",
                            },
                            "numberOfOwnedAsset": {
                                "title": "NUMBER_OF_ASSETS",
                                key: "customer.physicalAssets[].numberOfOwnedAsset",
                            },
                            "ownedAssetValue": {
                                key: "customer.physicalAssets[].ownedAssetValue",
                                type: "amount"
                            }
                        }
                    },
                    "financialAssets": {
                        key: "customer.financialAssets",
                        title: "FINANCIAL_ASSETS",
                        type: "array",
                        startEmpty: true,
                        items: {
                            "instrumentType": {
                                key: "customer.financialAssets[].instrumentType",
                                type: "select"
                            },
                            "nameOfInstitution": {
                                key: "customer.financialAssets[].nameOfInstitution",
                            },
                            "insuranceType": {
                                "type": "select",
                                key: "customer.financialAssets[].udf1",
                                condition: "model.customer.financialAssets[arrayIndex].instrumentType == 'INSURANCE'",
                                "title": "INSURANCE_TYPE",
                                titleMap: {
                                    "Health": "Health",
                                    "Life": "Life"
                                }
                            },
                            "ownedBy": {
                                "type": "select",
                                key: "customer.financialAssets[].udf2",
                                "title": "OWNED_BY",
                                titleMap: {
                                    "Self": "Self",
                                    "Others": "Other Family Members"
                                }
                            },
                            "instituteType": {
                                key: "customer.financialAssets[].instituteType",
                                type: "select"
                            },
                            "amountInPaisa": {
                                key: "customer.financialAssets[].amountInPaisa",
                                type: "amount"
                            },
                            "frequencyOfDeposite": {
                                key: "customer.financialAssets[].frequencyOfDeposite",
                                type: "select"
                            },
                            "startDate": {
                                key: "customer.financialAssets[].startDate",
                                type: "date"
                            },
                            "maturityDate": {
                                key: "customer.financialAssets[].maturityDate",
                                type: "date"
                            },
                        }
                    }
                }
            },
            "bankAccounts": {
                type: "box",
                orderNo: 100,
                title: "BANK_ACCOUNTS",
                items: {
                    "customerBankAccounts": {
                        key: "customer.customerBankAccounts",
                        type: "array",
                        title: "BANK_ACCOUNTS",
                        startEmpty: true,
                        onArrayAdd: function (modelValue, form, model, formCtrl, $event) {
                            modelValue.bankStatements = [];
                            var CBSDateMoment = moment(SessionStore.getCBSDate(), SessionStore.getSystemDateFormat());
                            var noOfMonthsToDisplay = 6;
                            var statementStartMoment = CBSDateMoment.subtract(noOfMonthsToDisplay, 'months').startOf('month');
                            for (var i = 0; i < noOfMonthsToDisplay; i++) {
                                modelValue.bankStatements.push({
                                    startMonth: statementStartMoment.format(SessionStore.getSystemDateFormat())
                                });
                                statementStartMoment = statementStartMoment.add(1, 'months').startOf('month');
                            }
                        },
                        items: {
                            "ifscCode": {
                                key: "customer.customerBankAccounts[].ifscCode",
                                type: "lov",
                                lovonly: true,
                                required: true,
                                inputMap: {
                                    "ifscCode": {
                                        "key": "customer.customerBankAccounts[].ifscCode"
                                    },
                                    "bankName": {
                                        "key": "customer.customerBankAccounts[].customerBankName"
                                    },
                                    "branchName": {
                                        "key": "customer.customerBankAccounts[].customerBankBranchName"
                                    }
                                },
                                outputMap: {
                                    "bankName": "customer.customerBankAccounts[arrayIndex].customerBankName",
                                    "branchName": "customer.customerBankAccounts[arrayIndex].customerBankBranchName",
                                    "ifscCode": "customer.customerBankAccounts[arrayIndex].ifscCode"
                                },
                                searchHelper: formHelper,
                                search: function (inputModel, form) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = CustomerBankBranch.search({
                                        'bankName': inputModel.bankName,
                                        'ifscCode': inputModel.ifscCode,
                                        'branchName': inputModel.branchName
                                    }).$promise;
                                    return promise;
                                },
                                getListDisplayItem: function (data, index) {
                                    return [
                                        data.ifscCode,
                                        data.branchName,
                                        data.bankName
                                    ];
                                }
                            },
                            "customerBankName": {
                                key: "customer.customerBankAccounts[].customerBankName",
                                required: true,
                                readonly: true
                            },
                            "customerBankBranchName": {
                                key: "customer.customerBankAccounts[].customerBankBranchName",
                                required: true,
                                readonly: true
                            },
                            "customerNameAsInBank": {
                                key: "customer.customerBankAccounts[].customerNameAsInBank"
                            },
                            "accountNumber": {
                                key: "customer.customerBankAccounts[].accountNumber",
                                type: "password",
                                inputmode: "number",
                                numberType: "tel"
                            },
                            "confirmedAccountNumber": {
                                key: "customer.customerBankAccounts[].confirmedAccountNumber",
                                inputmode: "number",
                                numberType: "tel"
                            },
                            "accountType": {
                                key: "customer.customerBankAccounts[].accountType",
                                type: "select"
                            },
                            "bankingSince": {
                                key: "customer.customerBankAccounts[].bankingSince",
                                type: "date",
                                title: "BANKING_SINCE"
                            },
                            "netBankingAvailable": {
                                key: "customer.customerBankAccounts[].netBankingAvailable",
                                type: "select",
                                title: "NET_BANKING_AVAILABLE",
                                enumCode: "decisionmaker"
                            },
                            "sanctionedAmount": {
                                key: "customer.customerBankAccounts[].sanctionedAmount",
                                condition: "model.customer.customerBankAccounts[arrayIndex].accountType =='OD'||model.customer.customerBankAccounts[arrayIndex].accountType =='CC'",
                                type: "amount",
                                required: true,
                                title: "OUTSTANDING_BALANCE"
                            },
                            "limit": {
                                key: "customer.customerBankAccounts[].limit",
                                type: "amount"
                            },
                            "bankStatementDocId": {
                                key: "customer.customerBankAccounts[].bankStatementDocId",
                                type: "file",
                                title: "BANK_STATEMENT_UPLOAD",
                                fileType: "application/pdf",
                                "category": "CustomerEnrollment",
                                "subCategory": "IDENTITYPROOF",
                                using: "scanner"
                            },
                            "bankStatements": {
                                key: "customer.customerBankAccounts[].bankStatements",
                                type: "array",
                                title: "STATEMENT_DETAILS",
                                titleExpr: "moment(model.customer.customerBankAccounts[arrayIndexes[0]].bankStatements[arrayIndexes[1]].startMonth).format('MMMM YYYY') + ' ' + ('STATEMENT_DETAILS' | translate)",
                                titleExprLocals: {moment: window.moment},
                                startEmpty: true,
                                items: {
                                    "startMonth": {
                                        key: "customer.customerBankAccounts[].bankStatements[].startMonth",
                                        type: "date",
                                        title: "START_MONTH"
                                    },
                                    "totalDeposits": {
                                        key: "customer.customerBankAccounts[].bankStatements[].totalDeposits",
                                        type: "amount",
                                        calculator: true,
                                        creditDebitBook: true,
                                        onDone: function (result, model, context) {
                                            model.customer.customerBankAccounts[context.arrayIndexes[0]].bankStatements[context.arrayIndexes[1]].totalDeposits = result.totalCredit;
                                            model.customer.customerBankAccounts[context.arrayIndexes[0]].bankStatements[context.arrayIndexes[1]].totalWithdrawals = result.totalDebit;
                                        },
                                        title: "TOTAL_DEPOSITS"
                                    },
                                    "totalWithdrawals": {
                                        key: "customer.customerBankAccounts[].bankStatements[].totalWithdrawals",
                                        type: "amount",
                                        title: "TOTAL_WITHDRAWALS"
                                    },
                                    "balanceAsOn15th": {
                                        key: "customer.customerBankAccounts[].bankStatements[].balanceAsOn15th",
                                        type: "amount",
                                        title: "BALENCE_AS_ON_REQUESTED_EMI_DATE"
                                    },
                                    "noOfChequeBounced": {
                                        key: "customer.customerBankAccounts[].bankStatements[].noOfChequeBounced",
                                        type: "amount",
                                        //maximum:99,
                                        required: true,
                                        title: "NO_OF_CHEQUE_BOUNCED"
                                    },
                                    "noOfEmiChequeBounced": {
                                        key: "customer.customerBankAccounts[].bankStatements[].noOfEmiChequeBounced",
                                        type: "amount",
                                        required: true,
                                        //maximum:99,
                                        title: "NO_OF_EMI_CHEQUE_BOUNCED"
                                    },
                                    "bankStatementPhoto": {
                                        key: "customer.customerBankAccounts[].bankStatements[].bankStatementPhoto",
                                        type: "file",
                                        required: true,
                                        title: "BANK_STATEMENT_UPLOAD",
                                        fileType: "application/pdf",
                                        "category": "CustomerEnrollment",
                                        "subCategory": "IDENTITYPROOF",
                                        using: "scanner"
                                    },
                                }
                            },
                            "isDisbersementAccount": {
                                key: "customer.customerBankAccounts[].isDisbersementAccount",
                                type: "radios",
                                titleMap: [{
                                    value: true,
                                    name: "Yes"
                                }, {
                                    value: false,
                                    name: "No"
                                }]
                            }
                        }
                    }
                }
            },
            "Liabilities1": {
                type: "box",
                orderNo: 110,
                title: "T_LIABILITIES",
                items: {
                    "liabilities": {
                        key: "customer.liabilities",
                        type: "array",
                        startEmpty: true,
                        title: "FINANCIAL_LIABILITIES",
                        items: {
                            "loanType": {
                                key: "customer.liabilities[].loanType",
                                type: "select"
                            },
                            "loanSource": {
                                key: "customer.liabilities[].loanSource",
                                type: "select"
                            },
                            "instituteName": {
                                key: "customer.liabilities[].instituteName",
                            },
                            "loanAmountInPaisa": {
                                key: "customer.liabilities[].loanAmountInPaisa",
                                type: "amount"
                            },
                            "installmentAmountInPaisa": {
                                key: "customer.liabilities[].installmentAmountInPaisa",
                                type: "amount"
                            },
                            "outstandingAmountInPaisa": {
                                key: "customer.liabilities[].outstandingAmountInPaisa",
                                type: "amount",
                                title: "OUTSTANDING_AMOUNT"
                            },
                            "startDate": {
                                key: "customer.liabilities[].startDate",
                                type: "date"
                            },
                            "maturityDate": {
                                key: "customer.liabilities[].maturityDate",
                                type: "date"
                            },
                            "frequencyOfInstallment": {
                                key: "customer.liabilities[].frequencyOfInstallment",
                                type: "select"
                            },
                            "liabilityLoanPurpose": {
                                key: "customer.liabilities[].liabilityLoanPurpose",
                                type: "select"
                            }
                        }
                    }
                }
            },
            "loanInformation": {
                "type": "box",
                orderNo: 120,
                "title": "LOAN_INFORMATION",
                "items": {
                    "requestedLoanAmount": {
                        orderNo: 10,
                        key: "customer.requestedLoanAmount",
                        required: true,
                        type: "amount",
                        title: "REQUESTED_LOAN_INFORMATION"
                    },
                    "requestedLoanPurpose": {
                        orderNo: 20,
                        key: "customer.requestedLoanPurpose",
                        title: "REQUESTED_LOAN_PURPOSE",
                        required: true,
                        "enumCode": "loan_purpose_1",
                        type: "select"
                    },
                }
            },
            "Biometric":{
                "type": "box",
                orderNo: 130,
                "title": "BIOMETRIC",
                "items": {
                    "CaptureFingerPrint":{
                        type: "button",
                        title: "CAPTURE_FINGERPRINT",
                        notitle: true,
                        fieldHtmlClass: "btn-block",
                        onClick: function(model, form, formName){
                            var promise = BiometricService.capture(model);
                            promise.then(function(data){
                                model.customer.$fingerprint = data;
                            }, function(reason){
                                console.log(reason);
                            })
                        }
                    },
                    "FingerPrintSection":{
                        "type": "section",
                        "html": '<div class="row"> <div class="col-xs-6">' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftThumb\')"></i> {{ model.getFingerLabel(\'LeftThumb\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftIndex\')"></i> {{ model.getFingerLabel(\'LeftIndex\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftMiddle\')"></i> {{ model.getFingerLabel(\'LeftMiddle\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftRing\')"></i> {{ model.getFingerLabel(\'LeftRing\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftLittle\')"></i> {{ model.getFingerLabel(\'LeftLittle\') }}</span><br>' +
                        '</div> <div class="col-xs-6">' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightThumb\')"></i> {{ model.getFingerLabel(\'RightThumb\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightIndex\')"></i> {{ model.getFingerLabel(\'RightIndex\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightMiddle\')"></i> {{ model.getFingerLabel(\'RightMiddle\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightRing\')"></i> {{ model.getFingerLabel(\'RightRing\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightLittle\')"></i> {{ model.getFingerLabel(\'RightLittle\') }}</span><br>' +
                        '</div></div>'
                    }
                }
            },
            "actionbox": {
                "type": "actionbox",
                orderNo: 140,
                //"condition": "model.customer.id",
                "items": {
                    "submit": {
                        "type": "submit",
                        "title": "SUBMIT"
                    }
                }
            },
            "actionbox1": {
                "type": "actionbox",
                orderNo: 141,
                //"condition": "model.customer.id",
                "items": {
                    "saveBasicDetails": {
                        "type": "button",
                        "title": "SUBMIT",
                        "onClick": "actions.saveBasicDetails(model, formCtrl, form, $event)"
                    }
                }
            },
            "actionbox2": {
                "type": "actionbox",
                orderNo: 142,
                //"condition": "model.customer.id",
                "items": {
                    "save": {
                        "type": "save",
                        "title": "OFFLINE_SAVE"
                    }
                }
            }
        };

        formRepository['LeadGeneration'] = {
            "leadProfile": {
                "type": "box",
                "title": "LEAD_PROFILE",
                "items": {
                    "branchName": {
                        key: "lead.branchName",
                        type: "select",
                        readonly: true
                    },
                    "centerName": {
                        key: "lead.centreName",
                        type: "lov",
                        autolov: true,
                        bindMap: {},
                        required: true,
                        searchHelper: formHelper,
                        search: function (inputModel, form, model, context) {
                            var centres = SessionStore.getCentres();
                            $log.info("hi");
                            $log.info(centres);

                            var centreCode = formHelper.enum('centre').data;
                            var out = [];
                            if (centres && centres.length) {
                                for (var i = 0; i < centreCode.length; i++) {
                                    for (var j = 0; j < centres.length; j++) {
                                        if (centreCode[i].value == centres[j].id) {
                                            out.push({
                                                name: centreCode[i].name,
                                                id: centreCode[i].value
                                            })
                                        }
                                    }
                                }
                            }
                            return $q.resolve({
                                headers: {
                                    "x-total-count": out.length
                                },
                                body: out
                            });
                        },
                        onSelect: function (valueObj, model, context) {
                            model.lead.centreName = valueObj.name;
                            model.lead.centreId = valueObj.id;
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.name
                            ];
                        }
                    },
                    /*{
                     key: "lead.centreId",
                     type: "select",
                     parentEnumCode: "branch_id",
                     parentValueExpr: "model.lead.branchId",
                     screenFilter: true
                     },*/
                    "ID": {
                        key: "lead.id",
                        condition: "model.lead.id",
                        readonly: true
                    },
                    "urnNo": {
                        key: "lead.urnNo",
                        condition: "model.lead.urnNo",
                        readonly: true
                    },

                    // "leadDetails":{
                    //     type: "fieldset",
                    //     // condition: "model.siteCode !== 'sambandh' && model.siteCode !== 'saija'",
                    //     title: "LEAD_DETAILS",
                    //     items: {
                    //         "leadName":{
                    //             key: "lead.leadName",
                    //             title: "APPLICANT_NAME"
                    //         },
                    //         "customerType":{
                    //             key: "lead.customerType",
                    //             type: "select",
                    //             titleMap: {
                    //                 "Individual": "Individual",
                    //                 "Enterprise": "Individual and Enterprise"
                    //             }

                    //         },
                    //         "enterpriseDetails":{
                    //             type: "fieldset",
                    //             title: "ENTERPRISE_DETAILS",
                    //             condition: "model.lead.customerType === 'Enterprise'",
                    //             items: {
                    //                 "businessName":{
                    //                     key: "lead.businessName"
                    //                 },
                    //                 "companyRegistered":{
                    //                     key: "lead.companyRegistered",
                    //                     type: "radios",
                    //                     enumCode: "decisionmaker"
                    //                 },
                    //                 "businessType":{
                    //                     key: "lead.businessType",
                    //                     type: "select",
                    //                     enumCode: "businessType"
                    //                 },
                    //                 "businessActivity":{
                    //                     key: "lead.businessActivity",
                    //                     //title:"BUSINESS_LINE",
                    //                     type: "select",
                    //                     enumCode: "businessActivity",
                    //                     parentEnumCode: "businessType"
                    //                 },
                    //                 "companyOperatingSince":{
                    //                     key: "lead.companyOperatingSince",
                    //                     type: "date"
                    //                 },
                    //                 "ownership":{
                    //                     key: "lead.ownership",
                    //                     type: "select",
                    //                     enumCode: "ownership",

                    //                 /*titleMap: {
                    //                     "Owned": "Owned",
                    //                     "Own house without registration": "Own house without registration",
                    //                     "Family Property": "Family Property",
                    //                     "Leased": "Leased",
                    //                     "Rental": "Rental",
                    //                 }*/

                    //                 },
                    //                 "individalDetails":{
                    //                     type: "fieldset",
                    //                     title: "INDIVIDUAL_DETAILS",
                    //                     items: {
                    //                         "gender": {
                    //                             key: "lead.gender",
                    //                             type: "radios"
                    //                         },
                    //                         "dob":{
                    //                             key: "lead.dob",
                    //                             type: "date",
                    //                             "onChange": function(modelValue, form, model) {
                    //                                 if (model.lead.dob) {
                    //                                     model.lead.age = moment().diff(moment(model.lead.dob, SessionStore.getSystemDateFormat()), 'years');
                    //                                 }
                    //                             }
                    //                         },
                    //                         "age":{
                    //                             key: "lead.age",
                    //                             type: "number",
                    //                             "onChange": function(modelValue, form, model) {
                    //                                 if (model.lead.age > 0) {
                    //                                     if (model.lead.dob) {
                    //                                         model.lead.dob = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-') + moment(model.lead.dob, 'YYYY-MM-DD').format('MM-DD');
                    //                                     } else {
                    //                                         model.lead.dob = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-MM-DD');
                    //                                     }
                    //                                 }
                    //                             }
                    //                         },
                    //                         "maritalStatus": {
                    //                             key: "lead.maritalStatus",
                    //                             type: "select",
                    //                             enumCode: "marital_status",
                    //                             /*titleMap: {
                    //                                 "MARRIED": "MARRIED",
                    //                                 "UNMARRIED": "UNMARRIED",
                    //                                 "DIVORCED": "DIVORCED",
                    //                                 "SEPARATED": "SEPARATED",
                    //                                 "WIDOW(ER)": "WIDOW(ER)",
                    //                             }*/
                    //                         },
                    //                         "educationStatus":{
                    //                             key: "lead.educationStatus",
                    //                             type: "select",
                    //                             enumCode: "education",
                    //                                 /* titleMap: {
                    //                              "Below SSLC": "Below SSLC",
                    //                              "ITI/Diploma/Professional Qualification": "ITI/Diploma/ProfessionalQualification",
                    //                              "Graduate/Equivalent to graduate": "Graduate/Equivalent",
                    //                              "Post graduate&equivalent": "PostGraduate & Equivalent",
                    //                              "More than post graduation": "MoreThanPostGraduation",
                    //                             }*/
                    //                         }
                    //                     }
                    //                 }
                    //             }
                    //         },

                    //         "individualDetails": {
                    //             type: "fieldset",
                    //             title: "INDIVIDUAL_DETAILS",
                    //             condition: "model.lead.customerType === 'Individual'",
                    //             items: {
                    //                 "gender": {
                    //                     key: "lead.gender",
                    //                     type: "radios"
                    //                 },
                    //                 "dob": {
                    //                     key: "lead.dob",
                    //                     type: "date",
                    //                     "onChange": function(modelValue, form, model) {
                    //                         if (model.lead.dob) {
                    //                             model.lead.age = moment().diff(moment(model.lead.dob, SessionStore.getSystemDateFormat()), 'years');
                    //                         }
                    //                     }
                    //                 },
                    //                 "age": {
                    //                     key: "lead.age",
                    //                     type: "number",
                    //                     "onChange": function(modelValue, form, model) {
                    //                         if (model.lead.age > 0) {
                    //                             if (model.lead.dob) {
                    //                                 model.lead.dob = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-') + moment(model.lead.dob, 'YYYY-MM-DD').format('MM-DD');
                    //                             } else {
                    //                                 model.lead.dob = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-MM-DD');
                    //                             }
                    //                         }
                    //                     }
                    //                 },
                    //                 "maritalStatus":{
                    //                     key: "lead.maritalStatus",
                    //                     type: "select",
                    //                     enumCode: "marital_status",
                    //                 /*titleMap: {
                    //                     "MARRIED": "MARRIED",
                    //                     "UNMARRIED": "UNMARRIED",
                    //                     "DIVORCED": "DIVORCED",
                    //                     "SEPARATED": "SEPARATED",
                    //                     "WIDOW(ER)": "WIDOW(ER)",
                    //                 }*/
                    //                 },
                    //                 "educationStatus":{
                    //                     key: "lead.educationStatus",
                    //                     type: "select",
                    //                     enumCode: "education",
                    //                     /* titleMap: {
                    //                          "Below SSLC": "Below SSLC",
                    //                          "ITI/Diploma/Professional Qualification": "ITI/Diploma/ProfessionalQualification",
                    //                          "Graduate/Equivalent to graduate": "Graduate/Equivalent",
                    //                          "Post graduate&equivalent": "PostGraduate & Equivalent",
                    //                          "More than post graduation": "MoreThanPostGraduation",
                    //                      }*/
                    //                 }
                    //             }
                    //         },

                    //         "contactDetails":{
                    //             type: "fieldset",
                    //             title: "CONTACT_DETAILS",
                    //             condition: "model.lead.customerType === 'Individual'||model.lead.customerType === 'Enterprise'",
                    //             items: {
                    //                 "mobileNo":{
                    //                     key: "lead.mobileNo",
                    //                 },
                    //                 "alternateMobileNo":{
                    //                     key: "lead.alternateMobileNo",
                    //                 },
                    //                 "addressLine1":{
                    //                     key: "lead.addressLine1",
                    //                     "title": "DOOR_NO"
                    //                 },
                    //                 "addressLine2":{
                    //                     key: "lead.addressLine2",
                    //                     "title": "STREET"
                    //                 },
                    //                 "pincode":{
                    //                     key: "lead.pincode",
                    //                     type: "lov",
                    //                     fieldType: "number",
                    //                     autolov: true,
                    //                     inputMap: {
                    //                         "pincode": "lead.pincode",
                    //                         "district": {
                    //                             key: "lead.district"
                    //                         },
                    //                         "state": {
                    //                             key: "lead.state"
                    //                         }
                    //                     },
                    //                     outputMap: {
                    //                         "division": "lead.area",
                    //                         "region": "lead.cityTownVillage",
                    //                         "pincode": "lead.pincode",
                    //                         "district": "lead.district",
                    //                         "state": "lead.state"

                    //                     },
                    //                     searchHelper: formHelper,
                    //                     search: function(inputModel, form, model) {
                    //                         return Queries.searchPincodes(inputModel.pincode, inputModel.district, inputModel.state);
                    //                     },
                    //                     getListDisplayItem: function(item, index) {
                    //                         return [
                    //                             item.division + ', ' + item.region,
                    //                             item.pincode,
                    //                             item.district + ', ' + item.state
                    //                         ];
                    //                     }
                    //                 },
                    //                 "area":{
                    //                     "key": "lead.area",
                    //                     "readonly": true
                    //                 },
                    //                 "cityTownVillage":{
                    //                     "key": "lead.cityTownVillage",
                    //                     "readonly": true
                    //                 },
                    //                 "district":{
                    //                     "key": "lead.district",
                    //                     "readonly": true
                    //                 },
                    //                 "state":{
                    //                     "key": "lead.state",
                    //                     "readonly": true
                    //                 }
                    //             }
                    //         },
                    //     }
                    // },
                    "leadDetails": {
                        type: "fieldset",
                        // condition: "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                        title: "LEAD_DETAILS",
                        items: {
                            "customerTypeString": {
                                key: "lead.customerTypeString",
                                type: "select",
                                titleMap: {
                                    "Individual": "Individual",
                                    "Enterprise": "Individual and Enterprise"
                                },
                                readonly: true

                            },
                            "enterpriseDetails": {
                                type: "fieldset",
                                title: "ENTERPRISE_DETAILS",
                                condition: "model.lead.customerTypeString === 'Enterprise'",
                                items: {
                                    "businessName": {
                                        key: "lead.businessName",
                                        required: false,
                                    },
                                    "companyRegistered": {
                                        key: "lead.companyRegistered",
                                        type: "radios",
                                        enumCode: "decisionmaker"
                                    },
                                    "businessType": {
                                        key: "lead.businessType",
                                        required: false,
                                        type: "select",
                                        enumCode: "businessType"
                                    },
                                    "businessActivity": {
                                        key: "lead.businessActivity",
                                        //title:"BUSINESS_LINE",
                                        required: false,
                                        type: "select",
                                        enumCode: "businessActivity",
                                        parentEnumCode: "businessType"
                                    },
                                    "companyOperatingSince": {
                                        key: "lead.companyOperatingSince",
                                        type: "date"
                                    },
                                    "ownership": {
                                        key: "lead.ownership",
                                        type: "select",
                                        enumCode: "ownership",

                                        /*titleMap: {
                                         "Owned": "Owned",
                                         "Own house without registration": "Own house without registration",
                                         "Family Property": "Family Property",
                                         "Leased": "Leased",
                                         "Rental": "Rental",
                                         }*/
                                    },
                                    "individualDetails": {
                                        type: "fieldset",
                                        title: "INDIVIDUAL_DETAILS",
                                        items: {
                                            "gender": {
                                                key: "lead.gender",
                                                type: "radios"
                                            },
                                            "dob": {
                                                key: "lead.dob",
                                                type: "date",
                                                "onChange": function (modelValue, form, model) {
                                                    if (model.lead.dob) {
                                                        model.lead.age = moment().diff(moment(model.lead.dob, SessionStore.getSystemDateFormat()), 'years');
                                                    }
                                                }
                                            },
                                            "age": {
                                                key: "lead.age",
                                                type: "number",
                                                "onChange": function (modelValue, form, model) {
                                                    if (model.lead.age > 0) {
                                                        if (model.lead.dob) {
                                                            model.lead.dob = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-') + moment(model.lead.dob, 'YYYY-MM-DD').format('MM-DD');
                                                        } else {
                                                            model.lead.dob = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-MM-DD');
                                                        }
                                                    }
                                                }
                                            },
                                            "maritalStatus": {
                                                key: "lead.maritalStatus",
                                                type: "select",
                                                enumCode: "marital_status",
                                                /*titleMap: {
                                                 "MARRIED": "MARRIED",
                                                 "UNMARRIED": "UNMARRIED",
                                                 "DIVORCED": "DIVORCED",
                                                 "SEPARATED": "SEPARATED",
                                                 "WIDOW(ER)": "WIDOW(ER)",
                                                 }*/
                                            },
                                            "educationStatus": {
                                                key: "lead.educationStatus",
                                                type: "select",
                                                enumCode: "education",
                                                required: true
                                                /* titleMap: {
                                                 "Below SSLC": "Below SSLC",
                                                 "ITI/Diploma/Professional Qualification": "ITI/Diploma/ProfessionalQualification",
                                                 "Graduate/Equivalent to graduate": "Graduate/Equivalent",
                                                 "Post graduate&equivalent": "PostGraduate & Equivalent",
                                                 "More than post graduation": "MoreThanPostGraduation",
                                                 }*/
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    },
                    "individualDetails": {
                        type: "fieldset",
                        title: "INDIVIDUAL_DETAILS",
                        // condition: "model.lead.customerTypeString === 'Individual'",
                        items: {
                            "leadName": {
                                key: "lead.leadName",
                                title: "APPLICANT_NAME",
                                schema: {
                                    pattern: "^[a-zA-Z\. ]+$",
                                },
                                "orderNo": 10,
                                validationMessage: {202: "Only alphabets and space are allowed."},
                            },
                            "existingApplicant": {
                                "key": "lead.applicantCustomerId",
                                "title": "CHOOSE_EXISTING_APPLICANT",
                                "type": "lov",
                                "orderNo": 5,
                                "condition": "model.lead.customerId==null", /* Dont show if an existing business is selected */
                                // "autolov": true,
                                "lovonly": true,
                                initialize: function(model, form, parentModel, context) {
                                    model.branchId = parentModel.lead.branchName;
                                    model.centreName = parentModel.lead.centreName;
                                },
                                "inputMap": {
                                    "firstName": {
                                        "key": "lead.customerFirstName"
                                    },
                                    "urnNo": {
                                        "key": "lead.urnNo",
                                    },
                                    "branchId": {
                                        "key": "lead.branchName",
                                        "type": "select",
                                        "screenFilter": true,
                                        "readonly": true
                                    },
                                    "centreName": {
                                        "key": "lead.centreName",
                                        "type": "string",
                                        "readonly": true,
                                    },
                                },
                                "searchHelper": formHelper,
                                "search": function(inputModel, form,model) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var branches = formHelper.enum('branch_id').data;
                                    var branchName;
                                    for (var i = 0; i < branches.length; i++) {
                                        if (branches[i].code == inputModel.customerBranchId)
                                            branchName = branches[i].name;
                                    }
                                    var promise = Enrollment.search({
                                        'branchName': branchName || SessionStore.getBranch(),
                                        'firstName': inputModel.firstName,
                                        'centreId': model.lead.centreId,
                                        'customerType': "individual",
                                        'urnNo': inputModel.urnNo
                                    }).$promise;
                                    return promise;
                                },
                                getListDisplayItem: function(data, index) {
                                    return [
                                        [data.firstName, data.fatherFirstName].join(' | '),
                                        data.id,
                                        data.urnNo
                                    ];
                                },
                                onSelect: function(valueObj, model, context) {
                                    Enrollment.getCustomerById({id: valueObj.id})
                                        .$promise
                                        .then(function(res){
                                            PageHelper.showProgress("customer-load", "Done..", 5000);
                                            model.lead.mobileNo = res.mobilePhone;
                                            model.lead.gender = res.gender;
                                            model.lead.leadName = res.firstName;
                                            model.lead.maritalStatus=res.maritalStatus;
                                            model.lead.landLineNo=res.landLineNo;
                                            model.lead.dob=res.dateOfBirth;
                                            model.lead.addressLine1=res.doorNo;
                                            model.lead.addressLine2=res.street;
                                            model.lead.pincode=res.pincode;
                                            model.lead.district=res.district;
                                            model.lead.state=res.state;
                                            model.lead.area=res.locality;
                                            model.lead.cityTownVillage=res.villageName;
                                            model.lead.applicantCustomerId = res.id;
                                            if (model.lead.dob) {
                                                model.lead.age = moment().diff(moment(model.lead.dob, SessionStore.getSystemDateFormat()), 'years');
                                            }
                                            for (var i=0;i<res.familyMembers.length; i++){
                                                var f = res.familyMembers[i];
                                                if (_.isString(f.relationShip) && f.relationShip.toUpperCase() == 'SELF'){
                                                    selfExist = true;
                                                    break;
                                                }
                                            }
                                            model.lead.educationStatus = f.educationStatus;
                                        }, function(httpRes){
                                            PageHelper.showProgress("customer-load", 'Unable to load customer', 5000);
                                        })

                                }

                            },
                            "gender": {
                                key: "lead.gender",
                                type: "radios"
                            },
                            "dob": {
                                key: "lead.dob",
                                type: "date",
                                "onChange": function (modelValue, form, model) {
                                    if (model.lead.dob) {
                                        model.lead.age = moment().diff(moment(model.lead.dob, SessionStore.getSystemDateFormat()), 'years');
                                    }
                                }
                            },
                            "age": {
                                key: "lead.age",
                                type: "number",
                                "onChange": function (modelValue, form, model) {
                                    if (model.lead.age > 0) {
                                        if (model.lead.dob) {
                                            model.lead.dob = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-') + moment(model.lead.dob, 'YYYY-MM-DD').format('MM-DD');
                                        } else {
                                            model.lead.dob = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-MM-DD');
                                        }
                                    }
                                }
                            },
                            "maritalStatus": {
                                key: "lead.maritalStatus",
                                type: "select",
                                enumCode: "marital_status",
                                /*titleMap: {
                                 "MARRIED": "MARRIED",
                                 "UNMARRIED": "UNMARRIED",
                                 "DIVORCED": "DIVORCED",
                                 "SEPARATED": "SEPARATED",
                                 "WIDOW(ER)": "WIDOW(ER)",
                                 }*/
                            },
                            "educationStatus": {
                                key: "lead.educationStatus",
                                type: "select",
                                enumCode: "education",
                                //required: true
                                /* titleMap: {
                                 "Below SSLC": "Below SSLC",
                                 "ITI/Diploma/Professional Qualification": "ITI/Diploma/ProfessionalQualification",
                                 "Graduate/Equivalent to graduate": "Graduate/Equivalent",
                                 "Post graduate&equivalent": "PostGraduate & Equivalent",
                                 "More than post graduation": "MoreThanPostGraduation",
                                 }*/
                            },
                            "occupation1": {
                                key: "lead.occupation1",
                                type: "select",
                                enumCode: "lead_primary_occupation",
                                /*titleMap: {

                                 }*/
                            },
                            "leadCategory": {
                                key: "lead.leadCategory",
                                type: "select",
                                enumCode: "lead_category",
                                required: "true"
                                /*titleMap: {

                                 }*/
                            },
                            "licenseType": {
                                key: "lead.licenseType",
                                type: "select",
                                enumCode: "licence_type",
                                /*titleMap: {

                                 }*/
                            }

                        }
                    },

                    "contactDetails": {
                        type: "fieldset",
                        title: "CONTACT_DETAILS",
                        condition: "model.lead.customerTypeString === 'Individual'||model.lead.customerTypeString === 'Enterprise'",
                        items: {
                            "mobileNo": {
                                key: "lead.mobileNo",
                                orderNo: 10
                            },
                            "alternateMobileNo": {
                                key: "lead.alternateMobileNo",
                                orderNo: 20
                            },
                            "addressLine1": {
                                key: "lead.addressLine1",
                                "title": "DOOR_NO",
                                orderNo: 40
                            },
                            "addressLine2": {
                                key: "lead.addressLine2",
                                "title": "STREET",
                                orderNo: 50
                            },
                            "location": {
                                "key": "lead.location",
                                "type": "geotag",
                                "latitude": "lead.latitude",
                                "longitude": "lead.longitude",
                                "orderNo": 30
                            },
                            "postOffice": {
                                "key": "lead.postOffice",
                                "title": "POST_OFFICE",
                                orderNo: 60
                            },
                            "landmark": {
                                "key": "lead.landmark",
                                "title": "LANDMARK",
                                "orderNo": 70
                            },
                            "pincode": {
                                key: "lead.pincode",
                                type: "lov",
                                fieldType: "number",
                                orderNo: 80,
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
                                search: function (inputModel, form, model) {
                                    return Queries.searchPincodes(inputModel.pincode, inputModel.district, inputModel.state);
                                },
                                getListDisplayItem: function (item, index) {
                                    return [
                                        item.division + ', ' + item.region,
                                        item.pincode,
                                        item.district + ', ' + item.state
                                    ];
                                }
                            },
                            "area": {
                                "key": "lead.area",
                                "readonly": true,
                                "orderNo": 90
                            },
                            "cityTownVillage": {
                                "key": "lead.cityTownVillage",
                                "readonly": true,
                                "orderNo": 100
                            },
                            "district": {
                                "key": "lead.district",
                                "readonly": true,
                                "orderNo": 110
                            },
                            "state": {
                                "key": "lead.state",
                                "readonly": true,
                                "orderNo": 120
                            }
                        }
                    },
                }
            },
            "sourceDetails": {
                type: "box",
                title: "SOURCE_DETAILS",
                items: {
                    "leadSource": {
                        "key": "lead.leadSource",
                        "type": "select",
                        "enumCode": "lead_source",
                    },
                    "referredBy1": {
                        "key": "lead.referredBy",
                        "condition": "model.lead.leadSource.toUpperCase() == 'EXISTING CUSTOMER REFERRAL' && model.siteCode != 'witfin'",
                        "type": "lov",

                        "lovonly": true,
                        // initialize: function(model, form, parentModel, context) {

                        //     model.lead.branchId = parentModel.lead.branchId;
                        //     model.lead.centreId = parentModel.lead.centreId;
                        //     var centreCode = formHelper.enum('centre').data;

                        //     var centreName = $filter('filter')(centreCode, {value: parentModel.customer.centreId}, true);
                        //     if(centreName && centreName.length > 0) {
                        //         model.lead.centreName = centreName[0].name;
                        //     }

                        // },
                        "inputMap": {
                            "firstName": {
                                "key": "lead.customerFirstName"

                            },
                            "urnNo": {
                                "key": "lead.urnNo",

                            },
                            "branchId": {
                                "key": "lead.branchId",
                                "type": "select",
                                "screenFilter": true,
                                "readonly": true
                            },
                            "centreName": {
                                "key": "lead.centreName",
                                "type": "string",
                                "readonly": true,

                            },
                            "centreId": {
                                key: "lead.centreId",
                                type: "lov",
                                autolov: true,
                                lovonly: true,
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function (inputModel, form, model, context) {
                                    var centres = SessionStore.getCentres();
                                    // $log.info("hi");
                                    // $log.info(centres);

                                    var centreCode = formHelper.enum('centre').data;
                                    var out = [];
                                    if (centres && centres.length) {
                                        for (var i = 0; i < centreCode.length; i++) {
                                            for (var j = 0; j < centres.length; j++) {
                                                if (centreCode[i].value == centres[j].id) {

                                                    out.push({
                                                        name: centreCode[i].name,
                                                        id: centreCode[i].value
                                                    })
                                                }
                                            }
                                        }
                                    }
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": out.length
                                        },
                                        body: out
                                    });
                                },
                                onSelect: function (valueObj, model, context) {
                                    model.lead.centreId = valueObj.id;
                                    model.lead.centreName = valueObj.name;
                                },
                                getListDisplayItem: function (item, index) {
                                    return [
                                        item.name
                                    ];
                                }
                            },
                        },
                        "outputMap": {

                            "firstName": "lead.referredBy"
                        },
                        "searchHelper": formHelper,
                        "search": function (inputModel, form) {
                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                            var branches = formHelper.enum('branch_id').data;
                            var branchName;
                            for (var i = 0; i < branches.length; i++) {
                                if (branches[i].code == inputModel.customerBranchId)
                                    branchName = branches[i].name;
                            }
                            var promise = Enrollment.search({
                                'branchName': branchName || SessionStore.getBranch(),
                                'firstName': inputModel.firstName,
                                'centreId': inputModel.centreId,
                                'customerType': "individual",
                                'urnNo': inputModel.urnNo
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function (data, index) {
                            return [
                                [data.firstName, data.fatherFirstName].join(' | '),
                                data.id,
                                data.urnNo
                            ];
                        },
                        onSelect: function (valueObj, model, context) {

                        }

                    },
                    "referredBy1": {
                        "key": "lead.referredBy",
                        "condition": "model.lead.leadSource.toUpperCase() == 'EXISTING CUSTOMER REFERRAL' && model.siteCode == 'witfin'",
                        "type": "lov",

                        "lovonly": true,
                        // initialize: function(model, form, parentModel, context) {

                        //     model.lead.branchId = parentModel.lead.branchId;
                        //     model.lead.centreId = parentModel.lead.centreId;
                        //     var centreCode = formHelper.enum('centre').data;

                        //     var centreName = $filter('filter')(centreCode, {value: parentModel.customer.centreId}, true);
                        //     if(centreName && centreName.length > 0) {
                        //         model.lead.centreName = centreName[0].name;
                        //     }

                        // },
                        "inputMap": {
                            "firstName": {
                                "key": "lead.customerFirstName"

                            },
                            "urnNo": {
                                "key": "lead.urnNo",

                            },
                            "branchId": {
                                "key": "lead.branchId",
                                "type": "select",
                                "screenFilter": true,
                                //"readonly": true
                            },
                            "centreName": {
                                "key": "lead.centreName",
                                "type": "string",
                                //"readonly": true,

                            },
                            "centreId": {
                                key: "lead.centreId",
                                type: "select",
                                title: "CENTRE_NAME",
                                filter: {
                                    "parentCode": "branch_id"
                                },
                                parentEnumCode: "branch_id",
                                parentValueExpr: "lead.branchId",

                                /*
                                type: "lov",
                                autolov: true,
                                lovonly: true,
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function (inputModel, form, model, context) {
                                    var centres = SessionStore.getCentres();
                                    // $log.info("hi");
                                    // $log.info(centres);

                                    var centreCode = formHelper.enum('centre').data;
                                    var out = [];
                                    if (centres && centres.length) {
                                        for (var i = 0; i < centreCode.length; i++) {
                                            for (var j = 0; j < centres.length; j++) {
                                                if (centreCode[i].value == centres[j].id) {

                                                    out.push({
                                                        name: centreCode[i].name,
                                                        id: centreCode[i].value
                                                    })
                                                }
                                            }
                                        }
                                    }
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": out.length
                                        },
                                        body: out
                                    });
                                },
                                onSelect: function (valueObj, model, context) {
                                    model.lead.centreId = valueObj.id;
                                    model.lead.centreName = valueObj.name;
                                },
                                getListDisplayItem: function (item, index) {
                                    return [
                                        item.name
                                    ];
                                }
                                */
                            },
                        },
                        "outputMap": {

                            "firstName": "lead.referredBy"
                        },
                        "searchHelper": formHelper,
                        "search": function (inputModel, form) {
                            
                            var promise = Enrollment.search({
                                'branchId': inputModel.branchId || SessionStore.getBranch(),
                                'firstName': inputModel.firstName,
                                'centreId': inputModel.centreId,
                                'customerType': "individual",
                                'urnNo': inputModel.urnNo
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function (data, index) {
                            return [
                                [data.firstName, data.fatherFirstName].join(' | '),
                                data.id,
                                data.urnNo
                            ];
                        },
                        onSelect: function (valueObj, model, context) {

                        }

                    },
                    "referredBy": {
                        "key": "lead.referredBy",
                        "condition": "model.lead.leadSource.toUpperCase() == 'EMPLOYEE REFERRAL'",
                        "type": "lov",
                        "lovonly": true,
                        "inputMap" : {
                            "branchName": {
                                "key": "lead.branchName",
                                "screenFilter": true,
                                "type": "select"
                            },
                            "userName": {
                                "key": "lead.userName"
                            },
                            "login": {
                                "key": "lead.login"
                            },
                            "partnerCode": {
                                "key": "lead.partnerCode"
                            }
                        },
                        "searchHelper": formHelper,
                        search: function (inputModel, form, model, context) {
                            var promise = User.query({
                                'branchName': inputModel.branchName,
                                'userName': inputModel.userName,
                                'login': inputModel.login,
                                'partnerCode': inputModel.partnerCode
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.userName,
                                item.id
                            ]
                        },
                        onSelect: function(valueObj, model, context) {
                            model.lead.referredBy = valueObj.userName + ' | ' + valueObj.id;
                        }
                    },

                    "agentName": {
                        "key": "lead.agentName",
                        "type":"select"

                    }

                }
            },
            "productDetails": {
                type: "box",
                title: "PRODUCT_DETAILS",
                // condition: "model.siteCode !== 'sambandh' && model.siteCode !== 'saija'",
                items: {
                    "interestedInProduct": {
                        key: "lead.interestedInProduct",
                        title: "INTERESTED_IN_LOAN_PRODUCT",
                        type: "select",
                        required: true,
                        enumCode: "decisionmaker",
                        "onChange": function (modelValue, form, model) {
                            if (model.lead.interestedInProduct == 'NO' || model.lead.eligibleForProduct == 'NO') {
                                model.lead.leadStatus = "Reject";
                            } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == '< 1 month') {
                                model.lead.leadStatus = "Screening";
                            } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == '> 1 month') {
                                model.lead.leadStatus = "FollowUp";
                            } else {
                                model.lead.leadStatus = "Incomplete";
                            }
                            /* if (model.lead.interestedInProduct === 'YES') {
                             model.lead.productCategory = "Asset";
                             model.lead.productSubCategory = "Loan";
                             }*/
                        }
                        //onChange: "actions.changeStatus(modelValue, form, model)",
                    },
                    /*{
                     key: "lead.productCategory",
                     condition: "model.lead.interestedInProduct==='YES'",
                     readonly: true,
                     type: "select",

                     "Liability": "Liability",
                     "others": "others"
                     "investment": "investment"
                     titleMap: {
                     "Asset": "Asset",
                     }
                     }, {
                     key: "lead.productSubCategory",
                     condition: "model.lead.interestedInProduct==='YES'",
                     readonly: true,
                     /* type: "select",
                     titleMap: {
                     "Loan": "Loan",
                     }
                     },*/
                    "loanAmountRequested": {
                        key: "lead.loanAmountRequested",
                        // type: "select",
                        // enumCode: "lead_amount_requested",
                        condition: "model.lead.interestedInProduct==='YES'",

                    },
                    "loanPurpose1": {
                        key: "lead.loanPurpose1",
                        condition: "model.lead.interestedInProduct==='YES'&& model.lead.productSubCategory !== 'investment'",
                        type: "select",
                        enumCode: "loan_purpose_1"
                        /*titleMap: {

                         }*/
                    },
                    "loanPurpose2": {
                        key: "lead.loanPurpose2",
                        condition: "model.lead.interestedInProduct==='YES'",
                        type: "select",
                        enumCode: "loan_purpose_2",
                        parentEnumCode: "loan_purpose_1",
                        parentValueExpr:"model.lead.loanPurpose1"
                    },
                    "productRequiredBy": {
                        key: "lead.productRequiredBy",
                        type: "select",
                        condition: "model.lead.interestedInProduct==='YES'",
                        enumCode: "lead_product_required_by",
                        // titleMap: {
                        //     "In this week": "In this week",
                        //     "In this month": "In this month",
                        //     "Next 2 -3 months": "Next 2 -3 months",
                        //     "Next 4-6 months": "Next 4-6 months",

                        // },
                        onChange: "actions.changeStatus(modelValue, form, model)"
                    },
                    "screeningDate": {
                        key: "lead.screeningDate",
                        type: "date"

                    },
                    "followUpDate": {
                        key: "lead.followUpDate",
                        type: "date"

                    },
                    "productEligibility": {
                        type: "fieldset",
                        condition: "model.lead.interestedInProduct==='YES'",
                        title: "PRODUCT_ELIGIBILITY",
                        items: {
                            "eligibleForProduct": {
                                key: "lead.eligibleForProduct",
                                type: "radios",
                                enumCode: "decisionmaker",
                                onChange: "actions.changeStatus(modelValue, form, model)",
                            }
                        }
                    },
                    "productRejectionReason": {
                        type: "fieldset",
                        title: "PRODUCT_REJECTION_REASON",
                        condition: "model.lead.interestedInProduct==='NO'||model.lead.eligibleForProduct ==='NO'",
                        items: {
                            "productRejectReason": {
                                key: "lead.productRejectReason",
                                type: "select",
                                condition: "model.lead.eligibleForProduct ==='NO'",
                                enumCode:"lead_reject_reason"
                            },
                            "productRejectAdditinalRemarks": {
                                key: "lead.productRejectAdditinalRemarks",
                                title:"REMARKS"
                            },
                        }
                    },
                    "leadStatus": {
                        type: "fieldset",
                        title: "LEAD_STATUS",
                        items: {
                            "leadStatus": {
                                key: "lead.leadStatus",
                                //type: "select",
                                readonly: true,
                                /*titleMap: {
                                 "Screening": "Screening",
                                 "FollowUp": "FollowUp",
                                 "Incomplete": "Incomplete",
                                 "Reject": "Reject"
                                 },*/
                                onChange: "actions.changeStatus(modelValue, form, model)",
                            }
                        }
                    }
                }
            },
            // "productDetails":{
            //     type: "box",
            //     title: "PRODUCT_DETAILS",
            //     condition: "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
            //     items: {
            //         "interestedInProduct":{
            //             key: "lead.interestedInProduct",
            //             title: "INTERESTED_IN_LOAN_PRODUCT",
            //             type: "select",
            //             required: false,
            //             enumCode: "decisionmaker",
            //             "onChange": function(modelValue, form, model) {
            //                     if (model.lead.interestedInProduct == 'NO' || model.lead.eligibleForProduct == 'NO') {
            //                         model.lead.leadStatus = "Reject";
            //                     } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == 'In this week') {
            //                         model.lead.leadStatus = "Screening";
            //                     } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == 'In this month' || model.lead.productRequiredBy == 'Next 2 -3 months' || model.lead.productRequiredBy == 'Next 4-6 months') {
            //                         model.lead.leadStatus = "FollowUp";
            //                     } else {
            //                         model.lead.leadStatus = "Incomplete";
            //                     }
            //                     /* if (model.lead.interestedInProduct === 'YES') {
            //                          model.lead.productCategory = "Asset";
            //                          model.lead.productSubCategory = "Loan";
            //                      }*/
            //                 }
            //                 //onChange: "actions.changeStatus(modelValue, form, model)",
            //         },
            //         /*{
            //                                key: "lead.productCategory",
            //                                condition: "model.lead.interestedInProduct==='YES'",
            //                                readonly: true,
            //                                 type: "select",

            //                                 "Liability": "Liability",
            //                                     "others": "others"
            //                                     "investment": "investment"
            //                                 titleMap: {
            //                                     "Asset": "Asset",
            //                                 }
            //                            }, {
            //                                key: "lead.productSubCategory",
            //                                condition: "model.lead.interestedInProduct==='YES'",
            //                                readonly: true,
            //                                /* type: "select",
            //                                 titleMap: {
            //                                     "Loan": "Loan",
            //                                 }
            //                            },*/
            //         "loanAmountRequested":{
            //             key: "lead.loanAmountRequested",
            //             type: "amount",
            //             required: false,
            //             condition: "model.lead.interestedInProduct==='YES'&& model.lead.productSubCategory !== 'investment'",
            //         },
            //         "loanPurpose1":{
            //             key: "lead.loanPurpose1",
            //             condition: "model.lead.interestedInProduct==='YES'&& model.lead.productSubCategory !== 'investment'",
            //             type: "select",
            //             required: false,
            //             enumCode: "loan_purpose_1"
            //                 /*titleMap: {
            //                     "AssetPurchase": "AssetPurchase",
            //                     "WorkingCapital": "WorkingCapital",
            //                     "BusinessDevelopment": "BusinessDevelopment",
            //                     "LineOfCredit": "LineOfCredit",

            //                 }*/
            //         },
            //         "productRequiredBy":{
            //             key: "lead.productRequiredBy",
            //             type: "select",
            //             required: false,
            //             condition: "model.lead.interestedInProduct==='YES'",
            //             titleMap: {
            //                 "In this week": "In this week",
            //                 "In this month": "In this month",
            //                 "Next 2 -3 months": "Next 2 -3 months",
            //                 "Next 4-6 months": "Next 4-6 months",

            //             },
            //             onChange: "actions.changeStatus(modelValue, form, model)"
            //         },
            //         "screeningDate":{
            //             key: "lead.screeningDate",
            //             condition: "(model.lead.interestedInProduct==='YES' && model.lead.productRequiredBy ==='In this week')",
            //             type: "date",
            //             onChange: "actions.changeStatus(modelValue, form, model)"
            //         },
            //         "followUpDate":{
            //             key: "lead.followUpDate",
            //             condition: "(model.lead.interestedInProduct==='YES' && model.lead.productRequiredBy =='In this month'||model.lead.productRequiredBy =='Next 2 -3 months'||model.lead.productRequiredBy =='Next 4-6 months')",
            //             type: "date",
            //             onChange: "actions.changeStatus(modelValue, form, model)"
            //         },
            //         "productEligibility":{
            //             type: "fieldset",
            //             condition: "model.lead.interestedInProduct==='YES'",
            //             title: "PRODUCT_ELIGIBILITY",
            //             items: {
            //                 "eligibleForProduct":{
            //                     key: "lead.eligibleForProduct",
            //                     type: "radios",
            //                     enumCode: "decisionmaker",
            //                     onChange: "actions.changeStatus(modelValue, form, model)",
            //                 }
            //             }
            //         },
            //         "productRejectReason":{
            //             type: "fieldset",
            //             title: "PRODUCT_REJECTION_REASON",
            //             condition: "model.lead.interestedInProduct==='NO'||model.lead.eligibleForProduct ==='NO'",
            //             items: {
            //                 "productRejectReason":{
            //                     key: "lead.productRejectReason",
            //                     type: "select",
            //                     condition: "model.lead.interestedInProduct==='NO'",
            //                     enumCode: "leadRejectReasonOfCustomer",
            //                 },
            //                 "productRejectReason":{
            //                     key: "lead.productRejectReason",
            //                     type: "select",
            //                     condition: "model.lead.eligibleForProduct ==='NO'",
            //                     enumCode: "leadRejectReasonByFieldOfficer",
            //                 }, {
            //                     key: "lead.additionalRemarks",
            //                 },
            //             }
            //         },
            //         "leadStatus":{
            //             type: "fieldset",
            //             title: "LEAD_STATUS",
            //             items: {
            //                 "leadStatus":{
            //                     key: "lead.leadStatus",
            //                     //type: "select",
            //                     readonly: true,
            //                     /*titleMap: {
            //                         "Screening": "Screening",
            //                         "FollowUp": "FollowUp",
            //                         "Incomplete": "Incomplete",
            //                         "Reject": "Reject"
            //                     },*/
            //                     onChange: "actions.changeStatus(modelValue, form, model)"
            //                 }
            //             }
            //         }
            //     ]
            // },

            "previousInteractions": {
                type: "box",
                title: "PREVIOUS_INTERACTIONS",
                condition: "model.lead.id && model.lead.currentStage == 'Inprocess'",
                items: {
                    "leadInteractions1": {
                        key: "lead.leadInteractions1",
                        type: "array",
                        add: null,
                        remove: null,
                        title: "Interaction History",
                        items: {
                            "interactionDate": {
                                key: "lead.leadInteractions1[].interactionDate",
                                type: "date",
                                readonly: true,
                            },
                            "loanOfficerId": {
                                key: "lead.leadInteractions1[].loanOfficerId",
                                readonly: true,
                            },
                            "typeOfInteraction": {
                                key: "lead.leadInteractions1[].typeOfInteraction",
                                type: "select",
                                readonly: true,
                                titleMap: {
                                    "Call": "Call",
                                    "Visit": "Visit",
                                },
                            },
                            "customerResponse": {
                                key: "lead.leadInteractions1[].customerResponse",
                                readonly: true,
                            },
                            "additionalRemarks": {
                                key: "lead.leadInteractions1[].additionalRemarks",
                                readonly: true,
                            },
                            "location": {
                                "key": "lead.leadInteractions1[].location",
                                readonly: true,
                                "type": "geotag",
                                "latitude": "latitude",
                                "longitude": "longitude",
                                "condition": "model.lead.leadInteractions1[arrayIndex].typeOfInteraction == 'Visit'",
                            },
                            "picture": {
                                "key": "lead.leadInteractions1[].picture",
                                readonly: true,
                                "type": "file",
                                "fileType": "image/*",
                                "condition": "model.lead.leadInteractions1[arrayIndex].typeOfInteraction === 'Visit'",
                            },
                        }
                    }
                }
            },


            "leadInteractions": {
                type: "box",
                title: "LEAD_INTERACTIONS",
                items: {
                    "leadInteractions": {
                        key: "lead.leadInteractions",
                        type: "array",
                        startEmpty: true,
                        view: "fixed",
                        title: "LEAD_INTERACTIONS",
                        items: {
                            "interactionDate": {
                                key: "lead.leadInteractions[].interactionDate",
                                type: "date",
                                readonly: true,
                            },
                            "loanOfficerId": {
                                key: "lead.leadInteractions[].loanOfficerId",
                                readonly: true,
                            },
                            "typeOfInteraction": {
                                key: "lead.leadInteractions[].typeOfInteraction",
                                type: "select",
                                titleMap: {
                                    "Call": "Call",
                                    "Visit": "Visit",
                                }

                            },
                            "customerResponse": {
                                key: "lead.leadInteractions[].customerResponse",
                                type: "select",
                                enumCode: "li_customer_response"
                            },
                            "additionalRemarks": {
                                key: "lead.leadInteractions[].additionalRemarks",
                                type: "text"
                            },
                            "location": {
                                "key": "lead.leadInteractions[].location",
                                "type": "geotag",
                                "latitude": "latitude",
                                "longitude": "longitude",
                                "condition": "model.lead.leadInteractions[arrayIndex].typeOfInteraction == 'Visit'",
                            },
                            "picture": {
                                "key": "lead.leadInteractions[].picture",
                                "type": "file",
                                "fileType": "image/*",
                                "condition": "model.lead.leadInteractions[arrayIndex].typeOfInteraction === 'Visit'",
                            },
                        }
                    }
                }
            },


            "actionbox": {
                "type": "actionbox",
                "items": {
                    "save": {
                        "type": "save",
                        "title": "Offline Save"
                    },
                    "submit": {
                        "type": "submit",
                        "title": "Submit"
                    }
                }
            },
        };

        formRepository['LoanRequest'] = {
            "PreliminaryInformation": {
                "type": "box",
                "title": "PRELIMINARY_INFORMATION",
                "condition": "model.currentStage=='Screening' || model.currentStage=='Application'",
                "items": {
                    "linkedAccountNumber": {
                        key: "loanAccount.linkedAccountNumber",
                        title: "LINKED_ACCOUNT_NUMBER",
                        type: "lov",
                        autolov: true,
                        searchHelper: formHelper,
                        search: function (inputModel, form, model, context) {
                            var promise = LoanProcess.viewLoanaccount({
                                urn: model.enterprise.urnNo
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function (item, index) {
                            $log.info(item);
                            return [
                                item.accountId,
                                item.glSubHead,
                                item.amount,
                                item.npa,
                            ];
                        },
                        onSelect: function (valueObj, model, context) {
                            model.loanAccount.npa = valueObj.npa;
                            model.loanAccount.linkedAccountNumber = valueObj.accountId;
                        }
                    },
                    "npa": {
                        key: "loanAccount.npa",
                        title: "IS_NPA",
                    },
                    "loan": {
                        key: "loanAccount.loanPurpose1",
                        type: "lov",
                        autolov: true,
                        title: "LOAN_PURPOSE_1",
                        bindMap: {},
                        outputMap: {
                            "purpose1": "loanAccount.loanPurpose1"
                        },
                        searchHelper: formHelper,
                        search: function (inputModel, form, model) {
                            return Queries.getAllLoanPurpose1();
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.purpose1
                            ];
                        },
                        onSelect: function (result, model, context) {
                            $log.info(result);
                            model.loanAccount.loanPurpose2 = '';
                        }
                    },
                    "loanPurpose2": {
                        key: "loanAccount.loanPurpose2",
                        type: "lov",
                        autolov: true,
                        title: "LOAN_PURPOSE_2",
                        bindMap: {},
                        outputMap: {
                            "purpose2": "loanAccount.loanPurpose2"
                        },
                        searchHelper: formHelper,
                        search: function (inputModel, form, model) {
                            return Queries.getAllLoanPurpose2(model.loanAccount.loanPurpose1);
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.purpose2
                            ];
                        }
                    },
                    // {
                    //     key: "loanAccount.assetAvailableForHypothecation",
                    //     type: "select",
                    //     required:true,
                    //     enumCode: "decisionmaker",
                    //     title: "ASSET_AVAILABLE_FOR_HYPOTHECATION"
                    // },
                    // {
                    //     key: "loanAccount.estimatedValueOfAssets",
                    //     type: "amount",
                    //     required:true,
                    //     condition: "model.loanAccount.assetAvailableForHypothecation=='YES'",
                    //     title: "ESTIMATED_VALUE_OF_ASSETS"
                    // },
                    "loanAmountRequested": {
                        key: "loanAccount.loanAmountRequested",
                        type: "amount",
                        required: true,
                        title: "REQUESTED_LOAN_AMOUNT",
                        onChange: function (value, form, model) {
                            computeEstimatedEMI(model);
                        }
                    },
                    "frequencyRequested": {
                        key: "loanAccount.frequencyRequested",
                        type: "select",
                        title: "FREQUENCY_REQUESTED",
                        enumCode: "frequency",
                        onChange: function (value, form, model) {
                            computeEstimatedEMI(model);
                        }
                    },
                    "tenureRequested": {
                        key: "loanAccount.tenureRequested",
                        required: true,
                        type: "number",
                        title: "TENURE_REQUESETED",
                        onChange: function (value, form, model) {
                            computeEstimatedEMI(model);
                        }
                    },
                    "expectedInterestRate": {
                        key: "loanAccount.expectedInterestRate",
                        type: "number",
                        title: "EXPECTED_INTEREST_RATE",
                        onChange: function (value, form, model) {
                            computeEstimatedEMI(model);
                        }
                    },
                    "expectedEmi": {
                        key: "loanAccount.expectedEmi",
                        type: "amount",
                        title: "ESTIMATED_KINARA_EMI",
                        readonly: true
                    },
                    "emiRequested": {
                        key: "loanAccount.emiRequested",
                        required: true,
                        type: "amount",
                        title: "EMI_REQUESTED"
                    },
                    "emiPaymentDateRequested": {
                        key: "loanAccount.emiPaymentDateRequested",
                        type: "select",
                        titleMap: {
                            "5th": "5th",
                            "10th": "10th",
                            "15th": "15th",
                        },
                        title: "EMI_PAYMENT_DATE_REQUESTED"
                    },
                    "collectionPaymentType": {
                        key: "loanAccount.collectionPaymentType",
                        required: true,
                        title: "MODE_OF_REPAYMENT",
                        type: "select",
                        titleMap: {
                            "ACH": "ACH",
                            "PDC": "PDC",
                            "Others": "Others"
                        }
                    },
                    "expectedPortfolioInsurancePremium": {
                        key: "loanAccount.expectedPortfolioInsurancePremium",
                        title: "EXPECTED_PORTFOLIO_INSURANCE_PREMIUM",
                        readonly: true
                    },
                    "loanToValue": {
                        key: "loanAccount.loanToValue",
                        type: "number",
                        title: "LOAN_TO_VALUE"
                    },
                    "section1": {
                        "type": "section",
                        "htmlClass": "alert alert-warning",
                        "condition": "!model.loanAccount.customerId",
                        "html": "<h4><i class='icon fa fa-warning'></i>Business not yet enrolled.</h4> Kindly save the business details before proceed."
                    }
                }
            },

            "loanCustomerRelations": {
                type: "box",
                title: "LOAN_CUSTOMER_RELATIONS",
                "condition": "model.currentStage=='Screening' || model.currentStage=='Application'",
                items: {
                    "loanCustomerRelations": {
                        key: "loanAccount.loanCustomerRelations",
                        type: "array",
                        add: null,
                        remove: null,
                        title: "LOAN_CUSTOMER_RELATIONS",
                        items: {
                            "customerId": {
                                key: "loanAccount.loanCustomerRelations[].customerId",
                                title: "CUSTOMER_ID",
                                readonly: true,
                            },
                            "urn": {
                                key: "loanAccount.loanCustomerRelations[].urn",
                                title: "URN_NO",
                                readonly: true,
                            },
                            "name": {
                                key: "loanAccount.loanCustomerRelations[].name",
                                "title": "NAME",
                                readonly: true,
                            },
                            "relation": {
                                key: "loanAccount.loanCustomerRelations[].relation",
                                readonly: true,
                                title: "RELATIONSHIP"
                            },
                            "relationshipWithApplicant": {
                                key: "loanAccount.loanCustomerRelations[].relationshipWithApplicant",
                                title: "RELATIONSHIP_WITH_APPLICATION",
                                condition: "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                required: true,
                                type: "select",
                                enumCode: "relation"
                            }
                        }
                    }
                }
            },

            "DeductionsFromLoanamount": {
                "type": "box",
                "title": "DEDUCTIONS_FROM_LOANAMOUNT",
                "condition": "model.currentStage=='Screening' || model.currentStage=='Application'",
                "items": {
                    "expectedProcessingFeePercentage": {
                        key: "loanAccount.expectedProcessingFeePercentage",
                        "type": "number",
                        "title": "EXPECTED_PROCESSING_FEES_IN_PERCENTAGE"
                    },
                    "expectedCommercialCibilCharge": {
                        key: "loanAccount.expectedCommercialCibilCharge",
                        "type": "amount",
                        "title": "EXPECTED_COMMERCIAL_CIBIL_CHARGE"
                    },
                    "estimatedEmi": {
                        key: "loanAccount.estimatedEmi",
                        "type": "amount",
                        "title": "EXPECTED_SECURITY_EMI",
                        readonly: true
                    }
                }
            },
            "LoanMitigants": {
                "type": "box",
                "title": "LOAN_MITIGANTS",
                "condition": "model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview'||model.currentStage=='FieldAppraisalReview'",
                "items": {
                    "deviationParameter": {
                        key: "deviations.deviationParameter",
                        type: "array",
                        startEmpty: true,
                        add: null,
                        remove: null,
                        "view": "fixed",
                        "titleExpr": "model.deviations.deviationParameter[arrayIndex].Parameter",
                        items: {
                            "mitigants": {
                                key: "deviations.deviationParameter[].mitigants",
                                type: "array",
                                startEmpty: true,
                                add: null,
                                remove: null,
                                notitle: true,
                                "view": "fixed",
                                items: {
                                    "mitigationSection": {
                                        "type": "section",
                                        "htmlClass": "row",
                                        "items": {
                                            "selectedSection": {
                                                "type": "section",
                                                "htmlClass": "col-xs-2 col-md-2",
                                                "items": {
                                                    "selected": {
                                                        key: "deviations.deviationParameter[].mitigants[].selected",
                                                        type: "checkbox",
                                                        schema: {
                                                            default: false
                                                        }
                                                    }
                                                }
                                            },
                                            "mitigantNameSection": {
                                                "type": "section",
                                                "htmlClass": "col-xs-10 col-md-10",
                                                "items": {
                                                    "mitigantName": {
                                                        key: "deviations.deviationParameter[].mitigants[].mitigantName",
                                                        type: "textarea",
                                                        readonly: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },

            "LoanDocuments": {
                "type": "box",
                "title": "LOAN_DOCUMENTS",
                "condition": "model.currentStage !== 'loanView'",
                "items": {
                    "loanDocuments": {
                        "type": "array",
                        "key": "loanAccount.loanDocuments",
                        "view": "fixed",
                        "startEmpty": true,
                        "title": "LOAN_DOCUMENT",
                        "titleExpr": "model.loanAccount.loanDocuments[arrayIndex].document",
                        "items": {
                            "document": {
                                "key": "loanAccount.loanDocuments[].document",
                                "title": "DOCUMENT_NAME",
                                "type": "string",
                                "required": true
                            },
                            "documentId": {
                                title: "Upload",
                                key: "loanAccount.loanDocuments[].documentId",
                                "required": true,
                                type: "file",
                                fileType: "application/pdf",
                                category: "Loan",
                                subCategory: "DOC1",
                                using: "scanner"
                            }
                            // ,
                            // {
                            //     "key": "loanDocuments.newLoanDocuments[].documentStatus",
                            //     "type": "string"
                            // }
                        }
                    }
                }
            },

            "NewAssetDetails": {
                "type": "box",
                "title": "NEW_ASSET_DETAILS",
                "condition": "model.loanAccount.loanPurpose1=='Asset Purchase' && (model.currentStage=='Application' || model.currentStage=='FieldAppraisal')",
                "items": {
                    "assetDetails": {
                        key: "loanAccount.collateral",
                        type: "array",
                        startEmpty: true,
                        title: "ASSET_DETAILS",
                        items: {
                            "collateralDescription": {
                                key: "loanAccount.collateral[].collateralDescription",
                                title: "MACHINE",
                                required: true,
                                type: "string"
                            },
                            "collateralValue": {
                                key: "loanAccount.collateral[].collateralValue",
                                title: "PURCHASE_PRICE",
                                required: true,
                                type: "number",
                            },
                            // {
                            //     key: "loanAccount.collateral[].quantity",
                            //     title:"QUANTITY",
                            //     required:true,
                            //     readonly: true,
                            //     type: "number",
                            // },
                            "expectedIncome": {
                                key: "loanAccount.collateral[].expectedIncome",
                                title: "EXPECTED_INCOME",
                                required: true,
                                type: "number",
                            },
                            "collateralType": {
                                key: "loanAccount.collateral[].collateralType",
                                title: "MACHINE_TYPE",
                                required: true,
                                type: "select",
                                enumCode: "collateral_type"
                            },
                            "manufacturer": {
                                key: "loanAccount.collateral[].manufacturer",
                                title: "MANFACTURE_NAME",
                                required: true,
                                type: "string",
                            },
                            "modelNo": {
                                key: "loanAccount.collateral[].modelNo",
                                title: "MACHINE_MODEL",
                                required: true,
                                type: "string",
                            },
                            "serialNo": {
                                key: "loanAccount.collateral[].serialNo",
                                title: "SERIAL_NO",
                                type: "string",
                            },
                            "expectedPurchaseDate": {
                                key: "loanAccount.collateral[].expectedPurchaseDate",
                                title: "EXPECTED_PURCHASE_DATE",
                                required: true,
                                "type": "date",
                                //"format": 'dd-mm-yyyy',
                                "minDate": SessionStore.getCBSDate(),
                            },
                            "machineAttachedToBuilding": {
                                key: "loanAccount.collateral[].machineAttachedToBuilding",
                                title: "MACHINE_PERMANENTLY_FIXED_TO_BUILDING",
                                type: "select",
                                required: true,
                                enumCode: "decisionmaker"
                            },
                            "hypothecatedToBank": {
                                key: "loanAccount.collateral[].hypothecatedToBank",
                                title: "HYPOTHECATED_TO_KINARA",
                                required: true,
                                enumCode: "decisionmaker",
                                type: "select",
                            },
                            "electricityAvailable": {
                                key: "loanAccount.collateral[].electricityAvailable",
                                title: "ELECTRICITY_AVAIALBLE",
                                type: "select",
                                enumCode: "decisionmaker",
                                required: true
                            },
                            "spaceAvailable": {
                                key: "loanAccount.collateral[].spaceAvailable",
                                title: "SPACE_AVAILABLE",
                                type: "select",
                                enumCode: "decisionmaker",
                                required: true
                            },
                            "collateral1FilePath": {
                                key: "loanAccount.collateral[].collateral1FilePath",
                                title: "MACHINE_QUOTATION",
                                "category": "Loan",
                                "required": true,
                                "subCategory": "DOC1",
                                type: "file",
                                fileType: "application/pdf",
                                using: "scanner"
                            }
                        }
                    }
                }
            },


            "LoanRecomendation": {
                "type": "box",
                "title": "LOAN_RECOMMENDATION",
                "condition": "model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview'||model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='FieldAppraisal'",
                "items": {
                    "loanAmount": {
                        "key": "loanAccount.loanAmount",
                        "type": "amount",
                        required: true,
                        "title": "LOAN_AMOUNT",
                        onChange: function (value, form, model) {
                            computeEMI(model);
                        }
                    },
                    "tenure": {
                        "key": "loanAccount.tenure",
                        "title": "DURATION_IN_MONTHS",
                        required: true,
                        onChange: function (value, form, model) {
                            computeEMI(model);
                        }
                    },
                    "interestRate": {
                        "key": "loanAccount.interestRate",
                        "type": "number",
                        required: true,
                        "title": "INTEREST_RATE",
                        onChange: function (value, form, model) {
                            computeEMI(model);
                        }
                    },
                    "estimatedEmi": {
                        key: "loanAccount.estimatedEmi",
                        type: "amount",
                        title: "ESTIMATED_KINARA_EMI",
                        readonly: true
                    },
                    "processingFeePercentage": {
                        "key": "loanAccount.processingFeePercentage",
                        "type": "number",
                        required: true,
                        "title": "PROCESSING_FEES_IN_PERCENTAGE"
                    },
                    "estimatedEmi": {
                        key: "loanAccount.estimatedEmi",
                        "type": "amount",
                        "title": "EXPECTED_SECURITY_EMI",
                        readonly: true
                    },
                    "securityEmiRequired": {
                        "key": "loanAccount.securityEmiRequired",
                        "condition": "model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
                        'enumCode': "decisionmaker",
                        'type': "select",
                        "title": "SECURITY_EMI_REQUIRED",
                        // readonly:true,
                        required: true
                    },
                    "commercialCibilCharge": {
                        "key": "loanAccount.commercialCibilCharge",
                        "type": "amount",
                        "title": "COMMERCIAL_CIBIL_CHARGE"
                    }
                }
            },

            "LoanSanction": {
                "type": "box",
                "title": "LOAN_SANCTION",
                "condition": "model.currentStage == 'Sanction'",
                "items": {

                    // {
                    //     "key": "loanAccount.loanAmount",
                    //     "type": "amount",
                    //     "title": "LOAN_AMOUNT",
                    //     readonly:true
                    // },
                    // {
                    //     "key": "loanAccount.processingFeePercentage",
                    //     "type": "number",
                    //     "title": "PROCESSING_FEES_IN_PERCENTAGE",
                    //     readonly:true
                    // },
                    // {
                    //     "key": "loanAccount.commercialCibilCharge",
                    //     "type": "amount",
                    //     "title": "COMMERCIAL_CIBIL_CHARGE",
                    //     readonly:true
                    // },
                    // {
                    //     "key": "loanAccount.portfolioInsuranceUrn",
                    //     "title": "INSURANCE_URN",
                    //     "type": "lov",
                    //     "lovonly": true,
                    //     "outputMap": {
                    //         "urnNo": "customer.urnNo",
                    //         "firstName":"customer.firstName"
                    //     },
                    //     "searchHelper": formHelper,
                    //     search: function(inputModel, form, model, context) {
                    //         var out = [];
                    //         for (var i=0; i<model.customersForInsurance.length; i++){
                    //             out.push({
                    //                 name: model.customersForInsurance[i].name,
                    //                 value: model.customersForInsurance[i].urnNo
                    //             })
                    //         }
                    //         return $q.resolve({
                    //             headers: {
                    //                 "x-total-count": out.length
                    //             },
                    //             body: out
                    //         });
                    //     },
                    //     getListDisplayItem: function(data, index) {
                    //         return [
                    //             data.name,
                    //             data.urnNo
                    //         ];
                    //     },
                    //     onSelect: function(valueObj, model, context){
                    //         model.loanAccount.portfolioInsuranceUrn = valueObj.urnNo;
                    //     }
                    // },
                    // {
                    //     "key": "loanAccount.tenure",
                    //     "title":"DURATION_IN_MONTHS",
                    //     readonly:true
                    // },
                    "DisbursementDetails": {
                        "type": "fieldset",
                        "title": "DISBURSEMENT_DETAILS",
                        "items": {
                            "sanctionDate": {
                                key: "loanAccount.sanctionDate",
                                type: "date",
                                title: "SANCTION_DATE"
                            },
                            "numberOfDisbursements": {
                                key: "loanAccount.numberOfDisbursements",
                                title: "NUM_OF_DISBURSEMENTS",
                                onChange: function (value, form, model) {
                                    populateDisbursementSchedule(value, form, model);
                                }
                            },
                            "disbursementSchedules": {
                                key: "loanAccount.disbursementSchedules",
                                title: "DISBURSEMENT_SCHEDULES",
                                add: null,
                                remove: null,
                                items: {
                                    "trancheNumber": {
                                        key: "loanAccount.disbursementSchedules[].trancheNumber",
                                        title: "TRANCHE_NUMBER",
                                        readonly: true
                                    },
                                    "disbursementAmount": {
                                        key: "loanAccount.disbursementSchedules[].disbursementAmount",
                                        title: "DISBURSEMENT_AMOUNT",
                                        type: "amount"
                                    },
                                    "tranchCondition": {
                                        key: "loanAccount.disbursementSchedules[].tranchCondition",
                                        type: "lov",
                                        autolov: true,
                                        title: "TRANCHE_CONDITION",
                                        bindMap: {},
                                        searchHelper: formHelper,
                                        search: function (inputModel, form, model, context) {

                                            var trancheConditions = formHelper.enum('tranche_conditions').data;
                                            var out = [];
                                            for (var i = 0; i < trancheConditions.length; i++) {
                                                var t = trancheConditions[i];
                                                var min = _.hasIn(t, "field1") ? parseInt(t.field1) - 1 : 0;
                                                var max = _.hasIn(t, "field2") ? parseInt(t.field2) - 1 : 100;

                                                if (context.arrayIndex >= min && context.arrayIndex <= max) {
                                                    out.push({
                                                        name: trancheConditions[i].name,
                                                        value: trancheConditions[i].value
                                                    })
                                                }
                                            }
                                            return $q.resolve({
                                                headers: {
                                                    "x-total-count": out.length
                                                },
                                                body: out
                                            });
                                        },
                                        onSelect: function (valueObj, model, context) {
                                            model.loanAccount.disbursementSchedules[context.arrayIndex].tranchCondition = valueObj.value;
                                        },
                                        getListDisplayItem: function (item, index) {
                                            return [
                                                item.name
                                            ];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },

            "postReview": {
                "type": "box",
                "title": "POST_REVIEW",
                "condition": "model.loanAccount.id && model.currentStage !== 'Rejected'&& model.currentStage !== 'loanView'",
                "items": {
                    "commonAction": {
                        key: "review.action",
                        condition: "model.currentStage !== 'Screening'",
                        type: "radios",
                        titleMap: {
                            "REJECT": "REJECT",
                            "SEND_BACK": "SEND_BACK",
                            "PROCEED": "PROCEED",
                            "HOLD": "HOLD"
                        }
                    },
                    "screeningAction": {
                        key: "review.action",
                        condition: "model.currentStage == 'Screening'",
                        type: "radios",
                        titleMap: {
                            "REJECT": "REJECT",
                            "PROCEED": "PROCEED",
                            "HOLD": "HOLD"
                        }
                    },
                    "rejectsection": {
                        type: "section",
                        condition: "model.review.action=='REJECT'",
                        items: {
                            "remarks": {
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
                                required: true
                            },
                            "rejectReason": {
                                key: "loanAccount.rejectReason",
                                type: "lov",
                                autolov: true,
                                required: true,
                                title: "REJECT_REASON",
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function (inputModel, form, model, context) {
                                    var stage1 = model.currentStage;

                                    if (model.currentStage == 'Application' || model.currentStage == 'ApplicationReview') {
                                        stage1 = "Application";
                                    }
                                    if (model.currentStage == 'FieldAppraisal' || model.currentStage == 'FieldAppraisalReview') {
                                        stage1 = "FieldAppraisal";
                                    }

                                    var rejectReason = formHelper.enum('application_reject_reason').data;
                                    var out = [];
                                    for (var i = 0; i < rejectReason.length; i++) {
                                        var t = rejectReason[i];
                                        if (t.field1 == stage1) {
                                            out.push({
                                                name: t.name,
                                            })
                                        }
                                    }
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": out.length
                                        },
                                        body: out
                                    });
                                },
                                onSelect: function (valueObj, model, context) {
                                    model.loanAccount.rejectReason = valueObj.name;
                                },
                                getListDisplayItem: function (item, index) {
                                    return [
                                        item.name
                                    ];
                                }
                            },

                            "rejectButton": {
                                key: "review.rejectButton",
                                type: "button",
                                title: "REJECT",
                                required: true,
                                onClick: "actions.reject(model, formCtrl, form, $event)"
                            }
                        }
                    },
                    "holdsection": {
                        type: "section",
                        condition: "model.review.action=='HOLD'",
                        items: {
                            "remarks": {
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
                                required: true
                            },
                            "holdButton": {
                                key: "review.holdButton",
                                type: "button",
                                title: "HOLD",
                                required: true,
                                onClick: "actions.holdButton(model, formCtrl, form, $event)"
                            }
                        }
                    },

                    "sendbackSection": {
                        type: "section",
                        condition: "model.review.action=='SEND_BACK'",
                        items: {
                            "remarks": {
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
                                required: true
                            },
                            "targetStage": {
                                key: "review.targetStage",
                                type: "lov",
                                autolov: true,
                                lovonly: true,
                                title: "SEND_BACK_TO_STAGE",
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function (inputModel, form, model, context) {
                                    var stage1 = model.currentStage;
                                    var targetstage = formHelper.enum('targetstage').data;
                                    var out = [];
                                    for (var i = 0; i < targetstage.length; i++) {
                                        var t = targetstage[i];
                                        if (t.field1 == stage1) {
                                            out.push({
                                                name: t.name,
                                            })
                                        }
                                    }
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": out.length
                                        },
                                        body: out
                                    });
                                },
                                onSelect: function (valueObj, model, context) {
                                    model.review.targetStage = valueObj.name;
                                },
                                getListDisplayItem: function (item, index) {
                                    return [
                                        item.name
                                    ];
                                }
                            },
                            "sendBackButton": {
                                key: "review.sendBackButton",
                                type: "button",
                                title: "SEND_BACK",
                                onClick: "actions.sendBack(model, formCtrl, form, $event)"
                            }
                        }
                    },

                    "proceedsection": {
                        type: "section",
                        condition: "model.review.action=='PROCEED'",
                        items: {
                            "REMARKS": {
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
                                required: true
                            },
                            "proceedButton": {
                                key: "review.proceedButton",
                                type: "button",
                                title: "PROCEED",
                                onClick: "actions.proceed(model, formCtrl, form, $event)"
                            }
                        }
                    },
                    "valuator": {
                        key: "loanAccount.valuator",
                        title: "VALUATOR",
                        type: "select"
                    }
                }
            },


            "rejectReason": {
                "type": "box",
                "title": "REJECT_REASON",
                "condition": "model.currentStage=='loanView'",
                "items": {
                    "rejectSection": {
                        type: "section",
                        items: {
                            "rejectReason": {
                                title: "Reject Reason",
                                key: "loanAccount.rejectReason",
                                readonly: true,
                                type: "textarea",
                            }
                        }
                    }
                }
            },

            "revertReject": {
                "type": "box",
                "title": "REVERT_REJECT",
                "condition": "model.currentStage=='Rejected'",
                "items": {
                    "remarks": {
                        title: "REMARKS",
                        key: "review.remarks",
                        type: "textarea",
                        required: true
                    },
                    "rejectReason": {
                        title: "Reject Reason",
                        key: "loanAccount.rejectReason",
                        readonly: true,
                        type: "textarea",
                    },
                    "targetStage": {
                        key: "review.targetStage",
                        title: "SEND_BACK_TO_STAGE",
                        type: "lov",
                        lovonly: true,
                        autolov: true,
                        required: true,
                        searchHelper: formHelper,
                        search: function (inputModel, form, model, context) {
                            var stage1 = model.review.preStage;
                            var targetstage = formHelper.enum('targetstage').data;
                            var out = [{
                                'name': stage1,
                                'value': stage1
                            }];
                            for (var i = 0; i < targetstage.length; i++) {
                                var t = targetstage[i];
                                if (t.field1 == stage1) {
                                    out.push({
                                        name: t.name,
                                    })
                                }
                            }
                            return $q.resolve({
                                headers: {
                                    "x-total-count": out.length
                                },
                                body: out
                            });
                        },
                        onSelect: function (valueObj, model, context) {
                            model.review.targetStage = valueObj.name;
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.name
                            ]
                        }
                    },
                    "sendBackButton": {
                        "key": "review.sendBackButton",
                        "type": "button",
                        "title": "SEND_BACK",
                        "onClick": "actions.sendBack(model, formCtrl, form, $event)"
                    }
                }
            },
            "IRR": {
                "type": "box",
                title: "IRR",
                items: {
                    "frequencyRequested": {
                        key: "loanAccount.frequencyRequested",
                        type: "select",
                        title: "FREQUENCY_REQUESTED",
                        enumCode: "frequency",
                        onChange: function (value, form, model) {
                            computeEstimatedEMI(model);
                        }
                    },
                    "tenureRequested": {
                        key: "loanAccount.tenureRequested",
                        required: true,
                        type: "number",
                        title: "TENURE_REQUESETED",
                        onChange: function (value, form, model) {
                            computeEstimatedEMI(model);
                        }
                    },
                    "dsaPayout": {
                        key: "loanAccount.dsaPayout",
                        type: "number",
                        title: "DSA_PAYOUT"
                    },
                    "estimatedEmi": {
                        key: "loanAccount.estimatedEmi",
                        "type": "amount",
                        "title": "EXPECTED_SECURITY_EMI",
                        readonly: true
                    }
                }
            },

            "actionBox": {
                "type": "actionbox",
                "items": {
                    "saveButton": {
                        "type": "button",
                        "icon": "fa fa-circle-o",
                        "title": "SAVE",
                        "onClick": "actions.save(model, formCtrl, form, $event)"
                    }
                }
            }
        };

        formRepository['IndividualEnrollment2'] = {
            "KYC": {
                type: "box",
                orderNo: 10,
                title: "KYC",
                items: {
                    "customerSearch": {
                        "key": "customer.id",
                        "title": "CUSTOMER_SEARCH",
                        orderNo: 10,
                        "lovonly": true,
                        // initialize: function(model, form, parentModel, context) {
                        //     model.customerBranchId = parentModel.customer.customerBranchId;
                        //     model.centreId = parentModel.customer.centreId;
                        //     var centreCode = formHelper.enum('centre').data;

                        //     var centreName = $filter('filter')(centreCode, {value: parentModel.customer.centreId}, true);
                        //     if(centreName && centreName.length > 0) {
                        //         model.centreName = centreName[0].name;
                        //     }

                        // },
                        "inputMap": {
                            "firstName": {
                                "key": "customer.firstName",
                                "title": "CUSTOMER_NAME"
                            },
                            "urnNo": {
                                "key": "customer.urnNo",
                                "title": "URN_NO",
                                "type": "string"
                            },
                            "customerBranchId": {
                                "key": "customer.customerBranchId",
                                "type": "select",
                                "screenFilter": true,
                                "readonly": true
                            },
                            "centreName": {
                                "key": "customer.place",
                                "title": "CENTRE_NAME",
                                "type": "string",
                                "readonly": true,

                            },
                            "centreId": {
                                key: "customer.centreId",
                                type: "lov",
                                autolov: true,
                                lovonly: true,
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function (inputModel, form, model, context) {
                                    var centres = SessionStore.getCentres();
                                    // $log.info("hi");
                                    // $log.info(centres);

                                    var centreCode = formHelper.enum('centre').data;
                                    var out = [];
                                    if (centres && centres.length) {
                                        for (var i = 0; i < centreCode.length; i++) {
                                            for (var j = 0; j < centres.length; j++) {
                                                if (centreCode[i].value == centres[j].id) {

                                                    out.push({
                                                        name: centreCode[i].name,
                                                        id: centreCode[i].value
                                                    })
                                                }
                                            }
                                        }
                                    }
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": out.length
                                        },
                                        body: out
                                    });
                                },
                                onSelect: function (valueObj, model, context) {
                                    model.centreId = valueObj.id;
                                    model.centreName = valueObj.name;
                                },
                                getListDisplayItem: function (item, index) {
                                    return [
                                        item.name
                                    ];
                                }
                            },
                        },
                        "outputMap": {
                            "urnNo": "customer.urnNo",
                            "firstName": "customer.firstName"
                        },
                        "searchHelper": formHelper,
                        "search": function (inputModel, form) {
                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                            var branches = formHelper.enum('branch_id').data;
                            var branchName;
                            for (var i = 0; i < branches.length; i++) {
                                if (branches[i].code == inputModel.customerBranchId)
                                    branchName = branches[i].name;
                            }
                            var promise = Enrollment.search({
                                'branchName': branchName || SessionStore.getBranch(),
                                'firstName': inputModel.firstName,
                                'centreId': inputModel.centreId,
                                'customerType': "individual",
                                'urnNo': inputModel.urnNo
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function (data, index) {
                            return [
                                [data.firstName, data.fatherFirstName].join(' | '),
                                data.id,
                                data.urnNo
                            ];
                        },
                        onSelect: function (valueObj, model, context) {
                            PageHelper.showProgress('customer-load', 'Loading customer...');

                            var enrolmentDetails = {
                                'customerId': model.customer.id,
                                'customerClass': model._bundlePageObj.pageClass,
                                'firstName': model.customer.firstName
                            };

                            if (_.hasIn(model, 'customer.id')) {
                                BundleManager.pushEvent("enrolment-removed", model._bundlePageObj, enrolmentDetails)
                            }

                            Enrollment.getCustomerById({id: valueObj.id})
                                .$promise
                                .then(function (res) {
                                    PageHelper.showProgress("customer-load", "Done..", 5000);
                                    model.customer = Utils.removeNulls(res, true);
                                    model.customer.identityProof = "Pan Card";
                                    model.customer.addressProof = "Aadhar Card";
                                    BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer})
                                }, function (httpRes) {
                                    PageHelper.showProgress("customer-load", 'Unable to load customer', 5000);
                                })
                        }
                    },
                    "aadhaarNo": {
                        "key": "customer.aadhaarNo",
                        orderNo: 10,
                        type: "qrcode",
                        onChange: "actions.setProofs(model)",
                        onCapture: EnrollmentHelper.customerAadhaarOnCapture
                    },
                    "IdentityProof1": {
                        type: "fieldset",
                        orderNo: 20,
                        title: "IDENTITY_PROOF",
                        items: {
                            "identityProof": {
                                key: "customer.identityProof",
                                type: "select"
                            },
                            "identityProofImageId": {
                                key: "customer.identityProofImageId",
                                type: "file",
                                fileType: "application/pdf",
                                using: "scanner"
                            },
                            "identityProofReverseImageId": {
                                key: "customer.identityProofReverseImageId",
                                type: "file",
                                fileType: "application/pdf",
                                using: "scanner"
                            },
                            "identityProofNo": {
                                key: "customer.identityProofNo",
                                type: "string"
                            },
                            "idProofIssueDate": {
                                key: "customer.idProofIssueDate",
                                type: "date"
                            },
                            "idProofValidUptoDate": {
                                key: "customer.idProofValidUptoDate",
                                type: "date"
                            },
                            "addressProofSameAsIdProof": {
                                key: "customer.addressProofSameAsIdProof"
                            }
                        }
                    },
                    "addressProof1": {
                        type: "fieldset",
                        orderNo: 30,
                        title: "ADDRESS_PROOF",
                        condition: "!model.customer.addressProofSameAsIdProof",
                        items: {
                            "addressProof": {
                                key: "customer.addressProof",
                                type: "select"
                            },
                            "addressProofImageId": {
                                key: "customer.addressProofImageId",
                                type: "file",
                                fileType: "application/pdf",
                                using: "scanner",
                                //"offline": true
                            },
                            "addressProofReverseImageId": {
                                key: "customer.addressProofReverseImageId",
                                type: "file",
                                fileType: "application/pdf",
                                using: "scanner",
                                "offline": true
                            },
                            "addressProofNo": {
                                key: "customer.addressProofNo",
                                type: "string"
                            },
                            "addressProofIssueDate": {
                                key: "customer.addressProofIssueDate",
                                type: "date"
                            },
                            "addressProofValidUptoDate": {
                                key: "customer.addressProofValidUptoDate",
                                type: "date"
                            }
                        }
                    },
                    "spouseIdProof": {
                        type: "fieldset",
                        orderNo: 40,
                        title: "SPOUSE_IDENTITY_PROOF",
                        condition: "model.customer.maritalStatus==='MARRIED'",
                        items: {
                            "udf33": {
                                key: "customer.udf.userDefinedFieldValues.udf33",
                                type: "select",
                                onChange: function (modelValue) {
                                    $log.info(modelValue);
                                }
                            },
                            "udf34": {
                                key: "customer.udf.userDefinedFieldValues.udf34",
                                type: "file",
                                fileType: "image/*",
                            },
                            "udf35": {
                                key: "customer.udf.userDefinedFieldValues.udf35",
                                type: "file",
                                fileType: "application/pdf",
                                using: "scanner",
                            },
                            "udf36": {
                                key: "customer.udf.userDefinedFieldValues.udf36",
                                condition: "model.customer.udf.userDefinedFieldValues.udf33 != 'Aadhar Card'",
                                //type: "barcode",
                                onCapture: function (result, model, form) {
                                    $log.info(result); // spouse id proof
                                    model.customer.udf.userDefinedFieldValues.udf36 = result.text;
                                }
                            },
                            "udf36_1": {
                                key: "customer.udf.userDefinedFieldValues.udf36",
                                condition: "model.customer.udf.userDefinedFieldValues.udf33 == 'Aadhar Card'",
                                //type: "qrcode",
                                onCapture: function (result, model, form) {
                                    $log.info(result); // spouse id proof
                                    var aadhaarData = EnrollmentHelper.parseAadhaar(result.text);
                                    $log.info(aadhaarData);
                                    model.customer.udf.userDefinedFieldValues.udf36 = aadhaarData.uid;
                                    model.customer.spouseFirstName = aadhaarData.name;
                                    if (aadhaarData.yob) {
                                        model.customer.spouseDateOfBirth = aadhaarData.yob + '-01-01';
                                        model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                    }
                                }
                            }
                        }
                    },
                    "AdditionalKYC": {
                        "key": "customer.additionalKYCs",
                        "type": "array",
                        // "add": null,
                        // "remove": null,
                        "title": "ADDITIONAL_KYC",
                        "items": {

                            "kyc1ProofType": {
                                key: "customer.additionalKYCs[].kyc1ProofType",
                                type: "select",
                                enumCode: "identity_proof",
                            },
                            "kyc1ImagePath": {
                                key: "customer.additionalKYCs[].kyc1ImagePath",
                                type: "file",
                                fileType: "application/pdf",
                                using: "scanner"
                            },
                            "kyc1ProofNumber": {
                                key: "customer.additionalKYCs[].kyc1ProofNumber",
                                type: "barcode",
                                condition: "customer.additionalKYCs[arrayIndex].kyc1ProofType == 'Aadhar Card'",
                                schema: {
                                    "pattern": "^[2-9]{1}[0-9]{11}$",
                                    "type": ["string", "null"],
                                },
                                onCapture: function (result, model, form) {
                                    $log.info(result);
                                    model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                                }
                            },
                            "kyc1ProofNumber1": {
                                key: "customer.additionalKYCs[].kyc1ProofNumber",
                                type: "barcode",
                                condition: "customer.additionalKYCs[arrayIndex].kyc1ProofType == 'Pan Card'",
                                schema: {
                                    "pattern": "[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}",
                                    "type": ["string", "null"],
                                },
                                onCapture: function (result, model, form) {
                                    $log.info(result);
                                    model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                                }
                            },
                            "kyc1ProofNumber2": {
                                key: "customer.additionalKYCs[].kyc1ProofNumber",
                                type: "barcode",
                                condition: "customer.additionalKYCs[arrayIndex].kyc1ProofType == 'Passport'",
                                schema: {
                                    "pattern": "^([A-PR-WY]){1}([1-9]){1}([0-9]){5}([1-9]){1}$",
                                    "type": ["string", "null"],
                                },
                                onCapture: function (result, model, form) {
                                    $log.info(result);
                                    model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                                }
                            },
                            "kyc1ProofNumber3": {
                                key: "customer.additionalKYCs[].kyc1ProofNumber",
                                type: "barcode",
                                condition: "customer.additionalKYCs[arrayIndex].kyc1ProofType !== 'Aadhar Card' && model.customer.additionalKYCs[arrayIndex].kyc1ProofType !== 'Pan Card' && model.customer.additionalKYCs[arrayIndex].kyc1ProofType !== 'Passport'",
                                onCapture: function (result, model, form) {
                                    $log.info(result);
                                    model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                                }
                            },
                            "kyc1IssueDate": {
                                key: "customer.additionalKYCs[].kyc1IssueDate",
                                type: "date"
                            },
                            "kyc1ValidUptoDate": {
                                key: "customer.additionalKYCs[].kyc1ValidUptoDate",
                                type: "date"
                            },
                            "kyc2ProofNumber": {
                                key: "customer.additionalKYCs[].kyc2ProofNumber",
                                type: "barcode",
                                onCapture: function (result, model, form) {
                                    $log.info(result);
                                    model.customer.additionalKYCs[form.arrayIndex].kyc2ProofNumber = result.text;
                                }
                            },
                            "kyc2ProofType": {
                                key: "customer.additionalKYCs[].kyc2ProofType",
                                type: "select"
                            },
                            "kyc2ImagePath": {
                                key: "customer.additionalKYCs[].kyc2ImagePath",
                                type: "file",
                                fileType: "image/*",
                                "offline": true
                            },
                            "kyc2IssueDate": {
                                key: "customer.additionalKYCs[].kyc2IssueDate",
                                type: "date"
                            },
                            "kyc2ValidUptoDate": {
                                key: "customer.additionalKYCs[].kyc2ValidUptoDate",
                                type: "date"
                            }
                        }

                    },
                }
            },
            "personalInformation": {
                "type": "box",
                "title": "PERSONAL_INFORMATION",
                "orderNo": 20,
                "items": {
                    "customerBranchId": {
                        key: "customer.customerBranchId",
                        title: "HUB_NAME",
                        orderNo: 10,
                        readonly: true,
                        type: "select"
                    },
                    "centerId": {
                        key: "customer.centreId",
                        orderNo: 20,
                        type: "select",
                        readonly: true,
                        title: "CENTRE_NAME",
                        filter: {
                            "parentCode": "branch_id"
                        },
                        parentEnumCode: "branch_id",
                        parentValueExpr: "customer.customerBranchId",
                    },
                    "centerId1": {
                        key: "customer.centreId",
                        type: "lov",
                        orderNo: 30,
                        condition: "!customer.id",
                        autolov: true,
                        lovonly: true,
                        bindMap: {},
                        searchHelper: formHelper,
                        search: function (inputModel, form, model, context) {
                            var centres = SessionStore.getCentres();
                            // $log.info("hi");
                            // $log.info(centres);

                            var centreCode = formHelper.enum('centre').data;
                            var out = [];
                            if (centres && centres.length) {
                                for (var i = 0; i < centreCode.length; i++) {
                                    for (var j = 0; j < centres.length; j++) {
                                        if (centreCode[i].value == centres[j].id) {
                                            out.push({
                                                name: centreCode[i].name,
                                                id: centreCode[i].value
                                            })
                                        }
                                    }
                                }
                            }
                            return $q.resolve({
                                headers: {
                                    "x-total-count": out.length
                                },
                                body: out
                            });
                        },
                        onSelect: function (valueObj, model, context) {
                            model.customer.centreId = valueObj.id;
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.name
                            ];
                        }
                    },
                    "centerId2": {
                        key: "customer.centreId",
                        condition: "customer.id",
                        readonly: true
                    },
                    "photoImageId": {
                        key: "customer.photoImageId",
                        orderNo: 40,
                        type: "file",
                        fileType: "image/*"
                    },
                    "title": {
                        "key": "customer.title",
                        orderNo: 50,
                        "title": "TITLE",
                        "type": "select",
                        "enumCode": "title"
                    },
                    "firstName": {
                        key: "customer.firstName",
                        title: "FULL_NAME",
                        orderNo: 60,
                        type: "string"
                    },
                    "enrolledAs": {
                        key: "customer.enrolledAs",
                        type: "radios"

                    },
                    "gender": {
                        key: "customer.gender",
                        type: "radios"
                    },
                    "dateOfBirth": {
                        key: "customer.dateOfBirth",
                        orderNo: 70,
                        required: true,
                        type: "date",
                        "onChange": function (modelValue, form, model) {
                            if (model.customer.dateOfBirth) {
                                model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                            }
                        }
                    },
                    "age": {
                        key: "customer.age",
                        orderNo: 80,
                        title: "AGE",
                        type: "number",
                        readonly: true
                    },
                    "language": {
                        key: "customer.language",
                        title: "PREFERRED_LANGUAGE",
                        type: "select",
                        enumCode: "applicant_preffered_language"
                    },
                    "fatherFirstName": {
                        key: "customer.fatherFirstName",
                        title: "FATHER_FULL_NAME"
                    },
                    "motherName": {
                        key: "customer.motherName",
                        title: "MOTHERS_FULL_NAME"
                    },
                    "maritalStatus": {
                        key: "customer.maritalStatus",
                        type: "select"
                    },
                    "spouseFirstName": {
                        key: "customer.spouseFirstName",
                        title: "SPOUSE_FULL_NAME",
                        condition: "model.customer.maritalStatus==='MARRIED'",
                        type: "qrcode"
                    },
                    "spouseDateOfBirth": {
                        key: "customer.spouseDateOfBirth",
                        title: "SPOUSE_DOB",
                        type: "date",
                        condition: "model.customer.maritalStatus==='MARRIED'"
                    },
                    "weddingDate": {
                        key: "customer.weddingDate",
                        type: "date",
                        title: "WEDDING_ANNIVERSERY",
                        condition: "model.customer.maritalStatus==='MARRIED'"
                    }
                }
            },
            "ContactInformation": {
                type: "box",
                "orderNo": 30,
                "title": "CONTACT_INFORMATION",
                "items": {
                    "contracInfo": {
                        type: "fieldset",
                        titile: "CONTACT_INFO",
                        items: {
                            "mobilePhone": {
                                key: "customer.mobilePhone",
                                type: "text",
                                inputmode: "number",
                                numberType: "tel"
                            },
                            "landLineNo": {
                                key: "customer.landLineNo",
                                type: "string",
                                inputmode: "number",
                                numberType: "tel"
                            },
                            "whatsAppMobileNoOption": {

                                "key": "customer.whatsAppMobileNoOption",
                                // "condition": "model.currentStage=='Screening'",
                                "title": "CHOOSE_WHATSAPP_NO",
                                "type": "radios",
                                "titleMap": {
                                    1: "Mobile Phone",
                                    2: "Phone 2",
                                    3: "Other"
                                },
                                onChange: function (modelValue, form, model, formCtrl, event) {
                                    switch (modelValue) {
                                        case "1":
                                            model.customer.whatsAppMobileNo = model.customer.mobilePhone;
                                            break;
                                        case "2":
                                            model.customer.whatsAppMobileNo = model.customer.landLineNo;
                                            break;
                                        case "3":
                                            model.customer.whatsAppMobileNo = "";
                                            break;
                                    }
                                },
                            },
                            "whatsAppMobileNo": {
                                "type": "string",
                                "key": "customer.whatsAppMobileNo",
                                "title": "WHATSAPP_MOBILE_NO",
                                "condition": "model.customer.whatsAppMobileNoOption == '3'",
                                "inputmode": "number",
                                "numberType": "tel"

                            },
                            "email": {
                                "type": "string",
                                "key": "customer.email",
                            },
                        }
                    },
                    "residentAddress": {
                        type: "fieldset",
                        title: "CUSTOMER_RESIDENTIAL_ADDRESS",
                        items: {
                            "careOf": {
                                key: "customer.careOf",
                                //required:true,
                                orderNo: 10,
                                title: "C/O",
                            },
                            "doorNo": {
                                orderNo: 20,
                                key: "customer.doorNo"
                            },
                            "street": {
                                orderNo: 30,
                                key: "customer.street"
                            },
                            "postOffice": {
                                orderNo: 40,
                                key: "customer.postOffice"
                            },
                            "landmark": {
                                orderNo: 50,
                                key: "customer.landmark"
                            },

                            "pincode": {
                                key: "customer.pincode",
                                orderNo: 60,
                                type: "lov",
                                fieldType: "number",
                                autolov: true,
                                inputMap: {
                                    "pincode": "customer.pincode",
                                    "district": {
                                        key: "customer.district"
                                    },
                                    "state": {
                                        key: "customer.state"
                                    }
                                },
                                outputMap: {
                                    "division": "customer.locality",
                                    "region": "customer.villageName",
                                    "pincode": "customer.pincode",
                                    "district": "customer.district",
                                    "state": "customer.state",
                                },
                                searchHelper: formHelper,
                                initialize: function (inputModel) {
                                    $log.warn('in pincode initialize');
                                    $log.info(inputModel);
                                },
                                search: function (inputModel, form, model) {
                                    if (!inputModel.pincode) {
                                        return $q.reject();
                                    }
                                    return Queries.searchPincodes(
                                        inputModel.pincode,
                                        inputModel.district,
                                        inputModel.state
                                    );
                                },
                                getListDisplayItem: function (item, index) {
                                    return [
                                        item.division + ', ' + item.region,
                                        item.pincode,
                                        item.district + ', ' + item.state,
                                    ];
                                },
                                onSelect: function (result, model, context) {
                                    $log.info(result);
                                }
                            },
                            "locality": {
                                key: "customer.locality",
                                readonly: true
                            },
                            "villageName": {
                                key: "customer.villageName",
                                readonly: true
                            },
                            "district": {
                                key: "customer.district",
                                readonly: true
                            },
                            "state": {
                                key: "customer.state",
                                readonly: true,
                            },
                            "mailSameAsResidence": {
                                key: "customer.mailSameAsResidence"
                            }
                        }
                    },
                    "permanentResidentAddress": {
                        type: "fieldset",
                        title: "CUSTOMER_PERMANENT_ADDRESS",
                        condition: "!model.customer.mailSameAsResidence",
                        items: {
                            "mailingDoorNo": {
                                key: "customer.mailingDoorNo"
                            },
                            "mailingStreet": {
                                key: "customer.mailingStreet"
                            },
                            "mailingPostoffice": {
                                key: "customer.mailingPostoffice"
                            },

                            "mailingPincode": {
                                key: "customer.mailingPincode",
                                type: "lov",
                                "inputmode": "number",
                                autolov: true,
                                inputMap: {
                                    "mailingPincode": "customer.mailingPincode",
                                    "mailingDistrict": {
                                        key: "customer.mailingDistrict"
                                    },
                                    "mailingState": {
                                        key: "customer.mailingState"
                                    }
                                },
                                outputMap: {
                                    "mailingDivision": "customer.mailingLocality",
                                    "mailingPincode": "customer.mailingPincode",
                                    "mailingDistrict": "customer.mailingDistrict",
                                    "mailingState": "customer.mailingState"
                                },
                                searchHelper: formHelper,
                                initialize: function (inputModel) {
                                    $log.warn('in pincode initialize');
                                    $log.info(inputModel);
                                },
                                search: function (inputModel, form, model) {
                                    if (!inputModel.mailingPincode) {
                                        return $q.reject();
                                    }
                                    return Queries.searchPincodes(
                                        inputModel.mailingPincode,
                                        inputModel.mailingDistrict,
                                        inputModel.mailingState
                                    );
                                },
                                getListDisplayItem: function (item, index) {
                                    return [
                                        item.division + ', ' + item.region,
                                        item.pincode,
                                        item.district + ', ' + item.state
                                    ];
                                },
                                onSelect: function (result, model, context) {
                                    model.customer.mailingPincode = (new Number(result.pincode)).toString();
                                    model.customer.mailingLocality = result.division;
                                    model.customer.mailingState = result.state;
                                    model.customer.mailingDistrict = result.district;
                                }
                            },
                            "mailingLocality": {
                                key: "customer.mailingLocality",
                                readonly: true
                            },
                            "mailingDistrict": {
                                key: "customer.mailingDistrict",
                                readonly: true
                            },
                            "mailingState": {
                                key: "customer.mailingState",
                                readonly: true
                            }
                        }
                    }


                }
            },
            "householdeDetails": {
                "type": "box",
                "orderNo": 40,
                "title": "FAMILY_SELF_DETAILS",
                //"condition": "model.currentStage == 'Application' || model.currentStage=='FieldAppraisal'",
                "items": {
                    "familyMembers": {
                        key: "customer.familyMembers",
                        type: "array",
                        startEmpty: true,
                        items: {
                            "relationShipself": {
                                key: "customer.familyMembers[].relationShip",
                                readonly: true,
                                condition: "(model.customer.familyMembers[arrayIndex].relationShip).toUpperCase() =='SELF'",
                                type: "select",
                                onChange: function (modelValue, form, model, formCtrl, event) {
                                    if (modelValue && modelValue.toLowerCase() === 'self') {
                                        if (model.customer.id)
                                            model.customer.familyMembers[form.arrayIndex].customerId = model.customer.id;
                                        if (model.customer.firstName)
                                            model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.firstName;
                                        if (model.customer.gender)
                                            model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender;
                                        model.customer.familyMembers[form.arrayIndex].age = model.customer.age;
                                        if (model.customer.dateOfBirth)
                                            model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.dateOfBirth;
                                        if (model.customer.maritalStatus)
                                            model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                                        if (model.customer.mobilePhone)
                                            model.customer.familyMembers[form.arrayIndex].mobilePhone = model.customer.mobilePhone;
                                    } else if (modelValue && modelValue.toLowerCase() === 'spouse') {
                                        if (model.customer.spouseFirstName)
                                            model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.spouseFirstName;
                                        if (model.customer.gender)
                                            model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender == 'MALE' ? 'MALE' :
                                                (model.customer.gender == 'FEMALE' ? 'FEMALE' : model.customer.gender);
                                        model.customer.familyMembers[form.arrayIndex].age = model.customer.spouseAge;
                                        if (model.customer.spouseDateOfBirth)
                                            model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.spouseDateOfBirth;
                                        if (model.customer.maritalStatus)
                                            model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                                    }
                                },
                                title: "T_RELATIONSHIP"
                            },
                            "relationShip": {
                                key: "customer.familyMembers[].relationShip",
                                type: "select",
                                condition: "(model.customer.familyMembers[arrayIndex].relationShip).toUpperCase() !=='SELF'",
                                onChange: function (modelValue, form, model, formCtrl, event) {
                                    if (modelValue && modelValue.toLowerCase() === 'self') {
                                        if (model.customer.id)
                                            model.customer.familyMembers[form.arrayIndex].customerId = model.customer.id;
                                        if (model.customer.firstName)
                                            model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.firstName;
                                        if (model.customer.gender)
                                            model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender;
                                        model.customer.familyMembers[form.arrayIndex].age = model.customer.age;
                                        if (model.customer.dateOfBirth)
                                            model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.dateOfBirth;
                                        if (model.customer.maritalStatus)
                                            model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                                        if (model.customer.mobilePhone)
                                            model.customer.familyMembers[form.arrayIndex].mobilePhone = model.customer.mobilePhone;
                                    } else if (modelValue && modelValue.toLowerCase() === 'spouse') {
                                        if (model.customer.spouseFirstName)
                                            model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.spouseFirstName;
                                        if (model.customer.gender)
                                            model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender == 'MALE' ? 'MALE' :
                                                (model.customer.gender == 'FEMALE' ? 'FEMALE' : model.customer.gender);
                                        model.customer.familyMembers[form.arrayIndex].age = model.customer.spouseAge;
                                        if (model.customer.spouseDateOfBirth)
                                            model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.spouseDateOfBirth;
                                        if (model.customer.maritalStatus)
                                            model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                                    }
                                },
                                title: "T_RELATIONSHIP"
                            },

                            "familyMemberFirstName": {
                                key: "customer.familyMembers[].familyMemberFirstName",
                                condition: "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                                title: "FAMILY_MEMBER_FULL_NAME"
                            },
                            "maritalStatus": {
                                "key":"customer.familyMembers[].maritalStatus",
                                "type": "select",
                                "title": "MARITAL_STATUS"

                            },

                            "primaryOccupation": {
                                "key": "customer.occupation1",
                                "title": "PRIMARY_OCCUPATION",
                                "type": "select",
                                "enumCode":"lead_primary_occupation"
                            },

                            "educationStatus": {
                                key: "customer.familyMembers[].educationStatus",
                                type: "select",
                                required: true,
                                title: "T_EDUCATION_STATUS"
                            },
                            "anualEducationFee": {
                                key: "customer.familyMembers[].anualEducationFee",
                                type: "amount",
                                title: "ANNUAL_EDUCATION_FEE"
                            },
                            "salary": {
                                key: "customer.familyMembers[].salary",
                                type: "amount",
                                title: "SALARY"
                            },
                            "incomes": {
                                key: "customer.familyMembers[].incomes",
                                type: "array",
                                startEmpty: true,
                                items: {
                                    "incomeSource": {
                                        key: "customer.familyMembers[].incomes[].incomeSource",
                                        type: "select"
                                    },
                                    "incomeEarned": {
                                        key: "customer.familyMembers[].incomes[].incomeEarned",
                                    },
                                    "frequency": {
                                        key: "customer.familyMembers[].incomes[].frequency",
                                        type: "select"
                                    }
                                }
                            }
                        }
                    },
                    "expenditures": {
                        "key": "customer.expenditures",
                        "type": "array",
                        "title": "EXPENDITURES",
                        "view": "fixed",
                        "add": null,
                        "remove": null,
                        "items": {
                            "expenditureSource": {
                                "key": "customer.expenditures[].expenditureSource",
                                "type": "select",
                                required: true,
                                "title": "EXPENSE_TYPE"
                            },
                            "annualExpenses": {
                                "key": "customer.expenditures[].annualExpenses",
                                "type": "amount",
                                "title": "AMOUNT"
                            },
                            "frequency": {
                                "key": "customer.expenditures[].frequency",
                                "type": "select",
                                readonly: true,
                                "title": "FREQUENCY"
                            }
                        }
                    }
                }
            },
            "householdLiablities": {
                type: "box",
                title: "HOUSEHOLD_LIABILITIES",
                "orderNo": 60,
                items: {
                    "liabilities": {
                        key: "customer.liabilities",
                        type: "array",
                        startEmpty: true,
                        title: "HOUSEHOLD_LIABILITIES",
                        items: {
                            "loanSourceCategory": {
                                key: "customer.liabilities[].loanSourceCategory",
                                type: "select",
                                orderNo: 10,
                                title: "LOAN_SOURCE_CATEGORY",
                                required: "true",
                                enumCode: "applicant_loan_source_category"
                            },
                            "loanSource": {
                                key: "customer.liabilities[].loanSource",
                                type: "select",
                                orderNo: 20,
                                enumCode: "loan_source"
                            },
                            "loanType": {
                                key: "customer.liabilities[].loanType",
                                orderNo: 20
                            },
                            "loanAmountInPaisa": {
                                key: "customer.liabilities[].loanAmountInPaisa",
                                orderNo: 30,
                                type: "amount"
                            },
                            "installmentAmountInPaisa": {
                                key: "customer.liabilities[].installmentAmountInPaisa",
                                type: "amount",
                                orderNo: 40,
                                title: "AVG_INSTALLEMENT_AMOUNT"
                            },
                            "outstandingAmountInPaisa": {
                                key: "customer.liabilities[].outstandingAmountInPaisa",
                                type: "amount",
                                orderNo: 50,
                                title: "OUTSTANDING_AMOUNT"
                            },
                            "startDate": {
                                key: "customer.liabilities[].startDate",
                                orderNo: 60,
                                type: "date"
                            },
                            "maturityDate": {
                                key: "customer.liabilities[].maturityDate",
                                orderNo: 70,
                                type: "date"
                            },
                            "noOfInstalmentPaid": {
                                key: "customer.liabilities[].noOfInstalmentPaid",
                                type: "number",
                                title: "NO_OF_INSTALLMENT_PAID"
                            },
                            "frequencyOfInstallment": {
                                key: "customer.liabilities[].frequencyOfInstallment",
                                type: "select"
                            },
                            "liabilityLoanPurpose": {
                                key: "customer.liabilities[].liabilityLoanPurpose",
                                type: "select",
                                enumCode: "vehicle_loan_purpose"
                            },
                            "interestOnly": {
                                key: "customer.liabilities[].interestOnly",
                                type: "radios",
                                title: "INTEREST_ONLY",
                                enumCode: "decisionmaker"
                            },
                            "interestRate": {
                                key: "customer.liabilities[].interestRate",
                                type: "number",
                                title: "RATE_OF_INTEREST"
                            },
                            "proofDocuments": {
                                key: "customer.liabilities[].proofDocuments",
                                type: "file",
                                "title": "UPLOAD_RECEIPTS",
                                fileType: "application/pdf",
                                "category": "CustomerEnrollment",
                                "subCategory": "LIABILITIES"
                            }
                        }
                    }
                }
            },
            "householdVerification": {
                "type": "box",
                "orderNo": 70,
                "title": "T_HOUSE_VERIFICATION",
                items: {
                    "householdDetails": {
                        type: "fieldset",
                        title: "HOUSE_DETAILS",
                        items: {
                            "ownership": {
                                key: "customer.ownership",
                                required: true,
                                type: "select",
                                enumCode: "applicant_premise_owenership"
                            },
                            "udf29": {
                                key: "customer.udf.userDefinedFieldValues.udf29", // customer.inCurrentAddressSince
                                type: "select",
                                title: "IN_CURRENT_ADDRESS_SINCE"
                            },
                            "distanceFromBranch": {
                                key: "customer.distanceFromBranch",
                                type: "select",
                                title: "DISTANCE_FROM_BRANCH",
                                enumCode: "loan_distance_from_branch"
                            },
                            "monthlyRent": {
                                key: "customer.monthlyRent",
                                type: "number",
                                title: "MONTHLY_RENT"
                            },
                            "previousRentDetails": {
                                key: "customer.previousRentDetails",
                                title: "PREVIOUS_RENT_DEATLS",
                                condition: "model.customer.udf.userDefinedFieldValues.udf29 == '1 - <3 years'"
                            }
                        }
                    }
                }

            },
            "assets": {
                "type": "box",
                orderNo: 90,
                "title": "T_ASSETS",
                "items": {
                    "physicalAssets": {
                        key: "customer.physicalAssets",
                        type: "array",
                        startEmpty: true,
                        items: {
                            "assetType": {
                                key: "customer.physicalAssets[].assetType",
                                "title": "ASSET_TYPE",
                                type: "select",
                                enumCode: "asset_type"
                            },
                            "ownedAssetDetails": {
                                key: "customer.physicalAssets[].ownedAssetDetails",
                                type: "select",
                                screenFilter: true,
                                enumCode: "asset_Details",
                                parentEnumCode: "asset_type",
                                parentValueExpr: "model.customer.physicalAssets[arrayIndex].assetType",
                            },
                            "unit": {
                                key: "customer.physicalAssets[].unit",
                                "title": "UNIT",
                                type: "select",
                                screenFilter: true,
                                parentEnumCode: "asset_type",
                                parentValueExpr: "model.customer.physicalAssets[arrayIndex].assetType",
                            },
                            "numberOfOwnedAsset": {
                                "title": "NUMBER_OF_ASSETS",
                                key: "customer.physicalAssets[].numberOfOwnedAsset",
                            },
                            "ownedAssetValue": {
                                key: "customer.physicalAssets[].ownedAssetValue",
                                type: "amount"
                            }
                        }
                    }
                }
            },
            "trackDetails": {
                type: "box",
                title: "TRACK_DETAILS",
                "orderNo": 80,
                items: {
                    "vehiclesOwned": {
                        key: "customer.vehiclesOwned",
                        type: "number",
                        title: "No of Vehicles owned by customer"
                    },
                    "vehiclesFinanced": {
                        key: "customer.vehiclesFinanced",
                        type: "number",
                        title: "No of Vehicles financed"
                    },
                    "vehiclesFree": {
                        key: "customer.vehiclesFree",
                        type: "number",
                        title: "No of Vehicles Free"
                    }
                }
            },
            "reference": {
                "type": "box",
                "orderNo": 90,
                "title": "REFERENCES",
                "items": {
                    "verifications": {
                        key: "customer.verifications",
                        title: "REFERENCES",
                        type: "array",
                        items: {
                            /*{
                             key:"customer.verifications[].relationship",
                             title:"REFERENCE_TYPE",
                             type:"select",
                             required:"true",
                             titleMap: {
                             "Neighbour": "Neighbour",
                             "Relative/friend": "Relative/friend"
                             }
                             },*/
                            "referenceFirstName": {
                                key: "customer.verifications[].referenceFirstName",
                                title: "CONTACT_PERSON_NAME",
                                type: "string",
                                required: true
                            },
                            "mobileNo": {
                                key: "customer.verifications[].mobileNo",
                                title: "CONTACT_NUMBER",
                                type: "string",
                                required: true,
                                inputmode: "number",
                                numberType: "tel",
                                /*"schema":{
                                 "pattern":"/[1-9]{1}[0-9]{9}$/"
                                 }*/
                            },
                            "occupation": {
                                key: "customer.verifications[].occupation",
                                title: "OCCUPATION",
                                type: "select",
                                "enumCode": "occupation",
                            },
                            "address": {
                                key: "customer.verifications[].address",
                                type: "textarea"
                            },
                            "referenceCheck": {
                                type: "fieldset",
                                title: "REFERENCE_CHECK",
                                items: {
                                    "knownSince": {
                                        key: "customer.verifications[].knownSince",
                                        required: true
                                    },
                                    "relationship": {
                                        key: "customer.verifications[].relationship",
                                        title: "REFERENCE_TYPE1",
                                        type: "select",
                                        required: true,
                                        titleMap: {
                                            "Neighbour": "Neighbour",
                                            "Relative/friend": "Relative/friend"
                                        }
                                    },
                                    "opinion": {
                                        key: "customer.verifications[].opinion"
                                    },
                                    "financialStatus": {
                                        key: "customer.verifications[].financialStatus"
                                    },
                                    "customerResponse": {
                                        key: "customer.verifications[].customerResponse",
                                        title: "CUSTOMER_RESPONSE",
                                        required: true,
                                        type: "select",
                                        enumCode: "lead_customer_response"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "actionbox": {
                "type": "actionbox",
                "items": {
                    "save": {
                        "type": "save",
                        "title": "Offline Save"
                    },
                    "submit": {
                        "type": "submit",
                        "title": "Submit"
                    }
                }
            }
        };

        formRepository['crAppraisal'] = {
            "reference": {
                "type": "box",
                "title": "REFERENCES",
                "items": {
                    "verifications": {
                        key: "customer.verifications",
                        title: "REFERENCES",
                        type: "array",
                        items: {
                            /*{
                             key:"customer.verifications[].relationship",
                             title:"REFERENCE_TYPE",
                             type:"select",
                             required:"true",
                             titleMap: {
                             "Neighbour": "Neighbour",
                             "Relative/friend": "Relative/friend"
                             }
                             },*/
                            "referenceFirstName": {
                                key: "customer.verifications[].referenceFirstName",
                                title: "CONTACT_PERSON_NAME",
                                type: "string",
                                required: true
                            },
                            "mobileNo": {
                                key: "customer.verifications[].mobileNo",
                                title: "CONTACT_NUMBER",
                                type: "string",
                                required: true,
                                inputmode: "number",
                                numberType: "tel",
                                /*"schema":{
                                 "pattern":"/[1-9]{1}[0-9]{9}$/"
                                 }*/
                            },
                            "occupation": {
                                key: "customer.verifications[].occupation",
                                title: "OCCUPATION",
                                type: "select",
                                "enumCode": "occupation",
                            },
                            "address": {
                                key: "customer.verifications[].address",
                                type: "textarea"
                            },
                            "referenceCheck": {
                                type: "fieldset",
                                title: "REFERENCE_CHECK",
                                items: {
                                    "knownSince": {
                                        key: "customer.verifications[].knownSince",
                                        required: true
                                    },
                                    "relationship": {
                                        key: "customer.verifications[].relationship",
                                        title: "REFERENCE_TYPE1",
                                        type: "select",
                                        required: true,
                                        titleMap: {
                                            "Neighbour": "Neighbour",
                                            "Relative/friend": "Relative/friend"
                                        }
                                    },
                                    "opinion": {
                                        key: "customer.verifications[].opinion"
                                    },
                                    "financialStatus": {
                                        key: "customer.verifications[].financialStatus"
                                    },
                                    "customerResponse": {
                                        key: "customer.verifications[].customerResponse",
                                        title: "CUSTOMER_RESPONSE",
                                        required: true,
                                        type: "select",
                                        titleMap: [{
                                            value: "positive",
                                            name: "positive"
                                        }, {
                                            value: "Negative",
                                            name: "Negative"
                                        }]
                                    }
                                }
                            }
                        }
                    }
                }
            },

            "basicDetails": {
                type: "box",
                title: "BASIC_DETAILS",
                "items": {
                    "applicantInformation": {
                        type: "fieldset",
                        "title": "APPLICANT_INFORMATION",
                        items: {
                            "firstName": {
                                key: "customer.firstName"
                            }
                        }
                    },
                    "contactInformation": {
                        type: "fieldset",
                        "title": "CONTACT_INFORMATION",
                        "items": {
                            "contracInfo": {
                                type: "fieldset",
                                titile: "CONTACT_INFO",
                                items: {
                                    "mobilePhone": {
                                        key: "customer.mobilePhone",
                                        type: "text",
                                        inputmode: "number",
                                        numberType: "tel"
                                    },
                                    "landLineNo": {
                                        key: "customer.landLineNo",
                                        type: "string",
                                        inputmode: "number",
                                        numberType: "tel"
                                    }
                                }
                            },
                            "residentAddress": {
                                type: "fieldset",
                                title: "CUSTOMER_RESIDENTIAL_ADDRESS",
                                items: {

                                    "doorNo": {
                                        key: "customer.doorNo"
                                    },
                                    "street": {
                                        key: "customer.street"
                                    },
                                    "postOffice": {
                                        key: "customer.postOffice"
                                    },
                                    "landmark": {
                                        key: "customer.landmark"
                                    },

                                    "pincode": {
                                        key: "customer.pincode",
                                        type: "lov",
                                        fieldType: "number",
                                        autolov: true,
                                        inputMap: {
                                            "pincode": "customer.pincode",
                                            "district": {
                                                key: "customer.district"
                                            },
                                            "state": {
                                                key: "customer.state"
                                            }
                                        },
                                        outputMap: {
                                            "division": "customer.locality",
                                            "region": "customer.villageName",
                                            "pincode": "customer.pincode",
                                            "district": "customer.district",
                                            "state": "customer.state",
                                        },
                                        searchHelper: formHelper,
                                        initialize: function (inputModel) {
                                            $log.warn('in pincode initialize');
                                            $log.info(inputModel);
                                        },
                                        search: function (inputModel, form, model) {
                                            if (!inputModel.pincode) {
                                                return $q.reject();
                                            }
                                            return Queries.searchPincodes(
                                                inputModel.pincode,
                                                inputModel.district,
                                                inputModel.state
                                            );
                                        },
                                        getListDisplayItem: function (item, index) {
                                            return [
                                                item.division + ', ' + item.region,
                                                item.pincode,
                                                item.district + ', ' + item.state,
                                            ];
                                        },
                                        onSelect: function (result, model, context) {
                                            $log.info(result);
                                        }
                                    },
                                    "locality": {
                                        key: "customer.locality",
                                        readonly: true
                                    },
                                    "villageName": {
                                        key: "customer.villageName",
                                        readonly: true
                                    },
                                    "district": {
                                        key: "customer.district",
                                        readonly: true
                                    },
                                    "state": {
                                        key: "customer.state",
                                        readonly: true,
                                    },
                                }
                            },
                            "permanentResidentAddress": {
                                type: "fieldset",
                                title: "CUSTOMER_PERMANENT_ADDRESS",
                                condition: "!model.customer.mailSameAsResidence",
                                items: {
                                    "mailingDoorNo": {
                                        key: "customer.mailingDoorNo"
                                    },
                                    "mailingStreet": {
                                        key: "customer.mailingStreet"
                                    },
                                    "mailingPostoffice": {
                                        key: "customer.mailingPostoffice"
                                    },

                                    "mailingPincode": {
                                        key: "customer.mailingPincode",
                                        type: "lov",
                                        "inputmode": "number",
                                        autolov: true,
                                        inputMap: {
                                            "mailingPincode": "customer.mailingPincode",
                                            "mailingDistrict": {
                                                key: "customer.mailingDistrict"
                                            },
                                            "mailingState": {
                                                key: "customer.mailingState"
                                            }
                                        },
                                        outputMap: {
                                            "mailingDivision": "customer.mailingLocality",
                                            "mailingPincode": "customer.mailingPincode",
                                            "mailingDistrict": "customer.mailingDistrict",
                                            "mailingState": "customer.mailingState"
                                        },
                                        searchHelper: formHelper,
                                        initialize: function (inputModel) {
                                            $log.warn('in pincode initialize');
                                            $log.info(inputModel);
                                        },
                                        search: function (inputModel, form, model) {
                                            if (!inputModel.mailingPincode) {
                                                return $q.reject();
                                            }
                                            return Queries.searchPincodes(
                                                inputModel.mailingPincode,
                                                inputModel.mailingDistrict,
                                                inputModel.mailingState
                                            );
                                        },
                                        getListDisplayItem: function (item, index) {
                                            return [
                                                item.division + ', ' + item.region,
                                                item.pincode,
                                                item.district + ', ' + item.state
                                            ];
                                        },
                                        onSelect: function (result, model, context) {
                                            model.customer.mailingPincode = (new Number(result.pincode)).toString();
                                            model.customer.mailingLocality = result.division;
                                            model.customer.mailingState = result.state;
                                            model.customer.mailingDistrict = result.district;
                                        }
                                    },
                                    "mailingLocality": {
                                        key: "customer.mailingLocality",
                                        readonly: true
                                    },
                                    "mailingDistrict": {
                                        key: "customer.mailingDistrict",
                                        readonly: true
                                    },
                                    "mailingState": {
                                        key: "customer.mailingState",
                                        readonly: true
                                    }
                                }
                            }
                        }
                    },
                },
            }
        };

        formRepository['VehicleValuation'] = {
            "primaryInfo": {
                orderNo: 10,
                "type": "box",
                "title": "PRIMARY_INFORMATION",
                "items": {
                    "registrationNumber": {
                        key: "loanAccount.vehicleLoanDetails.registrationNumber",
                        title: "REGISTRATION_NUMBER"
                    },
                    "firstName": {
                        key: "loanAccount.vehicleLoanDetails.firstName",
                        title: "BORROWER_NAME"
                    },
                    "mobileNo": {
                        key: "loanAccount.vehicleLoanDetails.mobileNo",
                        title: "MOBILE_NO"
                    },
                    "AlternatemobileNo": {
                        key: "loanAccount.vehicleLoanDetails.AlternatemobileNo",
                        title: "ALTERNATE_MOBILE_NO"
                    },
                    "registeredaddress": {
                        key: "loanAccount.vehicleLoanDetails.registeredaddress",
                        title: "REGISTERED_ADDRESS"
                    }
                }
            },

            "valuationPriliminaryInformation": {
                orderNo: 20,
                "type": "box",
                "title": "VALUATION_PRILIMINARY_INFORMATION",
                "items": {
                    "valuationPurpose": {
                        key: "loanAccount.vehicleLoanDetails.valuationPurpose",
                        type: "select",
                        title: "PURPOSE_OF_VALUATION"
                    },
                    "valuationDate": {
                        key: "loanAccount.vehicleLoanDetails.valuationDate",
                        type: "date",
                        title: "DATE_OF_VALUATION",
                    },
                    "valuationPlace": {
                        key: "loanAccount.vehicleLoanDetails.valuationPlace",
                        title: "PLACE_OF_VALUATION",
                    },
                    "registeredOwnerName": {
                        key: "loanAccount.vehicleLoanDetails.registeredOwnerName",
                        title: "REGISTERED_OWNER_NAME",
                    },
                    "proposedOwnerName": {
                        key: "loanAccount.vehicleLoanDetails.proposedOwnerName",
                        title: "PROPOSED_OWNER_NAME",
                    },
                    "bankReferenceNumber": {
                        key: "loanAccount.vehicleLoanDetails.bankReferenceNumber",
                        title: "BANK_REFERENCE_NUMBER",
                        inputmode: "number",
                        numberType: "tel"
                    }
                }
            },

            "InspectionDetails": {
                "type": "box",
                orderNo: 30,
                "title": "INSPECTION_DETAILS",
                "items": {
                    "inspectionDate": {
                        key: "loanAccount.vehicleLoanDetails.inspectionDate",
                        type: "date",
                        title: "INSPECTION_DATE",
                    },
                    "inspectedBy": {
                        key: "loanAccount.vehicleLoanDetails.inspectedBy",
                        title: "INSPECTED_BY",
                    },
                    "vehicleMoved": {
                        key: "loanAccount.vehicleLoanDetails.vehicleMoved",
                        title: "VECHICLE_MOVED",
                        type: "select",
                        "titleMap": {
                            true: "Yes",
                            false: "No"
                        }
                        //"enumCode":"decisionmaker"
                    },
                    "inspectionLatitude": {
                        key: "loanAccount.vehicleLoanDetails.inspectionLatitude",
                        title: "PLACE_OF_INSPECTION",
                        "type": "geotag",
                        "latitude": "latitude",
                        "longitude": "longitude",
                    },
                    "inspectionAltitude": {
                        key: "loanAccount.vehicleLoanDetails.inspectionAltitude",
                        title: "TIME_OF_INSPECTION",
                    },
                    "engineStarted": {
                        key: "loanAccount.vehicleLoanDetails.engineStarted",
                        title: "ENGINE_STARTED",
                        type: "select",
                        "titleMap": {
                            true: "Yes",
                            false: "No"
                        }
                        //"enumCode":"decisionmaker"
                    },
                }
            },

            "VehicleIdentityDetails": {
                "type": "box",
                orderNo: 40,
                "title": "VEHICLE_IDENTITY_DETAILS",
                "items": {
                    "make": {
                        key: "loanAccount.vehicleLoanDetails.make",
                        title: "MAKE",
                        type: "select"
                    },
                    "variant": {
                        key: "loanAccount.vehicleLoanDetails.variant",
                        title: "VARIANT",
                    },
                    "colour": {
                        key: "loanAccount.vehicleLoanDetails.colour",
                        title: "COLOUR",
                    },
                    "trailer": {
                        key: "loanAccount.vehicleLoanDetails.trailer",
                        title: "TRAILER",
                    },
                    "chasisNo": {
                        key: "loanAccount.vehicleLoanDetails.chasisNo",
                        title: "CHASIS_NO",
                    },
                    "engineNo": {
                        key: "loanAccount.vehicleLoanDetails.engineNo",
                        title: "ENGINE_NO",
                    },
                    "odometerReading": {
                        key: "loanAccount.vehicleLoanDetails.odometerReading",
                        title: "ODOMETER_READING",
                        inputmode: "number",
                        numberType: "number"
                    },
                    "estimatedReading": {
                        key: "loanAccount.vehicleLoanDetails.estimatedReading",
                        title: "BANK_REFERENCE_NUMBER",
                        type: "number",
                        inputmode: "number",
                        numberType: "number"
                    },

                    "transmission": {
                        key: "loanAccount.vehicleLoanDetails.transmission",
                        title: "TRANSMISSION",
                        type: "radios",
                        enumCode: "vehicle_transmission"
                    },
                    "odometer": {
                        key: "loanAccount.vehicleLoanDetails.odometer",
                        title: "ODOMETER",
                        type: "radios",
                        enumCode: "vehicle_odometer"

                    },
                    "usedFor": {
                        key: "loanAccount.vehicleLoanDetails.usedFor",
                        title: "USED_FOR",
                        type: "select",
                        enumCode: "vehicle_usedfor"
                    },
                }
            },

            "RegistrationDetails": {
                "type": "box",
                orderNo: 50,
                "title": "REGISTRATION_DETAILS",
                "items": {
                    "reRegistered": {
                        key: "loanAccount.vehicleLoanDetails.reRegistered",
                        title: "RE_REGISTERED",
                        type: "select",
                        "titleMap": {
                            true: "Yes",
                            false: "No"
                        }
                        //"enumCode":"decisionmaker"
                    },
                    "previousRegistrationNumber": {
                        key: "loanAccount.vehicleLoanDetails.previousRegistrationNumber",
                        condition: "model.loanAccount.vehicleLoanDetails.reRegistered=='YES'",
                        title: "PREVIOUS_REGISTRATION_NUMBER",
                    },
                    "registrationAsPerRcbook": {
                        key: "loanAccount.vehicleLoanDetails.registrationAsPerRcbook",
                        title: "REGISTRATION_AS_PER_RCBOOK",
                    },
                    "registrationAsPerActual": {
                        key: "loanAccount.vehicleLoanDetails.registrationAsPerActual",
                        title: "REGISTRATION_AS_PER_ACTUAL",
                    },
                    "numberPlateCOlour": {
                        key: "loanAccount.vehicleLoanDetails.numberPlateCOlour",
                        type: "radios",
                        enumCode: "numberPlateCOlour",
                        title: "NUMBER_PLATE_COLOUR",
                    },
                    "registeredownersname": {
                        key: "loanAccount.vehicleLoanDetails.registeredownersname",
                        title: "REGISTERED_OWNER_NAME",
                    },
                    "engineNo": {
                        key: "loanAccount.vehicleLoanDetails.engineNo",
                        title: "ENGINE_NO",
                    },
                    "registeredAddress": {
                        key: "loanAccount.vehicleLoanDetails.registeredAddress",
                        title: "REGISTERED_ADDRESS",
                    },
                    "ownerSerialNo": {
                        key: "loanAccount.vehicleLoanDetails.ownerSerialNo",
                        title: "OWNER_SERIAL_NO",
                        type: "select",
                        "enumCode": "vehicle_ownerSerialNo"
                    },
                    "registrationDate": {
                        key: "loanAccount.vehicleLoanDetails.registrationDate",
                        title: "REGISTRATION_DATE",
                        type: "date"
                    },
                    "vehicleClass": {
                        key: "loanAccount.vehicleLoanDetails.vehicleClass",
                        title: "VEHICLE_CLASS",
                        type: "select",
                        enumCode: "vehicle_class"
                    },
                    "bodyType": {
                        key: "loanAccount.vehicleLoanDetails.bodyType",
                        title: "BODY_TYPE",
                        type: "select",
                    },
                    "fuelUsed": {
                        key: "loanAccount.vehicleLoanDetails.fuelUsed",
                        title: "FUEL_USED",
                        type: "select",
                        enumCode: "vehicle_fuelUsed"
                    },
                    "cubicCapacity": {
                        key: "loanAccount.vehicleLoanDetails.cubicCapacity",
                        title: "FUEL_USED",
                        type: "select"
                    },
                    "makersClassification": {
                        key: "loanAccount.vehicleLoanDetails.makersClassification",
                        title: "MAKER_CLASSIFICATION",
                    },
                    "seatingCapacity": {
                        key: "loanAccount.vehicleLoanDetails.seatingCapacity",
                        type: "select",
                        title: "SEATING_CAPACITY",
                    },
                    "unladenWeight": {
                        key: "loanAccount.vehicleLoanDetails.unladenWeight",
                        title: "UNLADEN_WEIGHT",
                        inputmode: "number",
                        numberType: "number"
                    },
                    "hypothecatedTo": {
                        key: "loanAccount.vehicleLoanDetails.hypothecatedTo",
                        title: "HYPOTHECATED_TO",
                        type: "select"
                    },
                    "fitnesscertifiedUpto": {
                        key: "loanAccount.vehicleLoanDetails.fitnesscertifiedUpto",
                        title: "FITNESS_CERTIFIED_UP_TO",
                        "type": "date"
                    }
                }
            },

            "permitAndTaxDetails": {
                "type": "box",
                orderNo: 60,
                "title": "PERMIT_AND_TAX_DETAILS",
                "items": {
                    "permitStatus": {
                        key: "loanAccount.vehicleLoanDetails.permitStatus",
                        title: "PERMIT_STATUS",
                        type: "select"
                    },
                    "permitValidUpto": {
                        key: "loanAccount.vehicleLoanDetails.permitValidUpto",
                        title: "PERMIT_VALID_UP_TO",
                        type: "date"
                    },
                    "operationroute": {
                        key: "loanAccount.vehicleLoanDetails.operationroute",
                        title: "OPERATION_ROUTE",
                    },
                    "taxPaid": {
                        key: "loanAccount.vehicleLoanDetails.taxPaid",
                        title: "TAX_PAID",
                        type: "select"
                    },
                    "taxValidUpto": {
                        key: "loanAccount.vehicleLoanDetails.taxValidUpto",
                        title: "TAX_VALID_UP_TO",
                        type: "date"
                    }
                }
            },

            "InsurenceDetails": {
                "type": "box",
                orderNo: 70,
                "title": "INSURENCE_DETAILS",
                "items": {
                    "insuranceCompany": {
                        key: "loanAccount.vehicleLoanDetails.insuranceCompany",
                        title: "INSURANCE_COMPANY",
                        type: "select"
                    },
                    "insurancePolicyNumber": {
                        key: "loanAccount.vehicleLoanDetails.insurancePolicyNumber",
                        title: "INSURANCE_POLICY_NUMBER",
                    },
                    "insuranceIdv": {
                        key: "loanAccount.vehicleLoanDetails.insuranceIdv",
                        title: "INSURANCE_IDV",
                        inputmode: "number",
                        numberType: "number"
                    },
                    "taxPaid": {
                        key: "loanAccount.vehicleLoanDetails.taxPaid",
                        title: "TAX_PAID",
                    },
                    "insurancevalidfrom": {
                        key: "loanAccount.vehicleLoanDetails.insurancevalidfrom",
                        type: "date",
                        title: "INSURANCE_VALID_FROM",
                    },
                    "insuranceValidTo": {
                        key: "loanAccount.vehicleLoanDetails.insuranceValidTo",
                        type: "date",
                        title: "INSURANCE_VALID_TO",
                    },
                    "insurancePolicyType": {
                        key: "loanAccount.vehicleLoanDetails.insurancePolicyType",
                        title: "INSURANCE_POLICY_TYPE"
                        // type: "select"
                    }
                }
            },

            "otherRemarks": {
                "type": "box",
                "title": "OTHER_REMARKS",
                orderNo: 80,
                "items": {
                    "modelUnderProduction": {
                        key: "loanAccount.vehicleLoanDetails.modelUnderProduction",
                        title: "MODEL_UNDER_PRODUCTION"
                    },
                    "accident": {
                        key: "loanAccount.vehicleLoanDetails.accident",
                        title: "ACCIDENT",
                        type: "radios",
                        "titleMap": {
                            true: "Yes",
                            false: "No"
                        }
                        //"enumCode":"decisionmaker"
                    },
                    "accidentRemarks": {
                        key: "loanAccount.vehicleLoanDetails.accidentRemarks",
                        condition: "model.loanAccount.vehicleLoanDetails.accident=='YES'",
                        title: "ACCIDENT_REMARKS",
                    },
                    "originalInvoiceValue": {
                        key: "loanAccount.vehicleLoanDetails.originalInvoiceValue",
                        title: "ORIGINAL_INVOICE_VALUE",
                        inputmode: "number",
                        numberType: "number"
                    },
                    "majorRepair": {
                        key: "loanAccount.vehicleLoanDetails.majorRepair",
                        title: "MAJOR_REPAIR",
                        type: "radios",
                        "titleMap": {
                            true: "Yes",
                            false: "No"
                        }
                        //"enumCode":"decisionmaker"
                    },
                    "currentInvoiceValue": {
                        key: "loanAccount.vehicleLoanDetails.currentInvoiceValue",
                        title: "CURRENT_INVOICE_VALUE",
                        inputmode: "number",
                        numberType: "tel"
                    },
                    "rcbookStatus": {
                        key: "loanAccount.vehicleLoanDetails.rcbookStatus",
                        title: "RC_BOOK_STATUS",
                        type: "radios",
                        "titleMap": {
                            true: "Yes",
                            false: "No"
                        }
                        //"enumCode":"decisionmaker"
                    }
                }
            },


            "pastValuations": {
                "type": "box",
                "title": "PAST_VALUATIONS",
                orderNo: 90,
                "items": {
                    "financier": {
                        key: "loanAccount.vehicleLoanDetails.financier",
                        title: "FINANCIER"
                    },
                    "valuationDate": {
                        key: "loanAccount.vehicleLoanDetails.valuationDate",
                        title: "VALUATION_DATE",
                        type: "date"
                    },
                    "valuation": {
                        key: "loanAccount.vehicleLoanDetails.valuation",
                        title: "VALUATION",
                    }
                }
            },

            "conditionOfAsset": {
                "type": "box",
                "title": "CONDITION_OF_ASSETS",
                orderNo: 100,
                "items": {
                    "engineCondition": {
                        orderNo: 10,
                        key: "loanAccount.vehicleLoanDetails.engineCondition",
                        title: "ENGINE_CONDITION",
                        type: "select",
                        enumCode: "vehicle_condition"
                    },
                    "engineRemarks": {
                        orderNo: 20,
                        key: "loanAccount.vehicleLoanDetails.engineRemarks",
                        title: "ENGINE_REMARKS",
                    },
                    "batteryCondition": {
                        orderNo: 30,
                        key: "loanAccount.vehicleLoanDetails.batteryCondition",
                        title: "BATTERY_CONDITION",
                        type: "select",
                        enumCode: "vehicle_condition"
                    },
                    "batteryRemarks": {
                        orderNo: 40,
                        key: "loanAccount.vehicleLoanDetails.batteryRemarks",
                        title: "BATTERY_REMARKS",
                    },
                    "chasisCondition": {
                        orderNo: 50,
                        key: "loanAccount.vehicleLoanDetails.chasisCondition",
                        title: "CHASIS_CONDITION",
                        type: "select",
                        enumCode: "vehicle_condition"
                    },
                    "chasisRemarks": {
                        orderNo: 60,
                        key: "loanAccount.vehicleLoanDetails.chasisRemarks",
                        title: "CHASIS_REMARKS",
                    },
                    "paintCondition": {
                        orderNo: 70,
                        key: "loanAccount.vehicleLoanDetails.paintCondition",
                        title: "PAINT_CONDITION",
                        type: "select",
                        enumCode: "vehicle_condition"
                    },
                    "paintRemarks": {
                        orderNo: 80,
                        key: "loanAccount.vehicleLoanDetails.paintRemarks",
                        title: "PAINT_REMARKS",
                    },
                    "upholsteryCondition": {
                        orderNo: 90,
                        key: "loanAccount.vehicleLoanDetails.upholsteryCondition",
                        title: "UPHOLSTERY_CONDITION",
                        type: "select",
                        enumCode: "vehicle_condition"
                    },
                    "upholsteryRemarks": {
                        orderNo: 100,
                        key: "loanAccount.vehicleLoanDetails.upholsteryRemarks",
                        title: "UPHOLSTERY_REMARKS",
                    },
                    "transimissionCondition": {
                        orderNo: 110,
                        key: "loanAccount.vehicleLoanDetails.transimissionCondition",
                        title: "TRANSMISSION_CONDITION",
                        type: "select",
                        enumCode: "vehicle_condition"
                    },
                    "transmissionRemarks": {
                        orderNo: 120,
                        key: "loanAccount.vehicleLoanDetails.transmissionRemarks",
                        title: "TRANSMISSION_REMARKS",
                    },
                    "electricalPartsCondition": {
                        orderNo: 130,
                        key: "loanAccount.vehicleLoanDetails.electricalPartsCondition",
                        title: "ELECTRICAL_PARTS_CONDITION",
                        type: "select",
                        enumCode: "vehicle_condition"
                    },
                    "electricalPartsRemarks": {
                        orderNo: 140,
                        key: "loanAccount.vehicleLoanDetails.electricalPartsRemarks",
                        title: "ELECTRICAL_PARTS_REMARKS",
                    },
                    "bodyCondition": {
                        orderNo: 150,
                        key: "loanAccount.vehicleLoanDetails.bodyCondition",
                        title: "BODY_CONDITION",
                        type: "select",
                        enumCode: "vehicle_condition"
                    },
                    "seatingCapacity": {
                        orderNo: 160,
                        key: "loanAccount.vehicleLoanDetails.seatingCapacity",
                        title: "SEATING_CAPACITY",
                    },
                    "suspensionCondition": {
                        orderNo: 170,
                        key: "loanAccount.vehicleLoanDetails.suspensionCondition",
                        title: "SUSPENSION_CONDITION",
                        type: "select",
                        enumCode: "vehicle_condition"
                    },
                    "tyreType": {
                        orderNo: 180,
                        key: "loanAccount.vehicleLoanDetails.tyreType",
                        title: "TYRE_TYPE",
                        type: "radios",
                        enumCode: "vehicle_tyre_type"
                    },
                    "lhFrontMake": {
                        orderNo: 190,
                        key: "loanAccount.vehicleLoanDetails.lhFrontMake",
                        title: "LH_FRONT_MAKE",
                        type: "select",
                        enumCode: "vehicle_tyre_type_make"
                    },
                    "lhFrontCondition": {
                        orderNo: 200,
                        key: "loanAccount.vehicleLoanDetails.lhFrontCondition",
                        title: "LH_FRONT_CONDITION",
                        type: "select",
                        enumCode: "vehicle_condition"
                    },
                    "rhFrontMake": {
                        orderNo: 210,
                        key: "loanAccount.vehicleLoanDetails.rhFrontMake",
                        title: "RH_FRONT_MAKE",
                        type: "select",
                        enumCode: "vehicle_tyre_type_make"
                    },
                    "rhFrontCondition": {
                        orderNo: 220,
                        key: "loanAccount.vehicleLoanDetails.rhFrontCondition",
                        title: "RH_FRONT_CONDITION",
                        type: "select",
                        enumCode: "vehicle_condition"
                    },
                    "lhRearMake": {
                        orderNo: 230,
                        key: "loanAccount.vehicleLoanDetails.lhRearMake",
                        title: "LH_REAR_MAKE",
                        type: "select",
                        enumCode: "vehicle_tyre_type_make"
                    },
                    "lhRearCondition": {
                        orderNo: 0,
                        key: "loanAccount.vehicleLoanDetails.lhRearCondition",
                        title: "LH_REAR_CONDITION",
                        type: "select",
                        enumCode: "vehicle_condition"
                    },
                    "rhRearMake": {
                        orderNo: 10,
                        key: "loanAccount.vehicleLoanDetails.rhRearMake",
                        title: "RH_REAR_MAKE",
                        type: "select",
                        enumCode: "vehicle_tyre_type_make"
                    },
                    "rhrearCondition": {
                        orderNo: 10,
                        key: "loanAccount.vehicleLoanDetails.rhrearCondition",
                        title: "RH_REAR_CONDITION",
                        type: "select",
                        enumCode: "vehicle_condition"
                    },
                    "tyreRemarks": {
                        orderNo: 10,
                        key: "loanAccount.vehicleLoanDetails.tyreRemarks",
                        title: "TYRE_REMARKS",
                    },
                    "fogLampCondition": {
                        orderNo: 10,
                        key: "loanAccount.vehicleLoanDetails.fogLampCondition",
                        title: "FOG_LAMP_CONDITION",
                        type: "select",
                        enumCode: "vehicle_condition"
                    },
                    "fogLampRemarks": {
                        orderNo: 10,
                        key: "loanAccount.vehicleLoanDetails.fogLampRemarks",
                        title: "FOG_LAMP_REMARKS"
                    },
                    "gearBoxCondition": {
                        orderNo: 10,
                        key: "loanAccount.vehicleLoanDetails.gearBoxCondition",
                        title: "GEAR_BOX_CONDITION",
                        type: "select",
                        enumCode: "vehicle_condition"
                    },
                    "gearBoxremarks": {
                        orderNo: 10,
                        key: "loanAccount.vehicleLoanDetails.gearBoxremarks",
                        title: "GEAR_BOX_REMARKS"
                    },
                    "steeringCondiiton": {
                        orderNo: 10,
                        key: "loanAccount.vehicleLoanDetails.steeringCondiiton",
                        title: "STEERING_CONDITION",
                        type: "select",
                        enumCode: "vehicle_condition"
                    },
                    "steeringRemarks": {
                        orderNo: 10,
                        key: "loanAccount.vehicleLoanDetails.steeringRemarks",
                        title: "STEERING_REMARKS",
                    },
                    "lightWiringCondition": {
                        orderNo: 10,
                        key: "loanAccount.vehicleLoanDetails.lightWiringCondition",
                        title: "LIGHT_WIRING_CONDITION",
                        type: "select",
                        enumCode: "vehicle_condition"
                    },
                    "lightWiringRemarks": {
                        orderNo: 10,
                        key: "loanAccount.vehicleLoanDetails.lightWiringRemarks",
                        title: "LIGHT_WIRING_REMARKS",
                    }
                }
            },

            "Accessories": {
                "type": "box",
                orderNo: 110,
                "title": "ACCESSORIES",
                "items": {
                    "powerWindowFont": {
                        key: "loanAccount.vehicleLoanDetails.powerWindowFont",
                        title: "POWER_WINDOW_FRONT",
                        type: "radios",
                        "titleMap": {
                            1: "Yes",
                            0: "No"
                        }
                        //"enumCode":"decisionmaker"
                    },
                    "powerWindowRear": {
                        key: "loanAccount.vehicleLoanDetails.powerWindowRear",
                        title: "POWER_WINDOW_REAR",
                        type: "radios",
                        "titleMap": {
                            1: "Yes",
                            0: "No"
                        }
                        //"enumCode":"decisionmaker"
                    },
                    "powerSteering": {
                        key: "loanAccount.vehicleLoanDetails.powerSteering",
                        title: "POWER_STEERING",
                        type: "radios",
                        "titleMap": {
                            1: "Yes",
                            0: "No"
                        }
                        //"enumCode":"decisionmaker"
                    },
                    "airbag": {
                        key: "loanAccount.vehicleLoanDetails.airbag",
                        title: "AIR_BAG_SYSTEM",
                        type: "radios",
                        "titleMap": {
                            1: "Yes",
                            0: "No"
                        }
                        //"enumCode":"decisionmaker"
                    },
                    "accessories": {
                        key: "loanAccount.vehicleLoanDetails.accessories",
                        title: "ACCESSORIES",
                        type: "select",
                        enumCode: "vehicle_accessory"
                    },
                    "accessoriesStatus": {
                        key: "loanAccount.vehicleLoanDetails.accessoriesStatus",
                        title: "ACCESSORIES_STATUS",
                        type: "radios",
                        "titleMap": {
                            1: "Yes",
                            0: "No"
                        }
                        //"enumCode":"decisionmaker"
                    }
                }
            },

            "Valuation": {
                "type": "box",
                orderNo: 120,
                "title": "VALUATION",
                "items": {
                    "valuationRating": {
                        key: "loanAccount.vehicleLoanDetails.valuationRating",
                        type: "select",
                        enumCode: "vehicle_condition",
                        title: "VALUATION_RATING"
                    },
                    "futureLife": {
                        key: "loanAccount.vehicleLoanDetails.futureLife",
                        title: "EXPECTED_FUTURE_LIFE_OF_VEHICLE",
                        inputmode: "number",
                        numberType: "tel"
                    },
                    "currentMarketValue": {
                        key: "loanAccount.vehicleLoanDetails.currentMarketValue",
                        title: "MARKET_VALUE_AS_ON_DATE_OF_INSPECTION",
                        inputmode: "number",
                        numberType: "tel"
                    },
                    "distressValue": {
                        key: "loanAccount.vehicleLoanDetails.distressValue",
                        title: "DISTRESS_VALUE",
                        inputmode: "number",
                        numberType: "tel"
                    }
                }
            },

            "photoCapture": {
                "type": "box",
                orderNo: 120,
                "title": "VALUATION",
                "items": {
                    "Image1": {
                        "type": "fieldset",
                        "title": "IMAGE_1",
                        "items": {
                            "photoType1": {
                                key: "loanAccount.vehicleLoanDetails.photoType1",
                                title: "PHOTO_TYPE"
                            },
                            "photoFileId1": {
                                key: "loanAccount.vehicleLoanDetails.photoFileId1",
                                title: "IMAGE_1",
                                "type": "file",
                                "fileType": "image/*",
                                "category": "Loan",
                                "subCategory": "COLLATERALPHOTO"
                            },
                            "photoRemarks1": {
                                key: "loanAccount.vehicleLoanDetails.photoRemarks1",
                                title: "REMARKS"
                            }
                        }
                    },
                    "Image2": {
                        "type": "fieldset",
                        "title": "IMAGE_2",
                        "items": {
                            "photoType2": {
                                key: "loanAccount.vehicleLoanDetails.photoType2",
                                title: "PHOTO_TYPE"
                            },
                            "photoFileId2": {
                                key: "loanAccount.vehicleLoanDetails.photoFileId2",
                                title: "IMAGE_2",
                                "type": "file",
                                "fileType": "image/*",
                                "category": "Loan",
                                "subCategory": "COLLATERALPHOTO"
                            },
                            "photoRemarks2": {
                                key: "loanAccount.vehicleLoanDetails.photoRemarks2",
                                title: "REMARKS"
                            }
                        }
                    },
                    "Image3": {
                        "type": "fieldset",
                        "title": "IMAGE_3",
                        "items": {
                            "photoType3": {
                                key: "loanAccount.vehicleLoanDetails.photoType3",
                                title: "PHOTO_TYPE"
                            },
                            "photoFileId3": {
                                key: "loanAccount.vehicleLoanDetails.photoFileId3",
                                title: "IMAGE_3",
                                "type": "file",
                                "fileType": "image/*",
                                "category": "Loan",
                                "subCategory": "COLLATERALPHOTO"
                            },
                            "photoRemarks3": {
                                key: "loanAccount.vehicleLoanDetails.photoRemarks3",
                                title: "REMARKS"
                            }
                        }
                    },
                    "Image4": {
                        "type": "fieldset",
                        "title": "IMAGE_4",
                        "items": {
                            "photoType4": {
                                key: "loanAccount.vehicleLoanDetails.photoType4",
                                title: "PHOTO_TYPE"
                            },
                            "photoFileId4": {
                                key: "loanAccount.vehicleLoanDetails.photoFileId4",
                                title: "IMAGE_4",
                                "type": "file",
                                "fileType": "image/*",
                                "category": "Loan",
                                "subCategory": "COLLATERALPHOTO"
                            },
                            "photoRemarks4": {
                                key: "loanAccount.vehicleLoanDetails.photoRemarks4",
                                title: "REMARKS"
                            }
                        }
                    }
                }
            },

            "Recomendation": {
                "type": "box",
                orderNo: 130,
                "title": "RECOMENDATION",
                "items": {
                    "recommendationStatus": {
                        key: "loanAccount.vehicleLoanDetails.recommendationStatus",
                        title: "RECOMMENDATION_STATUS"
                    },
                    "recommendationDate": {
                        key: "loanAccount.vehicleLoanDetails.recommendationDate",
                        title: "RECOMMENDATION_DATE",
                        type: "date",
                    },
                    "recommendationRemarks": {
                        key: "loanAccount.vehicleLoanDetails.recommendationRemarks",
                        title: "RECOMMENDATION_REMARKS"
                    }
                }
            },


            "actionbox": {
                "type": "actionbox",
                orderNo: 131,
                //"condition": "model.customer.id",
                "items": {
                    "submit": {
                        "type": "submit",
                        "title": "SUBMIT"
                    },
                    "save": {
                        "type": "save",
                        "title": "OFFLINE_SAVE"
                    },
                }
            }
        };


        return {
            getFormDefinition: function (formName, formRequest, configFile, model) {
                if (arguments.callee.caller.name !== 'buildFormDefinition'){
                    console.error('DVARA ERROR: Use buildFormDefinition (which returns a promise). getFormDefinition is deprecated, some features may not work as expected.');
                }

                var form = [],
                    keys, formRepo;
                var resolvers = []
                if(typeof formName === 'string') {
                    if (Object.keys(formRepository).indexOf(formName) === -1)
                        return form;
                    formRepo = _.cloneDeep(formRepository[formName]);
                } else {
                    formRepo = _.cloneDeep(formName);
                }

                // Add repoAdditions if any
                if (formRequest.options && formRequest.options.repositoryAdditions){
                    formRepo = _.merge(formRepo, formRequest.options.repositoryAdditions);
                }

                if (!formRequest || !_.isObject(formRequest)) {
                    return form;
                }
                keys = Object.keys(formRequest);
                if (!keys || keys.length < 0 || keys.indexOf("overrides") === -1 || keys.indexOf("includes") === -1 || keys.indexOf("excludes") === -1) {
                    return form;
                }
                var includes = formRequest.includes || [];
                var excludes = formRequest.excludes || [];
                var overrides = formRequest.overrides || {};
                var options = formRequest.options || {};

                if (_.isObject(configFile)) {
                    var configKeys = Object.keys(configFile)
                    for (var i = 0; i < configKeys.length; i++) {
                        var _k = jsonPath(model, configKeys[i])[0];
                        if (!_k){
                            continue;
                        }
                        var configObject = jsonPath(configFile[configKeys[i]], _k)[0];

                        if (_.hasIn(configObject, "excludes")) {
                            configObject.excludes.map(function (v) {
                                excludes.push(v);
                            });

                        }
                        if (_.hasIn(configObject, "overrides")) {
                            overrides = _.merge(overrides, configObject.overrides);
                        }
                        if (_.hasIn(configObject, "options")) {
                            options = _.merge(options, configObject.options);
                        }

                    }
                }


                var getKeyString = function (parentKey, key) {
                    if (!parentKey || parentKey === "") {
                        return key;
                    }
                    return parentKey + "." + key;
                }
                var orderFormItems = function (objA, objB) {
                    if (_.isUndefined(objA.orderNo) && !_.isUndefined(objB.orderNo)) return 1;
                    if (!_.isUndefined(objA.orderNo) && _.isUndefined(objB.orderNo)) return -1;
                    if (_.isUndefined(objA.orderNo) && _.isUndefined(objB.orderNo)) return 0;
                    return (objA.orderNo - objB.orderNo);
                }
                var constructForm = function (repo, form, parent, main) {
                    var keylist = Object.keys(repo);
                    var _defn, _key, _items;
                    var _parentKey = parent ? parent : "";

                    for (var itr = 0; itr < keylist.length; itr++) {

                        _key = getKeyString(_parentKey, keylist[itr]);
                        if ((main && includes.indexOf(_key) === -1) || excludes.indexOf(_key) > -1) {
                            //if this is the outermost level of form definition, then include is mandatory
                            //All the excludes are not processed.
                            continue;
                        }

                        if (overrides[_key]) {
                            _defn = _.merge({}, repo[keylist[itr]], overrides[_key]);
                        } else {
                            _defn = _.merge({}, repo[keylist[itr]]);
                        }

                        /**
                         * Check for resolves in the element. If so, attach data to element.
                         */
                        if(_.hasIn(_defn, 'resolver')) {
                            var obj = {
                                'resolver':_defn.resolver,
                                'item': _defn
                            };
                            resolvers.push(obj);
                        }
                        if (_defn.items) {

                            _items = _.merge({}, _defn.items);

                            if (_defn.itemAdditions){
                                _defn.items = _defn.itemAdditions;
                            } else {
                                _defn.items = [];
                            }

                            constructForm(_items, _defn.items, _key, true);
                        }
                        form.push(_defn);

                    }
                    form.sort(orderFormItems);
                }


                var getPropertyFromFormRepo = function(path) {
                    var arr = path.split('.')
                    var obj = formRepo;
                    if (arr.length > 1) arr = arr.join('.items.').split('.');
                    while (arr.length) {
                        obj = obj[arr.shift()];
                    }
                    return obj;
                }

                var processItems = function(items) {
                    var transformedItems = [];
                    var tmp;
                    for (var i = 0; i < items.length; i++) {
                        if (_.isString(items[i])) {
                            tmp = getPropertyFromFormRepo(items[i]);
                            if(tmp) {
                                if(tmp.items) {
                                   tmp.items = processItems(tmp.items);
                                }

                                if (overrides[items[i]]) {
                                    _defn = _.merge({}, tmp, overrides[items[i]]);
                                } else {
                                    _defn = _.merge({}, tmp);
                                }

                                if(_.hasIn(_defn, 'resolver')) {
                                    var obj = {
                                        'resolver':_defn.resolver,
                                        'item': _defn
                                    };
                                    resolvers.push(obj);
                                }

                                transformedItems.push(_defn);
                            }
                        } else if (_.isObject(items[i])){

                            if(items[i].items) {
                                items[i].items = processItems(items[i].items);
                            }

                            if (items[i].targetID) {
                                tmp = getPropertyFromFormRepo(items[i].targetID);
                                if (!tmp){
                                    throw new Error("Cannot find the targetID :: '" + items[i].targetID + "'");
                                }

                                if (tmp.items){
                                    tmp.itemAdditions = tmp.itemAdditions || [];
                                    tmp.itemAdditions = _.concat([], items[i].items);
                                }
                            }
                            transformedItems.push(items[i]);
                        }
                    }
                    return transformedItems;
                }

                if(options.additions && _.isArray(options.additions)) {
                    var additionalFields = processItems(options.additions);
                    form = form.concat(additionalFields);
                }

                constructForm(formRepo, form, undefined, true);


                if (resolvers && resolvers.length > 0){
                    var deferred = $q.defer();
                    var resolverCountA = resolvers.length || 0;
                    var resolverCountB = 0;
                    form.promise = null;
                    _.forEach(resolvers, function(val, key) {
                        form.promise = deferred.promise;
                        var resolver = val.resolver;
                        var pageDefPath = "perdix/ui/configresolver/" + val.item.type + "/" + resolver;
                        require([pageDefPath], function(tsObject) {

                            var obj = new tsObject[resolver]();
                            _.defaults(val.item, obj);
                            resolverCountB++;
                            if (resolverCountB >= resolverCountA){
                                deferred.resolve();
                            }
                        },function(err){
                            $log.info("[REQUIRE] Error loading page(" + pageDefPath + ")");
                            $log.error(err);
                            deferred.reject(err);
                        });
                    });
                }


                return form;
            },
            buildFormDefinition: function(formName, formRequest, configFile, model) {
                var form = this.getFormDefinition(formName, formRequest, configFile, model);
                var deferred = $q.defer();
                if (form.promise){
                    form.promise
                        .then(function(){
                            deferred.resolve(form);
                        }, function(e){
                            deferred.reject(e)
                        })
                } else  {
                    deferred.resolve(form);
                }

                return deferred.promise;
            }
        }
    }
]);
