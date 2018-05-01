define({
    pageUID: "irep.loans.individual.origination.detail.IndividualEnrollmentView",
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
                        }, {
                            "type": "expandablesection",
                            "items": [{
                                "type": "tableview",
                                "key": "customer.familyMembers",
                                "transpose": true,
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
                                        "title": "FULL_NAME",
                                        "data": "familyMemberFirstName",
                                        render: function(data, type, full, meta) {
                                            if (full.relationShip == "self")
                                                return model.customer.firstName;
                                            return full.familyMemberFirstName;
                                        }
                                    }, {
                                        "title": "RELATIONSHIP",
                                        "data": "relationShip",
                                        render: function(data, type, full, meta) {
                                            if (full.relationShip != null)
                                                return full.relationShip;
                                            return "NA";
                                        }
                                    }, {
                                        "title": "T_EDUCATION_STATUS",
                                        "data": "educationStatus",
                                        render: function(data, type, full, meta) {
                                            if (full.educationStatus != null)
                                                return full.educationStatus;
                                            return "NA";
                                        }
                                    }, {
                                        "title": "ANNUAL_EDUCATION_FEE",
                                        "data": "anualEducationFee",
                                        render: function(data, type, full, meta) {
                                            if (full.anualEducationFee != null)
                                                return irfCurrencyFilter(full.anualEducationFee);
                                            return "NA";
                                        }
                                    }, {
                                        "title": "INCOME_SOURCE",
                                        "data": "incomeSource",
                                        render: function(data, type, full, meta) {
                                            if (full.incomes[0])
                                                return full.incomes[0].incomeSource;
                                            return "NA";
                                        }
                                    }, {
                                        "title": "INCOME",
                                        "data": "incomeEarned",
                                        render: function(data, type, full, meta) {
                                            if (full.incomes[0])
                                                return irfCurrencyFilter(full.incomes[0].incomeEarned);
                                            return "NA";
                                        }
                                    }];
                                },
                                getActions: function() {
                                    return [];
                                }
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
                    model.cibil_equifax = res;
                    if (res.cibil != null) {
                        model.UIUDF.cibil.cibil_score = res.cibil.cibilScore[0].score;
                        model.UIUDF.cibil.active_accounts = res.cibil.cibilLoanSummaryInfo[0].totalAccounts;
                        model.UIUDF.cibil.overdue_accounts = res.cibil.cibilLoanSummaryInfo[0].overDueAccounts;
                        model.UIUDF.cibil.sanctioned_amount = res.cibil.cibilLoanDetails[0].highCreditOrSanctionedAmount;
                        model.UIUDF.cibil.current_balance = res.cibil.cibilLoanSummaryInfo[0].currentBalance;
                        model.UIUDF.cibil.amount_overdue = res.cibil.cibilLoanSummaryInfo[0].amountOverDue;
                        // model.UIUDF.cibil.report = '<a href="" class="color-theme">Download</a>';
                    }
                    if (res.highMark != null) {
                        model.UIUDF.highmark.score = res.highMark.highmarkScore;
                        var highmarkFields = $(res.highMark.reportHtml).find('.subHeader1').parent().parent().children(':last').find('.AccValue');
                        model.UIUDF.highmark.active_accounts = highmarkFields[1].innerText.trim();
                        model.UIUDF.highmark.overdue_accounts = highmarkFields[2].innerText.trim();
                        model.UIUDF.highmark.current_balance = highmarkFields[3].innerText.trim() + ' ' + irfElementsConfig.currency.iconHtml;
                        model.UIUDF.highmark.disbursed_amount = highmarkFields[4].innerText.trim() + ' ' + irfElementsConfig.currency.iconHtml;
                        // model.UIUDF.highmark.report = '<a href="" class="color-theme">Download</a>';
                    }
                    if (res.equifax != null) {
                        model.UIUDF.equifax.score = res.equifax.equifaxScore;
                        var equifaxFields = $(res.equifax.reportHtml).find('.subHeader1').parent().parent().children(':last').find('.AccValue');
                        model.UIUDF.equifax.active_accounts = equifaxFields[1].innerText.trim();
                        model.UIUDF.equifax.overdue_accounts = equifaxFields[2].innerText.trim();
                        model.UIUDF.equifax.current_balance = equifaxFields[3].innerText.trim() + ' ' + irfElementsConfig.currency.iconHtml;
                        model.UIUDF.equifax.disbursed_amount = equifaxFields[4].innerText.trim() + ' ' + irfElementsConfig.currency.iconHtml;
                        // model.UIUDF.highmark.report = '<a href="" class="color-theme">Download</a>';
                    }

                }, function(e) {
                    model.cibil_equifax = null;
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
                                "key": "customer.caste",
                                "title": "CASTE"
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
                }, {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "overrideType": "default-view",
                    "title": "HOUSE_DETAILS",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "customer.ownership",
                                "title": "PREMISES_OWNERSHIP",
                                "type": "string"
                            },{
                                "key": "customer.place"
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "customer.udf.userDefinedFieldValues.udf3",
                                "title":"RENT_LEASE_STATUS",
                                "type": "string"
                            },{
                                "key": "customer.udf.userDefinedDateFieldValues.udfDate1",
                                "title":"RENT_LEASE_AGREEMENT_VALID_TILL",
                                "type": "string"
                            }]
                        }]
                    }]
                }, {
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
                    }, {
                        "type": "expandablesection",
                        "items": [{
                            "type": "tableview",
                            "key": "UIUDF.bankAccount",
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
                                    "title": "Bank Name",
                                    "data": "customerBankName",
                                    render: function(data, type, full, meta) {
                                        return full['Bank Name']
                                    }
                                }, {
                                    "title": "Branch Name",
                                    "data": "customerBankBranchName",
                                    render: function(data, type, full, meta) {
                                        if (data) return data;
                                        return "NA"

                                    }
                                }, {
                                    "title": "IFSC Code",
                                    "data": "ifscCode",
                                    render: function(data, type, full, meta) {
                                        return full['IFS Code']
                                    }
                                }, {
                                    "title": "Account Number",
                                    "data": "accountNumber",
                                    render: function(data, type, full, meta) {
                                        return full['Account Number']
                                    }
                                }, {
                                    "title": "Average Bank Balance",
                                    "data": "BankAvgBal",
                                    render: function(data, type, full, meta) {
                                        return irfCurrencyFilter(full['Average Bank Balance'])
                                    }
                                }, {
                                    "title": "Average Bank Deposit",
                                    "data": "BankAvgDep",
                                    render: function(data, type, full, meta) {
                                        return irfCurrencyFilter(full['Average Bank Deposit'])
                                    }
                                }, {
                                    "title": "Account Name",
                                    "data": "customerNameAsInBank",
                                    render: function(data, type, full, meta) {
                                        return full['Account Holder Name']
                                    }
                                }, {
                                    "title": "Account Type",
                                    "data": "accountType",
                                    render: function(data, type, full, meta) {
                                        return full['Account Type']
                                    }
                                }, {
                                    "title": "BANKING_SINCE",
                                    "data": "bankingSince",
                                    render: function(data, type, full, meta) {
                                        return full['Banking Since']
                                    }

                                }, {
                                    "title": "NET_BANKING_AVAILABLE",
                                    "data": "netBankingAvailable",
                                    render: function(data, type, full, meta) {
                                        return full['Net Banking Available']
                                    }
                                }, {
                                    "title": "Limit",
                                    "data": "limit",
                                    render: function(data, type, full, meta) {
                                        return full.Limit;
                                    }
                                }, {
                                    "title": "Bank Statement's",
                                    "data": "",
                                    render: function(data, type, full, meta) {
                                        var title = [];
                                        var url = [];
                                        for (i = 0; i < full.BankStatements.length; i++) {
                                            url.push(Model_ELEM_FC.fileStreamUrl + "/" + full.BankStatements[i]['Bank Statement File ID']);
                                            title.push(moment(full.BankStatements[i].Month).format('MMMM YYYY'));
                                        }
                                        //return '<div  ng-repeat = "i in ' + url + '"  ><p ng-repeat="j in'+title+'"><a  href={{i}} style="cursor:pointer">{{j}}</a></p></div>'
                                        /*return data?'<a ng-href="'+Model_ELEM_FC.fileStreamUrl+'/'+data+'" style="cursor:pointer"></a>':'';*/

                                        return '<div >' +
                                            '<a  href="' + url[0] + '">' + title[0] + '</a><br>' +
                                            '<a  href="' + url[1] + '">' + title[1] + '</a><br>' +
                                            '<a  href="' + url[2] + '">' + title[2] + '</a><br>' +
                                            '<a  href="' + url[3] + '">' + title[3] + '</a><br>' +
                                            '<a  href="' + url[4] + '">' + title[4] + '</a><br>' +
                                            '<a  href="' + url[5] + '">' + title[5] + '</a><br>' +
                                            '</div>'
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
                    }, {
                        "type": "expandablesection",
                        "items": [{
                            "type": "tableview",
                            "key": "UIUDF.liabilities",
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
                                    "title": "loan_source",
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
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "overrideType": "default-view",
                    "title": "Household Assets",
                    "condition": "model.UIUDF.household_fields.total_Assets !=0",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "UIUDF.household_fields.total_Assets",
                                "title": "Total Assets",
                                "type": "number"
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "UIUDF.household_fields.total_Value",
                                "title": "Total Value",
                                "type": "amount"
                            }]
                        }]
                    }, {
                        "type": "expandablesection",
                        "items": [{
                            "type": "tableview",
                            "key": "customer.physicalAssets",
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
                                    "title": "ASSET_TYPE",
                                    "data": "nameOfOwnedAsset"
                                }, {
                                    "title": "REGISTERED_OWNER",
                                    "data": "registeredOwner"

                                }, {
                                    "title": "Asset Value",
                                    "data": "ownedAssetValue",
                                    render: function(data, type, full, meta) {
                                        if (data)
                                            return irfCurrencyFilter(data)
                                        else return "NA"
                                    }
                                }, {
                                    "title": "AREA_UNITS_OF_ASSETS",
                                    "data": "unit"
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
                    "title": "CIBIL/Equifax",
                    "readonly": true,
                    "condition": "model.cibil_equifax",
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
                                    "key": "UIUDF.equifax.score",
                                    "title": "Equifax Score"
                                }, {
                                    "key": "UIUDF.equifax.active_accounts",
                                    "title": "Active Accounts"
                                }, {
                                    "key": "UIUDF.equifax.overdue_accounts",
                                    "title": "Overdue Account"
                                }, {
                                    "key": "UIUDF.equifax.current_balance",
                                    "title": "Total Current Balance",
                                    "type": "number"
                                }, {
                                    "key": "UIUDF.equifax.disbursed_amount",
                                    "title": "Amount Disbursed",
                                    "type": "number"
                                }
                            ]
                        }]
                    }]
                }, {
                    "type": "box",
                    "colClass": "col-sm-12",
                    "readonly": true,
                    "title": "Household P&L",
                    "condition": "model.bundlePageObj.pageClass !='guarantor'",
                    "overrideType": "default-view",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "household_new.income",
                                "title": "Income",
                                "type": "amount"
                            }, {
                                "key": "household_new.Expenses",
                                "title": "Expenses",
                                "type": "amount"
                            }, {
                                "key": "household_new.netHouseholdIncome",
                                "title": "Net Household Income",
                                "type": "amount"

                            }]
                        }]
                    }, {
                        "type": "expandablesection",
                        "items": [{
                            "type": "section",
                            "colClass": "col-sm-12",
                            "html": '<div ng-init="household = model.household_new">' +
                                '<table class="table">' +
                                '<colgroup>' +
                                '<col width="30%"> <col width="40%"> <col width="30%">' +
                                '</colgroup>' +
                                '<tbody>' +
                                '<tr class="table-sub-header"> <th>{{"INCOME" | translate}}</th> <th></th> <th>{{household.income | irfCurrency}}</th> </tr>' +
                                '<tr> <td></td> <td>{{"SALARY_FROM_BUSINESS" | translate}}</td> <td>{{household.salaryFromBusiness | irfCurrency}}</td> </tr>' +
                                '<tr> <td></td> <td>{{"OTHER_INCOME_SALARIES" | translate}}</td> <td>{{household.otherIncomeSalaries | irfCurrency}}</td> </tr>' +
                                '<tr> <td></td> <td>{{"FAMILY_MEMBER_INCOMES" | translate}}</td> <td>{{household.familyMemberIncomes | irfCurrency}}</td> </tr>' +
                                '<tr class="table-sub-header"> <th>{{"EXPENSES" | translate}}</th> <th></th> <th>{{household.Expenses | irfCurrency}}</th> </tr>' +
                                '<tr> <td></td> <td>{{"DECLARED_EDUCATIONAL_EXPENSE" | translate}}</td> <td>{{household.declaredEducationExpense | irfCurrency}}</td> </tr>' +
                                '<tr> <td></td> <td>{{"EMI_HOUSEHOLD_LIABILITIES" | translate}}</td> <td>{{household.emiHouseholdLiabilities | irfCurrency}}</td> </tr>' +
                                '<tr class="table-bottom-summary"> <td>{{"NET_HOUSEHOLD_INCOME" | translate}}</td> <td></td> <td>{{household.netHouseholdIncome | irfCurrency}}</td> </tr>' +
                                '</tbody>' +
                                '</table>' + '</div>'
                        }]
                    }]
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
                    model.customer = model.enrolmentProcess.customer;
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
                        model.business.centreName = filterFilter(formHelper.enum('centre').data, {
                            value: model.business.centreId
                        })[0].name;
                    }
                }
            },
            actions: {}
        }
    }
})