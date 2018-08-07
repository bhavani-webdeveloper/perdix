irf.pageCollection.factory("Pages__ProfileInformation", ["$log", "Lead", "LeadHelper", "$q", "Queries", "Enrollment", 'EnrollmentHelper', 'PageHelper', 'formHelper', "elementsUtils", 'irfProgressMessage', 'SessionStore', "$state", "$stateParams","CustomerBankBranch", "irfNavigator",
    function($log, Lead, LeadHelper, $q, Queries, Enrollment, EnrollmentHelper, PageHelper, formHelper, elementsUtils, irfProgressMessage, SessionStore, $state, $stateParams, CustomerBankBranch,irfNavigator) {
        var branch = SessionStore.getBranch();
        return {
            "id": "ProfileInformation",
            "type": "schema-form",
            "name": "Stage1",
            "title": "CUSTOMER_ENROLLMENT",
            "subTitle": "STAGE_1",
            initialize: function(model, form, formCtrl) {
                $stateParams.confirmExit = true;
                model.customer = model.customer || {};
                model.lead = model.lead || {};
                model.customer.customerType = "Individual";
                var branch1 = formHelper.enum('branch_id').data;
                var allowedBranch = [];
                for (var i = 0; i < branch1.length; i++) {
                    if ((branch1[i].name) == SessionStore.getBranch()) {
                        allowedBranch.push(branch1[i]);
                        break;
                    }
                }
                model.customer.customerBranchId = allowedBranch.length ? allowedBranch[0].value : '';
                model.customer.kgfsBankName = SessionStore.getBankName();
                $log.info(model.customer.kgfsBankName);
                $log.info(formHelper.enum('bank'));
                if ($stateParams.pageData) {
                    if (_.hasIn($stateParams.pageData, 'lead_id') && _.isNumber($stateParams.pageData['lead_id'])) {
                        PageHelper.showLoader();
                        PageHelper.showProgress("Enrollment-input", 'Loading lead details');
                        var _leadId = $stateParams.pageData['lead_id'];
                        Lead.get({
                            id: _leadId
                        }).$promise.then(function(res) {
                            model.lead = res;
                            PageHelper.showProgress('Enrollment-input', 'Done.', 5000);
                            model.customer.mobilePhone = res.mobileNo;
                            model.lead.id = res.id;
                            model.customer.gender = res.gender;
                            model.customer.firstName = res.leadName;
                            model.customer.maritalStatus = res.maritalStatus;
                            model.customer.customerBranchId = res.branchId;
                            model.customer.centreId = res.centreId;
                            model.customer.centreName = res.centreName;
                            model.customer.street = res.addressLine2;
                            model.customer.doorNo = res.addressLine1;
                            model.customer.pincode = res.pincode;
                            model.customer.district = res.district;
                            model.customer.state = res.state;
                            model.customer.locality = res.area;
                            model.customer.villageName = res.cityTownVillage;
                            model.customer.landLineNo = res.alternateMobileNo;
                            model.customer.dateOfBirth = res.dob;
                            model.customer.age = res.age;
                            if (model.customer.dateOfBirth) {
                                model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                            }
                            model.customer.gender = res.gender;
                            model.customer.landLineNo = res.alternateMobileNo;
                            for (var i = 0; i < model.customer.familyMembers.length; i++) {
                                $log.info(model.customer.familyMembers[i].relationShip);
                                model.customer.familyMembers[i].educationStatus = obj.educationStatus;
                            }
                        }, function(httpRes) {
                            PageHelper.showErrors(httpRes);
                        }).finally(function() {
                            PageHelper.hideLoader();
                        })
                    } else {
                        $log.info($stateParams.pagedata);
                        var family = $stateParams.pageData;
                        model.customer.familyEnrollmentId = family.familydata.enrollmentId;
                        model.customer.parentCustomerId = family.familydata.customerId;
                        model.customer.dateOfBirth = family.familydata.dateOfBirth;
                        model.customer.educationStatus = family.familydata.educationStatus;
                        model.customer.firstName = family.familydata.familyMemberFirstName;
                        model.customer.gender = family.familydata.gender;
                        model.customer.maritalStatus = family.familydata.maritalStatus;
                        model.customer.mobilePhone = family.familydata.mobilePhone;
                        model.customer.doorNo = family.doorNo;
                        model.customer.street = family.street;
                        model.customer.locality = family.locality;
                        model.customer.villageName = family.villageName;
                        model.customer.postOffice = family.postOffice;
                        model.customer.district = family.district;
                        model.customer.pincode = family.pincode;
                        model.customer.state = family.state;
                        model.customer.stdCode = family.stdCode;
                        model.customer.landLineNo = family.landLineNo;
                        model.customer.mailSameAsResidence = family.mailSameAsResidence;
                        model.customer.mailingDoorNo = family.mailingDoorNo;
                        model.customer.mailingStreet = family.mailingStreet;
                        model.customer.mailingLocality = family.mailingLocality;
                        model.customer.mailingPostoffice = family.mailingPostoffice;
                        model.customer.mailingDistrict = family.mailingDistrict;
                        model.customer.mailingPincode = family.mailingPincode;
                        model.customer.mailingState = family.mailingState;
                        if (family.familydata.maritalStatus == 'MARRIED' && (family.familydata.relationShip == 'Wife' || family.familydata.relationShip == 'Husband')) {
                            model.customer.spouseFirstName = family.firstName;
                            model.customer.spouseDateOfBirth = family.spouseDateOfBirth;
                            if (family.spouseDateOfBirth) {
                                model.customer.spouseAge = moment().diff(moment(family.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                            }
                            if (!_.hasIn(model.customer, 'udf') || model.customer.udf == null) {
                                model.customer.udf = {
                                    userDefinedFieldValues: {
                                        udf33: family.udf.userDefinedFieldValues.udf33,
                                        udf34: family.udf.userDefinedFieldValues.udf34,
                                        udf35: family.udf.userDefinedFieldValues.udf35,
                                        udf36: family.udf.userDefinedFieldValues.udf36
                                    }
                                };
                            }
                        }
                        if (model.customer.dateOfBirth) {
                            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                    }
                }
                $log.info("ProfileInformation page got initialized:" + model.customer.customerBranchId);
            },
            modelPromise: function(pageId, _model) {
                var deferred = $q.defer();
                PageHelper.showLoader();
                irfProgressMessage.pop("enrollment-save", "Loading Customer Data...");
                Enrollment.getCustomerById({
                    id: pageId
                }, function(resp, header) {
                    var model = {
                        $$OFFLINE_FILES$$: _model.$$OFFLINE_FILES$$
                    };
                    model.customer = resp;
                    model.customer.addressProofSameAsIdProof = (model.customer.title == "true") ? true : false;
                    model.customer.customerBranchId = model.customer.customerBranchId || _model.customer.customerBranchId;
                    model.customer.kgfsBankName = model.customer.kgfsBankName || SessionStore.getBankName();
                    model = EnrollmentHelper.fixData(model);
                    // model.customer.addressProofSameAsIdProof = Boolean(model.customer.title);
                    if (model.customer.dateOfBirth) {
                        model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                    }
                    if (model.customer.spouseDateOfBirth) {
                        model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                    }
                    model._mode = 'EDIT';
                    if (model.customer.currentStage === 'Stage01') {
                        irfProgressMessage.pop("enrollment-save", "Load Complete", 2000);
                        deferred.resolve(model);
                        window.scrollTo(0, 0);
                    } else {
                        irfProgressMessage.pop("enrollment-save", "Customer " + model.customer.id + " already enrolled", 5000);
                        $stateParams.confirmExit = false;
                        irfNavigator.goBack();
                    }
                    PageHelper.hideLoader();
                }, function(resp) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("enrollment-save", "An Error Occurred. Failed to fetch Data", 5000);
                    $stateParams.confirmExit = false;
                    $state.go("Page.Engine", {
                        pageName: "CustomerSearch",
                        pageId: null
                    });
                });
                return deferred.promise;
            },
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return [
                    item["customer"]["urnNo"],
                    item["customer"]["firstName"],
                    item["customer"]["villageName"]
                ]
            },
            form: [{
                "type": "box",
                "title": "CUSTOMER_INFORMATION",
                "items": [{
                    key: "customer.firstName",
                    title: "FULL_NAME",
                    type: "qrcode",
                    onCapture: function(result, model, form) {
                        PageHelper.showLoader();
                        var aadhaarData = EnrollmentHelper.customerAadhaarOnCapture(result, model, form);
                        Queries.searchPincodes(aadhaarData.pc).then(function(response) {
                            $log.info(response);
                            if (response.body && response.body.length) {
                                model.customer.district = response.body[0].district;
                                model.customer.state = response.body[0].state;
                            }
                            PageHelper.hideLoader();
                        });
                    }
                }, {
                    key: "customer.photoImageId",
                    type: "file",
                    "required": true,
                    fileType: "image/*",
                    "viewParams": function(modelValue, form, model) {
                        return {
                            customerId: model.customer.id
                        };
                    },
                    //"offline": true
                }, {
                    key: "customer.centreId",
                    "required": true,
                    type: "select",
                    "enumCode": "centre",
                    "parentEnumCode": "branch_id",
                    "parentValueExpr": "model.customer.customerBranchId",
                }, {
                    key: "customer.enrolledAs",
                    type: "radios"
                }, {
                    key: "customer.gender",
                    type: "radios"
                }, {
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
                }, {
                    key: "customer.dateOfBirth",
                    type: "date",
                    "onChange": function(modelValue, form, model) {
                        if (model.customer.dateOfBirth) {
                            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                    }
                }, {
                    key: "customer.fatherFirstName",
                    title: "FATHER_FULL_NAME"
                }, {
                    key: "customer.maritalStatus",
                    type: "select"
                }, {
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
                }, {
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
                }, {
                    key: "customer.spouseDateOfBirth",
                    type: "date",
                    condition: "model.customer.maritalStatus==='MARRIED'",
                    "onChange": function(modelValue, form, model) {
                        if (model.customer.spouseDateOfBirth) {
                            model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                    }
                }, {
                    key: "customer.udf.userDefinedFieldValues.udf1",
                    condition: "model.customer.maritalStatus==='MARRIED'",
                    title: "SPOUSE_LOAN_CONSENT"
                }]
            }, {
                "type": "box",
                "title": "CONTACT_INFORMATION",
                "items": [{
                    type: "fieldset",
                    title: "CUSTOMER_RESIDENTIAL_ADDRESS",
                    items: [{
                        key: "customer.doorNo",
                        "required": true
                    }, "customer.street", {
                        key: "customer.locality",
                        "required": true
                    }, {
                        key: "customer.villageName",
                        required: true,
                        type: "select",
                        "enumCode": "village",
                        filter: {
                            parentCode: 'model.customer.customerBranchId'
                        },
                        screenFilter: true
                    }, {
                        key: "customer.postOffice",
                        required: true
                    }, {
                        key: "customer.district",
                        type: "select",
                        "enumCode": "district_master",
                        screenFilter: true,
                        parentEnumCode: "bankname",
                        parentValueExpr: "model.customer.kgfsBankName"
                    }, "customer.pincode", {
                        key: "customer.state",
                        type: "select",
                        "enumCode": "state_master",
                        screenFilter: true,
                        parentEnumCode: "bankname",
                        parentValueExpr: "model.customer.kgfsBankName"
                    }, "customer.stdCode", "customer.landLineNo", {
                        key: "customer.mobilePhone",
                        required: true,
                    }, "customer.mailSameAsResidence"]
                }, {
                    type: "fieldset",
                    title: "CUSTOMER_PERMANENT_ADDRESS",
                    condition: "!model.customer.mailSameAsResidence",
                    items: [{
                        key: "customer.mailingDoorNo",
                        required: true
                    }, "customer.mailingStreet", {
                        key: "customer.mailingLocality",
                        required: true
                    }, {
                        key: "customer.mailingPostoffice",
                        required: true
                    }, {
                        key: "customer.mailingDistrict",
                        type: "select",
                        screenFilter: true,
                        "enumCode": "district_master",
                        parentEnumCode: "bankname",
                        parentValueExpr: "model.customer.kgfsBankName"
                    }, "customer.mailingPincode", {
                        key: "customer.mailingState",
                        type: "select",
                        "enumCode": "state_master",
                        screenFilter: true,
                        parentEnumCode: "bankname",
                        parentValueExpr: "model.customer.kgfsBankName"
                    }]
                }]
            }, {
                type: "box",
                title: "KYC",
                items: [{
                    key: "customer.aadhaarNo",
                    type: "qrcode",
                    onChange: "actions.setProofs(model)",
                    onCapture: function(result, model, form) {
                        PageHelper.showLoader();
                        var aadhaarData = EnrollmentHelper.customerAadhaarOnCapture(result, model, form);
                        Queries.searchPincodes(aadhaarData.pc).then(function(response) {
                            $log.info(response);
                            if (response.body && response.body.length) {
                                model.customer.district = response.body[0].district;
                                model.customer.state = response.body[0].state;
                            }
                            PageHelper.hideLoader();
                        });
                    }
                    //onCapture: EnrollmentHelper.customerAadhaarOnCapture
                }, {
                    type: "fieldset",
                    title: "IDENTITY_PROOF",
                    items: [{
                        key: "customer.identityProof",
                        type: "select"
                    }, {
                        key: "customer.identityProofImageId",
                        type: "file",
                        fileType: "image/*",
                        "viewParams": function(modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                        //"offline": true
                    }, {
                        key: "customer.identityProofReverseImageId",
                        type: "file",
                        fileType: "image/*",
                        "viewParams": function(modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                        //"offline": true
                    }, {
                        key: "customer.identityProofNo",
                        type: "barcode",
                        onCapture: function(result, model, form) {
                            $log.info(result);
                            model.customer.identityProofNo = result.text;
                        },
                        "condition": "model.customer.identityProof =='Aadhar card'",
                        "schema": {
                            "pattern": "^[2-9]{1}[0-9]{11}$"
                        }
                    }, {
                        key: "customer.identityProofNo",
                        type: "barcode",
                        "condition": "model.customer.identityProof !='Aadhar card'",
                        onCapture: function(result, model, form) {
                            $log.info(result);
                            model.customer.identityProofNo = result.text;
                        }
                    }, {
                        key: "customer.idProofIssueDate",
                        type: "date"
                    }, {
                        key: "customer.idProofValidUptoDate",
                        type: "date"
                    }, {
                        key: "customer.addressProofSameAsIdProof"
                    }]
                }, {
                    type: "fieldset",
                    title: "ADDRESS_PROOF",
                    condition: "!model.customer.addressProofSameAsIdProof",
                    items: [{
                        key: "customer.addressProof",
                        type: "select"
                    }, {
                        key: "customer.addressProofImageId",
                        type: "file",
                        fileType: "image/*",
                        "viewParams": function(modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                        //"offline": true
                    }, {
                        key: "customer.addressProofReverseImageId",
                        type: "file",
                        fileType: "image/*",
                        "viewParams": function(modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                        //"offline": true
                    }, {
                        key: "customer.addressProofNo",
                        type: "barcode",
                        onCapture: function(result, model, form) {
                            $log.info(result);
                            model.customer.addressProofNo = result.text;
                        },
                        "condition": "model.customer.addressProof =='Aadhar card'",
                        "schema": {
                            "pattern": "^[2-9]{1}[0-9]{11}$"
                        }
                    }, {
                        key: "customer.addressProofNo",
                        "condition": "model.customer.addressProof !== 'Aadhar card'",
                        type: "barcode",
                        onCapture: function(result, model, form) {
                            $log.info(result);
                            model.customer.addressProofNo = result.text;
                        },
                        "schema": {
                            "pattern": ".*"
                        }
                    }, {
                        key: "customer.addressProofIssueDate",
                        type: "date"
                    }, {
                        key: "customer.addressProofValidUptoDate",
                        type: "date"
                    }, ]
                }, {
                    type: "fieldset",
                    title: "SPOUSE_IDENTITY_PROOF",
                    condition: "model.customer.maritalStatus==='MARRIED'",
                    items: [{
                        key: "customer.udf.userDefinedFieldValues.udf33",
                        type: "select",
                        onChange: function(modelValue) {
                            $log.info(modelValue);
                        }
                    }, {
                        key: "customer.udf.userDefinedFieldValues.udf34",
                        type: "file",
                        fileType: "image/*",
                        "viewParams": function(modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                        //"offline": true
                    }, {
                        key: "customer.udf.userDefinedFieldValues.udf35",
                        type: "file",
                        fileType: "image/*",
                        "viewParams": function(modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                        //"offline": true
                    }, {
                        key: "customer.udf.userDefinedFieldValues.udf36",
                        condition: "model.customer.udf.userDefinedFieldValues.udf33 !== 'Aadhar card'",
                        type: "barcode",
                        onCapture: function(result, model, form) {
                            $log.info(result); // spouse id proof
                            model.customer.udf.userDefinedFieldValues.udf36 = result.text;
                        }
                    }, {
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
                    }]
                }]
            }, {
                "type": "box",
                "title": "ADDITIONAL_KYC",
                "items": [{
                    "key": "customer.additionalKYCs",
                    "type": "array",
                    "startEmpty": true,
                    "schema": {
                        "maxItems": 1
                    },
                    "title": "ADDITIONAL_KYC",
                    "items": [{
                        key: "customer.additionalKYCs[].kyc1ProofNumber",
                        type: "barcode",
                        onCapture: function(result, model, form) {
                            $log.info(result);
                            model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                        }
                    }, {
                        key: "customer.additionalKYCs[].kyc1ProofType",
                        required: true,
                        type: "select"
                    }, {
                        key: "customer.additionalKYCs[].kyc1ImagePath",
                        type: "file",
                        required: true,
                        fileType: "image/*",
                        "viewParams": function(modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                        //"offline": true
                    }, {
                        key: "customer.additionalKYCs[].kyc1ReverseImagePath",
                        type: "file",
                        //required: true,
                        fileType: "image/*",
                        "viewParams": function(modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                        //"offline": true
                    }, {
                        key: "customer.additionalKYCs[].kyc1IssueDate",
                        type: "date"
                    }, {
                        key: "customer.additionalKYCs[].kyc1ValidUptoDate",
                        type: "date"
                    }, {
                        key: "customer.additionalKYCs[].kyc2ProofNumber",
                        type: "barcode",
                        onCapture: function(result, model, form) {
                            $log.info(result);
                            model.customer.additionalKYCs[form.arrayIndex].kyc2ProofNumber = result.text;
                        }
                    }, {
                        key: "customer.additionalKYCs[].kyc2ProofType",
                        type: "select"
                    }, {
                        key: "customer.additionalKYCs[].kyc2ImagePath",
                        type: "file",
                        fileType: "image/*",
                        "viewParams": function(modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                        //"offline": true
                    }, {
                        key: "customer.additionalKYCs[].kyc2ReverseImagePath",
                        type: "file",
                        fileType: "image/*",
                        "viewParams": function(modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                        //"offline": true
                    }, {
                        key: "customer.additionalKYCs[].kyc2IssueDate",
                        type: "date"
                    }, {
                        key: "customer.additionalKYCs[].kyc2ValidUptoDate",
                        type: "date"
                    }]
                }]
            }, 
            {
                type: "box",
                title: "BANK_ACCOUNTS",
                // "condition":"model.currentStage=='Screening' || model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                items: [{
                    key: "customer.customerBankAccounts",
                    type: "array",
                    title: "BANK_ACCOUNTS",
                    startEmpty: true,
                    onArrayAdd: function(modelValue, form, model, formCtrl, $event) {
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
                    items: [{
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
                        search: function(inputModel, form) {
                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                            var promise = CustomerBankBranch.search({
                                'bankName': inputModel.bankName,
                                'ifscCode': inputModel.ifscCode,
                                'branchName': inputModel.branchName
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                data.ifscCode,
                                data.branchName,
                                data.bankName
                            ];
                        }
                    }, {
                        key: "customer.customerBankAccounts[].customerBankName",
                        required: true,
                        readonly: true
                    }, {
                        key: "customer.customerBankAccounts[].customerBankBranchName",
                        required: true,
                        readonly: true
                    }, {
                        key: "customer.customerBankAccounts[].customerNameAsInBank"
                    }, {
                        key: "customer.customerBankAccounts[].accountNumber",
                        type: "password",
                        inputmode: "number",
                        numberType: "tel"
                    }, {
                        key: "customer.customerBankAccounts[].confirmedAccountNumber",
                        inputmode: "number",
                        numberType: "tel"
                    }, {
                        key: "customer.customerBankAccounts[].accountType",
                        type: "select"
                    }, {
                        key: "customer.customerBankAccounts[].bankingSince",
                        type: "date",
                        title: "BANKING_SINCE"
                    }, {
                        key: "customer.customerBankAccounts[].netBankingAvailable",
                        type: "select",
                        title: "NET_BANKING_AVAILABLE",
                        enumCode: "decisionmaker"
                    }, {
                        key: "customer.customerBankAccounts[].sanctionedAmount",
                        condition: "model.customer.customerBankAccounts[arrayIndex].accountType =='OD'||model.customer.customerBankAccounts[arrayIndex].accountType =='CC'",
                        type: "amount",
                        required: true,
                        title: "OUTSTANDING_BALANCE"
                    }, {
                        key: "customer.customerBankAccounts[].limit",
                        type: "amount"
                    }, {
                        key: "customer.customerBankAccounts[].bankStatements",
                        type: "array",
                        title: "STATEMENT_DETAILS",
                        titleExpr: "moment(model.customer.customerBankAccounts[arrayIndexes[0]].bankStatements[arrayIndexes[1]].startMonth).format('MMMM YYYY') + ' ' + ('STATEMENT_DETAILS' | translate)",
                        titleExprLocals: {
                            moment: window.moment
                        },
                        startEmpty: true,
                        items: [{
                            key: "customer.customerBankAccounts[].bankStatements[].startMonth",
                            type: "date",
                            title: "START_MONTH"
                        }, {
                            key: "customer.customerBankAccounts[].bankStatements[].totalDeposits",
                            type: "amount",
                            calculator: true,
                            creditDebitBook: true,
                            onDone: function(result, model, context) {
                                model.customer.customerBankAccounts[context.arrayIndexes[0]].bankStatements[context.arrayIndexes[1]].totalDeposits = result.totalCredit;
                                model.customer.customerBankAccounts[context.arrayIndexes[0]].bankStatements[context.arrayIndexes[1]].totalWithdrawals = result.totalDebit;
                            },
                            title: "TOTAL_DEPOSITS"
                        }, {
                            key: "customer.customerBankAccounts[].bankStatements[].totalWithdrawals",
                            type: "amount",
                            title: "TOTAL_WITHDRAWALS"
                        }, {
                            key: "customer.customerBankAccounts[].bankStatements[].balanceAsOn15th",
                            type: "amount",
                            title: "BALENCE_AS_ON_REQUESTED_EMI_DATE"
                        }, {
                            key: "customer.customerBankAccounts[].bankStatements[].noOfChequeBounced",
                            type: "amount",
                            //maximum:99,
                            required: true,
                            title: "NO_OF_CHEQUE_BOUNCED"
                        }, {
                            key: "customer.customerBankAccounts[].bankStatements[].noOfEmiChequeBounced",
                            type: "amount",
                            required: true,
                            //maximum:99,
                            title: "NO_OF_EMI_CHEQUE_BOUNCED"
                        },{
                            key: "customer.customerBankAccounts[].bankStatements[].bankStatementPhoto",
                            type: "file",
                            required: true,
                            title: "BANK_STATEMENT_UPLOAD",
                            fileType: "application/pdf",
                            "category": "CustomerEnrollment",
                            "subCategory": "IDENTITYPROOF",
                            using: "scanner",
                            offline:true
                        }]
                    }]
                }]
            }, 
            {
                "type": "actionbox",
                "condition": "model._mode != 'EDIT'",
                "items": [{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                }, {
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            }, {
                "type": "actionbox",
                "condition": "model._mode == 'EDIT'",
                "items": [{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                }, {
                    "type": "submit",
                    "title": "SAVE"
                }, {
                    "type": "button",
                    "icon": "fa fa-user-plus",
                    "title": "ENROLL_CUSTOMER",
                    "onClick": "actions.proceed(model, formCtrl, form, $event)"
                }, {
                    "type": "button",
                    "icon": "fa fa-refresh",
                    "title": "RELOAD",
                    "onClick": "actions.reload(model, formCtrl, form, $event)"
                }]
            }],
            schema: function() {
                return Enrollment.getSchema().$promise;
            },
            actions: {
                setProofs: function(model) {
                    model.customer.addressProofNo = model.customer.aadhaarNo;
                    model.customer.identityProofNo = model.customer.aadhaarNo;
                    model.customer.identityProof = 'Aadhar card';
                    model.customer.addressProof = 'Aadhar card';
                    model.customer.addressProofSameAsIdProof = true;
                    if (model.customer.yearOfBirth) {
                        model.customer.dateOfBirth = model.customer.yearOfBirth + '-01-01';
                    }
                },
                preSave: function(model, form, formName) {
                    var deferred = $q.defer();
                    if (model.customer.firstName) {
                        deferred.resolve();
                    } else {
                        irfProgressMessage.pop('enrollment-save', 'Customer Name is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },
                submit: function(model, form, formName) {
                    $log.info("Inside submit()");
                    model.customer.customerType = "Individual";
                    model.customer.title = String(model.customer.addressProofSameAsIdProof);
                    /* var centres = formHelper.enum('centre').data;
                     for (var i = 0; i < centres.length; i++) {
                         if ((centres[i].code) == model.customer.centreCode) {
                             model.customer.centreId = centres[i].id;
                         }
                     }*/
                    model.customer.miscellaneous = null;
                    $log.warn(model);
                    if (!EnrollmentHelper.validateData(model)) {
                        $log.warn("Invalid Data, returning false");
                        return false;
                    }
                    var sortFn = function(unordered) {
                        var out = {};
                        Object.keys(unordered).sort().forEach(function(key) {
                            out[key] = unordered[key];
                        });
                        return out;
                    };
                    if (!(EnrollmentHelper.validateDate(model))) {
                        return false;
                    }
                    var reqData = _.cloneDeep(model);
                    EnrollmentHelper.fixData(reqData);
                    reqData.customer.addressProofSameAsIdProof = Boolean(reqData.customer.title);
                    $log.info(JSON.stringify(sortFn(reqData)));
                    EnrollmentHelper.saveData(reqData).then(function(res) {
                        model.customer = _.clone(res.customer);
                        model.customer.addressProofSameAsIdProof = (model.customer.title == "true") ? true : false;
                        model = EnrollmentHelper.fixData(model);
                        if (model.customer.id && _.hasIn(model, "lead.id")) {
                            var reqData = {
                                lead: _.cloneDeep(model.lead),
                                stage: "Completed"
                            }
                            reqData.lead.leadStatus = "Complete";
                            LeadHelper.proceedData(reqData)
                        }
                        /*reqData = _.cloneDeep(model);
                        EnrollmentHelper.proceedData(reqData).then(function(res){
                            irfNavigator.goBack();
                        });*/
                        $stateParams.confirmExit = false;
                        $state.go("Page.Engine", {
                            pageName: 'ProfileInformation',
                            pageId: model.customer.id
                        });
                    });
                },
                proceed: function(model, formCtrl, form, $event) {
                    formCtrl.scope.$broadcast('schemaFormValidate');
                    model.customer.title = String(model.customer.addressProofSameAsIdProof);
                    if (formCtrl && formCtrl.$invalid) {
                        PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                        return false;
                    }
                    model.customer.ageProof = model.customer.addressProofSameAsIdProof;
                    model.customer.customerType = "Individual";
                    if (!(EnrollmentHelper.validateDate(model))) {
                        return false;
                    }
                    var reqData = _.cloneDeep(model);
                    EnrollmentHelper.fixData(reqData);
                    if (reqData.customer.id && reqData.customer.currentStage === 'Stage01') {
                        $log.info("Customer id not null, skipping save");
                        EnrollmentHelper.proceedData(reqData).then(function(res) {
                            model.customer = _.clone(res.customer);
                            model.customer.addressProofSameAsIdProof = (model.customer.title == "true") ? true : false;
                            model = EnrollmentHelper.fixData(model);
                            $stateParams.confirmExit = false;
                            $state.go("Page.Engine", {
                                pageName: 'CustomerSearch',
                            });
                        });
                    }
                },
                reload: function(model, formCtrl, form, $event) {
                    $stateParams.confirmExit = false;
                    $state.go("Page.Engine", {
                        pageName: 'ProfileInformation',
                        pageId: model.customer.id
                    }, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                }
            }
        };
    }
]);