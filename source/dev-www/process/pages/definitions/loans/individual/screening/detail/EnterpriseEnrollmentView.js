define({
    pageUID: "loans.individual.screening.detail.EnterpriseEnrollmentView",
    pageType: "Engine",
    dependencies: ["$log", "$state", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q","irfProgressMessage","$stateParams","$state",
    "PageHelper", "Utils","PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "Dedupe","$resource","$httpParamSerializer","BASE_URL","searchResource"],
    $pageFn: function($log, $state, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,irfProgressMessage,$stateParams,$state,
     PageHelper, Utils,PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, Dedupe,$resource,$httpParamSerializer,BASE_URL, searchResource){
        return {
            "type": "schema-form",
            "title": "ENTERPRISE_ENROLLMENT_VIEW",
            "subTitle": "",
            initialize: function(model, form, formCtrl,bundlePageObj, bundleModel) {
                    model.bundleModel = bundleModel;
                    Enrollment.getCustomerById({id:model.customerId}).$promise.then(function(res){
                            model.customer=res;
                    })

            },
        form: [
            {
                "type":"box",
                "colClass":"col-sm-12",
                "title":"BASIC_BUSINESS_INFORMATION",
                "readonly":true,
                "items":[
                    {
                        "type":"grid",
                        "orientation":"horizontal",
                        "items":[
                            {
                                "type":"grid",
                                "orientation":"vertical",
                                "items":[
                                    {
                                        "key":"customer.enterprise.id",
                                        "title":"Entity ID"
                                    },
                                    {
                                        "key":"customer.enterprise.businessName",
                                        "title":"Business Name"
                                    },
                                    {
                                        "key":"customer.enterprise.businessType",
                                        "title":"Business Type"
                                    },
                                    {
                                        "key":"customer.enterprise.businessActivity",
                                        "title":"Business Activity"
                                    },
                                    {
                                        "key":"customer.enterprise.businessSector",
                                        "title":"Business Sector"
                                    },
                                    {
                                        "key":"customer.enterprise.businessSubSector",
                                        "title":"Business Subsector"
                                    },
                                    {
                                        "key":"customer.enterprise.referredBy",
                                        "title":"Sourced by"
                                    }
                                ]
                            },
                            {
                                "type":"grid",
                                "orientation":"vertical",
                                "items":[
                                    {
                                        "key":"",
                                        "title":"URN"
                                    },
                                    {
                                        "key":"customer.enterprise.businessConstitution",
                                        "title":"Constitution"
                                    },
                                    {
                                        "key":"customer.enterprise.businessHistory",
                                        "title":"Business History"
                                    },
                                    {
                                        "key":"customer.enterprise.ownership",
                                        "title":"Premises Ownership"
                                    },
                                    {
                                        "key":"Customer.enterpriseUserDefinedFieldValues.YEARS_OF_BUSINESS_PRESENT_AREA",
                                        "title":"Operating Since"
                                    },
                                    {
                                        "key":"",
                                        "title":"Has anyone else been a partner of your present business ?"
                                    }
                                ]

                            }
                        ]
                    }
                ]
            },
            {
                "type":"box",
                "colClass":"col-sm-12",
                "title":"CONTACT_INFO",
                "readonly":true,
                "items":[
                    {
                        "type":"grid",
                        "orientation":"vertical",
                        "items":[
                            {
                                "key":"",
                                "title":"Mobile Phone"
                            },
                            {
                                "key":"",
                                "title":"Phone 2"
                            },
                            {
                                "key":"",
                                "title":"Distance from Hub"
                            },
                            {
                                "key":"Customer.enterprise.businessInPresentAreaSince",
                                "title":"YEARS_OF_BUSINESS_PRESENT_AREA"
                            },
                            {
                                "key":"Customer.enterprise.businessInCurrentAddressSince",
                                "title":"YEARS_OF_BUSINESS_PRESENT_ADDRESS"
                            }
                        ]
                    }
                ]
            },
            {
                "type":"box",
                "colClass":"col-sm-12",
                "title":"RAGISTRATION_DETAILS",
                "readonly":true,
                "items":[
                    {
                        "type": "tableview",
                        "key": "customer.enterpriseRegistrations",
                        "title": "",
                        "selectable": false,
                        "editable": false,
                        "tableConfig": 
                            {
                                "searching": false,
                                "paginate": false,
                                "pageLength": 10,
                            },
                        getColumns: function(){
                            return [{
                                        "title": "Registration Type",
                                        "data": "registrationType"
                                    },
                                    {
                                        "title": "Registration Number",
                                        "data": "registrationNumber"/*,
                                                render: function(data, type, full, meta) {
                                                    if (full.incomes[0])
                                                    return full.incomes[0].incomeEarned;
                                                    return 0;
                                                }*/
                                    },
                                    {
                                        "title": "Registered Date",
                                        "data": "registeredDate"/*,
                                                render: function(data, type, full, meta) {
                                                    if (full.incomes[0])
                                                        return full.incomes[0].incomeEarned;
                                                        return 0;
                                                    }*/
                                    },
                                    {
                                        "title": "Expriy Date",
                                        "data": "expiryDate",
                                    }
                                ];
                            },
                        getActions: function() {
                            return [];
                        }
                    }
                ]
            },
            {
                "type":"box",
                "colClass":"col-sm-12",
                "readonly":true,
                "title":"EMPLOYEE_DETAILS",
                "items":[
                    {
                        "type":"grid",
                        "orientation":"horizontal",
                        "items":[
                            {
                                "type":"grid",
                                "orientation":"vertical",
                                "items":[
                                    {
                                        "key":"customer.enterprise.noOfFemaleEmployees",
                                        "title":"No Of Male Employees"
                                    },
                                    {
                                        "key":"customer.enterprise.noOfMaleEmployees",
                                        "title":"No Of Female Employees"
                                    }
                                ]
                            },
                            {
                                "type":"grid",
                                "orientation":"vertical",
                                "items":[
                                    {
                                        "key":"customer.enterprise.avgMonthlySalary",
                                        "title":"Average Monthly Salary"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type":"box",
                "colClass":"col-sm-12",
                "readonly":true,
                "title":"MACHINARY_DETAILS",
                "items":[
                    {
                        "type":"grid",
                        "orientation":"vertical",
                        "items":[
                            {
                                "type":"grid",
                                "orientation":"horizontal",
                                "items":[
                                    {
                                        "type":"grid",
                                        "orientation":"vertical",
                                        "items":[
                                            {
                                                "key":"",
                                                "title":"Total No Of Machinary"
                                            },
                                            {
                                                "key":"",
                                                "title":"Total Value Of Machinary"
                                            }
                                        ]
                                    },
                                    {
                                        "type":"grid",
                                        "orientation":"vertical",
                                        "items":[
                                            {
                                                "key":"",
                                                "title":"No Of Machinary Hypothecated To Kinara"
                                            },
                                            {
                                                "key":"",
                                                "title":"Value Of Machinary hypothecated to Kinara"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type":"expandablesection",
                                "expanded":"false",
                                "title":"click to view details",
                                "items":[
                                    { 
                                        "type":"grid",
                                        "orientation":"vertical",
                                        "items":[
                                            {
                                                "type": "tableview",
                                                "key": "customer.fixedAssetsMachinaries",
                                                "title": "",
                                                "selectable": false,
                                                "editable": false,
                                                "tableConfig": 
                                                    {
                                                        "searching": false,
                                                        "paginate": false,
                                                        "pageLength": 10,
                                                    },
                                                    getColumns: function(){
                                                        return [{
                                                                "title": "Machine Type",
                                                                "data": "machineType"
                                                            },
                                                            {
                                                                "title": "Manufacturer Name",
                                                                "data": "manufacturerName"
                                                            },
                                                            {
                                                                "title": "Model No",
                                                                "data": "machineModel",
                                                            },
                                                            {
                                                                "title":"Purchase Year",
                                                                "data":"machinePurchasedYear"
                                                            },
                                                            {
                                                                "title":"New Mahcine",
                                                                "data":"isTheMachineNew"
                                                            },
                                                            {
                                                                "title":"Purchase Price",
                                                                "data":"purchasePrice"
                                                            },
                                                            {
                                                                "title":"Present Value",
                                                                "data":"presentValue"
                                                            },
                                                            {
                                                                "title":"Source",
                                                                "data":"fundingSource"
                                                            }
                                                        ];
                                                    },
                                                    getActions: function() {
                                                        return [];
                                                    }
                                            },
                                            {
                                                "key": "customer.fixedAssetsMachinaries[].machineImage",
                                                "title":"MACHINE_IMAGE",
                                                "required":true,
                                                "category":"Loan",
                                                "subCategory":"DOC1",
                                                "type": "file",
                                                "fileType":"application/pdf",
                                                "using": "scanner"
                                            }
                                        ]

                                    }
                                ]
                            }
                        ]
                    }
                ]

            },
            {
                "type":"box",
                "colClass":"col-sm-12",
                "readonly":true,
                "title":"COMMERCIAL CIBIL",
                "items":[
                    {
                        "type":"grid",
                        "orientation":"horizontal",
                        "items":[
                            {
                                "type":"grid",
                                "orientation":"vertical",
                                "items":[
                                    {
                                        "key":"customer.enterpriseBureauDetails[].bureau",
                                        "title":"Bureau"
                                    },
                                    {
                                        "key":"customer.enterpriseBureauDetails[].doubtful",
                                        "title":"Doubtful Account"
                                    },
                                    {
                                        "key":"customer.enterpriseBureauDetails[].loss",
                                        "title":"Loss Accounts"
                                    },
                                    {
                                        "key":"customer.enterpriseBureauDetails[].fileId",
                                        "title":"CB_Report",
                                        "type":"file",
                                        "fileType":"application/pdf",
                                        "using": "scanner"
                                    }
                                ]
                            },
                            {
                                "type":"grid",
                                "orientation":"vertical",
                                "items":[
                                    {
                                        "key":"customer.enterpriseBureauDetails[].specialMentionAccount",
                                        "title":"Special Mention Accounts"
                                    },
                                    {
                                        "key":"customer.enterpriseBureauDetails[].standard",
                                        "title":"Standard Accounts"
                                    },
                                    {
                                        "key":"customer.enterpriseBureauDetails[].subStandard",
                                        "title":"Sub-Standard Accounts"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type":"box",
                "colClass":"col-sm-12",
                "readonly":true,
                "title":"Proxy Indicators",
                "items":[
                    {
                        "type":"grid",
                        "orientation":"vertical",
                        "items":[
                            {
                                "key":"",
                                "title":"Proxy Indicator Score"
                            },
                            {
                                "type":"expandablesection",
                                "expanded":"false",
                                "title":"click to view details",
                                "items":[
                                    {
                                        "type":"grid",
                                        "orientation":"horizontal",
                                        "items":[
                                            {
                                                "type":"grid",
                                                "orientation":"vertical",
                                                "items":[
                                                    {
                                                        "key":"customer.properAndMatchingSignboard",
                                                        "title":"Proper Matching SignBoard"
                                                    },
                                                    {
                                                        "key":"customer.bribeOffered",
                                                        "title":"Bribe Offered"
                                                    },
                                                    {
                                                        "key":"customer.shopOrganized",
                                                        "title":"ShopShed Organized"
                                                    },
                                                    {
                                                        "key":"customer.isIndustrialArea",
                                                        "title":"In Industrial Area"
                                                    },
                                                    {
                                                        "key":"customer.customerAttitudeToKinara",
                                                        "title":"Customer Attitude to Kinara"
                                                    },
                                                    {
                                                        "key":"customer.bookKeepingQuality",
                                                        "title":"Book Keeping Quality"
                                                    },
                                                    {
                                                        "key":"customer.challengingChequeBounce",
                                                        "title":"Challenging Cheque"
                                                    },
                                                    {
                                                        "key":"customer.allMachinesAreOperational",
                                                        "title":"All Machine Operational"
                                                    },
                                                    {
                                                        "key":"customer.employeeSatisfaction",
                                                        "title":"Employee Satisfaction"
                                                    },
                                                    {
                                                        "key":"customer.politicalOrPoliceConnections",
                                                        "title":"Political Police Connection"
                                                    }
                                                ]
                                            },
                                            {
                                                "type":"grid",
                                                "orientation":"vertical",
                                                "items":[
                                                    {
                                                        "key":"customer.multipleProducts",
                                                        "title":"Multiple Products (More then 3)"
                                                    },
                                                    {
                                                        "key":"customer.multipleBuyers",
                                                        "title":"Multiple Buyers (More then 3)"
                                                    },
                                                    {
                                                        "key":"customer.seasonalBusiness",
                                                        "title":"Seasonal Business"
                                                    },
                                                    {
                                                        "key":"customer.incomeStability",
                                                        "title":"Income Stability"
                                                    },
                                                    {
                                                        "key":"customer.utilisationOfBusinessPremises",
                                                        "title":"Utilization of Business Premises"
                                                    },
                                                    {
                                                        "key":"customer.approachForTheBusinessPremises",
                                                        "title":"Approach for the Business Premises"
                                                    },
                                                    {
                                                        "key":"customer.safetyMeasuresForEmployees",
                                                        "title":"Safety measures for the Employees"
                                                    },
                                                    {
                                                        "key":"customer.childLabours",
                                                        "title":"Child Labourers"
                                                    },
                                                    {
                                                        "key":"customer.isBusinessEffectingTheEnvironment",
                                                        "title":"Is the Business affecting Environment"
                                                    },
                                                    {
                                                        "key":"customer.stockMaterialManagement",
                                                        "title":"Stock Material Management"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]

            },
            {
                "type":"box",
                "colClass":"col-sm-12",
                "readonly":true,
                "title":"Refrrence Check",
                "items":[
                    {
                        "type":"grid",
                        "orientation":"vertical",
                        "items":[
                            {
                                "type":"grid",
                                "orientation":"horizontal",
                                "items":[
                                    {
                                        "type":"grid",
                                        "orientation":"vertical",
                                        "items":[
                                            {
                                                "key":"",
                                                "title":"Reference Check Responses"
                                            }
                                        ]
                                    },
                                ]
                            },
                            {
                                "type":"expandablesection",
                                "expanded":"false",
                                "title":"click to view details",
                                "items":[
                                    {
                                        "type":"grid",
                                        "orientation":"vertical",
                                        "items":[
                                            {
                                                "type": "tableview",
                                                "key": "customer.verifications",
                                                "title": "",
                                                "selectable": false,
                                                "editable": false,
                                                "tableConfig": 
                                                    {
                                                        "searching": false,
                                                        "paginate": false,
                                                        "pageLength": 10,
                                                    },
                                                getColumns: function(){
                                                    return [{
                                                            "title": "Referance Type",
                                                            "data": "relationship"
                                                        },
                                                        {
                                                            "title": "Business Name",
                                                            "data": "businessName"
                                                        },
                                                        {
                                                            "title": "Contact Person Name",
                                                            "data": "referenceFirstName"
                                                        },
                                                        {
                                                            "title": "Contact Number",
                                                            "data": "mobileNo",
                                                        },
                                                        {
                                                            "title":"Address",
                                                            "data":"address"
                                                        }
                                                    ];
                                                },
                                                getActions: function() {
                                                    return [];
                                                }
                                            },
                                            {
                                                "type": "tableview",
                                                "key": "customer.verifications",
                                                "title": "Reference Check",
                                                "selectable": false,
                                                "editable": false,
                                                "tableConfig": 
                                                    {
                                                        "searching": false,
                                                        "paginate": false,
                                                        "pageLength": 10,
                                                    },
                                                getColumns: function(){
                                                    return [{
                                                            "title": "How long have you know the Applicant(years)?",
                                                            "data": "knownSince"
                                                        },
                                                        {
                                                            "title": "Payment Terms",
                                                            "data": "paymentTerms"
                                                        },
                                                        {
                                                            "title": "Payment Mode",
                                                            "data": "modeOfPayment"
                                                        },
                                                        {
                                                            "title": "Customer Response",
                                                            "data": "customerResponse",
                                                        }
                                                    ];
                                                },
                                                getActions: function() {
                                                    return [];
                                                }  
                                            }
                                        ]

                                    }
                                ]
                            }
                        ]
                    }
                ]

            },
            {
                "type":"box",
                "colClass":"col-sm-12",
                "title":"View Uploads",
                "items":[
                    {

                    }
                ]
            }
        ],
        schema: function() {
            return Enrollment.getSchema().$promise;     
        },
        actions: {}
    }
}
})