irf.pageCollection.factory(irf.page("customer360.EnrollmentProfile"),
["$log", "Enrollment", "EnrollmentHelper","PagesDefinition", "SessionStore","$state", "formHelper", "$q", "irfProgressMessage",
"PageHelper", "Utils", "BiometricService",
function($log, Enrollment, EnrollmentHelper,PagesDefinition, SessionStore,$state, formHelper, $q, irfProgressMessage,
    PageHelper, Utils, BiometricService){

    var branch = SessionStore.getBranch();

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
        model.customer.idAndBcCustId = model.customer.id + ' / ' + model.customer.bcCustId;
        model.customer.fullName = Utils.getFullName(model.customer.firstName, model.customer.middleName, model.customer.lastName);
        model.customer.fatherFullName = Utils.getFullName(model.customer.fatherFirstName, model.customer.fatherMiddleName, model.customer.fatherLastName);
        model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
    };

    var fixData = function(model) {
        $log.info("Before fixData");
        Utils.removeNulls(model, true);
        if (_.has(model.customer, 'udf.userDefinedFieldValues')) {
            var fields = model.customer.udf.userDefinedFieldValues;
            $log.info(fields);
            fields['udf17'] = Number(fields['udf17']);
            fields['udf10'] = Number(fields['udf10']);
            fields['udf11'] = Number(fields['udf11']);
            fields['udf28'] = Number(fields['udf28']);
            //fields['udf32'] = Number(fields['udf32']);
            fields['udf1'] = Boolean(fields['udf1']);
            fields['udf6'] = Boolean(fields['udf6']);
            //fields['udf4'] = Number(fields['udf4']);

            for (var i = 1; i <= 40; i++) {
                if (!_.has(model.customer.udf.userDefinedFieldValues, 'udf' + i)) {
                    model.customer.udf.userDefinedFieldValues['udf' + i] = '';
                }
            }
        }
        if (model.customer.dateOfBirth) {
            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
        }
        if (model.customer.udf.userDefinedFieldValues.udf26 != "" && model.customer.udf.userDefinedFieldValues.udf26 != null) {
            if (model.customer.udf.userDefinedFieldValues.udf26 === "true") {
                model.customer.udf.userDefinedFieldValues.udf26 = true;
            }
            if (model.customer.udf.userDefinedFieldValues.udf26 === "false") {
                model.customer.udf.userDefinedFieldValues.udf26 = false;
            }
        }
        model.customer.addressProofSameAsIdProof=Boolean(model.customer.title);
        $log.info("After fixData");
        $log.info(model);
        return model;
    };

    return {
        "id": "ProfileBasic",
        "type": "schema-form",
        "name": "ProfileBasic",
        "title": "PROFILE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Profile Page got initialized");
            initData(model);
            fixData(model);
        },
        modelPromise: function(pageId, _model) {
            if (!_model || !_model.customer || _model.customer.id != pageId) {
                $log.info("data not there, loading...");

                var deferred = $q.defer();
                PageHelper.showLoader();
                Enrollment.EnrollmentById({id:pageId},function(resp,header){
                    var model = {$$OFFLINE_FILES$$:_model.$$OFFLINE_FILES$$};
                    model.customer = resp;
                    model =fixData(model);


                    PagesDefinition.getRolePageConfig("Page/Engine/customer360.EnrollmentProfile").then(function(data){
                        $log.info(data);
                        $log.info(data.EditBasicCustomerInfo);
                        if(data){
                            model.EditBasicCustomerInfo= !data.EditBasicCustomerInfo;
                        }
                    },function(err){
                        model.EditBasicCustomerInfo= true;
                    });

                    if (model.customer.currentStage==='Stage01') {
                        irfProgressMessage.pop("enrollment-save","Customer "+model.customer.id+" not enrolled yet", 5000);
                        $state.go("Page.Engine", {pageName:'ProfileInformation', pageId:pageId});
                    } else {
                        irfProgressMessage.pop("enrollment-save","Load Complete", 2000);
                        initData(model);
                        //$log.info(model);
                        deferred.resolve(model);
                    }
                    PageHelper.hideLoader();
                },function(resp){
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("enrollment-save","An Error Occurred. Failed to fetch Data",5000);
                    $state.go("Page.Engine",{
                        pageName:"CustomerSearch",
                        pageId:null
                    });
                });
                return deferred.promise;
            }
        },
        offline: true,
        getOfflineDisplayItem: function(item, index){
            return [
                item["customer"]["urnNo"],
                item["customer"]["firstName"],
                item["customer"]["villageName"]
            ]
        },
        form: [{
            "type": "box",
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
                    key: "customer.fullName",
                    title: "FULL_NAME",
                    condition:"!model.EditBasicCustomerInfo",
                },
                {
                    key: "customer.fullName",
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
                    readonly: true
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
                    key: "customer.fatherFullName",
                    condition:"model.EditBasicCustomerInfo",
                    title: "FATHER_FULL_NAME",
                    readonly: true
                },
                {
                    key: "customer.fatherFullName",
                    condition:"!model.EditBasicCustomerInfo",
                    title: "FATHER_FULL_NAME",
                },
                {
                    key:"customer.maritalStatus",
                    type:"select"
                },
                {
                    key: "customer.spouseFirstName",
                    title: "SPOUSE_FULL_NAME",
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
                    title:"SPOUSE_LOAN_CONSENT"
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
                }
            ]
        },{
            "type": "box",
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
        },{
            type:"box",
            title:"KYC",
            items:[
                {
                    "key": "customer.aadhaarNo",
                    type:"qrcode",
                    onChange:"actions.setProofs(model)",
                    onCapture: EnrollmentHelper.customerAadhaarOnCapture
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
                            "offline": true
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
                            "offline": true
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
                            "offline": true
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
                            "offline": true
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
                            "offline": true
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
                            "offline": true
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
                            "offline": true
                        },
                        {
                            key:"customer.additionalKYCs[].kyc1ReverseImagePath",
                            required: true,
                            type:"file",
                            fileType:"image/*",
                            "offline": true
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
                            "offline": true
                        },
                        {
                            key:"customer.additionalKYCs[].kyc2ReverseImagePath",
                            type:"file",
                            fileType:"image/*",
                            "offline": true
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
            "title": "T_FAMILY_DETAILS",
            "items": [{
                key:"customer.familyMembers",
                type:"array",
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
                                key: "customer.familyMembers[].incomes[].monthsPerYear"
                            }
                        ]
                    },
                    {
                        key:"customer.familyMembers[].enroll",
                        type:"button",
                        condition:"model.customer.currentStage=='Completed'&& !model.customer.familyMembers[arrayIndex].enrolled && ((model.customer.familyMembers[arrayIndex].relationShip).toLowerCase() != 'self' ) ",
                        title:"ENROLL_AS_CUSTOMER",
                        onClick: function(model, formCtrl,context) {
                            model.family={};
                            model.family=model.customer;
                            model.family.familydata=model.customer.familyMembers[context.arrayIndex];
                            //pageId:model.customer.familyMembers[context.arrayIndex].enrollmentId,
                                $state.go("Page.Engine", {
                                    pageName: "ProfileInformation",
                                    pageId:undefined,
                                    pageData:model.family
                                    //pageData:model.customer.familyMembers[context.arrayIndex]
                                });
                        }
                    },
                ]
            }]
        },
        {
            "type": "box",
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
                            key:"customer.udf.userDefinedFieldValues.udf26"
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf27",
                            type:"select"
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf28"
                        }
                    ]
                }
            ]
        },
        {
            "type": "box",
            "title": "T_ASSETS",
            "items": [{
                key: "customer.physicalAssets",
                type: "array",
                items: [{
                    key: "customer.physicalAssets[].assetType",
                    "title": "ASSET_TYPE",
                    "enumCode": "asset_type",
                    type: "select"
                }, {
                    key: "customer.physicalAssets[].ownedAssetDetails",
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
                }, {
                    key: "customer.physicalAssets[].unit",
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
                }, {
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
                                type: "string",
                                "schema":{
                                    "type":"string"
                                }
                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf5",
                                type:"radios"

                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf31",
                                title:"BUILD_TYPE",
                                "type":"select",
                                "titleMap":{
                                            "CONCRETE":"CONCRETE",
                                            "MUD":"MUD",
                                            "BRICK":"BRICK"
                                }
                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf32",
                                title:"NUMBER_OF_ROOMS",
                                "type":"string",
                                "schema":{
                                    "type":"string"
                                }
                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf6"
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
                    offline: true,
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
                            key:"customer.verifications[].houseNoIsVerified"
                        },
                        {
                            key:"customer.verifications[].referenceFirstName"
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
        },{
            "type": "actionbox",
            "items": [{
                "type": "submit",
                "title": "SUBMIT"
            }]
        }],
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
                    var reqData = _.cloneDeep(model);
                    EnrollmentHelper.fixData(reqData);
                    if (reqData.customer.currentStage == 'Completed'){ 
                        reqData['enrollmentAction'] = 'PROCEED';
                    } else {
                        reqData['enrollmentAction'] = 'SAVE';    
                    };
                    Enrollment.updateCustomer(reqData, function (res, headers) {
                        if (res.customer) {
                            fixData(res);
                            model.customer = res.customer;
                            model.customer.idAndBcCustId = model.customer.id + ' / ' + model.customer.bcCustId;
                            model.customer.fullName = Utils.getFullName(model.customer.firstName, model.customer.middleName, model.customer.lastName);
                            model.customer.fatherFullName = Utils.getFullName(model.customer.fatherFirstName, model.customer.fatherMiddleName, model.customer.fatherLastName);
                            model = EnrollmentHelper.fixData(model);
    
                        }
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
