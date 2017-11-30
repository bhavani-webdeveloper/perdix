define({
    pageUID: "loans.individual.screening.detail.IndividualEnrollmentView",
    pageType: "Engine",
    dependencies: ["$log", "$state", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q","irfProgressMessage","$stateParams","$state",
    "PageHelper", "Utils","PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "Dedupe","$resource","$httpParamSerializer","BASE_URL","searchResource"],
    $pageFn: function($log, $state, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,irfProgressMessage,$stateParams,$state,
     PageHelper, Utils,PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, Dedupe,$resource,$httpParamSerializer,BASE_URL, searchResource){
        return {
            "type": "schema-form",
            "title": "INDIVIDUAL_ENROLLMENT",
            "subTitle": "",
            initialize: function(model, form, formCtrl,bundlePageObj, bundleModel) {
                model.bundleModel = bundleModel;
                model.psychometricScores=[];
                Enrollment.getCustomerById({id:model.customerId}).$promise.then(function(res) {
                    model.customer = res;
                    switch (bundlePageObj.pageClass) {
                        case 'applicant':
                            model.bundleModel.applicant = res;
                        break;
                        case 'co-applicant':
                            model.bundleModel.coApplicants.push(res);
                        break;
                        case 'guarantors':
                            model.bundleModel.guarantors.push(res);
                        break;
                    };

                    model.custom_fields={ 'family_fields':{},
                                        'liability_fields':{},
                                        'household_fields':{},
                                        'bank_fields':{}
                                        };
                                        
        /*Auto_Custom fields -- START */
            /*Family fields*/
                    model.custom_fields.family_fields.family_member_count=model.customer.familyMembers.length +1;
                    model.custom_fields.family_fields.dependent_family_member=0;
                    model.custom_fields.family_fields.total_household_income=0;
                    _.each(model.customer.familyMembers, function(member){
                        if(member.incomes.length==0)
                            model.custom_fields.family_fields.dependent_family_member++;
                        else{
                            _.each(member.incomes,function(income){
                                    model.custom_fields.family_fields.total_household_income+=income.incomeEarned;
                            });
                        }
                    });
            /*Liability fields*/
                model.custom_fields.liability_fields.active_loans             = model.customer.liabilities.length;
                model.custom_fields.liability_fields.total_monthly_installment= 0;
                model.custom_fields.liability_fields.loan_from_bank           =0;
                model.custom_fields.liability_fields.loan_from_NBFC_MFI       =0;
                model.custom_fields.liability_fields.loan_from_others         =0;
                _.each(model.customer.liabilities, function(liability)
                    {
                        model.custom_fields.liability_fields.total_monthly_installment          += liability.installmentAmountInPaisa;
                        switch(liability.loanSource){
                            case "BANK":
                                        model.custom_fields.liability_fields.loan_from_bank     += liability.loanAmountInPaisa;
                                        break;
                            case "MFI/NBFC":
                                        model.custom_fields.liability_fields.loan_from_NBFC_MFI += liability.loanAmountInPaisa;
                                        break;          
                            default:
                                    model.custom_fields.liability_fields.loan_from_others   += liability.loanAmountInPaisa;
                                    break;
        
                        };
                    }
                );

            /*Household Assets field*/
                model.custom_fields.household_fields.total_Assets =model.customer.enterpriseAssets.length; /* what assets i need to take*/
                model.custom_fields.household_fields.total_Value=0;
                _.each(model.customer.enterpriseAssets, function(Assets)
                    {
                        model.custom_fields.household_fields.total_Value += Assets.valueOfAsset;
                    }
                );

            /*Bank fields*/
                model.custom_fields.bank_fields.total_Deposit;
                model.custom_fields.bank_fields.total_Withdrawals;
                model.custom_fields.bank_fields.avg_deposit;
                model.custom_fields.bank_fields.avg_withdrawls;
                model.custom_fields.bank_fields.avg_bal_EMI_date;
                model.custom_fields.bank_fields.tot_accounts       =model.customer.customerBankAccounts.length;
                model.custom_fields.bank_fields.tot_checque_bounce =0;
                model.custom_fields.bank_fields.tot_EMI_bounce     =0;
                model.custom_fields.bank_fields.total_bankstatement=0;
                _.each(model.customer.customerBankAccounts, function(account)
                    {
                        _.each(account.bankStatements, function(bankslips)
                            {
                                model.custom_fields.bank_fields.total_Deposit      += bankslips.totalDeposits;
                                model.custom_fields.bank_fields.total_Withdrawls   += bankslips.totalWithdrawals;
                                model.custom_fields.bank_fields.total_bankstatement++;
                                model.custom_fields.bank_fields.tot_checque_bounce += bankslips.noOfChequeBounced;
                                model.custom_fields.bank_fields.tot_EMI_bounce     += bankslips.noOfEmiChequeBounced;

                            }
                        );
                    }
                );

                model.custom_fields.bank_fields.avg_deposit   =(model.custom_fields.bank_fields.total_Deposit/model.custom_fields.bank_fields.total_bankstatement);
                model.custom_fields.bank_fields.avg_withdrawls=(model.custom_fields.bank_fields.total_Withdrawls/model.custom_fields.bank_fields.total_bankstatement);

        /*Cibil/highmark fields*/
            var endpoint = BASE_URL;
            var cibil = $resource(endpoint, null, {
                                get:{
                                        method: 'GET',
                                        url: endpoint  + '/api/creditbureau/find'
                                    }                 
                         });

            cibil.get({customerId:model.customerId}).$promise.then(function(res){
                model.cibil_highmark=res;
            });

    /*Auto_Custom field -- END*/

                });
            },
            form: [{
                "type":"box",
                "readonly":true,
                "colClass": "col-sm-12",
                "title":"PERSONAL_DETAILS",
                "overrideType": "default-view",
                "items":[
                    {
                        "type": "grid",
                        "orientation":"horizontal",
                        "items": [
                            {
                                "type": "grid",
                                "orientation": "vertical",
                                "items":[
                                    {
                                        "key":"customer.id",
                                        "title":"Customer ID"
                                    },
                                    {
                                        "key":"customer.firstName",
                                        "title":"Applicant Name"
                                    },
                                    {
                                        "key":"customer.gender"
                                    },
                                    {
                                        "key":"customer.dateOfBirth"
                                    },
                                    {
                                        "key":"customer.aadhaarNo"
                                    },
                                    {
                                        "key":"customer.panNo"
                                    },
                                    {
                                        "key":"customer.language"
                                    },
                                    {
                                        "key":"customer.mobilePhone"
                                    },
                                    {
                                        "key":"customer.email"
                                    },
                                    {
                                        "key":"customer.verifications[].address",
                                        "type":"html"
                                    }
                                ]
                            },
                            {
                                "type":"grid",
                                "orientation":"vertical",
                                "items":[
                                    {
                                        "key":"customer.urnNo"
                                    },
                                    {
                                        "key":"customer.religion"
                                    },
                                    {
                                        "key":"customer.fatherFirstName"
                                    },/*{
                            "key":"customer.motherName"
                        },*/        {
                                        "key":"customer.maritalStatus"
                                    },
                                    {
                                        "key":"customer.spouseFirstName"
                                    },
                                    {
                                        "key":"customer.spouseDateOfBirth"
                                    }
                                ]
                            },
                            {
                                "type":"grid",
                                "orientation":"vertical",
                                "items":[
                                    {
                                        "key":"customer.photoImageId",
                                        "type":"file",
                                        "fileType":"image/*",
                                        "notitle":true
                                    }
                                ]

                            }
                        ]
                    }
                ]
            },
            {
                "type":"box",
                "readonly":true,
                "colClass":"col-sm-12",
                "overrideType": "default-view",
                "title":"Family",
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
                                                "key":"custom_fields.family_fields.family_member_count",
                                                "title":"No of Family members"
                                            },
                                            {
                                                "key":"custom_fields.family_fields.dependent_family_member",
                                                "title":"no of dependent family members"
                                            }
                                        ]
                                    },
                                    {
                                        "type":"grid",
                                        "orientation":"vertical",
                                        "items":[
                                            {
                                                "key":"custom_fields.family_fields.total_household_income",
                                                "title":"Total household income"
                                            },
                                            {
                                                "key":"customer.financialSummaries[].householdExpenses",
                                                "title":"Declared Household Expanditure"
                                            }
                                        ]
                                    }
                                ]

                            },
                            {
                                "type":"expandablesection",
                                "title":"CLICK_TO_VIEW_DETAILS",
                                "expanded":"false",
                                "items":[
                                    {
                                        "type": "tableview",
                                        "key": "customer.familyMembers",
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
                                                "title": "FULL_NAME",
                                                "data": "familyMemberFirstName"
                                            },
                                            {
                                                "title": "Relationship",
                                                "data": "relationShip"/*,
                                                render: function(data, type, full, meta) {
                                                    if (full.incomes[0])
                                                    return full.incomes[0].incomeEarned;
                                                    return 0;
                                                }*/
                                            },
                                            {
                                                "title": "Education Status",
                                                "data": "educationStatus"/*,
                                                render: function(data, type, full, meta) {
                                                    if (full.incomes[0])
                                                        return full.incomes[0].incomeEarned;
                                                        return 0;
                                                    }*/
                                            },
                                            {
                                                "title": "Income Source",
                                                "data": "familyMemberFirstName",
                                                render: function(data, type, full, meta) {
                                                        if (full.incomes[0])
                                                            return full.incomes[0].incomeSource;
                                                        return "NA";
                                                    }
                                            },
                                            {
                                                "title": "INCOME",
                                                "data": "familyMemberFirstName",
                                                render: function(data, type, full, meta) {
                                                    if (full.incomes[0])
                                                        return full.incomes[0].incomeEarned;
                                                    return "NA";
                                                    }
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
            },
            {
                "type":"box",
                "readonly":true,
                "colClass":"col-sm-12",
                "overrideType": "default-view",
                "title":"RELATIONSHIP_TO_BUSINESS",
                "items":[
                    {
                        "type":"grid",
                        "orientation":"vertical",
                        "items":[
                            {
                                "key":"customer.enterpriseCustomerRelations[].relationshipType"
                            },/*{
                        "key":"customer.enterpriseCustomerRelations.experience??"
                    },*/    {
                                "key":"customer.enterpriseCustomerRelations[].businessInvolvement"
                            },
                            {
                                "key":"customer.enterpriseCustomerRelations[].partnerOfAnyOtherCompany"
                            }
                        ]
                    }
                ]
            },
            {
                "type":"box",
                "readonly":true,
                "colClass":"col-sm-12",
                "overrideType": "default-view",
                "title":"Liabilities",
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
                                                "key":"custom_fields.liability_fields.active_loans",
                                                "title":"No of Active Laons"
                                            },
                                            {
                                                "key":"custom_fields.liability_fields.total_monthly_installment",
                                                "title":"Total monthly installments"
                                            },
                                            {
                                                "key":"",
                                                "title":"Total outstanding loan ammount"
                                            }
                                        ]

                                    },
                                    {
                                        "type":"grid",
                                        "orientation":"vertical",
                                        "items":[
                                            {
                                                "key":"custom_fields.liability_fields.loan_from_bank",
                                                "title":"Total loan amount for Banks"

                                            },
                                            {
                                                "key":"custom_fields.liability_fields.loan_from_NBFC_MFI",
                                                "title":"Total loan amount for MFI/NBFC"

                                            },
                                            {
                                                "key":"custom_fields.liability_fields.loan_from_others",
                                                "title":"Total loan amount from others"

                                            }
                                        ]

                                    }
                                ]
                            },
                            {
                                "type":"expandablesection",
                                "title":"CICK_TO_VIEW_DETAILS",
                                "expanded":"false",
                                "items":[
                                    {
                                        "type": "tableview",
                                        "key": "customer.liabilities",
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
                                                        "title": "Loan Type",
                                                        "data": "loanType"
                                                    },
                                                    {
                                                        "title": "Loan Source",
                                                        "data": "loanSource"
                                                    },
                                                    {
                                                        "title": "loan Amount",
                                                        "data": "loanAmountInPaisa"
                                                       /* render: function(data, type, full, meta) {
                                                        }*/

                                                    },
                                                    {
                                                        "title": "Installment Amount",
                                                        "data": "installmentAmountInPaisa"
                                                       /* render: function(data, type, full, meta) {
                                                            return full.liabilities.installmentAmountInPaiseall;
                                                        }*/
                                                    },
                                                    {
                                                        "title":"Start Date",
                                                        "data":"startDate"
                                                    },
                                                    {
                                                        "title":"Maturity Date",
                                                        "data":"maturityDate"
                                                    },
                                                    {
                                                        "title":"Freequency of Installments",
                                                        "data":"frequencyOfInstallment"
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
            },
            {
                "type":"box",
                "readonly":true,
                "colClass":"col-sm-12",
                "overrideType": "default-view",
                "title":"HOUSEHOLD_ASSETS",
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
                                                "key":"custom_fields.household_fields.total_Assets",
                                                "title":"Total Assets"
                                            }
                                        ]
                                    },
                                    {
                                        "type":"grid",
                                        "orientation":"vertical",
                                        "items":[
                                            {
                                                "key":"custom_fields.household_fields.total_Value",
                                                "title":"Total Value"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type":"expandablesection",
                                "title":"CLICK_TO_VIEW_DETAILS",
                                "expanded":"false",
                                "items":[
                                    {
                                        "type": "tableview",
                                        "key": "customer.enterpriseAssets",
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
                                                    "title": "Asset Type",
                                                    "data": "assetType"
                                                },
                                                {
                                                    "title": "Asset Value",
                                                    "data": "valueOfAsset"
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
            },
            {
                "type":"box",
                "readonly":true,
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "title":"BANK_ACCOUNT_DETAILS",
                "items":[{
                    "type":"grid",
                    "orientation":"vertical",
                    "items":[{
                     "type":"grid",
                     "orientation":"horizontal",
                     "items":[{
                        "type":"grid",
                        "orientation":"vertical",
                        "items":[{
                            "key":"custom_fields.bank_fields.avg_deposit",
                            "title":"Average Monthly Deposit"
                        },{
                            "key":"custom_fields.bank_fields.avg_withdrawls",
                            "title":"Average Monthly Withdrawls"
                        },{
                            "key":"",
                            "title":"Average Monthly Balance on requested EMI Date"
                        }]
                    },{
                        "type":"grid",
                        "orientation":"vertical",
                        "items":[{
                            "key":"custom_fields.bank_fields.tot_accounts",
                            "title":"Total no of Account"
                        },{
                            "key":"custom_fields.bank_fields.tot_checque_bounce",
                            "title":"Total no of Cheque Bounce"
                        },{
                            "key":"custom_fields.bank_fields.tot_EMI_bounce",
                            "title":"Total no EMI Bounce"
                        }]
                    }]
                },{
                    "type":"expandablesection",
                    "title":"CLICK_TO_VIEW_DETAIL",
                    "expanded":"false",
                    "items":[{
                            "type": "tableview",
                            "key": "customer.customerBankAccounts",
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
                                    "title": "Bank Name",
                                    "data": "customerBankName"
                                },{
                                    "title": "IFSC Code",
                                    "data": "ifscCode"
                                },{
                                    "title": "Account Name",
                                    "data": "customerNameAsInBank"
                                },{
                                    "title": "Account Number",
                                    "data": "accountNumber"
                                },{
                                    "title": "Account Type",
                                    "data": "accountType"
                                },{
                                    "title": "Limit",
                                    "data": "limit"
                                }/*,{
                                    "title":"Bank Statement"
                                    "type": "file",
                                    "fileType": "application/pdf"
                                }*/];
                            },
                            getActions: function() {
                                return [];
                            }
                        }]
                }]
            }]
        },
        {
            "type":"box",
            "colClass":"col-sm-12",
            "overrideType": "default-view",
            "title":"CIBIL_HIGHMARK",
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
                                    "key":"",
                                    "title":"CIBIL Score"
                                },
                                {
                                    "key":"",
                                    "title":"Active Accounts"
                                },
                                {
                                    "key":"cibil_highmark.Cibil.cibilLoanSummaryInfo.overDueAccounts",
                                    "title":"Overdue Accounts"
                                },
                                {
                                    "key":"",
                                    "title":"Sanctioned Amount"
                                },
                                {
                                    "key":"cibil_highmark.Cibil.cibilLoanSummaryInfo.currentBalance",
                                    "title":"Current Balance"
                                },
                                {
                                    "key":"cibil_highmark.Cibil.cibilLoanSummaryInfo.amountOverDue",
                                    "title":"Overdue Balance"
                                },
                                {
                                    "key":"",
                                    "title":"Report"
                                }
                            ]
                        },
                        {
                            "type":"grid",
                            "orientation":"vertical",
                            "items":[
                                {
                                    "key":"cibil_highmark.highMark.highmarkScore",
                                    "title":"Highmark Score"
                                },
                                {
                                    "key":"",
                                    "title":"Active Accounts"
                                },
                                {
                                    "key":"",
                                    "title":"Overdue Account"
                                },
                                {
                                    "key":"",
                                    "title":"Total Current Balance"
                                },
                                {
                                    "key":"",
                                    "title":"Amount Disbursed"
                                },
                                {
                                    "key":"",
                                    "title":"Report"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
                "type": "box",
                "colClass": "col-sm-12 table-box",
                "title": "Psychometric Scores",
                "condition": "model.currentStage != 'ScreeningReview'",
                "items": [
                    {
                        "type": "section",
                        "colClass": "col-sm-12",
                        "html":
                        '<div ng-init="_scores=model.psychometricScores">'+
    '<table class="table table-responsive">'+
     
        '<tbody>'+
            '<tr>'+
                '<th>Parameter Name</th>'+
                '<th>Cut Off Score</th>'+
                '<th colspan="2" ng-repeat="_score in _scores">{{_score.relation_detail}}</th>'+
            '</tr>'+
            '<tr ng-repeat=" (key, value) in _scores[0].data" ng-init="parameterIndex=$index">'+
                '<td >{{key}}</td>'+
                '<td >{{value["Cut Off Score"]}}</td>' + 
                '<td ng-repeat-start="_score in _scores"> <span class="square-color-box" style="background:{{_score.data[key].color_hexadecimal}}"> </span></td>'+
               '<td ng-repeat-end>{{_score.data[key].Score}}</td></tr>'+

            '<tr ng-repeat=" (key, value) in _scores[0].summary" ng-init="parameterIndex=$index">'+
                '<td >{{key}}</td>'+
                '<td ></td>' + 
                '<td ng-repeat-start="_score in _scores"></td>' + 
                '<td ng-repeat-end ng-style = "key === \'Total Score\' ?{\'font-weight\': \'bold\'} : {}"> {{_score.summary[key]}}</td>'+
        '</tbody>'+
    '</table>'+
'</div>'
                }
            ]
        },
        {
            "type":"box",
            "colClass":"col-sm-12",
            "overrideType": "default-view",
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
                                                return [
                                                    {
                                                        "title": "Contact Person Name",
                                                        "data": "referenceFirstName"
                                                    },
                                                    {
                                                        "title": "Contact Number",
                                                        "data": "mobileNo",
                                                    },
                                                    {
                                                        "title":"Occupation",
                                                        "data":"occupation"
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
                                                        "title": "Relationship with Applicant",
                                                        "data": "relationship"
                                                    },
                                                    {
                                                        "title": "Opinion on Applicant Business",
                                                        "data": "opinion"
                                                    },
                                                    {
                                                        "title": "What is the curent financial status of the Applicant?",
                                                        "data": "financialStatus",
                                                    },
                                                    {
                                                        "title":"Referer Response",
                                                        "data":"customerResponse"
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
        }
    ],
        schema: function() {
            return Enrollment.getSchema().$promise;     
        },
        eventListeners: {
                "psychometScore": function(bundleModel, model, params) {
                    model.psychometricScores = params;
                }
        },
        actions: {}
    }
}
})