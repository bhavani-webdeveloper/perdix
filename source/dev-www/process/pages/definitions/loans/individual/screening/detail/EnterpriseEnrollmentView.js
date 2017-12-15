define({
    pageUID: "loans.individual.screening.detail.EnterpriseEnrollmentView",
    pageType: "Engine",
    dependencies: ["$log", "$state", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage", "$stateParams", "$state",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "Dedupe", "$resource", "$httpParamSerializer", "BASE_URL", "searchResource"
    ],
    $pageFn: function($log, $state, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage, $stateParams, $state,
        PageHelper, Utils, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, Dedupe, $resource, $httpParamSerializer, BASE_URL, searchResource) {
        return {
            "type": "schema-form",
            "title": "ENTERPRISE_ENROLLMENT_VIEW",
            "subTitle": "",
            initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                var self = this;

                model.bundleModel = bundleModel;
                Enrollment.getCustomerById({
                    id: model.customerId
                }).$promise.then(function(res) {
                    model.customer = res;
                    BundleManager.pushEvent('rel_to_business', model._bundlePageObj, model.customer);

                    /*Address*/
                    model.business_address_html = model.customer.doorNo.concat('\n', model.customer.street, '\n', model.customer.pincode, '\n ', model.customer.district, ' \n', model.customer.state);
                    
                    /*CBREPORT*/

                model.CB_REPORT_DATA={
                    "bureau":model.customer.enterpriseBureauDetails[0].bureau,
                    "doubtful":model.customer.enterpriseBureauDetails[0].doubtful,
                    "loss":model.customer.enterpriseBureauDetails[0].loss,
                    "fileId":model.customer.enterpriseBureauDetails[0].fileId,
                    "specialMentionAccount":model.customer.enterpriseBureauDetails[0].specialMentionAccount,
                    "standard":model.customer.enterpriseBureauDetails[0].standard,
                    "subStandard":model.customer.enterpriseBureauDetails[0].subStandard
                }
                    /* Machin Details*/

                    model.machine_count = model.customer.fixedAssetsMachinaries.length;
                    model.totalValue = 0;
                    model.proxyScore = model.psi;
                    model.hypothecatedToKinara = 0;
                    model.totalHypothecatedValue = 0;
                    _.each(model.customer.fixedAssetsMachinaries, function(machine) {
                        model.totalValue += machine.presentValue;
                        if (machine.hypothecatedToUs == 'YES') {
                            model.hypothecatedToKinara++;
                            model.totalHypothecatedValue += machine.presentValue;

                        }
                    });
                    model.REFERENCE_CHECK_RESPONSE = 'NA';
                    var count_neg_response = 0;
                    _.each(model.customer.verifications, function(verification) {
                        if (verification.customerResponse == 'negative' && verification.customerResponse != null) {
                            count_neg_response++;
                        }
                    })
                    if (count_neg_response >= 1) {
                        model.REFERENCE_CHECK_RESPONSE = 'negative';
                    } else {
                        model.REFERENCE_CHECK_RESPONSE = 'positive';
                    }


                    model.businessName = model.customer.verifications[0].businessName;


                    if (self.form[self.form.length - 1].title != "VIEW_UPLOADS") {
                        var fileForms = [{
                            "key": "customer.rawMaterialExpenses[].invoiceDocId",
                            "notitle": true,
                            "category": "Loan",
                            "subCategory": "DOC1",
                            "type": "file",
                            "preview": "pdf",
                            "using": "scanner"
                        }, {
                            "key": "customer.rawMaterialExpenses[].invoiceDocId",
                            "notitle": true,
                            "category": "Loan",
                            "subCategory": "DOC1",
                            "type": "file",
                            "preview": "pdf",
                            "using": "scanner"
                        }];
                        //
                        self.form.push({
                            "type": "box",
                            "colClass": "col-sm-12",
                            "readonly": true,
                            "overrideType": "default-view",
                            /*
                                                        "htmlClass":"width:100% overflow:scroll",*/
                            "title": "VIEW_UPLOADS",
                            "items": [{
                                "type": "section",
                                "htmlClass": "inline",
                                "html": '<div style="display:inline; overflow-x:scroll;"><sf-decorator style="float:left" ng-repeat="item in form.items" form="item"></sf-decorator></div>',
                                "items": fileForms
                            }]
                        });
                    }
                });
            },
            form: [{
                "type": "box",
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "title": "BASIC_BUSINESS_INFORMATION",
                "readonly": true,
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "customer.enterprise.id",
                            "title": "Entity ID"
                        }, {
                            "key": "businessName",
                            "title": "Company Name"
                        }, {
                            "key": "customer.enterprise.businessType",
                            "title": "Business Type"
                        }, {
                            "key": "customer.enterprise.businessActivity",
                            "title": "Business Activity"
                        }, {
                            "key": "customer.enterprise.businessSector",
                            "title": "Business Sector"
                        }, {
                            "key": "customer.enterprise.businessSubsector",
                            "title": "Business Subsector"
                        }, {
                            "key": "customer.enterprise.referredBy",
                            "title": "Sourced by"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "customer.urnNo",
                            "title": "URN"
                        }, {
                            "key": "customer.enterprise.businessConstitution",
                            "title": "Constitution"
                        }, {
                            "key": "customer.enterprise.businessHistory",
                            "title": "Business History"
                        }, {
                            "key": "customer.enterprise.ownership",
                            "title": "Premises Ownership"
                        }, {
                            "key": "customer.enterprise.businessInPresentAreaSince",
                            "title": "Operating Since"
                        }, {
                            "key": "customer.enterprise.anyPartnerOfPresentBusiness",
                            "title": "Has anyone else been a partner of your present business ?"
                        }]

                    }]
                }]
            }, {
                "type": "box",
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "title": "CONTACT_INFO",
                "readonly": true,
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "customer.mobilePhone",
                            "title": "Mobile Phone"
                        }, {
                            "key": "customer.landLineNo",
                            "title": "Phone 2"
                        }, {
                            "key": "customer.distanceFromBranch",
                            "title": "Distance From Hub"
                        }, {
                            "key": "customer.enterprise.businessInPresentAreaSince",
                            "title": "YEARS_OF_BUSINESS_PRESENT_AREA"
                        }, {
                            "key": "customer.enterprise.businessInCurrentAddressSince",
                            "title": "YEARS_OF_BUSINESS_PRESENT_ADDRESS"
                        },{
                            "key":"business_address_html",
                            "title":"Address of Business"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "type": "section",
                            "html": '<div style="float:right"></div>',
                            "items": [{
                                "key": "customer.latitude",
                                "notitle": true,
                                "type": "geotag",
                                "latitude": "customer.latitude",
                                "longitude": "customer.longitude"
                            }]
                        }]
                    }]
                }]
            }, {
                "type": "box",
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "title": "Registration Detials",
                "readonly": true,
                "items": [{
                    "type": "tableview",
                    "key": "customer.enterpriseRegistrations",
                    "title": "",
                    "transpose": true,
                    "selectable": false,
                    "editable": false,
                    "tableConfig": {
                        "searching": false,
                        "paginate": false,
                        "pageLength": 10,
                    },
                    getColumns: function() {
                        return [{
                            "title": "Registration Type",
                            "data": "registrationType"
                        }, {
                            "title": "Registration Number",
                            "data": "registrationNumber"

                        }, {
                            "title": "Registered Date",
                            "data": "registeredDate"
                        }, {
                            "title": "Registration Validity",
                            "data": "expiryDate",
                        }, {
                            "title": "Registration Document",
                            "data": "documentId",
                            /*"type":"file",
                            "required": true,
                            "category":"CustomerEnrollment",
                            "subCategory":"REGISTRATIONDOCUMENT",
                            "fileType":"application/pdf",
                            "using": "scanner"*/

                            render: function(data, type, full, meta) {
                                var url = irf.BASE_URL + "/" + full.documentId;
                                return '<a href="' + url + '">Download</a>'
                            }



                        }];
                    },
                    getActions: function() {
                        return [];
                    }
                }]
            }, {
                "type": "box",
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "readonly": true,
                "title": "EMPLOYEE_DETAILS",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "customer.enterprise.noOfFemaleEmployees",
                            "title": "No Of Male Employees"
                        }, {
                            "key": "customer.enterprise.noOfMaleEmployees",
                            "title": "No. of Female Employees"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "customer.enterprise.avgMonthlySalary",
                            "title": "Average Monthly Salary"
                        }]
                    }]
                }]
            }, {
                "type": "box",
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "readonly": true,
                "title": "Machinery/Stocks/Non-Machinery Asset Detials",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "machine_count",
                            "title": "Total no. of machinery"
                        }, {
                            "key": "totalValue",
                            "title": "Total value of machinery"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "hypothecatedToKinara",
                            "title": "No. of machinery hypothecated to Kinara"
                        }, {
                            "key": "totalHypothecatedValue",
                            "title": "Value of machinery hypothecated to Kinara"
                        }]
                    }]
                }, {
                    "type": "expandablesection",
                    "items": [{
                        "type": "tableview",
                        "key": "customer.fixedAssetsMachinaries",
                        "title": "",
                        "selectable": false,
                        "editable": false,
                        "tableConfig": {
                            "searching": false,
                            "paginate": false,
                            "pageLength": 10,
                        },
                        getColumns: function() {
                            return [{
                                "title": "Machine Type",
                                "data": "machineType"
                            }, {
                                "title": "Manufacturer",
                                "data": "manufacturerName"
                            }, {
                                "title": "Model No.",
                                "data": "machineModel",
                            }, {
                                "title": "Purchase Year",
                                "data": "machinePurchasedYear"
                            }, {
                                "title": "New/Old",
                                "data": "isTheMachineNew",
                                render: function(data, type, full, meta) {
                                    if (full.isTheMachineNew == 'YES')
                                        return 'NEW';
                                    return 'OLD'
                                }
                            }, {
                                "title": "Purchase Price",
                                "data": "purchasePrice"
                            }, {
                                "title": "Present Value",
                                "data": "presentValue"
                            }, {
                                "title": "Source",
                                "data": "fundingSource"
                            },{
                                "title":"Hypothecated to",
                                "data":"hypothecatedTo"
                            }];
                        },
                        getActions: function() {
                            return [];
                        }
                    }, {
                            "type": "section",
                            "title":"Machine Photos",
                            "html": '<div style="overflow-x:scroll"><sf-decorator style="float:left" ng-repeat="item in form.items" form="item"></sf-decorator></div>',
                            "items": [{
                                    "key": "machineDocs[0].machineImage",
                                    "notitle": true,
                                    "category": "Loan",
                                    "subCategory": "DOC1",
                                    "type": "file",
                                    "fileType": "image/*",
                                    "using": "scanner"
                                }, {
                                    "key": "machineDocs[1].machineImage",
                                    "notitle": true,
                                    "category": "Loan",
                                    "subCategory": "DOC1",
                                    "type": "file",
                                    "fileType": "image/*",
                                    "using": "scanner"
                                }, {
                                    "key": "machineDocs[2].machineImage",
                                    "notitle": true,
                                    "category": "Loan",
                                    "subCategory": "DOC1",
                                    "type": "file",
                                    "fileType": "image/*",
                                    "using": "scanner"
                                }]
                        },{
                            "type": "section",
                            "title":"Machine Bills",
                            "html": '<div style="overflow-x:scroll"><sf-decorator style="float:left" ng-repeat="item in form.items" form="item"></sf-decorator></div>',
                            "items": [{
                                    "key": "machineDocs[0].machineBillsDocId",
                                    "notitle": true,
                                    "category": "Loan",
                                    "subCategory": "DOC1",
                                    //"type": "file",
                                    /*"fileType": "image/*",*/
                                    "preview":"pdf",
                                    "using": "scanner"
                                }, {
                                    "key": "machineDocs[1].machineBillsDocId",
                                    "notitle": true,
                                    "category": "Loan",
                                    "subCategory": "DOC1",
                                    /*"type": "file",
                                    "fileType": "image/*",*/
                                    "preview":"pdf",
                                    "using": "scanner"
                                }, {
                                    "key": "machineDocs[2].machineBillsDocId",
                                    "notitle": true,
                                    "category": "Loan",
                                    "subCategory": "DOC1",
                                    /*"type": "file",
                                    "fileType": "image/*",*/
                                    "preview":"pdf",
                                    "using": "scanner"
                                }]
                        }]
                }]
            }, {
                "type": "box",
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "readonly": true,
                "title": "COMMERCIAL CIBIL",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "CB_REPORT_DATA.bureau",
                            "title": "Bureau"
                        }, {
                            "key": "CB_REPORT_DATA.doubtful",
                            "title": "Doubtful Account"
                        }, {
                            "key": "CB_REPORT_DATA.loss",
                            "title": "Loss Accounts"
                        },{
                            "key": "CB_REPORT_DATA.fileId",
                            "title": "CB Report",
                            "category": "Loan",
                            "subCategory": "DOC1",
                            "type": "file",
                            "preview": "pdf",
                            "using": "scanner"}]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "CB_REPORT_DATA.specialMentionAccount",
                            "title": "Special Mention Accounts"
                        }, {
                            "key": "CB_REPORT_DATA.standard",
                            "title": "Standard Accounts"
                        }, {
                            "key": "CB_REPORT_DATA.subStandard",
                            "title": "Sub-Standard Accounts"
                        }]
                    }]
                }]
            }, {
                "type": "box",
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "readonly": true,
                "title": "Proxy Indicators",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type":"grid",
                        "orientation":"vertical",
                        "items":[{
                        "key": "psi",
                        "title": "Proxy Indicator Score"
                    }]
                    }]
                }, {
                    "type": "expandablesection",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "customer.properAndMatchingSignboard",
                                "title": "Proper Matching SignBoard"
                            }, {
                                "key": "customer.bribeOffered",
                                "title": "Bribe Offered"
                            }, {
                                "key": "customer.shopOrganized",
                                "title": "Shop Shed Organized"
                            }, {
                                "key": "customer.isIndustrialArea",
                                "title": "In Industrial Area"
                            }, {
                                "key": "customer.customerAttitudeToKinara",
                                "title": "Customer Attitude To Kinara"
                            }, {
                                "key": "customer.bookKeepingQuality",
                                "title": "Book Keeping Quality"
                            }, {
                                "key": "customer.challengingChequeBounce",
                                "title": "Challenging Cheque Bounce/Fess Charge/Policies"
                            }, {
                                "key": "customer.allMachinesAreOperational",
                                "title": "All Machines Operational"
                            }, {
                                "key": "customer.employeeSatisfaction",
                                "title": "Employee Satisfaction"
                            }, {
                                "key": "customer.politicalOrPoliceConnections",
                                "title": "Political Police Connections"
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "customer.multipleProducts",
                                "title": "Multiple Products (more than 3)"
                            }, {
                                "key": "customer.multipleBuyers",
                                "title": "Multiple Buyers (more than 3)"
                            }, {
                                "key": "customer.seasonalBusiness",
                                "title": "Seasonal Business"
                            }, {
                                "key": "customer.incomeStability",
                                "title": "Income Stability"
                            }, {
                                "key": "customer.utilisationOfBusinessPremises",
                                "title": "Utilization Of Business Premises"
                            }, {
                                "key": "customer.approachForTheBusinessPremises",
                                "title": "Approach For The Business Premises"
                            }, {
                                "key": "customer.safetyMeasuresForEmployees",
                                "title": "Safety Measures For Employees"
                            }, {
                                "key": "customer.childLabours",
                                "title": "Child Labourers"
                            }, {
                                "key": "customer.isBusinessEffectingTheEnvironment",
                                "title": "Is the Business Effecting Environment"
                            }, {
                                "key": "customer.stockMaterialManagement",
                                "title": "Stock Material Management"
                            }]
                        }]
                    }]
                }]

            }, {
                "type": "box",
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "readonly": true,
                "title": "Reference Check",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "REFERENCE_CHECK_RESPONSE",
                            "title": "Reference Check Responses"
                        }]
                    }],
                }, {
                    "type": "expandablesection",
                    "items": [{
                        "type": "tableview",
                        "key": "customer.verifications",
                        "title": "",
                        "selectable": false,
                        "transpose": true,
                        "editable": false,
                        "tableConfig": {
                            "searching": false,
                            "paginate": false,
                            "pageLength": 10,
                        },
                        getColumns: function() {
                            return [{
                                "title": "REFERENCE_TYPE",
                                "data": "relationship"
                            }, {
                                "title": "Business Name",
                                "data": "businessName"
                            }, {
                                "title": "Contact Person Name",
                                "data": "referenceFirstName"
                            }, {
                                "title": "Contact Number",
                                "data": "mobileNo",
                            }, {
                                "title": "Address",
                                "data": "address"
                            }];
                        },
                        getActions: function() {
                            return [];
                        }
                    }, {
                        "type": "tableview",
                        "key": "customer.verifications",
                        "title": "Reference Check",
                        "selectable": false,
                        "transpose": true,
                        "editable": false,
                        "tableConfig": {
                            "searching": false,
                            "paginate": false,
                            "pageLength": 10,
                        },
                        getColumns: function() {
                            return [{
                                "title": "How long have you know the Applicant(years)?",
                                "data": "knownSince"
                            }, {
                                "title": "Payment Terms",
                                "data": "paymentTerms"
                            }, {
                                "title": "Mode of Payment",
                                "data": "modeOfPayment"
                            }, {
                                "title": "Customer Response",
                                "data": "customerResponse",
                            }];
                        },
                        getActions: function() {
                            return [];
                        }
                    }]
                }]
            }],
            schema: function() {
                return Enrollment.getSchema().$promise;
            },
            eventListeners: {
                "_machineImages": function(bundleModel, model, params) {
                    model.machineDocs = params.fixedAssetsMachinaries;


                    /*={
                        img_arr:[],
                        mach_bills:[]
                    }*/

                    /* for(i=0;i<params.fixedAssetsMachinaries.length;i++){
                        if(params.fixedAssetsMachinaries[i].machineImage!=null)
                       // machineDocs.img_arr.push(irf.BASE_URL + "/" + params.fixedAssetsMachinaries[i].machineImage);
                        model.machineDocs.img_arr.push(params.fixedAssetsMachinaries[i].machineImage);
                        if(params.fixedAssetsMachinaries[i].machineBillsDocId!=null)
                        //machineDocs.mach_bills.push(irf.BASE_URL + "/" + params.fixedAssetsMachinaries[i].machineBillsDocId)
                    model.machineDocs.mach_bills.push(params.fixedAssetsMachinaries[i].machineBillsDocId)
                    
                    }
*/
                },
                "_scoresApplicant": function(bundleModel, model, params) {
                    var psi={};
                    psi=params[2].data[5];
                    model.psi=psi['Actual Value']/psi.ParameterScore
                }
            },
            actions: {}
        }
    }
})