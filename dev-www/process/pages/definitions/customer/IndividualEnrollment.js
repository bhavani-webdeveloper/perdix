irf.pageCollection.factory(irf.page("customer.IndividualEnrollment"),
["$log", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
"PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries",
function($log, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
    PageHelper, Utils, BiometricService, PagesDefinition, Queries){

    var branch = SessionStore.getBranch();

    var initData = function(model) {
        model.customer.idAndBcCustId = model.customer.id + ' / ' + model.customer.bcCustId;
        model.customer.fullName = Utils.getFullName(model.customer.firstName, model.customer.middleName, model.customer.lastName);
        model.customer.fatherFullName = Utils.getFullName(model.customer.fatherFirstName, model.customer.fatherMiddleName, model.customer.fatherLastName);
        model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
    };

    return {
        "type": "schema-form",
        "title": "INDIVIDUAL_ENROLLMENT",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            model.customer = model.customer || {};
            model.branchId = SessionStore.getBranchId() + '';

            model.customer.date = model.customer.date || Utils.getCurrentDate();
/*
            $log.info('STORAGE_KEY: ' + model.$$STORAGE_KEY$$);
            if (!model.$$STORAGE_KEY$$) {
                var expenditure = formHelper.enum('expenditure');
                if (expenditure) {
                    var expenditureSourcesTitlemap = expenditure.data;
                    model.customer.expenditures = [];
                    _.forEach(expenditureSourcesTitlemap, function(v){
                        if (v.value !== 'Other') {
                            model.customer.expenditures.push({expenditureSource:v.value,frequency:'Monthly',annualExpenses:0});
                        }
                    });
                }
            }
*/
            model.customer.familyMembers = model.customer.familyMembers || [];
            var self = null;
            _.each(model.customer.familyMembers, function(v){
                if (v.relationShip === 'Self') {
                    self = v;
                }
            });
            if (!self) {
                self = {
                    customerId: model.customer.id,
                    familyMemberFirstName: model.customer.firstName,
                    relationShip: 'Self',
                    gender: model.customer.gender,
                    dateOfBirth: model.customer.dateOfBirth,
                    maritalStatus: model.customer.maritalStatus,
                    mobilePhone: model.customer.mobilePhone || '',
                    age: moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years')
                };
                model.customer.familyMembers.push(self);
            } else {
                // TODO already self available, can verify here
            }

            model.customer.nameOfRo = model.customer.nameOfRo || SessionStore.getLoginname();
            if (!model.customer.verifications || !model.customer.verifications.length) {
                model.customer.verifications = [
                    {
                        "relationship": "Neighbour"
                    },
                    {
                        "relationship": "Neighbour"
                    }
                ];
            }
            model = Utils.removeNulls(model,true);
            model.customer.customerType = 'Individual';
        },
        modelPromise: function(pageId, _model) {
            var deferred = $q.defer();
            PageHelper.showLoader();
            irfProgressMessage.pop("enrollment-save","Loading Customer Data...");
            Enrollment.getCustomerById({id:pageId},function(resp,header){
                var model = {$$OFFLINE_FILES$$:_model.$$OFFLINE_FILES$$};
                model.customer = resp;
                model = EnrollmentHelper.fixData(model);
                model._mode = 'EDIT';
                if (model.customer.currentStage==='Stage01') {
                    irfProgressMessage.pop("enrollment-save","Load Complete",2000);
                    deferred.resolve(model);
                    window.scrollTo(0, 0);
                } else {
                    irfProgressMessage.pop("enrollment-save","Customer "+model.customer.id+" already enrolled", 5000);
                    $state.go("Page.Landing");
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
        },
        offline: true,
        getOfflineDisplayItem: function(item, index){
            return [
                item.customer.urnNo,
                Utils.getFullName(item.customer.firstName, item.customer.middleName, item.customer.lastName),
                item.customer.villageName
            ]
        },
        form: [{
            "type": "box",
            "title": "PERSONAL_INFORMATION",
            "items": [
                {
                    key: "customer.firstName",
                    title:"FULL_NAME",
                    type:"qrcode",
                    onCapture: EnrollmentHelper.customerAadhaarOnCapture
                },
                {
                    key:"customer.photoImageId",
                    type:"file",
                    fileType:"image/*",
                    "offline": true
                },
                {
                    key:"customer.centreCode",
                    type:"select",
                    filter: {
                        "parentCode": "model.branchId"
                    },
                    screenFilter: true
                },
                {
                    key:"customer.enrolledAs",
                    type:"radios"
                },
                {
                    key:"customer.gender",
                    type:"radios"
                },
                {
                    key:"customer.age",
                    title: "AGE",
                    type:"number",
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
                {
                    key:"customer.dateOfBirth",
                    type:"date",
                    "onChange": function(modelValue, form, model) {
                        if (model.customer.dateOfBirth) {
                            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                    }
                },
                {
                    key: "customer.fatherFirstName",
                    title: "FATHER_FULL_NAME"
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
                            model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                    }
                },
                {
                    key:"customer.spouseAge",
                    title: "SPOUSE_AGE",
                    type:"number",
                    condition:"model.customer.maritalStatus==='MARRIED'",
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
                {
                    key:"customer.spouseDateOfBirth",
                    type:"date",
                    condition:"model.customer.maritalStatus==='MARRIED'",
                    "onChange": function(modelValue, form, model) {
                        if (model.customer.spouseDateOfBirth) {
                            model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                    }
                },
                {
                    key:"customer.udf.userDefinedFieldValues.udf1",
                    condition:"model.customer.maritalStatus==='MARRIED'",
                    title:"SPOUSE_LOAN_CONSENT"
                }
            ]
        },
        {
            "type": "box",
            "title": "CONTACT_INFORMATION",
            "items": [
                {
                    type: "fieldset",
                    title: "CUSTOMER_RESIDENTIAL_ADDRESS",
                    items: [
                        "customer.doorNo",
                        "customer.street",
                        "customer.locality",
                        {
                            key:"customer.villageName"/*,
                            type:"select",
                            filter: {
                                'parentCode': 'model.branchId'
                            },
                            screenFilter: true*/
                        },
                        "customer.postOffice",
                        {
                            key:"customer.district"/*,
                            type:"select",
                            screenFilter: true*/
                        },
                        {
                            key: "customer.pincode",
                            type: "lov",
                            fieldType: "number",
                            autolov: true,
                            inputMap: {
                                "pincode": {
                                    key: "customer.pincode"
                                },
                                "district": {
                                    key: "customer.district"
                                },
                                "state": {
                                    key: "customer.state"
                                }
                            },
                            outputMap: {
                                "pincode": "customer.pincode",
                                "district": "customer.district",
                                "state": "customer.state"
                            },
                            searchHelper: formHelper,
                            search: function(inputModel, form, model) {
                                return Queries.getPincodes(inputModel.pincode, inputModel.district, inputModel.state);
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.pincode,
                                    item.district + ', ' + item.state
                                ];
                            }
                        },
                        {
                            key:"customer.state"/*,
                            type:"select",
                            screenFilter: true*/
                        },
                        "customer.stdCode",
                        "customer.landLineNo",
                        "customer.mobilePhone",
                        "customer.mailSameAsResidence"
                    ]
                },
                {
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
                            "offline": true
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf30",
                            type:"file",
                            fileType:"image/*",
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
                            "offline": true
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf29",
                            type:"file",
                            fileType:"image/*",
                            "offline": true
                        },
                        {
                            key:"customer.addressProofNo",
                            type:"barcode",
                            onCapture: function(result, model, form) {
                                $log.info(result);
                                model.customer.addressProofNo = result.text;
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
                            "offline": true
                        },
                        {
                            key:"customer.udf.userDefinedFieldValues.udf35",
                            type:"file",
                            fileType:"image/*",
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
                                    model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                            }
                        }
                    ]
                }

            ]
        },{
            "type":"box",
            "title":"ADDITIONAL_KYC",
            "items":[
                {
                    "key":"customer.additionalKYCs",
                    "type":"array",
                    "add":null,
                    "remove":null,
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
                            type:"select"
                        },
                        {
                            key:"customer.additionalKYCs[].kyc1ImagePath",
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
                                "centreCode": {
                                    "key": "customer.centreCode",
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
                            title:"FAMILY_MEMBER_FULL_NAME"
                        },
                        {
                            key:"customer.familyMembers[].relationShip",
                            type:"select",
                            title: "T_RELATIONSHIP"
                        },
                        {
                            key: "customer.familyMembers[].gender",
                            type: "radios",
                            title: "T_GENDER"
                        },
                        {
                            key:"customer.familyMembers[].age",
                            title: "AGE",
                            type:"number",
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
                        {
                            key: "customer.familyMembers[].dateOfBirth",
                            type:"date",
                            title: "T_DATEOFBIRTH",
                            "onChange": function(modelValue, form, model, formCtrl, event) {
                                if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                    model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                            }
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
                            },

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
                                }

                            ]

                        }
                    ]
                }]
            },
            {
                "type": "box",
                "title": "EXPENDITURES",
                "items": [{
                    key:"customer.expenditures",
                    type:"array",
                    startEmpty: true,
                    // remove: null,
                    // view: "fixed",
                    titleExpr: "model.customer.expenditures[arrayIndex].expenditureSource | translate",
                    items:[{
                        type: 'section',
                        htmlClass: 'row',
                        items: [{
                            type: 'section',
                            htmlClass: 'col-xs-6',
                            items: [{
                                key:"customer.expenditures[].frequency",
                                type:"select",
                                notitle: true
                            }]
                        },{
                            type: 'section',
                            htmlClass: 'col-xs-6',
                            items: [{
                                key: "customer.expenditures[].annualExpenses",
                                type:"amount",
                                notitle: true
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
                "items": [
                    {
                        key: "customer.physicalAssets",
                        type: "array",
                        startEmpty: true,
                        items: [
                            {
                                key:"customer.physicalAssets[].ownedAssetDetails",
                                type:"select"

                            },
                            "customer.physicalAssets[].numberOfOwnedAsset",
                            {
                                key:"customer.physicalAssets[].ownedAssetValue",
                            }
                        ]
                    },
                    {
                        key: "customer.financialAssets",
                        title:"FINANCIAL_ASSETS",
                        type: "array",
                        startEmpty: true,
                        items: [
                            {
                                key:"customer.financialAssets[].instrumentType",
                                type:"select"
                            },
                            "customer.financialAssets[].nameOfInstitution",
                            {
                                key:"customer.financialAssets[].instituteType",
                                type:"select"
                            },
                            {
                                key: "customer.financialAssets[].amountInPaisa",
                                type: "amount"
                            },
                            {
                                key:"customer.financialAssets[].frequencyOfDeposite",
                                type:"select"
                            },
                            {
                                key:"customer.financialAssets[].startDate",
                                type:"date"
                            },
                            {
                                key:"customer.financialAssets[].maturityDate",
                                type:"date"
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
                "title": "BIOMETRIC",
                "items": [
                    {
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
                    {
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
                        type:"select"
                    },
                    {
                        key:"customer.language",
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

                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf5",
                                type:"radios"

                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf31",
                                "type":"select"

                            },
                            {
                                key:"customer.udf.userDefinedFieldValues.udf32"

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
                        "longitude": "customer.longitude"
                    },
                    {
                        key: "customer.nameOfRo",
                        readonly: true
                    },
                    {
                        key:"customer.houseVerificationPhoto",
                        offline: true,
                        type:"file",
                        fileType:"image/*"
                    },
                    {
                        "key":"customer.verifications",
                        "title":"VERIFICATION",
                        "add":null,
                        "remove":null,
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
                        type:"date"
                    },
                    "customer.place"
                ]
            },{
            "type": "actionbox",
            "items": [{
                "type": "save",
                "title": "SAVE"
            },{
                "type": "submit",
                "title": "SUBMIT"
            }]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            setProofs:function(model){
                model.customer.addressProofNo=model.customer.aadhaarNo;
                model.customer.identityProofNo=model.customer.aadhaarNo;
                model.customer.identityProof='Aadhar card';
                model.customer.addressProof='Aadhar card';
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
            proceed: function(model, formCtrl, form, $event) {
                var reqData = _.cloneDeep(model);
                if(reqData.customer.id && reqData.customer.currentStage === 'Stage01'){
                    $log.info("Customer id not null, skipping save");
                    EnrollmentHelper.proceedData(reqData).then(function (res) {
                        $state.go("Page.Landing");
                    });
                }
            },
            reload: function(model, formCtrl, form, $event) {
                $state.go("Page.Engine", {
                    pageName: 'ProfileInformation',
                    pageId: model.customer.id
                },{
                    reload: true,
                    inherit: false,
                    notify: true
                });
            },
            submit: function(model, form, formName){
                var actions = this.actions;
                $log.info("Inside submit()");
                $log.warn(model);
                if (!EnrollmentHelper.validateData(model)) {
                    $log.warn("Invalid Data, returning false");
                    return false;
                }
                var sortFn = function(unordered){
                    var out = {};
                    Object.keys(unordered).sort().forEach(function(key) {
                        out[key] = unordered[key];
                    });
                    return out;
                };
                var reqData = _.cloneDeep(model);
                EnrollmentHelper.fixData(reqData);


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

                // $q.all start
                $q.all(fpPromisesArr).then(function(){

                    var reqData = _.cloneDeep(model);

                    if (reqData['customer']['miscellaneous']){
                        var misc = reqData['customer']['miscellaneous'];
                        if (misc['alcoholConsumption']){
                            misc['alcoholConsumption'] = "Yes"
                        } else {
                            misc['alcoholConsumption'] = "No"
                        }

                        if (misc['narcoticsConsumption']){
                            misc['narcoticsConsumption'] = "Yes"
                        } else {
                            misc['narcoticsConsumption'] = "No"
                        }

                        if (misc['tobaccoConsumption']){
                            misc['tobaccoConsumption'] = "Yes"
                        } else {
                            misc['tobaccoConsumption'] = "No"
                        }
                    }

                    try{
                        var liabilities = reqData['customer']['liabilities'];
                        if (liabilities && liabilities!=null && typeof liabilities.length == "number" && liabilities.length >0 ){
                            for (var i=0; i<liabilities.length;i++){
                                var l = liabilities[i];
                                l.loanAmountInPaisa = l.loanAmountInPaisa * 100;
                                l.installmentAmountInPaisa = l.installmentAmountInPaisa * 100;
                            }
                        }

                        var financialAssets = reqData['customer']['financialAssets'];
                        if (financialAssets && financialAssets!=null && typeof financialAssets.length == "number" && financialAssets.length >0 ){
                            for (var i=0; i<financialAssets.length;i++){
                                var f = financialAssets[i];
                                f.amountInPaisa = f.amountInPaisa * 100;
                            }
                        }
                    } catch(e){
                        $log.info("Error trying to change amount info.");
                    }

                    reqData['enrollmentAction'] = 'PROCEED';

                    irfProgressMessage.pop('enrollment-submit', 'Working... Please wait.', 5000);

                    reqData.customer.verified = true;
                    if (reqData.customer.hasOwnProperty('verifications')){
                        var verifications = reqData.customer['verifications'];
                        for (var i=0; i<verifications.length; i++){
                            if (verifications[i].houseNoIsVerified){
                                verifications[i].houseNoIsVerified=1;
                            }
                            else{
                                verifications[i].houseNoIsVerified=0;
                            }
                        }
                    }
                    try{
                        for(var i=0;i<reqData.customer.familyMembers.length;i++){
                            var incomes = reqData.customer.familyMembers[i].incomes;

                            for(var j=0;j<incomes.length;j++){
                                switch(incomes[i].frequency){
                                    case 'M': incomes[i].monthsPerYear=12; break;
                                    case 'Monthly': incomes[i].monthsPerYear=12; break;
                                    case 'D': incomes[i].monthsPerYear=365; break;
                                    case 'Daily': incomes[i].monthsPerYear=365; break;
                                    case 'W': incomes[i].monthsPerYear=52; break;
                                    case 'Weekly': incomes[i].monthsPerYear=52; break;
                                    case 'F': incomes[i].monthsPerYear=26; break;
                                    case 'Fornightly': incomes[i].monthsPerYear=26; break;
                                    case 'Fortnightly': incomes[i].monthsPerYear=26; break;
                                }
                            }
                        }
                    }catch(err){
                        console.error(err);
                    }
                    Utils.removeNulls(reqData,true);

                    EnrollmentHelper.saveData(reqData).then(function(res){
                        model.customer = _.clone(res.customer);
                        model = EnrollmentHelper.fixData(model);
                        
                        Enrollment.updateEnrollment(reqData,
                        function(res, headers){
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('enrollment-submit', 'Done. Customer URN created : ' + res.customer.urnNo, 5000);
                            $log.info("Inside updateEnrollment Success!");
                            $state.go("Page.Landing");
                        },
                        function(res, headers){
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('enrollment-submit', 'Oops. Some error.', 2000);
                            PageHelper.showErrors(res);
                        });
                    });
                });
                // $q.all end
            }
        }
    };
}]);
