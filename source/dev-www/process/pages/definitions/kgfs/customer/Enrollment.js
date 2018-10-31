define(['perdix/domain/model/customer/EnrolmentProcess',
    'perdix/infra/api/AngularResourceService'],
    function (EnrolmentProcess, AngularResourceService) {
        EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
        return {
            pageUID: "kgfs.customer.Enrollment",
            pageType: "Engine",
            dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper",
                "$q", "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries",
                "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository"],

            $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch,
                BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository) {

                AngularResourceService.getInstance().setInjector($injector);
                var branch = SessionStore.getBranch();

                var preSaveOrProceed = function (reqData) {
                    if (_.hasIn(reqData, 'customer.familyMembers') && _.isArray(reqData.customer.familyMembers)) {
                        var selfExist = false
                        for (var i = 0; i < reqData.customer.familyMembers.length; i++) {
                            var f = reqData.customer.familyMembers[i];
                            if (_.isString(f.relationShip) && f.relationShip.toUpperCase() == 'SELF') {
                                selfExist = true;
                                break;
                            }
                        }
                        if (selfExist == false) {
                            PageHelper.showProgress("pre-save-validation", "Self Relationship is Mandatory", 5000);
                            return false;
                        }
                    }
                    else {
                        PageHelper.showProgress("pre-save-validation", "Family Members section is missing. Self Relationship is Mandatory", 5000);
                        return false;
                    }

                }



                var configFile = function () {
                    return {
                    }
                }

                var overridesFields = function (bundlePageObj) {
                    return {
                        "CustomerInformation.firstName": {
                            schema: {
                                pattern: "^[a-zA-Z\. ]+$",
                                type: ["string", "null"],
                            },
                            onCapture: function(result, model, form) {
                                PageHelper.showLoader();
                                var aadhaarData = EnrollmentHelper.customerAadhaarOnCapture(result, model, form);
                                Queries.searchPincodes(
                                    aadhaarData.pc
                                ).then(function(response) {
                                    $log.info(response);
                                    if (response.body && response.body.length) {
                                        model.customer.district = response.body[0].district;
                                        model.customer.state = response.body[0].state;
                                    }
                                    PageHelper.hideLoader();
                                });
                            },
                            validationMessage: {
                                202: "Only alphabets and space are allowed."
                            },
                        },
                        "CustomerInformation.photoImageId": {
                            "required": true,
                        },
                        "CustomerInformation.centreId": {
                            "title": "CENTRE",
                        },
                        "CustomerInformation.spouseFirstName": {
                            "required": true,
                            schema: {
                                pattern: "^[a-zA-Z\. ]+$",
                                type: ["string", "null"],
                            },
                            validationMessage: {
                                202: "Only alphabets and space are allowed."
                            },
                        },
                        "CustomerInformation.spouseDateOfBirth": {
                            "required": true,
                        },
                        "CustomerInformation.fatherFirstName": {
                            "title": "FATHER_FULL_NAME",
                            schema: {
                                pattern: "^[a-zA-Z\. ]+$",
                                type: ["string", "null"],
                            },
                            validationMessage: {
                                202: "Only alphabets and space are allowed."
                            },
                        },
                        "ContactInformation.mobilePhone": {
                            "required": true
                        },
                        "ContactInformation.CustomerResidentialAddress.locality": {
                            orderNo: 50,
                            "readonly": false
                        },
                        "ContactInformation.CustomerResidentialAddress.villageName": {
                            orderNo: 60,
                            required: true,
                            "readonly": false,
                            type: "select",
                            "enumCode": "village",
                            filter: {
                                parentCode: 'model.customer.customerBranchId'
                            },
                            screenFilter: true
                        },
                        "ContactInformation.CustomerResidentialAddress.postOffice": {
                            orderNo: 70,
                            "readonly": false
                        },
                        "ContactInformation.CustomerResidentialAddress.pincode": {
                            orderNo: 80,
                            "type": "number",
                            "readonly": false
                        },
                        "ContactInformation.CustomerResidentialAddress.district": {
                            orderNo: 90,
                            type: "select",
                            "enumCode": "district_master",
                            screenFilter: true,
                            parentEnumCode: "bankname",
                            parentValueExpr: "model.customer.kgfsBankName",
                            "readonly": false
                        },
                        "ContactInformation.CustomerResidentialAddress.state": {
                            orderNo: 100,
                            type: "select",
                            "enumCode": "state_master",
                            screenFilter: true,
                            parentEnumCode: "bankname",
                            parentValueExpr: "model.customer.kgfsBankName",
                            "readonly": false
                        },
                        "ContactInformation.CustomerPermanentAddress.mailingLocality": {
                            orderNo: 30,
                            "readonly": false
                        },
                        "ContactInformation.CustomerPermanentAddress.mailingPostoffice": {
                            orderNo: 40,
                            "readonly": false
                        },
                        "ContactInformation.CustomerPermanentAddress.mailingPincode": {
                            orderNo: 50,
                            "type": "string",
                            "readonly": false
                        },
                        "ContactInformation.CustomerPermanentAddress.mailingDistrict": {
                            orderNo: 60,
                            type: "select",
                            screenFilter: true,
                            "enumCode": "district_master",
                            parentEnumCode: "bankname",
                            parentValueExpr: "model.customer.kgfsBankName",
                            "readonly": false
                        },
                        "ContactInformation.CustomerPermanentAddress.mailingState": {
                            orderNo: 70,
                            type: "select",
                            "enumCode": "state_master",
                            screenFilter: true,
                            parentEnumCode: "bankname",
                            parentValueExpr: "model.customer.kgfsBankName",
                            "readonly": false
                        },
                        "KYC.aadhaarNo": {
                            onChange: "actions.setProofs(model)",
                            onCapture: function(result, model, form) {
                                PageHelper.showLoader();
                                var aadhaarData = EnrollmentHelper.customerAadhaarOnCapture(result, model, form);
                                Queries.searchPincodes(
                                    aadhaarData.pc
                                ).then(function(response) {
                                    $log.info(response);
                                    if (response.body && response.body.length) {
                                        model.customer.district = response.body[0].district;
                                        model.customer.state = response.body[0].state;
                                    }
                                    PageHelper.hideLoader();
                                });
                            }
                        },
                        "KYC.IdentityProof1.identityProofImageId": {
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                            fileType: "image/*",
                            offline: false,
                        },
                        "KYC.IdentityProof1.identityProofReverseImageId": {
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                            fileType: "image/*",
                            offline: false,
                        },
                        "KYC.IdentityProof1.addressProofSameAsIdProof": {
                            condition: "model.customer.identityProof"
                        },
                        "KYC.addressProof1": {
                            condition: "!model.customer.addressProofSameAsIdProof",
                        },
                        "KYC.addressProof1.addressProofImageId": {
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                            fileType: "image/*",
                            offline: false,
                        },
                        "KYC.addressProof1.addressProofReverseImageId": {
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                            fileType: "image/*",
                            offline: false,
                        },
                        "KYC.spouseIdProof.udf34": {
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                            fileType: "image/*",
                            offline: false,
                        },
                        "KYC.spouseIdProof.udf35": {
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                            fileType: "image/*",
                            offline: false,
                        },
                        "KYC.spouseIdProof.udf36": {
                            type: "barcode",
                        },
                        "KYC.spouseIdProof.udf36_1": {
                            type: "qrcode",
                        },
                        "AdditionalKYC.additionalKYCs": {
                            startEmpty: true,
                            "schema": {
                                "maxItems": 1
                            },
                        },
                        "AdditionalKYC.additionalKYCs.kyc1ImagePath": {
                            required: true,
                            fileType: "image/*",
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                        },
                        "familyDetails.familyMembers": {
                            onArrayAdd: function(value, form, model, formCtrl, event) {
                                if ((model.customer.familyMembers.length - 1) === 0) {
                                    model.customer.familyMembers[0].relationShip = 'self';
                                    model.customer.familyMembers[0].gender = model.customer.gender;
                                    model.customer.familyMembers[0].dateOfBirth = model.customer.dateOfBirth;
                                    model.customer.familyMembers[0].age = model.customer.age;
                                    model.customer.familyMembers[0].maritalStatus = model.customer.maritalStatus;
                                    model.customer.familyMembers[0].mobilePhone = model.customer.mobilePhone;
                                    if (model.customer.maritalStatus == "MARRIED") {
                                        var spouse = null;
                                        spouse = {
                                            familyMemberFirstName: model.customer.spouseFirstName,
                                            relationShip: model.customer.gender === 'MALE' ? 'Wife' : 'Husband',
                                            gender: model.customer.gender === 'MALE' ? 'FEMALE' : 'MALE',
                                            dateOfBirth: model.customer.spouseDateOfBirth,
                                            maritalStatus: model.customer.maritalStatus,
                                            age: moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years')
                                        };
                                        model.customer.familyMembers.push(spouse);
                                    }
                                }
                            }
                        },
                        "familyDetails.familyMembers.relationShip": {
                            "onChange": function(modelValue, form, model, formCtrl, event) {
                                if (model.customer.familyMembers[form.arrayIndex].relationShip == 'self') {
                                    for (var index = 0; index < model.customer.familyMembers.length; index++) {
                                        if (index != form.arrayIndex && model.customer.familyMembers[index].relationShip == 'self') {
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
                                } else {
                                    if (model.customer.familyMembers[form.arrayIndex].customerId)
                                        return;
                                    model.customer.familyMembers[form.arrayIndex].dateOfBirth = undefined;
                                    model.customer.familyMembers[form.arrayIndex].age = undefined;
                                    model.customer.familyMembers[form.arrayIndex].maritalStatus = undefined;
                                    //model.customer.familyMembers[form.arrayIndex].gender = undefined;
                                    model.customer.familyMembers[form.arrayIndex].mobilePhone = undefined;
                                    if (model.customer.familyMembers[form.arrayIndex].relationShip == 'Father' || model.customer.familyMembers[form.arrayIndex].relationShip == 'Father-In-Law') {
                                        model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.fatherFirstName;
                                    } else if (model.customer.familyMembers[form.arrayIndex].relationShip == "Husband" || model.customer.familyMembers[form.arrayIndex].relationShip == "Wife") {
                                        model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.spouseFirstName;
                                        model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.spouseDateOfBirth;
                                        model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.spouseDateOfBirth), 'years');
                                    } else {
                                        model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = undefined;
                                        model.customer.familyMembers[form.arrayIndex].dateOfBirth = undefined;
                                        model.customer.familyMembers[form.arrayIndex].age = undefined;
                                    }
                                    var relationship = formHelper.enum('relation').data;
                                    for (var i = 0; i < relationship.length; i++) {
                                        var rel = relationship[i];
                                        if (rel.name == model.customer.familyMembers[form.arrayIndex].relationShip) {
                                            model.customer.familyMembers[form.arrayIndex].gender = rel.field4;
                                            break;
                                        }
                                    }
                                }
    
                            }
                        },
                        "familyDetails.familyMembers.familyMemberFirstName": {
                            schema: {
                                pattern: "^[a-zA-Z\. ]+$",
                                type: ["string", "null"],
                            },
                            validationMessage: {
                                202: "Only alphabets and space are allowed."
                            },
                        },
                        "familyDetails.familyMembers.incomes.monthsPerYear": {
                            required: true,
                            "$validators": {
                                validVaue: function(value) {
                                    if (value < 1 || value > 12) {
                                        return false;
                                    }
                                    return true;
                                }
                            },
                            "validationMessage": {
                                "validVaue": "range is between 1 to 12"
                            }
                        },
                        "BusinessOccupationDetails.businessDetails.ageOfEnterprise": {
                            type: "radios"
                        },
                        "BusinessOccupationDetails.businessDetails.ageOfEnterprise": {
                            type: "radios"
                        },
                        "BusinessOccupationDetails.businessDetails.workPlaceBuildType": {
                            "titleMap": {
                                "Concrete": "CONCRETE",
                                "MUD": "MUD",
                                "BRICK": "BRICK"
                            }
                        },
                        "BusinessOccupationDetails.agricultureDetails.irrigated": {
                            type: "checkbox",
                            "schema": {
                                "default": false
                            }
                        },
                        "BusinessOccupationDetails.agricultureDetails.landArea": {
                            "schema": {
                                "type": "number"
                            }
                        },
                        "assets.physicalAssets": {
                            titleExpr: "model.customer.physicalAssets[arrayIndex].assetType",
                        },
                        "assets.physicalAssets.ownedAssetDetails": {
                            type: "lov",
                            autolov: true,
                            lovonly: true,
                            bindMap: {},
                            searchHelper: formHelper,
                            search: function(inputModel, form, model, context) {
                                var assetType = model.customer.physicalAssets[context.arrayIndex].assetType;
                                var ownedAssetDetails = formHelper.enum('asset_Details').data;
                                var out = [];
                                if (ownedAssetDetails && ownedAssetDetails.length) {
                                    for (var i = 0; i < ownedAssetDetails.length; i++) {
    
                                        if ((ownedAssetDetails[i].parentCode).toUpperCase() == (assetType).toUpperCase()) {
                                            out.push({
                                                name: ownedAssetDetails[i].name,
                                                id: ownedAssetDetails[i].value
                                            })
                                        }
                                    }
                                }
                                if (!out.length) {
                                    out.push({
                                        name: "No Records",
                                    })
                                }
                                return $q.resolve({
                                    headers: {
                                        "x-total-count": out.length
                                    },
                                    body: out
                                });
                            },
                            onSelect: function(valueObj, model, context) {
                                if (valueObj.name == "No Records") {
                                    model.customer.physicalAssets[context.arrayIndex].ownedAssetDetails = '';
                                } else {
                                    model.customer.physicalAssets[context.arrayIndex].ownedAssetDetails = valueObj.name;
                                }
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.name
                                ];
                            }
                        },
                        "assets.physicalAssets.unit": {
                            "title": "UNIT",
                            type: "lov",
                            autolov: true,
                            lovonly: true,
                            bindMap: {},
                            searchHelper: formHelper,
                            search: function(inputModel, form, model, context) {
                                var assetType = model.customer.physicalAssets[context.arrayIndex].assetType;
                                var assetunit = formHelper.enum('asset_unit').data;
                                var out = [];
                                if (assetunit && assetunit.length) {
                                    for (var i = 0; i < assetunit.length; i++) {
    
                                        if ((assetunit[i].parentCode).toUpperCase() == (assetType).toUpperCase()) {
                                            out.push({
                                                name: assetunit[i].name,
                                            })
                                        }
                                    }
                                }
                                if (!out.length) {
                                    out.push({
                                        name: "No Records",
                                    })
                                }
                                return $q.resolve({
                                    headers: {
                                        "x-total-count": out.length
                                    },
                                    body: out
                                });
                            },
                            onSelect: function(valueObj, model, context) {
                                if (valueObj.name == "No Records") {
                                    model.customer.physicalAssets[context.arrayIndex].unit = '';
                                } else {
                                    model.customer.physicalAssets[context.arrayIndex].unit = valueObj.name;
                                }
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.name
                                ];
                            }
                        },
                        "assets.physicalAssets.numberOfOwnedAsset": {
                            "title": "NUMBER_OF_OWNED_ASSET",
                        },
                        "assets.physicalAssets.ownedAssetValue": {
                            "title": "OWNED_ASSET_VALUE"
                        },
                        "HouseVerification.caste": {
                            "required": true
                        },
                        "HouseVerification.language": {
                            "required": true
                        },
                        "HouseVerification.HouseDetails.landLordName": {
                            condition: "model.customer.udf.userDefinedFieldValues.udf3=='RENTED'"
                        },
                        "HouseVerification.HouseDetails.durationOfStay": {
                            "type": "number",
                            "schema": {
                                "type": "number"
                            }
                        },
                        "HouseVerification.HouseDetails.HouseVerification": {
                            type: "radios"
                        },
                        "HouseVerification.HouseDetails.HouseVerification": {
                            type: "radios"
                        },
                        "HouseVerification.HouseDetails.buildType": {
                            title: "BUILD_TYPE",
                            "type": "select",
                            "titleMap": {
                                "CONCRETE": "CONCRETE",
                                "MUD": "MUD",
                                "BRICK": "BRICK"
                            },
                            "schema": {
                                "type": "string"
                            }
                        },
                        "HouseVerification.HouseDetails.YearsOfBusinessPresentAddress": {
                            title: "NUMBER_OF_ROOMS",
                            "type": "number",
                            "schema": {
                                "type": "number"
                            }
                        },
                        "HouseVerification.HouseDetails.Toilet1": {
                            type: "checkbox",
                            "schema": {
                                "default": false
                            }
                        },
                        "HouseVerification.houseVerificationPhoto": {
                            "required": true,
                            type: "file",
                            fileType: "image/*",
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                        },
                        "HouseVerification.verifications.houseNo": {
                            "required": true,
                        },
                        "HouseVerification.verifications.referenceFirstName": {
                            "required": true,
                        },
                        "HouseVerification.verifications.relationship": {
                            "required": true,
                        },
                        "HouseVerification.place": {
                            required: true
                        },
                        "HouseVerification": {
                            orderNo: 131
                        }
                    }
                }
                var getIncludes = function (model) {

                    return [
                    "CustomerInformation",
                    "CustomerInformation.customerBranchId",
                    "CustomerInformation.centreId",
                    "CustomerInformation.enrolledAs",
                    "CustomerInformation.firstName",
                    "CustomerInformation.photoImageId",
                    "CustomerInformation.gender",
                    "CustomerInformation.age",
                    "CustomerInformation.dateOfBirth",
                    "CustomerInformation.maritalStatus",
                    "CustomerInformation.fatherFirstName",
                    "CustomerInformation.spouseFirstName",
                    "CustomerInformation.spouseDateOfBirth",
                    "CustomerInformation.dateOfBirth",
                    "KYC",
                    "KYC.aadhaarNo",
                    "KYC.IdentityProof1",
                    "KYC.IdentityProof1.identityProof",
                    "KYC.IdentityProof1.identityProofImageId",
                    "KYC.IdentityProof1.identityProofReverseImageId",
                    "KYC.IdentityProof1.identityProofNo",
                    "KYC.IdentityProof1.identityProofNo1",
                    "KYC.IdentityProof1.identityProofNo2",
                    "KYC.IdentityProof1.identityProofNo3",
                    "KYC.IdentityProof1.idProofIssueDate",
                    "KYC.IdentityProof1.idProofValidUptoDate",
                    "KYC.IdentityProof1.addressProofSameAsIdProof",
                    "KYC.addressProof1",
                    "KYC.addressProof1.addressProof",
                    "KYC.addressProof1.addressProofImageId",
                    "KYC.addressProof1.addressProofReverseImageId",
                    "KYC.addressProof1.addressProofNo",
                    "KYC.addressProof1.addressProofNo1",
                    "KYC.addressProof1.addressProofNo2",
                    "KYC.addressProof1.addressProofIssueDate",
                    "KYC.addressProof1.addressProofValidUptoDate",
                    "KYC.spouseIdProof",
                    "KYC.spouseIdProof.udf33",
                    "KYC.spouseIdProof.udf34",
                    "KYC.spouseIdProof.udf35",
                    "KYC.spouseIdProof.udf36",
                    "KYC.spouseIdProof.udf36_1",
                    "AdditionalKYC",
                    "AdditionalKYC.additionalKYCs",
                    "AdditionalKYC.additionalKYCs.kyc1ProofNumber4",
                    "AdditionalKYC.additionalKYCs.kyc1ProofType",
                    "AdditionalKYC.additionalKYCs.kyc1ImagePath",
                    "AdditionalKYC.additionalKYCs.kyc1ReverseImagePath",
                    "AdditionalKYC.additionalKYCs.kyc1IssueDate",
                    "AdditionalKYC.additionalKYCs.kyc1ValidUptoDate",
                    "AdditionalKYC.additionalKYCs.kyc2ProofNumber",
                    "AdditionalKYC.additionalKYCs.kyc2ProofType",
                    "AdditionalKYC.additionalKYCs.kyc2ImagePath",
                    "AdditionalKYC.additionalKYCs.kyc2ReverseImagePath",
                    "AdditionalKYC.additionalKYCs.kyc2IssueDate",
                    "AdditionalKYC.additionalKYCs.kyc2ValidUptoDate",
                    "ContactInformation",
                    "ContactInformation.CustomerResidentialAddress",
                    "ContactInformation.CustomerResidentialAddress.doorNo",
                    "ContactInformation.CustomerResidentialAddress.street",
                    "ContactInformation.CustomerResidentialAddress.locality",
                    "ContactInformation.CustomerResidentialAddress.villageName",
                    "ContactInformation.CustomerResidentialAddress.postOffice",
                    "ContactInformation.CustomerResidentialAddress.district",
                    "ContactInformation.CustomerResidentialAddress.pincode",
                    "ContactInformation.CustomerResidentialAddress.state",
                    "ContactInformation.CustomerResidentialAddress.stdCode",
                    "ContactInformation.landLineNo",
                    "ContactInformation.mobilePhone",
                    "ContactInformation.CustomerResidentialAddress.mailSameAsResidence",
                    "ContactInformation.CustomerPermanentAddress",
                    "ContactInformation.CustomerPermanentAddress.mailingDoorNo",
                    "ContactInformation.CustomerPermanentAddress.mailingStreet",
                    "ContactInformation.CustomerPermanentAddress.mailingLocality",
                    "ContactInformation.CustomerPermanentAddress.mailingPostoffice",
                    "ContactInformation.CustomerPermanentAddress.mailingDistrict",
                    "ContactInformation.CustomerPermanentAddress.mailingPincode",
                    "ContactInformation.CustomerPermanentAddress.mailingState",
                    "familyDetails",
                    "familyDetails.familyMembers",
                    "familyDetails.familyMembers.customerId",
                    "familyDetails.familyMembers.familyMemberFirstName",
                    "familyDetails.familyMembers.relationShip",
                    "familyDetails.familyMembers.gender",
                    "familyDetails.familyMembers.age",
                    "familyDetails.familyMembers.dateOfBirth",
                    "familyDetails.familyMembers.educationStatus",
                    "familyDetails.familyMembers.maritalStatus",
                    "familyDetails.familyMembers.mobilePhone",
                    "familyDetails.familyMembers.healthStatus",
                    "familyDetails.familyMembers.gender_readonly",
                    "familyDetails.familyMembers.age_readonly",
                    "familyDetails.familyMembers.dateOfBirth_readonly",
                    "familyDetails.familyMembers.maritalStatus_readonly",
                    "familyDetails.familyMembers.mobilePhone_readonly",
                    "familyDetails.familyMembers.incomes",
                    "familyDetails.familyMembers.incomes.incomeSource",
                    "familyDetails.familyMembers.incomes.incomeEarned",
                    "familyDetails.familyMembers.incomes.frequency",
                    "familyDetails.familyMembers.incomes.monthsPerYear",
                    "Liabilities1",
                    "Liabilities1.liabilities",
                    "Liabilities1.liabilities.loanType",
                    "Liabilities1.liabilities.loanSource",
                    "Liabilities1.liabilities.instituteName",
                    "Liabilities1.liabilities.loanAmountInPaisa",
                    "Liabilities1.liabilities.installmentAmountInPaisa",
                    "Liabilities1.liabilities.startDate",
                    "Liabilities1.liabilities.maturityDate",
                    "Liabilities1.liabilities.frequencyOfInstallment",
                    "Liabilities1.liabilities.liabilityLoanPurpose",
                    "assets",
                    "assets.physicalAssets",
                    "assets.physicalAssets.assetType",
                    "assets.physicalAssets.ownedAssetDetails",
                    "assets.physicalAssets.numberOfOwnedAsset",
                    "assets.physicalAssets.ownedAssetValue",
                    "assets.financialAssets",
                    "assets.financialAssets.instrumentType",
                    "assets.financialAssets.nameOfInstitution",
                    "assets.financialAssets.ownedBy",
                    "assets.financialAssets.insuranceType",
                    "assets.financialAssets.instituteType",
                    "assets.financialAssets.amountInPaisa",
                    "assets.financialAssets.frequencyOfDeposite",
                    "assets.financialAssets.startDate",
                    "assets.financialAssets.maturityDate",
                    "Expenditures1",
                    "Expenditures1.expenditures",
                    "Expenditures1.expenditures.expendituresSection",
                    "Expenditures1.expenditures.expendituresSection.expenditureSource",
                    "Expenditures1.expenditures.expendituresSection.customExpenditureSource",
                    "Expenditures1.expenditures.expendituresSection.frequencySection",
                    "Expenditures1.expenditures.expendituresSection.frequencySection.frequency",
                    "Expenditures1.expenditures.expendituresSection.annualExpensesSection",
                    "Expenditures1.expenditures.expendituresSection.annualExpensesSection.annualExpenses",
                    "BusinessOccupationDetails",
                    "BusinessOccupationDetails.customerOccupationType",
                    "BusinessOccupationDetails.businessDetails",
                    "BusinessOccupationDetails.businessDetails.relationshipWithBusinessOwner",
                    "BusinessOccupationDetails.businessDetails.business/employerName",
                    //"BusinessOccupationDetails.businessDetails.businessRegNo",
                    "BusinessOccupationDetails.businessDetails.businessVillage",
                    "BusinessOccupationDetails.businessDetails.businessLandmark",
                    "BusinessOccupationDetails.businessDetails.businessPincode",
                    "BusinessOccupationDetails.businessDetails.businessPhone",
                    "BusinessOccupationDetails.businessDetails.ageOfEnterprise",
                    // "BusinessOccupationDetails.businessDetails.workPeriod",
                    "BusinessOccupationDetails.businessDetails.workPlaceType",
                    // "BusinessOccupationDetails.businessDetails.WorkPlace",
                    // "BusinessOccupationDetails.businessDetails.WorkPlaceOthers",
                    "BusinessOccupationDetails.agricultureDetails",
                    "BusinessOccupationDetails.agricultureDetails.relationwithFarmer",
                    "BusinessOccupationDetails.agricultureDetails.landOwnership",
                    "BusinessOccupationDetails.agricultureDetails.nonIrrigated",
                    "BusinessOccupationDetails.agricultureDetails.irrigated",
                    "BusinessOccupationDetails.agricultureDetails.harvestMonth",
                    //"BusinessOccupationDetails.agricultureDetails.landArea",
                    "Biometric",
                    "Biometric.CaptureFingerPrint",
                    "Biometric.FingerPrintSection",
                    "HouseVerification",
                    "HouseVerification.fullName",
                    "HouseVerification.nameInLocalLanguage",
                    "HouseVerification.addressInLocalLanguage",
                    "HouseVerification.religion",
                    "HouseVerification.caste",
                    "HouseVerification.language",
                    "HouseVerification.HouseDetails",
                    "HouseVerification.HouseDetails.HouseOwnership",
                    "HouseVerification.HouseDetails.buildType",
                    "HouseVerification.HouseDetails.landLordName", //drinkingwater
                    "HouseVerification.HouseDetails.HouseVerification",
                    "HouseVerification.HouseDetails.Toilet1", //is toilet available
                    "HouseVerification.HouseDetails.durationOfStay", //toilet facility
                    "HouseVerification.HouseDetails.YearsOfBusinessPresentAddress",
                    "HouseVerification.nameOfRo",
                    "HouseVerification.houseVerificationPhoto",
                    "HouseVerification.verifications",
                    "HouseVerification.verifications.houseNo",
                    "HouseVerification.verifications.houseNoIsVerified1",
                    "HouseVerification.verifications.referenceFirstName",
                    "HouseVerification.verifications.referenceLastName",
                    "HouseVerification.verifications.relationship",
                    "actionbox",
                    "actionbox.submit",
                    "actionbox.save"
                    ];

                }

                return {
                    "type": "schema-form",
                    "title": "Enrollment",
                    "subTitle": "",
                    initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                        var branchId = SessionStore.getBranchId();
                        if (branchId && !model.customer.customerBranchId) {
                            model.customer.customerBranchId = branchId;
                        };
                        model.siteCode = SessionStore.getGlobalSetting('siteCode');

                        var self = this;
                        var formRequest = {
                            "overrides": overridesFields(model),
                            "includes": getIncludes(model),
                            "excludes": [
                            ],
                            "options": {
                                "repositoryAdditions": {
                                },
                                "additions": [
                                ]
                            }
                        };

                            if (!(model && model.customer && model.customer.id && model.$$STORAGE_KEY$$) && $stateParams.pageId) {
                                var customerId = $stateParams.pageId;
                                EnrolmentProcess.fromCustomerID(customerId)
                                    .subscribe(function(value){
                                        model.enrolmentProcess=value;
                                        model.customer=model.enrolmentProcess.customer;
                                        var deferred = $q.defer();
                                        var promise = deferred.promise;
                                        promise.then(function(resp) {
                                            self.form = IrfFormRequestProcessor.getFormDefinition('IndividualEnrollment', formRequest,configFile(), model);
                                            PageHelper.hideLoader();
                                        })
                                    });
                            } else {
                                EnrolmentProcess.createNewProcess()
                                .subscribe(function(enrolmentProcess) {
                                        model.enrolmentProcess=enrolmentProcess;
                                        model.customer=model.enrolmentProcess.customer;
                                        self.form = IrfFormRequestProcessor.getFormDefinition('IndividualEnrollment', formRequest, configFile(), model);
                                });
                            }

                            model.isFPEnrolled = function(fingerId) {
                                if (model.customer[BiometricService.getFingerTF(fingerId)] != null || (typeof(model.customer.$fingerprint) != 'undefined' && typeof(model.customer.$fingerprint[fingerId]) != 'undefined' && model.customer.$fingerprint[fingerId].data != null)) {
                                    return "fa-check text-success";
                                }
                                return "fa-close text-danger";
                            }
            
                            model.getFingerLabel = function(fingerId) {
                                return BiometricService.getLabel(fingerId);
                            }

                        /* Form rendering ends */
                    },

                    eventListeners: {
                        "lead-loaded": function (bundleModel, model, obj) {
                            return $q.when()
                                .then(function () {
                                    if (obj.applicantCustomerId) {
                                        return EnrolmentProcess.fromCustomerID(obj.applicantCustomerId).toPromise();
                                    } else {
                                        return null;
                                    }
                                })
                                .then(function (enrolmentProcess) {
                                    if (enrolmentProcess != null) {
                                        model.enrolmentProcess = enrolmentProcess;
                                        model.customer = enrolmentProcess.customer;
                                        model.loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, model.loanCustomerRelationType);
                                        BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, enrolmentProcess);
                                    }
                                    if (obj.leadCategory == 'Existing' || obj.leadCategory == 'Return') {
                                        model.customer.existingLoan = 'YES';
                                    } else {
                                        model.customer.existingLoan = 'NO';
                                    }
                                    model.customer.mobilePhone = obj.mobileNo;
                                    model.customer.gender = obj.gender;
                                    model.customer.firstName = obj.leadName;
                                    model.customer.maritalStatus = obj.maritalStatus;
                                    model.customer.customerBranchId = obj.branchId;
                                    model.customer.centreId = obj.centreId;
                                    model.customer.centreName = obj.centreName;
                                    model.customer.street = obj.addressLine2;
                                    model.customer.doorNo = obj.addressLine1;
                                    model.customer.pincode = obj.pincode;
                                    model.customer.district = obj.district;
                                    model.customer.state = obj.state;
                                    model.customer.locality = obj.area;
                                    model.customer.villageName = obj.cityTownVillage;
                                    model.customer.landLineNo = obj.alternateMobileNo;
                                    model.customer.dateOfBirth = obj.dob;
                                    model.customer.age = moment().diff(moment(obj.dob, SessionStore.getSystemDateFormat()), 'years');
                                    model.customer.gender = obj.gender;
                                    model.customer.referredBy = obj.referredBy;
                                    model.customer.landLineNo = obj.alternateMobileNo;
                                    model.customer.landmark = obj.landmark;
                                    model.customer.postOffice = obj.postOffice;

                                    for (var i = 0; i < model.customer.familyMembers.length; i++) {
                                        // $log.info(model.customer.familyMembers[i].relationShip);
                                        // model.customer.familyMembers[i].educationStatus = obj.educationStatus;
                                        if (model.customer.familyMembers[i].relationShip.toUpperCase() == "SELF") {
                                            model.customer.familyMembers[i].educationStatus = obj.educationStatus;
                                        }
                                    }
                                })
                        },
                        "origination-stage": function (bundleModel, model, obj) {
                            model.currentStage = obj
                        }
                    },
                    offline: false,
                    getOfflineDisplayItem: function (item, index) {
                        return [
                            item.customer.urnNo,
                            Utils.getFullName(item.customer.firstName, item.customer.middleName, item.customer.lastName),
                            item.customer.villageName
                        ]
                    },
                    form: [],

                    schema: function () {
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
                        reload: function(model, formCtrl, form, $event) {
                            $state.go("Page.Engine", {
                                pageName: 'customer.IndividualEnrollment3',
                                pageId: model.customer.id
                            }, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        },
                        submit: function(model, form, formName) {
                            var actions = this.actions;
                            $log.info("Inside submit()");
                            $log.warn(model);
                            if (!EnrollmentHelper.validateData(model)) {
                                $log.warn("Invalid Data, returning false");
                                return false;
                            }
                            model.siteCode = SessionStore.getGlobalSetting('siteCode');
                            var reqData = _.cloneDeep(model);
                            EnrollmentHelper.fixData(reqData);
        
                            try {
                                var liabilities = reqData['customer']['liabilities'];
                                if (liabilities && liabilities != null && typeof liabilities.length == "number" && liabilities.length > 0) {
                                    for (var i = 0; i < liabilities.length; i++) {
                                        var l = liabilities[i];
                                        l.loanAmountInPaisa = l.loanAmountInPaisa * 100;
                                        l.installmentAmountInPaisa = l.installmentAmountInPaisa * 100;
                                    }
                                }
                                var financialAssets = reqData['customer']['financialAssets'];
                                if (financialAssets && financialAssets != null && typeof financialAssets.length == "number" && financialAssets.length > 0) {
                                    for (var i = 0; i < financialAssets.length; i++) {
                                        var f = financialAssets[i];
                                        f.amountInPaisa = f.amountInPaisa * 100;
                                    }
                                }
                            } catch (e) {
                                $log.info("Error trying to change amount info.");
                            }
        
                            reqData['enrollmentAction'] = 'PROCEED';
        
                            irfProgressMessage.pop('enrollment-submit', 'Working... Please wait.', 5000);
                            reqData.customer.verified = true;
                            try {
                                if (reqData.customer.familyMembers) {
                                    for (var i = 0; i < reqData.customer.familyMembers.length; i++) {
                                        var incomes = reqData.customer.familyMembers[i].incomes;
                                        for (var j = 0; j < incomes.length; j++) {
                                            switch (incomes[i].frequency) {
                                                case 'M':
                                                    incomes[i].monthsPerYear = 12;
                                                    break;
                                                case 'Monthly':
                                                    incomes[i].monthsPerYear = 12;
                                                    break;
                                                case 'D':
                                                    incomes[i].monthsPerYear = 365;
                                                    break;
                                                case 'Daily':
                                                    incomes[i].monthsPerYear = 365;
                                                    break;
                                                case 'W':
                                                    incomes[i].monthsPerYear = 52;
                                                    break;
                                                case 'Weekly':
                                                    incomes[i].monthsPerYear = 52;
                                                    break;
                                                case 'F':
                                                    incomes[i].monthsPerYear = 26;
                                                    break;
                                                case 'Fornightly':
                                                    incomes[i].monthsPerYear = 26;
                                                    break;
                                                case 'Fortnightly':
                                                    incomes[i].monthsPerYear = 26;
                                                    break;
                                            }
                                        }
                                    }
                                }
                            } catch (err) {
                                console.error(err);
                            }
                            EnrollmentHelper.fixData(reqData);
                            if (reqData.customer.id) {
                                EnrollmentHelper.proceedData(reqData).then(function(resp) {
                                    PageHelper.showProgress('enrolment', 'Done.', 5000);
                                    $state.go('Page.Landing', null);
                                });
                            } else {
                                EnrollmentHelper.saveData(reqData).then(function(res) {
                                    if (model._lead) {
                                        var leadReqData = {
                                            lead: _.cloneDeep(model._lead),
                                            stage: "Completed"
                                        }
                                        leadReqData.lead.leadStatus = "Complete";
                                        LeadHelper.proceedData(leadReqData);
                                    }
                                    EnrollmentHelper.proceedData(res).then(function(resp) {
                                        PageHelper.showProgress('enrolment', 'Done.', 5000);
                                        $state.go('Page.Landing', null);
                                    }, function(err) {
                                        Utils.removeNulls(res.customer, true);
                                        model.customer = res.customer;
                                    });
                                });
                            }
                        },
                        // save: function (model, formCtrl, form, $event) {
                        //     PageHelper.clearErrors();
                        //     if (PageHelper.isFormInvalid(formCtrl)) {
                        //         return false;
                        //     }
                        //     formCtrl.scope.$broadcast('schemaFormValidate');

                        //     if (formCtrl && formCtrl.$invalid) {
                        //         PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                        //         return false;
                        //     }

                        //     // $q.all start
                        //     model.enrolmentProcess.save()
                        //         .finally(function () {
                        //             PageHelper.hideLoader();
                        //         })
                        //         .subscribe(function (value) {
                        //             formHelper.resetFormValidityState(formCtrl);
                        //             Utils.removeNulls(value, true);
                        //             PageHelper.showProgress('enrolment', 'Customer Saved.', 5000);
                        //             PageHelper.clearErrors();
                        //             BundleManager.pushEvent()
                        //         }, function (err) {
                        //             PageHelper.showErrors(err);
                        //             PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);

                        //             PageHelper.hideLoader();
                        //         });
                        // },
                        // proceed: function (model, form, formName) {
                        //     PageHelper.clearErrors();
                        //     if (PageHelper.isFormInvalid(form)) {
                        //         return false;
                        //     }
                        //     PageHelper.showProgress('enrolment', 'Updating Customer');
                        //     PageHelper.showLoader();
                        //     model.enrolmentProcess.proceed()
                        //         .finally(function () {
                        //             console.log("Inside hideLoader call");
                        //             PageHelper.hideLoader();
                        //         })
                        //         .subscribe(function (enrolmentProcess) {
                        //             formHelper.resetFormValidityState(form);
                        //             PageHelper.showProgress('enrolment', 'Done.', 5000);
                        //             PageHelper.clearErrors();
                        //             BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, enrolmentProcess);
                        //             BundleManager.pushEvent('new-enrolment', model._bundlePageObj, { customer: model.customer });

                        //         }, function (err) {
                        //             PageHelper.showErrors(err);
                        //             PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);

                        //         });
                        // },
                        // submit: function (model, form, formName) {
                        //     PageHelper.clearErrors();
                        //     if (PageHelper.isFormInvalid(form)) {
                        //         return false;
                        //     }
                        //     PageHelper.showProgress('enrolment', 'Updating Customer');
                        //     PageHelper.showLoader();
                        //     model.enrolmentProcess.save()
                        //         .finally(function () {
                        //             PageHelper.hideLoader();
                        //         })
                        //         .subscribe(function (enrolmentProcess) {
                        //             formHelper.resetFormValidityState(form);
                        //             PageHelper.showProgress('enrolment', 'Done.', 5000);
                        //             PageHelper.clearErrors();
                        //             BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, enrolmentProcess);
                        //             BundleManager.pushEvent('new-enrolment', model._bundlePageObj, { customer: model.customer });

                        //             model.enrolmentProcess.proceed()
                        //                 .subscribe(function (enrolmentProcess) {
                        //                     PageHelper.showProgress('enrolment', 'Done.', 5000);
                        //                 }, function (err) {
                        //                     PageHelper.showErrors(err);
                        //                     PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                        //                 })
                        //         }, function (err) {
                        //             PageHelper.showErrors(err);
                        //             PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                        //             PageHelper.hideLoader();
                        //         });
                        // }
                    }
                };
            }
        }
    })
