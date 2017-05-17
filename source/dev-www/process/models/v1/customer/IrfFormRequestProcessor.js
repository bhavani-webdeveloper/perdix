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
                        "offline": true
                    },
                    "branchId": {
                        orderNo: 30,
                        key: "branchId",
                        "title": "BRANCH_NAME",
                        "readonly": true
                    },
                    "centreCode": {
                        orderNo: 40,
                        key: "customer.centreCode",
                        type: "select",
                        parentEnumCode: "branch_id",
                        parentValueExpr: "model.branchId",
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
                        key: "customer.fatherFirstName",
                        title: "FATHER_FULL_NAME"
                    },
                    "spouseFirstName": {
                        orderNo: 160,
                        key: "customer.spouseFirstName",
                        title: "SPOUSE_FULL_NAME",
                        condition: "model.customer.maritalStatus==='MARRIED'",
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
                                        inputModel.state
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
                            }
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
                                initialize: function(inputModel) {
                                    $log.warn('in pincode initialize');
                                    $log.info(inputModel);
                                },
                                search: function(inputModel, form, model) {
                                    if (!inputModel.mailingPincode) {
                                        return $q.reject();
                                    }
                                    return Queries.searchPincodes(
                                        inputModel.mailingPincode,
                                        inputModel.mailingDistrict,
                                        inputModel.mailingState
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
                            }
                        }
                    }
                }
            },
            "KYC": {
                type: "box",
                title: "KYC",
                items: {
                    "aadhaarNo": {
                        "key": "customer.aadhaarNo",
                        type: "qrcode",
                        onChange: "actions.setProofs(model)",
                        onCapture: EnrollmentHelper.customerAadhaarOnCapture
                    },
                    "IdentityProof1": {
                        type: "fieldset",
                        title: "IDENTITY_PROOF",
                        items: {
                            "identityProof": {
                                key: "customer.identityProof",
                                type: "select"
                            },
                            "identityProofImageId": {
                                key: "customer.identityProofImageId",
                                type: "file",
                                fileType: "image/*",
                                "offline": true
                            },
                            "udf30": {
                                key: "customer.udf.userDefinedFieldValues.udf30",
                                type: "file",
                                fileType: "image/*",
                                "offline": true
                            },
                            "identityProofNo": {
                                key: "customer.identityProofNo",
                                type: "barcode",
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
                                key: "customer.addressProofSameAsIdProof"
                            }
                        }
                    },
                    "addressProof1": {
                        type: "fieldset",
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
                                fileType: "image/*",
                                "offline": true
                            },
                            "udf29": {
                                key: "customer.udf.userDefinedFieldValues.udf29",
                                type: "file",
                                fileType: "image/*",
                                "offline": true
                            },
                            "addressProofNo": {
                                key: "customer.addressProofNo",
                                type: "barcode",
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
                                fileType: "image/*",
                                "offline": true
                            },
                            "udf35": {
                                key: "customer.udf.userDefinedFieldValues.udf35",
                                type: "file",
                                fileType: "image/*",
                                "offline": true
                            },
                            "udf36": {
                                key: "customer.udf.userDefinedFieldValues.udf36",
                                condition: "model.customer.udf.userDefinedFieldValues.udf33 !== 'Aadhar card'",
                                type: "barcode",
                                onCapture: function(result, model, form) {
                                    $log.info(result); // spouse id proof
                                    model.customer.udf.userDefinedFieldValues.udf36 = result.text;
                                }
                            },
                            "udf36": {
                                key: "customer.udf.userDefinedFieldValues.udf36",
                                condition: "model.customer.udf.userDefinedFieldValues.udf33 === 'Aadhar card'",
                                type: "qrcode",
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
                "title": "ADDITIONAL_KYC",
                "items": {
                    "additionalKYCs": {
                        "key": "customer.additionalKYCs",
                        "type": "array",
                        "add": null,
                        "remove": null,
                        "title": "ADDITIONAL_KYC",
                        "items": {
                            "kyc1ProofNumber": {
                                key: "customer.additionalKYCs[].kyc1ProofNumber",
                                type: "barcode",
                                onCapture: function(result, model, form) {
                                    $log.info(result);
                                    model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                                }
                            },
                            "kyc1ProofType": {
                                key: "customer.additionalKYCs[].kyc1ProofType",
                                type: "select"
                            },
                            "kyc1ImagePath": {
                                key: "customer.additionalKYCs[].kyc1ImagePath",
                                type: "file",
                                fileType: "image/*",
                                "offline": true
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
                "title": "T_FAMILY_DETAILS",
                "items": {
                    "familyMembers": {
                        key: "customer.familyMembers",
                        type: "array",
                        startEmpty: true,
                        items: {
                            "customerId": {
                                key: "customer.familyMembers[].customerId",
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
                                title: "FAMILY_MEMBER_FULL_NAME"
                            },
                            "relationShip": {
                                key: "customer.familyMembers[].relationShip",
                                type: "select",
                                title: "T_RELATIONSHIP"
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
                                    },
                                    "monthsPerYear": {
                                        key: "customer.familyMembers[].incomes[].monthsPerYear"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "Expenditures1": {
                "type": "box",
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
                    }
                }
            },
            "BusinessOccupationDetails": {
                "type": "box",
                "title": "BUSINESS_OCCUPATION_DETAILS",
                "items": {
                    "customerOccupationType": {
                        key: "customer.udf.userDefinedFieldValues.udf13",
                        type: "select"
                    },
                    "businessDetails": {
                        type: "fieldset",
                        //condition: "model.customer.udf.userDefinedFieldValues.udf13=='Business' || model.customer.udf.userDefinedFieldValues.udf13=='Employed'",
                        items: {
                            "relationshipWithBusinessOwner": {
                                key: "customer.udf.userDefinedFieldValues.udf14",
                                type: "select",
                                orderNo: 10,
                            },
                            "business/employerName": {
                                key: "customer.udf.userDefinedFieldValues.udf7",
                                orderNo: 20,
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
                            "business/employerName": {
                                key: "customer.udf.userDefinedFieldValues.udf23",
                                type: "radios",
                                orderNo: 90,
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
                                "titleMap": {
                                    "CONCRETE": "CONCRETE",
                                    "MUD": "MUD",
                                    "BRICK": "BRICK"
                                }
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
                        //condition: "model.customer.udf.userDefinedFieldValues.udf13=='Agriculture'",
                        title: "AGRICULTURE_DETAILS",
                        items: {
                            "relationwithFarmer": {
                                key: "customer.udf.userDefinedFieldValues.udf24",
                                orderNo: 10,
                                type: "select"
                            },
                            "landOwnership": {
                                key: "customer.udf.userDefinedFieldValues.udf25",
                                orderNo: 20,
                                type: "select"
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
                "title": "T_HOUSE_VERIFICATION",
                "items": {
                    "firstName": {
                        "key": "customer.firstName",
                        "title": "CUSTOMER_NAME",
                        "readonly": true
                    },
                    "nameInLocalLanguage": {
                        key: "customer.nameInLocalLanguage"
                    },
                    "addressInLocalLanguage": {
                        key: "customer.addressInLocalLanguage",
                        type: "textarea"
                    },

                    "religion": {
                        key: "customer.religion",
                        type: "select"
                    },
                    "caste": {
                        key: "customer.caste",
                        type: "select"
                    },
                    "language": {
                        key: "customer.language",
                        type: "select"
                    },
                    "HouseDetails": {
                        type: "fieldset",
                        title: "HOUSE_DETAILS",
                        items: {
                            "HouseOwnership": {
                                key: "customer.udf.userDefinedFieldValues.udf3",
                                type: "select"

                            },
                            "landLordName": {
                                key: "customer.udf.userDefinedFieldValues.udf2",
                                condition: "model.customer.udf.userDefinedFieldValues.udf3=='RENTED'"
                            },
                            "HouseVerification": {
                                key: "customer.udf.userDefinedFieldValues.udf4",

                            },
                            "durationOfStay": {
                                key: "customer.udf.userDefinedFieldValues.udf5",
                                type: "radios"

                            },
                            "YearsOfBusinessPresentArea": {
                                key: "customer.udf.userDefinedFieldValues.udf31",
                                "type": "select",
                                "titleMap": {
                                    "CONCRETE": "CONCRETE",
                                    "MUD": "MUD",
                                    "BRICK": "BRICK"
                                }
                            },
                            "YearsOfBusinessPresentAddress": {
                                key: "customer.udf.userDefinedFieldValues.udf32"

                            },
                            "Toilet": {
                                key: "customer.udf.userDefinedFieldValues.udf6"
                            }
                        }
                    },
                    "latitude": {
                        "key": "customer.latitude",
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
                                type: "select"
                            },
                            "ownedAssetDetails": {
                                key: "customer.physicalAssets[].ownedAssetDetails",
                                type: "select",
                                screenFilter: true,
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
                            }
                        }
                    }
                }
            },
            "Liabilities1": {
                type: "box",
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
            "PpiIndicators": {
                type: "box",
                title: "PPI_INDICATORS",
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
            },
            "actionbox": {
                "type": "actionbox",
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
            getFormDefinition: function(formName, formRequest) {
                var form = [],
                    keys;
                if (Object.keys(formRepository).indexOf(formName) === -1)
                    return form;
                if (!formRequest || !_.isObject(formRequest)) {
                    return form;
                }
                keys = Object.keys(formRequest);
                if (!keys || keys.length < 0 || keys.indexOf("overRides") === -1 || keys.indexOf("includes") === -1 || keys.indexOf("excludes") === -1) {
                    return form;
                }
                var includes = formRequest.includes || [];
                var excludes = formRequest.excludes || [];
                var overRides = formRequest.overRides || {};
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
                        if (overRides[_key]) {
                            _defn = _.merge({}, repo[keylist[itr]], overRides[_key]);
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