

irf.pageCollection.factory(irf.page("customer360.CustomerProfile"),
["$log", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
"PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch",
function($log, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
    PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch){

    var branch = SessionStore.getBranch();

    var fixData = function(model) {
        $log.info("Before fixData");
        model.siteCode = SessionStore.getGlobalSetting('siteCode');
        Utils.removeNulls(model, true);
        if (_.has(model.customer, 'udf.userDefinedFieldValues')) {
            var fields = model.customer.udf.userDefinedFieldValues;
            fields['udf17'] = Number(fields['udf17']);
            fields['udf10'] = Number(fields['udf10']);
            fields['udf11'] = Number(fields['udf11']);
            fields['udf28'] = Number(fields['udf28']);
            fields['udf32'] = Number(fields['udf32']);
            fields['udf1'] = Boolean(fields['udf1']);
            fields['udf6'] = Boolean(fields['udf6']);
            fields['udf4'] = Number(fields['udf4']);
            for (var i = 1; i <= 40; i++) {
                if (!_.has(model.customer.udf.userDefinedFieldValues, 'udf' + i)) {
                    model.customer.udf.userDefinedFieldValues['udf' + i] = '';
                }
            }
        }
        $log.info("After fixData");
        $log.info(model);
        return model;
    };

    var initData = function(model) {
        model.customer.idAndBcCustId = model.customer.id + ' / ' + model.customer.bcCustId;
        model.customer.fullName = Utils.getFullName(model.customer.firstName, model.customer.middleName, model.customer.lastName);
        model.customer.fatherFullName = Utils.getFullName(model.customer.fatherFirstName, model.customer.fatherMiddleName, model.customer.fatherLastName);
        model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
    };

    return {
        "type": "schema-form",
        "title": "PROFILE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            var self = this;
            self.form = [];
            PagesDefinition.setReadOnlyByRole("Page/Engine/customer360.CustomerProfile", self.formSource).then(function(form){
                self.form = form;
            });
            initData(model);
            fixData(model);

        },
        modelPromise: function(pageId, _model) {
            if (!_model || !_model.customer || _model.customer.id != pageId) {
                $log.info("data not there, loading...");

                var deferred = $q.defer();
                PageHelper.showLoader();
                Enrollment.getCustomerById({id:pageId},function(resp,header){
                    var model = {$$OFFLINE_FILES$$:_model.$$OFFLINE_FILES$$};
                    model.customer = resp;
                    model = fixData(model);
                    if (model.customer.currentStage==='BasicEnrollment') {
                        irfProgressMessage.pop("enrollment-save","Customer "+model.customer.id+" not enrolled yet", 5000);
                        $state.go("Page.Engine", {pageName:'ProfileInformation', pageId:pageId});
                    } else {
                        irfProgressMessage.pop("enrollment-save","Load Complete", 2000);
                        initData(model);
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
        form: [],
        formSource: [
            {
                            "type":"box",
                            "title":"KYC",
                            "items":[
                                {
                                    type:"fieldset",
                                    title:"IDENTITY_PROOF",
                                    items:[
                                        {
                                            key:"customer.identityProof",
                                            type: "select"
                                        },
                                        {
                                            key:"customer.identityProofImageId",
                                            type:"file",
                                            required: true,
                                            fileType:"application/pdf",
                                            using: "scanner"
                                        },
                                        {
                                            key:"customer.identityProofNo",
                                            type:"barcode",
                                            onCapture: function(result, model, form) {
                                                $log.info(result);
                                                model.customer.identityProofNo = result.text;
                                            }
                                        },
                                    ]
                                },

                                {
                                    type:"fieldset",
                                    title:"ADDRESS_PROOF",
                                    items:[
                                        {
                                            key:"customer.addressProof",
                                            readonly:true,
                                            //type:"select"
                                        },
                                        {
                                            key:"customer.addressProofImageId",
                                            type:"file",
                                            required: true,
                                            fileType:"application/pdf",
                                            using: "scanner"
                                        },
                                        {
                                            key:"customer.addressProofNo",
                                            onCapture: function(result, model, form) {
                                                var aadhaarData = EnrollmentHelper.customerAadhaarOnCapture(result, model, form);
                                                model.customer.addressProofNo = aadhaarData.uid;
                                            },
                                            type:"qrcode"

                                        },
                                    ]
                                },

                                 {
                                    "key": "customer.additionalKYCs",
                                    "type": "array",
                                    "title": "ADDITIONAL_KYC",
                                    startEmpty: true,
                                    "items": [
                                        {

                                            key:"customer.additionalKYCs[].kyc1ProofType",
                                            type:"select",
                                            "enumCode": "identity_proof"
                                        },
                                        {
                                            key:"customer.additionalKYCs[].kyc1ImagePath",
                                            type:"file",
                                            required: true,
                                            fileType:"application/pdf",
                                            using: "scanner"
                                        },
                                        {
                                            key:"customer.additionalKYCs[].kyc1ProofNumber",
                                            type:"barcode",
                                            onCapture: function(result, model, form) {
                                                $log.info(result);
                                                model.customer.identityProofNo = result.text;
                                            }
                                        },
                                        {
                                            key:"customer.additionalKYCs[].kyc1IssueDate",
                                            type:"date"
                                        },
                                        {
                                            key:"customer.additionalKYCs[].kyc1ValidUptoDate",
                                            type:"date"
                                        }
                                    ]
                                },

                            ]
            },
            {
                            "type": "box",
                            "title": "PERSONAL_INFORMATION",
                            "items": [
                                {
                                    key: "customer.customerBranchId",
                                    title:"BRANCH_NAME",
                                    readonly:true,
                                    type: "select"
                                },
                                {
                                    key:"customer.centreId",
                                    type:"select",
                                    readonly: true,
                                    title:"CENTRE_NAME",
                                    filter: {
                                     "parentCode": "branch_id"
                                     },
                                    parentEnumCode:"branch_id",
                                    parentValueExpr:"model.customer.customerBranchId",
                                },
                                {
                                    key: "customer.centreId",
                                    type: "lov",
                                    autolov: true,
                                    lovonly: true,
                                    bindMap: {},
                                    searchHelper: formHelper,
                                    search: function(inputModel, form, model, context) {
                                        var centres = SessionStore.getCentres();
                                        // $log.info("hi");
                                        // $log.info(centres);

                                        var centreCode = formHelper.enum('centre').data;
                                        var out = [];
                                        if (centres && centres.length) {
                                            for (var i = 0; i < centreCode.length; i++) {
                                                for (var j = 0; j < centres.length; j++) {
                                                    if (centreCode[i].value == centres[j].id) {
                                                        out.push({
                                                            name: centreCode[i].name,
                                                            id:centreCode[i].value
                                                        })
                                                    }
                                                }
                                            }
                                        }
                                        return $q.resolve({
                                            headers: {
                                                "x-total-count": out.length
                                            },
                                            body: out
                                        });
                                    },
                                    onSelect: function(valueObj, model, context) {
                                        model.customer.centreId = valueObj.id;
                                    },
                                    getListDisplayItem: function(item, index) {
                                        return [
                                            item.name
                                        ];
                                    }
                                },
                                {
                                    key: "customer.oldCustomerId",
                                    title:"CUSTOMER_ID",
                                    titleExpr:"('CUSTOMER_ID'|translate)+' (Artoo)'",
                                    condition: "model.customer.oldCustomerId",
                                    readonly: true
                                },
                                {
                                    key: "customer.id",
                                    condition: "model.customer.id",
                                    title:"CUSTOMER_ID",
                                    readonly: true
                                },
                                {
                                    key: "customer.urnNo",
                                    condition: "model.customer.urnNo",
                                    title:"URN_NO",
                                    readonly: true
                                },
                                {
                                    key:"customer.photoImageId",
                                    type:"file",
                                    fileType:"image/*"
                                },
                                {
                                    "key": "customer.existingLoan",
                                    "title": "EXISTING_LOAN",
                                    "type": "radios",
                                    required:true,
                                    enumCode:"decisionmaker",
                                    condition:"model._bundlePageObj.pageClass=='applicant'"
                                },
                                {
                                    "key": "customer.title",
                                    "title": "TITLE",
                                    "type": "select",
                                    "enumCode": "title"
                                },
                                {
                                    key: "customer.firstName",
                                    title:"FULL_NAME",
                                    type:"string"
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
                                    key:"customer.dateOfBirth",
                                    required:true,
                                    type:"date",
                                    "onChange": function(modelValue, form, model) {
                                        if (model.customer.dateOfBirth) {
                                            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                        }
                                    }
                                },
                                {
                                    key:"customer.religion",
                                    type:"select"
                                },
                                {
                                    key: "customer.language",
                                    title: "PREFERRED_LANGUAGE",
                                    type: "select",
                                    enumCode: "language"
                                },
                                {
                                    key: "customer.fatherFirstName",
                                    title: "FATHER_FULL_NAME"
                                },
                                {
                                    key: "customer.motherName",
                                    title: "MOTHER_NAME"
                                },
                                {
                                    key:"customer.maritalStatus",
                                    required:true,
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
                                    key:"customer.spouseDateOfBirth",
                                    type:"date",
                                    condition:"model.customer.maritalStatus==='MARRIED'",
                                    "onChange": function(modelValue, form, model) {
                                        if (model.customer.spouseDateOfBirth) {
                                            model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                        }
                                    }
                                },
                            ]
            },
            {
                            "type": "box",
                            "title": "CONTACT_INFORMATION",
                            "items": [
                                {
                                    "key": "customer.mobilePhone",
                                    "inputmode": "number",
                                    "numberType": "tel"
                                },
                                {
                                    "key": "customer.landLineNo",
                                    "inputmode": "number",
                                    "numberType": "tel"
                                },
                                {
                                    "type": "string",
                                    "key": "customer.whatsAppMobileNoOption",
                                    "title": "CHOOSE_WHATSAPP_NO",
                                     "type":"radios",
                                     "titleMap": {
                                         1: "Mobile Phone",
                                         2: "Phone 2",
                                         3: "Other"
                                     },
                                     onChange: function(modelValue, form, model, formCtrl, event) {
                                        switch (modelValue){
                                            case "1":
                                                model.customer.whatsAppMobileNo = model.customer.mobilePhone;
                                                break;
                                            case "2":
                                                model.customer.whatsAppMobileNo = model.customer.landLineNo;
                                                break;
                                            case "3":
                                                model.customer.whatsAppMobileNo = "";
                                                break;
                                        }
                                     },
                                },
                                {
                                    "type": "string",
                                    "key": "customer.whatsAppMobileNo",
                                    "inputmode": "number",
                                    "numberType": "tel",
                                    "title": "WHATSAPP_MOBILE_NO",
                                },
                                {
                                    "type": "string",
                                    "key": "customer.email",
                                },
                                {
                                    type: "fieldset",
                                    title: "CUSTOMER_RESIDENTIAL_ADDRESS",
                                    items: [
                                    {
                                      key:"customer.careOf",
                                      //required:true,
                                      title:"C/O",
                                    },
                                        "customer.doorNo",
                                        "customer.street",
                                        "customer.postOffice",
                                        "customer.landmark",
                                        {
                                            key: "customer.pincode",
                                            type: "lov",
                                            fieldType: "number",
                                            autolov: true,
                                            inputMap: {
                                                "pincode": "customer.pincode",
                                                "district": {
                                                    key: "customer.district"
                                                },
                                                "state": {
                                                    key: "customer.state"
                                                }
                                            },
                                            outputMap: {
                                                "division": "customer.locality",
                                                "region": "customer.villageName",
                                                "pincode": "customer.pincode",
                                                "district": "customer.district",
                                                "state": "customer.state",
                                            },
                                            searchHelper: formHelper,
                                            initialize: function(inputModel) {
                                                $log.warn('in pincode initialize');
                                                $log.info(inputModel);
                                            },
                                            search: function(inputModel, form, model) {
                                                if (!inputModel.pincode) {
                                                    return $q.reject();
                                                }
                                                return Queries.searchPincodes(
                                                        inputModel.pincode,
                                                        inputModel.district,
                                                        inputModel.state
                                                );
                                            },
                                            getListDisplayItem: function(item, index) {
                                                return [
                                                    item.division + ', ' + item.region,
                                                    item.pincode,
                                                    item.district + ', ' + item.state,
                                                ];
                                            },
                                            onSelect: function(result, model, context) {
                                                $log.info(result);
                                            }
                                        },
                                        {
                                            key: "customer.locality",
                                            readonly: true
                                        },
                                        {
                                            key: "customer.villageName",
                                            readonly: true
                                        },
                                        {
                                            key: "customer.district",
                                            readonly: true
                                        },
                                        {
                                            key: "customer.state",
                                            readonly: true,
                                        },
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
                                        "customer.mailingPostoffice",
                                        {
                                            key: "customer.mailingPincode",
                                            type: "lov",
                                            fieldType: "string",
                                            autolov: true,
                                            inputMap: {
                                                "mailingPincode": "customer.mailingPincode",
                                                "mailingDistrict": {
                                                    key: "customer.mailingDistrict"
                                                },
                                                "mailingState": {
                                                    key: "customer.mailingState"
                                                }
                                            },
                                            outputMap: {
                                                "mailingDivision": "customer.mailingLocality",
                                                "mailingPincode": "customer.mailingPincode",
                                                "mailingDistrict": "customer.mailingDistrict",
                                                "mailingState": "customer.mailingState"
                                            },
                                            searchHelper: formHelper,
                                            initialize: function(inputModel) {
                                                $log.warn('in pincode initialize');
                                                $log.info(inputModel);
                                            },
                                            search: function(inputModel, form, model) {
                                                if (!inputModel.mailingPincode) {
                                                    return $q.reject();
                                                }
                                                return Queries.searchPincodes(
                                                        inputModel.mailingPincode,
                                                        inputModel.mailingDistrict,
                                                        inputModel.mailingState
                                                );
                                            },
                                            getListDisplayItem: function(item, index) {
                                                return [
                                                    item.division + ', ' + item.region,
                                                    item.pincode,
                                                    item.district + ', ' + item.state
                                                ];
                                            },
                                            onSelect: function(result, model, context) {
                                                model.customer.mailingPincode = (new Number(result.pincode)).toString();
                                                model.customer.mailingLocality = result.division;
                                                model.customer.mailingState = result.state;
                                                model.customer.mailingDistrict = result.district;
                                            }
                                        },
                                        {
                                            key: "customer.mailingLocality",
                                            readonly: true
                                        },
                                        {
                                            key: "customer.mailingDistrict",
                                            readonly: true
                                        },
                                        {
                                            key: "customer.mailingState",
                                            readonly: true
                                        }
                                    ]
                                }
                            ]
            },
            {
                            "type": "box",
                            "title": "HOUSEHOLD_FINANCIALS",
                            "items": [
                                {
                                    "key": "customer.expenditures",
                                    "type": "array",
                                    "title": "EXPENDITURES",
                                    "view": "fixed",
                                     "add": null,
                                     "remove": null,
                                    "items": [

                                        {
                                            "key": "customer.expenditures[].expenditureSource",
                                            "type": "select",
                                            required: true,
                                            "title": "EXPENSE_TYPE"
                                        },
                                        {
                                            "key": "customer.expenditures[].annualExpenses",
                                            "type": "amount",
                                            "title": "AMOUNT"
                                        },
                                        {
                                            "key": "customer.expenditures[].frequency",
                                            "type": "select",
                                            "condition": "model.siteCode == 'kinara'",
                                            readonly: true,
                                            "title": "FREQUENCY"
                                        },
                                        {
                                            "key": "customer.expenditures[].frequency",
                                            "type": "select",
                                            "condition": "model.siteCode != 'kinara'",
                                            "title": "FREQUENCY"
                                        }
                                     ]
                                }

                            ]
            },
            {
                            "type": "box",
                            "title": "FAMILY_DETAILS",
                            "items": [
                                {
                                    "key": "customer.familyMembers",
                                    "type": "array",
                                    "add": null,
                                    "remove": null,
                                    "startEmpty": true,
                                    "view":"fixed",
                                    "items": [
                                        {
                                            "key": "customer.familyMembers[].relationShip",
                                            "type": "select",
                                            "readonly": true
                                        },
                                        {
                                            "key": "customer.familyMembers[].educationStatus",
                                            "title": "EDUCATION_LEVEL",
                                            "type": "select"
                                        }
                                    ]
                                }
                            ]
            },
            {
                            "type": "box",
                            "title": "FAMILY_SELF_DETAILS",
                            "items": [
                            {
                                key:"customer.familyMembers",
                                type:"array",
                                startEmpty: true,
                                items: [
                                    {
                                        key:"customer.familyMembers[].relationShip",
                                        readonly:true,
                                        condition:"(model.customer.familyMembers[arrayIndex].relationShip).toUpperCase() =='SELF'",
                                        type:"select",
                                        onChange: function(modelValue, form, model, formCtrl, event) {
                                            if (modelValue && modelValue.toLowerCase() === 'self') {
                                                if (model.customer.id)
                                                    model.customer.familyMembers[form.arrayIndex].customerId = model.customer.id;
                                                if (model.customer.firstName)
                                                    model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.firstName;
                                                if (model.customer.gender)
                                                    model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender;
                                                model.customer.familyMembers[form.arrayIndex].age = model.customer.age;
                                                if (model.customer.dateOfBirth)
                                                    model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.dateOfBirth;
                                                if (model.customer.maritalStatus)
                                                    model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                                                if (model.customer.mobilePhone)
                                                    model.customer.familyMembers[form.arrayIndex].mobilePhone = model.customer.mobilePhone;
                                            } else if (modelValue && modelValue.toLowerCase() === 'spouse') {
                                                if (model.customer.spouseFirstName)
                                                    model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.spouseFirstName;
                                                if (model.customer.gender)
                                                    model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender == 'MALE' ? 'MALE' :
                                                            (model.customer.gender == 'FEMALE' ? 'FEMALE': model.customer.gender);
                                                model.customer.familyMembers[form.arrayIndex].age = model.customer.spouseAge;
                                                if (model.customer.spouseDateOfBirth)
                                                    model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.spouseDateOfBirth;
                                                if (model.customer.maritalStatus)
                                                    model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                                            }
                                        },
                                        title: "T_RELATIONSHIP"
                                    },
                                    {
                                        key:"customer.familyMembers[].relationShip",
                                        type:"select",
                                        condition:"(model.customer.familyMembers[arrayIndex].relationShip).toUpperCase() !=='SELF'",
                                        onChange: function(modelValue, form, model, formCtrl, event) {
                                            if (modelValue && modelValue.toLowerCase() === 'self') {
                                                if (model.customer.id)
                                                    model.customer.familyMembers[form.arrayIndex].customerId = model.customer.id;
                                                if (model.customer.firstName)
                                                    model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.firstName;
                                                if (model.customer.gender)
                                                    model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender;
                                                model.customer.familyMembers[form.arrayIndex].age = model.customer.age;
                                                if (model.customer.dateOfBirth)
                                                    model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.dateOfBirth;
                                                if (model.customer.maritalStatus)
                                                    model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                                                if (model.customer.mobilePhone)
                                                    model.customer.familyMembers[form.arrayIndex].mobilePhone = model.customer.mobilePhone;
                                            } else if (modelValue && modelValue.toLowerCase() === 'spouse') {
                                                if (model.customer.spouseFirstName)
                                                    model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.spouseFirstName;
                                                if (model.customer.gender)
                                                    model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender == 'MALE' ? 'MALE' :
                                                            (model.customer.gender == 'FEMALE' ? 'FEMALE': model.customer.gender);
                                                model.customer.familyMembers[form.arrayIndex].age = model.customer.spouseAge;
                                                if (model.customer.spouseDateOfBirth)
                                                    model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.spouseDateOfBirth;
                                                if (model.customer.maritalStatus)
                                                    model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                                            }
                                        },
                                        title: "T_RELATIONSHIP"
                                    },
                                    {
                                        key:"customer.familyMembers[].familyMemberFirstName",
                                        condition: "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                                        title:"FAMILY_MEMBER_FULL_NAME"
                                    },
                                    {
                                        key:"customer.familyMembers[].educationStatus",
                                        type:"select",
                                        required:true,
                                        title: "T_EDUCATION_STATUS"
                                    },
                                    {
                                        key: "customer.familyMembers[].anualEducationFee",
                                        type: "amount",
                                        title: "ANNUAL_EDUCATION_FEE"
                                    },
                                    {
                                        key: "customer.familyMembers[].salary",
                                        type: "amount",
                                        title: "SALARY"
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
                            type:"box",
                            title:"HOUSEHOLD_LIABILITIES",
                            items:[
                                {
                                    key:"customer.liabilities",
                                    type:"array",
                                    startEmpty: true,
                                    title:"HOUSEHOLD_LIABILITIES",
                                    items:[
                                        {
                                            key:"customer.liabilities[].loanSource",
                                            type:"select",
                                            enumCode:"loan_source"
                                        },
                                        // "customer.liabilities[].instituteName",
                                        {
                                            key: "customer.liabilities[].loanAmountInPaisa",
                                            type: "amount"
                                        },
                                        {
                                            key: "customer.liabilities[].installmentAmountInPaisa",
                                            type: "amount",
                                            title:"AVG_INSTALLEMENT_AMOUNT"
                                        },
                                        {
                                            key: "customer.liabilities[].outstandingAmountInPaisa",
                                            type: "amount",
                                            title: "OUTSTANDING_AMOUNT"
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
                                            key: "customer.liabilities[].noOfInstalmentPaid",
                                            type: "number",
                                            title: "NO_OF_INSTALLMENT_PAID"
                                        },
                                        {
                                            key:"customer.liabilities[].frequencyOfInstallment",
                                            type:"select"
                                        },
                                        {
                                            key:"customer.liabilities[].liabilityLoanPurpose",
                                            /*type:"select",
                                            enumCode: "loan_purpose_1"*/
                                        },
                                        {
                                           key:"customer.liabilities[].interestOnly",
                                           type:"radios",
                                           title:"INTEREST_ONLY",
                                           enumCode:"decisionmaker"
                                        },
                                        {
                                            key: "customer.liabilities[].interestRate",
                                            type: "number",
                                            title: "RATE_OF_INTEREST"
                                        },
                                        /*{
                                           key:"customer.liabilities[].interestExpense",
                                           title:"INTEREST_EXPENSE"
                                        },
                                        {
                                           key:"customer.liabilities[].principalExpense",
                                           title:"PRINCIPAL_EXPENSE"
                                        }
*/
                                    ]
                                }
                            ]
            },
            {
                            "type": "box",
                            "title": "T_HOUSE_VERIFICATION",
                            "items": [
                                {
                                    type:"fieldset",
                                    title:"HOUSE_DETAILS",
                                    items:[
                                        {
                                            key:"customer.ownership",
                                            required:true,
                                            type:"select"
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf29", // customer.inCurrentAddressSince
                                            type: "select",
                                            title: "IN_CURRENT_ADDRESS_SINCE"
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf30", // customer.inCurrentAreaSince
                                            type:"select",
                                            required:true,
                                            title: "IN_CURRENT_AREA_SINCE"
                                        }
                                    ]
                                },
                                {
                                    "key": "customer.latitude",
                                    "title": "HOUSE_LOCATION",
                                    "type": "geotag",
                                    "latitude": "customer.latitude",
                                    "longitude": "customer.longitude"
                                }
                            ]
            },
            {
                            "type": "box",
                            "title": "T_HOUSE_VERIFICATION",
                            "items": [
                                {
                                    type:"fieldset",
                                    title:"HOUSE_DETAILS",
                                    items:[
                                        {
                                            key:"customer.ownership",
                                            required:true,
                                            type:"select"
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf29", // customer.inCurrentAddressSince
                                            type: "select",
                                            title: "IN_CURRENT_ADDRESS_SINCE"
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf30", // customer.inCurrentAreaSince
                                            type:"select",
                                            required:true,
                                            title: "IN_CURRENT_AREA_SINCE"
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
                                //{
                                //   key: "customer.nameOfRo",
                                //   readonly: true
                                //},
                                {
                                    key:"customer.houseVerificationPhoto",
                                    type:"file",
                                    fileType:"image/*"
                                },
                                {
                                    key: "customer.date",
                                    type:"date"
                                },
                                "customer.place"
                            ]
            },
            {
                            type: "box",
                            title: "BANK_ACCOUNTS",
                            items: [
                                {
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
                                    items: [
                                        {
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
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].customerBankName",
                                            readonly: true,
                                            required: true
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].customerBankBranchName",
                                            readonly: true,
                                            required: true
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].customerNameAsInBank"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].accountNumber"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].accountType",
                                            type: "select"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].bankingSince",
                                            type: "date",
                                            title: "BANKING_SINCE"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].netBankingAvailable",
                                            type: "select",
                                            title: "NET_BANKING_AVAILABLE",
                                            enumCode: "decisionmaker"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].sanctionedAmount",
                                            type: "amount",
                                            title: "OUTSTANDING_BALANCE",
                                            condition:"model.customer.customerBankAccounts[arrayIndex].accountType=='OD' || model.customer.customerBankAccounts[arrayIndex].accountType=='CC'"
                                        },
                                        {
                                            key:"customer.customerBankAccounts[].bankStatementDocId",
                                            type:"file",
                                            // required: false,
                                            title:"BANK_STATEMENT_UPLOAD",
                                            fileType:"application/pdf",
                                            "category": "CustomerEnrollment",
                                            "subCategory": "IDENTITYPROOF",
                                            using: "scanner"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].bankStatements",
                                            type: "array",
                                            title: "STATEMENT_DETAILS",
                                            items: [
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].startMonth",
                                                    type: "date",
                                                    title: "START_MONTH"
                                                },
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].totalDeposits",
                                                    type: "amount",
                                                    calculator: true,
                                                    creditDebitBook: true,
                                                    onDone: function(result, model, context){
                                                            model.customer.customerBankAccounts[context.arrayIndexes[0]].bankStatements[context.arrayIndexes[1]].totalDeposits = result.totalCredit;
                                                            model.customer.customerBankAccounts[context.arrayIndexes[0]].bankStatements[context.arrayIndexes[1]].totalWithdrawals = result.totalDebit;
                                                    },
                                                    required:true,
                                                    title: "TOTAL_DEPOSITS"
                                                },
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].totalWithdrawals",
                                                    type: "amount",
                                                    title: "TOTAL_WITHDRAWALS"
                                                },
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].balanceAsOn15th",
                                                    type: "amount",
                                                    title: "BALENCE_AS_ON_REQUESTED_EMI_DATE"
                                                },
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].noOfChequeBounced",
                                                    type: "amount",
                                                    required:true,
                                                    title: "NO_OF_CHEQUE_BOUNCED"
                                                },
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].noOfEmiChequeBounced",
                                                    type: "amount",
                                                    required:true,
                                                    title: "NO_OF_EMI_CHEQUE_BOUNCED"
                                                },
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].bankStatementPhoto",
                                                    type: "file",
                                                    required: true,
                                                    title: "BANK_STATEMENT_UPLOAD",
                                                    fileType: "application/pdf",
                                                    "category": "CustomerEnrollment",
                                                    "subCategory": "IDENTITYPROOF",
                                                    using: "scanner"
                                                }

                                            ]
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].isDisbersementAccount",
                                            type: "radios",
                                            titleMap: [{
                                                value: true,
                                                name: "Yes"
                                            },{
                                                value: false,
                                                name: "No"
                                            }]
                                        }
                                    ]
                                }
                            ]
            },
            {
                "type": "box",
                "title": "REFERENCES",
                "items": [
                    {
                        key:"customer.verifications",
                        title:"REFERENCES",
                        type: "array",
                        items:[
                            {
                                key:"customer.verifications[].referenceFirstName",
                                title:"CONTACT_PERSON_NAME",
                                type:"string",
                                required:true
                            },
                            {
                                key:"customer.verifications[].mobileNo",
                                title:"CONTACT_NUMBER",
                                type:"string",
                                required:true
                            },
                            {
                                key:"customer.verifications[].occupation",
                                title:"OCCUPATION",
                                type:"select",
                                "enumCode": "occupation",
                            },
                            {
                                key:"customer.verifications[].address",
                                type:"textarea"
                            },
                            {
                            type: "fieldset",
                            title: "REFERENCE_CHECK",
                            items: [
                                {
                                    key:"customer.verifications[].knownSince",
                                    required:true
                                },
                                {
                                    key:"customer.verifications[].relationship",
                                    title:"REFERENCE_TYPE1",
                                    type:"select",
                                    required:true,
                                   titleMap: {
                                            "Neighbour": "Neighbour",
                                            "Relative/friend": "Relative/friend"
                                        }
                                },
                                {
                                    key:"customer.verifications[].opinion"
                                },
                                {
                                    key:"customer.verifications[].financialStatus"
                                },
                                {
                                    key:"customer.verifications[].customerResponse",
                                    title:"CUSTOMER_RESPONSE",
                                    required:true,
                                    type:"select",
                                    titleMap: [{
                                                    value: "positive",
                                                    name: "positive"
                                                },{
                                                    value: "Negative",
                                                    name: "Negative"
                                                }]

                                }
                            ]
                            }
                         ]
                    },
                ]
            },
            {
                            type:"box",
                            title:"PHYSICAL_ASSETS",
                            items:[
                                {
                                    key:"customer.physicalAssets",
                                    type:"array",
                                    startEmpty: true,
                                    title:"PHYSICAL_ASSETS",
                                    items:[
                                        {
                                            key: "customer.physicalAssets[].nameOfOwnedAsset",
                                            title: "ASSET_TYPE",
                                            type: "select",
                                            enumCode: "asset_type"
                                        },
                                        {
                                            key: "customer.physicalAssets[].vehicleModel",
                                            title: "VEHICLE_MAKE_MODEL",
                                            condition: "model.customer.physicalAssets[arrayIndex].assetType=='Two wheeler' || model.customer.physicalAssets[arrayIndex].assetType=='Four wheeler'",
                                            type: "string"
                                        },
                                        {
                                            key: "customer.physicalAssets[].registeredOwner",
                                            title: "REGISTERED_OWNER",
                                            type: "string"
                                        },
                                        {
                                            key: "customer.physicalAssets[].ownedAssetValue",
                                            title: "VALUE_OF_THE_ASSET",
                                            type: "amount"
                                        },
                                    ]
                                }
                            ]
            },
            {
                            type: "box",
                            title: "PROXY_INDICATORS",
                            condition: "model._bundlePageObj.pageClass=='applicant' && model.currentStage=='FieldAppraisal' && !model.proxyIndicatorsHasValue",
                            items: [
                                {
                                    key:"customer.properAndMatchingSignboard",
                                    title:"PROPER_MATCHING_SIGNBOARD",
                                    type:"select",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.bribeOffered",
                                    title:"BRIBE_OFFERED",
                                    type:"select",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.shopOrganized",
                                    title:"SHOP_SHED_ORGANIZED",
                                    type:"select",
                                    required:"true",
                                    enumCode: "status_scale_2"
                                },
                                {
                                    key:"customer.isIndustrialArea",
                                    title:"IN_INDUSTRIAL_AREA",
                                    type:"select",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.customerAttitudeToKinara",
                                    title:"CUSTOMER_ATTITUDE_TO_KINARA",
                                    type:"select",
                                    required:"true",
                                    enumCode: "status_scale_2"
                                },
                                {
                                    key:"customer.bookKeepingQuality",
                                    title:"BOOK_KEEPING_QUALITY",
                                    type:"select",
                                    required:"true",
                                    enumCode: "status_scale_2"
                                },
                                {
                                    key:"customer.challengingChequeBounce",
                                    title:"CHALLENGING_CHEQUE_BOUNCE/FESS_CHARGE/POLICIES",
                                    type:"select",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.allMachinesAreOperational",
                                    title:"ALL_MACHINES_OPERATIONAL?",
                                    type:"select",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.employeeSatisfaction",
                                    title:"EMPLOYEE_SATISFACTION",
                                    type:"select",
                                    required:"true",
                                    enumCode: "status_scale_2"
                                },
                                {
                                    key:"customer.politicalOrPoliceConnections",
                                    title:"POLITICAL_POLICE_CONNECTIONS",
                                    type:"select",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.multipleProducts",
                                    title:"MULTIPLE_PRODUCTS_MORE_THAN_3",
                                    type:"select",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.multipleBuyers",
                                    title:"MULTIPLE_BUYERS_MORE_THAN_3",
                                    condition: "model.customer.enterprise.businessType == 'Manufacturing'",
                                    type:"select",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.seasonalBusiness",
                                    title:"SEASONAL_BUSINESS",
                                    type:"select",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.incomeStability",
                                    title:"INCOME STABILITY",
                                    type:"select",
                                    required:"true",
                                    enumCode: "income_stability"
                                },
                                {
                                    key:"customer.utilisationOfBusinessPremises",
                                    title:"UTILIZATION_OF_BUSINESS_PREMISES ",
                                    type:"select",
                                    required:"true",
                                    enumCode: "utilisation_of_business"
                                },
                                {
                                    key:"customer.approachForTheBusinessPremises",
                                    title:"APPROACH_FOR_THE_BUSINESS_PREMISES",
                                    type:"select",
                                    required:"true",
                                    enumCode:"status_scale_2"
                                    //enumCode:"connectivity_status "
                                },
                                {
                                    key:"customer.safetyMeasuresForEmployees",
                                    title:"SAFETY_MEASURES_FOR_EMPLOYEES",
                                    type:"select",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                    //enumCode: "status_scale"
                                },
                                {
                                    key:"customer.childLabours",
                                    title:"CHILD_LABOURERS",
                                    type:"select",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.isBusinessEffectingTheEnvironment",
                                    title:"IS_THE_BUSSINESS_IN_EFFECTING_ENVIRONMENT",
                                    type:"select",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.stockMaterialManagement",
                                    title:"STOCK_MATERIAL_MANAGEMENT",
                                    type:"select",
                                    required:"true",
                                    enumCode:"status_scale_2"
                                    //enumCode: "status_scale"
                                },
                                {
                                    key:"customer.customerWalkinToBusiness",
                                    condition: "model.customer.enterprise.businessType == 'Trading'",
                                    title:"CUSTOMER_WALK_IN_TO_THE_BUSINESS",
                                    type:"select",
                                    required:"true",
                                    enumCode:"status_scale"
                                    //enumCode: "status_scale"
                                },
                                {
                                    key: "customer.businessSignboardImage",
                                    title: "SIGN_BOARD",
                                    "category": "Loan",
                                    "subCategory": "DOC1",
                                    type: "file",
                                    fileType: "application/pdf",
                                    using: "scanner"
                                }

                            ]
                        },
            {
                "type": "actionbox",
                "readonly": true,
                "items": [{
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            }
        ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                Utils.confirm("Update - Are You Sure?", "Customer Profile").then(function() {
                    PageHelper.showLoader();
                    irfProgressMessage.pop('PROFILE', 'Working...');
                    model.enrollmentAction = "PROCEED";
                    $log.info(model);
                    var reqData = _.cloneDeep(model);
                    if (reqData.customer.addressProof == 'Aadhar Card' &&
                        !_.isNull(reqData.customer.addressProofNo)){
                        reqData.customer.aadhaarNo = reqData.customer.addressProofNo;
                    }
                     if (reqData.customer.identityProof == 'Pan Card' &&
                        !_.isNull(reqData.customer.identityProofNo)){
                        reqData.customer.panNo = reqData.customer.identityProofNo;
                    }
                    Enrollment.updateEnrollment(reqData, function (res, headers) {
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
