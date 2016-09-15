irf.pageCollection.factory(irf.page("customer360.CustomerProfile"),
["$log", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
"PageHelper", "Utils", "BiometricService", "PagesDefinition",
function($log, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
    PageHelper, Utils, BiometricService, PagesDefinition){

    var branch = SessionStore.getBranch();

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
        },
        modelPromise: function(pageId, _model) {
            if (!_model || !_model.customer || _model.customer.id != pageId) {
                $log.info("data not there, loading...");

                var deferred = $q.defer();
                PageHelper.showLoader();
                Enrollment.getCustomerById({id:pageId},function(resp,header){
                    var model = {$$OFFLINE_FILES$$:_model.$$OFFLINE_FILES$$};
                    model.customer = resp;
                    model = EnrollmentHelper.fixData(model);
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
        formSource: [{
            "type": "box",
            "title": "CUSTOMER_INFORMATION",
            "readonly": true,
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
                    readonly: true
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
                    key:"customer.centreCode",
                    type:"select",
                    filter: {
                        "parentCode as branch": "model.customer.kgfsName"
                    },
                    screenFilter: true
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
                    type:"date",
                    /*onChange: function(modelValue, form, model) {
                        if (model.customer.dateOfBirth) {
                            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                    },*/
                    readonly: true
                },
                {
                    key: "customer.fatherFullName",
                    title: "FATHER_FULL_NAME",
                    readonly: true
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
                },
                {
                    key:"customer.isBiometricValidated",
                    title: "Validate Fingerprint",
                    type:"validatebiometric",
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
            "readonly": true,
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
                            "readonly": true
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
            "readonly": true,
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
                            key:"customer.udf.userDefinedFieldValues.udf30",
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
                                    model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
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
                            key:"customer.udf.userDefinedFieldValues.udf29",
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
            "type": "box",
            "title": "T_FAMILY_DETAILS",
            "readonly": true,
            "items": [{
                key:"customer.familyMembers",
                type:"array",
                items: [
                    {
                        key:"customer.familyMembers[].customerId",
                        readonly: true,
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
                        title:"FAMILY_MEMBER_FULL_NAME",
                        readonly: true
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
                        readonly: true
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
                        },
                        readonly: true
                    },
                    {
                        key: "customer.familyMembers[].dateOfBirth",
                        type:"date",
                        title: "T_DATEOFBIRTH",
                        "onChange": function(modelValue, form, model, formCtrl, event) {
                            if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                            }
                        },
                        readonly: true
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
            },
            {
                "type": "fieldset",
                "title": "EXPENDITURES",
                "items": [{
                    key:"customer.expenditures",
                    type:"array",
                    remove: null,
                    view: "fixed",
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
            }]
        },
        {
            "type":"box",
            "title":"BUSINESS_OCCUPATION_DETAILS",
            "readonly": true,
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
            "readonly": true,
            "items": [{
                key: "customer.physicalAssets",
                type: "array",
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
            "readonly": true,
            items:[
                {
                    key:"customer.liabilities",
                    type:"array",
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
            "readonly": true,
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
            "readonly": true,
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
                    model.enrollmentAction = "PROCEED";
                    $log.info(model);
                    var reqData = _.cloneDeep(model);
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
