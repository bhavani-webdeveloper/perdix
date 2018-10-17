define({
    pageUID: "MutualFund.MutualFundPurchase",
    pageType: "Engine",
    dependencies: ["$log", "$q","Enrollment", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
                'irfProgressMessage','SessionStore',"$state", "$stateParams", "irfNavigator"],

    $pageFn: function($log, $q, Enrollment, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, irfNavigator) {

    var branch = SessionStore.getBranch();

    return {
        "id": "ProfileInformation",
        "type": "schema-form",
        "name": "Stage1",
        "title": "CUSTOMER_ENROLLMENT",
        "subTitle": "STAGE_1",
        
        initialize: function (model, form, formCtrl) {
            $stateParams.confirmExit = true;
            model.customer = model.customer || {};
            model.customer.customerType="Individual";
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
                model.customer.familyEnrollmentId = $stateParams.pageData.enrollmentId;
                model.customer.parentCustomerId = $stateParams.pageData.customerId;
                model.customer.dateOfBirth = $stateParams.pageData.dateOfBirth;
                model.customer.educationStatus = $stateParams.pageData.educationStatus;
                model.customer.firstName = $stateParams.pageData.familyMemberFirstName;
                model.customer.gender = $stateParams.pageData.gender;
                model.customer.maritalStatus = $stateParams.pageData.maritalStatus;
                model.customer.mobilePhone = $stateParams.pageData.mobilePhone;
                if (model.customer.dateOfBirth) {
                    model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                }
            }
            $log.info("ProfileInformation page got initialized:"+model.customer.customerBranchId);
        },
        modelPromise: function(pageId, _model) {
            var deferred = $q.defer();
            PageHelper.showLoader();
            irfProgressMessage.pop("enrollment-save","Loading Customer Data...");
            Enrollment.getCustomerById({id:pageId},function(resp,header){
                var model = {$$OFFLINE_FILES$$:_model.$$OFFLINE_FILES$$};
                model.customer = resp;
                model.customer.addressProofSameAsIdProof=Boolean(model.customer.title);
                model.customer.customerBranchId = model.customer.customerBranchId || _model.customer.customerBranchId;
                model.customer.kgfsBankName = model.customer.kgfsBankName || SessionStore.getBankName();
                model = EnrollmentHelper.fixData(model);
                model.customer.addressProofSameAsIdProof=Boolean(model.customer.title);
                if (model.customer.dateOfBirth) {
                    model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                }
                if (model.customer.spouseDateOfBirth) {
                    model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                }
                model._mode = 'EDIT';
                if (model.customer.currentStage==='Stage01') {
                    irfProgressMessage.pop("enrollment-save","Load Complete",2000);
                    deferred.resolve(model);
                    window.scrollTo(0, 0);
                } else {
                    irfProgressMessage.pop("enrollment-save","Customer "+model.customer.id+" already enrolled", 5000);
                    $stateParams.confirmExit = false;
                    irfNavigator.goBack();
                }
                PageHelper.hideLoader();
            },function(resp){
                PageHelper.hideLoader();
                irfProgressMessage.pop("enrollment-save","An Error Occurred. Failed to fetch Data",5000);
                $stateParams.confirmExit = false;
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
                    key:"customer.centreId",
                    type:"select",
                    "enumCode": "centre",
                    "parentEnumCode": "branch_id",
                    "parentValueExpr": "model.customer.customerBranchId",
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
        },{
            "type": "box",
            "title": "CONTACT_INFORMATION",
            "items":[{
                type: "fieldset",
                title: "CUSTOMER_RESIDENTIAL_ADDRESS",
                items: [

                        {
                            key:"customer.doorNo",
                            "required": true
                        },
                        "customer.street",
                        {
                            key:"customer.locality",
                            "required": true
                        },
                        {
                            key:"customer.villageName",
                            type:"select",
                            "enumCode":"village",
                            filter: {
                            parentCode: 'model.customer.customerBranchId'
                            },
                            screenFilter: true
                        },
                        {
                            key:"customer.postOffice",
                            required: true
                        },
                        {
                            key:"customer.district",
                            type:"select",
                            "enumCode":"district_master",
                            screenFilter: true,
                            parentEnumCode: "bankname",
                            parentValueExpr: "model.customer.kgfsBankName"
                        },
                        "customer.pincode",
                        {
                            key:"customer.state",
                            type:"select",
                            "enumCode":"state_master",
                            screenFilter: true,
                            parentEnumCode: "bankname",
                            parentValueExpr: "model.customer.kgfsBankName"
                        },
                        "customer.stdCode",
                        "customer.landLineNo",
                        {
                            key: "customer.mobilePhone",
                            required: true
                        },
                        "customer.mailSameAsResidence"
                    ]
                },{
                    type: "fieldset",
                    title: "CUSTOMER_PERMANENT_ADDRESS",
                    condition:"!model.customer.mailSameAsResidence",
                    items: [
                        {
                            key:"customer.mailingDoorNo",
                            required: true
                        },
                        "customer.mailingStreet",
                        {
                            key:"customer.mailingLocality",
                            required: true
                        },
                        {
                            key:"customer.mailingPostoffice",
                            required: true
                        },
                        {
                            key:"customer.mailingDistrict",
                            type:"select",
                            screenFilter: true,
                            "enumCode":"district_master",
                            parentEnumCode: "bankname",
                            parentValueExpr: "model.customer.kgfsBankName"
                        },
                        "customer.mailingPincode",
                        {
                            key:"customer.mailingState",
                            type:"select",
                            "enumCode":"state_master",
                            screenFilter: true,
                            parentEnumCode: "bankname",
                            parentValueExpr: "model.customer.kgfsBankName"
                        }
                    ]
                }
            ]
        },{
            type:"box",
            title:"KYC",
            items:[
                {
                    key: "customer.aadhaarNo",
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
                            key:"customer.identityProofReverseImageId",
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
                            key:"customer.addressProofReverseImageId",
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
                            type:"file",
                            required: true,
                            fileType:"image/*",
                            "offline": true
                        },
                        {
                            key:"customer.additionalKYCs[].kyc1ReverseImagePath",
                            type:"file",
                            required: true,
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
        },{
            "type": "actionbox",
            "condition": "model._mode != 'EDIT'",
            "items": [{
                "type": "save",
                "title": "SAVE_OFFLINE",
            },{
                "type": "submit",
                "title": "SUBMIT"
            }]
        },{
            "type": "actionbox",
            "condition": "model._mode == 'EDIT'",
            "items": [{
                "type": "save",
                "title": "SAVE_OFFLINE",
            },{
                "type": "submit",
                "title": "SUBMIT"
            },{
                "type": "button",
                "icon": "fa fa-user-plus",
                "title": "ENROLL_CUSTOMER",
                "onClick": "actions.proceed(model, formCtrl, form, $event)"
            },{
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
            submit: function(model, form, formName){

                $log.info("Inside submit()");
                model.customer.customerType="Individual";
                model.customer.title=String(model.customer.addressProofSameAsIdProof);
               /* var centres = formHelper.enum('centre').data;
                for (var i = 0; i < centres.length; i++) {
                    if ((centres[i].code) == model.customer.centreCode) {
                        model.customer.centreId = centres[i].id;
                    }
                }*/

                model.customer.miscellaneous=null;
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
                reqData.customer.addressProofSameAsIdProof=Boolean(reqData.customer.title);
                $log.info(JSON.stringify(sortFn(reqData)));
                EnrollmentHelper.saveData(reqData).then(function(res){
                    model.customer = _.clone(res.customer);
                    model = EnrollmentHelper.fixData(model);
                    model.customer.addressProofSameAsIdProof=Boolean(model.customer.title);

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

                if (formCtrl && formCtrl.$invalid) {
                    PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
                    return false;
                }
                model.customer.ageProof=model.customer.addressProofSameAsIdProof;
                model.customer.customerType="Individual";
                var reqData = _.cloneDeep(model);
                if(reqData.customer.id && reqData.customer.currentStage === 'Stage01'){
                    $log.info("Customer id not null, skipping save");
                    EnrollmentHelper.proceedData(reqData).then(function (res) {
                        $stateParams.confirmExit = false;
                        irfNavigator.goBack();
                    });
                }
            },
            reload: function(model, formCtrl, form, $event) {
                $stateParams.confirmExit = false;
                $state.go("Page.Engine", {
                    pageName: 'ProfileInformation',
                    pageId: model.customer.id
                },{
                    reload: true,
                    inherit: false,
                    notify: true
                });
            }
        }
    };
    }
})
