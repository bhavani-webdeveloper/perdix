irf.pageCollection.factory(irf.page("customer360.EnrollmentProfile"),
["$log", "Enrollment","Queries","EnrollmentHelper","PagesDefinition", "SessionStore","$state","$stateParams", "formHelper", "$q", "irfProgressMessage",
"PageHelper", "Utils", "BiometricService","CustomerBankBranch","BranchCreationResource",
function($log, Enrollment,Queries, EnrollmentHelper,PagesDefinition, SessionStore,$state,$stateParams, formHelper, $q, irfProgressMessage,
    PageHelper, Utils, BiometricService,CustomerBankBranch,BranchCreationResource){
        // userAllowedPages["Page/Engine/customer360.EnrollmentProfile"]
    var branch = SessionStore.getBranch();
   
    var mapCustomerToSelfFamilyMemeber = function(model){
        var temp = model.customer.familyMembers;
        if(temp && temp.length > 0){
            var isThere = false;
            for (var i=0;i<1;i++){
                if(temp[i].relationShip == "Self"){
                    isThere =false;
                    temp[i].customerId = model.customer.id;
                    temp[i].dateOfBirth = model.customer.dateOfBirth;
                    temp[i].gender = model.customer.gender;
                    temp[i].maritalStatus = model.customer.maritalStatus;
                    temp[i].familyMemberFirstName = model.customer.firstName;
                    temp[i].age = model.customer.age;
                }
            }
            // if(!isThere){
            //     temp.push({
            //         relationShip: "Self",
            //         customerId:model.customer.id,
            //         dateOfBirth:model.customer.dateOfBirth,
            //         gender:model.customer.gender,
            //         maritalStatus:model.customer.maritalStatus,
            //         familyMemberFirstName:model.customer.firstName
            //     })
            // }
            model.customer.familyMembers = temp;
            return model.customer.familyMembers;
        }
    }

    var initData = function(model) {
        var branch1 = formHelper.enum('branch_id').data;
        for (var i = 0; i < branch1.length; i++) {
            if ((branch1[i].name) == SessionStore.getBranch()) {
                model.customer.customerBranchId = model.customer.customerBranchId || branch1[i].value;
                model.customer.kgfsName = model.customer.kgfsName || branch1[i].name;
                break;
            }
        }
        var centres = SessionStore.getCentres();
        if (_.isArray(centres) && centres.length > 0){
            model.customer.centreId = model.customer.centreId || centres[0].centreId;
        }
    };
    var checkCentre = function(model){
        model.additional.isStrategicEdit = false;
        if (typeof model.customer.centreId == "undefined" || model.customer.centreId == null)
            model.additional.isStrategicEdit = true;
    };
    return {
        "id": "ProfileBasic",
        "type": "schema-form",
        "name": "ProfileBasic",
        "title": "PROFILE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Profile Page got initialized");
            console.log(model);
            initData(model);
             //start
            var branchId = SessionStore.getBranchId();
            if (!Utils.isCordova) {
                BranchCreationResource.getBranchByID({
                        id: branchId
                    },
                    function (branchDetails) {
                        if (branchDetails.fingerPrintDeviceType) {
                            if (branchDetails.fingerPrintDeviceType == "MANTRA") {
                                model.fingerPrintDeviceType = branchDetails.fingerPrintDeviceType;
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
            model.enabletrue= false;
            model.isRiskProfileAccess = false;
            if($stateParams.pageData){
                if($stateParams.pageData.enabletrue){
                    model.enabletrue= $stateParams.pageData.enabletrue;
                }
                PageHelper.showLoader();
                Enrollment.EnrollmentById({id:$stateParams.pageId},function(resp,header){
                    // var model = {$$OFFLINE_FILES$$:_model.$$OFFLINE_FILES$$};
                    model.customer = resp;
                    model.customer.addressProofSameAsIdProof = (model.customer.title == "true") ? true : false;
                    model = EnrollmentHelper.fixData(model);
                    model.additional = {isStrategicEdit : false};
                    checkCentre(model);
                    PagesDefinition.getRolePageConfig("Page/Engine/customer360.EnrollmentProfile").then(function(data){
                        $log.info(data);
                        PageHelper.hideLoader();
                        $log.info(data.EditBasicCustomerInfo);
                        if(data){
                            model.EditBasicCustomerInfo= !data.EditBasicCustomerInfo;
                            if (typeof data.isRiskProfileAccess !="undefined"){
                                model.isRiskProfileAccess = data.isRiskProfileAccess;
                            }
                            else{
                                model.isRiskProfileAccess = false;
                            }
                            if(model.EditBasicCustomerInfo)
                                {
                                    model.enabletrue = true;
                                   
                                }

                        }
                    },function(err){
                        PageHelper.hideLoader();
                        model.EditBasicCustomerInfo= true;
                        model.enabletrue = true;
                        model.isRiskProfileAccess = false;
                    });
                    if (model.customer.currentStage==='Stage01') {
                        irfProgressMessage.pop("enrollment-save","Customer "+model.customer.id+" not enrolled yet", 5000);
                        $state.go("Page.Engine", {pageName:'ProfileInformation', pageId:pageId});
                    } else {
                        irfProgressMessage.pop("enrollment-save","Load Complete", 2000);
                        initData(model);
                        //$log.info(model);
                        // deferred.resolve(model);
                    }
                },function(resp){
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("enrollment-save","An Error Occurred. Failed to fetch Data",5000);
                    $state.go("Page.Engine",{
                        pageName:"CustomerSearch",
                        pageId:null
                    });
                });  
            }

            var self = this;
            self.form = [];
            self.form = [
                {
                    "type": "box",
                    "condition":"!model.enabletrue",
                    "title": "CUSTOMER_INFORMATION",
                    "items": [
                        {
                            key: "customer.idAndBcCustId",
                            title: "Id & BC Id",
                            titleExpr: "('ID'|translate) + ' & ' + ('BC_CUST_ID'|translate)",
                            readonly: true
                        },
                        {
                            key: "customer.urnNo",
                            title: "URN_NO",
                            readonly: true
                        },
                        {
                            key: "customer.firstName",
                            title: "FULL_NAME",
                            condition:"!model.EditBasicCustomerInfo",
                        },
                        {
                            key: "customer.firstName",
                            title: "FULL_NAME",
                            readonly:true,
                            condition:"model.EditBasicCustomerInfo",
                        },
                        {
                            key:"customer.photoImageId",
                            type:"file",
                            fileType:"image/*",
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                            readonly: true
                        },
                        {
                            key:"customer.centreId",
                            type:"select",
                            readonly:false,
                            "parentEnumCode": "branch_id",
                            "parentValueExpr": "model.customer.customerBranchId",
                        },
                        {
                            key:"customer.enrolledAs",
                            type:"radios",
                            readonly: true
                        },
                        {
                            key:"customer.gender",
                            type:"radios",
                            //readonly: true
                        },
                        {
                            key:"customer.age",
                            title: "AGE",
                            type:"number",
                            readonly: true
                        },
                        {
                            key:"customer.dateOfBirth",
                            condition:"model.EditBasicCustomerInfo",
                            type:"date",
                            readonly: true
                        },
                        {
                            key:"customer.dateOfBirth",
                            onChange: function(modelValue, form, model) {
                                if (model.customer.dateOfBirth) {
                                    model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                            },
                            condition:"!model.EditBasicCustomerInfo",
                            type:"date",
                        },
                        {
                            key: "customer.fatherFirstName",
                            condition:"model.EditBasicCustomerInfo",
                            title: "FATHER_FULL_NAME",
                            readonly: true
                        },
                        {
                            key: "customer.fatherFirstName",
                            condition:"!model.EditBasicCustomerInfo",
                            title: "FATHER_FULL_NAME",
                        },
                        {
                            key:"customer.maritalStatus",
                            type:"select"
                        },
                        {
                            key: "customer.spouseFirstName",
                            title: "Spouse Full Name",
                            condition:"model.customer.maritalStatus==='MARRIED'",
                            type:"qrcode",
                            onCapture: function(result, model, form) {
                                $log.info(result); // spouse id proof
                                var aadhaarData = EnrollmentHelper.parseAadhaar(result.text);
                                $log.info(aadhaarData);
                                model.customer.udf.userDefinedFieldValues.udf33 = 'Aadhar card';
                                model.customer.udf.userDefinedFieldValues.udf36 = aadhaarData.uid;
                                model.customer.spouseFirstName = aadhaarData.name;
                                if (aadhaarData.yob) {
                                    model.customer.spouseDateOfBirth = aadhaarData.yob + '-01-01';
                                }
                            }
                        },
                        {
                            key:"customer.spouseDateOfBirth",
                            type:"date",
                            condition:"model.customer.maritalStatus==='MARRIED'",
                            "onChange": function(modelValue, form, model) {
                                if (model.customer.spouseDateOfBirth) {
                                }
                            }
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf1",
                            condition:"model.customer.maritalStatus==='MARRIED'",
                            title:"SPOUSE_LOAN_CONSENT",
                            type:"checkbox",
                            "schema":{
                                "default":false
                            }
                        },
                        {
                            key:"customer.isBiometricValidated",
                            title: "Validate Fingerprint",
                            type:"validatebiometric",
                            category: 'CustomerEnrollment',
                            subCategory: 'FINGERPRINT',
                            helper: formHelper,
                            biometricMap: {
                                leftThumb: "model.customer.leftHandThumpImageId",
                                leftIndex: "model.customer.leftHandIndexImageId",
                                leftMiddle: "model.customer.leftHandMiddleImageId",
                                leftRing: "model.customer.leftHandRingImageId",
                                leftLittle: "model.customer.leftHandSmallImageId",
                                rightThumb: "model.customer.rightHandThumpImageId",
                                rightIndex: "model.customer.rightHandIndexImageId",
                                rightMiddle: "model.customer.rightHandMiddleImageId",
                                rightRing: "model.customer.rightHandRingImageId",
                                rightLittle: "model.customer.rightHandSmallImageId"
                            },
                            viewParams: function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            }
                        },
                        {
                            "title": "RISK_PROFILE",
                            "condition":"model.isRiskProfileAccess",
                            "type": "select",
                            "key": "customer.riskProfile",
                            "enumCode":"customer_risk_profile",
                            onChange: function (valueObj, form, model) {
                            }
                        },
                        {
                            "title": "RISK_PROFILE",
                            "condition":"!model.isRiskProfileAccess",
                            "readonly":true,
                            "type": "select",
                            "key": "customer.riskProfile",
                            "enumCode":"customer_risk_profile",
                            onChange: function (valueObj, form, model) {
                            }
                        }

                        
                    ]
                },
                {
                    "type": "box",
                    "condition":"!model.enabletrue",
                    "title": "CONTACT_INFORMATION",
                    "items":[{
                        type: "fieldset",
                        title: "CUSTOMER_RESIDENTIAL_ADDRESS",
                        items: [
        
                                "customer.doorNo",
                                "customer.street",
                                "customer.locality",
                                {
                                    key:"customer.villageName",
                                    type:"select",
                                    filter: {
                                        'parentCode as branch': 'model.customer.kgfsName'
                                    },
                                    screenFilter: true
                                },
                                "customer.postOffice",
                                {
                                    key:"customer.district",
                                    type:"select",
                                    screenFilter: true
                                },
                                "customer.pincode",
                                {
                                    key:"customer.state",
                                    type:"select",
                                    screenFilter: true
                                },
                                "customer.stdCode",
                                "customer.landLineNo",
                                {
                                    "key": "customer.mobilePhone",
                                     condition:"model.EditBasicCustomerInfo",
                                    "readonly": true,    
                                },
                                {
                                    "key": "customer.mobilePhone",
                                     condition:"!model.EditBasicCustomerInfo",   
                                },
                                
                                "customer.mailSameAsResidence"
                            ]
                        },{
                            type: "fieldset",
                            title: "CUSTOMER_PERMANENT_ADDRESS",
                            condition:"!model.customer.mailSameAsResidence",
                            items: [
                                "customer.mailingDoorNo",
                                "customer.mailingStreet",
                                "customer.mailingLocality",
                                "customer.mailingPostoffice",
                                {
                                    key:"customer.mailingDistrict",
                                    type:"select",
                                    screenFilter: true
                                },
                                "customer.mailingPincode",
                                {
                                    key:"customer.mailingState",
                                    type:"select",
                                    screenFilter: true
                                }
                            ]
                        }
                    ]
                },
                {
                    type:"box",
                    "condition":"!model.enabletrue",
                    title:"KYC",
                    items:[
                        {
                            "key": "customer.aadhaarNo",
                            type:"qrcode",
                            onChange:"actions.setProofs(model)",
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
                            //onCapture: EnrollmentHelper.customerAadhaarOnCapture
                        },
                        {
                            type:"fieldset",
                            title:"IDENTITY_PROOF",
                            items:[
                                {
                                    key:"customer.identityProof",
                                    type:"select"
                                },
                                {
                                    key:"customer.identityProofImageId",
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                   // "offline": true
                                },
                                {
                                    key:"customer.identityProofReverseImageId",
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                },
                                {
                                    key:"customer.identityProofNo",
                                    type:"barcode",
                                    onCapture: function(result, model, form) {
                                        $log.info(result);
                                        model.customer.identityProofNo = result.text;
                                    }
                                },
                                {
                                    key:"customer.idProofIssueDate",
                                    type:"date"
                                },
                                {
                                    key:"customer.idProofValidUptoDate",
                                    type:"date"
                                },
                                {
                                    key:"customer.addressProofSameAsIdProof"
                                }
                            ]
                        },
                        {
                            type:"fieldset",
                            title:"SPOUSE_IDENTITY_PROOF",
                            condition:"model.customer.maritalStatus==='MARRIED'",
                            items:[
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf33",
                                    type:"select",
                                    onChange: function(modelValue) {
                                        $log.info(modelValue);
                                    }
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf34",
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf35",
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf36",
                                    condition: "model.customer.udf.userDefinedFieldValues.udf33 !== 'Aadhar card'",
                                    type:"barcode",
                                    onCapture: function(result, model, form) {
                                        $log.info(result); // spouse id proof
                                        model.customer.udf.userDefinedFieldValues.udf36 = result.text;
                                    }
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf36",
                                    condition: "model.customer.udf.userDefinedFieldValues.udf33 === 'Aadhar card'",
                                    type:"qrcode",
                                    onCapture: function(result, model, form) {
                                        $log.info(result); // spouse id proof
                                        var aadhaarData = EnrollmentHelper.parseAadhaar(result.text);
                                        $log.info(aadhaarData);
                                        model.customer.udf.userDefinedFieldValues.udf36 = aadhaarData.uid;
                                        model.customer.spouseFirstName = aadhaarData.name;
                                        if (aadhaarData.yob) {
                                            model.customer.spouseDateOfBirth = aadhaarData.yob + '-01-01';
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            type:"fieldset",
                            title:"ADDRESS_PROOF",
                            condition:"!model.customer.addressProofSameAsIdProof",
                            items:[
                                {
                                    key:"customer.addressProof",
                                    type:"select"
                                },
                                {
                                    key:"customer.addressProofImageId",
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                },
                                {
                                    key:"customer.addressProofReverseImageId",
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                },
                                {
                                    key:"customer.addressProofNo",
                                    type:"barcode",
                                    onCapture: function(result, model, form) {
                                        $log.info(result);
                                        model.customer.addressProofNo = result.text;
                                    },
                                    "schema":{
                                        "pattern":"^[a-zA-Z0-9]*$"
                                    }
        
                                },
                                {
                                    key:"customer.addressProofIssueDate",
                                    type:"date"
                                },
                                {
                                    key:"customer.addressProofValidUptoDate",
                                    type:"date"
                                },
                            ]
                        }
                    ]
                },
                {
                    "type":"box",
                    "condition":"!model.enabletrue",
                    "title":"ADDITIONAL_KYC",
                    "items":[
                        {
                            "key":"customer.additionalKYCs",
                            "type":"array",
                            "startEmpty": true,
                            "schema": {
                                "maxItems": 1
                            },
                            "title":"ADDITIONAL_KYC",
                            "items":[
                                {
                                    key:"customer.additionalKYCs[].kyc1ProofNumber",
                                    type:"barcode",
                                    onCapture: function(result, model, form) {
                                        $log.info(result);
                                        model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                                    }
        
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc1ProofType",
                                    required: true,
                                    type:"select"
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc1ImagePath",
                                    required: true,
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc1ReverseImagePath",
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc1IssueDate",
                                    type:"date"
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc1ValidUptoDate",
                                    type:"date"
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc2ProofNumber",
                                    type:"barcode",
                                    onCapture: function(result, model, form) {
                                        $log.info(result);
                                        model.customer.additionalKYCs[form.arrayIndex].kyc2ProofNumber = result.text;
                                    }
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc2ProofType",
                                    type:"select"
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc2ImagePath",
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc2ReverseImagePath",
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc2IssueDate",
                                    type:"date"
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc2ValidUptoDate",
                                    type:"date"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "box",
                    "condition":"!model.enabletrue",
                    "title": "T_FAMILY_DETAILS",
                    "items": [
                        {
                        key:"customer.familyMembers",
                        type:"array",
                        titleExpr: "(model.customer.familyMembers[arrayIndex].relationShip == 'Self'?'Self':'Family Memeber')",
                        startEmpty: true,
                        items: [
                            {
                                key:"customer.familyMembers[].customerId",
                                //readonly: true,
                                type:"lov",
                                "inputMap": {
                                    "firstName": {
                                        "key": "customer.firstName",
                                        "title": "CUSTOMER_NAME"
                                    },
                                    "branchName": {
                                        "key": "customer.kgfsName",
                                        "type": "select"
                                    },
                                    "centreId": {
                                        "key": "customer.centreId",
                                        "type": "select"
                                    }
                                },
                                "outputMap": {
                                    "id": "customer.familyMembers[arrayIndex].customerId",
                                    "firstName": "customer.familyMembers[arrayIndex].familyMemberFirstName"
        
                                },
                                "searchHelper": formHelper,
                                "search": function(inputModel, form) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = Enrollment.search({
                                        'branchName': SessionStore.getBranch() || inputModel.branchName,
                                        'firstName': inputModel.first_name,
                                    }).$promise;
                                    return promise;
                                },
                                getListDisplayItem: function(data, index) {
                                    return [
                                        [data.firstName, data.fatherFirstName].join(' '),
                                        data.id
                                    ];
                                }
                            },
                            {
                                key:"customer.familyMembers[].familyMemberFirstName",
                                title:"FAMILY_MEMBER_FULL_NAME",
                                //readonly: true
                            },
                            {
                                key:"customer.familyMembers[].familyMemberLastName",
                                title:"FAMILY_MEMBER_LAST_NAME"
                            },
                            {
                                key:"customer.familyMembers[].relationShip",
                                type:"select",
                                title: "T_RELATIONSHIP"
                            },
                            {
                                key: "customer.familyMembers[].gender",
                                type: "radios",
                                title: "T_GENDER",
                                //readonly: true
                            },
                            {
                                key: "customer.familyMembers[].dateOfBirth",
                                type:"date",
                                title: "T_DATEOFBIRTH",
                                onChange: function(modelValue, form, model) {
                                if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                    model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                                },
                            },
                            {
                                key: "customer.familyMembers[].age",
                                title: "AGE",
                                "readonly":true
                                //readonly: true
                            },
                            {
                                key:"customer.familyMembers[].educationStatus",
                                type:"select",
                                title: "T_EDUCATION_STATUS"
                            },
                            {
                                key:"customer.familyMembers[].maritalStatus",
                                type:"select",
                                title: "T_MARITAL_STATUS"
                            },
                            "customer.familyMembers[].mobilePhone",
                            {
                                key:"customer.familyMembers[].healthStatus",
                                type:"radios",
                                titleMap:{
                                    "GOOD":"GOOD",
                                    "BAD":"BAD"
                                }
                            },
                            {
                                key:"customer.familyMembers[].incomes",
                                type:"array",
                                startEmpty: true,
                                items:[
                                    {
                                        key: "customer.familyMembers[].incomes[].incomeSource",
                                        type:"select"
                                    },
                                    "customer.familyMembers[].incomes[].incomeEarned",
                                    {
                                        key: "customer.familyMembers[].incomes[].frequency",
                                        type: "select"
                                    },
                                    {
                                        key: "customer.familyMembers[].incomes[].monthsPerYear",
                                        "schema": {
                                            "minimum": 1,
                                            "maximum": 12,
                                        }
                                    }
                                ]
                            },
                            // {
                            //     key:"customer.familyMembers[].enroll",
                            //     type:"button",
                            //     condition:"model.customer.currentStage=='Completed'&& !model.customer.familyMembers[arrayIndex].enrolled && ((model.customer.familyMembers[arrayIndex].relationShip).toLowerCase() != 'self' && (model.customer.familyMembers[arrayIndex].age >= 18) ) ",
                            //     title:"ENROLL_AS_CUSTOMER",
                            //     onClick: function(model, formCtrl,context) {
                            //         model.family={};
                            //         model.family=model.customer;
                            //         model.family.familydata=model.customer.familyMembers[context.arrayIndex];
                            //             $state.go("Page.Engine", {
                            //                 pageName: "ProfileInformation",
                            //                 pageId:undefined,
                            //                 pageData:model.family
                            //                 //pageData:model.customer.familyMembers[context.arrayIndex]
                            //             });
                            //     }
                            // },
                        ]
                        }  
                ]
                },
                {
                            type: "box",
                            title: "BANK_ACCOUNTS",
                            "condition":"!model.enabletrue",
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
                                    "required":true,
                                    type: "password",
                                    inputmode: "number",
                                    numberType: "tel"
                                }, {
                                    key: "customer.customerBankAccounts[].confirmedAccountNumber",
                                    "required":true,
                                    "title": "CONFIRMED_ACCOUNT_NUMBER",
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
                                }, {
                                    key:"customer.customerBankAccounts[].isDisbersementAccount",
                                    title:"isDisbursmentAccount",
                                    type:"checkbox"
                                }
                            ]
                            }]
                },
                {
                    "type": "box",
                    "condition":"!model.enabletrue",
                    "title": "EXPENDITURES",
                    "items": [{
                        key: "customer.expenditures",
                        type: "array",
                        remove: null,
                        startEmpty: true,
                        view: "fixed",
                        titleExpr: "model.customer.expenditures[arrayIndex].expenditureSource | translate",
                        items: [{
                            key: "customer.expenditures[].expenditureSource",
                            type: "select"
                        }, {
                            key: "customer.expenditures[].customExpenditureSource",
                            title: "CUSTOM_EXPENDITURE_SOURCE",
                            condition: "model.customer.expenditures[arrayIndex].expenditureSource=='Others'"
                        }, {
                            type: 'section',
                            htmlClass: 'row',
                            items: [{
                                type: 'section',
                                htmlClass: 'col-xs-6',
                                items: [{
                                    key: "customer.expenditures[].frequency",
                                    "title": "FREQUENCY",
                                    required: true,
                                    type: "select",
        
                                }]
                            }, {
                                type: 'section',
                                htmlClass: 'col-xs-6',
                                items: [{
                                    "title": "AMOUNT",
                                    key: "customer.expenditures[].annualExpenses",
                                    required: true,
                                    type: "amount",
                                }]
                            }]
                        }]
                    }]
                },
                {
                    "type":"box",
                    "condition":"!model.enabletrue",
                    "title":"BUSINESS_OCCUPATION_DETAILS",
                    "items":[
                        {
                            key:"customer.udf.userDefinedFieldValues.udf13",
                            type:"select"
                        },
                        {
                            type:"fieldset",
                            condition:"model.customer.udf.userDefinedFieldValues.udf13=='Business' || model.customer.udf.userDefinedFieldValues.udf13=='Employed'",
                            items:[
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf14",
                                    type:"select"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf7"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf22"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf8"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf9"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf10"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf11"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf12"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf23",
                                    type:"radios"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf17"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf16",
                                    type:"select"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf18",
                                    type:"select"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf19",
                                    type:"radios"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf20",
                                    type:"select"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf21",
                                    condition:"model.customer.udf.userDefinedFieldValues.udf20=='OTHERS'"
                                }
                            ]
                        },
                        {
                            type:"fieldset",
                            condition:"model.customer.udf.userDefinedFieldValues.udf13=='Agriculture'",
                            title:"AGRICULTURE_DETAILS",
                            items:[
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf24",
                                    type:"select"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf25",
                                    type:"select"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf15"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf26",
                                    type:"checkbox",
                                    "schema":{
                                        "default":false
                                    }
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf27",
                                    type:"select"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf28",
                                    "schema":{
                                        "type":"number"
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "box",
                    "condition":"!model.enabletrue",
                    "title": "T_ASSETS",
                    "items": [{
                        key: "customer.physicalAssets",
                        titleExpr: "model.customer.physicalAssets[arrayIndex].assetType",
                        type: "array",
                        startEmpty: true,
                        items: [
                        {
                            key: "customer.physicalAssets[].assetType",
                            "title": "ASSET_TYPE",
                            type: "lov",
                            autolov: true,
                            lovonly: true,
                            bindMap: {},
                            searchHelper: formHelper,
                            search: function(inputModel, form, model, context) {
                                var assetDetails = [];
                                assetDetails = formHelper.enum('asset_type').data;
                                if (!assetDetails.length) {
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
                        }, {
                            key: "customer.physicalAssets[].ownedAssetDetails",
                            condition: "model.customer.physicalAssets[arrayIndex].ownedAssetallowed",
                            "required": true,
                            type: "lov",
                            autolov: true,
                            lovonly: true,
                            bindMap: {},
                            searchHelper: formHelper,
                            search: function(inputModel, form, model, context) {
                                if (!model.customer.ownedAssetDetails.length) {
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
                        }, {
                            key: "customer.physicalAssets[].unit",
                            "title": "UNIT",
                            condition: "model.customer.physicalAssets[arrayIndex].assetunitallowed",
                            "required": true,
                            type: "lov",
                            autolov: true,
                            lovonly: true,
                            bindMap: {},
                            searchHelper: formHelper,
                            search: function(inputModel, form, model, context) {
                                if (!model.customer.assetunit.length) {
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
                        {
                            key: "customer.physicalAssets[].numberOfOwnedAsset",
                            "title": "NUMBER_OF_OWNED_ASSET",
                        }, {
                            key: "customer.physicalAssets[].ownedAssetValue",
                            "title": "OWNED_ASSET_VALUE"
                        }]
                    }, {
                        key: "customer.financialAssets",
                        title: "Financial Assets",
                        type: "array",
                        startEmpty: true,
                        items: [{
                                key: "customer.financialAssets[].instrumentType",
                                type: "select"
                            },
                            "customer.financialAssets[].nameOfInstitution", {
                                key: "customer.financialAssets[].instituteType",
                                type: "select"
                            }, {
                                key: "customer.financialAssets[].amountInPaisa",
                                type: "amount"
                            }, {
                                key: "customer.financialAssets[].frequencyOfDeposite",
                                type: "select"
                            }, {
                                key: "customer.financialAssets[].startDate",
                                type: "date"
                            }, {
                                key: "customer.financialAssets[].maturityDate",
                                type: "date"
                            }
                        ]
                    }]
                },
                {
                    type:"box",
                    "condition":"!model.enabletrue",
                    title:"T_LIABILITIES",
                    items:[
                        {
                            key:"customer.liabilities",
                            type:"array",
                            startEmpty: true,
                            title:"FINANCIAL_LIABILITIES",
                            items:[
                                {
                                    key:"customer.liabilities[].loanType",
                                    type:"select"
                                },
                                {
                                    key:"customer.liabilities[].loanSource",
                                    type:"select"
                                },
                                "customer.liabilities[].instituteName",
                                {
                                    key: "customer.liabilities[].loanAmountInPaisa",
                                    type: "amount"
                                },
                                {
                                    key: "customer.liabilities[].installmentAmountInPaisa",
                                    type: "amount"
                                },
                                {
                                    key: "customer.liabilities[].startDate",
                                    type:"date"
                                },
                                {
                                    key:"customer.liabilities[].maturityDate",
                                    type:"date"
                                },
                                {
                                    key:"customer.liabilities[].frequencyOfInstallment",
                                    type:"select"
                                },
                                {
                                    key:"customer.liabilities[].liabilityLoanPurpose",
                                    type:"select"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "box",
                    "condition":"!model.enabletrue",
                    "title": "T_HOUSE_VERIFICATION",
                    "items": [
                        {
                            "key": "customer.firstName",
                            "title": "CUSTOMER_NAME",
                            "readonly": true
                        },
                        {
                            key:"customer.nameInLocalLanguage"
                        },
                        {
                            key:"customer.addressInLocalLanguage",
                            type:"textarea"
                        },
                        {
                            key:"customer.religion",
                            type:"select"
                        },
                        {
                            key:"customer.caste",
                            "required":true,
                            type:"select"
                        },
                        {
                            key:"customer.language",
                            "required":true,
                            type:"select"
                        },
                        {
                                type:"fieldset",
                                title:"HOUSE_DETAILS",
                                items:[
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf3",
                                        type:"select"
        
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf2",
                                        condition:"model.customer.udf.userDefinedFieldValues.udf3=='RENTED'"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf4",
                                        "type":"number",
                                        "schema":{
                                            "type":"number"
                                        }
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf5",
                                        type:"radios"
        
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf31",
                                        "title":"BUILD_TYPE",
                                        "type":"select",
                                        "titleMap":{
                                                    "CONCRETE":"CONCRETE",
                                                    "MUD":"MUD",
                                                    "BRICK":"BRICK"
                                        },
                                        "schema":{
                                            "type":"string"
                                        }
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf32",
                                        title:"NUMBER_OF_ROOMS",
                                        "type":"number",
                                        "schema":{
                                            "type":"number"
                                        }
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf6",
                                        type:"checkbox",
                                        "schema":{
                                            "default":false
                                        }
                                    }
                                ]
                            },
                        {
                            "key": "customer.latitude",
                            "title": "HOUSE_LOCATION",
                            "type": "geotag",
                            "latitude": "customer.latitude",
                            "longitude": "customer.longitude",
                            "readonly": true
                        },
                        {
                            "key": "customer.nameOfRo",
                            "readonly": true
                        },
                        {
                            key:"customer.houseVerificationPhoto",
                            //offline: true,
                            type:"file",
                            fileType:"image/*",
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                            "readonly": true
                        },
                        {
                            "key":"customer.verifications",
                            "title":"VERIFICATION",
                            "add":null,
                            "remove":null,
                            "readonly": true,
                            "items":[
                                {
                                    key:"customer.verifications[].houseNo"
                                },
                                {
                                    key:"customer.verifications[].houseNoIsVerified1",
                                    "type": "checkbox",
                                    "title": "HOUSE_NO_IS_VERIFIED",
                                    "required": true,
                                    "schema": {
                                        "default": false
                                    }
                                },
                                {
                                    key:"customer.verifications[].referenceFirstName"
                                },
                                {
                                    key:"customer.verifications[].referenceLastName",
                                    "condition":"model.customer.verifications[arrayIndex].referenceLastName"
                                },
                                {
                                    key:"customer.verifications[].relationship",
                                    type:"select"
                                }
                            ]
                        },
                        {
                            key: "customer.date",
                            type:"date",
                            "readonly": true
                        },
                        {
                            "key": "customer.place",
                            "readonly": true
                        }
                    ]
                },
                {
                    "type": "box",
                    "readonly":true,"condition":"model.enabletrue && !model.additional.isStrategicEdit",
                    "title": "CUSTOMER_INFORMATION",
                    "items": [
                        {
                            key: "customer.idAndBcCustId",
                            title: "Id & BC Id",
                            titleExpr: "('ID'|translate) + ' & ' + ('BC_CUST_ID'|translate)",
                            readonly: true
                        },
                        {
                            key: "customer.urnNo",
                            title: "URN_NO",
                            readonly: true
                        },
                        {
                            key: "customer.firstName",
                            title: "FULL_NAME",
                            condition:"!model.EditBasicCustomerInfo",
                        },
                        {
                            key: "customer.firstName",
                            title: "FULL_NAME",
                            readonly:true,
                            condition:"model.EditBasicCustomerInfo",
                        },
                        {
                            key:"customer.photoImageId",
                            type:"file",
                            fileType:"image/*",
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                            readonly: true
                        },
                        {
                            key:"customer.centreId",
                            type:"select",
                            "parentEnumCode": "branch_id",
                            "parentValueExpr": "model.customer.customerBranchId",
                        },
                        {
                            key:"customer.enrolledAs",
                            type:"radios",
                            readonly: true
                        },
                        {
                            key:"customer.gender",
                            type:"radios",
                            //readonly: true
                        },
                        {
                            key:"customer.age",
                            title: "AGE",
                            type:"number",
                            readonly: true
                        },
                        {
                            key:"customer.dateOfBirth",
                            condition:"model.EditBasicCustomerInfo",
                            type:"date",
                            readonly: true
                        },
                        {
                            key:"customer.dateOfBirth",
                            onChange: function(modelValue, form, model) {
                                if (model.customer.dateOfBirth) {
                                    model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                            },
                            condition:"!model.EditBasicCustomerInfo",
                            type:"date",
                        },
                        {
                            key: "customer.fatherFirstName",
                            condition:"model.EditBasicCustomerInfo",
                            title: "FATHER_FULL_NAME",
                            readonly: true
                        },
                        {
                            key: "customer.fatherFirstName",
                            condition:"!model.EditBasicCustomerInfo",
                            title: "FATHER_FULL_NAME",
                        },
                        {
                            key:"customer.maritalStatus",
                            type:"select"
                        },
                        {
                            key: "customer.spouseFirstName",
                            title: "Spouse Full Name",
                            condition:"model.customer.maritalStatus==='MARRIED'",
                            type:"qrcode",
                            onCapture: function(result, model, form) {
                                $log.info(result); // spouse id proof
                                var aadhaarData = EnrollmentHelper.parseAadhaar(result.text);
                                $log.info(aadhaarData);
                                model.customer.udf.userDefinedFieldValues.udf33 = 'Aadhar card';
                                model.customer.udf.userDefinedFieldValues.udf36 = aadhaarData.uid;
                                model.customer.spouseFirstName = aadhaarData.name;
                                if (aadhaarData.yob) {
                                    model.customer.spouseDateOfBirth = aadhaarData.yob + '-01-01';
                                }
                            }
                        },
                        {
                            key:"customer.spouseDateOfBirth",
                            type:"date",
                            condition:"model.customer.maritalStatus==='MARRIED'",
                            "onChange": function(modelValue, form, model) {
                                if (model.customer.spouseDateOfBirth) {
                                }
                            }
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf1",
                            condition:"model.customer.maritalStatus==='MARRIED'",
                            title:"SPOUSE_LOAN_CONSENT",
                            type:"checkbox",
                            "schema":{
                                "default":false
                            }
                        },
                        {
                            key:"customer.isBiometricValidated",
                            title: "Validate Fingerprint",
                            type:"validatebiometric",
                            readonly:true,
                            category: 'CustomerEnrollment',
                            subCategory: 'FINGERPRINT',
                            helper: formHelper,
                            biometricMap: {
                                leftThumb: "model.customer.leftHandThumpImageId",
                                leftIndex: "model.customer.leftHandIndexImageId",
                                leftMiddle: "model.customer.leftHandMiddleImageId",
                                leftRing: "model.customer.leftHandRingImageId",
                                leftLittle: "model.customer.leftHandSmallImageId",
                                rightThumb: "model.customer.rightHandThumpImageId",
                                rightIndex: "model.customer.rightHandIndexImageId",
                                rightMiddle: "model.customer.rightHandMiddleImageId",
                                rightRing: "model.customer.rightHandRingImageId",
                                rightLittle: "model.customer.rightHandSmallImageId"
                            },
                            viewParams: function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            }
                        },
                        {
                            "title": "RISK_PROFILE",
                            "type": "select",
                            "key": "customer.riskProfile",
                            "enumCode":"customer_risk_profile",
                            onChange: function (valueObj, form, model) {
                            }
                        }
                    ]
                },
                {
                    "type": "box",
                    "condition":"model.additional.isStrategicEdit && model.enabletrue",
                    "title": "CUSTOMER_INFORMATION",
                    "items": [
                        {
                            key: "customer.idAndBcCustId",
                            title: "Id & BC Id",
                            titleExpr: "('ID'|translate) + ' & ' + ('BC_CUST_ID'|translate)",
                            readonly: true
                        },
                        {
                            key: "customer.urnNo",
                            title: "URN_NO",
                            readonly: true
                        },
                        {
                            key: "customer.firstName",
                            title: "FULL_NAME",
                            condition:"!model.EditBasicCustomerInfo",
                            readonly: true
                        },
                        {
                            key: "customer.firstName",
                            title: "FULL_NAME",
                            readonly:true,
                            condition:"model.EditBasicCustomerInfo",
                        },
                        {
                            key:"customer.photoImageId",
                            type:"file",
                            fileType:"image/*",
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                            readonly: true
                        },
                        {
                            key:"customer.centreId",
                            type:"select",
                            "parentEnumCode": "branch_id",
                            "parentValueExpr": "model.customer.customerBranchId",
                        },
                        {
                            key:"customer.enrolledAs",
                            type:"radios",
                            readonly: true
                            //readonly: true
                        },
                        {
                            key:"customer.gender",
                            type:"radios",
                            readonly: true
                            //readonly: true
                        },
                        {
                            key:"customer.age",
                            title: "AGE",
                            type:"number",
                            readonly: true
                        },
                        {
                            key:"customer.dateOfBirth",
                            condition:"model.EditBasicCustomerInfo",
                            type:"date",
                            readonly: true
                        },
                        {
                            key:"customer.dateOfBirth",
                            onChange: function(modelValue, form, model) {
                                if (model.customer.dateOfBirth) {
                                    model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                            },
                            condition:"!model.EditBasicCustomerInfo",
                            type:"date",
                            readonly: true
                        },
                        {
                            key: "customer.fatherFirstName",
                            condition:"model.EditBasicCustomerInfo",
                            title: "FATHER_FULL_NAME",
                            readonly: true
                        },
                        {
                            key: "customer.fatherFirstName",
                            condition:"!model.EditBasicCustomerInfo",
                            title: "FATHER_FULL_NAME",
                            readonly: true
                        },
                        {
                            key:"customer.maritalStatus",
                            type:"select",
                            readonly: true
                        },
                        {
                            key: "customer.spouseFirstName",
                            title: "Spouse Full Name",
                            condition:"model.customer.maritalStatus==='MARRIED'",
                            type:"qrcode",
                            onCapture: function(result, model, form) {
                                $log.info(result); // spouse id proof
                                var aadhaarData = EnrollmentHelper.parseAadhaar(result.text);
                                $log.info(aadhaarData);
                                model.customer.udf.userDefinedFieldValues.udf33 = 'Aadhar card';
                                model.customer.udf.userDefinedFieldValues.udf36 = aadhaarData.uid;
                                model.customer.spouseFirstName = aadhaarData.name;
                                if (aadhaarData.yob) {
                                    model.customer.spouseDateOfBirth = aadhaarData.yob + '-01-01';
                                }
                            },
                            readonly: true
                        },
                        {
                            key:"customer.spouseDateOfBirth",
                            type:"date",
                            condition:"model.customer.maritalStatus==='MARRIED'",
                            "onChange": function(modelValue, form, model) {
                                if (model.customer.spouseDateOfBirth) {
                                }
                            },
                            readonly: true
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf1",
                            condition:"model.customer.maritalStatus==='MARRIED'",
                            title:"SPOUSE_LOAN_CONSENT",
                            type:"checkbox",
                            "schema":{
                                "default":false
                            },
                            readonly: true
                        },
                        {
                            key:"customer.isBiometricValidated",
                            title: "Validate Fingerprint",
                            type:"validatebiometric",
                            readonly:true,
                            category: 'CustomerEnrollment',
                            subCategory: 'FINGERPRINT',
                            helper: formHelper,
                            biometricMap: {
                                leftThumb: "model.customer.leftHandThumpImageId",
                                leftIndex: "model.customer.leftHandIndexImageId",
                                leftMiddle: "model.customer.leftHandMiddleImageId",
                                leftRing: "model.customer.leftHandRingImageId",
                                leftLittle: "model.customer.leftHandSmallImageId",
                                rightThumb: "model.customer.rightHandThumpImageId",
                                rightIndex: "model.customer.rightHandIndexImageId",
                                rightMiddle: "model.customer.rightHandMiddleImageId",
                                rightRing: "model.customer.rightHandRingImageId",
                                rightLittle: "model.customer.rightHandSmallImageId"
                            },
                            viewParams: function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            }
                        },
                        {
                            "title": "RISK_PROFILE",
                            "type": "select",
                            "key": "customer.riskProfile",
                            "enumCode":"customer_risk_profile",
                            onChange: function (valueObj, form, model) {
                            },
                            readonly:true
                        }
                    ]
                },
                {
                    "type": "box",
                    "readonly":true,"condition":"model.enabletrue",
                    "title": "CONTACT_INFORMATION",
                    "items":[{
                        type: "fieldset",
                        title: "CUSTOMER_RESIDENTIAL_ADDRESS",
                        items: [
        
                                "customer.doorNo",
                                "customer.street",
                                "customer.locality",
                                {
                                    key:"customer.villageName",
                                    type:"select",
                                    filter: {
                                        'parentCode as branch': 'model.customer.kgfsName'
                                    },
                                    screenFilter: true
                                },
                                "customer.postOffice",
                                {
                                    key:"customer.district",
                                    type:"select",
                                    screenFilter: true
                                },
                                "customer.pincode",
                                {
                                    key:"customer.state",
                                    type:"select",
                                    screenFilter: true
                                },
                                "customer.stdCode",
                                "customer.landLineNo",
                                {
                                    "key": "customer.mobilePhone",
                                     condition:"model.EditBasicCustomerInfo",
                                    "readonly": true,    
                                },
                                {
                                    "key": "customer.mobilePhone",
                                     condition:"!model.EditBasicCustomerInfo",   
                                },
                                
                                "customer.mailSameAsResidence"
                            ]
                        },{
                            type: "fieldset",
                            title: "CUSTOMER_PERMANENT_ADDRESS",
                            condition:"!model.customer.mailSameAsResidence",
                            items: [
                                "customer.mailingDoorNo",
                                "customer.mailingStreet",
                                "customer.mailingLocality",
                                "customer.mailingPostoffice",
                                {
                                    key:"customer.mailingDistrict",
                                    type:"select",
                                    screenFilter: true
                                },
                                "customer.mailingPincode",
                                {
                                    key:"customer.mailingState",
                                    type:"select",
                                    screenFilter: true
                                }
                            ]
                        }
                    ]
                },
                {
                    type:"box",
                    "readonly":true,"condition":"model.enabletrue",
                    title:"KYC",
                    items:[
                        {
                            "key": "customer.aadhaarNo",
                            type:"qrcode",
                            onChange:"actions.setProofs(model)",
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
                            //onCapture: EnrollmentHelper.customerAadhaarOnCapture
                        },
                        {
                            type:"fieldset",
                            title:"IDENTITY_PROOF",
                            items:[
                                {
                                    key:"customer.identityProof",
                                    type:"select"
                                },
                                {
                                    key:"customer.identityProofImageId",
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                   // "offline": true
                                },
                                {
                                    key:"customer.identityProofReverseImageId",
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                },
                                {
                                    key:"customer.identityProofNo",
                                    type:"barcode",
                                    onCapture: function(result, model, form) {
                                        $log.info(result);
                                        model.customer.identityProofNo = result.text;
                                    }
                                },
                                {
                                    key:"customer.idProofIssueDate",
                                    type:"date"
                                },
                                {
                                    key:"customer.idProofValidUptoDate",
                                    type:"date"
                                },
                                {
                                    key:"customer.addressProofSameAsIdProof"
                                }
                            ]
                        },
                        {
                            type:"fieldset",
                            title:"SPOUSE_IDENTITY_PROOF",
                            condition:"model.customer.maritalStatus==='MARRIED'",
                            items:[
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf33",
                                    type:"select",
                                    onChange: function(modelValue) {
                                        $log.info(modelValue);
                                    }
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf34",
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf35",
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf36",
                                    condition: "model.customer.udf.userDefinedFieldValues.udf33 !== 'Aadhar card'",
                                    type:"barcode",
                                    onCapture: function(result, model, form) {
                                        $log.info(result); // spouse id proof
                                        model.customer.udf.userDefinedFieldValues.udf36 = result.text;
                                    }
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf36",
                                    condition: "model.customer.udf.userDefinedFieldValues.udf33 === 'Aadhar card'",
                                    type:"qrcode",
                                    onCapture: function(result, model, form) {
                                        $log.info(result); // spouse id proof
                                        var aadhaarData = EnrollmentHelper.parseAadhaar(result.text);
                                        $log.info(aadhaarData);
                                        model.customer.udf.userDefinedFieldValues.udf36 = aadhaarData.uid;
                                        model.customer.spouseFirstName = aadhaarData.name;
                                        if (aadhaarData.yob) {
                                            model.customer.spouseDateOfBirth = aadhaarData.yob + '-01-01';
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            type:"fieldset",
                            title:"ADDRESS_PROOF",
                            condition:"!model.customer.addressProofSameAsIdProof",
                            items:[
                                {
                                    key:"customer.addressProof",
                                    type:"select"
                                },
                                {
                                    key:"customer.addressProofImageId",
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                },
                                {
                                    key:"customer.addressProofReverseImageId",
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                },
                                {
                                    key:"customer.addressProofNo",
                                    type:"barcode",
                                    onCapture: function(result, model, form) {
                                        $log.info(result);
                                        model.customer.addressProofNo = result.text;
                                    },
                                    "schema":{
                                        "pattern":"^[a-zA-Z0-9]*$"
                                    }
        
                                },
                                {
                                    key:"customer.addressProofIssueDate",
                                    type:"date"
                                },
                                {
                                    key:"customer.addressProofValidUptoDate",
                                    type:"date"
                                },
                            ]
                        }
                    ]
                },
                {
                    "type":"box",
                    "readonly":true,"condition":"model.enabletrue",
                    "title":"ADDITIONAL_KYC",
                    "items":[
                        {
                            "key":"customer.additionalKYCs",
                            "type":"array",
                            "startEmpty": true,
                            "schema": {
                                "maxItems": 1
                            },
                            "title":"ADDITIONAL_KYC",
                            "items":[
                                {
                                    key:"customer.additionalKYCs[].kyc1ProofNumber",
                                    type:"barcode",
                                    onCapture: function(result, model, form) {
                                        $log.info(result);
                                        model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                                    }
        
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc1ProofType",
                                    required: true,
                                    type:"select"
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc1ImagePath",
                                    required: true,
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc1ReverseImagePath",
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc1IssueDate",
                                    type:"date"
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc1ValidUptoDate",
                                    type:"date"
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc2ProofNumber",
                                    type:"barcode",
                                    onCapture: function(result, model, form) {
                                        $log.info(result);
                                        model.customer.additionalKYCs[form.arrayIndex].kyc2ProofNumber = result.text;
                                    }
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc2ProofType",
                                    type:"select"
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc2ImagePath",
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc2ReverseImagePath",
                                    type:"file",
                                    fileType:"image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc2IssueDate",
                                    type:"date"
                                },
                                {
                                    key:"customer.additionalKYCs[].kyc2ValidUptoDate",
                                    type:"date"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "box",
                    "readonly":true,"condition":"model.enabletrue",
                    "title": "T_FAMILY_DETAILS",
                    "items": [
                        {
                        key:"customer.familyMembers",
                        type:"array",
                        titleExpr: "(model.customer.familyMembers[arrayIndex].relationShip == 'Self'?'Self':'Family Memeber')",
                        startEmpty: true,
                        items: [
                            {
                                key:"customer.familyMembers[].customerId",
                                //readonly: true,
                                type:"lov",
                                "inputMap": {
                                    "firstName": {
                                        "key": "customer.firstName",
                                        "title": "CUSTOMER_NAME"
                                    },
                                    "branchName": {
                                        "key": "customer.kgfsName",
                                        "type": "select"
                                    },
                                    "centreId": {
                                        "key": "customer.centreId",
                                        "type": "select"
                                    }
                                },
                                "outputMap": {
                                    "id": "customer.familyMembers[arrayIndex].customerId",
                                    "firstName": "customer.familyMembers[arrayIndex].familyMemberFirstName"
        
                                },
                                "searchHelper": formHelper,
                                "search": function(inputModel, form) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = Enrollment.search({
                                        'branchName': SessionStore.getBranch() || inputModel.branchName,
                                        'firstName': inputModel.first_name,
                                    }).$promise;
                                    return promise;
                                },
                                getListDisplayItem: function(data, index) {
                                    return [
                                        [data.firstName, data.fatherFirstName].join(' '),
                                        data.id
                                    ];
                                }
                            },
                            {
                                key:"customer.familyMembers[].familyMemberFirstName",
                                title:"FAMILY_MEMBER_FULL_NAME",
                                //readonly: true
                            },
                            {
                                key:"customer.familyMembers[].familyMemberLastName",
                                title:"FAMILY_MEMBER_LAST_NAME"
                            },
                            {
                                key:"customer.familyMembers[].relationShip",
                                type:"select",
                                title: "T_RELATIONSHIP"
                            },
                            {
                                key: "customer.familyMembers[].gender",
                                type: "radios",
                                title: "T_GENDER",
                                //readonly: true
                            },
                            {
                                key: "customer.familyMembers[].dateOfBirth",
                                type:"date",
                                title: "T_DATEOFBIRTH",
                                onChange: function(modelValue, form, model) {
                                if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                    model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                                },
                            },
                            {
                                key: "customer.familyMembers[].age",
                                title: "AGE",
                                "readonly":true
                                //readonly: true
                            },
                            {
                                key:"customer.familyMembers[].educationStatus",
                                type:"select",
                                title: "T_EDUCATION_STATUS"
                            },
                            {
                                key:"customer.familyMembers[].maritalStatus",
                                type:"select",
                                title: "T_MARITAL_STATUS"
                            },
                            "customer.familyMembers[].mobilePhone",
                            {
                                key:"customer.familyMembers[].healthStatus",
                                type:"radios",
                                titleMap:{
                                    "GOOD":"GOOD",
                                    "BAD":"BAD"
                                }
                            },
                            {
                                key:"customer.familyMembers[].incomes",
                                type:"array",
                                startEmpty: true,
                                items:[
                                    {
                                        key: "customer.familyMembers[].incomes[].incomeSource",
                                        type:"select"
                                    },
                                    "customer.familyMembers[].incomes[].incomeEarned",
                                    {
                                        key: "customer.familyMembers[].incomes[].frequency",
                                        type: "select"
                                    },
                                    {
                                        key: "customer.familyMembers[].incomes[].monthsPerYear",
                                        "schema": {
                                            "minimum": 1,
                                            "maximum": 12,
                                        }
                                    }
                                ]
                            },
                            // {
                            //     key:"customer.familyMembers[].enroll",
                            //     type:"button",
                            //     condition:"model.customer.currentStage=='Completed'&& !model.customer.familyMembers[arrayIndex].enrolled && ((model.customer.familyMembers[arrayIndex].relationShip).toLowerCase() != 'self' && (model.customer.familyMembers[arrayIndex].age >= 18) ) ",
                            //     title:"ENROLL_AS_CUSTOMER",
                            //     onClick: function(model, formCtrl,context) {
                            //         model.family={};
                            //         model.family=model.customer;
                            //         model.family.familydata=model.customer.familyMembers[context.arrayIndex];
                            //             $state.go("Page.Engine", {
                            //                 pageName: "ProfileInformation",
                            //                 pageId:undefined,
                            //                 pageData:model.family
                            //                 //pageData:model.customer.familyMembers[context.arrayIndex]
                            //             });
                            //     }
                            // },
                        ]
                        }  
                ]
                },
                {
                            type: "box",
                            title: "BANK_ACCOUNTS",
                            "readonly":true,"condition":"model.enabletrue",
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
                                    "required":true,
                                    type: "password",
                                    inputmode: "number",
                                    numberType: "tel"
                                }, {
                                    key: "customer.customerBankAccounts[].confirmedAccountNumber",
                                    "required":true,
                                    "title": "CONFIRMED_ACCOUNT_NUMBER",
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
                                }, {
                                    key:"customer.customerBankAccounts[].isDisbersementAccount",
                                    "title":"isDisbursementAccount",
                                    "type":"checkbox"
                                }]
                            }]
                },
                {
                    "type": "box",
                    "readonly":true,"condition":"model.enabletrue",
                    "title": "EXPENDITURES",
                    "items": [{
                        key: "customer.expenditures",
                        type: "array",
                        remove: null,
                        startEmpty: true,
                        view: "fixed",
                        titleExpr: "model.customer.expenditures[arrayIndex].expenditureSource | translate",
                        items: [{
                            key: "customer.expenditures[].expenditureSource",
                            type: "select"
                        }, {
                            key: "customer.expenditures[].customExpenditureSource",
                            title: "CUSTOM_EXPENDITURE_SOURCE",
                            condition: "model.customer.expenditures[arrayIndex].expenditureSource=='Others'"
                        }, {
                            type: 'section',
                            htmlClass: 'row',
                            items: [{
                                type: 'section',
                                htmlClass: 'col-xs-6',
                                items: [{
                                    key: "customer.expenditures[].frequency",
                                    "title": "FREQUENCY",
                                    required: true,
                                    type: "select",
        
                                }]
                            }, {
                                type: 'section',
                                htmlClass: 'col-xs-6',
                                items: [{
                                    "title": "AMOUNT",
                                    key: "customer.expenditures[].annualExpenses",
                                    required: true,
                                    type: "amount",
                                }]
                            }]
                        }]
                    }]
                },
                {
                    "type":"box",
                    "readonly":true,"condition":"model.enabletrue",
                    "title":"BUSINESS_OCCUPATION_DETAILS",
                    "items":[
                        {
                            key:"customer.udf.userDefinedFieldValues.udf13",
                            type:"select"
                        },
                        {
                            type:"fieldset",
                            condition:"model.customer.udf.userDefinedFieldValues.udf13=='Business' || model.customer.udf.userDefinedFieldValues.udf13=='Employed'",
                            items:[
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf14",
                                    type:"select"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf7"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf22"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf8"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf9"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf10"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf11"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf12"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf23",
                                    type:"radios"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf17"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf16",
                                    type:"select"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf18",
                                    type:"select"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf19",
                                    type:"radios"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf20",
                                    type:"select"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf21",
                                    condition:"model.customer.udf.userDefinedFieldValues.udf20=='OTHERS'"
                                }
                            ]
                        },
                        {
                            type:"fieldset",
                            condition:"model.customer.udf.userDefinedFieldValues.udf13=='Agriculture'",
                            title:"AGRICULTURE_DETAILS",
                            items:[
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf24",
                                    type:"select"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf25",
                                    type:"select"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf15"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf26",
                                    type:"checkbox",
                                    "schema":{
                                        "default":false
                                    }
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf27",
                                    type:"select"
                                },
                                {
                                    key:"customer.udf.userDefinedFieldValues.udf28",
                                    "schema":{
                                        "type":"number"
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "box",
                    "readonly":true,"condition":"model.enabletrue",
                    "title": "T_ASSETS",
                    "items": [{
                        key: "customer.physicalAssets",
                        titleExpr: "model.customer.physicalAssets[arrayIndex].assetType",
                        type: "array",
                        startEmpty: true,
                        items: [
                        {
                            key: "customer.physicalAssets[].assetType",
                            "title": "ASSET_TYPE",
                            type: "lov",
                            autolov: true,
                            lovonly: true,
                            bindMap: {},
                            searchHelper: formHelper,
                            search: function(inputModel, form, model, context) {
                                var assetDetails = [];
                                assetDetails = formHelper.enum('asset_type').data;
                                if (!assetDetails.length) {
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
                        }, {
                            key: "customer.physicalAssets[].ownedAssetDetails",
                            condition: "model.customer.physicalAssets[arrayIndex].ownedAssetallowed",
                            "required": true,
                            type: "lov",
                            autolov: true,
                            lovonly: true,
                            bindMap: {},
                            searchHelper: formHelper,
                            search: function(inputModel, form, model, context) {
                                if (!model.customer.ownedAssetDetails.length) {
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
                        }, {
                            key: "customer.physicalAssets[].unit",
                            "title": "UNIT",
                            condition: "model.customer.physicalAssets[arrayIndex].assetunitallowed",
                            "required": true,
                            type: "lov",
                            autolov: true,
                            lovonly: true,
                            bindMap: {},
                            searchHelper: formHelper,
                            search: function(inputModel, form, model, context) {
                                if (!model.customer.assetunit.length) {
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
                        {
                            key: "customer.physicalAssets[].numberOfOwnedAsset",
                            "title": "NUMBER_OF_OWNED_ASSET",
                        }, {
                            key: "customer.physicalAssets[].ownedAssetValue",
                            "title": "OWNED_ASSET_VALUE"
                        }]
                    }, {
                        key: "customer.financialAssets",
                        title: "Financial Assets",
                        type: "array",
                        startEmpty: true,
                        items: [{
                                key: "customer.financialAssets[].instrumentType",
                                type: "select"
                            },
                            "customer.financialAssets[].nameOfInstitution", {
                                key: "customer.financialAssets[].instituteType",
                                type: "select"
                            }, {
                                key: "customer.financialAssets[].amountInPaisa",
                                type: "amount"
                            }, {
                                key: "customer.financialAssets[].frequencyOfDeposite",
                                type: "select"
                            }, {
                                key: "customer.financialAssets[].startDate",
                                type: "date"
                            }, {
                                key: "customer.financialAssets[].maturityDate",
                                type: "date"
                            }
                        ]
                    }]
                },
                {
                    type:"box",
                    "readonly":true,"condition":"model.enabletrue",
                    title:"T_LIABILITIES",
                    items:[
                        {
                            key:"customer.liabilities",
                            type:"array",
                            startEmpty: true,
                            title:"FINANCIAL_LIABILITIES",
                            items:[
                                {
                                    key:"customer.liabilities[].loanType",
                                    type:"select"
                                },
                                {
                                    key:"customer.liabilities[].loanSource",
                                    type:"select"
                                },
                                "customer.liabilities[].instituteName",
                                {
                                    key: "customer.liabilities[].loanAmountInPaisa",
                                    type: "amount"
                                },
                                {
                                    key: "customer.liabilities[].installmentAmountInPaisa",
                                    type: "amount"
                                },
                                {
                                    key: "customer.liabilities[].startDate",
                                    type:"date"
                                },
                                {
                                    key:"customer.liabilities[].maturityDate",
                                    type:"date"
                                },
                                {
                                    key:"customer.liabilities[].frequencyOfInstallment",
                                    type:"select"
                                },
                                {
                                    key:"customer.liabilities[].liabilityLoanPurpose",
                                    type:"select"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "box",
                    "readonly":true,"condition":"model.enabletrue",
                    "title": "T_HOUSE_VERIFICATION",
                    "items": [
                        {
                            "key": "customer.firstName",
                            "title": "CUSTOMER_NAME",
                            "readonly": true
                        },
                        {
                            key:"customer.nameInLocalLanguage"
                        },
                        {
                            key:"customer.addressInLocalLanguage",
                            type:"textarea"
                        },
                        {
                            key:"customer.religion",
                            type:"select"
                        },
                        {
                            key:"customer.caste",
                            "required":true,
                            type:"select"
                        },
                        {
                            key:"customer.language",
                            "required":true,
                            type:"select"
                        },
                        {
                                type:"fieldset",
                                title:"HOUSE_DETAILS",
                                items:[
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf3",
                                        type:"select"
        
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf2",
                                        condition:"model.customer.udf.userDefinedFieldValues.udf3=='RENTED'"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf4",
                                        "type":"number",
                                        "schema":{
                                            "type":"number"
                                        }
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf5",
                                        type:"radios"
        
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf31",
                                        "title":"BUILD_TYPE",
                                        "type":"select",
                                        "titleMap":{
                                                    "CONCRETE":"CONCRETE",
                                                    "MUD":"MUD",
                                                    "BRICK":"BRICK"
                                        },
                                        "schema":{
                                            "type":"string"
                                        }
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf32",
                                        title:"NUMBER_OF_ROOMS",
                                        "type":"number",
                                        "schema":{
                                            "type":"number"
                                        }
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf6",
                                        type:"checkbox",
                                        "schema":{
                                            "default":false
                                        }
                                    }
                                ]
                            },
                        {
                            "key": "customer.latitude",
                            "title": "HOUSE_LOCATION",
                            "type": "geotag",
                            "latitude": "customer.latitude",
                            "longitude": "customer.longitude",
                            "readonly": true
                        },
                        {
                            "key": "customer.nameOfRo",
                            "readonly": true
                        },
                        {
                            key:"customer.houseVerificationPhoto",
                            //offline: true,
                            type:"file",
                            fileType:"image/*",
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                            "readonly": true
                        },
                        {
                            "key":"customer.verifications",
                            "title":"VERIFICATION",
                            "add":null,
                            "remove":null,
                            "readonly": true,
                            "items":[
                                {
                                    key:"customer.verifications[].houseNo"
                                },
                                {
                                    key:"customer.verifications[].houseNoIsVerified1",
                                    "type": "checkbox",
                                    "title": "HOUSE_NO_IS_VERIFIED",
                                    "required": true,
                                    "schema": {
                                        "default": false
                                    }
                                },
                                {
                                    key:"customer.verifications[].referenceFirstName"
                                },
                                {
                                    key:"customer.verifications[].referenceLastName",
                                    "condition":"model.customer.verifications[arrayIndex].referenceLastName"
                                },
                                {
                                    key:"customer.verifications[].relationship",
                                    type:"select"
                                }
                            ]
                        },
                        {
                            key: "customer.date",
                            type:"date",
                            "readonly": true
                        },
                        {
                            "key": "customer.place",
                            "readonly": true
                        }
                    ]
                },
                {
                    "type": "actionbox",
                    // "readonly":true,"condition":"model.enabletrue",
                    "items": [{
                        "type": "submit",
                        "title": "SUBMIT"
                    }]
                }
            ];
        },
        // modelPromise: function(pageId, _model) {
        //     var deferred = $q.defer();
        //     if (!_model || !_model.customer || _model.customer.id != pageId) {
        //         $log.info("data not there, loading...");

        //         PageHelper.showLoader();
        //         Enrollment.EnrollmentById({id:pageId},function(resp,header){
        //             var model = {$$OFFLINE_FILES$$:_model.$$OFFLINE_FILES$$};
        //             model.customer = resp;
        //             model.customer.addressProofSameAsIdProof = (model.customer.title == "true") ? true : false;

        //             model = EnrollmentHelper.fixData(model);
        //             PagesDefinition.getRolePageConfig("Page/Engine/customer360.EnrollmentProfile").then(function(data){
        //                 $log.info(data);
        //                 $log.info(data.EditBasicCustomerInfo);
        //                 if(data){
        //                     model.EditBasicCustomerInfo= !data.EditBasicCustomerInfo;
        //                     if(model.EditBasicCustomerInfo)
        //                         {
        //                             model.enabletrue = true;
        //                         }

        //                 }
        //             },function(err){
        //                 model.EditBasicCustomerInfo= true;
        //                 model.enabletrue = true;
        //             });

        //             if (model.customer.currentStage==='Stage01') {
        //                 irfProgressMessage.pop("enrollment-save","Customer "+model.customer.id+" not enrolled yet", 5000);
        //                 $state.go("Page.Engine", {pageName:'ProfileInformation', pageId:pageId});
        //             } else {
        //                 irfProgressMessage.pop("enrollment-save","Load Complete", 2000);
        //                 initData(model);
        //                 //$log.info(model);
        //                 deferred.resolve(model);
        //             }
        //             PageHelper.hideLoader();
        //         },function(resp){
        //             PageHelper.hideLoader();
        //             irfProgressMessage.pop("enrollment-save","An Error Occurred. Failed to fetch Data",5000);
        //             $state.go("Page.Engine",{
        //                 pageName:"CustomerSearch",
        //                 pageId:null
        //             });
        //         });
        //     }
        //     else{
        //         deferred.reject();
        //     }
        //     return deferred.promise;
        // },
        offline: true,
        getOfflineDisplayItem: function(item, index){
            return [
                item["customer"]["urnNo"],
                item["customer"]["firstName"],
                item["customer"]["villageName"]
            ]
        },
        form: [],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                Utils.confirm("Update - Are You Sure?", "Customer Profile").then(function() {
                    PageHelper.showLoader();
                    irfProgressMessage.pop('PROFILE', 'Working...');
                    model.customer.title=String(model.customer.addressProofSameAsIdProof);
                    $log.info(model);
                    if (!EnrollmentHelper.validateBankAccounts(model)) {
                        $log.warn("Invalid Data, returning false");
                        PageHelper.hideLoader();
                        return false;
                    }
                    if (!( EnrollmentHelper.validateDate(model))) {
                        PageHelper.hideLoader();
                        return false;
                    }
                    if(model.customer.latitude == "0") {
                        delete model.customer.latitude;
                    }
                    if(model.customer.longitude == "0") {
                        delete model.customer.longitude;
                    }
                    var reqData = _.cloneDeep(model);
                    EnrollmentHelper.fixData(reqData);
                    reqData.customer.familyMembers = mapCustomerToSelfFamilyMemeber(reqData);
                    if (reqData.customer.currentStage == 'Completed'){ 
                        reqData['enrollmentAction'] = 'PROCEED';
                    } else {
                        reqData['enrollmentAction'] = 'SAVE';    
                    };
                    Enrollment.updateCustomer(reqData, function (res, headers) {
                        if (res.customer) {
                            model.customer = res.customer;
                            model.customer.addressProofSameAsIdProof = (model.customer.title=="true")?true:false;
                            model = EnrollmentHelper.fixData(model);
                        }
                        checkCentre(model);
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('PROFILE', 'Done. Customer Updated, ID : ' + res.customer.id, 2000);
                    }, function (res, headers) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('PROFILE', 'Oops. Some error.', 2000);
                        window.scrollTo(0, 0);
                        PageHelper.showErrors(res);
                    })
                });
            }
        }
    };
}]);
