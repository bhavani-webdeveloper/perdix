irf.pageCollection.factory(irf.page("customer.IndividualEnrollmentStage2"), ["$log", "$state", "Enrollment", "IrfFormRequestProcessor", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$stateParams", "Lead",
    function($log, $state, Enrollment, IrfFormRequestProcessor, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $stateParams, Lead) {
        var branch = SessionStore.getBranch();
        var getOverrides = function(model) {

            if (model.siteCode == "saija") {
                var customReadonly = false;
                if (_.hasIn($stateParams.pageData, 'currentStage') && $stateParams.pageData.currentStage == 'Stage02') {
                    customReadonly = true;
                }
                return {
                    "CustomerInformation": {
                        "readonly": customReadonly
                    },
                    "ContactInformation": {
                        "readonly": customReadonly
                    },
                    "KYC": {
                        "readonly": customReadonly
                    },
                    "AdditionalKYC": {
                        "readonly": customReadonly
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
                    "BusinessOccupationDetails.businessDetails.ageOfEnterprise": {
                        "enumCode": "years_of_business",
                        "title": "AGE_OF_ENTERPRISE"
                    },
                    "BusinessOccupationDetails.businessDetails.workPeriod": {
                        enumCode: "bsns_in_current_addrss_since",
                        title: "YEARS_OF_BUSINESS_PRESENT_ADDRESS",
                        type: "select",
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.businessDetails.businessVillage": {
                        title: "BUSINESS_REGISTRATION_NUMBER"
                    },
                    "BusinessOccupationDetails.businessDetails.businessLandmark": {
                        title: "WORK_LOCATION",
                        type: "select",
                        titleMap: {
                            "Shop": "Shop",
                            "Homebased": "Homebased",
                            "Market": "Market",
                            "Others": "Others"
                        }
                    },
                    "BusinessOccupationDetails.businessDetails.businessPincode": {
                        title: "BUSINESS_GROWTH",
                        type: "select",
                        titleMap: {
                            "Normal": "Normal",
                            "Poor": "Poor",
                        },
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.businessDetails.businessPhone": {
                        title: "INCHARGE_WHEN_YOU_ARE_NOT_AVAILABLE",
                        type: "string",
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.businessDetails.workPlaceType": {
                        title: "WORK_PLACE_OWNERSHIP",
                    },
                    "BusinessOccupationDetails.businessDetails.workPlaceBuildType": {
                        "titleMap": {
                            "Concrete": "Concrete",
                            "Semi-Concrete": "Semi-Concrete",
                            "Kuccha": "Kuccha",
                            "Handcart": "Handcart",
                        }
                    },
                    "BusinessOccupationDetails.agricultureDetails.nonIrrigated": {
                        title: "NON_IRRIGATED_LAND",
                        "type": "string",
                        "$validators": {
                            validVaue: function(value) {
                                if (angular.isUndefined(value) || value == null)
                                    true;
                                else {
                                    var patt = /^(\d*)\.{0,1}(\d*)$/;
                                    return patt.test(value);
                                }
                            }
                        },
                        "validationMessage": {
                            "validVaue": "only numbers are allowed."
                        },
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.agricultureDetails.irrigated": {
                        title: "IRRIGATED_LAND",
                        "type": "string",
                        "$validators": {
                            validVaue: function(value) {
                                if (angular.isUndefined(value) || value == null)
                                    true;
                                else {
                                    var patt = /^(\d*)\.{0,1}(\d*)$/;
                                    return patt.test(value);
                                }
                            }
                        },
                        "validationMessage": {
                            "validVaue": "only numbers are allowed."
                        },
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.agricultureDetails.cropName": {
                        title: "CROP_NAME",
                        "type": "string",
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.agricultureDetails.harvestMonth": {
                        title: "HARVEST_MONTH",
                        "type": "select",
                        "titleMap": {
                            "Jan": "Jan",
                            "Feb": "Feb",
                            "Mar": "Mar",
                            "Apr": "Apr",
                            "May": "May",
                            "Jun": "Jun",
                            "Jul": "Jul",
                            "Aug": "Aug",
                            "Sep": "Sep",
                            "Oct": "Oct",
                            "Nov": "Nov",
                            "Dec": "Dec"
                        },
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.agricultureDetails.landOwnership": {
                        titleMap: {
                            "Rented/Leased": "Rented/Leased",
                            "Owned": "Owned",
                        }
                    },
                    "BusinessOccupationDetails.agricultureDetails.landArea": {
                        title: "LAND_LOCATION",
                        "type": "select",
                        titleMap: {
                            "Within Village": "Within Village",
                            "Outside Village": "Outside Village",
                        },
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
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
                                model.customer.familyMembers[0].mobilePhone = model.customer.mobilePhone;
                            }
                        }
                    },
                    "familyDetails.familyMembers.healthStatus": {
                        titleMap: {
                            "GOOD": "Healthy",
                            "BAD": "UnHealthy"
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
                    "familyDetails.familyMembers.contributionToExpenditure": {
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
                    "HouseVerification.nameOfRo": {
                        orderNo: 1,
                    },
                    "HouseVerification.HouseDetails.buildType": {
                        required: true,
                    },
                    "HouseVerification.HouseDetails.landLordName": {
                        title: "NO_OF_ROOMS",
                        required: true,
                        "type": "select",
                        "titleMap": {
                            "1": "1",
                            "2": "2",
                            "3": "3",
                            "4": "4",
                            ">4": ">4",
                        }
                    },
                    "HouseVerification.HouseDetails.HouseVerification": {
                        title: "HOUSE_CONDITION",
                        required: true,
                        "type": "radios",
                        "titleMap": {
                            "Good": "Good",
                            "Average": "Average",
                            "Poor": "Poor",
                        }
                    },
                    "HouseVerification.HouseDetails.durationOfStay": {
                        title: "TOILET_FACILITY",
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
                    "HouseVerification.houseVerificationPhoto": {
                        required: true,
                    },
                    "Expenditures1.expenditures.expendituresSection.expenditureSource": {
                        required: true,
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
            } else if (model.siteCode == "sambandh") {
                var customReadonly = false;
                if (_.hasIn($stateParams.pageData, 'currentStage') && $stateParams.pageData.currentStage == 'Stage02') {
                    customReadonly = true;
                }
                return {
                    "CustomerInformation": {
                        "readonly": customReadonly
                    },
                    "ContactInformation": {
                        "readonly": customReadonly
                    },
                    "KYC": {
                        "readonly": customReadonly
                    },
                    "AdditionalKYC": {
                        "readonly": customReadonly
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
                    "AdditionalKYC.additionalKYCs": {
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
                    "BusinessOccupationDetails.businessDetails.ageOfEnterprise": {
                        "enumCode": "years_of_business",
                        "title": "AGE_OF_ENTERPRISE"
                    },
                    "BusinessOccupationDetails.businessDetails.workPeriod": {
                        enumCode: "bsns_in_current_addrss_since",
                        title: "YEARS_OF_BUSINESS_PRESENT_ADDRESS",
                        type: "select",
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.businessDetails.businessVillage": {
                        title: "BUSINESS_REGISTRATION_NUMBER"
                    },
                    "BusinessOccupationDetails.businessDetails.businessLandmark": {
                        title: "WORK_LOCATION",
                        type: "select",
                        titleMap: {
                            "Shop": "Shop",
                            "Homebased": "Homebased",
                            "Market": "Market",
                            "Others": "Others"
                        }
                    },
                    "BusinessOccupationDetails.businessDetails.businessPincode": {
                        title: "BUSINESS_GROWTH",
                        type: "select",
                        titleMap: {
                            "Normal": "Normal",
                            "Poor": "Poor",
                        },
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.businessDetails.businessPhone": {
                        title: "INCHARGE_WHEN_YOU_ARE_NOT_AVAILABLE",
                        type: "string",
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.businessDetails.workPlaceType": {
                        title: "WORK_PLACE_OWNERSHIP",
                    },
                    "BusinessOccupationDetails.businessDetails.workPlaceBuildType": {
                        "titleMap": {
                            "Concrete": "Concrete",
                            "Semi-Concrete": "Semi-Concrete",
                            "Kuccha": "Kuccha",
                            "Handcart": "Handcart",
                        }
                    },
                    "BusinessOccupationDetails.agricultureDetails.nonIrrigated": {
                        title: "NON_IRRIGATED_LAND",
                        "type": "string",
                        "$validators": {
                            validVaue: function(value) {
                                if (angular.isUndefined(value) || value == null)
                                    true;
                                else {
                                    var patt = /^(\d*)\.{0,1}(\d*)$/;
                                    return patt.test(value);
                                }
                            }
                        },
                        "validationMessage": {
                            "validVaue": "only numbers are allowed."
                        },
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.agricultureDetails.irrigated": {
                        title: "IRRIGATED_LAND",
                        "type": "string",
                        "$validators": {
                            validVaue: function(value) {
                                if (angular.isUndefined(value) || value == null)
                                    true;
                                else {
                                    var patt = /^(\d*)\.{0,1}(\d*)$/;
                                    return patt.test(value);
                                }
                            }
                        },
                        "validationMessage": {
                            "validVaue": "only numbers are allowed."
                        },
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.agricultureDetails.cropName": {
                        title: "CROP_NAME",
                        "type": "string",
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.agricultureDetails.harvestMonth": {
                        title: "HARVEST_MONTH",
                        "type": "select",
                        "titleMap": {
                            "Jan": "Jan",
                            "Feb": "Feb",
                            "Mar": "Mar",
                            "Apr": "Apr",
                            "May": "May",
                            "Jun": "Jun",
                            "Jul": "Jul",
                            "Aug": "Aug",
                            "Sep": "Sep",
                            "Oct": "Oct",
                            "Nov": "Nov",
                            "Dec": "Dec"
                        },
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
                    "BusinessOccupationDetails.agricultureDetails.landOwnership": {
                        titleMap: {
                            "Rented/Leased": "Rented/Leased",
                            "Owned": "Owned",
                        }
                    },
                    "BusinessOccupationDetails.agricultureDetails.landArea": {
                        title: "LAND_LOCATION",
                        "type": "select",
                        titleMap: {
                            "Within Village": "Within Village",
                            "Outside Village": "Outside Village",
                        },
                        schema: {
                            "type": ["string", "null"],
                        }
                    },
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
                                model.customer.familyMembers[0].mobilePhone = model.customer.mobilePhone;
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
                    "familyDetails.familyMembers.healthStatus": {
                        titleMap: {
                            "GOOD": "Healthy",
                            "BAD": "UnHealthy"
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
                    "familyDetails.familyMembers.contributionToExpenditure": {
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
                    "assets.physicalAssets":{
                        titleExpr: "model.customer.physicalAssets[arrayIndex].ownedAssetDetails | translate",
                        remove:null,
                        onArrayAdd: function(value, form, model, formCtrl, event) {
                            if ((model.customer.physicalAssets.length - 1) === 0) {
                                PageHelper.showLoader();
                                var physicalAssets=[];
                                Queries.getPhysicalAssetsList().then(function(res){
                                    $log.info(res);
                                    if(res && res.length && res.length>0){
                                        for(i in res){
                                            var obj={};
                                            obj.assetType= res[i].asset;
                                            obj.ownedAssetDetails=res[i].asset_details;
                                            obj.numberOfOwnedAsset=1;
                                            physicalAssets.push(obj);   
                                        }
                                      model.customer.physicalAssets=physicalAssets;
                                    }
                                    PageHelper.hideLoader();
                                },function(err){
                                    $log.info(err);
                                    PageHelper.hideLoader();
                                });
                            }
                        },
                    },
                    "assets.physicalAssets.assetType":{
                        "type":"string",
                        "readonly":true
                    },
                    "assets.physicalAssets.ownedAssetDetails":{
                        "type":"string",
                        "readonly":true
                    },
                    "HouseVerification.nameOfRo": {
                        orderNo: 1,
                    },
                    "HouseVerification.HouseDetails.buildType": {
                        required: true,
                    },
                    "HouseVerification.HouseDetails.landLordName": {
                        title: "NO_OF_ROOMS",
                        required: true,
                        "type": "select",
                        "titleMap": {
                            "1": "1",
                            "2": "2",
                            "3": "3",
                            "4": "4",
                            ">4": ">4",
                        }
                    },
                    "HouseVerification.HouseDetails.HouseVerification": {
                        title: "HOUSE_CONDITION",
                        required: true,
                        "type": "radios",
                        "titleMap": {
                            "Good": "Good",
                            "Average": "Average",
                            "Poor": "Poor",
                        }
                    },
                    "HouseVerification.HouseDetails.durationOfStay": {
                        title: "TOILET_FACILITY",
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
                    "HouseVerification.houseVerificationPhoto": {
                        required: true,
                    },
                    "Expenditures1.expenditures.expendituresSection.expenditureSource": {
                        required: true,
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
            }
        }
        var getIncludes = function(model) {
            if (model.siteCode == "saija") {
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
                    "familyDetails.familyMembers.contributionToExpenditure",
                    "familyDetails.familyMembers.incomes",
                    "familyDetails.familyMembers.incomes.incomeSource",
                    "familyDetails.familyMembers.incomes.incomeEarned",
                    "familyDetails.familyMembers.incomes.frequency",
                    "familyDetails.familyMembers.incomes.monthsPerYear",
                    "familyDetails.familyMembers.gender_readonly",
                    "familyDetails.familyMembers.age_readonly",
                    "familyDetails.familyMembers.dateOfBirth_readonly",
                    "familyDetails.familyMembers.maritalStatus_readonly",
                    "familyDetails.familyMembers.mobilePhone_readonly",

                    "familyDetails.additionalDetails",
                    // "familyDetails.additionalDetails.medicalCondition",
                    // "familyDetails.additionalDetails.privateHospitalTreatment",
                    // "familyDetails.additionalDetails.householdFinanceRelatedDecision",
                    "HouseVerification",
                    "HouseVerification.nameOfRo",
                    "HouseVerification.HouseDetails",
                    "HouseVerification.HouseDetails.HouseOwnership",
                    "HouseVerification.HouseDetails.landLordName", //drinkingwater
                    "HouseVerification.HouseDetails.HouseVerification", //waterfilter
                    //"HouseVerification.HouseDetails.Toilet",//is toilet available
                    "HouseVerification.HouseDetails.durationOfStay", //toilet facility
                    "HouseVerification.HouseDetails.buildType",
                    "HouseVerification.latitude",
                    "HouseVerification.houseVerificationPhoto",
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
                    "BusinessOccupationDetails.businessDetails.workPeriod",
                    "BusinessOccupationDetails.businessDetails.workPlaceType",
                    "BusinessOccupationDetails.businessDetails.workPlaceBuildType",
                    // "BusinessOccupationDetails.businessDetails.WorkPlaceOthers",
                    "BusinessOccupationDetails.agricultureDetails",
                    "BusinessOccupationDetails.agricultureDetails.relationwithFarmer",
                    "BusinessOccupationDetails.agricultureDetails.landOwnership",
                    "BusinessOccupationDetails.agricultureDetails.nonIrrigated",
                    "BusinessOccupationDetails.agricultureDetails.irrigated",
                    "BusinessOccupationDetails.agricultureDetails.cropName",
                    "BusinessOccupationDetails.agricultureDetails.harvestMonth",
                    "BusinessOccupationDetails.agricultureDetails.landArea",
                    "bankAccounts",
                    "bankAccounts.customerBankAccounts",
                    "bankAccounts.customerBankAccounts.ifscCode",
                    "bankAccounts.customerBankAccounts.customerBankName",
                    "bankAccounts.customerBankAccounts.customerBankBranchName",
                    "bankAccounts.customerBankAccounts.customerNameAsInBank",
                    "bankAccounts.customerBankAccounts.accountNumber",
                    "bankAccounts.customerBankAccounts.accountType",
                    "bankAccounts.customerBankAccounts.bankStatementDocId",
                    "loanInformation",
                    "loanInformation.requestedLoanAmount",
                    "loanInformation.requestedLoanPurpose",
                    "actionbox",
                    "actionbox.submit",
                    "actionbox.save",
                ];
            } else if (model.siteCode == "sambandh") {
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
                    "familyDetails.familyMembers.contributionToExpenditure",
                    "familyDetails.familyMembers.incomes",
                    "familyDetails.familyMembers.incomes.incomeSource",
                    "familyDetails.familyMembers.incomes.incomeEarned",
                    "familyDetails.familyMembers.incomes.frequency",
                    "familyDetails.familyMembers.incomes.monthsPerYear",
                    "familyDetails.familyMembers.gender_readonly",
                    "familyDetails.familyMembers.age_readonly",
                    "familyDetails.familyMembers.dateOfBirth_readonly",
                    "familyDetails.familyMembers.maritalStatus_readonly",
                    "familyDetails.familyMembers.mobilePhone_readonly",

                    "familyDetails.additionalDetails",
                    // "familyDetails.additionalDetails.medicalCondition",
                    // "familyDetails.additionalDetails.privateHospitalTreatment",
                    // "familyDetails.additionalDetails.householdFinanceRelatedDecision",
                    "HouseVerification",
                    "HouseVerification.nameOfRo",
                    "HouseVerification.HouseDetails",
                    "HouseVerification.HouseDetails.HouseOwnership",
                    "HouseVerification.HouseDetails.landLordName", //drinkingwater
                    "HouseVerification.HouseDetails.HouseVerification", //waterfilter
                    //"HouseVerification.HouseDetails.Toilet",//is toilet available
                    "HouseVerification.HouseDetails.durationOfStay", //toilet facility
                    "HouseVerification.HouseDetails.buildType",
                    "HouseVerification.latitude",
                    "HouseVerification.houseVerificationPhoto",
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
                    "BusinessOccupationDetails.businessDetails.workPeriod",
                    "BusinessOccupationDetails.businessDetails.workPlaceType",
                    "BusinessOccupationDetails.businessDetails.workPlaceBuildType",
                    // "BusinessOccupationDetails.businessDetails.WorkPlaceOthers",
                    "BusinessOccupationDetails.agricultureDetails",
                    "BusinessOccupationDetails.agricultureDetails.relationwithFarmer",
                    "BusinessOccupationDetails.agricultureDetails.landOwnership",
                    "BusinessOccupationDetails.agricultureDetails.nonIrrigated",
                    "BusinessOccupationDetails.agricultureDetails.irrigated",
                    "BusinessOccupationDetails.agricultureDetails.cropName",
                    "BusinessOccupationDetails.agricultureDetails.harvestMonth",
                    "BusinessOccupationDetails.agricultureDetails.landArea",
                    "bankAccounts",
                    "bankAccounts.customerBankAccounts",
                    "bankAccounts.customerBankAccounts.ifscCode",
                    "bankAccounts.customerBankAccounts.customerBankName",
                    "bankAccounts.customerBankAccounts.customerBankBranchName",
                    "bankAccounts.customerBankAccounts.customerNameAsInBank",
                    "bankAccounts.customerBankAccounts.accountNumber",
                    "bankAccounts.customerBankAccounts.accountType",
                    "bankAccounts.customerBankAccounts.bankStatementDocId",
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
                model.customer.customerType = model.customer.customerType || 'Individual';
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
                    ]
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

                this.form = IrfFormRequestProcessor.getFormDefinition('IndividualEnrollment', formRequest);
                //this.form.push(actionbox);
                console.log(this.form);
            },
            modelPromise: function(pageId, _model) {
                var deferred = $q.defer();
                PageHelper.showLoader();
                irfProgressMessage.pop("enrollment", "Loading Customer Data...", 6000);
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
                        pageName: 'customer.IndividualEnrollmentStage2',
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
                    if (!model.customer.familyMembers || model.customer.familyMembers.length < 0) {
                        irfProgressMessage.pop('enrollment-submit', 'Please add Family Details information to proceed.', 5000);
                        return false;
                    } else {
                        var selfAvailable = false;
                        for (var idx = 0; idx < model.customer.familyMembers.length; idx++) {
                            if (model.customer.familyMembers[idx].relationShip == "self") {
                                selfAvailable = true;
                                break;
                            }
                        }
                        if (!selfAvailable) {
                            irfProgressMessage.pop('enrollment-submit', 'Self information in Family Details section is mandatory to proceed.', 5000);
                            return false;
                        }
                    }
                    if (model.customer.maritalStatus && model.customer.maritalStatus.toUpperCase() == 'MARRIED') {
                        var spouseInfoReq = true;
                        for (var idx = 0; idx < model.customer.familyMembers.length; idx++) {
                            if (model.customer.familyMembers[idx].relationShip == "Husband" ||
                                model.customer.familyMembers[idx].relationShip == "Wife") {
                                spouseInfoReq = false;
                                break;
                            }
                        }

                        if (spouseInfoReq) {
                            irfProgressMessage.pop('enrollment-submit', 'Please add customer Spouse information in Family Details section also to proceed.', 5000);
                            return false;
                        }
                    }
                    model.siteCode = SessionStore.getGlobalSetting('siteCode');
                    var reqData = _.cloneDeep(model);
                    EnrollmentHelper.fixData(reqData);

                    reqData['enrollmentAction'] = 'PROCEED';

                    irfProgressMessage.pop('enrollment-submit', 'Working... Please wait.', 5000);
                    reqData.customer.verified = true;
                    EnrollmentHelper.fixData(reqData);
                    if (reqData.customer.id) {
                        EnrollmentHelper.proceedData(reqData).then(function(resp) {
                            PageHelper.showProgress('enrolment', 'Done.', 5000);
                            $state.go('Page.Landing', null);
                        });
                    } else {
                        EnrollmentHelper.saveData(reqData).then(function(res) {
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