define({
        pageUID: "shramsarathi.dashboard.loans.individual.screening.detail.IndividualEnrollmentView",
        pageType: "Engine",
        dependencies: ["$log", "Enrollment", "formHelper", "filterFilter", "irfCurrencyFilter", "Model_ELEM_FC", "CreditBureau", "irfElementsConfig", "$filter","BundleManager","Queries"],
        $pageFn: function($log, Enrollment, formHelper, filterFilter, irfCurrencyFilter, Model_ELEM_FC, CreditBureau, irfElementsConfig, $filter,BundleManager,Queries) {
            return {
                "type": "schema-form",
                "title": "INDIVIDUAL_ENROLLMENT",
                "subTitle": "",
                initialize: function(model, form, formCtrl, bundlePageObj, bundleModel,params) {
                    console.log(model);
                    console.log("------MOdel");
                    console.log(form);
                    console.log("------Form");
                    console.log(formCtrl);
                    console.log("------FormCtrl");

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
                        'customer_address': {},
                        'current_assets': []
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
                        model.customer.presetAddress = 'Present Address';
                       
                        model.UIUDF.bankAccount=res.customerBankAccounts;
                        model.UIUDF.liabilities=res.liabilities;
                        model.UIUDF.expenditures=res.expenditures;
                        model.UIUDF.income=res.familyMembers;
                        model.UIUDF.current_assets = res.currentAssets;
                        

                        BundleManager.broadcastEvent('Individual_Enrollment', res);
                        //debugger;
                        var centres = formHelper.enum("centre").data;
                        for (var i=0;i<centres.length;i++){
                            if(model.customer.centreId == centres[i].value){
                                model.customer.centreName = centres[i].name;
                                break;
                            }
                        }
                        //debugger;
                        // model.customer.presetAddress = [
                        //     res.doorNo,
                        //     res.street,
                        //     res.district,
                        //     res.state
                        // ].join(', ') + ' - ' + res.pincode;
                        if(model.UIUDF.income!=undefined || model.UIUDF.income.length>0){
                            var incomeEarned=0;
                            var annualExpenses=0;
                           // model.netincome=model.UIUDF.income[0].incomes[0].incomeEarned - model.UIUDF.expenditures[0].annualExpenses;

                            for(var i=0;i<model.UIUDF.income.length;i++){
                                if(model.UIUDF.income[i].incomes.length>0 || model.UIUDF.income[i].incomes!=undefined){
                                    for(var j=0;j<model.UIUDF.income[i].incomes.length;j++){
                                        incomeEarned+= model.UIUDF.income[i].incomes[j].incomeEarned;
                                    }
                                    
                                }
                            }

                            for(var i=0;i<model.UIUDF.expenditures.length;i++){
                                annualExpenses+=model.UIUDF.expenditures[i].annualExpenses;
                            }

                            setTimeout(function(){
                                model.netincome=model.total.incomeExpense.incomeGrandTotal - model.total.incomeExpense.expensesGrandTotal;
                            },1000);
                        }
                        else
                        {
                            //model.UIUDF.income[0].incomes[0].incomeEarned=0;
                            // model.netincome= 0 - model.UIUDF.expenditures[0].annualExpenses;
                        }
                       // debugger;
                        /*Family fields*/
                        model.UIUDF.family_fields.family_member_count = model.customer.familyMembers.length;
                        model.UIUDF.family_fields.dependent_family_member = 0;/*
                        model.UIUDF.family_fields.total_household_income = 0;*/
                        _.each(model.customer.familyMembers, function(member) {
                            if (member.incomes.length == 0)
                                model.UIUDF.family_fields.dependent_family_member++;
                        });
                        model.UIUDF.household_fields.total_Value = 0;
                        /*Household Assets field*/
                        var lengthOfPhysicalAssets = [];
                        _.each(model.customer.physicalAssets, function(Assets) {
                            if (Assets.ownedAssetValue != null && Assets.ownedAssetValue != 0)
                            lengthOfPhysicalAssets.push(Assets.ownedAssetValue)
                            model.UIUDF.household_fields.total_Value +=  Assets.ownedAssetValue;
                        });

                        model.UIUDF.household_fields.total_Assets = lengthOfPhysicalAssets.length;
                        /* what assets i need to take*/
                       
                        // _.each(model.customer.physicalAssets, function(Assets) {
                        //     model.UIUDF.household_fields.total_Value += parseInt(Assets.ownedAssetValue);
                        // });
    
                        /*Cibil/highmark fields*/
                        
                        /* Current Assets */
                        model.UIUDF.current_assets.total = 0;  
                        var lengthOfPhysicalAssets1 = [];
                        _.each(model.customer.currentAssets, function(Assets) {
                            if (Assets.assetValue != null && Assets.assetValue != 0)
                            lengthOfPhysicalAssets1.push(Assets.assetValue)
                            model.UIUDF.current_assets.total += Assets.assetValue;
                        });

                        model.UIUDF.current_assets.assets = lengthOfPhysicalAssets1.length;
                        
                        // _.each(model.customer.currentAssets,function(Asset){
                        //     model.UIUDF.current_assets.total += parseInt(Asset.assetValue);
                        // });

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

                        /* Outstanding Debt */

                        var liability ;
                        _.each(liability, function(liability) {
                            if (liability.summary['Customer ID'] == model.customer.id) {
                               // model.UIUDF.liabilities = _.cloneDeep(liability.data)
                                monthly_installment += liability.summary['Total Monthly Installment'];
                                outstanding_bal += liability.summary['Total Outstanding Loan Amount'];
    
                            }
                        })
                        model.UIUDF.liability_fields.active_accounts = model.UIUDF.liabilities.length;

                        /*Household fields */
    
                        var decExpanse = 0;
    
                        _.each(model.customer.expenditures, function(expanse) {
                            if(expanse.annualExpenses!=null){
                                decExpanse += parseInt(expanse.annualExpenses);
                            }
                        })
                        model.decHouseExpanse = decExpanse;
                        // model.household=res.expenditures;

                        //Newly added 
                    //     if(model.customer.dateOfBirth!= undefined || model.customer.dateOfBirth!=null){
                    //         model.customer.dateOfBirth=moment(model.customer.dateOfBirth).format('DD-MM-YYYY');
                    //     }
                    //    if(model.customer.spouseDateOfBirth!=undefined ||model.customer.spouseDateOfBirth!=null){
                    //     model.customer.spouseDateOfBirth=moment(model.customer.spouseDateOfBirth).format('DD-MM-YYYY');
                    //    }
                       
                    //    if(model.UIUDF.bankAccount.length > 0){
                    //        if( model.UIUDF.bankAccount[0].bankingSince!=undefined || model.UIUDF.bankAccount[0].bankingSince!=null){
                    //         model.UIUDF.bankAccount[0].bankingSince=moment(model.UIUDF.bankAccount[0].bankingSince).format('DD-MM-YYYY');
                    //        } 
                    //    }

                    //    if( model.UIUDF.liabilities[0] != undefined){
                    //        if(model.UIUDF.liabilities[0].startDate != undefined||model.UIUDF.liabilities[0].startDate != null){
                    //         model.UIUDF.liabilities[0].startDate=moment( model.UIUDF.liabilities[0].startDate).format('DD-MM-YYYY');
                    //        }
                        
                    //    }
                    //    if(model.UIUDF.liabilities[0] != undefined){
                    //     if(model.UIUDF.liabilities[0].maturityDate != undefined||model.UIUDF.liabilities[0].maturityDate != null){
                    //     model.UIUDF.liabilities[0].maturityDate=moment( model.UIUDF.liabilities[0].maturityDate).format('DD-MM-YYYY');
                    //     }
                    //    }

                       //taluk field from pincode query
                       Queries.searchPincodes(
                        model.customer.pincode  
                    ).then(function(resp){
                        debugger;
                        model.customer.taluk=resp.body[0].taluk;
                    },function(err){
                        model.customer.taluk=null;
                    }) 

               

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
                                    },
                                    //  {
                                    //     "key": "UIUDF.family_fields.dependent_family_member",
                                    //     "title": "No. of Dependent Family Members",
                                    //     "type": "number"
                                    // }
                                ]
                                }, {
                                    "type": "grid",
                                    "orientation": "vertical",
                                    "items": [{
                                        "key": "UIUDF.income[0].incomes[0].incomeEarned",
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
                            model.UIUDF.equifax.score = res.equifax?res.equifax.equifaxScore:null;
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
                formSource: [
                    {
                        "type": "section",
                        "html": `
                                <div class="col-sm-6">
                                <i class="fa fa-check-circle text-green" style="font-size:x-large">&nbsp;</i><em class="text-darkgray">{{model.existingCustomerStr}}</em><br>&nbsp;
                                </div>
                                <div class="col-sm-3">{{'BRANCH'|translate}}: <strong>{{model.customer.kgfsName}}</strong></div>
                                <div class="col-sm-3">{{'ZONE'|translate}}: <strong>{{model.customer.centreName}}</strong></div>
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
                                            {{model.customer.landmark}} <br />\
                                            {{model.customer.villageName}} <br />\
                                            {{model.customer.locality}} <br />\
                                            {{model.customer.taluk}} <br /> \
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
                                    "key": "customer.urnNo",
                                    "title": "URN"
                                }, 
                                // {
                                //     "key": "customer.religion"
                                // }, 
                                {
                                    "key": "customer.caste",
                                    "title": "CASTE"
                                }, {
                                    "key": "customer.fatherFirstName",
                                    "title": "FATHER_FULL_NAME",
                                }, 
                                // {
                                //     "key": "customer.motherName",
                                //     "title": "Mother's Full Name"
                                // }, 
                                {
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
                    }, 
                    {
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
                                },
                                // {
                                //     "key": "customer.place"
                                // },
                                {
                                    "key":"customer.udf.userDefinedFieldValues.udf4",
                                    "title":"IN_CURRENT_ADDRESS_SINCE",
                                    "type":"string"
                                }]
                            }, {
                                "type": "grid",
                                "orientation": "vertical",
                                "items": [{
                                    "key": "customer.houseStatus",
                                    "title":"HOUSE_STATUS",
                                    "type": "string"
                                },
                                {
                                    "key": "customer.noOfRooms",
                                    "title":"NO_OF_ROOMS",
                                    "type": "number"
                                },{
                                    "key": "customer.udf.userDefinedFieldValues.udf5",
                                    "title":"IN_CURRENT_AREA_SINCE",
                                    "type": "string"
                                }]
                            }]
                        }]
                    },{
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
                                    "key": "UIUDF.bankAccount[0].bankStatements[0].totalDeposits",
                                    "title": "Monthly Deposit",
                                    "type": "amount"
                                }, {
                                    "key": "UIUDF.bankAccount[0].bankStatements[0].totalWithdrawals",
                                    "title": "Monthly Withdrawl",
                                    "type": "amount"
                                }, {
                                    "key": "UIUDF.bankAccount[0].bankStatements[0].balanceAsOn15th",
                                    "title": "Monthly Balance",
                                    "type": "amount"
                                }]
                            }, {
                                "type": "grid",
                                "orientation": "vertical",
                                "items": [{
                                    "key": "UIUDF.bankAccount.length",
                                    "title": "Total no of Account",
                                    "type": "number"
                                }, {
                                    "key": "UIUDF.bankAccount[0].bankStatements[0].noOfChequeBounced",
                                    "title": "Total no of Cheque Bounce",
                                    "type": "number"
                                }, {
                                    "key": "UIUDF.bankAccount[0].bankStatements[0].noOfEmiChequeBounced",
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
                                            return full['customerBankName']
                                        }
                                    }, {
                                        "title": "Branch Name",
                                        "data": "customerBankBranchName",
                                        render: function(data, type, full, meta) {
                                            if (data) return data;
                                            return ['customerBankBranchName']
    
                                        }
                                    }, {
                                        "title": "IFSC Code",
                                        "data": "ifscCode",
                                        render: function(data, type, full, meta) {
                                            return full['ifscCode']
                                        }
                                    }, {
                                        "title": "Account Number",
                                        "data": "accountNumber",
                                        render: function(data, type, full, meta) {
                                            return full['accountNumber']
                                        }
                                    }, 
                                    {
                                        "title": "Bank Balance",
                                        "data": "bankStatements[0].balanceAsOn15th",
                                        render: function(data, type, full, meta) {
                                            if(full.bankStatements[0] != undefined){
                                                return irfCurrencyFilter(full.bankStatements[0].balanceAsOn15th)
                                            }
                                            //return irfCurrencyFilter(full.incomes[0].incomeEarned);
                                        }
                                    }, {
                                        "title": "Bank Deposit",
                                        "data": "BankAvgDep",
                                        render: function(data, type, full, meta) {
                                            if(full.bankStatements[0] != undefined){
                                            return irfCurrencyFilter(full.bankStatements[0].totalDeposits)
                                            }
                                        }
                                    },
                                     {
                                        "title": "Account Name",
                                        "data": "customerNameAsInBank",
                                        render: function(data, type, full, meta) {
                                            return full['customerNameAsInBank']
                                        }
                                    }, {
                                        "title": "Account Type",
                                        "data": "accountType",
                                        render: function(data, type, full, meta) {
                                            return full['accountType']
                                        }
                                    }, {
                                        "title": "BANKING_SINCE",
                                        "data": "bankingSince",
                                        render: function(data, type, full, meta) {
                                            return full['bankingSince']
                                        }
    
                                    }, {
                                        "title": "NET_BANKING_AVAILABLE",
                                        "data": "netBankingAvailable",
                                        render: function(data, type, full, meta) {
                                            return full['netBankingAvailable']
                                        }
                                    }
                                    // {
                                    //     "title": "Limit",
                                    //     "data": "limit",
                                    //     render: function(data, type, full, meta) {
                                    //         return full['limit']
                                    //     }
                                    // }, {
                                    //     "title": "Bank Statement's",
                                    //     "data": "",
                                    //     render: function(data, type, full, meta) {
                                    //         var title = [];
                                    //         var url = [];
                                    //         for (i = 0; i < full.BankStatements.length; i++) {
                                    //             url.push(Model_ELEM_FC.fileStreamUrl + "/" + full.BankStatements[i]['Bank Statement File ID']);
                                    //             title.push(moment(full.BankStatements[i].Month).format('MMMM YYYY'));
                                    //         }
                                    //         //return '<div  ng-repeat = "i in ' + url + '"  ><p ng-repeat="j in'+title+'"><a  href={{i}} style="cursor:pointer">{{j}}</a></p></div>'
                                    //         /*return data?'<a ng-href="'+Model_ELEM_FC.fileStreamUrl+'/'+data+'" style="cursor:pointer"></a>':'';*/
    
                                    //         return '<div >' +
                                    //             '<a  href="' + url[0] + '">' + title[0] + '</a><br>' +
                                    //             '<a  href="' + url[1] + '">' + title[1] + '</a><br>' +
                                    //             '<a  href="' + url[2] + '">' + title[2] + '</a><br>' +
                                    //             '<a  href="' + url[3] + '">' + title[3] + '</a><br>' +
                                    //             '<a  href="' + url[4] + '">' + title[4] + '</a><br>' +
                                    //             '<a  href="' + url[5] + '">' + title[5] + '</a><br>' +
                                    //             '</div>'
                                    //     }
                                    // }
                                ];
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
                                    "key": "UIUDF.liabilities[0].installmentAmountInPaisa",
                                    "title": "Total Monthly Instalments",
                                    "type": "amount"
                                }, {
                                    "key": "UIUDF.liabilities[0].outstandingAmountInPaisa",
                                    "title": "OUTSTANDING_AMOUNT",
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
                                            return full['loanSource']
                                        }
                                    }, {
                                        "title": "loan Amount",
                                        "data": "loanAmount",
                                        render: function(data, type, full, meta) {
                                            return irfCurrencyFilter(full['loanAmountInPaisa'])
                                            debugger;
                                        }
                                    }, {
                                        "title": "Installment Amount",
                                        "data": "installmentAmountInPaisa",
                                        render: function(data, type, full, meta) {
                                            return irfCurrencyFilter(full['installmentAmountInPaisa'])
                                        }
                                    }, {
                                        "data": "outstandingAmountInPaisa",
                                        "title": "OUTSTANDING_AMOUNT",
                                        render: function(data, type, full, meta) {
                                            return irfCurrencyFilter(full['outstandingAmountInPaisa'])
                                        }
                                    }, {
                                        "title": "Loan Purpose",
                                        "data": "Purpose",
                                        render: function(data, type, full, meta) {
                                            return full['liabilityLoanPurpose']
                                        }
    
                                    }, 
                                    {
                                        "title": "START_DATE",
                                        "data": "startDate",
                                        render: function(data, type, full, meta) {
                                            return full['startDate']
                                        }

                                    }, 
                                    {
                                        "title": "MATURITY_DATE",
                                        "data": "maturityDate",
                                        render: function(data, type, full, meta) {
                                            return full['maturityDate']
                                        }
                                    }, 
                                    {
                                        "title": "NO_OF_INSTALLMENT_PAID",
                                        "data": "noOfInstalmentPaid",
                                        render: function(data, type, full, meta) {
                                            if (data==0) {
                                                return "Installment";
                                            }
                                            else{
                                                return "Lumpsum";
                                            }
                                            
                                            //return full['noOfInstalmentPaid'].toString();
                                        }
    
                                    }, {
                                        "title": "Frequency of Installments",
                                        "data": "Frequency",
                                        render: function(data, type, full, meta) {
                                            return full['frequencyOfInstallment']
                                        }
                                    }, {
                                        "data": "",
                                        "title": "INTEREST_ONLY",
                                        render: function(data, type, full, meta) {
                                            return full['interestOnly']
                                        }
                                    }, {
                                        "data": "interestRate",
                                        "title": "RATE_OF_INTEREST",
                                        render: function(data, type, full, meta) {
                                            return full['interestRate']
                                        }
                                    }];
                                },
                                getActions: function() {
                                    return [];
                                }
                            }]
                        }]
                    },{
                        "type": "box",
                        "readonly": true,
                        "colClass": "col-sm-12",
                        "overrideType": "default-view",
                        "title": "Fixed Assets",
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
                                        "data": "nameOfOwnedAsset",
                                        render: function(data, type, full, meta) {
                                            if (full.ownedAssetValue >0 && full.ownedAssetValue != 0)
                                                return data
                                            else return false
                                        }
                                    }, 

                                    // {
                                    //     "title": "REGISTERED_OWNER",
                                    //     "data": "registeredOwner"
    
                                    // }, 
                                    {
                                        "title": "Asset Value",
                                        "data": "ownedAssetValue",
                                        render: function(data, type, full, meta) {
                                            if (full.ownedAssetValue >0 && full.ownedAssetValue != 0)
                                            return irfCurrencyFilter(data)
                                            else return false
                                        }
                                       
                                    }, 
                                
                                    // {
                                    //     "title": "AREA_UNITS_OF_ASSETS",
                                    //     "data": "unit"
                                    // }
                                ];
                                },
                                getActions: function() {
                                    return [];
                                }
                            }]
                        }]
                    },
                    {
                        "type": "box",
                        "readonly": true,
                        "colClass": "col-sm-12",
                        "overrideType": "default-view",
                        "title": "Current Assets",
                        "condition": "model.UIUDF.current_assets.assets !=0",
                        "items": [{
                            "type": "grid",
                            "orientation": "horizontal",
                            "items": [{
                                "type": "grid",
                                "orientation": "vertical",
                                "items": [{
                                    "key": "UIUDF.current_assets.assets",
                                    "title": "Total Assets",
                                    "type": "number"
                                }]
                            }, {
                                "type": "grid",
                                "orientation": "vertical",
                                "items": [{
                                    "key": "UIUDF.current_assets.total",
                                    "title": "Total Value",
                                    "type": "amount"
                                }]
                            }]
                        }, {
                            "type": "expandablesection",
                            "items": [{
                                "type": "tableview",
                                "key": "customer.currentAssets",
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
                                        "data": "assetType",
                                        render: function(data, type, full, meta) {
                                            if (full.assetValue >0 && full.assetValue != 0)
                                                return data
                                            else return false
                                        }
                                    },{
                                        "title": "Asset Value",
                                        "data": "assetValue",
                                        render: function(data, type, full, meta) {
                                            // if (data)
                                            //     return irfCurrencyFilter(data)
                                            // else return "NA"
                                            if (full.assetValue >0 && full.assetValue != 0)
                                            return irfCurrencyFilter(data)
                                            else return false
                                        }
                                    }];
                                },
                                getActions: function() {
                                    return [];
                                }
                            }]
                        }]  
                },{
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
                        "title": "INCOME_AND_EXPENSE",
                        "condition": "model.bundlePageObj.pageClass !='guarantor'",
                        "overrideType": "default-view",
                        "items": [{
                            "type": "grid",
                            "orientation": "horizontal",
                            "items": [{
                                "type": "grid",
                                "orientation": "vertical",
                                "items": [{
                                    "key": "total.incomeExpense.incomeGrandTotal",
                                    "title": "Income",
                                    "type": "amount"
                                }, {
                                    "key": "total.incomeExpense.expensesGrandTotal",
                                    "title": "Expenses",
                                    "type": "amount"
                                }, {
                                    "key": "netincome",
                                    "title": "Net House Hold Income",
                                    "type": "amount"
    
                                }]
                            }]
                        }, 
                        // {
                        //     "type": "expandablesection",
                        //     "items": [{
                        //         "type": "section",
                        //         "colClass": "col-sm-12",
                        //         "html": '<div>' +
                        //             '<table class="table">' +
                        //             '<colgroup>' +
                        //             '<col width="30%"> <col width="40%"> <col width="30%">' +
                        //             '</colgroup>' +
                        //             '<tbody>' +
                        //             '<tr class="table-sub-header"> <th>{{"INCOME" | translate}}</th> <th></th> <th>{{model.UIUDF.income[0].incomes[0].incomeEarned | irfCurrency}}</th> </tr>' +
                        //             //'<tr> <td></td> <td>{{"SALARY_FROM_BUSINESS" | translate}}</td> <td>{{household.salaryFromBusiness | irfCurrency}}</td> </tr>' +
                        //             //'<tr> <td></td> <td>{{"OTHER_INCOME_SALARIES" | translate}}</td> <td>{{household.otherIncomeSalaries | irfCurrency}}</td> </tr>' +
                        //             '<tr> <td></td> <td>{{"FAMILY_MEMBER_INCOMES" | translate}}</td> <td>{{model.UIUDF.income[0].incomes[0].incomeEarned | irfCurrency}}</td> </tr>' +
                        //             '<tr class="table-sub-header"> <th>{{"EXPENSES" | translate}}</th> <th></th> <th>{{model.UIUDF.expenditures[0].annualExpenses | irfCurrency}}</th> </tr>' +
                        //             //'<tr> <td></td> <td>{{"DECLARED_EDUCATIONAL_EXPENSE" | translate}}</td> <td>{{household.declaredEducationExpense | irfCurrency}}</td> </tr>' +
                        //             //'<tr> <td></td> <td>{{"EMI_HOUSEHOLD_LIABILITIES" | translate}}</td> <td>{{household.emiHouseholdLiabilities | irfCurrency}}</td> </tr>' +
                        //             '<tr class="table-bottom-summary"> <td>{{"NET_HOUSEHOLD_INCOME" | translate}}</td> <td></td> <td>{{ model.UIUDF.income[0].incomes[0].incomeEarned - model.UIUDF.expenditures[0].annualExpenses| irfCurrency}}</td> </tr>' +
                        //             '</tbody>' +
                        //             '</table>' + '</div>'
                        //     }]
                        // }
                    ]
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
                    }
                ],
                
                offlineInitialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    
                    // var p1 = UIRepository.getEnrolmentProcessUIRepository().$promise;
                     var self = this;
                    
                         self.form = self.formSource;
                },

                
                schema: function() {
                    return Enrollment.getSchema().$promise;
                },
                
                eventListeners: {
                    "financial-summary": function(bundleModel, model, params) {
                        //model.customer = model.enrolmentProcess.customer;
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
                               // model.UIUDF.bankAccount.push(bankDetail)
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
                               // model.UIUDF.liabilities = _.cloneDeep(liability.data)
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
                                // model.household = [];
                                // model.household.push({
                                //     income: totalIncome,
                                //     salaryFromBusiness: household.data[0]['Salary from business'],
                                //     otherIncomeSalaries: household.data[0]['Other Income/salaries'],
                                //     familyMemberIncomes: household.data[0]['Family Member Incomes'],
                                //     Expenses: totalExpenses,
                                //     declaredEducationExpense: household.data[0]['Expenses Declared or based on the educational expense whichever is higher'],
                                //     emiHouseholdLiabilities: household.data[0]['EMI\'s of household liabilities'],
                                //     netHouseholdIncome: household.data[0]['Net Household Income']
                                // });
                                // model.household_new = model.household[0];
    
                            }
                        })
                            /*if (model.household) {

                                model.UIUDF.family_fields.total_household_income = model.household[0].income;
                            }*/
    
    
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
                    "financial-sum": function(bundleModel, model, params){
                        model.total = params[0].data[0].financialSummaryModel;
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
                    },
                    "Financial-Summary":function(bundleModel,model,params){
                        console.log("Financial-Summary event listener",params);
                        model.avarage_balance=params.avarage_balance;
                        model.avarage_deposit=params.avarage_deposit;
                        model.avarage_withdrawal=params.avarage_withdrawal;
                        model.UIUDF.bankAccount.BankAvgBal=params.avarage_balance;
                        model.UIUDF.bankAccount.BankAvgDep=params.avarage_deposit;
                    }
                },
                actions: {}
            }
        }
    })