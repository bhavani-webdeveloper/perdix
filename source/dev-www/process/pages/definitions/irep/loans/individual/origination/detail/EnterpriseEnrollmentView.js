define({
    pageUID: "irep.loans.individual.origination.detail.EnterpriseEnrollmentView",
    pageType: "Engine",
    dependencies: ["$log", "$state", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage", "$stateParams", "$state",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "Dedupe", "$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Model_ELEM_FC", "filterFilter", "irfCurrencyFilter", "$filter"
    ],
    $pageFn: function($log, $state, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage, $stateParams, $state,
        PageHelper, Utils, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, Dedupe, $resource, $httpParamSerializer, BASE_URL, searchResource, Model_ELEM_FC, filterFilter, irfCurrencyFilter, $filter) {
        return {
            "type": "schema-form",
            "title": "ENTERPRISE_ENROLLMENT_VIEW",
            "subTitle": "",
            initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                model.bundleModel = bundleModel;
                model.loanAccount = bundleModel.loanAccount;

                model.loanCustomerRelation = {};
                model.loanCustomerRel = []
                Queries.getLoanCustomerDetails(model.bundleModel.loanId).then(function(res) {
                    model.loanCustomerRelation = res;
                    //model.loanCustomerRel.push(res.applicant);
                    _.each(model.loanCustomerRelation.coApplicants, function(coApp) {
                        model.loanCustomerRel.push(coApp);
                    })
                    _.each(model.loanCustomerRelation.guarantors, function(guarantor) {
                        model.loanCustomerRel.push(guarantor);
                    })

                }, function(e) {
                    $log.info(e)
                });



                var self = this;
                Enrollment.getCustomerById({
                    id: model.customerId
                }).$promise.then(function(res) {
                    model.customer = res;
                    BundleManager.pushEvent('business', model.bundleModel, model.customer);

                    model.customer.presetAddress = [
                        model.customer.doorNo,
                        model.customer.street,
                        model.customer.district,
                        model.customer.state
                    ].filter(a => a).join(', ') + ' - ' + model.customer.pincode;



                    /*machine pics */
                    var machineDocs = _.filter(self.form, {
                        title: "Machinery/Stocks/Non-Machinery Asset Details"
                    });
                    var machineData = [];
                    var machineBills = [];
                    for (i in model.customer.fixedAssetsMachinaries) {
                        machineData.push({
                            "key": "customer.fixedAssetsMachinaries[" + i + "].machineImage",
                            "notitle": true,
                            "title": model.customer.fixedAssetsMachinaries[i].machineType,
                            "category": "Loan",
                            "subCategory": "DOC1",
                            "type": "file",
                            "preview": "pdf",
                            "using": "scanner"
                        });

                        machineBills.push({
                            "key": "customer.fixedAssetsMachinaries[" + i + "].machineBillsDocId",
                            "title": model.customer.fixedAssetsMachinaries[i].machineType,
                            "notitle": true,
                            "category": "Loan",
                            "subCategory": "DOC1",
                            "type": "file",
                            "preview": "pdf",
                            "using": "scanner"
                        })

                    }
                    var machinaPhotosData = {
                        "type": "section",
                        "title": "Machine Photos",
                        "condition": "machineData.length!=0",
                        "html": '<div style="overflow-x:scroll"><div style="width:10000px"><div ng-repeat="item in form.items" style="display:inline-block;text-align:center"><sf-decorator form="item"></sf-decorator>{{item.title}}</div></div></div>',
                        "items": machineData
                    };

                    var MachineBillData = {
                        "type": "section",
                        "title": "Machine Bills",
                        "condition": "MachineBillData.length!=0",
                        "condition": "model.customer.fixedAssetsMachinaries[0].machineBillsDocId !=null",
                        "html": '<div style="overflow-x:scroll"><div style="width:10000px"><div ng-repeat="item in form.items" style="display:inline-block;text-align:center"><sf-decorator form="item"></sf-decorator>{{item.title}}</div></div></div>',
                        "items": machineBills

                    }


                    machineDocs[0].items[1].items.push(machinaPhotosData);
                    machineDocs[0].items[1].items.push(MachineBillData);



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
                    model.totalValue = 0;
                    /*
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

                    /*model.REFERENCE_CHECK_RESPONSE = 'NA';
                    var count_neg_response = "true";
                    _.each(model.customer.verifications, function(verification) {
                        if (verification.customerResponse!=undefined && verification.customerResponse.toLowerCase() == 'negative') {
                            return count_neg_response = "false";
                        }
                    })
                    if (count_neg_response == "false") {
                        model.REFERENCE_CHECK_RESPONSE = 'negative';
                    } else {
                        model.REFERENCE_CHECK_RESPONSE = 'positive';
                    }
*/
                    model.REFERENCE_CHECK_RESPONSE = 'NA';
                    var ref_flag = "true";
                    var countNull = 0;
                    _.each(model.customer.verifications, function(verification) {
                        if (verification.customerResponse == null) {
                            countNull++;
                        } else {
                            if (verification.customerResponse.toLowerCase() == 'negative') {
                                return ref_flag = "false";
                            }
                        }

                    })
                    if (ref_flag == "false") {
                        model.REFERENCE_CHECK_RESPONSE = 'Negative';
                    }
                    if (ref_flag == "true" && countNull != model.customer.verifications.length) {
                        model.REFERENCE_CHECK_RESPONSE = "Positive"
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
                      fileForms.push({
                            "key": "customer.businessSignboardImage",
                            "notitle": true,
                            "title": "Business Signboard",
                            "category": "Loan",
                            "subCategory": "DOC1",
                            "type": "file",
                            "preview": "pdf",
                            using: "scanner"
                        })
                    fileForms.push({
                        "key": "customer.latitude",
                        "notitle": true,
                        "title": $filter("translate")("BUSINESS_LOCATION"),
                        "type": "geotag",
                        "latitude": "customer.latitude",
                        "longitude": "customer.longitude"
                    })

                    self.form.push({
                        "type": "box",
                        "colClass": "col-sm-12",
                        "readonly": true,
                        "overrideType": "default-view",
                        "title": "VIEW_UPLOADS",/*
                        "condition": "model.loanAccount.loanDocuments.length != 0",*/
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
                            "key": "customer.id",
                            "title": "Entity ID"
                        }, {
                            "key": "customer.firstName",
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
                        }, {
                            "key": "customer.enterprise.isGSTAvailable",
                            "title": "GST Available"
                        }, {
                            "key": "customer.udf.userDefinedFieldValues.udf3",
                            "title": "ENTERPRISE_OPERATED_BY"
                        }, {
                            "key": "customer.udf.userDefinedFieldValues.udf2",
                            "title": "WHETHER_AUDITED"
                        },
                        {
                            "type": "expandablesection",
                            "items": [{
                                "type": "tableview",
                                "key": "enterpriseCustomerRelations",
                                "notitle": true,
                                "transpose": true,
                                "selectable": false,
                                "editable": false,
                                "tableConfig": {
                                    "searching": false,
                                    "paginate": false,
                                    "pageLength": 10,
                                },
                                getColumns: function() {
                                    return [ {
                                        "title": "Relationship Type",
                                        "data": "relationshipType",
                                        render: function(data, type, full, meta) {
                                            return full['Relationship Type']
                                        }
                                    }, {
                                        "title": "Customer ID",
                                        "data": "linkedToCustomerId",
                                        render: function(data, type, full, meta) {
                                            return irfCurrencyFilter(full['Customer ID'])
                                        }
                                    }, {
                                        "title": "Customer Name",
                                        "data": "linkedToCustomerName",
                                        render: function(data, type, full, meta) {
                                            return irfCurrencyFilter(full['Customer Name'])
                                        }
                                    }, {
                                        "data": "experienceInBusiness",
                                        "title": "Experience in Business",
                                        render: function(data, type, full, meta) {
                                            return irfCurrencyFilter(full['Experience in Business'])
                                        }
                                    }, {
                                        "title": "Business Involvement",
                                        "data": "businessInvolvement",
                                        render: function(data, type, full, meta) {
                                            return full['Business Involvement']
                                        }

                                    }, {
                                        "title": "Partner of Any Other Company",
                                        "data": "partnerOfAnyOtherCompany",
                                        render: function(data, type, full, meta) {
                                            return full['Partner of Any Other Company']
                                        }
                                    }];
                                },
                                getActions: function() {
                                    return [];
                                }
                            }]
                        }
                        ]
                    },
                    {
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
                            "key": "customer.udf.userDefinedDateFieldValues.udfDate1",
                            "title": "RENT_LEASE_AGREEMENT_VALID_TILL"
                        }, {
                            "key": "customer.udf.userDefinedFieldValues.udf1",
                            "title": "RENT_LEASE_STATUS"
                        },{
                            "key": "customer.enterprise.companyOperatingSince",
                            "title": "Operating Since"
                        }, {
                            "key": "customer.enterprise.anyPartnerOfPresentBusiness",
                            "title": "Has anyone else been a partner of your present business ?"
                        }, {
                            "key": "customer.udf.userDefinedDateFieldValues.udfDate2",
                            "title": "LAST_AVAIL_ITR"
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
                        }, {
                            "key": "customer.enterprise.companyEmailId",
                            "title": "Email ID"
                        }, {  
                            "type": "section",                                
                            "htmlClass": "row",
                            "items": [
                                {
                                    "type": "section",
                                    "htmlClass": "col-sm-4",
                                    "html": '<h5>' + "Present Address" + '</h5>'
                                },
                                {
                                    "type": "section",
                                    "htmlClass": "col-sm-8",
                                    "html": '<p style = "font-size: 14px; color: #555;"><strong>{{model.customer.doorNo}} <br />\
                                    {{model.customer.street}} <br />\
                                    {{model.customer.district}} <br />\
                                    {{model.customer.state}} <br /> \
                                    {{model.customer.pincode}} <br /> \
                                    <br /><strong></p>\
                                    '
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
                "readonly": true,
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "title": "HOUSEHOLD_LIABILITIES",
                "condition": "model.customer.liabilities.length !=0",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "active_accounts",
                            "title": "No of Active Loans",
                            "type": "number"
                        }, {
                            "key": "monthly_installment",
                            "title": "Total Monthly Instalments",
                            "type": "amount"
                        }, {
                            "key": "outstanding_bal",
                            "title": "OUTSTANDING_AMOUNT",
                            "type": "amount"
                        }]

                    }]
                },
                {
                    "type": "expandablesection",
                    "items": [{
                        "type": "tableview",
                        "key": "liabilities",
                        "notitle": true,
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
                                "title": "loan type",
                                "data": "loan type",
                                render: function(data, type, full, meta) {
                                    return full['Loan Type']
                                }
                            }, {
                                "title": "loan source",
                                "data": "loanSource",
                                render: function(data, type, full, meta) {
                                    return full['Loan Source']
                                }
                            }, {
                                "title": "loan Amount",
                                "data": "loanAmount",
                                render: function(data, type, full, meta) {
                                    return irfCurrencyFilter(full['Loan Amount'])
                                }
                            }, {
                                "title": "Installment Amount",
                                "data": "installmentAmountInPaisa",
                                render: function(data, type, full, meta) {
                                    return irfCurrencyFilter(full['Installment Amount'])
                                }
                            }, {
                                "data": "outstandingAmountInPaisa",
                                "title": "OUTSTANDING_AMOUNT",
                                render: function(data, type, full, meta) {
                                    return irfCurrencyFilter(full['Outstanding Amount'])
                                }
                            }, {
                                "title": "Loan Purpose",
                                "data": "Purpose",
                                render: function(data, type, full, meta) {
                                    return full['Purpose']
                                }

                            }, {
                                "title": "START_DATE",
                                "data": "startDate",
                                render: function(data, type, full, meta) {
                                    return full['Start Date']
                                }
                            }, {
                                "title": "MATURITY_DATE",
                                "data": "maturityDate",
                                render: function(data, type, full, meta) {
                                    return full['Maturity Date']
                                }
                            }, {
                                "title": "NO_OF_INSTALLMENT_PAID",
                                "data": "noOfInstalmentPaid",
                                render: function(data, type, full, meta) {
                                    return full['No of Installment Paid']
                                }

                            }, {
                                "title": "Frequency of Installments",
                                "data": "Frequency",
                                render: function(data, type, full, meta) {
                                    return full['Frequency']
                                }
                            }, {
                                "data": "",
                                "title": "INTEREST_ONLY",
                                render: function(data, type, full, meta) {
                                    return full['Interest Only']
                                }
                            }, {
                                "data": "interestRate",
                                "title": "RATE_OF_INTEREST",
                                render: function(data, type, full, meta) {
                                    return full['Rate of Interest']
                                }
                            }];
                        },
                        getActions: function() {
                            return [];
                        }
                    }]
                }]
            }, {
                "type": "box",
                "colClass": "col-sm-12",
                "readonly": true,
                "title": "Loan Customer Relationship",
                "condition": "model.loanCustomerRel.length!=0",
                "items": [{
                    "type": "section",
                    "html": '<div ng-repeat="data in model.loanCustomerRel"><p >{{data.relation}}, <u>{{data.first_name}}</u> is the <u>{{data.relationship_with_applicant}}</u> of Applicant <u ng-bind-html="model.loanCustomerRelation.applicant.first_name"></u></p></div>'
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
                        },{
                            "key": "customer.enterprise.noOfContractEmployees",
                            "title": "CONTRACT_EMPLOYEES",
                            "type": "number"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "customer.enterprise.avgMonthlySalary",
                            "title": "Average Monthly Salary",
                            "type": "amount"
                        },{
                            "key": "customer.enterprise.noOfRegularEmployees",
                            "title": "REGULAR_EMPLOYEES",
                            "type": "number"
                        }]
                    }]
                }]
            }, {
                "type": "box",
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "readonly": true,
                "title": "Machinery/Stocks/Non-Machinery Asset Details",
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
                            "title": "NO_OF_MACHINERY_HYPOTHECATED_TO",
                            "type": "number"
                        }, {
                            "key": "totalHypothecatedValue",
                            "title": "VALUE_OF_MACHINERY_HYPOTHECATED_TO",
                            "type": "amount"
                        }]
                    }]
                }, {
                    "type": "expandablesection",
                    "items": [{
                        "type": "tableview",
                        "key": "customer.fixedAssetsMachinaries",
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
                                "data": "hypothecatedTo",
                                render: function(data, type, full, meta) {
                                    return full.hypothecatedToUs == "YES" ? ("Kinara") : (full.hypothecatedTo);
                                }
                            }];
                        },
                        getActions: function() {
                            return [];
                        }
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
                            "type": "section",
                            "html": '<div ng-repeat="item in form.items" >{{item.title}}<div style="margin-top:-25px; padding-left:100px;"><sf-decorator  form="item"></sf-decorator><div></div>',
                            "items": [{
                                "key": "CB_REPORT_DATA.fileId",
                                "notitle": true,
                                "title": "CB Report",
                                "category": "Loan",
                                "subCategory": "DOC1",
                                "type": "file",
                                "fileType": "application/pdf",
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
            }],
            schema: function() {
                return Enrollment.getSchema().$promise;
            },
            eventListeners: {
                "financial-summary": function(bundleModel, model, params) {
                    model.customer = model.enrolmentProcess.customer;
                    model.proxyScore = {};
                    model.proxyScore = params[2].data[5];
                    model.liability = params[19].subgroups;
                    model.liabilities = [];
                    var monthly_installment = 0;
                    var outstanding_bal = 0;
                    _.each(model.liability, function(liability) {
                        if (liability.summary['Customer ID'] == model.customer.id) {
                            model.liabilities = _.cloneDeep(liability.data)
                            monthly_installment += liability.summary['Total Monthly Installment'];
                            outstanding_bal += liability.summary['Total Outstanding Loan Amount'];

                        }
                    })

                    model.active_accounts = model.liabilities.length;
                    model.monthly_installment = monthly_installment;
                    model.outstanding_bal = outstanding_bal;


                }
            },
            actions: {}
        };
    }
})

