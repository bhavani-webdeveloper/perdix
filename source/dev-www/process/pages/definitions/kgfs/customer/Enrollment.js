define(['perdix/domain/model/customer/EnrolmentProcess',
    'perdix/infra/api/AngularResourceService'],
    function (EnrolmentProcess, AngularResourceService) {
        EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
        return {
            pageUID: "kgfs.customer.Enrollment",
            pageType: "Engine",
            dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper",
                "$q", "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries",
                "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository","irfProgressMessage","Files","translateFilter","BranchCreationResource","Lead", "irfNavigator"],

            $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch,
                BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository,irfProgressMessage,Files,translateFilter,BranchCreationResource,Lead,irfNavigator) {

                AngularResourceService.getInstance().setInjector($injector);
                var branch = SessionStore.getBranch();
                // TODO Hd -> Has to make it as nameParamneter supporatable function
                var policyOnSubmit = function(policyName,model){
                    if(policyName){
                        if(policyName == "minimumFamilyMembers"){
                            if(model.customer.familyMembers.length<1){
                                PageHelper.showErrors({
                                    "data":{
                                        "error":"Minimum One Familymember is required other than Self."
                                    }
                                });
                                PageHelper.hideLoader();
                                return false;
                            }
                        }
                    }
                    else{
                        // allPolicies
                    }
                    return true;
                }
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
                        "KYC":{
                            orderNo:1
                        },
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
                            required: false,
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
                        "KYC.IdentityProof1.idProofIssueDate":{
                            onChange: function (value, form, model, event) {
                                if(model.customer.idProofIssueDate){
                                    model.customer.idProofValidUptoDate = "";
                                }
                            }
                        },
                        "KYC.IdentityProof1.idProofValidUptoDate":{
                            onChange: function (value, form, model, event) {
                                if(model.customer.idProofValidUptoDate){
                                    var idProof1IssueDate = moment(model.customer.idProofIssueDate, SessionStore.getSystemDateFormat());
                                    var idProof1ValidUptoDate = moment(model.customer.idProofValidUptoDate, SessionStore.getSystemDateFormat());
                                    if (idProof1ValidUptoDate <= idProof1IssueDate) {
                                        model.customer.idProofValidUptoDate = null;
                                        PageHelper.showProgress("pre-save-validation", "ID Proof ValidUptoDate always more than ID Proof Valid ToDate", 5000);
                                        
                                    }
                                }
                            }
                        },
                        "KYC.addressProof1.addressProofIssueDate":{
                            onChange: function (value, form, model, event) {
                                if(model.customer.addressProofIssueDate){
                                    model.customer.addressProofValidUptoDate = "";
                                }
                            }
                        },
                        "KYC.addressProof1.addressProofValidUptoDate":{
                            onChange: function (value, form, model, event) {
                                if(model.customer.addressProofValidUptoDate){
                                    var addressProof1IssueDate = moment(model.customer.addressProofIssueDate, SessionStore.getSystemDateFormat());
                                    var addressProof1ValidUptoDate = moment(model.customer.addressProofValidUptoDate, SessionStore.getSystemDateFormat());
                                    if (addressProof1ValidUptoDate <= addressProof1IssueDate) {
                                        model.customer.addressProof1ValidUptoDate = null;
                                        PageHelper.showProgress("pre-save-validation", "Address Proof ValidUptoDate always more than Address Proof Valid ToDate", 5000);
                                        
                                    }
                                }
                            }
                        },       
                        "AdditionalKYC.additionalKYCs.kyc1IssueDate":{
                            onChange: function (value, form, model, event) {
                                if(model.customer.additionalKYCs[form.arrayIndex].kyc1IssueDate){
                                    model.customer.additionalKYCs[form.arrayIndex].kyc1ValidUptoDate = "";
                                }
                            }
                        },
                        "AdditionalKYC.additionalKYCs.kyc1ValidUptoDate":{
                            onChange: function (value, form, model, event) {
                                if(model.customer.additionalKYCs[form.arrayIndex].kyc1ValidUptoDate){
                                    var kyc1IssueDate = moment(model.customer.additionalKYCs[form.arrayIndex].kyc1IssueDate, SessionStore.getSystemDateFormat());
                                    var kyc1ValidUptoDate = moment(model.customer.additionalKYCs[form.arrayIndex].kyc1ValidUptoDate, SessionStore.getSystemDateFormat());
                                    if (kyc1ValidUptoDate <= kyc1IssueDate) {
                                        model.customer.additionalKYCs[form.arrayIndex].kyc1ValidUptoDate = null;
                                        PageHelper.showProgress("pre-save-validation", "KYC1 ValidUptoDate always more than KYC1 Issue Date", 5000);
                                        
                                    }
                                }
                            }
                        },
                        "AdditionalKYC.additionalKYCs.kyc2IssueDate":{
                            onChange: function (value, form, model, event) {
                                if(model.customer.additionalKYCs[form.arrayIndex].kyc2IssueDate){
                                    model.customer.additionalKYCs[form.arrayIndex].kyc2ValidUptoDate = "";
                                }
                            }
                        },
                        "AdditionalKYC.additionalKYCs.kyc2ValidUptoDate":{
                            onChange: function (value, form, model, event) {
                                if(model.customer.additionalKYCs[form.arrayIndex].kyc2ValidUptoDate){
                                    var kyc2IssueDate = moment(model.customer.additionalKYCs[form.arrayIndex].kyc2IssueDate, SessionStore.getSystemDateFormat());
                                    var kyc2ValidUptoDate = moment(model.customer.additionalKYCs[form.arrayIndex].kyc2ValidUptoDate, SessionStore.getSystemDateFormat());
                                    if (kyc2ValidUptoDate <= kyc2IssueDate) {
                                        model.customer.additionalKYCs[form.arrayIndex].kyc2ValidUptoDate = null;
                                        PageHelper.showProgress("pre-save-validation", "KYC2 ValidUptoDate always more than KYC2 Issue Date", 5000);
                                        
                                    }
                                }
                            }
                        },       
                        "Liabilities1.liabilities.startDate":{
                            onChange: function (value, form, model, event) {
                                if(model.customer.liabilities[form.arrayIndex].startDate){
                                    model.customer.liabilities[form.arrayIndex].maturityDate = "";
                                }
                            }
                        },
                        "Liabilities1.liabilities.maturityDate":{
                            onChange: function (value, form, model, event) {
                                if(model.customer.liabilities[form.arrayIndex].maturityDate){
                                    var liabilitesStartDate = moment(model.customer.liabilities[form.arrayIndex].startDate, SessionStore.getSystemDateFormat());
                                    var liabilitesmaturityDate = moment(model.customer.liabilities[form.arrayIndex].maturityDate, SessionStore.getSystemDateFormat());
                                    if (liabilitesmaturityDate <= liabilitesStartDate) {
                                        model.customer.liabilities[form.arrayIndex].maturityDate= null;
                                        PageHelper.showProgress("pre-save-validation", "Liabilities Maturity Date always more than Liabilities Start Date", 5000);
                                        
                                    }
                                }
                            }
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
                        "AdditionalKYC.additionalKYCs.kyc1ProofType":{
                            required: true    
                        },
                        "familyDetails.familyMembers": {
                            "startEmpty":true,
                            titleExpr: "(model.customer.familyMembers[arrayIndex].relationShip == 'Self'?'Self':'Family Memeber')",
                            onArrayAdd: function(value, form, model, formCtrl, event) {
                                if ((model.customer.familyMembers.length - 1) === 0) {
                                    model.customer.familyMembers[0].relationShip = 'Self';
                                    model.customer.familyMembers[0].gender = model.customer.gender;
                                    model.customer.familyMembers[0].familyMemberFirstName = model.customer.firstName;
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
                            "condition":"model.customer.familyMembers[arrayIndex].relationShip != 'Self'",
                            "onChange": function(modelValue, form, model, formCtrl, event) {
                                if (model.customer.familyMembers[form.arrayIndex].relationShip == 'Self') {
                                    for (var index = 0; index < model.customer.familyMembers.length; index++) {
                                        if (index != form.arrayIndex && model.customer.familyMembers[index].relationShip == 'Self') {
                                            model.customer.familyMembers[form.arrayIndex].relationShip = undefined;
                                            Utils.alert("self relationship is already selected");
                                            return;
                                        }
                                    }
                                }
    
                                if (model.customer.familyMembers[form.arrayIndex].relationShip == 'Self') {
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
                            "condition":"model.customer.familyMembers[arrayIndex].relationShip != 'Self'",
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
                        "familyDetails.familyMembers.gender":{
                            "condition":"model.customer.familyMembers[arrayIndex].relationShip != 'Self'"
                        },
                        "familyDetails.familyMembers.age":{
                            "condition":"model.customer.familyMembers[arrayIndex].relationShip != 'Self'"
                        },
                        "familyDetails.familyMembers.dateOfBirth":{
                            "condition":"model.customer.familyMembers[arrayIndex].relationShip != 'Self'"
                        },
                        "familyDetails.familyMembers.maritalStatus":{
                            "condition":"model.customer.familyMembers[arrayIndex].relationShip != 'Self'"
                        },
                        "familyDetails.familyMembers.mobilePhone":{
                            "condition":"model.customer.familyMembers[arrayIndex].relationShip != 'Self'"
                        },
                        "familyDetails.familyMembers.customerId":{
                            "condition":"model.customer.familyMembers[arrayIndex].relationShip != 'Self'"
                        },
                        "familyDetails.familyMembers.familyMemberFirstName":{
                            "condition":"model.customer.familyMembers[arrayIndex].relationShip != 'Self'"
                        },
                        "familyDetails.familyMembers.incomes":{
                            "condition":"model.customer.familyMembers[arrayIndex].relationShip != 'Self'"
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
                        "BusinessOccupationDetails.businessDetails.workPlaceCondition": {
                            type: "radios"
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
                        "assets.physicalAssets.assetType": {
                            "title": "ASSET_TYPE",
                            type: "lov",
                            autolov: true,
                            lovonly:true,
                            bindMap: {},
                            searchHelper: formHelper,
                            search: function(inputModel, form, model, context) {
                                var assetDetails =[];
                                assetDetails = formHelper.enum('asset_type').data;
                                if(!assetDetails.length)
                                {
                                    assetDetails.push({
                                        name: "No Records",
                                    })
                                }
                                return $q.resolve({
                                    headers: {
                                        "x-total-count": assetDetails.length
                                    },
                                    body: assetDetails
                                });
                            },
                            onSelect: function(valueObj, model, context) {
                                if (valueObj.name == "No Records") {
                                    model.customer.physicalAssets[context.arrayIndex].assetType = '';
                                    model.customer.physicalAssets[context.arrayIndex].ownedAssetDetails = '';
                                    model.customer.physicalAssets[context.arrayIndex].unit = '';
                                    model.customer.ownedAssetDetails = [];
                                    model.customer.assetunit = [];
                                } else {
                                    var assetType = model.customer.physicalAssets[context.arrayIndex].assetType = valueObj.name;
                                    model.customer.physicalAssets[context.arrayIndex].ownedAssetDetails = '';
                                    model.customer.physicalAssets[context.arrayIndex].unit = '';
                                    var ownedAssetDetails = formHelper.enum('asset_Details').data;
                                    var assetunit = formHelper.enum('asset_unit').data;
                                    model.customer.ownedAssetDetails = [];
                                    model.customer.assetunit = [];
                                    if (ownedAssetDetails && ownedAssetDetails.length) {
                                        for (var i = 0; i < ownedAssetDetails.length; i++) {

                                            if ((ownedAssetDetails[i].parentCode).toUpperCase() == (assetType).toUpperCase()) {
                                                model.customer.ownedAssetDetails.push({
                                                    name: ownedAssetDetails[i].name,
                                                    id: ownedAssetDetails[i].value
                                                })
                                            }
                                        }
                                    }
                                    if (assetunit && assetunit.length) {
                                        for (var i = 0; i < assetunit.length; i++) {
                                            if ((assetunit[i].parentCode).toUpperCase() == (assetType).toUpperCase()) {
                                                model.customer.assetunit.push({
                                                    name: assetunit[i].name,
                                                })
                                            }
                                        }
                                    }
                                    if (model.customer.ownedAssetDetails.length && model.customer.ownedAssetDetails.length > 0) {
                                        model.customer.physicalAssets[context.arrayIndex].ownedAssetallowed = true;
                                        model.customer.physicalAssets[context.arrayIndex].assetunitallowed = false;

                                    }
                                    if (model.customer.assetunit.length && model.customer.assetunit.length > 0) {
                                        model.customer.physicalAssets[context.arrayIndex].assetunitallowed = true;
                                        model.customer.physicalAssets[context.arrayIndex].ownedAssetallowed = false;
                                    }
                                }
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.name
                                ];
                            }
                        },
                        "assets.physicalAssets.ownedAssetDetails": {
                            condition: "model.customer.physicalAssets[arrayIndex].ownedAssetallowed",
                            "required":true,
                            type: "lov",
                            autolov: true,
                            lovonly:true,
                            bindMap: {},
                            searchHelper: formHelper,
                            search: function(inputModel, form, model, context) {
                                if(!model.customer.ownedAssetDetails.length)
                                {
                                    model.customer.ownedAssetDetails.push({
                                        name: "No Records",
                                    })
                                }
                                return $q.resolve({
                                    headers: {
                                        "x-total-count": model.customer.ownedAssetDetails.length
                                    },
                                    body: model.customer.ownedAssetDetails
                                });
                            },
                            onSelect: function(valueObj, model, context) {
                            if(valueObj.name=="No Records")
                            {
                                model.customer.physicalAssets[context.arrayIndex].ownedAssetDetails = ''; 
                            }else{
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
                            condition: "model.customer.physicalAssets[arrayIndex].assetunitallowed",
                            "required":true,
                            type: "lov",
                            autolov: true,
                            lovonly:true,
                            bindMap: {},
                            searchHelper: formHelper,
                            search: function(inputModel, form, model, context) {
                                if(!model.customer.assetunit.length)
                                {
                                    model.customer.assetunit.push({
                                        name: "No Records",
                                    })
                                }
                                return $q.resolve({
                                    headers: {
                                        "x-total-count": model.customer.assetunit.length
                                    },
                                    body: model.customer.assetunit
                                });
                            },
                            onSelect: function(valueObj, model, context) {
                            if(valueObj.name=="No Records")
                            {
                                model.customer.physicalAssets[context.arrayIndex].unit = ''; 
                            }else{
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
                        "assets.financialAssets.startDate":{
                            onChange: function (value, form, model, event) {
                                if(model.customer.financialAssets[form.arrayIndex].startDate){
                                    model.customer.financialAssets[form.arrayIndex].maturityDate = "";
                                }
                            }
                        },
                        "assets.financialAssets.maturityDate":{
                            onChange: function (value, form, model, event) {
                                if(model.customer.financialAssets[form.arrayIndex].maturityDate){
                                    var financialAssetsStartDate = moment(model.customer.financialAssets[form.arrayIndex].startDate, SessionStore.getSystemDateFormat());
                                    var financialAssetsMaturityDateDate = moment(model.customer.financialAssets[form.arrayIndex].maturityDate, SessionStore.getSystemDateFormat());
                                    if (financialAssetsMaturityDateDate <= financialAssetsStartDate) {
                                        model.customer.financialAssets[form.arrayIndex].maturityDate = null;
                                        PageHelper.showProgress("pre-save-validation", "Financial Asset Maturity Date always more than Financial Asset Start Date", 5000);
                                        
                                    }
                                }
                            }
                        },
                        "HouseVerification.caste": {
                            // "required": true
                        },
                        "HouseVerification.language": {
                            // "required": true
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
                            // "required": true,
                            type: "file",
                            fileType: "image/*",
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                        },
                        "HouseVerification.verifications.houseNo": {
                            // "required": true,
                        },
                        "HouseVerification.verifications.referenceFirstName": {
                            // "required": true,
                        },
                        "HouseVerification.verifications.relationship": {
                            // "required": true,
                        },
                        "HouseVerification.place": {
                            // required: true
                        },
                        "HouseVerification.religion":{
                            required :false
                        },
                        "HouseVerification.nameRo":{
                            readonly:false,
                            required :false,
                            type: "string"
                        },
                        "HouseVerification": {
                            orderNo: 131
                        },
                        "EDF":{
                            orderNo: 140
                        },
                        "EDF.condition" : {
                            "title": "Agree with the Terms and Conditions Accept"
                        },
                        "bankAccounts.customerBankAccounts.accountNumber":{
                            "required": true
                        },
                        "bankAccounts.customerBankAccounts.confirmedAccountNumber":{
                            "title":"Confirm Account Number",
                            "required": true
                        },
                        "actionbox":{
                            "condition":"model.customer.udf.userDefinedFieldValues.udf40=='ACCEPT'"
                        },
                        "actionbox3":{
                            "condition":"model.customer.udf.userDefinedFieldValues.udf40 !='ACCEPT' && model.customer.udf.userDefinedFieldValues.udf40 !='REJECT'"
                        },                        
                        "actionbox1":{
                            "condition":"model.customer.udf.userDefinedFieldValues.udf40=='REJECT'"
                        }
                    }
                }
                var getIncludes = function (model) {

                    return [
                    "CustomerInformation",
                    "CustomerInformation.customerBranchId",
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
                    "ContactInformation.CustomerResidentialAddress.centreId",
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
                    "bankAccounts",
                    "bankAccounts.customerBankAccounts",
                    "bankAccounts.customerBankAccounts.ifscCode",
                    "bankAccounts.customerBankAccounts.customerBankName",
                    "bankAccounts.customerBankAccounts.customerBankBranchName",
                    "bankAccounts.customerBankAccounts.customerNameAsInBank",
                    "bankAccounts.customerBankAccounts.accountNumber",
                    "bankAccounts.customerBankAccounts.confirmedAccountNumber",
                    "bankAccounts.customerBankAccounts.accountType",
                    "bankAccounts.customerBankAccounts.bankingSince",
                    "bankAccounts.customerBankAccounts.netBankingAvailable",
                    "bankAccounts.customerBankAccounts.sanctionedAmount",
                    "bankAccounts.customerBankAccounts.limit",
                    "bankAccounts.customerBankAccounts.bankStatementDocId",
                    "bankAccounts.customerBankAccounts.bankStatements",
                    "bankAccounts.customerBankAccounts.bankStatements.startMonth",
                    "bankAccounts.customerBankAccounts.bankStatements.totalDeposits",
                    "bankAccounts.customerBankAccounts.bankStatements.totalWithdrawals",
                    "bankAccounts.customerBankAccounts.bankStatements.balanceAsOn15th",
                    "bankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced",
                    "bankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced",
                    "bankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto",
                    "bankAccounts.customerBankAccounts.isDisbursmentAccount",
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
                    "assets.physicalAssets.unit",
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
                    "BusinessOccupationDetails.businessDetails.businessRegNo",
                    "BusinessOccupationDetails.businessDetails.businessVillage",
                    "BusinessOccupationDetails.businessDetails.businessLandmark",
                    "BusinessOccupationDetails.businessDetails.businessPincode",
                    "BusinessOccupationDetails.businessDetails.businessPhone",
                    "BusinessOccupationDetails.businessDetails.OwnerOfShop",
                    "BusinessOccupationDetails.businessDetails.ageOfEnterprise",
                    "BusinessOccupationDetails.businessDetails.workPeriod",
                    "BusinessOccupationDetails.businessDetails.workPlaceType",
                    "BusinessOccupationDetails.businessDetails.WorkPlace",
                    "BusinessOccupationDetails.businessDetails.workPlaceBuildType",
                    "BusinessOccupationDetails.businessDetails.workPlaceCondition",
                    // "BusinessOccupationDetails.businessDetails.WorkPlaceOthers",
                    "BusinessOccupationDetails.agricultureDetails",
                    "BusinessOccupationDetails.agricultureDetails.relationwithFarmer",
                    "BusinessOccupationDetails.agricultureDetails.landOwnership",
                    "BusinessOccupationDetails.agricultureDetails.nonIrrigated",
                    "BusinessOccupationDetails.agricultureDetails.irrigated",
                    "BusinessOccupationDetails.agricultureDetails.harvestMonth",
                    "BusinessOccupationDetails.agricultureDetails.landArea", 
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
                    "HouseVerification.date",
                    "HouseVerification.place",
                    "EDF",
                    "EDF.condition",
                    "actionbox",
                    "actionbox.submit",
                    "actionbox.save",
                    "actionbox3",
                    "actionbox3.save",
                    "actionbox1",
                    "actionbox1.saveBasicDetails",
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
                        if ($stateParams && $stateParams.pageData) {
                            var data = $stateParams.pageData.pageData;
                           // model.leadenrollmentdetail.mobileNo = data.mobileNo
                           Lead.get({
                            id: data.id
                        }).$promise.then(
                            function(res) {
                                model.customer = res;
                                model.customer.dateOfBirth = res.dob;
                                model.customer.mobilePhone = res.mobileNo;
                                model.customer.firstName = res.leadName;
                                model.customer.customerBranchId = res.branchId;
                                model.customer.street = res.addressLine2;
                                model.customer.doorNo = res.addressLine1;
                                model.customer.locality = res.area;
                                model.customer.villageName = res.cityTownVillage;
                                model.customer.landLineNo = res.alternateMobileNo;
                                model.customer.age = moment().diff(moment(res.dob, SessionStore.getSystemDateFormat()), 'years');
                            },
                            function(err) {
                                console.log(err);
                                PageHelper.showError(err);
                            });
                        }

                       //start
                           if (!Utils.isCordova) {
                               BranchCreationResource.getBranchByID({
                                       id: branchId
                                   },
                                   function (res) {
                                       if (res.fingerPrintDeviceType) {
                                           if (res.fingerPrintDeviceType == "MANTRA") {
                                               model.fingerPrintDeviceType = res.fingerPrintDeviceType;
                                           }
                                       }

                                       PageHelper.hideLoader();
                                   },
                                   function (err) {
                                       $log.info(err);
                                   }
                               );
                           }
                       //end
                        model.siteCode = SessionStore.getGlobalSetting('siteCode');
                        var self = this;
                        var formRequest = {
                            "overrides": overridesFields(model),
                            "includes": getIncludes(model),
                            "excludes": [
                            ],
                            "options": {
                                "repositoryAdditions": {
                                    "bankAccounts":{
                                        "items":{
                                            "customerBankAccounts":{
                                                "items":{
                                                    "isDisbursmentAccount":{
                                                        key:"customer.customerBankAccounts[].isDisbersementAccount",
                                                        type:"checkbox",
                                                        title:"isDisbursmentAccount",
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "ContactInformation":{
                                        "items":{
                                            "CustomerResidentialAddress":{
                                                "items":{
                                                    "centreId": {
                                                        orderNo: 60,
                                                        key: "customer.centreId",
                                                        "required": true,
                                                        type: "select",
                                                        enumCode: "centre",
                                                        parentEnumCode: "userbranches",
                                                        parentValueExpr: "model.customer.customerBranchId",
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
                                     "actionbox3": {
                                        "type": "actionbox",
                                        "items": {
                                            "save": {
                                                "type": "save",
                                                "title": "Offline Save"
                                            }
                                        }
                                    },                                    
                                },
                                "additions": [
                                ]
                            }
                        };

                            if (!(model && model.customer && model.customer.id && model.$$STORAGE_KEY$$) && $stateParams.pageId) {
                                var customerId = $stateParams.pageId;
                                PageHelper.showLoader();
                                EnrolmentProcess.fromCustomerID(customerId)
                                    .subscribe(function(value){
                                        model.enrolmentProcess=value;
                                        model.customer=model.enrolmentProcess.customer;
                                        model.customer.addressProofSameAsIdProof = (model.customer.title == "true") ? true : false;
                                        model = EnrollmentHelper.fixData(model);
                                        self.form = IrfFormRequestProcessor.getFormDefinition('IndividualEnrollment', formRequest,configFile(), model);
                                        PageHelper.hideLoader();
                                       
                                    });
                            } else {
                                EnrolmentProcess.createNewProcess()
                                .subscribe(function(enrolmentProcess) {
                                        model.enrolmentProcess=enrolmentProcess;
                                        model.customer=model.enrolmentProcess.customer;
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
                                        model.customer.familyMembers=[];
                                        model.customer.expenditures=[];
                                        self.form = IrfFormRequestProcessor.getFormDefinition('IndividualEnrollment', formRequest, configFile(), model);
                                });
                            }
                            if(typeof model.customer.nameOfRo == "undefined" || model.customer.nameOfRo == null )
                            model.customer.nameOfRo = SessionStore.getUsername();
                            if(model.$$STORAGE_KEY$$){
                                $log.info(model);
                            }

                            model.isFPEnrolled = function(fingerId) {
                                if (model.customer[BiometricService.getFingerTF(fingerId)] != null || (typeof(model.customer.$fingerprint) != 'undefined' && typeof(model.customer.$fingerprint[fingerId]) != 'undefined' && model.customer.$fingerprint[fingerId].data != null)) {
                                    return "fa-check text-success";
                                }
                                return "fa-close text-danger";
                            }
            
                            model.getFingerLabel = function(fingerId) {
                                return translateFilter(BiometricService.getLabel(fingerId));
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
                    offline: true,
                    getOfflineDisplayItem: function (item, index) {
                        return [
                            item.customer.urnNo,
                            Utils.getFullName(item.customer.firstName, item.customer.middleName, item.customer.lastName),
                            item.customer.villageName
                        ]
                    },
                    offlineInitialize: function(model, form, formCtrl) {
                        $log.info(model);
                        model.isFPEnrolled = function(fingerId) {
                            if (model.customer[BiometricService.getFingerTF(fingerId)] != null || (typeof(model.customer.$fingerprint) != 'undefined' && typeof(model.customer.$fingerprint[fingerId]) != 'undefined' && model.customer.$fingerprint[fingerId].data != null)) {
                                return "fa-check text-success";
                            }
                            return "fa-close text-danger";
                        }
        
                        model.getFingerLabel = function(fingerId) {
                            return translateFilter(BiometricService.getLabel(fingerId));
                        }

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
                        saveBasicDetails:function(model, form, formName) {
                            var actions = this.actions;
                            $log.info("Inside submit()");
                            $log.warn(model);
                            model.customer.title = String(model.customer.addressProofSameAsIdProof);
                            model.customer.miscellaneous = null;
                            if (!EnrollmentHelper.validateData(model)) {
                                $log.warn("Invalid Data, returning false");
                                return false;
                            }
                            if (!EnrollmentHelper.validateBankAccounts(model)) {
                                $log.warn("Invalid Data, returning false");
                                PageHelper.hideLoader();
                                return false;
                            }
                            model.siteCode = SessionStore.getGlobalSetting('siteCode');
                            var reqData = _.cloneDeep(model);
                            var out = model.customer.$fingerprint;
                            var fpPromisesArr = [];
                            for (var key in out) {
                                if (out.hasOwnProperty(key) && out[key].data!=null) {
                                    (function(obj){
                                        var promise = Files.uploadBase64({file: obj.data, type: 'CustomerEnrollment', subType: 'FINGERPRINT', extn:'iso'}, {}).$promise;
                                        promise.then(function(data){
                                            model.customer[obj.table_field] = data.fileId;
                                            delete model.customer.$fingerprint[obj.fingerId];
                                        });
                                        fpPromisesArr.push(promise);
                                    })(out[key]);
                                } else {
                                    if (out[key].data == null){
                                        delete out[key];
                                    }
            
                                }
                            }
                            $q.all(fpPromisesArr).then(function(){
                                /** Valid check whether the user have enrolled or fingerprints or not **/
                                
                                if (!(_.has(reqData['customer'], 'leftHandThumpImageId') && !_.isNull(reqData['customer']['leftHandThumpImageId']) &&		                                
                                    _.has(reqData['customer'], 'leftHandIndexImageId') && !_.isNull(reqData['customer']['leftHandIndexImageId']) &&		
                                   _.has(reqData['customer'], 'leftHandMiddleImageId') && !_.isNull(reqData['customer']['leftHandMiddleImageId']) &&		
                                    _.has(reqData['customer'], 'leftHandRingImageId') && !_.isNull(reqData['customer']['leftHandRingImageId']) &&		
                                     _.has(reqData['customer'], 'leftHandSmallImageId') && !_.isNull(reqData['customer']['leftHandSmallImageId']) &&		
                                     _.has(reqData['customer'], 'rightHandThumpImageId') && !_.isNull(reqData['customer']['rightHandThumpImageId']) &&		
                                    _.has(reqData['customer'], 'rightHandIndexImageId') && !_.isNull(reqData['customer']['rightHandIndexImageId']) &&		
                                     _.has(reqData['customer'], 'rightHandMiddleImageId') && !_.isNull(reqData['customer']['rightHandMiddleImageId']) &&		
                                    _.has(reqData['customer'], 'rightHandRingImageId') && !_.isNull(reqData['customer']['rightHandRingImageId']) &&		
                                     _.has(reqData['customer'], 'rightHandSmallImageId') && !_.isNull(reqData['customer']['rightHandSmallImageId'])		
                                 )) {		
                                     PageHelper.showErrors({		
                                        "data": {		
                                            "error": "Fingerprints are not enrolled. Please check"		
                                        }		
                                    });		
                                     PageHelper.hideLoader();		
            		
                                     return;		
                                 }		
                            
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
                                reqData.customer.currentStage="Stage02";
                                EnrollmentHelper.saveandproceed(reqData).then(function(res) {
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
                                    // EnrollmentHelper.proceedData(res).then(function(resp) {
                                    //     PageHelper.showProgress('enrolment', 'Done.', 5000);
                                    //     model.customer = _.clone(res.customer);
                                    //     model.customer.addressProofSameAsIdProof = (model.customer.title == "true") ? true : false;
                                    //     model = EnrollmentHelper.fixData(model);
                                    //     //$state.go('Page.Landing', null);
                                    // }, function(err) {
                                    //     Utils.removeNulls(res.customer, true);
                                    //     model.customer = res.customer;
                                    // });
                                });
                            }
                            });
                        },
                        submit: function(model, form, formName) {
                            var actions = this.actions;
                            $log.info("Inside submit()");
                            $log.warn(model);
                            model.customer.title = String(model.customer.addressProofSameAsIdProof);
                            model.customer.miscellaneous = null;
                            if (!EnrollmentHelper.validateData(model)) {
                                $log.warn("Invalid Data, returning false");
                                return false;
                            }
                            if (!EnrollmentHelper.validateBankAccounts(model)) {
                                $log.warn("Invalid Data, returning false");
                                PageHelper.hideLoader();
                                return false;
                            }
                            if(!policyOnSubmit("minimumFamilyMembers",model))
                                return false;
                            model.siteCode = SessionStore.getGlobalSetting('siteCode');
                            var reqData = _.cloneDeep(model);
                            var out = model.customer.$fingerprint;
                            var fpPromisesArr = [];
                            for (var key in out) {
                                if (out.hasOwnProperty(key) && out[key].data!=null) {
                                    (function(obj){
                                        var promise = Files.uploadBase64({file: obj.data, type: 'CustomerEnrollment', subType: 'FINGERPRINT', extn:'iso'}, {}).$promise;
                                        promise.then(function(data){
                                            model.customer[obj.table_field] = data.fileId;
                                            reqData.customer[obj.table_field] = data.fileId;
                                            delete model.customer.$fingerprint[obj.fingerId];
                                            delete reqData.customer.$fingerprint[obj.fingerId];
                                        });
                                        fpPromisesArr.push(promise);
                                    })(out[key]);
                                } else {
                                    if (out[key].data == null){
                                        delete out[key];
                                    }
            
                                }
                            }
                            $q.all(fpPromisesArr).then(function(){
                                /** Valid check whether the user have enrolled or fingerprints or not **/
                                if (!(_.has(reqData['customer'], 'leftHandThumpImageId') && !_.isNull(reqData['customer']['leftHandThumpImageId']) &&		                               
                                _.has(reqData['customer'], 'leftHandIndexImageId') && !_.isNull(reqData['customer']['leftHandIndexImageId']) &&		
                               _.has(reqData['customer'], 'leftHandMiddleImageId') && !_.isNull(reqData['customer']['leftHandMiddleImageId']) &&		
                                _.has(reqData['customer'], 'leftHandRingImageId') && !_.isNull(reqData['customer']['leftHandRingImageId']) &&		
                                 _.has(reqData['customer'], 'leftHandSmallImageId') && !_.isNull(reqData['customer']['leftHandSmallImageId']) &&		
                                 _.has(reqData['customer'], 'rightHandThumpImageId') && !_.isNull(reqData['customer']['rightHandThumpImageId']) &&		
                                _.has(reqData['customer'], 'rightHandIndexImageId') && !_.isNull(reqData['customer']['rightHandIndexImageId']) &&		
                                 _.has(reqData['customer'], 'rightHandMiddleImageId') && !_.isNull(reqData['customer']['rightHandMiddleImageId']) &&		
                                _.has(reqData['customer'], 'rightHandRingImageId') && !_.isNull(reqData['customer']['rightHandRingImageId']) &&		
                                 _.has(reqData['customer'], 'rightHandSmallImageId') && !_.isNull(reqData['customer']['rightHandSmallImageId'])		
                             )) {		
                                 console.log(reqData);		
                                 PageHelper.showErrors({		
                                    "data": {		
                                        "error": "Fingerprints are not enrolled. Please check"		
                                    }		
                                });		
                                 PageHelper.hideLoader();		
                                 return;		
                             }
                            
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
                                EnrollmentHelper.saveandproceed(reqData).then(function(resp) {
                                    PageHelper.showProgress('enrolment', 'Done.', 5000);
                                    $state.go('Page.Landing', null);
                                });
                            } else {
                                reqData.customer.currentStage="Stage02";
                                EnrollmentHelper.saveandproceed(reqData).then(function(res) {
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
                                    EnrollmentHelper.saveandproceed(res).then(function(resp) {
                                        PageHelper.showProgress('enrolment', 'Done.', 5000);
                                        model.customer = _.clone(res.customer);
                                        model.customer.addressProofSameAsIdProof = (model.customer.title == "true") ? true : false;
                                        model = EnrollmentHelper.fixData(model);
                                        irfNavigator.goBack();
                                    }, function(err) {
                                        Utils.removeNulls(res.customer, true);
                                        model.customer = res.customer;
                                    });
                                });
                            }
                            });
                        },
                    }
                };
            }
        }
    })
