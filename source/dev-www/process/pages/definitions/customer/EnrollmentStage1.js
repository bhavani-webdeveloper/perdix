irf.pageCollection.factory("EnrollmentHelper",
["$log", "$q","Enrollment", 'PageHelper', 'irfProgressMessage', 'Utils', 'SessionStore',
function($log, $q, Enrollment, PageHelper, irfProgressMessage, Utils, SessionStore){

    var fixData = function(model){
        /* TODO Validations *

        /* Fix to make additionalKYCs as an array */
        //reqData['customer']['additionalKYCs'] = [reqData['customer']['additionalKYCs']];

        /* Fix to add atleast one fingerprint */
        model['customer']['leftHandIndexImageId'] = "232";

        if (model['customer']['mailSameAsResidence'] === true){
            model['customer']['mailingDoorNo'] = model['customer']['doorNo'];
            model['customer']['mailingStreet'] = model['customer']['street'];
            model['customer']['mailingLocality'] = model['customer']['locality'];
            model['customer']['mailingPostoffice'] = model['customer']['postOffice'];
            model['customer']['mailingDistrict'] = model['customer']['district'];
            model['customer']['mailingPincode'] = model['customer']['pincode'];
            model['customer']['mailingState'] = model['customer']['state'];
        }

        if(model.customer.addressProofSameAsIdProof){

            model.customer.addressProof=_.clone(model.customer.identityProof);
            model.customer.addressProofImageId=_.clone(model.customer.identityProofImageId);
            model.customer.addressProofNo=_.clone(model.customer.identityProofNo);
            model.customer.addressProofIssueDate=_.clone(model.customer.idProofIssueDate);
            model.customer.addressProofValidUptoDate=_.clone(model.customer.idProofValidUptoDate);
            //model.customer.udf.userDefinedFieldValues.udf29 = _.clone(model.customer.udf.userDefinedFieldValues.udf30);
            model.customer.addressProofReverseImageId = _.clone(model.customer.identityProofReverseImageId);
        }
        if (model.customer.udf && model.customer.udf.userDefinedFieldValues
            && model.customer.udf.userDefinedFieldValues.udf1) {
            model.customer.udf.userDefinedFieldValues.udf1 =
                model.customer.udf.userDefinedFieldValues.udf1 === true
                || model.customer.udf.userDefinedFieldValues.udf1 === 'true';
        }

        Utils.removeNulls(model,true);
        return model;
    };

    var validateData = function(model) {
        PageHelper.clearErrors();
        if (model.customer.udf && model.customer.udf.userDefinedFieldValues) {
            if (model.customer.udf.userDefinedFieldValues.udf36
                || model.customer.udf.userDefinedFieldValues.udf35
                || model.customer.udf.userDefinedFieldValues.udf34) {
                if (!model.customer.udf.userDefinedFieldValues.udf33) {
                    PageHelper.setError({message:'Spouse ID Proof type is mandatory when Spouse ID Details are given'});
                    return false;
                }
            }
        }
        if (model.customer.additionalKYCs[0]
            && (model.customer.additionalKYCs[0].kyc1ProofNumber
            || model.customer.additionalKYCs[0].kyc1ProofType
            || model.customer.additionalKYCs[0].kyc1ImagePath
            || model.customer.additionalKYCs[0].kyc1IssueDate
            || model.customer.additionalKYCs[0].kyc1ValidUptoDate)) {
            if (model.customer.additionalKYCs[0].kyc1ProofNumber
                && model.customer.additionalKYCs[0].kyc1ProofType
                && model.customer.additionalKYCs[0].kyc1ImagePath
                && model.customer.additionalKYCs[0].kyc1IssueDate
                && model.customer.additionalKYCs[0].kyc1ValidUptoDate) {
                if (moment(model.customer.additionalKYCs[0].kyc1IssueDate).isAfter(moment())) {
                    PageHelper.setError({message:'Issue date should be a past date in Additional KYC 1'});
                    return false;
                }
                if (moment(model.customer.additionalKYCs[0].kyc1ValidUptoDate).isBefore(moment())) {
                    PageHelper.setError({message:'Valid upto date should be a future date in Additional KYC 1'});
                    return false;
                }
            } else {
                PageHelper.setError({message:'All fields are mandatory while submitting Additional KYC 1'});
                return false;
            }
        }
        if (model.customer.additionalKYCs[1]
            && (model.customer.additionalKYCs[1].kyc1ProofNumber
            || model.customer.additionalKYCs[1].kyc1ProofType
            || model.customer.additionalKYCs[1].kyc1ImagePath
            || model.customer.additionalKYCs[1].kyc1IssueDate
            || model.customer.additionalKYCs[1].kyc1ValidUptoDate)) {
            if (model.customer.additionalKYCs[1].kyc1ProofNumber
                && model.customer.additionalKYCs[1].kyc1ProofType
                && model.customer.additionalKYCs[1].kyc1ImagePath
                && model.customer.additionalKYCs[1].kyc1IssueDate
                && model.customer.additionalKYCs[1].kyc1ValidUptoDate) {
                if (moment(model.customer.additionalKYCs[1].kyc1IssueDate).isAfter(moment())) {
                    PageHelper.setError({message:'Issue date should be a past date in Additional KYC 2'});
                    return false;
                }
                if (moment(model.customer.additionalKYCs[1].kyc1ValidUptoDate).isBefore(moment())) {
                    PageHelper.setError({message:'Valid upto date should be a future date in Additional KYC 2'});
                    return false;
                }
            } else {
                PageHelper.setError({message:'All fields are mandatory while submitting Additional KYC 2'});
                return false;
            }
        }
        return true;
    };
    /*
    * function saveData:
    *
    * if cust id is not set, data is saved and the promise is resolved with SAVE's response
    * if cust id is set, promise is rejected with true (indicates doProceed)
    * if error occurs during save, promise is rejected with false (indicates don't proceed
    * */
    var saveData = function(reqData){

        var deferred = $q.defer();
        $log.info("Attempting Save");
        $log.info(reqData);
        PageHelper.clearErrors();
        PageHelper.showLoader();
        irfProgressMessage.pop('enrollment-save', 'Working...');
        reqData['enrollmentAction'] = 'SAVE';
        var action = reqData.customer.id ? 'update' : 'save';
        Enrollment[action](reqData, function (res, headers) {
            irfProgressMessage.pop('enrollment-save', 'Data Saved', 2000);
            $log.info(res);
            PageHelper.hideLoader();
            deferred.resolve(res);
        }, function (res) {
            PageHelper.hideLoader();
            irfProgressMessage.pop('enrollment-save', 'Oops. Some error.', 2000);
            PageHelper.showErrors(res);
            deferred.reject(false);
        });
        return deferred.promise;

    };
    /*
    * fn proceedData:
    *
    * if cust id not set, promise rejected with null
    * if cust id set, promise resolved with PROCEED response
    * if error occurs, promise rejected with null.
    * */
    var proceedData = function(res){

        var deferred = $q.defer();
        $log.info("Attempting Proceed");
        $log.info(res);
        if(res.customer.id===undefined || res.customer.id===null){
            $log.info("Customer id null, cannot proceed");
            deferred.reject(null);
        }
        else {
            PageHelper.clearErrors();
            PageHelper.showLoader();
            irfProgressMessage.pop('enrollment-save', 'Working...');
            res.enrollmentAction = "PROCEED";
            Enrollment.updateEnrollment(res, function (res, headers) {
                PageHelper.hideLoader();
                irfProgressMessage.pop('enrollment-save', 'Done. Customer created with ID: ' + res.customer.id, 5000);
                deferred.resolve(res);
            }, function (res, headers) {
                PageHelper.hideLoader();
                irfProgressMessage.pop('enrollment-save', 'Oops. Some error.', 2000);
                PageHelper.showErrors(res);
                deferred.reject(null);
            });
        }
        return deferred.promise;

    };

    var parseAadhaar = function(aadhaarXml) {
        var aadhaarData = {
            "uid" :null,
            "name":null,
            "gender":null,
            "dob":null,
            "yob":null,
            "co":null,
            "house":null,
            "street":null,
            "lm":null,
            "loc":null,
            "vtc":null,
            "dist":null,
            "state":null,
            "pc":null
        };
        var aadhaarDoc = $.parseXML(aadhaarXml);
        aadhaarXmlData = $(aadhaarDoc).find('PrintLetterBarcodeData');
        if (aadhaarXmlData && aadhaarXmlData.length) {
            angular.forEach(aadhaarXmlData[0].attributes, function(attr, i){
                this[attr.name] = attr.value;
            }, aadhaarData);
            aadhaarData['pc'] = Number(aadhaarData['pc']);
            var g = aadhaarData['gender'].toUpperCase();
            aadhaarData['gender'] = (g === 'M' || g === 'MALE') ? 'MALE' : ((g === 'F' || g === 'FEMALE') ? 'FEMALE' : 'OTHERS');
        }
        return aadhaarData;
    };

    var customerAadhaarOnCapture = function(result, model, form) {
        $log.info(result); // spouse id proof
        // "co":""
        // "lm":"" landmark
        var aadhaarData = parseAadhaar(result.text);
        $log.info(aadhaarData);
        model.customer.aadhaarNo = aadhaarData.uid;
        model.customer.firstName = aadhaarData.name;
        model.customer.gender = aadhaarData.gender;
        model.customer.doorNo = aadhaarData.house;
        model.customer.street = aadhaarData.street;
        model.customer.locality = aadhaarData.loc;
        model.customer.villageName = aadhaarData.vtc;
        model.customer.district = aadhaarData.dist;
        model.customer.state = aadhaarData.state;
        model.customer.pincode = aadhaarData.pc;
        if (aadhaarData.dob) {
            $log.debug('aadhaarData dob: ' + aadhaarData.dob);
            if (!isNaN(aadhaarData.dob.substring(2, 3))) {
                model.customer.dateOfBirth = aadhaarData.dob;
            } else {
                model.customer.dateOfBirth = moment(aadhaarData.dob, 'DD/MM/YYYY').format(SessionStore.getSystemDateFormat());
            }
            $log.debug('customer dateOfBirth: ' + model.customer.dateOfBirth);
            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
        } else if (aadhaarData.yob) {
            $log.debug('aadhaarData yob: ' + aadhaarData.yob);
            model.customer.dateOfBirth = aadhaarData.yob + '-01-01';
            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
        }
        if (!model.customer.identityProof && !model.customer.identityProofNo
            && !model.customer.addressProof && !model.customer.addressProofNo) {
            model.customer.addressProofSameAsIdProof = true;
        }
        if (!model.customer.identityProof && !model.customer.identityProofNo) {
            model.customer.identityProof = 'Aadhar card';
            model.customer.identityProofNo = aadhaarData.uid;
        }
        if (!model.customer.addressProof && !model.customer.addressProofNo) {
            model.customer.addressProof = 'Aadhar card';
            model.customer.addressProofNo = aadhaarData.uid;
        }
    };

    return {
        fixData: fixData,
        saveData: saveData,
        proceedData: proceedData,
        validateData: validateData,
        parseAadhaar: parseAadhaar,
        customerAadhaarOnCapture: customerAadhaarOnCapture
    };
}]);

irf.pageCollection.factory("Pages__ProfileInformation",
["$log", "$q","Enrollment", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams",
function($log, $q, Enrollment, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams){

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
            if($stateParams.pageData)
            {
                model.customer.familyEnrollmentId=$stateParams.pageData.enrollmentId;
                model.customer.parentCustomerId=$stateParams.pageData.customerId;
            }
            model.branchId = SessionStore.getBranchId() + '';
            model.customer.kgfsBankName = SessionStore.getBankName();
            $log.info(model.customer.kgfsBankName);
            $log.info(formHelper.enum('bank'));
            $log.info("ProfileInformation page got initialized:"+model.branchId);
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
                    $stateParams.confirmExit = false;
                    $state.go("Page.Landing");
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
                    key:"customer.centreCode",
                    type:"select",
                    "enumCode": "centre",
                    "parentEnumCode": "branch",
                    "parentValueExpr": "model.branchId",
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
                            parentCode: 'model.branchId'
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
                            key:"customer.additionalKYCs[].kyc1ReverseImagePath",
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
                $log.info(JSON.stringify(sortFn(reqData)));
                EnrollmentHelper.saveData(reqData).then(function(res){
                    model.customer = _.clone(res.customer);
                    model = EnrollmentHelper.fixData(model);
                    /*reqData = _.cloneDeep(model);
                    EnrollmentHelper.proceedData(reqData).then(function(res){
                        $state.go("Page.Landing");
                    });*/
                    $stateParams.confirmExit = false;
                    $state.go("Page.Engine", {
                        pageName: 'ProfileInformation',
                        pageId: model.customer.id
                    });
                });
            },
            proceed: function(model, formCtrl, form, $event) {
                model.customer.customerType="Individual";
                var reqData = _.cloneDeep(model);
                if(reqData.customer.id && reqData.customer.currentStage === 'Stage01'){
                    $log.info("Customer id not null, skipping save");
                    EnrollmentHelper.proceedData(reqData).then(function (res) {
                        $stateParams.confirmExit = false;
                        $state.go("Page.Landing");
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
}]);
