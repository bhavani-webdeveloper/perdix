define({
    pageUID: "loans.individual.screening.DOPartner.DOPartnerIndividualEnrollmentView",
    pageType: "Engine",
    dependencies: ["$log", "Enrollment", "formHelper", "filterFilter", "irfCurrencyFilter", "Model_ELEM_FC", "CreditBureau", "irfElementsConfig", "$filter"],
    $pageFn: function($log, Enrollment, formHelper, filterFilter, irfCurrencyFilter, Model_ELEM_FC, CreditBureau, irfElementsConfig, $filter) {
        return {
            "type": "schema-form",
            "title": "INDIVIDUAL_ENROLLMENT",
            "subTitle": "",
            initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                var self = this;
                model.bundlePageObj = bundlePageObj;
                model.bundleModel = bundleModel;

                model.UIUDF = {
                    'family_fields': {},
                    'liabilities': [],
                    'liability_fields': {},
                    'household_fields': {},
                    'bankAccount': [],
                    'cibil': {},
                    'highmark': {},
                    'customer_address': {}
                };

                Enrollment.getCustomerById({
                    id: model.customerId
                }).$promise.then(function(res) {
                    model.customer = res;
                    model.firstName = res.firstName;
                    switch (bundlePageObj.pageClass) {
                        case 'applicant':
                            model.bundleModel.applicant = res;
                            break;
                        case 'co-applicant':
                            model.bundleModel.coApplicants.push(res);
                            break;
                        case 'guarantor':
                            model.bundleModel.guarantors.push(res);
                            break;
                    };

                    model.customer.presetAddress = [
                        model.customer.doorNo,
                        model.customer.street,
                        model.customer.district,
                        model.customer.state
                    ].filter(a => a).join(', ') + ' - ' + model.customer.pincode;

                    /*Family fields*/
                    model.UIUDF.family_fields.family_member_count = model.customer.familyMembers.length;
                    model.UIUDF.family_fields.dependent_family_member = 0;/*
                    model.UIUDF.family_fields.total_household_income = 0;*/
                    _.each(model.customer.familyMembers, function(member) {
                        if (member.incomes.length == 0)
                            model.UIUDF.family_fields.dependent_family_member++;
                    });
                    /*Household Assets field*/
                    model.UIUDF.household_fields.total_Assets = model.customer.physicalAssets.length; /* what assets i need to take*/
                    model.UIUDF.household_fields.total_Value = 0;
                    _.each(model.customer.physicalAssets, function(Assets) {
                        model.UIUDF.household_fields.total_Value += parseInt(Assets.ownedAssetValue);
                    });

                    /*Cibil/highmark fields*/


                    /*Reference Check fields*/
                    model.UIUDF.REFERENCE_CHECK_RESPONSE = 'NA';
                    var ref_flag = "true";
                    var countNull=0;
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
                        model.UIUDF.REFERENCE_CHECK_RESPONSE = 'Negative';
                    }
                    if ( ref_flag == "true" && countNull != model.customer.verifications.length){
                        model.UIUDF.REFERENCE_CHECK_RESPONSE = "Positive"
                    }

                    /*Household fields */

                    var decExpanse = 0;

                    _.each(model.customer.expenditures, function(expanse) {
                        if(expanse.annualExpenses!=null){
                            decExpanse += parseInt(expanse.annualExpenses);
                        }
                    })
                    model.decHouseExpanse = decExpanse;

                    if(model.customer.liabilities && model.customer.liabilities.length){
                        model.active_accounts = model.customer.liabilities.length;
                        model.monthly_installment=0;
                        model.outstanding_bal=0;
                        for(i in model.customer.liabilities){
                            model.monthly_installment += model.customer.liabilities[i].installmentAmountInPaisa;
                            model.outstanding_bal += model.customer.liabilities[i].outstandingAmountInPaisa;
                        }
                    }

                    /*Family Section*/
                    self.form = self.formSource;
                    var family = {
                        "type": "box",
                        "readonly": true,
                        "colClass": "col-sm-12",
                        "overrideType": "default-view",
                        "title": "Family",
                        "items": [{
                            "type": "grid",
                            "orientation": "horizontal",
                            "items": [{
                                "type": "grid",
                                "orientation": "vertical",
                                "items": [{
                                    "key": "UIUDF.family_fields.family_member_count",
                                    "title": "No. of Family Members",
                                    "type": "number"
                                }, {
                                    "key": "UIUDF.family_fields.dependent_family_member",
                                    "title": "No. of Dependent Family Members",
                                    "type": "number"
                                }]
                            }, {
                                "type": "grid",
                                "orientation": "vertical",
                                "items": [{
                                    "key": "UIUDF.family_fields.total_household_income",
                                    "type": "amount",
                                    "title": "Total Household income"
                                }, {
                                    "key": "decHouseExpanse",
                                    "type": "amount",
                                    "title": "Declared Household Expenditure"
                                }]
                            }]
                        }]
                    };
                    self.form.splice(2, 0, family);
                    //self.form.splice(4, 0, bankAccountDetail);

                    if (self.formSource[self.formSource.length - 1].title != "View Uploads") {                    
                    self.formSource.push({
                    "type": "box",
                    "colClass": "col-sm-12",
                    "readonly": true,
                    "overrideType": "default-view",
                    "title": "View Uploads",
                    "items": [{
                        "type": "section",
                        "html": '<div style="overflow-x:scroll"><div style="width:10000px"><div ng-repeat="item in form.items" style="display: inline-block; text-align: center; width: 180px; "><div style="margin-top: -10px; margin-right: 8px;"><sf-decorator form="item"></sf-decorator>{{item.title}}</div></div></div></div>',
                        "items": [{
                            "key": "customer.identityProofImageId",
                            "type": "file",
                            "notitle": true,
                            "title": model.customer.identityProof,
                            "preview": "pdf",
                            "using": "scanner"
                        }, {

                            "key": "customer.addressProofImageId",
                            "type": "file",
                            "notitle": true,
                            "title": model.customer.addressProof,
                            "preview": "pdf",
                            "using": "scanner"
                        }, {
                            "key": "customer.houseVerificationPhoto",
                            "notitle": true,
                            "title": "House",
                            "type": "file",
                            "fileType": "image/*"
                        }, {
                            "key": "customer.latitude",
                            "notitle": true,
                            "title": $filter("translate")("HOUSE_LOCATION"),
                            "type": "geotag",
                            "latitude": "customer.latitude",
                            "longitude": "customer.longitude"
                        },]
                    }]
                });
                }
                });


                

                CreditBureau.getCBDetails({
                    "customerId": model.customerId
                }).$promise.then(function(res) {
                    $log.warn("res");
                    $log.warn(res);                    
                    model.cibil_highmark = res;
                    if (res.cibil != null) {
                        model.UIUDF.cibil.cibil_score = res.cibil.cibilScore[0].score;
                        model.UIUDF.cibil.active_accounts = res.cibil.cibilLoanSummaryInfo[0].totalAccounts;
                        model.UIUDF.cibil.overdue_accounts = res.cibil.cibilLoanSummaryInfo[0].overDueAccounts;
                        model.UIUDF.cibil.sanctioned_amount = (res.cibil.cibilLoanDetails.length!=0)?res.cibil.cibilLoanDetails[0].highCreditOrSanctionedAmount:"";
                        model.UIUDF.cibil.current_balance = res.cibil.cibilLoanSummaryInfo[0].currentBalance;
                        model.UIUDF.cibil.amount_overdue = res.cibil.cibilLoanSummaryInfo[0].amountOverDue;
                        // model.UIUDF.cibil.report = '<a href="" class="color-theme">Download</a>';
                    }
                    if (res.highMark != null) {
                        model.UIUDF.highmark.score = res.highMark.highmarkScore;
                        var highmarkFields = $(res.highMark.reportHtml).find('.subHeader1').parent().parent().children(':last').find('.AccValue');
                        if (highmarkFields.length != 0) {
                            model.UIUDF.highmark.active_accounts = highmarkFields[1].innerText.trim();
                            model.UIUDF.highmark.overdue_accounts = highmarkFields[2].innerText.trim();
                            model.UIUDF.highmark.current_balance = highmarkFields[3].innerText.trim() + ' ' + irfElementsConfig.currency.iconHtml;
                            model.UIUDF.highmark.disbursed_amount = highmarkFields[4].innerText.trim() + ' ' + irfElementsConfig.currency.iconHtml;
                            // model.UIUDF.highmark.report = '<a href="" class="color-theme">Download</a>';
                        }

                    }
                }, function(e) {
                    model.cibil_highmark = null;
                });
            },

            form: [],
            formSource: [{
                    "type": "section",
                    "html": `
<div class="col-sm-6">
<i class="fa fa-check-circle text-green" style="font-size:x-large">&nbsp;</i><em class="text-darkgray">{{model.existingCustomerStr}}</em><br>&nbsp;
</div>
<div class="col-sm-3">{{'BRANCH'|translate}}: <strong>{{model.business.kgfsName}}</strong></div>
<div class="col-sm-3">{{'CENTRE'|translate}}: <strong>{{model.business.centreName}}</strong></div>
`
                }, {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "title": "Personal Details",
                    "overrideType": "default-view",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "customer.id",
                                "title": "CUSTOMER_ID"
                            }, {
                                "key": "customer.firstName",
                                "title": "FULL_NAME"
                            }, {
                                "key": "customer.gender"
                            }, {
                                "key": "customer.dateOfBirth"
                            }, {
                                "key": "customer.identityProofNo",
                                "title": "ID Proof N0."
                            }, {
                                "key": "customer.identityProof",
                                "title": "ID Proof Type"
                            }, {
                                "key": "customer.addressProofNo",
                                "title": "Address Proof No."
                            }, {
                                "key": "customer.addressProof",
                                "title":"Address Proof Type"
                            }, {
                                "key": "customer.language",
                                "title": "PREFERRED_LANGUAGE"
                            }, {
                                "key": "customer.mobilePhone",
                                "title": "MOBILE_NO",
                                "inputmode": "number",
                                "numberType": "tel"
                            }, {
                                "key": "customer.email",
                                "title": "EMAIL"
                            }, {
                                "key": "customer.presetAddress",
                                "type": "html",
                                "title": "Present Address"
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "customer.urnNo",
                                "title": "URN"
                            }, {
                                "key": "customer.religion"
                            }, {
                                "key": "customer.fatherFirstName",
                                "title": "FATHER_FULL_NAME",
                            }, {
                                "key": "customer.motherName",
                                "title": "Mother's Full Name"
                            }, {
                                "key": "customer.maritalStatus"
                            }, {
                                "key": "customer.spouseFirstName",
                                "title": "SPOUSE_FULL_NAME",
                                "condition": "model.customer.maritalStatus && model.customer.maritalStatus.toUpperCase() == 'MARRIED'"
                            }, {
                                "key": "customer.spouseDateOfBirth",
                                "condition": "model.customer.maritalStatus && model.customer.maritalStatus.toUpperCase() == 'MARRIED' "
                            },{
                                "key": "customer.ownership",
                                "title":"Housing Status"
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "customer.photoImageId",
                                "type": "file",
                                "fileType": "image/*",
                                "notitle": true
                            }]

                        }]
                    }]
                }, {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "overrideType": "default-view",
                    "title": "RELATIONSHIP_TO_BUSINESS",
                    "condition": "model.enterpriseRelationship",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "title": "RELATIONSHIP_TO_BUSINESS",
                                "key": "enterpriseRelationship.relationshipType"
                            }, {
                                "title": "EXPERIENCE_IN_BUSINESS",
                                "key": "enterpriseRelationship.experienceInBusiness"
                            }, {
                                "title": "BUSINESS_INVOLVEMENT",
                                "key": "enterpriseRelationship.businessInvolvement"
                            }, {
                                "title": "PARTNER_OF_ANY_OTHER_COMPANY",
                                "key": "enterpriseRelationship.partnerOfAnyOtherCompany"
                            }]
                        }]
                    }]
                }, 

                {
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

                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "",
                                "title": "Total loan amount from Banks",
                                "type": "amount"

                            }, {
                                "key": "",
                                "title": "Total loan amount from MFI/NBFC",
                                "type": "amount"

                            }, {
                                "key": "",
                                "title": "Total loan amount from others",
                                "type": "amount"

                            }]

                        }]
                    }]
                },
                {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "overrideType": "default-view",
                    "title": "Bank Account Detail",
                    "condition": "model.customer.customerBankAccounts.length != 0",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "BankAvgDep",
                                "title": "Average Monthly Deposit",
                                "type": "amount"
                            }, {
                                "key": "BankAvgWithdrawl",
                                "title": "Average Monthly Withdrawls",
                                "type": "amount"
                            }, {
                                "key": "BankAvgBal",
                                "title": "Average Monthly Balances",
                                "type": "amount"
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "totalAccount",
                                "title": "Total no of Account",
                                "type": "number"
                            }, {
                                "key": "checkBounced",
                                "title": "Total no of Cheque Bounce",
                                "type": "number"
                            }, {
                                "key": "emiBounce",
                                "title": "Total no EMI Bounce",
                                "type": "number"
                            }]
                        }]
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
                                "key": "UIUDF.liability_fields.active_accounts",
                                "title": "No of Active Loans",
                                "type": "number"
                            }, {
                                "key": "UIUDF.liability_fields.monthly_installment",
                                "title": "Total Monthly Instalments",
                                "type": "amount"
                            }, {
                                "key": "UIUDF.liability_fields.outstanding_bal",
                                "title": "OUTSTANDING_AMOUNT",
                                "type": "amount"
                            }]

                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "",
                                "title": "Total loan amount from Banks",
                                "type": "amount"

                            }, {
                                "key": "",
                                "title": "Total loan amount from MFI/NBFC",
                                "type": "amount"

                            }, {
                                "key": "",
                                "title": "Total loan amount from others",
                                "type": "amount"

                            }]

                        }]
                    }
                    ]
                },  
                {
                    "type": "box",
                    "colClass": "col-sm-12",
                    "overrideType": "default-view",
                    "title": "CIBIL/Highmark",
                    "readonly": true,
                    "condition": "model.cibil_highmark",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                    "key": "UIUDF.cibil.cibil_score",
                                    "title": "CIBIL Score"
                                }, {
                                    "key": "UIUDF.cibil.active_accounts",
                                    "title": "Active Accounts"
                                }, {
                                    "key": "UIUDF.cibil.overdue_accounts",
                                    "title": "Overdue Accounts"
                                }, {
                                    "key": "UIUDF.cibil.sanctioned_amount",
                                    "title": "Sanctioned Amount",
                                    "type": "amount"
                                }, {
                                    "key": "UIUDF.cibil.current_balance",
                                    "title": "Current Balance",
                                    "type": "amount"
                                }, {
                                    "key": "UIUDF.cibil.amount_overdue",
                                    "title": "Overdue Balance",
                                    "type": "amount"
                                }
                                /*, {
                                                                "key": "UIUDF.cibil.report",
                                                                "title": "Report",
                                                                "type": "html"
                                                            }*/
                            ]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                    "key": "UIUDF.highmark.score",
                                    "title": "Highmark Score"
                                }, {
                                    "key": "UIUDF.highmark.active_accounts",
                                    "title": "Active Accounts"
                                }, {
                                    "key": "UIUDF.highmark.overdue_accounts",
                                    "title": "Overdue Account"
                                }, {
                                    "key": "UIUDF.highmark.current_balance",
                                    "title": "Total Current Balance",
                                    "type": "number"
                                }, {
                                    "key": "UIUDF.highmark.disbursed_amount",
                                    "title": "Amount Disbursed",
                                    "type": "number"
                                }
                                /*, {
                                                                "key": "UIUDF.highmark.report",
                                                                "title": "Report",
                                                                "type": "html"
                                                            }*/
                            ]
                        }]
                    }]
                }, 
                {
                    "type": "box",
                    "colClass": "col-sm-12",
                    "overrideType": "default-view",
                    "readonly": true,
                    "title": "Reference Check",
                    "condition": "model.bundlePageObj.pageClass != 'guarantor' && model.customer.verifications.length !=0",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "UIUDF.REFERENCE_CHECK_RESPONSE",
                                "title": "Reference Check Responses",
                            }]
                        }]
                    } 
                    /*{
                        "type": "expandablesection",
                        "items": [{
                            "type": "tableview",
                            "key": "customer.verifications",
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
                                    "title": "Contact Person Name",
                                    "data": "referenceFirstName"
                                }, {
                                    "title": "Contact Number",
                                    "data": "mobileNo",
                                }, {
                                    "title": "Occupation",
                                    "data": "occupation"
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
                                    "title": "How long have you know the Applicant(years)?",
                                    "data": "knownSince"
                                }, {
                                    "title": "Relationship with Applicant",
                                    "data": "relationship"
                                }, {
                                    "title": "Opinion on Applicant's Business",
                                    "data": "opinion"
                                }, {
                                    "title": "What is the curent financial status of the Applicant?",
                                    "data": "financialStatus",
                                }, {
                                    "title": "Referer Response",
                                    "data": "customerResponse"
                                }];
                            },
                            getActions: function() {
                                return [];
                            }
                        }]
                    }*/

                    ]
                }/*, {
                    "type": "box",
                    "colClass": "col-sm-12",
                    "readonly": true,
                    "overrideType": "default-view",
                    "title": "View Uploads",
                    "items": [{
                        "type": "section",
                        "html": '<div style="overflow-x:scroll"><div style="width:10000px"><div ng-repeat="item in form.items" style="display: inline-block; text-align: center; width: 180px;"><div style="margin-top: -10px; margin-right: 8px;"><sf-decorator form="item"></sf-decorator>{{item.title}}</div></div></div></div>',
                        "items": [{
                            "key": "customer.identityProofImageId",
                            "type": "file",
                            "notitle": true,
                            "title": "KYC-PAN Card",
                            "preview": "pdf",
                            "using": "scanner"
                        }, {

                            "key": "customer.addressProofImageId",
                            "type": "file",
                            "notitle": true,
                            "title": "KYC-Aadhar Card",
                            "preview": "pdf",
                            "using": "scanner"
                        }, {
                            "key": "customer.houseVerificationPhoto",
                            "notitle": true,
                            "title": "House",
                            "type": "file",
                            "fileType": "image/*"
                        }]
                    }]
                }*/

            ],

            schema: function() {
                return Enrollment.getSchema().$promise;
            },
            eventListeners: {
                "financial-summary": function(bundleModel, model, params) {
                    model.bankDetails = params[10].BankAccounts;
                    var liability = params[19].subgroups;
                    model._scores = params;
                    var psychometricScores = model._scores[14].sections;
                    var houseHoldPL = model._scores[7].sections;
                    /*Bank fields*/
                    var count = 0;
                    var BankAvgBal = 0;
                    var BankAvgDep = 0;
                    var BankAvgWithdrawl = 0;
                    var checkBounced = 0;
                    var emiBounce = 0;
                    _.each(model.bankDetails, function(bankDetail) {
                        if (model.customer.id == bankDetail['Customer ID']) {
                            count++;
                            model.UIUDF.bankAccount.push(bankDetail)
                            BankAvgBal += parseInt(bankDetail['Average Bank Balance']);
                            BankAvgDep += parseInt(bankDetail['Average Bank Deposit']);
                            checkBounced += bankDetail['Total Cheque Bounced (Non EMI)'];
                            emiBounce += bankDetail['Total EMI Bounced'];
                        }
                    })

                    BankAvgWithdrawl = BankAvgDep - BankAvgBal;
                    model.totalAccount = count;
                    model.BankAvgBal = BankAvgBal;
                    model.BankAvgDep = BankAvgDep;
                    model.BankAvgWithdrawl = BankAvgWithdrawl;
                    model.checkBounced = checkBounced;
                    model.emiBounce = emiBounce;

                    /*Liability Section*/
                    var monthly_installment = 0;
                    var outstanding_bal = 0;

                    _.each(liability, function(liability) {
                        if (liability.summary['Customer ID'] == model.customer.id) {
                            model.UIUDF.liabilities = _.cloneDeep(liability.data)
                            monthly_installment += liability.summary['Total Monthly Installment'];
                            outstanding_bal += liability.summary['Total Outstanding Loan Amount'];

                        }
                    })
                    model.UIUDF.liability_fields.active_accounts = model.UIUDF.liabilities.length;
                    model.UIUDF.liability_fields.monthly_installment = monthly_installment;
                    model.UIUDF.liability_fields.outstanding_bal = outstanding_bal;

                    /*Branch section*/

                    if (params[0].data[0]['Existing Customer'] == 'No') {
                        model.existingCustomerStr = "New Customer";
                    } else {
                        model.existingCustomerStr = "Existing Customer";
                    }

                    /*household data details*/
                    var totalIncome = 0;
                    var totalExpenses = 0;
                    if(model.bundlePageObj.pageClass!='guarantor'){
                    _.each(houseHoldPL, function(household) {
                        if (model.customer.id == household["customer_id"]) {
                            totalIncome = parseInt(household.data[0]['Salary from business']) + parseInt(household.data[0]['Other Income/salaries']) + parseInt(household.data[0]['Family Member Incomes']);
                            totalExpenses = parseInt(household.data[0]['Expenses Declared or based on the educational expense whichever is higher']) + parseInt(household.data[0]['EMI\'s of household liabilities']);
                            model.household = [];
                            model.household.push({
                                income: totalIncome,
                                salaryFromBusiness: household.data[0]['Salary from business'],
                                otherIncomeSalaries: household.data[0]['Other Income/salaries'],
                                familyMemberIncomes: household.data[0]['Family Member Incomes'],
                                Expenses: totalExpenses,
                                declaredEducationExpense: household.data[0]['Expenses Declared or based on the educational expense whichever is higher'],
                                emiHouseholdLiabilities: household.data[0]['EMI\'s of household liabilities'],
                                netHouseholdIncome: household.data[0]['Net Household Income']
                            });
                            model.household_new = model.household[0];

                        }
                    })

                    model.UIUDF.family_fields.total_household_income = model.household[0].income;


                    /*Psychometric details*/
                    _.each(psychometricScores, function(psyScore){
                        if(model.customer.id == psyScore.customer_id){
                            model.psy_data = psyScore;
                        
                        model.psy_data.passOutOf = 0;
                        model.psy_data.psyTotalPara = 0;
                        _.forEach(model.psy_data.data, function(data) {
                            model.psy_data.psyTotalPara++;
                            if (data.color_hexadecimal == "#50D050") {
                                model.psy_data.passOutOf++;
                            }
                        });
                    }
                    })

                }



                },
                "business-customer": function(bundleModel, model, params) {
                    model.business = params;
                    for (i in params.enterpriseCustomerRelations) {
                        var r = params.enterpriseCustomerRelations[i];
                        if (model.customerId == r.linkedToCustomerId) {
                            model.enterpriseRelationship = r;
                            break;
                        }
                    }
                    if (model.business.centreId) {
                        var centreName = 
                        filterFilter(formHelper.enum('centre').data, {
                            value: model.business.centreId
                        });
                        if(centreName && centreName.length){
                           model.business.centreId=centreName[0].name;  
                        }
                          
                    }
                }
            },
            actions: {}
        }
    }
})