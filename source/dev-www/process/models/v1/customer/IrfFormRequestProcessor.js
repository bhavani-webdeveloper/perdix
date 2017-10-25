irf.pageCollection.factory("IrfFormRequestProcessor", ['$log', '$filter', 'Enrollment', "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries",
    function($log, $filter, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage, PageHelper, Utils, BiometricService, PagesDefinition, Queries) {
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
                        // "offline": true
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
                        parentEnumCode: "branch_id",
                        parentValueExpr: "model.customer.customerBranchId",
                    },
                    "centreId": {
                        orderNo: 40,
                        key: "customer.centreId",
                        "required": true,
                        type: "select",
                        parentEnumCode: "branch_id",
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
                        "onChange": function(modelValue, form, model) {
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
                        "onChange": function(modelValue, form, model) {
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
                        condition: "model.customer.maritalStatus==='MARRIED' || model.customer.maritalStatus === 'WIDOWER'",
                        type: "qrcode",
                        onCapture: function(result, model, form) {
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
                        "onChange": function(modelValue, form, model) {
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
                        "onChange": function(modelValue, form, model) {
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
                    "CustomerResidentialAddress": {
                        type: "fieldset",
                        title: "CUSTOMER_RESIDENTIAL_ADDRESS",
                        items: {
                            "mobilePhone": {
                                orderNo: 10,
                                key: "customer.mobilePhone",
                            },
                            "landLineNo": {
                                orderNo: 20,
                                key: "customer.landLineNo",
                            },
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
                                fieldType: "number",
                                autolov: true,
                                inputMap: {
                                    "pincode": "customer.pincode",
                                    "division": "customer.locality",
                                    "region": "customer.villageName",
                                    "taluk" : "customer.taluk",
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
                                initialize: function(inputModel) {
                                    $log.warn('in pincode initialize');
                                    $log.info(inputModel);
                                },
                                search: function(inputModel, form, model) {
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
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.division + ', ' + item.region,
                                        item.pincode,
                                        item.district + ', ' + item.state,
                                    ];
                                },
                                onSelect: function(result, model, context) {
                                    $log.info(result);
                                }
                            },
                            "locality": {
                                readonly:true,
                                orderNo: 70,
                                key: "customer.locality",
                            },
                            "villageName": {
                                orderNo: 80,
                                readonly:true,
                                key: "customer.villageName",
                                screenFilter: true
                            },
                            "district": {
                                orderNo: 90,
                                readonly:true,
                                key: "customer.district",
                                screenFilter: true
                            },
                            "state": {
                                orderNo: 100,
                                readonly:true,
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
                                key: "customer.udf.userDefinedFieldValues.udf2",
                                "type": "string",
                            },
                        }
                    },
                    "CustomerPermanentAddress": {
                        type: "fieldset",
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
                            "mailingPincode": {
                                orderNo: 30,
                                key: "customer.mailingPincode",
                                type: "lov",
                                fieldType: "string",
                                autolov: true,
                                inputMap: {
                                    "mailingPincode": "customer.mailingPincode",
                                    "mailingDivision": "customer.mailingLocality",
                                    "mailingtaluk" : "customer.mailingtaluk",
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
                                initialize: function(inputModel) {
                                    $log.warn('in pincode initialize');
                                    $log.info(inputModel);
                                    inputModel.region = undefined;
                                },
                                search: function(inputModel, form, model) {
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
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.division + ', ' + item.region,
                                        item.pincode,
                                        item.district + ', ' + item.state
                                    ];
                                },
                                onSelect: function(result, model, context) {
                                    model.customer.mailingPincode = (new Number(result.pincode)).toString();
                                    model.customer.mailingLocality = result.division;
                                    model.customer.mailingState = result.state;
                                    model.customer.mailingDistrict = result.district;
                                }
                            },
                            "mailingLocality": {
                                orderNo: 40,
                                readonly:true,
                                key: "customer.mailingLocality",
                            },
                            "mailingPostoffice": {
                                orderNo: 50,
                                key: "customer.mailingPostoffice",
                            },
                            "mailingDistrict": {
                                orderNo: 60,
                                readonly:true,
                                key: "customer.mailingDistrict",
                                type: "select",
                                screenFilter: true
                            },
                            "mailingState": {
                                orderNo: 70,
                                readonly:true,
                                key: "customer.mailingState",
                                screenFilter: true
                            },
                            "landLordName": {
                                "title": "IF_HOUSE_RENTED_NAME_OF_LANDLORD",
                                orderNo: 71,
                                key: "customer.udf.userDefinedFieldValues.udf38",
                                "type": "string",
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
                                fileType:"application/pdf",
                                using: "scanner"
                            },
                            "identityProofReverseImageId": {
                                key: "customer.identityProofReverseImageId",
                                type: "file",
                                fileType:"application/pdf",
                                using: "scanner"
                            },
                            "identityProofNo": {
                                key: "customer.identityProofNo",
                                type:"qrcode",
                                condition: "model.customer.identityProof == 'Aadhar Card'",
                                schema: {
                                    "pattern": "^[2-9]{1}[0-9]{11}$",
                                    "type": ["string","null"],
                                },
                                onCapture: function(result, model, form) {
                                    $log.info(result);
                                    model.customer.identityProofNo = result.text;
                                }
                            },
                            "identityProofNo1": {
                                key: "customer.identityProofNo",
                                type:"qrcode",
                                condition: "model.customer.identityProof == 'Pan Card'",
                                schema: {
                                    "pattern": "[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}",
                                    "type": ["string","null"],
                                },
                                onCapture: function(result, model, form) {
                                    $log.info(result);
                                    model.customer.identityProofNo = result.text;
                                }
                            },
                            "identityProofNo2": {
                                key: "customer.identityProofNo",
                                type:"qrcode",
                                condition: "model.customer.identityProof == 'Passport'",
                                schema: {
                                    "pattern": "^([A-PR-WY]){1}([1-9]){1}([0-9]){5}([1-9]){1}$",
                                    "type": ["string","null"],
                                },
                                onCapture: function(result, model, form) {
                                    $log.info(result);
                                    model.customer.identityProofNo = result.text;
                                }
                            },
                            "identityProofNo3": {
                                key: "customer.identityProofNo",
                                type:"qrcode",
                                condition: "model.customer.identityProof !== 'Aadhar Card' && model.customer.identityProof !== 'Pan Card' && model.customer.identityProof !== 'Passport'",
                                // "pattern": ".*", 
                                onCapture: function(result, model, form) {
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
                                condition:"model.customer.identityProof != 'Pan Card'"
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
                                fileType:"application/pdf",
                                using: "scanner",
                                //"offline": true
                            },
                            "addressProofReverseImageId": {
                                key: "customer.addressProofReverseImageId",
                                type: "file",
                                fileType:"application/pdf",
                                using: "scanner",
                                "offline": true
                            },
                            "addressProofNo": {
                                key: "customer.addressProofNo",
                                type: "barcode",
                                condition: "model.customer.addressProof == 'Aadhar Card'",
                                schema: {
                                    "pattern": "^[2-9]{1}[0-9]{11}$",
                                    "type": ["string","null"], 
                                },
                                onCapture: function(result, model, form) {
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
                                    "type": ["string","null"],
                                },
                                onCapture: function(result, model, form) {
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
                                    "type": ["string","null"],
                                },
                                onCapture: function(result, model, form) {
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
                        condition: "model.customer.maritalStatus==='MARRIED'",
                        items: {
                            "udf33": {
                                key: "customer.udf.userDefinedFieldValues.udf33",
                                type: "select",
                                onChange: function(modelValue) {
                                    $log.info(modelValue);
                                }
                            },
                            "udf34": {
                                key: "customer.udf.userDefinedFieldValues.udf34",
                                type: "file",
                                fileType:"application/pdf",
                                using: "scanner",
                            },
                            "udf35": {
                                key: "customer.udf.userDefinedFieldValues.udf35",
                                type: "file",
                                fileType:"application/pdf",
                                using: "scanner",
                            },
                            "udf36": {
                                key: "customer.udf.userDefinedFieldValues.udf36",
                                condition: "model.customer.udf.userDefinedFieldValues.udf33 != 'Aadhar Card'",
                                //type: "barcode",
                                onCapture: function(result, model, form) {
                                    $log.info(result); // spouse id proof
                                    model.customer.udf.userDefinedFieldValues.udf36 = result.text;
                                }
                            },
                            "udf36_1": {
                                key: "customer.udf.userDefinedFieldValues.udf36",
                                condition: "model.customer.udf.userDefinedFieldValues.udf33 == 'Aadhar Card'",
                                //type: "qrcode",
                                onCapture: function(result, model, form) {
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
                        "add": null,
                        "remove": null,
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
                                fileType:"application/pdf",
                                using: "scanner"
                            },
                            "kyc1ProofNumber": {
                                key: "customer.additionalKYCs[].kyc1ProofNumber",
                                type: "barcode",
                                condition: "model.customer.additionalKYCs[arrayIndex].kyc1ProofType == 'Aadhar Card'",
                                schema: {
                                    "pattern": "^[2-9]{1}[0-9]{11}$",
                                    "type": ["string","null"],
                                },
                                onCapture: function(result, model, form) {
                                    $log.info(result);
                                    model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                                }
                            },
                            "kyc1ProofNumber1": {
                                key: "customer.additionalKYCs[].kyc1ProofNumber",
                                type: "barcode",
                                condition: "model.customer.additionalKYCs[arrayIndex].kyc1ProofType == 'Pan Card'",
                                 schema: {
                                    "pattern": "[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}",
                                    "type": ["string","null"],
                                },
                                onCapture: function(result, model, form) {
                                    $log.info(result);
                                    model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                                }
                            },
                            "kyc1ProofNumber2": {
                                key: "customer.additionalKYCs[].kyc1ProofNumber",
                                type: "barcode",
                                condition: "model.customer.additionalKYCs[arrayIndex].kyc1ProofType == 'Passport'",
                                schema: {
                                    "pattern": "^([A-PR-WY]){1}([1-9]){1}([0-9]){5}([1-9]){1}$",
                                    "type": ["string","null"],
                                },
                                onCapture: function(result, model, form) {
                                    $log.info(result);
                                    model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                                }
                            },
                            "kyc1ProofNumber3": {
                                key: "customer.additionalKYCs[].kyc1ProofNumber",
                                type: "barcode",
                                condition: "model.customer.additionalKYCs[arrayIndex].kyc1ProofType !== 'Aadhar Card' && model.customer.additionalKYCs[arrayIndex].kyc1ProofType !== 'Pan Card' && model.customer.additionalKYCs[arrayIndex].kyc1ProofType !== 'Passport'",
                                onCapture: function(result, model, form) {
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
                                onCapture: function(result, model, form) {
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
                                type: "select",
                                title: "T_RELATIONSHIP",
                                "onChange": function(modelValue, form, model, formCtrl, event) {
                                    if(model.customer.familyMembers[form.arrayIndex].relationShip == 'self') {
                                        model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender;
                                        model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.dateOfBirth;
                                        model.customer.familyMembers[form.arrayIndex].age = model.customer.age;
                                        model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                                    } 
                                    else {
                                        model.customer.familyMembers[form.arrayIndex].dateOfBirth = undefined;
                                        model.customer.familyMembers[form.arrayIndex].age = undefined;
                                        model.customer.familyMembers[form.arrayIndex].maritalStatus = undefined;
                                        model.customer.familyMembers[form.arrayIndex].gender = undefined;
                                        if(model.customer.familyMembers[form.arrayIndex].relationShip == 'Father' || model.customer.familyMembers[form.arrayIndex].relationShip == 'Father-In-Law') {
                                            model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.fatherFirstName;
                                        }
                                        else if(model.customer.familyMembers[form.arrayIndex].relationShip == "Husband" || model.customer.familyMembers[form.arrayIndex].relationShip == "Wife") {
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
                                "search": function(inputModel, form) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = Enrollment.search({
                                        'branchName': inputModel.branchName || SessionStore.getBranch(),
                                        'firstName': inputModel.firstName,
                                    }).$promise;
                                    return promise;
                                },
                                onSelect: function(valueObj, model, context) {
                                    var rowIndex = context.arrayIndex;
                                    PageHelper.showLoader();
                                    Enrollment.getCustomerById({
                                        id: valueObj.id
                                    }, function(resp, header) {

                                        model.customer.familyMembers[rowIndex].gender = resp.gender;
                                        model.customer.familyMembers[rowIndex].dateOfBirth = resp.dateOfBirth;
                                        model.customer.familyMembers[rowIndex].maritalStatus = resp.maritalStatus;
                                        model.customer.familyMembers[rowIndex].age = moment().diff(moment(resp.dateOfBirth), 'years');
                                        model.customer.familyMembers[rowIndex].mobilePhone = resp.mobilePhone;
                                        model.customer.familyMembers[rowIndex].relationShip = "";

                                        var selfIndex = _.findIndex(resp.familyMembers, function(o) {
                                            return o.relationShip.toUpperCase() == 'SELF'
                                        });

                                        if (selfIndex != -1) {
                                            model.customer.familyMembers[rowIndex].healthStatus = resp.familyMembers[selfIndex].healthStatus;
                                            model.customer.familyMembers[rowIndex].educationStatus = resp.familyMembers[selfIndex].educationStatus;
                                        }
                                        PageHelper.hideLoader();
                                        irfProgressMessage.pop("cust-load", "Load Complete", 2000);
                                    }, function(resp) {
                                        PageHelper.hideLoader();
                                        irfProgressMessage.pop("cust-load", "An Error Occurred. Failed to fetch Data", 5000);

                                    });

                                },
                                getListDisplayItem: function(data, index) {
                                    return [
                                        [data.firstName, data.fatherFirstName].join(' '),
                                        data.id
                                    ];
                                }
                            },
                            "familyMemberFirstName": {
                                key: "customer.familyMembers[].familyMemberFirstName",
                                condition: "model.customer.familyMembers[arrayIndex].relationShip !== 'self'",
                                title: "FAMILY_MEMBER_FULL_NAME"                             
                            },
                            "gender": {
                                key: "customer.familyMembers[].gender",
                                type: "radios",
                                title: "T_GENDER"
                            },
                            "age": {
                                key: "customer.familyMembers[].age",
                                title: "AGE",
                                type: "number",
                                "onChange": function(modelValue, form, model, formCtrl, event) {
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
                                type: "date",
                                title: "T_DATEOFBIRTH",
                                "onChange": function(modelValue, form, model, formCtrl, event) {
                                    if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                        model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                    }
                                }
                            },
                            "educationStatus": {
                                key: "customer.familyMembers[].educationStatus",
                                type: "select",
                                title: "T_EDUCATION_STATUS"
                            },
                            "maritalStatus": {
                                key: "customer.familyMembers[].maritalStatus",
                                type: "select",
                                title: "T_MARITAL_STATUS"
                            },
                            "mobilePhone": {
                                key: "customer.familyMembers[].mobilePhone",
                            },
                            "healthStatus": {
                                key: "customer.familyMembers[].healthStatus",
                                type: "radios",
                                titleMap: {
                                    "GOOD": "GOOD",
                                    "BAD": "BAD"
                                },
                            },
                            "contributionToExpenditure": {
                                key: "customer.familyMembers[].contributionToExpenditure",
                                type: "amount",
                            },
                            "incomes": {
                                key: "customer.familyMembers[].incomes",
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
                        remove: null,
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
                                    "Self":"Self",
                                    "Partner" : "Partner",
                                    "Others":"Others",
                                }
                            },
                            "landOwnership": {
                                key: "customer.udf.userDefinedFieldValues.udf25",
                                orderNo: 20,
                                type: "select",
                            },
                            "cropName": {
                                key: "customer.udf.userDefinedFieldValues.udf15",
                                orderNo: 30,
                            },
                            "irrigated": {
                                key: "customer.udf.userDefinedFieldValues.udf26",
                                orderNo: 40,
                            },
                            "harvestMonth": {
                                key: "customer.udf.userDefinedFieldValues.udf27",
                                orderNo: 50,
                                type: "select"
                            },
                            "landArea": {
                                key: "customer.udf.userDefinedFieldValues.udf28",
                                orderNo: 60,
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
                                order:10,
                                key: "customer.udf.userDefinedFieldValues.udf3",
                                type: "select"

                            },
                            "buildType": {
                                order:20,
                                key: "customer.udf.userDefinedFieldValues.udf31",
                                title:"BUILD_TYPE",
                                "type": "select",
                                enumCode: "houseBuildTypes",
                                "titleMap": {
                                    "CONCRETE": "Kachha",
                                    "MUD": "Pucca",
                                    "BRICK": "Ardha Pucca"
                                }
                            },
                            "landLordName": {
                                order:30,
                                key: "customer.udf.userDefinedFieldValues.udf2",
                                //condition: "model.customer.udf.userDefinedFieldValues.udf3=='RENTED'"
                            },
                            "HouseVerification": {
                                order:40,
                                key: "customer.udf.userDefinedFieldValues.udf5",

                            },
                            // "Toilet": {
                            //     order:40,
                            //     key: "customer.udf.userDefinedFieldValues.udf6"
                            // },
                            "durationOfStay": {
                                order:50,
                                key: "customer.udf.userDefinedFieldValues.udf4",
                                type: "radios"
                            },
                            "YearsOfBusinessPresentAddress": {
                                order:60,
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
                        key: "customer.nameOfRo",
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
                            "houseNoIsVerified": {
                                key: "customer.verifications[].houseNoIsVerified"
                            },
                            "referenceFirstName": {
                                key: "customer.verifications[].referenceFirstName"
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
                                    "Health" : "Health",
                                    "Life" : "Life"
                                }
                            },
                            "ownedBy": {
                                "type": "select",
                                key: "customer.financialAssets[].udf2",
                                "title": "OWNED_BY",
                                titleMap: {
                                    "Self" : "Self",
                                    "Others" : "Other Family Members"
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
            "Liabilities1": {
                type: "box",
                orderNo: 100,
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
                            "outstandingAmountInPaisa" :{
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
                orderNo: 110,
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
            "actionbox": {
                "type": "actionbox",
                orderNo: 120,
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

        formRepository['LeadGeneration'] = { 
            "leadProfile":{
                    "type": "box",
                    "title": "LEAD_PROFILE",
                    "items": {
                        "branchName":{
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
                            search: function(inputModel, form, model, context) {
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
                            onSelect: function(valueObj, model, context) {
                                model.lead.centreName = valueObj.name;
                                model.lead.centreId = valueObj.id;
                            },
                            getListDisplayItem: function(item, index) {
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
                        "ID":{
                            key: "lead.id",
                            condition: "model.lead.id",
                            readonly: true
                        }, 
                        "urnNo":{
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
                        "leadDetails":{
                            type: "fieldset",
                            // condition: "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                            title: "LEAD_DETAILS",
                            items: {
                                "leadName":{
                                    key: "lead.leadName",
                                    title: "APPLICANT_NAME",
                                    schema: {
                                        pattern: "^[a-zA-Z\. ]+$",
                                    },
                                    validationMessage: {202 : "Only alphabets and space are allowed."},
                                }, 
                                "customerTypeString": {
                                    key: "lead.customerTypeString",
                                    type: "select",
                                    titleMap: {
                                        "Individual": "Individual",
                                        "Enterprise": "Individual and Enterprise"
                                    },
                                   readonly:true

                                }, 
                                "enterpriseDetails": {
                                    type: "fieldset",
                                    title: "ENTERPRISE_DETAILS",
                                    condition: "model.lead.customerTypeString === 'Enterprise'",
                                    items: {
                                        "businessName":{
                                            key: "lead.businessName",
                                            required: false,
                                        }, 
                                        "companyRegistered":{
                                            key: "lead.companyRegistered",
                                            type: "radios",
                                            enumCode: "decisionmaker"
                                        }, 
                                        "businessType":{
                                            key: "lead.businessType",
                                            required: false,
                                            type: "select",
                                            enumCode: "businessType"
                                        }, 
                                        "businessActivity":{
                                            key: "lead.businessActivity",
                                        //title:"BUSINESS_LINE",
                                            required: false,
                                            type: "select",
                                            enumCode: "businessActivity",
                                            parentEnumCode: "businessType"
                                        }, 
                                        "companyOperatingSince":{
                                            key: "lead.companyOperatingSince",
                                            type: "date"
                                        }, 
                                        "ownership":{
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
                                                "gender":{
                                                    key: "lead.gender",
                                                    type: "radios"
                                                }, 
                                                "dob":{
                                                    key: "lead.dob",
                                                    type: "date",
                                                    "onChange": function(modelValue, form, model) {
                                                        if (model.lead.dob) {
                                                            model.lead.age = moment().diff(moment(model.lead.dob, SessionStore.getSystemDateFormat()), 'years');
                                                        }
                                                    }
                                                }, 
                                                "age":{
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
                                                }, 
                                                "maritalStatus":{
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
                                                "educationStatus":{
                                                    key: "lead.educationStatus",
                                                    type: "select",
                                                    enumCode: "education",
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
                                },

                                "individualDetails":{
                                    type: "fieldset",
                                    title: "INDIVIDUAL_DETAILS",
                                    // condition: "model.lead.customerTypeString === 'Individual'",
                                    items: {
                                        "gender":{
                                            key: "lead.gender",
                                            type: "radios"
                                        }, 
                                        "dob":{
                                            key: "lead.dob",
                                            type: "date",
                                            "onChange": function(modelValue, form, model) {
                                                if (model.lead.dob) {
                                                    model.lead.age = moment().diff(moment(model.lead.dob, SessionStore.getSystemDateFormat()), 'years');
                                                }
                                            }
                                        }, 
                                        "age":{
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
                                        }, 
                                        "maritalStatus":{
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
                                        "educationStatus":{
                                            key: "lead.educationStatus",
                                            type: "select",
                                            enumCode: "education",
                                        /* titleMap: {
                                             "Below SSLC": "Below SSLC",
                                             "ITI/Diploma/Professional Qualification": "ITI/Diploma/ProfessionalQualification",
                                             "Graduate/Equivalent to graduate": "Graduate/Equivalent",
                                             "Post graduate&equivalent": "PostGraduate & Equivalent",
                                             "More than post graduation": "MoreThanPostGraduation",
                                         }*/
                                        },
                                        "occupation1":{
                                            key: "lead.occupation1",
                                            type: "select",
                                            enumCode: "lead_primary_occupation",
                                            /*titleMap: {
                                                
                                            }*/
                                        },
                                        "leadCategory":{
                                            key: "lead.leadCategory",
                                            type: "select",
                                            enumCode: "lead_category",
                                            /*titleMap: {
                                                
                                            }*/
                                        },
                                        "licenseType":{
                                            key: "lead.licenseType",
                                            type: "select",
                                            enumCode: "licence_type",
                                            /*titleMap: {
                                                
                                            }*/
                                        }

                                    }
                                },

                                "contactDetails":{
                                    type: "fieldset",
                                    title: "CONTACT_DETAILS",
                                    condition: "model.lead.customerTypeString === 'Individual'||model.lead.customerTypeString === 'Enterprise'",
                                    items: {
                                        "mobileNo":{
                                            key: "lead.mobileNo",
                                        }, 
                                        "alternateMobileNo":{
                                            key: "lead.alternateMobileNo",
                                        }, 
                                        "addressLine1":{
                                            key: "lead.addressLine1",
                                            "title": "DOOR_NO"
                                        }, 
                                        "addressLine2":{
                                            key: "lead.addressLine2",
                                            "title": "STREET"
                                        }, 
                                        "pincode":{
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
                                        "area":{
                                            "key": "lead.area",
                                            "readonly": true
                                        }, 
                                        "cityTownVillage":{
                                            "key": "lead.cityTownVillage",
                                            "readonly": true
                                        }, 
                                        "district":{
                                            "key": "lead.district",
                                            "readonly": true
                                        }, 
                                        "state":{
                                            "key": "lead.state",
                                            "readonly": true
                                        }
                                    }
                                },
                            }
                        }
                    }
                },
                "sourceDetails": {
                    type: "box",
                    title: "SOURCE_DETAILS",
                    items: {
                        "leadSource": {
                            "key":"lead.leadSource",
                            "type": "select",
                            "enumCode": "lead_source",
                        },
                        "referredBy": {
                            "key":"lead.referredBy",
                            "condition":"model.lead.leadSource=='Existing Customer Referral'",
                            "type": "lov",
                            "autolov": true,
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
                                "centreId":{
                                    key: "lead.centreId",
                                    type: "lov",
                                    autolov: true,
                                    lovonly: true,
                                    bindMap: {},
                                    searchHelper: formHelper,
                                    search: function(inputModel, form, model, context) {
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
                                                            id:centreCode[i].value
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
                                    onSelect: function(valueObj, model, context) {
                                        model.lead.centreId = valueObj.id;
                                        model.lead.centreName = valueObj.name;
                                    },
                                    getListDisplayItem: function(item, index) {
                                        return [
                                            item.name
                                        ];
                                    }
                                },
                            },
                            "outputMap": {
                                
                                "firstName":"lead.referredBy"
                            },
                            "searchHelper": formHelper,
                            "search": function(inputModel, form) {
                                $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                var branches = formHelper.enum('branch_id').data;
                                var branchName;
                                for (var i=0; i<branches.length;i++){
                                    if(branches[i].code==inputModel.customerBranchId)
                                        branchName = branches[i].name;
                                }
                                var promise = Enrollment.search({
                                    'branchName': branchName ||SessionStore.getBranch(),
                                    'firstName': inputModel.firstName,
                                    'centreId':inputModel.centreId,
                                    'customerType':"individual",
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
                            onSelect: function(valueObj, model, context){
                              
                            }

                        },
                        "agentName": {
                            "key":"lead.agentName",
                            "condition":"model.lead.leadSource=='Buying/Selling Agent'"

                        },
                        "dealerName": {
                            "key":"lead.dealerName",
                            "condition":"model.lead.leadSource=='Dealer'"
                        }

                    }
                },
                "productDetails":{
                    type: "box",
                    title: "PRODUCT_DETAILS",
                    // condition: "model.siteCode !== 'sambandh' && model.siteCode !== 'saija'",
                    items: {
                        "interestedInProduct":{
                            key: "lead.interestedInProduct",
                            title: "INTERESTED_IN_LOAN_PRODUCT",
                            type: "select",
                            required: true,
                            enumCode: "decisionmaker",
                            "onChange": function(modelValue, form, model) {
                                    if (model.lead.interestedInProduct == 'NO' || model.lead.eligibleForProduct == 'NO') {
                                        model.lead.leadStatus = "Reject";
                                    } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == 'In this week') {
                                        model.lead.leadStatus = "Screening";
                                    } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == 'In this month' || model.lead.productRequiredBy == 'Next 2 -3 months' || model.lead.productRequiredBy == 'Next 4-6 months') {
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
                        "loanAmountRequested":{
                            key: "lead.loanAmountRequested",
                            
                            condition: "model.lead.interestedInProduct==='YES'",
                            
                        }, 
                        "loanPurpose1":{
                            key: "lead.loanPurpose1",
                            condition: "model.lead.interestedInProduct==='YES'&& model.lead.productSubCategory !== 'investment'",
                            type: "select",
                            enumCode: "vehicle_loan_purpose"
                                /*titleMap: {
                                    
                                }*/
                        }, 
                        "loanPurpose2":{
                            key: "lead.loanPurpose2",
                            condition: "model.lead.interestedInProduct==='YES' && model.lead.loanPurpose1 == 'Personal Loan'",
                            type: "select",
                            enumCode: "vehicle_loan_sub_purpose"
                                /*titleMap: {
                                    

                                }*/
                        }, 
                        "productRequiredBy":{
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
                        }, 
                        "screeningDate":{
                            key: "lead.screeningDate",
                            condition: "(model.lead.interestedInProduct==='YES' && model.lead.productRequiredBy ==='In this week')",
                            type: "date",
                            onChange: "actions.changeStatus(modelValue, form, model)"
                        }, 
                        "followUpDate":{
                            key: "lead.followUpDate",
                            condition: "(model.lead.interestedInProduct==='YES' && model.lead.productRequiredBy =='In this month'||model.lead.productRequiredBy =='Next 2 -3 months'||model.lead.productRequiredBy =='Next 4-6 months')",
                            type: "date",
                            onChange: "actions.changeStatus(modelValue, form, model)"
                        }, 
                        "productEligibility":{
                            type: "fieldset",
                            condition: "model.lead.interestedInProduct==='YES'",
                            title: "PRODUCT_ELIGIBILITY",
                            items: {
                                "eligibleForProduct":{
                                    key: "lead.eligibleForProduct",
                                    type: "radios",
                                    enumCode: "decisionmaker",
                                    onChange: "actions.changeStatus(modelValue, form, model)",
                                }
                            }
                        }, 
                        "productRejectionReason":{
                            type: "fieldset",
                            title: "PRODUCT_REJECTION_REASON",
                            condition: "model.lead.interestedInProduct==='NO'||model.lead.eligibleForProduct ==='NO'",
                            items: {
                                "productRejectReason":{
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
                                }, 
                                "productRejectReason":{
                                    key: "lead.productRejectReason",
                                    type: "select",
                                    condition: "model.lead.eligibleForProduct ==='NO'",
                                    titleMap: {
                                        "High Interest rate": "High Interest rate",
                                        "Negative": "Negative",
                                        "Not Kinara's target segment": "Not Kinara's target segment",
                                        "Not having proper documents": "Not having proper documents",
                                    }
                                }, 
                                "additionalRemarks":{
                                    key: "lead.additionalRemarks",
                                }, }
                        }, 
                        "leadStatus":{
                            type: "fieldset",
                            title: "LEAD_STATUS",
                            items: {
                                "leadStatus":{
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

                "previousInteractions":{
                    type: "box",
                    title: "PREVIOUS_INTERACTIONS",
                    condition: "model.lead.id && model.lead.currentStage == 'Inprocess'",
                    items: {
                        "leadInteractions1":{
                            key: "lead.leadInteractions1",
                            type: "array",
                            add: null,
                            remove: null,
                            title: "Interaction History",
                            items: {
                                "interactionDate":{
                                    key: "lead.leadInteractions1[].interactionDate",
                                    type: "date",
                                    readonly: true,
                                }, 
                                "loanOfficerId":{
                                    key: "lead.leadInteractions1[].loanOfficerId",
                                    readonly: true,
                                }, 
                                "typeOfInteraction":{
                                    key: "lead.leadInteractions1[].typeOfInteraction",
                                    type: "select",
                                    readonly: true,
                                    titleMap: {
                                        "Call": "Call",
                                        "Visit": "Visit",
                                    },
                                }, 
                                "customerResponse":{
                                    key: "lead.leadInteractions1[].customerResponse",
                                    readonly: true,
                                }, 
                                "additionalRemarks":{
                                    key: "lead.leadInteractions1[].additionalRemarks",
                                    readonly: true,
                                }, 
                                "location":{
                                    "key": "lead.leadInteractions1[].location",
                                    readonly: true,
                                    "type": "geotag",
                                    "latitude": "latitude",
                                    "longitude": "longitude",
                                    "condition": "model.lead.leadInteractions1[arrayIndex].typeOfInteraction == 'Visit'",
                                    }, 
                                    "picture":{
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


                "leadInteractions":{
                    type: "box",
                    title: "LEAD_INTERACTIONS",
                    items: {
                        "leadInteractions":{
                            key: "lead.leadInteractions",
                            type: "array",
                            add: null,
                            remove: null,
                            startEmpty: true,
                            view: "fixed",
                            title: "LEAD_INTERACTIONS",
                            items: {
                                "interactionDate":{
                                    key: "lead.leadInteractions[].interactionDate",
                                    type: "date",
                                    readonly: true,
                                }, 
                                "loanOfficerId":{
                                    key: "lead.leadInteractions[].loanOfficerId",
                                    readonly: true,
                                }, 
                                "typeOfInteraction":{
                                    key: "lead.leadInteractions[].typeOfInteraction",
                                    type: "select",
                                    titleMap: {
                                        "Call": "Call",
                                        "Visit": "Visit",
                                    },
                                }, 
                                "customerResponse":{
                                    key: "lead.leadInteractions[].customerResponse",
                                }, 
                                "additionalRemarks":{
                                    key: "lead.leadInteractions[].additionalRemarks",
                                }, 
                                "location":{
                                    "key": "lead.leadInteractions[].location",
                                    "type": "geotag",
                                    "latitude": "latitude",
                                        "longitude": "longitude",
                                    "condition": "model.lead.leadInteractions[arrayIndex].typeOfInteraction == 'Visit'",
                                }, 
                                "picture":{
                                    "key": "lead.leadInteractions[].picture",
                                    "type": "file",
                                    "fileType": "image/*",
                                    "condition": "model.lead.leadInteractions[arrayIndex].typeOfInteraction === 'Visit'",
                                }, 
                            }
                        }
                    }
                },


                "actionbox":{
                    "type": "actionbox",
                    "items": {
                        "save":{
                            "type": "save",
                            "title": "Offline Save"
                        }, 
                        "submit":{
                            "type": "submit",
                            "title": "Submit"
                        }
                    }
                },
        }

        return {
            getFormDefinition: function(formName, formRequest) {
                var form = [],
                    keys;
                if (Object.keys(formRepository).indexOf(formName) === -1)
                    return form;
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
                var getKeyString = function(parentKey, key) {
                    if (!parentKey || parentKey === "") {
                        return key;
                    }
                    return parentKey + "." + key;
                }
                var orderFormItems = function(objA, objB) {
                    if (_.isUndefined(objA.orderNo) && !_.isUndefined(objB.orderNo)) return 1;
                    if (!_.isUndefined(objA.orderNo) && _.isUndefined(objB.orderNo)) return -1;
                    if (_.isUndefined(objA.orderNo) && _.isUndefined(objB.orderNo)) return 0;
                    return (objA.orderNo - objB.orderNo);
                }
                var constructForm = function(repo, form, parent, main) {
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
                        if (_defn.items) {

                            _items = _.merge({}, _defn.items);
                            _defn.items = [];

                            constructForm(_items, _defn.items, _key, true);
                        }
                        form.push(_defn);
                    }
                    form.sort(orderFormItems);
                }
                constructForm(formRepository[formName], form, undefined, true);
                return form;
            }
        }
    }
]);