irf.pageCollection.factory(irf.page("customer.IndividualEnrollment3"), ["$log", "$state", "Enrollment", "IrfFormRequestProcessor", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$stateParams", "Lead", "LeadHelper",
    function($log, $state, Enrollment, IrfFormRequestProcessor, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $stateParams, Lead, LeadHelper) {
        var branch = SessionStore.getBranch();
        var getOverrides = function(model) {

            if (model.siteCode == "sambandh") {
                return {
                    "CustomerInformation.firstName": {
                        schema: {
                            pattern: "^[a-zA-Z\. ]+$",
                            type: ["string", "null"],
                        },
                        validationMessage: {
                            202: "Only alphabets and space are allowed."
                        },
                    },"KYC.IdentityProof1.identityProofImageId": {
                        "viewParams": function(modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                        fileType: "image/*",
                        offline: false,
                        using:"",//using scanner for document scanner trigger
                    },
                    "KYC.IdentityProof1.identityProofReverseImageId": {
                        "viewParams": function(modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                        fileType: "image/*",
                        offline: false,
                        using:"",
                    },
                    "KYC.addressProof1.addressProofImageId": {
                        "viewParams": function(modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                        fileType: "image/*",
                        offline: false,
                        using:""
                    },
                    "KYC.addressProof1.addressProofReverseImageId": {
                        "viewParams": function(modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                        fileType: "image/*",
                        offline: false,
                        using:""
                    },
                    "AdditionalKYC.additionalKYCs": {
                        add: true,
                        remove: true,
                        startEmpty: true,
                    },
                    "AdditionalKYC.additionalKYCs.kyc1ImagePath": {
                        required: true,
                        fileType: "image/*",
                        "using":"",
                        "viewParams": function(modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                    },
                    "CustomerInformation.customerBranchId": {
                        enumCode: "userbranches"
                    }, 
                    "CustomerInformation.centreId": {
                        "title": "CENTRE",
                    },
                    "CustomerInformation.spouseFirstName": {
                        "required": true,
                        "title": "HUSBAND_FIRST_NAME",
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
                        "title": "HUSBAND_DOB"
                    },
                    "CustomerInformation.fatherFirstName": {
                        schema: {
                            pattern: "^[a-zA-Z\. ]+$",
                            type: ["string", "null"],
                        },
                        validationMessage: {
                            202: "Only alphabets and space are allowed."
                        },
                    },
                    "ContactInformation.mobilePhone": {
                        "required": false
                    },
                    "CustomerInformation.age": {
                        "schema": {
                            "minimum": 18,
                            "maximum": 58,
                        }
                    },
                    "BusinessOccupationDetails.businessDetails.ageOfEnterprise": {
                        "enumCode": "years_of_business",
                        "title": "AGE_OF_ENTERPRISE"
                    },
                    "BusinessOccupationDetails.businessDetails.businessVillage": {
                        title: "NO_OF_WORKERS_EMPLOYED"
                    },
                    "BusinessOccupationDetails.businessDetails.businessLandmark": {
                        title: "KIND_OF_EMPLOYEES",
                        type: "select",
                        titleMap: {
                            "Female": "Female",
                            "Male": "Male",
                            "Both": "Both"
                        }
                    },
                    "BusinessOccupationDetails.businessDetails.businessPincode": {
                        title: "INVOLVEMENT_MARKET_RELATED_TRANSACTIONS",
                        type: "select",
                        titleMap: {
                            "YES": "Yes",
                            "NO": "NO",
                        },
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.businessDetails.workPlaceBuildType": {
                        "titleMap": {
                            "Concrete": "CONCRETE",
                            "MUD": "MUD",
                            "BRICK": "BRICK"
                        }
                    },
                    "BusinessOccupationDetails.businessDetails.businessPhone": {
                        title: "INCHARGE_WHEN_YOU_ARE_NOT_AVAILABLE",
                        type: "select",
                        titleMap: {
                            "Family Member": "Family Member",
                            "Employee": "Employee",
                            "Business Is Closed": "Business Is Closed"
                        },
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.agricultureDetails.nonIrrigated": {
                        title: "NON_IRRIGATED_LAND",
                        "type": "string",
                        inputmode: "number",
                        numberType: "tel",
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.agricultureDetails.irrigated": {
                        title: "IRRIGATED_LAND",
                        "type": "string",
                        inputmode: "number",
                        numberType: "tel",
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.agricultureDetails.harvestMonth": {
                        title: "TOTAL_LAND",
                        inputmode: "number",
                        numberType: "tel",
                        "type": "string",
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.agricultureDetails.landOwnership": {
                        titleMap: {
                            "Self": "Self",
                            "Others": "Others",
                        }
                    },
                    // "BusinessOccupationDetails.agricultureDetails.landArea": {
                    //     title: "DAIRY_ANIMALS",
                    //     "type": "select",
                    //     titleMap: {
                    //         "One": "One",
                    //         "Two": "Two",
                    //         "Three": "Three",
                    //         "Three": "Three",
                    //         "More": "If more, specify",
                    //     },
                    //     schema:{
                    //         "type":["string","null"],
                    //     }
                    // },
                    "HouseVerification.HouseDetails.HouseOwnership": {
                        required: true,
                        enumCode: "house_ownership",
                    },
                    "familyDetails.familyMembers": {
                        onArrayAdd: function(value, form, model, formCtrl, event) {
                            if ((model.customer.familyMembers.length - 1) === 0) {
                                model.customer.familyMembers[0].relationShip = 'self';
                                model.customer.familyMembers[0].gender = model.customer.gender;
                                model.customer.familyMembers[0].dateOfBirth = model.customer.dateOfBirth;
                                model.customer.familyMembers[0].age = model.customer.age;
                                model.customer.familyMembers[0].maritalStatus = model.customer.maritalStatus;
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
                    },
                    "familyDetails.additionalDetails.medicalCondition": {
                        title: "FAMILY_MEDICAL_CONDITION_QUESTION",
                        required: true,
                        "type": "radios",
                        "titleMap": {
                            "Yes": "Yes",
                            "No": "No",
                        }
                    },
                    "familyDetails.additionalDetails.privateHospitalTreatment": {
                        title: "HOSPITAL_TREATMENT_QUESTION",
                        required: true,
                        "type": "radios",
                        "titleMap": {
                            "Yes": "Yes",
                            "No": "No",
                            "NA": "NA",
                        }
                    },
                    "familyDetails.additionalDetails.householdFinanceRelatedDecision": {
                        title: "HOUSEHOLD_FINANCE_DECISION_QUESTION",
                        "type": "radios",
                        "titleMap": {
                            "Yes": "Yes",
                            "No": "No",
                            "NA": "NA",
                        }
                    },
                    "HouseVerification.HouseDetails.buildType": {
                        required: true,
                    },
                    "HouseVerification.HouseDetails.landLordName": {
                        title: "DRINKING_WATER",
                        required: true,
                        "type": "select",
                        "titleMap": {
                            "Owned": "Owned",
                            "Public": "Public",
                            "Shared": "Shared"
                        }
                    },
                    "HouseVerification.HouseDetails.HouseVerification": {
                        title: "WATER_FILTER",
                        required: true,
                        "type": "radios",
                        "titleMap": {
                            "Yes": "Yes",
                            "No": "No",
                        }
                    },
                    "HouseVerification.HouseDetails.durationOfStay": {
                        title: "TYPE_OF_TOILET_FACILITY",
                        required: true,
                        "type": "select",
                        order: 100,
                        "titleMap": {
                            "Own toilet": "Own toilet",
                            "Shared/public": "Shared/public",
                            "None/open space": "None/open space",
                        },
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "assets.financialAssets.instrumentType": {
                        required: false,
                    },
                    "assets.financialAssets.nameOfInstitution": {
                        required: false,
                    },
                    "assets.financialAssets.instituteType": {
                        required: false,
                    },
                    "assets.financialAssets.amountInPaisa": {
                        required: false,
                    },
                    "assets.financialAssets.frequencyOfDeposite": {
                        required: false,
                    },
                    "Liabilities1.liabilities.loanType": {
                        required: false,
                    },
                    "Liabilities1.liabilities.loanSource": {
                        required: false,
                    },
                    "Liabilities1.liabilities.instituteName": {
                        required: false,
                        type: "select",
                        enumCode: "loan_source_institutes",
                    },
                    "Liabilities1.liabilities.loanAmountInPaisa": {
                        required: false,
                    },
                    "Liabilities1.liabilities.installmentAmountInPaisa": {
                        required: false,
                    },
                    "Liabilities1.liabilities.frequencyOfInstallment": {
                        required: false,
                    },
                    "Liabilities1.liabilities.liabilityLoanPurpose": {
                        required: false,
                    },
                };
            } else if (model.siteCode == "KGFS") {
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
                                model.customer.familyMembers[0].relationShip = 'Self';
                                model.customer.familyMembers[0].customerId = model.customer.id;
                                model.customer.familyMembers[0].familyMemberFirstName = model.customer.firstName;
                                model.customer.familyMembers[0].mobilePhone = model.customer.mobilePhone;
                                model.customer.familyMembers[0].gender = model.customer.gender;
                                model.customer.familyMembers[0].dateOfBirth = model.customer.dateOfBirth;
                                model.customer.familyMembers[0].age = model.customer.age;
                                model.customer.familyMembers[0].maritalStatus = model.customer.maritalStatus;
                            }
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
                        "schema": {
                            "minimum": 1,
                            "maximum": 12,
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
                };
            } else if (model.siteCode == "saija") {
                return {
                    "CustomerInformation.customerBranchId": {
                        enumCode: "userbranches"
                    }, 
                    "CustomerInformation.centreId": {
                        "title": "CENTRE",
                    },
                    "CustomerInformation.spouseFirstName": {
                        "required": true
                    },
                    "CustomerInformation.spouseDateOfBirth": {
                        "required": true,
                    },
                    "ContactInformation.mobilePhone": {
                        "required": true,
                    },
                    "KYC.addressProof1.addressProof": {
                        readonly: true,
                    },
                    "AdditionalKYC.additionalKYCs": {
                        startEmpty: true,
                        schema: {
                            maxItems: 1
                        }
                    },
                    "ContactInformation.CustomerResidentialAddress": {
                        "orderNo": 21
                    },
                    "ContactInformation.CustomerPermanentAddress": {
                        "orderNo": 22
                    },
                    "ContactInformation.CustomerResidentialAddress": {
                        condition: "!model.customer.udf.userDefinedFieldValues.udf37"
                    },
                    "Expenditures1.expenditures": {
                        remove: null,
                    }
                };
            }
        }
        var getIncludes = function(model) {
            if (model.siteCode == "sambandh") {
                return [
                    "CustomerInformation",
                    "CustomerInformation.customerBranchId",
                    "CustomerInformation.centreId",
                    "CustomerInformation.area",
                    //"CustomerInformation.groupName",
                    //"CustomerInformation.loanCycle",
                    "CustomerInformation.firstName",
                    "CustomerInformation.photoImageId",
                    "CustomerInformation.gender",
                    "CustomerInformation.age",
                    "CustomerInformation.dateOfBirth",
                    "CustomerInformation.maritalStatus",
                    "CustomerInformation.fatherFirstName",
                    "CustomerInformation.spouseFirstName",
                    "CustomerInformation.spouseDateOfBirth",
                    "CustomerInformation.religion",
                    "CustomerInformation.caste",
                    "CustomerInformation.dateOfBirth",
                    "KYC",
                    "KYC.IdentityProof1",
                    "KYC.IdentityProof1.identityProof",
                    "KYC.IdentityProof1.identityProofImageId",
                    // "KYC.IdentityProof1.identityProofReverseImageId",
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
                    // "KYC.addressProof1.addressProofReverseImageId",
                    "KYC.addressProof1.addressProofNo",
                    "KYC.addressProof1.addressProofNo1",
                    "KYC.addressProof1.addressProofNo2",
                    "KYC.addressProof1.addressProofIssueDate",
                    "KYC.addressProof1.addressProofValidUptoDate",
                    "KYC.spouseIdProof",
                    "KYC.spouseIdProof.udf33",
                    "KYC.spouseIdProof.udf34",
                    "KYC.spouseIdProof.udf36",
                    "KYC.spouseIdProof.udf36_1",
                    "AdditionalKYC",
                    "AdditionalKYC.additionalKYCs",
                    "AdditionalKYC.additionalKYCs.kyc1ProofNumber",
                    "AdditionalKYC.additionalKYCs.kyc1ProofNumber1",
                    "AdditionalKYC.additionalKYCs.kyc1ProofNumber2",
                    "AdditionalKYC.additionalKYCs.kyc1ProofNumber3",
                    "AdditionalKYC.additionalKYCs.kyc1ProofType",
                    "AdditionalKYC.additionalKYCs.kyc1ImagePath",
                    "AdditionalKYC.additionalKYCs.kyc1IssueDate",
                    "AdditionalKYC.additionalKYCs.kyc1ValidUptoDate",
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
                    "loanInformation",
                    "loanInformation.requestedLoanAmount",
                    "loanInformation.requestedLoanPurpose",
                    "actionbox",
                    "actionbox.submit",
                    "actionbox.save",
                ];
            } else if (model.siteCode == "KGFS") {
                return [
                    "CustomerInformation",
                    "CustomerInformation.customerBranchId",
                    "CustomerInformation.centreId",
                    "CustomerInformation.enrolledAs",
                    //"CustomerInformation.area",
                    //"CustomerInformation.groupName",
                    //"CustomerInformation.loanCycle",
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
                    "loanInformation",
                    "loanInformation.requestedLoanAmount",
                    "loanInformation.requestedLoanPurpose",
                    "actionbox",
                    "actionbox.submit",
                    "actionbox.save",
                ];
            } else if (model.siteCode == "saija") {
                return [
                    "CustomerInformation",
                    "CustomerInformation.customerBranchId",
                    "CustomerInformation.centreId",
                    "CustomerInformation.area",
                    //"CustomerInformation.groupName",
                    //"CustomerInformation.loanCycle",
                    "CustomerInformation.firstName",
                    "CustomerInformation.gender",
                    "CustomerInformation.age",
                    "CustomerInformation.dateOfBirth",
                    "CustomerInformation.maritalStatus",
                    "CustomerInformation.fatherFirstName",
                    "CustomerInformation.spouseFirstName",
                    "CustomerInformation.spouseDateOfBirth",
                    "CustomerInformation.religion",
                    "CustomerInformation.caste",
                    "CustomerInformation.dateOfBirth",
                    "CustomerInformation.udf1",
                    "KYC",
                    "KYC.IdentityProof1",
                    "KYC.IdentityProof1.identityProof",
                    "KYC.IdentityProof1.identityProofImageId",
                    // "KYC.IdentityProof1.identityProofReverseImageId",
                    "KYC.IdentityProof1.identityProofNo",
                    "KYC.IdentityProof1.identityProofNo1",
                    "KYC.IdentityProof1.identityProofNo2",
                    "KYC.IdentityProof1.identityProofNo3",
                    "KYC.IdentityProof1.idProofIssueDate",
                    "KYC.IdentityProof1.idProofValidUptoDate",
                    //"KYC.IdentityProof1.addressProofSameAsIdProof",
                    "KYC.addressProof1",
                    "KYC.addressProof1.addressProof",
                    "KYC.addressProof1.addressProofImageId",
                    // "KYC.addressProof1.addressProofReverseImageId",
                    "KYC.addressProof1.addressProofNo",
                    "KYC.addressProof1.addressProofNo1",
                    "KYC.addressProof1.addressProofNo2",
                    "KYC.addressProof1.addressProofIssueDate",
                    "KYC.addressProof1.addressProofValidUptoDate",
                    "KYC.spouseIdProof",
                    "KYC.spouseIdProof.udf33",
                    "KYC.spouseIdProof.udf34",
                    "KYC.spouseIdProof.udf36",
                    "KYC.spouseIdProof.udf36_1",
                    "AdditionalKYC",
                    "AdditionalKYC.additionalKYCs",
                    "AdditionalKYC.additionalKYCs.kyc1ProofNumber",
                    "AdditionalKYC.additionalKYCs.kyc1ProofNumber1",
                    "AdditionalKYC.additionalKYCs.kyc1ProofNumber2",
                    "AdditionalKYC.additionalKYCs.kyc1ProofNumber3",
                    "AdditionalKYC.additionalKYCs.kyc1ProofType",
                    "AdditionalKYC.additionalKYCs.kyc1ImagePath",
                    "AdditionalKYC.additionalKYCs.kyc1IssueDate",
                    "AdditionalKYC.additionalKYCs.kyc1ValidUptoDate",
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
                    //"ContactInformation.CustomerResidentialAddress.mailSameAsResidence",
                    "ContactInformation.CustomerResidentialAddress.landLordName",
                    "ContactInformation.CustomerPermanentAddress",
                    "ContactInformation.CustomerPermanentAddress.mailingDoorNo",
                    "ContactInformation.CustomerPermanentAddress.mailingStreet",
                    "ContactInformation.CustomerPermanentAddress.mailingLocality",
                    "ContactInformation.CustomerPermanentAddress.mailingPostoffice",
                    "ContactInformation.CustomerPermanentAddress.mailingDistrict",
                    "ContactInformation.CustomerPermanentAddress.mailingPincode",
                    "ContactInformation.CustomerPermanentAddress.mailingState",
                    "ContactInformation.CustomerPermanentAddress.landLordName",
                    "ContactInformation.CustomerPermanentAddress.residenceSameAsMail",
                    "loanInformation",
                    "loanInformation.requestedLoanAmount",
                    "loanInformation.requestedLoanPurpose",
                    "actionbox",
                    "actionbox.submit",
                    "actionbox.save",
                ];
            }
        }
        return {
            "type": "schema-form",
            "title": "INDIVIDUAL_ENROLLMENT_3",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.customer = model.customer || {};
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
                model.customer.customerBranchId = model.customer.customerBranchId || SessionStore.getCurrentBranch().branchId;
                model.customer.date = model.customer.date || Utils.getCurrentDate();
                model.customer.nameOfRo = model.customer.nameOfRo || SessionStore.getLoginname();
                model = Utils.removeNulls(model, true);
                model.customer.kgfsName = model.customer.kgfsName || SessionStore.getCurrentBranch().branchName;
                if (model.siteCode == 'KGFS') {
                    model.customer.kgfsBankName = SessionStore.getBankName();
                }
                model.customer.customerType = model.customer.customerType || 'Individual';
                if (model.siteCode == 'saija') {
                    model.customer.addressProof = model.customer.addressProof || "Aadhar Card";
                    model.customer.mailSameAsResidence = false;
                }
                if (model.siteCode == 'sambandh') {
                    model.customer.gender = model.customer.gender || 'FEMALE';
                }
                var centres = SessionStore.getCentres();
                if (centres && centres.length > 0) {
                    model.customer.centreId = model.customer.centreId || centres[0].id;
                }
                var self = this;
                var formRequest = {
                    "overrides": getOverrides(model),
                    "includes": getIncludes(model),
                    "excludes": [
                        "KYC.addressProofSameAsIdProof",
                    ],
                };

                if (_.hasIn($stateParams.pageData, 'lead_id') && _.isNumber($stateParams.pageData['lead_id'])) {
                    PageHelper.showLoader();
                    PageHelper.showProgress("Enrollment-input", 'Loading lead details');
                    var _leadId = $stateParams.pageData['lead_id'];
                    Lead.get({
                            id: _leadId
                        })
                        .$promise
                        .then(function(res) {
                            PageHelper.showProgress('Enrollment-input', 'Done.', 5000);
                            model._lead = res;
                            model.customer.mobilePhone = res.mobileNo;
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
                            model.customer.gender = res.gender;
                            model.customer.landLineNo = res.alternateMobileNo;


                            for (var i = 0; i < model.customer.familyMembers.length; i++) {
                                $log.info(model.customer.familyMembers[i].relationShip);
                                model.customer.familyMembers[i].educationStatus = obj.educationStatus;
                            }
                        }, function(httpRes) {
                            PageHelper.showErrors(httpRes);
                        })
                        .finally(function() {
                            PageHelper.hideLoader();
                        })
                }

                model.isFPEnrolled = function(fingerId) {
                    //$log.info("Inside isFPEnrolled: " + BiometricService.getFingerTF(fingerId) + " :"  + fingerId);
                    if (model.customer[BiometricService.getFingerTF(fingerId)] != null || (typeof(model.customer.$fingerprint) != 'undefined' && typeof(model.customer.$fingerprint[fingerId]) != 'undefined' && model.customer.$fingerprint[fingerId].data != null)) {
                        //$log.info("Inside isFPEnrolled: :true");
                        return "fa-check text-success";
                    }
                    //$log.info("Inside isFPEnrolled: false");
                    return "fa-close text-danger";
                }

                model.getFingerLabel = function(fingerId) {
                    return BiometricService.getLabel(fingerId);
                }

                this.form = IrfFormRequestProcessor.getFormDefinition('IndividualEnrollment', formRequest);
                //this.form.push(actionbox);
                console.log(this.form);
            },
            modelPromise: function(pageId, _model) {
                var deferred = $q.defer();
                PageHelper.showLoader();
                irfProgressMessage.pop("enrollment", "Loading Customer Data...");
                Enrollment.getCustomerById({
                    id: pageId
                }, function(resp, header) {
                    var model = {
                        $$OFFLINE_FILES$$: _model.$$OFFLINE_FILES$$
                    };
                    model.customer = resp;
                    if (_.hasIn($stateParams.pageData, 'currentStage') && $stateParams.pageData.currentStage != resp.currentStage) {
                        irfProgressMessage.pop("enrollment", "Customer data is in different stage", 5000);
                        $state.go("Page.Engine", {
                            pageName: "CustomerSearch",
                            pageId: null
                        });
                    }
                    if (model.customer.age > 0) {
                        if (model.customer.dateOfBirth) {
                            model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-') + moment(model.customer.dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                        } else {
                            model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-MM-DD');
                        }
                    }
                    if (model.customer.dateOfBirth) {
                        model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                    }

                    for (var idx = 0; idx < model.customer.familyMembers.length; idx++) {
                        if (model.customer.familyMembers[idx].dateOfBirth) {
                            model.customer.familyMembers[idx].age = moment().diff(moment(model.customer.familyMembers[idx].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                    }
                    if (model.customer.udf && model.customer.udf.userDefinedFieldValues &&
                        model.customer.udf.userDefinedFieldValues.udf1) {
                        model.customer.udf.userDefinedFieldValues.udf1 =
                            model.customer.udf.userDefinedFieldValues.udf1 === true ||
                            model.customer.udf.userDefinedFieldValues.udf1 === 'true';
                    }
                    if (model.customer.udf && model.customer.udf.userDefinedFieldValues &&
                        model.customer.udf.userDefinedFieldValues.udf37 && SessionStore.getGlobalSetting('siteCode') == 'saija') {
                        model.customer.udf.userDefinedFieldValues.udf37 = model.customer.udf.userDefinedFieldValues.udf37 == 'true' ? true : false;
                    }
                    deferred.resolve(model);
                    PageHelper.hideLoader();
                }, function(resp) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("enrollment", "An Error Occurred. Failed to fetch Data", 5000);
                    $stateParams.confirmExit = false;
                    $state.go("Page.Engine", {
                        pageName: "CustomerSearch",
                        pageId: null
                    });
                    deferred.reject();
                });
                return deferred.promise;
            },
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return [
                    item.customer.urnNo,
                    Utils.getFullName(item.customer.firstName, item.customer.middleName, item.customer.lastName),
                    item.customer.villageName
                ]
            },
            form: [],

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
                }
            }
        };
    }
]);