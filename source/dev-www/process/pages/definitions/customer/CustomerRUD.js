irf.pageCollection.factory("Pages__CustomerRUD",
    ["$log", "$q", "Enrollment","Queries", 'PageHelper', 'irfProgressMessage', '$stateParams', '$state',
        'formHelper', "BASE_URL", "$window", "SessionStore", "Utils", "EnrollmentHelper",
        function ($log, $q, Enrollment,Queries,PageHelper, irfProgressMessage, $stateParams, $state,
                  formHelper, BASE_URL, $window, SessionStore, Utils, EnrollmentHelper) {

            return {
                "id": "CustomerRUD",
                "type": "schema-form",
                "name": "CustomerRUD",
                "title": "Customer Details",
                "subTitle": "",
                "uri": "Profile/Edit Customer",
                initialize: function (model, form, formCtrl) {
                    var custId = $stateParams.pageId;
                    $log.info("Loading data for Cust ID " + custId);

                    if (custId == undefined || custId == null) {
                        $state.go('Page.Engine', {
                            pageName: "CustomerSearch",
                            pageId: null
                        });
                    }
                    model._screenMode = 'VIEW';
                    model.branch = SessionStore.getCurrentBranch().branchId;
                    PageHelper.showLoader();
                    irfProgressMessage.pop("cust-load", "Loading Customer Data...");
                    Enrollment.EnrollmentById({id: custId}, function (resp, header) {
                        PageHelper.hideLoader();
                        model.customer = _.cloneDeep(resp);
                        model.customer.addressProofSameAsIdProof = (model.customer.title=="true")?true:false;
                        //model = fixData(model);
                        model = EnrollmentHelper.fixData(model);
                        $window.scrollTo(0, 0);
                        irfProgressMessage.pop("cust-load", "Load Complete", 2000);
                    }, function (resp) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("cust-load", "An Error Occurred. Failed to fetch Data", 5000);
                        $state.go("Page.Engine", {
                            pageName: "CustomerSearch",
                            pageId: null
                        });
                    });

                },
                form: [
                    {
                        "type": "box",
                        "title": "CUSTOMER_INFORMATION",
                        "items": [
                            {
                                "key": "customer.aadhaarNo",
                                "type": "aadhar",
                                "outputMap": {
                                    "uid": "customer.aadhaarNo",
                                    "name": "customer.firstName",
                                    "gender": "customer.gender",
                                    "dob": "customer.dateOfBirth",
                                    "yob": "customer.yearOfBirth",
                                    "co": "",
                                    "house": "customer.doorNo",
                                    "street": "customer.street",
                                    "lm": "",
                                    "loc": "customer.locality",
                                    "vtc": "customer.villageName",
                                    "dist": "customer.district",
                                    "state": "customer.state",
                                    "pc": "customer.pincode"
                                },
                                onChange: "actions.setProofs(model)"
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
                                //"offline": true
                            },
                            {
                                key: "customer.centreId",
                                type: "select",
                                "enumCode": "centre",
                                "parentEnumCode": "branch_id",
                                "parentValueExpr": "model.customer.customerBranchId",
                            },
                            {
                                key: "customer.enrolledAs",
                                type: "radios"
                            },
                            {
                                key: "customer.fullName",
                                "readonly":true,
                                title: "FULL_NAME"
                            },
                            {
                                key: "customer.gender",
                                type: "radios"
                            },
                            {
                                key: "customer.age",
                                "readonly":true,
                                title: "AGE",
                                type: "number",
                                "onChange": function(modelValue, form, model) {
                                    if (model.customer.age > 0) {
                                        if (model.customer.dateOfBirth) {
                                            model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-') + moment(model.customer.dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                        } else {
                                            model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-MM-DD');
                                        }
                                    }
                                }
                            }, {
                                key: "customer.dateOfBirth",
                                "readonly":true,
                                type: "date",
                                "onChange": function(modelValue, form, model) {
                                    if (model.customer.dateOfBirth) {
                                        model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                    }
                                }
                            },
                            {
                                key: "customer.fatherFullName",
                                "readonly":true,
                                title: "FATHER_FULL_NAME"
                            },
                            {
                                key: "customer.maritalStatus",
                                type: "select"
                            },
                            {
                                key: "customer.spouseFirstName",
                                title: "Spouse First name",
                                condition: "model.customer.maritalStatus==='MARRIED'",
                                type: "qrcode",
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
                                key: "customer.spouseFullName",
                                "readonly":true,
                                title: "Spouse Full Name",
                            }, 
                            {
                                key: "customer.spouseDateOfBirth",
                                type: "date",
                                condition: "model.customer.maritalStatus==='MARRIED'",
                                "onChange": function(modelValue, form, model) {
                                    if (model.customer.spouseDateOfBirth) {}
                                }
                            }, {
                                key: "customer.udf.userDefinedFieldValues.udf1",
                                condition: "model.customer.maritalStatus==='MARRIED'",
                                title: "SPOUSE_LOAN_CONSENT",
                                type:"checkbox",
                                "schema":{
                                    "default":false
                                }

                            }

                        ]
                    }, {
                        "type": "box",
                        "title": "CONTACT_INFORMATION",
                        "items": [{
                            type: "fieldset",
                            title: "CUSTOMER_RESIDENTIAL_ADDRESS",
                            items: [

                                "customer.doorNo",
                                "customer.street",
                                "customer.locality",
                                {
                                    key: "customer.villageName",
                                    type: "select",
                                    filter: {
                                        'parentCode as branch': 'model.customer.kgfsName'
                                    }
                                },
                                "customer.postOffice",
                                {
                                    key: "customer.district",
                                    type: "select"
                                },
                                "customer.pincode",
                                {
                                    key: "customer.state",
                                    type: "select"
                                },
                                "customer.stdCode",
                                "customer.landLineNo",
                                {
                                    key:"customer.mobilePhone",
                                    "readonly":true
                                },
                                //"customer.mobilePhone",
                                "customer.mailSameAsResidence"
                            ]
                        }, {
                            type: "fieldset",
                            title: "CUSTOMER_PERMANENT_ADDRESS",
                            condition: "!model.customer.mailSameAsResidence",
                            items: [
                                "customer.mailingDoorNo",
                                "customer.mailingStreet",
                                "customer.mailingLocality",
                                "customer.mailingPostoffice",
                                {
                                    key: "customer.mailingDistrict",
                                    type: "select"
                                },
                                "customer.mailingPincode",
                                {
                                    key: "customer.mailingState",
                                    type: "select"
                                }
                            ]
                        }
                        ]
                    }, 
                    {
                        type: "box",
                        title: "KYC",
                        items: [{
                                "key": "customer.aadhaarNo",
                                type: "qrcode",
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
                                //onCapture: EnrollmentHelper.customerAadhaarOnCapture
                            }, {
                                type: "fieldset",
                                title: "IDENTITY_PROOF",
                                items: [{
                                    key: "customer.identityProof",
                                    type: "select"
                                }, {
                                    key: "customer.identityProofImageId",
                                    type: "file",
                                    fileType: "image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                }, {
                                    key: "customer.identityProofReverseImageId",
                                    type: "file",
                                    fileType: "image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                }, {
                                    key: "customer.identityProofNo",
                                    type: "barcode",
                                    onCapture: function(result, model, form) {
                                        $log.info(result);
                                        model.customer.identityProofNo = result.text;
                                    }
                                }, {
                                    key: "customer.idProofIssueDate",
                                    type: "date"
                                }, {
                                    key: "customer.idProofValidUptoDate",
                                    type: "date"
                                }, {
                                    key: "customer.addressProofSameAsIdProof"
                                }]
                            }, {
                                type: "fieldset",
                                title: "SPOUSE_IDENTITY_PROOF",
                                condition: "model.customer.maritalStatus==='MARRIED'",
                                items: [{
                                    key: "customer.udf.userDefinedFieldValues.udf33",
                                    type: "select",
                                    onChange: function(modelValue) {
                                        $log.info(modelValue);
                                    }
                                }, {
                                    key: "customer.udf.userDefinedFieldValues.udf34",
                                    type: "file",
                                    fileType: "image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                }, {
                                    key: "customer.udf.userDefinedFieldValues.udf35",
                                    type: "file",
                                    fileType: "image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                }, {
                                    key: "customer.udf.userDefinedFieldValues.udf36",
                                    condition: "model.customer.udf.userDefinedFieldValues.udf33 !== 'Aadhar card'",
                                    type: "barcode",
                                    onCapture: function(result, model, form) {
                                        $log.info(result); // spouse id proof
                                        model.customer.udf.userDefinedFieldValues.udf36 = result.text;
                                    }
                                }, {
                                    key: "customer.udf.userDefinedFieldValues.udf36",
                                    condition: "model.customer.udf.userDefinedFieldValues.udf33 === 'Aadhar card'",
                                    type: "qrcode",
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
                                }]
                            }, {
                                type: "fieldset",
                                title: "ADDRESS_PROOF",
                                condition: "!model.customer.addressProofSameAsIdProof",
                                items: [{
                                    key: "customer.addressProof",
                                    type: "select"
                                }, {
                                    key: "customer.addressProofImageId",
                                    type: "file",
                                    fileType: "image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                }, {
                                    key: "customer.addressProofReverseImageId",
                                    type: "file",
                                    fileType: "image/*",
                                    "viewParams": function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
                                    //"offline": true
                                }, {
                                    key: "customer.addressProofNo",
                                    type: "barcode",
                                    onCapture: function(result, model, form) {
                                        $log.info(result);
                                        model.customer.addressProofNo = result.text;
                                    },
                                    "schema":{
                                        "pattern":"^[a-zA-Z0-9]*$"
                                    }
                                }, {
                                    key: "customer.addressProofIssueDate",
                                    type: "date"
                                }, {
                                    key: "customer.addressProofValidUptoDate",
                                    type: "date"
                                }, ]
                            }

                        ]
                    },
                    {
                        "type": "box",
                        "title": "ADDITIONAL_KYC",
                        "items": [{
                            "key": "customer.additionalKYCs",
                            "type": "array",
                            "startEmpty": true,
                            "schema": {
                                "maxItems": 1
                            },
                            "title": "ADDITIONAL_KYC",
                            "items": [{
                                key: "customer.additionalKYCs[].kyc1ProofNumber",
                                type: "barcode",
                                onCapture: function(result, model, form) {
                                    $log.info(result);
                                    model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                                }

                            }, {
                                key: "customer.additionalKYCs[].kyc1ProofType",
                                required: true,
                                type: "select"
                            }, {
                                key: "customer.additionalKYCs[].kyc1ImagePath",
                                type: "file",
                                required: true,
                                fileType: "image/*",
                                "viewParams": function(modelValue, form, model) {
                                    return {
                                        customerId: model.customer.id
                                    };
                                },
                                //"offline": true
                            }, {
                                key: "customer.additionalKYCs[].kyc1ReverseImagePath",
                                type: "file",
                                fileType: "image/*",
                                "viewParams": function(modelValue, form, model) {
                                    return {
                                        customerId: model.customer.id
                                    };
                                },
                                //"offline": true
                            }, {
                                key: "customer.additionalKYCs[].kyc1IssueDate",
                                type: "date"
                            }, {
                                key: "customer.additionalKYCs[].kyc1ValidUptoDate",
                                type: "date"
                            }, {
                                key: "customer.additionalKYCs[].kyc2ProofNumber",
                                type: "barcode",
                                onCapture: function(result, model, form) {
                                    $log.info(result);
                                    model.customer.additionalKYCs[form.arrayIndex].kyc2ProofNumber = result.text;
                                }
                            }, {
                                key: "customer.additionalKYCs[].kyc2ProofType",
                                type: "select"
                            }, {
                                key: "customer.additionalKYCs[].kyc2ImagePath",
                                type: "file",
                                fileType: "image/*",
                                "viewParams": function(modelValue, form, model) {
                                    return {
                                        customerId: model.customer.id
                                    };
                                },
                                //"offline": true
                            }, {
                                key: "customer.additionalKYCs[].kyc2ReverseImagePath",
                                type: "file",
                                fileType: "image/*",
                                "viewParams": function(modelValue, form, model) {
                                    return {
                                        customerId: model.customer.id
                                    };
                                },
                                //"offline": true
                            }, {
                                key: "customer.additionalKYCs[].kyc2IssueDate",
                                type: "date"
                            }, {
                                key: "customer.additionalKYCs[].kyc2ValidUptoDate",
                                type: "date"
                            }]
                        }]
                    },
                    {
                        "type": "box",
                        "title": "T_FAMILY_DETAILS",
                        "items": [{
                            key: "customer.familyMembers",
                            type: "array",
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
                                }/*,
                                "centreCode": {
                                    "key": "customer.centreCode",
                                    "type": "select"
                                }*/
                            },
                            "outputMap": {
                                "id": "customer.familyMembers[arrayIndex].customerId",
                                "firstName": "customer.familyMembers[arrayIndex].familyMemberFirstName"
                            },
                            "searchHelper": formHelper,
                            "search": function(inputModel, form) {
                                $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                var promise = Enrollment.search({
                                    'branchName': inputModel.branchName || SessionStore.getBranch(),
                                    'firstName': inputModel.firstName,
                                }).$promise;
                                return promise;
                            },
                            onSelect: function(valueObj, model, context) {
                                var rowIndex = context.arrayIndex;
                                PageHelper.showLoader();
                                Enrollment.EnrollmentById({id: valueObj.id}, function (resp, header) {
                                    
                                            model.customer.familyMembers[rowIndex].gender = resp.gender;
                                            model.customer.familyMembers[rowIndex].dateOfBirth = resp.dateOfBirth;
                                            model.customer.familyMembers[rowIndex].maritalStatus = resp.maritalStatus;
                                            model.customer.familyMembers[rowIndex].age = moment().diff(moment(resp.dateOfBirth), 'years');
                                            model.customer.familyMembers[rowIndex].mobilePhone = resp.mobilePhone;
                                            model.customer.familyMembers[rowIndex].relationShip = "";

                                           var selfIndex = _.findIndex(resp.familyMembers, function(o) { return o.relationShip.toUpperCase() == 'SELF' });
                                           
                                            if (selfIndex != -1) {
                                                 model.customer.familyMembers[rowIndex].healthStatus = resp.familyMembers[selfIndex].healthStatus;
                                                 model.customer.familyMembers[rowIndex].educationStatus = resp.familyMembers[selfIndex].educationStatus;
                                            }
                                            PageHelper.hideLoader();
                                            irfProgressMessage.pop("cust-load", "Load Complete", 2000);
                                }, function (resp) {
                                    PageHelper.hideLoader();
                                    irfProgressMessage.pop("cust-load", "An Error Occurred. Failed to fetch Data", 5000)           
                                });
                                    
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
                                },
                                {
                                    key: "customer.familyMembers[].incomes[].monthsPerYear",
                                    "schema":{
                                        "minimum": 1,
                                        "maximum": 12,
                                    }
                                }
                            ]
                        }
                            ]
                        },
                            {
                                "type": "fieldset",
                                "title": "EXPENDITURES",
                                "items": [{
                                    key: "customer.expenditures",
                                    type: "array",
                                    remove: null,
                                    view: "fixed",
                                    titleExpr: "model.customer.expenditures[arrayIndex].expenditureSource | translate",
                                    items: [
                                        {
                                            key: "customer.expenditures[].expenditureSource",
                                            type: "select"
                                        },
                                        {
                                            key: "customer.expenditures[].customExpenditureSource",
                                            title:"CUSTOM_EXPENDITURE_SOURCE",
                                            condition: "model.customer.expenditures[arrayIndex].expenditureSource=='Others'"
                                        },
                                        {
                                            type: 'section',
                                            htmlClass: 'row',
                                            items: [
                                                {
                                                    type: 'section',
                                                    htmlClass: 'col-xs-6',
                                                    items: [{
                                                        key: "customer.expenditures[].frequency",
                                                        type: "select",
                                                        notitle: true
                                                    }]
                                                }, 
                                                {
                                                    type: 'section',
                                                    htmlClass: 'col-xs-6',
                                                    items: [{
                                                        key: "customer.expenditures[].annualExpenses",
                                                        type: "amount",
                                                        notitle: true
                                                    }]
                                                }
                                            ]
                                        }
                                    ]
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
                                        key:"customer.udf.userDefinedFieldValues.udf26",
                                        type: "checkbox",
                                        "schema": {
                                            "default": false
                                        }
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf27",
                                        type:"select"

                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf28",
                                        "schema": {
                                            "type": "number"
                                        }
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
                            titleExpr: "model.customer.physicalAssets[arrayIndex].assetType",
                            type: "array",
                            items: [
                               {
                                   key: "customer.physicalAssets[].assetType",
                                   "title": "ASSET_TYPE",
                                   "enumCode": "asset_type",
                                   type: "select"
                               }, {
                                   key: "customer.physicalAssets[].ownedAssetDetails",
                                   type: "lov",
                                   autolov: true,
                                   lovonly:true,
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
                                       if(!out.length)
                                       {
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
                               }, {
                                   key: "customer.physicalAssets[].unit",
                                   "title": "UNIT",
                                   type: "lov",
                                   autolov: true,
                                   lovonly:true,
                                   bindMap: {},
                                   searchHelper: formHelper,
                                   search: function(inputModel, form, model, context) {
                                       var assetType = model.customer.physicalAssets[context.arrayIndex].assetType;
                                       var assetunit = formHelper.enum('asset_unit').data;
                                       var out = [];
                                       if (assetunit && assetunit.length) {
                                           for (var i = 0; i < assetunit.length; i++) {
                                               
                                                   if ((assetunit[i].parentCode).toUpperCase() == (assetType).toUpperCase() ){
                                                       out.push({
                                                           name: assetunit[i].name,
                                                       })
                                                   }
                                           }
                                       }
                                       if(!out.length)
                                       {
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
                               {
                                key:"customer.physicalAssets[].numberOfOwnedAsset",
                                "title": "NUMBER_OF_OWNED_ASSET",
                               },
                               {
                                   key: "customer.physicalAssets[].ownedAssetValue",
                                   "title": "OWNED_ASSET_VALUE"
                               }
                            ]
                        },
                            {
                                key: "customer.financialAssets",
                                title:"Financial Assets",
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
                                title:"Financial Liabilities",
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
                        "key": "customer.fullName",
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
                                title:"BUILD_TYPE",
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
                        //readonly: true,
                        "latitude": "customer.latitude",
                        "longitude": "customer.longitude",
                        "onChange": "fillGeolocation(modelValue, form)"
                    },
                    "customer.nameOfRo",
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
                    },
                    {
                        "key":"customer.verifications",
                        "title":"VERIFICATION",
                        "add":null,
                        "remove":null,
                        "items":[
                            {
                                key:"customer.verifications[].houseNo",
                                "required":true,
                            },
                            {
                                key:"customer.verifications[].houseNoIsVerified1",
                                "type":"checkbox",
                                "title": "HOUSE_NO_IS_VERIFIED",
                                "required":true,
                                "schema":{
                                    "default":false
                                }
                            },
                            {
                                key:"customer.verifications[].referenceFirstName",
                                "required":true,
                            },
                            {
                                key: "customer.verifications[].referenceLastName",
                                "condition": "model.customer.verifications[arrayIndex].referenceLastName"
                            },
                            {
                                key:"customer.verifications[].relationship",
                                "required":true,
                                type:"select"
                            }

                        ]
                    },
                    {
                        key: "customer.date",
                        type:"date"
                    },
                    {
                        key:"customer.place",
                        "required":true
                    }
                ]
            },
                    {
                        "type": "actionbox",
                        "items": [{
                            "type": "submit",
                            "title": "SUBMIT"
                        }]
                    }
                ],
                schema: function () {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    deleteEnrollment: function (model) {
                        if (window.confirm("Delete - Are You Sure, This action is Irreversible?")) {
                            var remarks = window.prompt("Enter Remarks", "Remarks");
                            PageHelper.showLoader();
                            irfProgressMessage.pop('cust-delete', 'Working...');
                            Enrollment.update({service: "close"}, {
                                "customerId": model.customer.id,
                                "remarks": remarks

                            }, function (resp, headers) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('cust-delete', 'Done.', 2000);
                                $state.go('Page.Engine', {
                                    pageName: "CustomerSearch",
                                    pageId: null
                                });

                            }, function (res) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('cust-delete', 'Oops. An Error Occurred. Please Try Again', 5000);

                                var data = res.data;
                                var errors = [];
                                if (data.errors) {
                                    _.forOwn(data.errors, function (keyErrors, key) {
                                        var keyErrorsLength = keyErrors.length;
                                        for (var i = 0; i < keyErrorsLength; i++) {
                                            var error = {"message": "<strong>" + key + "</strong>: " + keyErrors[i]};
                                            errors.push(error);
                                        }
                                    });

                                }
                                if (data.error) {
                                    errors.push({message: data.error});
                                }
                                PageHelper.setErrors(errors);

                            });

                        }
                    },
                    submit: function (model, form, formName) {

                        if (window.confirm("Update - Are You Sure?")) {
                            PageHelper.showLoader();
                            irfProgressMessage.pop('cust-update', 'Working...');
                            model.customer.title=String(model.customer.addressProofSameAsIdProof);
                            $log.info(model);
                            if (!(EnrollmentHelper.validateDate(model))) {
                                return false;
                            }
                            if (model.customer.verifications && model.customer.verifications.length) {
                                for (i in model.customer.verifications) {
                                    if (model.customer.verifications[i].houseNoIsVerified1) {
                                        model.customer.verifications[i].houseNoIsVerified = (model.customer.verifications[i].houseNoIsVerified1 == true) ? 1 : 0;
                                    }
                                }
                            }
                            var reqData = _.cloneDeep(model);
                            EnrollmentHelper.fixData(reqData);
                            if (reqData.customer.currentStage == 'Completed'){ 
                                reqData['enrollmentAction'] = 'PROCEED';
                            } else {
                                reqData['enrollmentAction'] = 'SAVE';
                            };

                            Enrollment.updateCustomer(reqData, function (res, headers) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('cust-update', 'Done. Customer Updated, ID : ' + res.customer.id, 2000);
                                model.customer = _.clone(res.customer);
                                model.customer.addressProofSameAsIdProof = (model.customer.title=="true")?true:false;
                                model = EnrollmentHelper.fixData(model);
                                $state.go("Page.Engine", {
                                    pageName: "CustomerRUD",
                                    pageId: model.customer.id,
                                    pageData: {
                                        intent: 'VIEW'
                                    }
                                }, {
                                    reload: true,
                                    inherit: false,
                                    notify: true
                                });
                            }, function (res, headers) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('cust-update', 'Oops. Some error.', 2000);
                                $window.scrollTo(0, 0);
                                PageHelper.showErrors(res);
                            })

                        }

                    },
                    doEdit: function (model) {
                        $state.go("Page.Engine", {
                            pageName: "CustomerRUD",
                            pageId: model.customer.id,
                            pageData: {
                                intent: 'EDIT'
                            }
                        }, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    },
                    exitEdit: function (model) {
                        $state.go("Page.Engine", {
                            pageName: "CustomerRUD",
                            pageId: model.customer.id,
                            pageData: {
                                intent: 'VIEW'
                            }
                        }, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });

                    }
                }
            };
        }]);
