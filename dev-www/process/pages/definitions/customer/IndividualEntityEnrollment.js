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
                        key: "customer.entityId",
                        title:"ENTITY_ID",
                        type: "lov",
                        lovonly: true,
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
                            "id": "customer.entityId",
                            "firstName": "customer.firstName"
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
                        key:"customer.gender",
                        type:"radios"
                    },
                    {
                        key: "customer.religion",
                        type: "select"
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
                        key: "customer.educationLevel",
                        title: "Education Level"
                    },
                    {
                        key: "customer.relationshipToBusiness",
                        title: "Relationship to Business"
                    }
                ]
            },
            {
                "type": "box",
                "title": "KYC",
                "items":[
                    "customer.mobilePhone",
                    {
                        key: "customer.mobilePhone2",
                        title: "MOBILE_PHONE_2"
                    },
                    "customer.doorNo",
                    "customer.street",
                    "customer.locality",
                    {
                        key:"customer.villageName",
                        type:"select",
                        filter: {
                            'parentCode': 'model.branchId'
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
                    }
                ]
            },
            {
                "type": "box",
                "title": "CONTACT_INFORMATION",
                "items":[
                    "customer.doorNo",
                    "customer.street",
                    "customer.locality",
                    {
                        key:"customer.villageName",
                        type:"select",
                        filter: {
                            'parentCode': 'model.branchId'
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
                    "customer.mobilePhone"
                ]
            },
            {
                type:"box",
                title:"BUSINESS",
                items:[
                    {
                        key: "business.referredBy",
                        title:"REFERRED_BY"
                    },
                    {
                        key: "business.referredName",
                        title:"REFERRED_NAME"
                    },
                    {
                        key: "business.companyName",
                        title:"COMPANY_NAME"
                    },
                    {
                        key: "business.companyOperatingSince",
                        title:"OPERATING_SINCE",
                        type: "date",
                        onChange: function(modelValue, form, model) {
                            model.business.yearsInArea = model.business.yearsInAddress = moment().diff(moment(modelValue), 'years');
                        }
                    },
                    {
                        key: "business.yearsInArea",
                        type: "number",
                        title: "YEARS_OF_BUSINESS_PRESENT_AREA"
                    },
                    {
                        key: "business.yearsInAddress",
                        type: "number",
                        title: "YEARS_OF_BUSINESS_PRESENT_ADDRESS"
                    },
                    {
                        "key": "customer.latitude",
                        "title": "BUSINESS_LOCATION",
                        "type": "geotag",
                        "latitude": "customer.latitude",
                        "longitude": "customer.longitude"
                    },
                    {
                        key: "business.ownership",
                        title: "Ownership",
                        type: "select",
                        titleMap: {
                            "Owned": "Owned",
                            "Rent": "Rent",
                            "Lease": "Lease"
                        }
                    },
                    {
                        key: "business.isCompanyRegistered",
                        type: "checkbox",
                        schema: {
                            default: false
                        },
                        title: "IS_REGISTERED"
                    },
                    {
                        key: "business.registrationType",
                        condition: "model.business.isCompanyRegistered",
                        title: "REGISTRATION_TYPE"
                    },
                    {
                        key: "business.registrationNumber",
                        condition: "model.business.isCompanyRegistered",
                        title: "REGISTRATION_NUMBER"
                    },
                    {
                        key: "business.constitution",
                        title: "CONSTITUTION",
                        type: "select",
                        titleMap: {}
                    },
                    {
                        key: "business.businessType",
                        title: "BUSINESS_TYPE",
                        type: "select",
                        titleMap: {}
                    },
                    {
                        key: "business.businessLine",
                        title: "BUSINESS_LINE",
                        type: "select",
                        titleMap: {}
                    },
                    {
                        key: "business.businessSector",
                        title: "BUSINESS_SECTOR",
                        type: "select",
                        titleMap: {}
                    },
                    {
                        key: "business.businessSubsector",
                        title: "BUSINESS_SUBSECTOR",
                        type: "select",
                        titleMap: {}
                    },
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
