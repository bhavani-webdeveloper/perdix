define({
    pageUID: "loans.individual.screening.DOPartner.DOPartnerEnterpriseEnrollmentView",
    pageType: "Engine",
    dependencies: ["$log", "$state", "Enrollment", "EnrollmentHelper","irfElementsConfig", "SessionStore", "formHelper", "$q", "irfProgressMessage", "$stateParams", "$state",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "Dedupe", "$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Model_ELEM_FC", "filterFilter", "irfCurrencyFilter", "$filter"
    ],
    $pageFn: function($log, $state, Enrollment, EnrollmentHelper,irfElementsConfig, SessionStore, formHelper, $q, irfProgressMessage, $stateParams, $state,
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
                    BundleManager.pushEvent('business', model._bundlePageObj, model.customer);

                    model.customer.presetAddress = [
                        model.customer.doorNo,
                        model.customer.street,
                        model.customer.district,
                        model.customer.state
                    ].filter(a => a).join(', ') + ' - ' + model.customer.pincode;



                    /*machine pics */
                    var machineDocs = _.filter(self.form, {
                        title: "Machinery"
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


                    //machineDocs[0].items[1].items.push(machinaPhotosData);
                    //machineDocs[0].items[1].items.push(MachineBillData);



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
                    model.stock_count = model.customer.currentAssets.length;
                    model.non_machinery_asset = model.customer.enterpriseAssets.length;
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

                    model.totalstockValue = 0;
                    model.hypothecatedStockToKinara = 0;
                    model.totalHypothecatedStockValue = 0;
                    _.each(model.customer.currentAssets, function(currentAsset) {
                        model.totalstockValue += currentAsset.assetValue;
                        if (currentAsset.hypothecatedToUs == 'YES' || currentAsset.hypothecatedToUs == 'Yes') {
                            model.hypothecatedStockToKinara++;
                            model.totalHypothecatedStockValue += currentAsset.assetValue;

                        }
                    });

                    model.totalEnterpriseAssetValue = 0;
                    model.hypothecatedEnterpriseAssetToKinara = 0;
                    model.totalHypothecatedEnterpriseAssetValue = 0;
                    _.each(model.customer.enterpriseAssets, function(enterpriseAsset) {
                        model.totalEnterpriseAssetValue += enterpriseAsset.valueOfAsset;
                        if (enterpriseAsset.hypothecatedToUs == 'YES' || enterpriseAsset.hypothecatedToUs == 'Yes') {
                            model.hypothecatedEnterpriseAssetToKinara++;
                            model.totalHypothecatedEnterpriseAssetValue += enterpriseAsset.valueOfAsset;

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
                    console.log(model.customer);
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
                        "title": "View Uploads",/*
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
                        }, {
                            "key": "customer.enterprise.companyEmailId",
                            "title": "Email ID"
                        }, {
                            "title": "Present Address",
                            "key": "customer.presetAddress"

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
            }, 
            {
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
            }, 


            {
                "type": "box",
                "colClass": "col-sm-12",
                "readonly": true,
                "title": "Loan Customer Relationship",
                "condition": "model.loanCustomerRel.length!=0",
                "items": [{
                    "type": "section",
                    "html": '<div ng-repeat="data in model.loanCustomerRel"><p >{{data.relation}}, <u>{{data.first_name}}</u> is the <u>{{data.relationship_with_applicant}}</u> of Applicant <u ng-bind-html="model.loanCustomerRelation.applicant.first_name"></u></p></div>'
                }]
            }, 

            {
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
               // "title": "Machinery/Stocks/Non-Machinery Asset Details",
                "title": "Machinery",
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
                }]
            },
            {
                "type": "box",
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "readonly": true,
                "title": "Stocks",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "stock_count",
                            "title": "Total no. of stocks",
                            "type": "number"
                        }, {
                            "key": "totalstockValue",
                            "title": "Total value of stocks",
                            "type": "amount"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "hypothecatedStockToKinara",
                            "title": "NO_OF_STOCKS_HYPOTHECATED_TO",
                            "type": "number"
                        }, {
                            "key": "totalHypothecatedStockValue",
                            "title": "VALUE_OF_STOCKS_HYPOTHECATED_TO",
                            "type": "amount"
                        }]
                    }]
                }]
            },{
                "type": "box",
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "readonly": true,
                "title": "Non Machinery Asset",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "non_machinery_asset",
                            "title": "TOTAL_NO_OF_NON_MACHINERY_ASSET",
                            "type": "number"
                        }, {
                            "key": "totalEnterpriseAssetValue",
                            "title": "TOTAL_VALUE_NON_MACHINERY_ASSET",
                            "type": "amount"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "hypothecatedEnterpriseAssetToKinara",
                            "title": "NO_OF_NON_MACHINERY_ASSET_HYPOTHECATED_TO_KINARA",
                            "type": "number"
                        }, {
                            "key": "totalHypothecatedEnterpriseAssetValue",
                            "title": "VALUE_OF_NON_MACHINERY_ASSET_HYPOTHECATED_TO_KINARA",
                            "type": "amount"
                        }]
                    }]
                }
                ]
            },
            {
                "type": "box",
                "title": "Profit and Loss",
                "colClass": "col-sm-12",
                "items": [{
                    "type": "tableview",
                    "key": "summary.profitLoss.summary.tableData",
                    "notitle": true,
                    "tableConfig": {
                        "ordering": false,
                        "searching": false,
                        "paginate": false,
                        "pageLength": 10,
                        "responsive": false
                    },
                    getColumns: function() {
                        return [{
                            "title": " ",
                            "data": "title",
                            render: function(data, type, full, meta) {
                                return '<strong>'+data+'</strong>';
                            } 
                        }, {
                            "title": "Amount",
                            "data": "amount",
                            "className": "text-right"
                        }, {
                            "title": "Total",
                            "data": "total",
                            "className": "text-right",
                            render: function(data, type, full, meta) {
                                if(data<0){
                                    return '-'+irfElementsConfig.currency.iconHtml+irfCurrencyFilter(Math.abs(data), null, null, "decimal");
                                }else{
                                    return irfElementsConfig.currency.iconHtml+irfCurrencyFilter(data, null, null, "decimal");
                                }
                            } 
                        }, {
                            "title": " ",
                            "data": "percentage",
                            "className": "text-right"
                        }, {
                            "title": " ",
                            "data": "description"
                        }];
                    }
                }]
            },
            {
                "type": "box",
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "readonly": true,
                "title": "Commercial CIBIL",
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
            }, 
            {
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
                }
                ]
            }],
            schema: function() {
                return Enrollment.getSchema().$promise;
            },
            eventListeners: {
                "financial-summary": function(bundleModel, model, params) {
                    model.proxyScore = {};
                    model.proxyScore = (params[2])? params[2].data[5] : {};
                    model.liability = (params[19])?params[19].subgroups:{};
                    model.currentAssets = (params[23])?params[23].data:{};
                    model.enterpriseAssets = (params[24])?params[24].data:{};
                    model.overAllHypoValue = (params[25])?params[25].data[0]:{};
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
                  
                   /*Operational expenditure calculation*/
                    model._opex = params[21].data;
                    var bpl = params[8].data[0];
                    /*var purchase=params[18].data;*/
                    /*Household income sum for applicant and co applicant , assuming it snever bethere for gurantor*/
                    var household_income=0;
                    var household=params[7].sections;
                    _.each(household, function(household){
                        household_income += parseInt(household.data[0]['Net Household Income']);

                    })
                    bpl.household_income=household_income;
                    bpl.ExistingLoanRepayments= params[0].data[0]['Existing Loan Repayments'];
                    bpl.avgMonDep=model.business.summary.bankStatement.averageMonthlyDeposit;
                    bpl.avgMonBal=model.business.summary.bankStatement.averageMonthlyBalance;

                    /*purchase splitup calculation under profit and loss*/
                    
                    var purchases= params[18].data;
                    if(purchases.length!= 0){
                          _.each(purchases, function(purchase){
                         if(_.has(purchase, "data")){
                            if(purchase.data["Month"]== "Average Total by Seller"){
                                bpl['purchase_inv']= (purchase.data["Invoice Sales Amount"]== 0)?"0.00":purchase.data["Invoice Sales Amount"];
                                bpl['purchase_cash']= (purchase.data["Cash Sales Amount"]== 0)?"0.00":purchase.data["Cash Sales Amount"];
                                bpl['purchase_cash_pct']= purchase.data["Cash (%)"].toFixed(2) + " %";
                                bpl['purchase_inv_pct']= purchase.data["Invoice (%)"].toFixed(2) + " %";
                            }

                         }

                    })
                    }else{
                        bpl['purchase_inv']= "0";
                        bpl['purchase_cash']= "0";
                        bpl['purchase_cash_pct']= "0.00 %";
                        bpl['purchase_inv_pct']= "0.00 %"

                    }
                  

                    var CalPercentage=function(total, value){
                        if(total== 0 && value!= 0) return "0.00 %";
                        if(total!= 0 && value== 0) return "0.00 %"
                        if(total== 0 && value== 0) return "0.00 %"
                        return ((value/total)*100).toFixed(2)+" %";
                    }

                    model.summary = {
                        "profitLoss": {
                            "summary": {
                                "tableData": [{
                                    "title": "Income",
                                    "amount": "",
                                    "total": bpl['Total Business Revenue'],
                                    "percentage": "",
                                    "description": "",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                }, {
                                    "title": "Purchases",
                                    "amount": "",
                                    "total": bpl['Purchases'],
                                    "percentage": bpl['Purchases pct'],
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                }, {
                                    "title": "OPEX",
                                    "amount": "",
                                    "total": bpl['Opex'],
                                    "percentage":CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['Opex'])),
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                }, {
                                    "title": "Total Expenses",
                                    "amount": "",
                                    "total": bpl['Total Expenses'],
                                    "percentage": CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['Total Expenses'])),                      
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                }, {
                                    "title": "Gross Income",
                                    "amount": "",
                                    "total": bpl['Gross Income'],
                                    "percentage": CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['Gross Income'])),
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                }, {
                                    "title": "Existing Loan Repayments",
                                    "amount": "",
                                    "total": bpl['Business Liabilities'],
                                    "percentage": CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['Business Liabilities'])),
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                },{
                                    "title": "Net Income",
                                    "amount": "",
                                    "total": bpl['Net Business Income'],
                                    "percentage": bpl['Net Business Income pct'],
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                },{
                                    "title": "Household Net Income",
                                    "amount": "",
                                    "total": bpl['household_income'],
                                    "percentage": CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['household_income'])),
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                }, {
                                    "title": "Revised Net Income",
                                    "amount": "",
                                    "total":  bpl['Net Income'],
                                    "percentage":CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['Net Income'])),
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                },{
                                    "title": "KINARA_EMI",
                                    "amount": "",
                                    "total": bpl['Kinara EMI'],
                                    "percentage": CalPercentage(parseInt(bpl['Net Income']), parseInt(bpl['Kinara EMI'])),
                                    "description": "of Revised Net Income",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }

                                },{
                                    "title": "Average Bank Balance",
                                    "amount": "",
                                    "total": bpl['avgMonBal']?bpl['avgMonBal']:("0.00") ,
                                    "percentage": CalPercentage(parseInt(bpl['Net Income']), parseInt(bpl['avgMonBal'])) ,
                                    "description": "of Revised Net Income",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                },{
                                    "title": "Average Bank Deposit",
                                    "amount": "",
                                    "total": bpl['avgMonDep']?bpl['avgMonDep']:("0.00") ,
                                    "percentage": CalPercentage(parseInt(bpl['Net Income']), parseInt(bpl['avgMonDep'])) ,
                                    "description": "of Revised Net Income",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                
                                }]
                            },
                            "details": {
                                "tableData": [{
                                    "title": "Income",
                                    "amount": "",
                                    "total": bpl['Total Business Revenue'],
                                    "percentage": "",
                                    "description": "",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                }, {
                                    "title": "Invoice",
                                    "amount": bpl['Invoice'],
                                    "total": "",
                                    "percentage": bpl['Invoice pct'],
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-right"
                                        }
                                    }
                                }, {
                                    "title": "Cash",
                                    "amount": bpl['Cash'],
                                    "total": "",
                                    "percentage": bpl['Cash pct'],
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-right"
                                        }
                                    }
                                }, {
                                    "title": "Scrap & Other Business Income",
                                    "amount": bpl['Scrap or any business related income'],
                                    "total": "",
                                    "percentage": bpl['Scrap or any business related income pct'],
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-right"
                                        }
                                    }
                                },{
                                    "title": "Purchases",
                                    "amount": "",
                                    "total": bpl['Purchases'],
                                    "percentage": bpl['Purchases pct'],
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                },  {
                                    "title": "Invoice",
                                    "amount": (bpl['purchase_inv']==null)?"0":bpl['purchase_inv'],
                                    "total": "",
                                    "percentage": (bpl['purchase_inv_pct']==null)?"0.00%":bpl['purchase_inv_pct'],
                                    "description": "of total Purchases",
                                    "$config": {
                                        "title": {
                                            "className": "text-right"
                                        }
                                    }
                                }, {
                                    "title": "Cash",
                                    "amount": (bpl['purchase_cash']==null)?"0":bpl['purchase_cash'],
                                    "total": "",
                                    "percentage": (bpl['purchase_cash_pct']==null)?"0.00%":bpl['purchase_cash_pct'],
                                    "description": "of total Purchases",
                                    "$config": {
                                        "title": {
                                            "className": "text-right"
                                        }
                                    }
                                }, {
                                    "title": "OPEX",
                                    "amount": "",
                                    "total": bpl['Opex'],
                                    "percentage": CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['Opex'])),
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                },{
                                    "title": "Total Expenses",
                                    "amount": "",
                                    "total": bpl['Total Expenses'],
                                    "percentage": CalPercentage(parseInt(bpl['Total Business Revenue']),parseInt(bpl['Total Expenses'])),
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                }, {
                                    "title": "Gross Income",
                                    "amount": "",
                                    "total": bpl['Gross Income'],
                                    "percentage": CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['Gross Income'])) ,
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                }, {
                                    "title": "Existing Loan Repayments",
                                    "amount": "",
                                    "total": bpl['Business Liabilities'],
                                    "percentage": CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['Business Liabilities'])),
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                }, {
                                    "title": "Net Income",
                                    "amount": "",
                                    "total": bpl['Net Business Income'],
                                    "percentage": bpl['Net Business Income pct'],
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                },{
                                    "title": "Household Net Income",
                                    "amount": "",
                                    "total": bpl['household_income'],
                                    "percentage": CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['household_income'])),
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                }, {
                                    "title": "Revised Net Income",
                                    "amount": "",
                                    "total":  bpl['Net Income'],
                                    "percentage":CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['Net Income'])),
                                    "description": "of turnover",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                }, {
                                    "title": "KINARA_EMI",
                                    "amount": "",
                                    "total": bpl['Kinara EMI'],
                                    "percentage": CalPercentage(parseInt(bpl['Net Income']), parseInt(bpl['Kinara EMI'])),
                                    "description": "of Revised Net Income",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }

                                },{
                                    "title": "Average Bank Balance",
                                    "amount": "",
                                    "total": bpl['avgMonBal']?bpl['avgMonBal']:("0.00") ,
                                    "percentage": CalPercentage(parseInt(bpl['Net Income']), parseInt(bpl['avgMonBal'])) ,
                                    "description": "of Revised Net Income",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                },{
                                    "title": "Average Bank Deposit",
                                    "amount": "",
                                    "total": bpl['avgMonDep']?bpl['avgMonDep']:("0.00") ,
                                    "percentage": CalPercentage(parseInt(bpl['Net Income']), parseInt(bpl['avgMonDep'])) ,
                                    "description": "of Revised Net Income",
                                    "$config": {
                                        "title": {
                                            "className": "text-bold"
                                        }
                                    }
                                
                                }]
                            }
                        }
                    };

                    /* Populate values for Balance Sheet */
                    //self.renderReady("financial-summary");
                },
                "business-customer": function(bundleModel, model, params) {
                    model.business = params;
                    //model.business.centreName = filterFilter(formHelper.enum('centre').data, {value: model.business.centreId})[0].name;

                    var bankStatementSummary = (function() {
                        var averageGraphData = [{
                            "key": "Avg Bank Deposits",
                            "color": "limegreen",
                            "values": []
                        }, {
                            "key": "Avg Bank Balances",
                            "color": "firebrick",
                            "values": []
                        }];
                        var bouncesGraphData = [{
                            "key": "No of EMI Bounces",
                            "color": "limegreen",
                            "values": []
                        }, {
                            "key": "No of non EMI Bounces",
                            "color": "firebrick",
                            "values": []
                        }];
                        var totalAverageDeposits = 0;
                        var totalAverageWithdrawals = 0;
                        var totalAvgbalanceon15 = 0;
                        var totalChequeBounces = 0;
                        var totalEMIBounces = 0;
                        var graphStatement = {};
                        for (i = 0; i < model.business.customerBankAccounts.length; i++) {
                            var acc = model.business.customerBankAccounts[i];
                            var totalDeposits = 0;
                            var totalWithdrawals = 0;
                            var balnceon15 = 0;
                            var noOfEmiChequeBounced = 0;
                            var noOfChequeBounced = 0;
                            for (j in acc.bankStatements) {
                                var stat = acc.bankStatements[j];
                                totalDeposits += stat.totalDeposits;
                                totalWithdrawals += stat.totalWithdrawals;
                                balnceon15 += stat.balanceAsOn15th;
                                noOfEmiChequeBounced += stat.noOfEmiChequeBounced;
                                noOfChequeBounced += stat.noOfChequeBounced;

                                var graphKey = stat.startMonth;                             
                                if(graphStatement[graphKey]){
                                    graphStatement[graphKey].count++
                                }else{
                                    graphStatement[graphKey]={};
                                    graphStatement[graphKey].count=1;

                                }
                                graphStatement[graphKey].totalDeposits = graphStatement[graphKey].totalDeposits || 0;
                                graphStatement[graphKey].totalDeposits += stat.totalDeposits;
                                graphStatement[graphKey].totalWithdrawals = graphStatement[graphKey].totalWithdrawals || 0;
                                graphStatement[graphKey].totalWithdrawals += stat.totalWithdrawals;
                                graphStatement[graphKey].balnceon15 = graphStatement[graphKey].balnceon15 || 0;
                                graphStatement[graphKey].balnceon15 += stat.balanceAsOn15th;
                                graphStatement[graphKey].noOfEmiChequeBounced = graphStatement[graphKey].noOfEmiChequeBounced || 0;
                                graphStatement[graphKey].noOfEmiChequeBounced += stat.noOfEmiChequeBounced;
                                graphStatement[graphKey].noOfChequeBounced = graphStatement[graphKey].noOfChequeBounced || 0;
                                graphStatement[graphKey].noOfChequeBounced += stat.noOfChequeBounced;
                            }
                            acc.total = {
                                "startMonth": "Average",
                                "totalDeposits": totalDeposits,
                                "averageDeposits": totalDeposits / acc.bankStatements.length,
                                "totalWithdrawals": totalWithdrawals,
                                "averageWithdrawals": totalWithdrawals / acc.bankStatements.length,
                                "Avgbalnceon15": balnceon15 / acc.bankStatements.length,
                                "noOfEmiChequeBounced": noOfEmiChequeBounced,
                                "noOfChequeBounced": noOfChequeBounced
                            };
                            totalAverageDeposits += acc.total.averageDeposits;
                            totalAverageWithdrawals += acc.total.averageWithdrawals;
                            totalAvgbalanceon15 += acc.total.Avgbalnceon15,
                            totalEMIBounces += acc.total.noOfEmiChequeBounced;
                            totalChequeBounces += acc.total.noOfChequeBounced;
                            acc.bankStatements.push(acc.total);
                        }
                        
                       // Graph data need to be sorted
                        var sortedGraphStatement = {};
                        Object.keys(graphStatement).sort().forEach(function(key) {
                         sortedGraphStatement[key] = graphStatement[key];
                         });

                        /*_.sortKeysBy(graphStatement);
                        _.sortKeysBy(obj, function(value, key) {
                            return value;
                        });*/


                        _.forOwn(sortedGraphStatement, function(v, k) {
                            k = moment(k, 'YYYY-MM-DD').format('MMM, YYYY');
                            averageGraphData[0].values.push({
                                "x": k,
                                "y": v.totalDeposits / v.count,
                                "series": 0
                            })
                            averageGraphData[1].values.push({
                                "x": k,
                                "y": v.balnceon15 / v.count,
                                "series": 1
                            })
                            bouncesGraphData[0].values.push({
                                "x": k,
                                "y": v.noOfEmiChequeBounced,
                                "series": 0
                            })
                            bouncesGraphData[1].values.push({
                                "x": k,
                                "y": v.noOfChequeBounced,
                                "series": 1
                            })
                        });
                        return {
                            "averageMonthlyDeposit": totalAverageDeposits,
                            "averageMonthlyWithdrawal": totalAverageWithdrawals,
                            "averageMonthlyBalance": totalAvgbalanceon15,
                            "totalAccounts": model.business.customerBankAccounts.length,
                            "totalEMIBounces": totalEMIBounces,
                            "totalChequeBounces": totalChequeBounces,
                            "average": {
                                "graphData": averageGraphData,
                                "graphOptions": {
                                    "chart": {
                                        "type": "multiBarChart",
                                        "height": 280,
                                        "duration": 500,
                                        "stacked": false,
                                        "reduceXTicks": false
                                    }
                                }
                            },
                            "bounces": {
                                "graphData": bouncesGraphData,
                                "graphOptions": {
                                    "chart": {
                                        "type": "multiBarChart",
                                        "height": 280,
                                        "duration": 500,
                                        "stacked": false,
                                        "rotateLabels": -90,
                                        "showControls": false,
                                        "reduceXTicks": false
                                    }
                                }
                            }
                        };
                    })();

                    model.business.summary = {
                        "bankStatement": bankStatementSummary
                    }
                    //self.renderReady("business-customer");
                }
            },
            actions: {}
        };
    }
})