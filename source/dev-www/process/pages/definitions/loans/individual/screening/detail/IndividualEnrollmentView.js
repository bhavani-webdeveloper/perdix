define({
    pageUID: "loans.individual.screening.detail.IndividualEnrollmentView",
    pageType: "Engine",
    dependencies: ["$log", "Enrollment", "formHelper", "filterFilter", "irfCurrencyFilter", "Model_ELEM_FC", "CreditBureau", "irfElementsConfig"],
    $pageFn: function($log, Enrollment, formHelper, filterFilter, irfCurrencyFilter, Model_ELEM_FC, CreditBureau, irfElementsConfig) {
        return {
            "type": "schema-form",
            "title": "INDIVIDUAL_ENROLLMENT",
            "subTitle": "",
            initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                var self =this;
                model.bundlePageObj = bundlePageObj;
                model.bundleModel = bundleModel;

                model.UIUDF = {
                    'family_fields': {},
                    'liability_fields': {},
                    'household_fields': {},
                    'bank_fields': {},
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
                    ].filter(a=>a).join(', ')+' - '+model.customer.pincode;

                    /*Family fields*/
                    model.UIUDF.family_fields.family_member_count = model.customer.familyMembers.length;
                    model.UIUDF.family_fields.dependent_family_member = 0;
                    model.UIUDF.family_fields.total_household_income = 0;
                    _.each(model.customer.familyMembers, function(member) {
                        if (member.incomes.length == 0)
                            model.UIUDF.family_fields.dependent_family_member++;
                        else {
                            _.each(member.incomes, function(income) {
                                model.UIUDF.family_fields.total_household_income += income.incomeEarned;
                            });
                        }
                    });
                    /*Liability fields*/
                    model.UIUDF.liability_fields.active_loans = model.customer.liabilities.length;
                    model.UIUDF.liability_fields.total_monthly_installment = 0;
                    model.UIUDF.liability_fields.outstandingAmount = 0;
                    model.UIUDF.liability_fields.loan_from_bank = 0;
                    model.UIUDF.liability_fields.loan_from_NBFC_MFI = 0;
                    model.UIUDF.liability_fields.loan_from_others = 0;
                    _.each(model.customer.liabilities, function(liability) {
                        model.UIUDF.liability_fields.total_monthly_installment +=  parseInt(liability.installmentAmountInPaisa);
                        model.UIUDF.liability_fields.outstandingAmount += parseInt(liability.outstandingAmountInPaisa);
                        switch (liability.loanSource) {
                            case "BANK":
                                model.UIUDF.liability_fields.loan_from_bank += parseInt(liability.loanAmountInPaisa);
                                break;
                            case "MFI/NBFC":
                                model.UIUDF.liability_fields.loan_from_NBFC_MFI += parseInt(liability.loanAmountInPaisa);
                                break;
                            default:
                                model.UIUDF.liability_fields.loan_from_others += parseInt(liability.loanAmountInPaisa);
                                break;

                        };
                    });

                    /*Household Assets field*/
                    model.UIUDF.household_fields.total_Assets = model.customer.physicalAssets.length; /* what assets i need to take*/
                    model.UIUDF.household_fields.total_Value = 0;
                    _.each(model.customer.physicalAssets, function(Assets) {
                        model.UIUDF.household_fields.total_Value += Assets.ownedAssetValue;
                    });

                    /*Bank fields*/
                    model.UIUDF.bank_fields.bankStatements = [];
                    model.UIUDF.bank_fields.total_Deposit = 0;
                    model.UIUDF.bank_fields.total_Withdrawals = 0;
                    model.UIUDF.bank_fields.avg_deposit = 0;
                    model.UIUDF.bank_fields.avg_withdrawals = 0;
                    model.UIUDF.bank_fields.avg_bal_EMI_date;
                    model.UIUDF.bank_fields.tot_accounts = model.customer.customerBankAccounts.length;
                    model.UIUDF.bank_fields.tot_checque_bounce = 0;
                    model.UIUDF.bank_fields.tot_EMI_bounce = 0;
                    model.UIUDF.bank_fields.total_bankstatement = 0;
                    model.UIUDF.bank_fields.avgMonBal=0;
                    _.each(model.customer.customerBankAccounts, function(account) {
                        _.each(account.bankStatements, function(bankslips) {
                            model.UIUDF.bank_fields.bankStatements.push(bankslips);
                            model.UIUDF.bank_fields.total_Deposit += parseInt(bankslips.totalDeposits);
                            model.UIUDF.bank_fields.total_Withdrawals += parseInt(bankslips.totalWithdrawals);
                            model.UIUDF.bank_fields.total_bankstatement++;
                            model.UIUDF.bank_fields.tot_checque_bounce += bankslips.noOfChequeBounced;
                            model.UIUDF.bank_fields.tot_EMI_bounce += bankslips.noOfEmiChequeBounced;

                        });
                    });
                    if (model.UIUDF.bank_fields.total_bankstatement != 0) {
                        model.UIUDF.bank_fields.avg_deposit = Math.round(model.UIUDF.bank_fields.total_Deposit / model.UIUDF.bank_fields.total_bankstatement);
                        model.UIUDF.bank_fields.avg_withdrawals = Math.round(model.UIUDF.bank_fields.total_Withdrawals / model.UIUDF.bank_fields.total_bankstatement);
                        model.UIUDF.bank_fields.avgMonBal = Math.abs(Math.round(model.UIUDF.bank_fields.avg_deposit-model.UIUDF.bank_fields.avg_withdrawals));
                    }

                    /*Cibil/highmark fields*/


                      /*Reference Check fields*/
                    model.UIUDF.REFERENCE_CHECK_RESPONSE = 'NA';
                    var count_neg_response = 0;
                    _.each(model.customer.verifications, function(verification) {
                        if (verification.customerResponse != 'positive' && verification.customerResponse != null) {
                            count_neg_response++;
                        }
                    })
                    if (count_neg_response >= 1) {
                        model.UIUDF.REFERENCE_CHECK_RESPONSE = 'negative';
                    } else {
                        model.UIUDF.REFERENCE_CHECK_RESPONSE = 'positive';
                    }


                    /*Household fields */
                    
                    var decExpanse =0;

                    _.each(model.customer.expenditures,function(expanse){
                        decExpanse += parseInt(expanse.annualExpenses);

                    })
                    model.decHouseExpanse =decExpanse;

                                      /*Family Section*/
                    self.form= self.formSource;
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
                                        "data": "",
                                        render: function(data, type, full, meta) {
                                            if (full.incomes[0])
                                                return full.incomes[0].incomeSource;
                                            return "NA";
                                        }
                                    }, {
                                        "title": "INCOME",
                                        "data": "",
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
                });

                CreditBureau.getCBDetails({"customerId": model.customerId}).$promise.then(function(res) {
                    $log.warn("res");
                    $log.warn(res);
                    model.cibil_highmark = res;
                    model.UIUDF.cibil.cibil_score = res.cibil.cibilScore[0].score;
                    model.UIUDF.cibil.active_accounts = res.cibil.cibilLoanSummaryInfo[0].totalAccounts;
                    model.UIUDF.cibil.overdue_accounts = res.cibil.cibilLoanSummaryInfo[0].overDueAccounts;
                    model.UIUDF.cibil.sanctioned_amount = res.cibil.cibilLoanDetails[0].highCreditOrSanctionedAmount;
                    model.UIUDF.cibil.current_balance = res.cibil.cibilLoanSummaryInfo[0].currentBalance;
                    model.UIUDF.cibil.amount_overdue = res.cibil.cibilLoanSummaryInfo[0].amountOverDue;
                    // model.UIUDF.cibil.report = '<a href="" class="color-theme">Download</a>';

                    model.UIUDF.highmark.score = res.highMark.highmarkScore;
                    var highmarkFields = $(res.highMark.reportHtml).find('.subHeader1').parent().parent().children(':last').find('.AccValue');
                    model.UIUDF.highmark.active_accounts = highmarkFields[1].innerText.trim();
                    model.UIUDF.highmark.overdue_accounts = highmarkFields[2].innerText.trim();
                    model.UIUDF.highmark.current_balance = highmarkFields[3].innerText.trim() + ' ' + irfElementsConfig.currency.iconHtml;
                    model.UIUDF.highmark.disbursed_amount = highmarkFields[4].innerText.trim() + ' ' + irfElementsConfig.currency.iconHtml;
                    // model.UIUDF.highmark.report = '<a href="" class="color-theme">Download</a>';
                }, function(e) {
                    model.cibil_highmark = null;
                });
            },

             form: [],
            formSource: [{
                    "type": "section",
                    "html": `
<div class="col-sm-6"><i class="fa fa-check-circle text-green" style="font-size:x-large">&nbsp;</i><em class="text-darkgray">Existing Customer</em><br>&nbsp;</div>
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
                                "key": "customer.aadhaarNo",
                                "title": "ID - Aadhar No."
                            }, {
                                "key": "customer.identityProofNo",
                                "title": "ID - PAN no."
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
                    "title": "HOUSEHOLD_LIABILITIES",
                    "condition": "model.UIUDF.liability_fields.active_loans !=0",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "UIUDF.liability_fields.active_loans",
                                "title": "No of Active Loans",
                                "type": "number"
                            }, {
                                "key": "UIUDF.liability_fields.total_monthly_installment",
                                "title": "Total Monthly Instalments",
                                "type": "amount"
                            }, {
                                "key": "UIUDF.liability_fields.outstandingAmount",
                                "title": "OUTSTANDING_AMOUNT",
                                "type": "amount"
                            }]

                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "UIUDF.liability_fields.loan_from_bank",
                                "title": "Total loan amount from Banks",
                                "type": "amount"

                            }, {
                                "key": "UIUDF.liability_fields.loan_from_NBFC_MFI",
                                "title": "Total loan amount from MFI/NBFC",
                                "type": "amount"

                            }, {
                                "key": "UIUDF.liability_fields.loan_from_others",
                                "title": "Total loan amount from others",
                                "type": "amount"

                            }]

                        }]
                    }, {
                        "type": "expandablesection",
                        "items": [{
                            "type": "tableview",
                            "key": "customer.liabilities",
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
                                    "title": "Loan Type",
                                    "data": "loanType"
                                }, {
                                    "title": "loan_source",
                                    "data": "loanSource"
                                }, {
                                    "title": "loan Amount",
                                    "data": "loanAmountInPaisa",
                                    render: function(data, type, full, meta) {
                                        return irfCurrencyFilter(full.loanAmountInPaisa)
                                    }
                                }, {
                                    "title": "Installment Amount",
                                    "data": "installmentAmountInPaisa",
                                    render: function(data, type, full, meta) {
                                        return irfCurrencyFilter(full.installmentAmountInPaisa)
                                    }
                                }, {
                                    "data": "outstandingAmountInPaisa",
                                    "title": "OUTSTANDING_AMOUNT",
                                    render: function(data, type, full, meta) {
                                        return irfCurrencyFilter(full.outstandingAmountInPaisa)
                                    }
                                }, {
                                    "title": "Loan Purpose",
                                    "data": "liabilityLoanPurpose"

                                }, {
                                    "title": "START_DATE",
                                    "data": "startDate"
                                }, {
                                    "title": "MATURITY_DATE",
                                    "data": "maturityDate"
                                }, {
                                    "data": "noOfInstalmentPaid",
                                    "type": "number",
                                    "title": "NO_OF_INSTALLMENT_PAID"
                                }, {
                                    "title": "Frequency of Installments",
                                    "data": "frequencyOfInstallment"
                                }, {
                                    "data": "interestOnly",
                                    "title": "INTEREST_ONLY"
                                }, {
                                    "data": "interestRate",
                                    "type": "number",
                                    "title": "RATE_OF_INTEREST"
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
                                        if(data)
                                        return irfCurrencyFilter(data)
                                     else return "NA"
                                }}];
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
                    "title": "Bank Account Detail",
                    "condition": "model.customer.customerBankAccounts.length != 0",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "UIUDF.bank_fields.avg_deposit",
                                "title": "Average Monthly Deposit",
                                "type": "amount"
                            }, {
                                "key": "UIUDF.bank_fields.avg_withdrawals",
                                "title": "Average Monthly Withdrawals",
                                "type": "amount"
                            }, {
                                "key": "UIUDF.bank_fields.avgMonBal",
                                "title": "Average Monthly Balances",
                                "type": "amount"
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "UIUDF.bank_fields.tot_accounts",
                                "title": "Total no of Account",
                                "type": "number"
                            }, {
                                "key": "UIUDF.bank_fields.tot_checque_bounce",
                                "title": "Total no of Cheque Bounce",
                                "type": "number"
                            }, {
                                "key": "UIUDF.bank_fields.tot_EMI_bounce",
                                "title": "Total no EMI Bounce",
                                "type": "number"
                            }]
                        }]
                    }, {
                        "type": "expandablesection",
                        "items": [{
                            "type": "tableview",
                            "key": "customer.customerBankAccounts",
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
                                    "data": "customerBankName"
                                }, {
                                    "title": "Branch Name",
                                    "data": "customerBankBranchName"
                                }, {
                                    "title": "IFSC Code",
                                    "data": "ifscCode"
                                }, {
                                    "title": "Account Number",
                                    "data": "accountNumber",
                                    "type": "password",
                                    "inputmode": "number",
                                    "numberType": "tel"
                                }, {
                                    "title": "Average Bank Balance",
                                    "data": "BankAvgBal"
                                }, {
                                    "title": "Average Bank Deposit",
                                    "data": "BankAvgDep"
                                }, {
                                    "title": "Account Name",
                                    "data": "customerNameAsInBank"
                                }, {
                                    "title": "Account Type",
                                    "data": "accountType"
                                }, {
                                    "title": "BANKING_SINCE",
                                    "data": "bankingSince"

                                }, {
                                    "title": "NET_BANKING_AVAILABLE",
                                    "data": "netBankingAvailable"
                                }, {
                                    "title": "Limit",
                                    "data": "limit"
                                }, {

                                    "title": "Bank Statement's",
                                    "data": "",
                                    render: function(data, type, full, meta) {
                                        var title = [];
                                        var url = [];
                                        for (i = 0; i < full.bankStatements.length; i++) {
                                            url.push(Model_ELEM_FC.fileStreamUrl + "/" + full.bankStatements[i].bankStatementPhoto);
                                            title.push(moment(full.bankStatements[i].startMonth).format('MMMM YYYY'));
                                        }
                                        //return '<div  ng-repeat = "i in ' + full.bankStatements + 'track by $index"  ><p><a  href="' + url + '[$index] ">' + title + '[$index]</a></p></div>'
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
                                "type": "number"
                            }, {
                                "key": "UIUDF.cibil.current_balance",
                                "title": "Current Balance",
                                "type": "number"
                            }, {
                                "key": "UIUDF.cibil.amount_overdue",
                                "title": "Overdue Balance",
                                "type": "number"
                            }/*, {
                                "key": "UIUDF.cibil.report",
                                "title": "Report",
                                "type": "html"
                            }*/]
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
                            }/*, {
                                "key": "UIUDF.highmark.report",
                                "title": "Report",
                                "type": "html"
                            }*/]
                        }]
                    }]
                }, {
                    "type": "box",
                    "colClass": "col-sm-12",
                    "title": "Psychometric",
                    "readonly": true,
                    "condition": "model.bundlePageObj.pageClass != 'guarantor' ",
                    "items": [{
                        "type": "section",
                        "html": '<table class="table table-responsive">' +
                            '<colgroup>' +
                            '<col width="30%"> <col width="30%"> <col width="30%">' +
                            '</colgroup>' +
                            '<tbody>' +
                            '<tr><td>Psychometric Score</td>' +
                            '<td>Passed {{model.psy_data.passOutOf}} out of {{model.psy_data.psyTotalPara}} parameters</td>' +
                            '<td>{{model.psy_data.summary["Total Score"]}}</td></tr></tbody></table>'
                    }, {
                        "type": "expandablesection",
                        "items": [{
                            "type": "section",
                            "colClass": "col-sm-12",
                            "html": '<div ng-init="_scores=model.psy_data">' +
                                '<table class="table table-responsive">' +
                                '<colgroup>' +
                                '<col width="20%"> <col width="10%"> <col width="5%"><col width="20%">' +
                                '</colgroup>' +
                                '<tbody style="border:0px;">' +
                                '<tr>' +
                                '<th>Parameter Name</th>' +
                                '<th>Cut Off </th>' +
                                '<th></th>' +
                                '<th>Score</th>' +
                                '</tr>' +
                                '<tr ng-repeat=" (key, value) in _scores.data" ng-init="parameterIndex=$index">' +
                                '<td >{{key}}</td>' +
                                '<td >{{value["Cut Off Score"]}}</td>' +
                                '<td ><span class="square-color-box" style="background:{{_scores.data[key].color_hexadecimal}}"> </span></td>' +
                                '<td>{{value["Score"]}}</td></tr>' +
                                '<tr ng-repeat=" (key, value) in _scores.summary" ng-init="parameterIndex=$index">' +
                                '<td ng-style = "{\'font-weight\': \'bold\'}">{{key}}</td>' +
                                '<td ></td>' +
                                '<td ></td>' +
                                '<td > {{_scores.summary[key]}}</td></tr>' +
                                '</tbody>' +
                                '</table>' +
                                '</div>'
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
                }, {
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
                    }, {
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
                    }]
                }, {
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
                            "title": "KYC-Aadhar Card",
                            "preview": "pdf",
                            "using": "scanner"
                        }, {

                            "key": "customer.addressProofImageId",
                            "type": "file",
                            "notitle": true,
                            "title": "KYC-PAN Card",
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
                }

            ],

            schema: function() {
                return Enrollment.getSchema().$promise;
            },
            eventListeners: {
                "financial-summary": function(bundleModel, model, params) {
                    model.bankDetails =params[10].BankAccounts;
                    model.BankAvgBal=0;
                    model.BankAvgDep=0;
                    _.each(model.bankDetails,function(bankDetails){
                        if(bankDetails['Customer Relation']=='Applicant'){
                            model.BankAvgBal += bankDetails['Average Bank Balance'];
                            model.BankAvgDep += bankDetails['Average Bank Deposit'];
                        }




                    })
                    model._scores = params;
                    model.psychometricScores = model._scores[14].sections;
                    model.houseHoldPL = model._scores[7].sections;
                    model.coapp_count = 0;
                    model.psy_coapp_count = 1;
                    switch (model.bundlePageObj.pageClass) {
                        case 'applicant':
                            model.household_data = model.houseHoldPL[model.houseHoldPL.length - 1];
                            model.psy_data = model.psychometricScores[0];
                            break;
                        case 'co-applicant':
                            model.household_data = model.houseHoldPL[model.coapp_count];
                            model.coapp_count++;
                            model.psy_data = model.psychometricScores[model.psy_coapp_count];
                            model.psy_coapp_count++
                                break;
                    };
                    if (model.psy_data && (model.bundlePageObj.pageClass == 'applicant' || model.bundlePageObj.pageClass == 'co-applicant')) {
                        model.psy_data.passOutOf = 0;
                        model.psy_data.psyTotalPara = 0;
                        _.forEach(model.psy_data.data, function(data) {
                            model.psy_data.psyTotalPara++;
                            if (data.color_hexadecimal == "#50D050") {
                                model.psy_data.passOutOf++;
                            }
                        });
                    }

                    if (model.bundlePageObj.pageClass == 'applicant' || model.bundlePageObj.pageClass == 'co-applicant') {
                        model.household_data.data[0]['Total Incomes'] = parseInt(model.household_data.data[0]['Salary from business']) + parseInt(model.household_data.data[0]['Other Income/salaries']) + parseInt(model.household_data.data[0]['Family Member Incomes']);
                        model.household_data.data[0]['Total Expenses'] = parseInt(model.household_data.data[0]['Expenses Declared or based on the educational expense whichever is higher']) + parseInt(model.household_data.data[0]['EMI\'s of household liabilities']);
                        model.household = [];
                        model.household.push({
                            income: model.household_data.data[0]['Total Incomes'],
                            salaryFromBusiness: model.household_data.data[0]['Salary from business'],
                            otherIncomeSalaries: model.household_data.data[0]['Other Income/salaries'],
                            familyMemberIncomes: model.household_data.data[0]['Family Member Incomes'],
                            Expenses: model.household_data.data[0]['Total Expenses'],
                            declaredEducationExpense: model.household_data.data[0]['Expenses Declared or based on the educational expense whichever is higher'],
                            emiHouseholdLiabilities: model.household_data.data[0]['EMI\'s of household liabilities'],
                            netHouseholdIncome: model.household_data.data[0]['Net Household Income']
                        });
                        model.household_new = model.household[0];
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