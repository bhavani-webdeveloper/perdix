irf.pageCollection.factory(irf.page("customer.IndividualEntityEnrollment"),
["$log", "$q","Enrollment", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams",
function($log, $q, Enrollment, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "ENTITY_ENROLLMENT",
        "subTitle": "INDIVIDUAL",
        initialize: function (model, form, formCtrl) {
            model.customer = model.customer || {};
            model.branchId = SessionStore.getBranchId() + '';
            model.customer.kgfsName = SessionStore.getBranch();
            model.customer.centreCode = "Basti";
        },
        modelPromise: function(pageId, _model) {
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
            ]
        },
        form: [
            {
                "type": "box",
                "title": "CUSTOMER_INFORMATION",
                "items": [
                    {
                        key: "customer.kgfsName",
                        title:"BRANCH_NAME",
                        readonly: true
                    },
                    {
                        key:"customer.centreCode",
                        title: "SPOKE",
                        readonly: true
                    },
                    {
                        key: "customer.entityId",
                        title:"ENTITY_ID",
                        type: "lov",
                        autoLov: true,
                        inputMap: {
                            "firstName": {
                                "key": "customer.firstName",
                                "title": "OLD_CUSTOMER_NAME"
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
                        outputMap: {
                            "urnNo": "customer.entityId",
                            "firstName": "customer.firstName"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                            var promise = Enrollment.search({
                                'branchName': SessionStore.getBranch() || inputModel.branchName,
                                'firstName': inputModel.firstName,
                                'urnNo': model.customer.entityId
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                [item.firstName, item.fatherFirstName].join(' '),
                                item.id,
                                item.urnNo
                            ];
                        }
                    },
                    {
                        key: "customer.urnNo",
                        title:"URN_NO",
                        readonly: true
                    },
                    {
                        key:"customer.photoImageId",
                        type:"file",
                        fileType:"image/*"
                    },
                    {
                        key: "customer.firstName",
                        title:"FIRST_NAME",
                        placeholder: "FIRST_NAME"
                    },
                    {
                        key: "customer.middleName",
                        title:"MIDDLE_NAME"
                    },
                    {
                        key: "customer.lastName",
                        title:"LAST_NAME"
                    },
                    {
                        key: "customer.maritalStatus",
                        type: "select"
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
                        key:"customer.gender1",
                        title: "Gender",
                        type:"radios",
                        titleMap: {
                            a:"Male",
                            b:"Female",
                            c:"Unspecified"
                        }
                    },
                    {
                        key: "customer.religion1",
                        title: "Religion",
                        type: "select",
                        titleMap: {
                            a:"Hindu",
                            b:"Muslim",
                            c:"Chirstian",
                            d:"Jain",
                            e:"Buddhism",
                            f:"Others"
                        }
                    },
                    {
                        key: "customer.educationLevel",
                        title: "Education Level",
                        type: "select",
                        titleMap: {
                            a:"Below SSLC",
                            b:"SSLC",
                            c:"HSC",
                            d:"Graduate/Diploma/ITI",
                            e:"Professional Degree",
                            f:"Others"
                        }
                    },
                    {
                        key: "customer.relationshipToBusiness",
                        title: "Relationship to Business",
                        type: "select",
                        titleMap: {
                            a:"Proprietor",
                            b:"Partner",
                            c:"Director",
                            d:"Others"
                        }
                    },
                    {
                        key: "customer.enterpriseCustomerRelations.linkedToCustomerId",
                        type: "lov",
                        title: "BUSINESS"
                    }
                ]
            },
            {
                "type": "box",
                "title": "CONTACT_INFORMATION",
                "items":[{
                    type: "fieldset",
                    title: "CUSTOMER_PRESENT_ADDRESS",
                    items: [
                            "customer.doorNo",
                            "customer.street",
                            {
                                key: "cu",
                                title: "Landmark"
                            },
                            {
                                key: "customer.pincode",
                                type: "lov"
                            },
                            {
                                key:"customer.state"
                            },
                            {
                                key: "customer.district"
                            },
                            {
                                key: "customer.city",
                                title: "City"
                            },
                            {
                                key: "customer.mobilePhone",
                                required: true
                            },
                            "customer.mailSameAsResidence",
                            {
                                key: "customer.latitude",
                                title: "HOUSE_LOCATION",
                                type: "geotag",
                                latitude: "customer.latitude",
                                longitude: "customer.longitude"
                            }
                        ]
                    },{
                        type: "fieldset",
                        title: "CUSTOMER_PERMANENT_ADDRESS",
                        condition:"!model.customer.mailSameAsResidence",
                        items: [
                            "customer.doorNo",
                            "customer.street",
                            {
                                key: "cu",
                                title: "Landmark"
                            },
                            {
                                key: "customer.pincode",
                                type: "lov"
                            },
                            {
                                key:"customer.state"
                            },
                            {
                                key: "customer.district"
                            },
                            {
                                key: "customer.city",
                                title: "City"
                            },
                            {
                                key: "customer.mobilePhone",
                                required: true
                            }
                        ]
                    },
                    {
                        key: "c",
                        title: "Years in current address",
                        type: "select",
                        titleMap: {
                            a: "Less than 1 year",
                            b: "1 to 3 years",
                            c: "4 to 6 years",
                            d: "7 to 10 years",
                            e: "Greater than 10 years"
                        }
                    },
                    {
                        key: "cc",
                        title: "Years in current area",
                        type: "select",
                        titleMap: {
                            a: "Less than 1 year",
                            b: "1 to 3 years",
                            c: "4 to 6 years",
                            d: "7 to 10 years",
                            e: "Greater than 10 years"
                        }
                    },
                    {
                        key: "d",
                        title: "Ownership",
                        type: "select",
                        titleMap: {
                            a:"Owned",
                            b: "Rented",
                            c:"Leased"
                        }
                    }
                ]
            },
            {
                type:"box",
                title:"KYC",
                items:[
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
                            }
                        ]
                    }
                ]
            },
            {
                type: "box",
                title: "CUSTOMER_BANK_ACCOUNTS",
                items: [
                    {
                        key: "customer.bankAccounts",
                        type: "array",
                        title: "BANK_ACCOUNTS",
                        startEmpty: true,
                        items: [
                            {
                                key: "customer.bankAccounts[].ifscCode",
                                title: "IFSC_CODE",
                                type: "lov",
                                inputMap: {
                                    "bankName": {
                                        "key": "customer.bankAccounts[].bankName",
                                        "title": "BRANCH_NAME"
                                    },
                                    "branchName": {
                                        "key": "customer.bankAccounts[].branch",
                                        "title": "BRANCH_NAME"
                                    },
                                    "ifscCode": {
                                        "key": "customer.bankAccounts[].ifscCode",
                                        "title": "IFSC_CODE"
                                    }
                                },
                                outputMap: {
                                    "bankName": "customer.bankAccounts[arrayIndex].bankName",
                                    "branchName": "customer.bankAccounts[arrayIndex].branch",
                                    "ifscCode": "customer.bankAccounts[arrayIndex].ifscCode"
                                },
                                searchHelper: formHelper,
                                search: function(inputModel, form) {
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
                                key: "customer.bankAccounts[].bankName",
                                title: "BANK_NAME"
                            },
                            {
                                key: "customer.bankAccounts[].branch",
                                title: "BRANCH_NAME"
                            },
                            {
                                key: "customer.bankAccounts[].customerName",
                                title: "CUSTOMER_NAME"
                            },
                            {
                                key: "customer.bankAccounts[].accountNumber",
                                title: "ACCOUNT_NUMBER"
                            },
                            {
                                key: "customer.bankAccounts[].accountType",
                                title: "ACCOUNT_TYPE"
                            },
                            {
                                key: "customer.bankAccounts[].isDisbursementAccount",
                                type: "checkbox",
                                schema: {
                                    default: false
                                },
                                title: "DISBURSEMENT_ACCOUNT"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "actionbox",
                "condition": "model._mode != 'EDIT'",
                "items": [{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                },{
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            },
            {
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
            }
        ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {

            setProofs: function(model) {
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
                    $state.go("Page.Engine", {
                        pageName: 'ProfileInformation',
                        pageId: model.customer.id
                    });
                });
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
            }
        }
    };
}]);
