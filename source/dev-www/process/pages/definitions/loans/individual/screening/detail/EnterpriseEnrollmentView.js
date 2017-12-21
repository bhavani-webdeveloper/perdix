define({
    pageUID: "loans.individual.screening.detail.EnterpriseEnrollmentView",
    pageType: "Engine",
    dependencies: ["$log", "$state", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage", "$stateParams", "$state",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "Dedupe", "$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Model_ELEM_FC", "filterFilter", "irfCurrencyFilter"
    ],
    $pageFn: function($log, $state, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage, $stateParams, $state,
        PageHelper, Utils, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, Dedupe, $resource, $httpParamSerializer, BASE_URL, searchResource, Model_ELEM_FC, filterFilter, irfCurrencyFilter) {
        return {
            "type": "schema-form",
            "title": "ENTERPRISE_ENROLLMENT_VIEW",
            "subTitle": "",
            initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                model.bundleModel = bundleModel;
                model.loanAccount = bundleModel.loanAccount;
                var self = this;
                Enrollment.getCustomerById({
                    id: model.customerId
                }).$promise.then(function(res) {
                    model.customer = res;
                    BundleManager.pushEvent('business', model._bundlePageObj, model.customer);

                    /*Address*/
                   /* var s1 = model.customer.doorNo;
                    var s2 = model.customer.street;
                    var s3 = model.customer.pincode;
                    var s4 = model.customer.district;
                    var s5 = model.customer.state;
                    model.business_address_html = (s1 == null ? "" : s1).concat('\n', (s2 == null ? "" : s2), '\n', (s3 == null ? "" : s3), '\n ', (s4 == null ? "" : s4), ' \n', (s5 == null ? "" : s5));
*/
                    /*CBREPORT*/

                    if (_.isArray(model.customer.enterpriseBureauDetails) && model.customer.enterpriseBureauDetails.length) {
                        model.CB_REPORT_DATA = {
                            "bureau": model.customer.enterpriseBureauDetails[0].bureau,
                            "doubtful": model.customer.enterpriseBureauDetails[0].doubtful,
                            "loss": model.customer.enterpriseBureauDetails[0].loss,
                            "fileId": model.customer.enterpriseBureauDetails[0].fileId,
                            "specialMentionAccount": model.customer.enterpriseBureauDetails[0].specialMentionAccount,
                            "standard": model.customer.enterpriseBureauDetails[0].standard,
                            "subStandard": model.customer.enterpriseBureauDetails[0].subStandard
                        }
                    }
                    /* Machin Details*/

                    model.machine_count = model.customer.fixedAssetsMachinaries.length;
                    model.totalValue = 0;/*
                    model.proxyScore = model.psi;*/
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
                });


                /*View_upload data*/



                if (self.form[self.form.length - 1].title != "VIEW_UPLOADS") {
                    var fileForms = [];
                    for (i in model.loanAccount.loanDocuments) {
                        fileForms.push({
                            "key": "loanAccount.loanDocuments[" + i + "].documentId",
                            "notitle": true,
                            "title": model.loanAccount.loanDocuments[i].document,
                            "category": "Loan",
                            "subCategory": "DOC1",
                            "type": "file",
                            "preview": "pdf"
                        });
                    }
                    self.form.push({
                        "type": "box",
                        "colClass": "col-sm-12",
                        "readonly": true,
                        "overrideType": "default-view",
                        "title": "VIEW_UPLOADS",
                        "condition": "model.loanAccount.loanDocuments.length != 0",
                        "items": [{
                            "type": "section",
                            "html": '<div style="overflow-x:scroll"><div style="width:10000px"><div ng-repeat="item in form.items" style="display: inline-block; text-align: center; width: 180px;"><div style="margin-top: -10px; margin-right: 8px;"><sf-decorator form="item"></sf-decorator>{{item.title}}</div></div></div></div>',
                            "items": fileForms
                        }]
                    });
                }


            },
            form: [{
                "type": "box",
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "title": "Basic Business Information",
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
                "title": "Contact Information",
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
                            "type":"section",
                            "html": '<div ng-repeat="item in form.items" >{{item.title}}<div style="margin-top:-20px; padding-left:100px; font-weight:bold;"><sf-decorator  form="item"></sf-decorator><div></div>',
                            "items": [{
                            "type": "section",
                            "htmlClass": "col-sm-12",
                            "title": "Present Address",
                            "html": '{{model.customer.doorNo==null? "": model.customer.doorNo.concat(",")}}' +'<br>'+
                                '{{model.customer.street==null? "": model.customer.street.concat(",")}}' +'<br>'+
                                '{{model.customer.district==null? "": model.customer.district.concat(",")}}'+'<br>'+
                                '{{model.customer.state==null? "": model.customer.state.concat(",")}}'+'<br>'+
                                '{{model.customer.pincode==null? "": model.customer.pincode}}'+'<br>'+
                                ''

                            }]
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
                "title": "Registration Details",
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

                            render: function(data, type, full, meta) {
                                var url = Model_ELEM_FC.fileStreamUrl + "/" + full.documentId;
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
                "title": "Employee Details",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "customer.enterprise.noOfFemaleEmployees",
                            "title": "No. of Male Employees",
                            "type": "number"
                        }, {
                            "key": "customer.enterprise.noOfMaleEmployees",
                            "title": "No. of Female Employees",
                            "type": "number"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "customer.enterprise.avgMonthlySalary",
                            "title": "Average Monthly Salary",
                            "type": "amount"
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
                            "title": "Total no. of machinery",
                            "type": "number"
                        }, {
                            "key": "totalValue",
                            "title": "Total value of machinery",
                            "type": "amount"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "hypothecatedToKinara",
                            "title": "No. of machinery hypothecated to Kinara",
                            "type": "number"
                        }, {
                            "key": "totalHypothecatedValue",
                            "title": "Value of machinery hypothecated to Kinara",
                            "type": "amount"
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
                            "pageLength": 10
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
                                "data": "purchasePrice",
                                render: function(data, type, full, meta) {
                                                return irfCurrencyFilter(data);
                                            }
                                            
                            }, {
                                "title": "Present Value",
                                "data": "presentValue",
                                render: function(data, type, full, meta) {
                                                return irfCurrencyFilter(data);
                                            }
                            }, {
                                "title": "Source",
                                "data": "fundingSource"
                            }, {
                                "title": "Hypothecated to",
                                "data": "hypothecatedTo"
                            }];
                        },
                        getActions: function() {
                            return [];
                        }
                    }, {
                        "type": "section",
                        "title": "Machine Photos",
                        "html": '<div style="overflow-x:scroll"><div style="width:10000px"><div ng-repeat="item in form.items" style="display:inline-block;text-align:center"><sf-decorator form="item"></sf-decorator>{{item.title}}</div></div></div>',
                        "items": [{

                            "key": "customer.fixedAssetsMachinaries[0].machineImage",
                            "notitle": true,
                            /*
                                                        "title":model.customer.fixedAssetsMachinaries[0].machineType,*/
                            "category": "Loan",
                            "subCategory": "DOC1",
                            "type": "file",
                            "fileType": "image/*",
                            "using": "scanner"
                        }, {

                            "key": "customer.fixedAssetsMachinaries[1].machineImage",
                            "notitle": true,
                            /*
                                                        "title":"customer.fixedAssetsMachinaries[1].machineType",*/
                            "category": "Loan",
                            "subCategory": "DOC1",
                            "type": "file",
                            "fileType": "image/*",
                            "using": "scanner"
                        }, {

                            "key": "customer.fixedAssetsMachinaries[2].machineImage",
                            "notitle": true,
                            /*
                                                        "title":"customer.fixedAssetsMachinaries[2].machineType",*/
                            "category": "Loan",
                            "subCategory": "DOC1",
                            "type": "file",
                            "fileType": "image/*",
                            "using": "scanner"
                        }]


                    }, {
                        "type": "section",
                        "title": "Machine Bills",
                        "condition": "model.customer.fixedAssetsMachinaries[0].machineBillsDocId !=null",
                        "html": '<div style="overflow-x:scroll"><div style="width:10000px"><div ng-repeat="item in form.items" style="display:inline-block;text-align:center"><sf-decorator form="item"></sf-decorator>{{item.title}}</div></div></div>',
                        "items": [{
                            "key": "customer.fixedAssetsMachinaries[0].machineBillsDocId",
                            /*
                                                        "title": "customer.fixedAssetsMachinaries[0].machineType",
                                                        "notitle":true,*/
                            "category": "Loan",
                            "subCategory": "DOC1",
                            "preview": "pdf",
                            "using": "scanner"
                        }, {
                            "key": "customer.fixedAssetsMachinaries[1].machineBillsDocId",
                            /*
                                                        "title":"customer.fixedAssetsMachinaries[1].machineType",*/
                            "notitle": true,
                            "category": "Loan",
                            "subCategory": "DOC1",
                            "preview": "pdf",
                            "using": "scanner"
                        }, {
                            "key": "model.customer.fixedAssetsMachinaries[2].machineBillsDocId",
                            /*
                                                        "title": "customer.fixedAssetsMachinaries[2].machineType",*/
                            "notitle": true,
                            "category": "Loan",
                            "subCategory": "DOC1",
                            "preview": "pdf",
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
                            "title": "Doubtful Account",
                            "type": "number"
                        }, {
                            "key": "CB_REPORT_DATA.loss",
                            "title": "Loss Accounts",
                            "type": "number"
                        }, {
                            "type":"section",
                            "html": '<div ng-repeat="item in form.items" >{{item.title}}<div style="margin-top:-25px; padding-left:100px;"><sf-decorator  form="item"></sf-decorator><div></div>',
                            "items": [{
                            "key": "CB_REPORT_DATA.fileId",
                            "notitle": true,
                            "title": "CB Report",
                            "category": "Loan",
                            "subCategory": "DOC1",
                            "type":"file",
                            "fileType":"application/pdf",
                            "using": "scanner"
                        }]
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "CB_REPORT_DATA.specialMentionAccount",
                            "title": "Special Mention Accounts",
                            "type": "number"
                        }, {
                            "key": "CB_REPORT_DATA.standard",
                            "title": "Standard Accounts",
                            "type": "number"
                        }, {
                            "key": "CB_REPORT_DATA.subStandard",
                            "title": "Sub-Standard Accounts",
                            "type": "number"
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
                    "type": "section",
                    "htmlClass":"col-sm-12",
                    "html": '<div style="display: table;"><div style="font-weight: bold; display: table-cell;">Proxy Indicator Score</div><div style="display: table-cell; padding-left: 40px;">{{(model.proxyScore==null || model.proxyScore==undefined) ?"-Proxy Waiting For Summary-": model.proxyScore["Actual Value"].concat("/",model.proxyScore["ParameterScore"])}}</p></div>'
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
                "financial-summary": function(bundleModel, model, params) {
                    model.proxyScore = {};
                    model.proxyScore = params[2].data[5];
                }
            },
            actions: {}
        };
    }
})