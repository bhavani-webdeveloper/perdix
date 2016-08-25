irf.pageCollection.factory(irf.page("customer.BusinessEntityEnrollment"),
["$log", "$q","Enrollment", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams",
function($log, $q, Enrollment, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "ENTITY_ENROLLMENT",
        "subTitle": "BUSINESS",
        initialize: function (model, form, formCtrl) {
            model.customer = model.customer || {};
            model.branchId = SessionStore.getBranchId() + '';
            model.customer.kgfsName = SessionStore.getBranch();
            model.customer.customerType = "Business";
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
                "title": "ENTITY_INFORMATION",
                "items": [
                    {
                        key: "customer.kgfsName",
                        title:"BRANCH_NAME",
                        readonly: true
                    },
                    {
                        key:"customer.centreCode",
                        type:"select",
                        title: "SPOKE",
                        filter: {
                            "parentCode": "model.branchId"
                        },
                        screenFilter: true
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
                        key: "customer.firstName",
                        title:"ENTITY_NAME"
                    }/*,
                    {
                        key:"customer.photoImageId",
                        title: "ENTITY_PHOTO",
                        type:"file",
                        fileType:"image/*"
                    }*/
                ]
            },
            {
                type:"box",
                title:"BUSINESS",
                items:[
                    {
                        key: "customer.enterprise.referredBy",
                        title:"REFERRED_BY",
                        type: "select",
                        titleMap: {
                            "a":"Cold call",
                            "b": "Existing customer reference",
                            "c": "Referral partner"
                        }
                    },
                    {
                        key: "customer.enterprise.referredName",
                        title:"REFERRED_NAME"
                    },
                    {
                        key: "customer.enterprise.businessName",
                        title:"COMPANY_NAME"
                    },
                    {
                        key: "customer.enterprise.companyOperatingSince",
                        title:"OPERATING_SINCE",
                        type: "date"
                    },
                    {
                        key: "customer.enterprise.businessInPresentAreaSince",
                        type: "select",
                        title: "YEARS_OF_BUSINESS_PRESENT_AREA",
                        titleMap: {
                            a: "Less Than 1 Year",
                            b: "1 to 2 Years",
                            c: "2 to 3 Years",
                            d: "3 to 5 Years",
                            e: "5 to 10 Years",
                            f: "Greater Than 10 Years"
                        }
                    },
                    {
                        key: "customer.enterprise.businessInCurrentAddressSince",
                        type: "select",
                        title: "YEARS_OF_BUSINESS_PRESENT_ADDRESS",
                        titleMap: {
                            a: "Less Than 1 Year",
                            b: "1 to 3 Years",
                            c: "4 to 6 Years",
                            d: "6 to 10 Years",
                            f: "Greater Than 10 Years"
                        }
                    },
                    {
                        "key": "customer.latitude",
                        "title": "BUSINESS_LOCATION",
                        "type": "geotag",
                        "latitude": "customer.latitude",
                        "longitude": "customer.longitude"
                    },
                    {
                        key: "customer.enterprise.ownership",
                        title: "Ownership",
                        type: "select",
                        titleMap: {
                            "Owned": "Owned",
                            "Rent": "Rent",
                            "Lease": "Lease"
                        }
                    },
                    {
                        key: "customer.enterprise.constitution",
                        title: "CONSTITUTION",
                        type: "select",
                        titleMap: {
                            a: "Proprietorship",
                            b: "Partnership",
                            c: "Private Ltd"
                        }
                    },
                    {
                        key: "customer.enterprise.isCompanyRegistered",
                        type: "checkbox",
                        schema: {
                            default: false
                        },
                        title: "IS_REGISTERED"
                    },
                    {
                        key: "customer.enterprise.registrationType",
                        condition: "model.customer.enterprise.isCompanyRegistered",
                        title: "REGISTRATION_TYPE",
                        type: "select",
                        titleMap: {
                            a: "TIN",
                            b: "SSI number",
                            c: "VAT number",
                            d: "Business PAN number",
                            e: "Service tax number",
                            f: "DIC",
                            g: "MSME",
                            h: "S&E"
                        }
                    },
                    {
                        key: "customer.enterprise.registrationNumber",
                        condition: "model.customer.enterprise.isCompanyRegistered",
                        title: "REGISTRATION_NUMBER"
                    },
                    {
                        key: "customer.enterprise.businessType",
                        title: "BUSINESS_TYPE",
                        type: "select",
                        titleMap: {}
                    },
                    {
                        key: "customer.enterprise.businessLine",
                        title: "BUSINESS_LINE",
                        type: "select",
                        titleMap: {}
                    },
                    {
                        key: "customer.enterprise.businessSector",
                        title: "BUSINESS_SECTOR",
                        type: "select",
                        titleMap: {}
                    },
                    {
                        key: "customer.enterprise.businessSubsector",
                        title: "BUSINESS_SUBSECTOR",
                        type: "select",
                        titleMap: {}
                    },
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
                    "customer.udf.userDefinedFieldValues.udf9",
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
                                title: "ACCOUNT_TYPE",
                                type: "select",
                                titleMap: {
                                    a:"Current",
                                    b:"Savings",
                                    c:"OD",
                                    d:"CC"
                                }
                            },
                            {
                                key: "customer.bankAccounts[].isDisbursementAccount",
                                type: "radios",
                                schema: {
                                    default: false
                                },
                                title: "DISBURSEMENT_ACCOUNT",
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
