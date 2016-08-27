irf.pageCollection.factory(irf.page("customer.EnterpriseEnrollment"),
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
            model.customer.centreCode = "Demo";
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
                        key:"customer.centreCode"
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
                    },
                    {
                        key: "customer.enterprise.referredBy",
                        title:"REFERRED_BY",
                        type: "select",
                        titleMap: {
                            "cold_call":"Cold call",
                            "existing_customer_reference": "Existing customer reference",
                            "referral_partner": "Referral partner"
                        }
                    },
                    {
                        key: "customer.enterprise.referredName",
                        title:"REFERRED_NAME"
                    },/*
                    {
                        key: "customer.enterprise.businessName",
                        title:"COMPANY_NAME"
                    },*/
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
                            "less_than_1_year": "Less Than 1 Year",
                            "_1_to_2_years": "1 to 2 Years",
                            "_2_to_3_years": "2 to 3 Years",
                            "_3_to_5_years": "3 to 5 Years",
                            "_5_to_10_years": "5 to 10 Years",
                            "greater_than_10_years": "Greater Than 10 Years"
                        }
                    },
                    {
                        key: "customer.enterprise.businessInCurrentAddressSince",
                        type: "select",
                        title: "YEARS_OF_BUSINESS_PRESENT_ADDRESS",
                        titleMap: {
                            "less_than_1_year": "Less Than 1 Year",
                            "_1_to_3_years": "1 to 3 Years",
                            "_3_to_6_years": "3 to 6 Years",
                            "_6_to_10_years": "6 to 10 Years",
                            "greater_than_10_years": "Greater Than 10 Years"
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
                        title: "OWNERSHIP",
                        type: "select",
                        titleMap: {
                            "owned": "Owned",
                            "rental": "Rental",
                            "lease": "Lease"
                        }
                    },
                    {
                        key: "customer.enterprise.businessConstitution",
                        title: "CONSTITUTION",
                        type: "select",
                        titleMap: {
                            "proprietorship": "Proprietorship",
                            "partnership": "Partnership",
                            "private_ltd": "Private Ltd"
                        }
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
                        titleMap: {
                            "tin": "TIN",
                            "ssi_number": "SSI number",
                            "vat_number": "VAT number",
                            "business_pan_number": "Business PAN number",
                            "service_tax_number": "Service tax number",
                            "dic": "DIC",
                            "msme": "MSME",
                            "s_and_e": "S&E"
                        }
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
                        titleMap: {
                            "manufacturing": "manufacturing"
                        }
                    },
                    {
                        key: "customer.enterprise.businessLine",
                        title: "BUSINESS_LINE",
                        type: "select",
                        titleMap: {
                            "manufacturing": "manufacturing"
                        }
                    },
                    {
                        key: "customer.enterprise.businessSector",
                        title: "BUSINESS_SECTOR",
                        type: "select",
                        titleMap: {
                            "manufacturing": "manufacturing"
                        }
                    },
                    {
                        key: "customer.enterprise.businessSubType",
                        title: "BUSINESS_SUBSECTOR",
                        type: "select",
                        titleMap: {
                            "manufacturing": "manufacturing"
                        }
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
                                titleMap: {
                                    a:"Proprietor",
                                    b:"Partner",
                                    c:"Director",
                                    d:"Others"
                                }
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
                                    var promise = Enrollment.search({
                                        'branchName': inputModel.branchName || SessionStore.getBranch(),
                                        'firstName': inputModel.first_name,
                                        'centreCode': inputModel.centreCode
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
                EnrollmentHelper.saveData(reqData).then(function(res){
                    model.customer = _.clone(res.customer);
                    model = EnrollmentHelper.fixData(model);
                    
                    $state.go("Page.Engine", {
                        pageName: 'ProfileInformation',
                        pageId: model.customer.id
                    });
                });
            }
        }
    };
}]);
