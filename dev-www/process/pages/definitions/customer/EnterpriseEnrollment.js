irf.pageCollection.factory(irf.page("customer.EnterpriseEnrollment"),
["$log", "$q","Enrollment", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils",
function($log, $q, Enrollment, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "ENTITY_ENROLLMENT",
        "subTitle": "BUSINESS",
        initialize: function (model, form, formCtrl) {
            model.customer = model.customer || {};
            model.branchId = SessionStore.getBranchId() + '';
            model.customer.kgfsName = SessionStore.getBranch();
            model.customer.customerType = "Enterprise";
        },
        modelPromise: function(pageId, _model) {
        },
        offline: true,
        getOfflineDisplayItem: function(item, index){
            return [
                item.customer.firstName,
                item.customer.centreCode,
                item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
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
                        key: "customer.id",
                        condition: "model.customer.id",
                        title:"ENTITY_ID",
                        readonly: true
                    },
                    {
                        key: "customer.urnNo",
                        condition: "model.customer.urnNo",
                        title:"URN_NO",
                        readonly: true
                    },
                    {
                        key:"customer.centreCode",
                        type:"select",
                        filter: {
                            "parentCode": "model.branchId"
                        },
                    },
                    {
                        key: "customer.entityId",
                        title:"ENTITY_ID",
                        titleExpr:"('ENTITY_ID'|translate)+' (Artoo)'",
                        readonly: true
                    },
                    {
                        key: "customer.firstName",
                        title:"ENTITY_NAME"
                    },
                    {
                        key: "customer.enterprise.referredBy",
                        title:"REFERRED_BY",
                        type: "select",
                        enumCode: "referredBy"
                    },
                    {
                        key: "customer.enterprise.referredName",
                        title:"REFERRED_NAME"
                    },/*
                    {
                        key: "customer.enterprise.businessName",
                        title:"COMPANY_NAME"
                    },*/
                    //{ /*TODO Not working when this is enabled */
                    //    key: "customer.enterprise.companyOperatingSince",
                    //    title:"OPERATING_SINCE",
                    //    type: "date"
                    //},
                    //{
                    //    key: "customer.enterprise.businessInPresentAreaSince",
                    //    type: "number",
                    //    title: "YEARS_OF_BUSINESS_PRESENT_AREA"
                    //},
                    {
                        key: "customer.enterprise.businessInCurrentAddressSince",
                        type: "date",
                        title: "BUSINESS_IN_CURRENT_ADDRESS_SINCE"
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
                        title: "OWNERSHIP",
                        type: "select",
                        enumCode: "ownership"
                    },
                    {
                        key: "customer.enterprise.businessConstitution",
                        title: "CONSTITUTION",
                        type: "select",
                        enumCode: "constitution"
                    },
                    {
                        key: "customer.enterprise.companyRegistered",
                        type: "checkbox",
                        schema: {
                            default: false
                        },
                        title: "IS_REGISTERED"
                    },
                    {
                        key: "customer.enterprise.registrationType",
                        condition: "model.customer.enterprise.companyRegistered",
                        title: "REGISTRATION_TYPE",
                        type: "select",
                        enumCode: "business_registration_type"
                    },
                    {
                        key: "customer.enterprise.registrationNumber",
                        condition: "model.customer.enterprise.companyRegistered",
                        title: "REGISTRATION_NUMBER"
                    },
                    {
                        key: "customer.enterprise.businessType",
                        title: "BUSINESS_TYPE",
                        type: "select",
                        enumCode: "businessType"
                    },
                    {
                        key: "customer.enterprise.businessLine",
                        title: "BUSINESS_LINE",
                        type: "select",
                        enumCode: "businessLine"
                    },
                    {
                        key: "customer.enterprise.businessSector",
                        title: "BUSINESS_SECTOR",
                        type: "select",
                        enumCode: "businessSector"
                    },
                    {
                        key: "customer.enterprise.businessSubType",
                        title: "BUSINESS_SUBSECTOR",
                        type: "select",
                        enumCode: "businessSubSector"
                    },
                   {
                        key: "customer.enterpriseCustomerRelations",
                        type: "array",
                        title: "RELATIONSHIP_TO_BUSINESS",
                        items: [
                            {
                                key: "customer.enterpriseCustomerRelations[].relationshipType",
                                title: "RELATIONSHIP_TYPE",
                                type: "select",
                                enumCode: "relationship_type"
                            },
                            {
                                key: "customer.enterpriseCustomerRelations[].linkedToCustomerId",
                                type: "lov",
                                title: "CUSTOMER_ID",
                                inputMap: {
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
                                outputMap: {
                                    "id": "customer.enterpriseCustomerRelations[arrayIndex].linkedToCustomerId",
                                    "firstName": "customer.enterpriseCustomerRelations[arrayIndex].linkedToCustomerName"
                                },
                                searchHelper: formHelper,
                                search: function(inputModel, form, model) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    $log.info("inputModel.centreCode: " + inputModel.centreCode);
                                    if (!inputModel.branchName)
                                        inputModel.branchName = SessionStore.getBranch();
                                    var promise = Enrollment.search({
                                        'branchName': inputModel.branchName,
                                        'firstName': inputModel.firstName,
                                        'centreCode': inputModel.centreCode
                                        //'customerType': 'Individual'
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
                                key: "customer.enterpriseCustomerRelations[].linkedToCustomerName",
                                readonly: true,
                                title: "CUSTOMER_NAME"
                            }
                        ]
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
                        key:"customer.villageName"/*,
                        type:"select",
                        filter: {
                            'parentCode': 'model.branchId'
                        },
                        screenFilter: true*/
                    },
                    "customer.udf.userDefinedFieldValues.udf9",
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
                            "pincode": "customer.pincode",
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
                            return Queries.searchPincodes(inputModel.pincode, inputModel.district, inputModel.state);
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.pincode,
                                item.district + ', ' + item.state
                            ];
                        }
                    },
                    {
                        key:"customer.state"
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
                                enumCode: "account_type"
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
                "items": [{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                },{
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            }
        ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
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
                var sortFn = function(unordered){
                    var out = {};
                    Object.keys(unordered).sort().forEach(function(key) {
                        out[key] = unordered[key];
                    });
                    return out;
                };
                var reqData = _.cloneDeep(model);
                EnrollmentHelper.fixData(reqData);
                //reqData.customer.enterprise.companyRegistered = "Yes";
                //$log.info(JSON.stringify(sortFn(reqData)));
                if (reqData.customer.id) {
                    EnrollmentHelper.proceedData(reqData).then(function(resp){
                        Utils.removeNulls(res.customer,true);
                        model.customer = resp.customer;
                    });
                } else {
                    EnrollmentHelper.saveData(reqData).then(function(res){
                        EnrollmentHelper.proceedData(res).then(function(resp){
                            Utils.removeNulls(resp.customer,true);
                            model.customer = resp.customer;
                        }, function(err) {
                            Utils.removeNulls(res.customer,true);
                            model.customer = res.customer;
                        });
                    });
                }
            }
        }
    };
}]);
