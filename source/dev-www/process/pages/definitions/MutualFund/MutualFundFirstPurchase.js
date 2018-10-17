define({
    pageUID: "MutualFund.MutualFundFirstPurchase",
    pageType: "Engine",
    dependencies: ["$log", "$q", "Enrollment", 'EnrollmentHelper', 'PageHelper', 'formHelper', "elementsUtils",

        'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "irfNavigator", "CustomerBankBranch", "MutualFund",
        
    ],

    $pageFn: function($log, $q, Enrollment, EnrollmentHelper, PageHelper, formHelper, elementsUtils,
        irfProgressMessage, SessionStore, $state, $stateParams, irfNavigator, CustomerBankBranch, MutualFund) {

        var branch = SessionStore.getBranch();

        return {
            "id": "ProfileInformation",
            "type": "schema-form",
            "name": "Stage1",
            "title": "MUTUAL_FUND_FIRST_PURCHASE",
            "subTitle": "STAGE_1",

            initialize: function(model, form, formCtrl) {
                model.customer = model.customer || {};
                model.customer.customerType = "Individual";
                var branch1 = formHelper.enum('branch_id').data;
                var allowedBranch = [];
                for (var i = 0; i < branch1.length; i++) {
                    if ((branch1[i].name) == SessionStore.getBranch()) {
                        allowedBranch.push(branch1[i]);
                        break;
                    }
                }
                model.customer.customerBranchId = allowedBranch.length ? allowedBranch[0].value : '';
                model.customer.kgfsBankName = SessionStore.getBankName();
                $log.info(model.customer.kgfsBankName);
                $log.info(formHelper.enum('bank'));
                $log.info("ProfileInformation page got initialized:" + model.customer.customerBranchId);

                var customerId = $stateParams.pageId;
                 
                   

                if (customerId) {
                    Enrollment.getCustomerById({
                        id: customerId
                    }, function(resp, header) {
                        model.customer = resp;

                        model.customer.customerBranchId = model.customer.customerBranchId || _model.customer.customerBranchId;
                        model.customer.kgfsBankName = model.customer.kgfsBankName || SessionStore.getBankName();
                        model = EnrollmentHelper.fixData(model);
                        model.customer.addressProofSameAsIdProof = Boolean(model.customer.title);
                       
                        PageHelper.hideLoader();
                    }, function(resp) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("enrollment-save", "An Error Occurred. Failed to fetch Data", 5000);
                    });

                }
            },
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return [
                    item["customer"]["urnNo"],
                    item["customer"]["firstName"],
                    item["customer"]["villageName"]
                ]
            },
            form: [{
                    "type": "box",
                    "title": "CUSTOMER_INFORMATION",
                    "items": [
                            {
                                key: "customer.IsKycDone",                                
                                title: "IS_KYC_DONE",
                                type: "checkbox",
                                "schema": {
                                    "default": "0"
                                }
                            },
                            {
                            key: "customer.firstName",
                            title: "FULL_NAME",
                            type: "qrcode",
                            onCapture: EnrollmentHelper.customerAadhaarOnCapture
                            },

                            {
                            key: "customerId",
                            title: "customer.customerId",                            
                            type: ["String","NULL"]
                            },

                            {
                            key: "mutualFundAccountProfileId",
                            title: "MUTUAL_FUND_ACCOUNT_PROFILE_ID",                            
                            type: ["String","NULL"]
                                
                            },
                    
                    
                            {
                            key: "customer.centreId",
                            type: "select",
                            "enumCode": "centre",
                            "parentEnumCode": "branch_id",
                            "parentValueExpr": "model.customer.customerBranchId",
                            },

                            {
                            key: "customer.enrolledAs",
                            type: "radios"
                            },
                        
                            {
                            key: "customer.fatherFirstName",
                            title: "FATHER_FULL_NAME"
                            },
                           
                            {
                            key: "customer.mobilePhone",
                            required: true
                            }         
                                          
                          
                    ]
                },
                
                , {
                    type: "box",
                    title: "SCHEME_DETAILS",
                    items: [
                            {
                            type: "fieldset",
                            title: "MUTUAL_FUND_SCHEMES",
                            items: [{
                                    title: "CUSTOMER_ID",
                                    key: "customer.customerId",
                                    type: ["string","null"]
                                },
                                {
                                    title: "Mutual Fund Transaction Type",
                                    key: "customer.mfTransactionType",
                                    type: ["string","null"]
                                },
                                {
                                    title: "Mutual Fund Account ProfileID",
                                    key: "customer.mutualFundAccountProfileId",
                                    type: ["string","null"]
                                },                             
                                {
                                   title: "Amount",
                                   key: "customer.amount",
                                   type: ["string","null"]
                                }
                                
                            ]
                        }, 

               
                    ]
                },

               
                
                {
                    type: "box",
                    title: "BANK_ACCOUNTS",
                    // "condition":"model.currentStage=='Screening' || model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                    items: [{
                        key: "customer.customerBankAccounts",
                        type: "array",
                        title: "BANK_ACCOUNTS",
                        startEmpty: true,
                        onArrayAdd: function(modelValue, form, model, formCtrl, $event) {
                            modelValue.bankStatements = [];
                            var CBSDateMoment = moment(SessionStore.getCBSDate(), SessionStore.getSystemDateFormat());
                            var noOfMonthsToDisplay = 6;
                            var statementStartMoment = CBSDateMoment.subtract(noOfMonthsToDisplay, 'months').startOf('month');
                            for (var i = 0; i < noOfMonthsToDisplay; i++) {
                                modelValue.bankStatements.push({
                                    startMonth: statementStartMoment.format(SessionStore.getSystemDateFormat())
                                });
                                statementStartMoment = statementStartMoment.add(1, 'months').startOf('month');
                            }
                        },
                        items: [{
                            key: "customer.customerBankAccounts[].ifscCode",
                            type: "lov",
                            lovonly: true,
                            required: true,
                            inputMap: {
                                "ifscCode": {
                                    "key": "customer.customerBankAccounts[].ifscCode"
                                },
                                "bankName": {
                                    "key": "customer.customerBankAccounts[].customerBankName"
                                },
                                "branchName": {
                                    "key": "customer.customerBankAccounts[].customerBankBranchName"
                                }
                            },
                            outputMap: {
                                "bankName": "customer.customerBankAccounts[arrayIndex].customerBankName",
                                "branchName": "customer.customerBankAccounts[arrayIndex].customerBankBranchName",
                                "ifscCode": "customer.customerBankAccounts[arrayIndex].ifscCode"
                            },
                            searchHelper: formHelper,
                            search: function(inputModel, form) {
                                $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                var promise = CustomerBankBranch.search({
                                    'bankName': inputModel.bankName,
                                    'ifscCode': inputModel.ifscCode,
                                    'branchName': inputModel.branchName
                                }).$promise;
                                return promise;
                            },
                            getListDisplayItem: function(data, index) {
                                return [
                                    data.ifscCode,
                                    data.branchName,
                                    data.bankName
                                ];
                            }
                        }, {
                            key: "customer.customerBankAccounts[].customerBankName",
                            required: true,
                            readonly: true
                        }, {
                            key: "customer.customerBankAccounts[].customerBankBranchName",
                            required: true,
                            readonly: true
                        }, {
                            key: "customer.customerBankAccounts[].customerNameAsInBank"
                        }, {
                            key: "customer.customerBankAccounts[].accountNumber",
                            type: "password",
                            inputmode: "number",
                            numberType: "tel"
                        }, {
                            key: "customer.customerBankAccounts[].confirmedAccountNumber",
                            inputmode: "number",
                            numberType: "tel"
                        }, {
                            key: "customer.customerBankAccounts[].accountType",
                            type: "select"
                        }, {
                            key: "customer.customerBankAccounts[].bankingSince",
                            type: "date",
                            title: "BANKING_SINCE"
                        }, {
                            key: "customer.customerBankAccounts[].netBankingAvailable",
                            type: "select",
                            title: "NET_BANKING_AVAILABLE",
                            enumCode: "decisionmaker"
                        }, {
                            key: "customer.customerBankAccounts[].sanctionedAmount",
                            condition: "model.customer.customerBankAccounts[arrayIndex].accountType =='OD'||model.customer.customerBankAccounts[arrayIndex].accountType =='CC'",
                            type: "amount",
                            required: true,
                            title: "OUTSTANDING_BALANCE"
                        }, {
                            key: "customer.customerBankAccounts[].limit",
                            type: "amount"
                        }, {
                            key: "customer.customerBankAccounts[].bankStatements",
                            type: "array",
                            title: "STATEMENT_DETAILS",
                            titleExpr: "moment(model.customer.customerBankAccounts[arrayIndexes[0]].bankStatements[arrayIndexes[1]].startMonth).format('MMMM YYYY') + ' ' + ('STATEMENT_DETAILS' | translate)",
                            titleExprLocals: {
                                moment: window.moment
                            },
                            startEmpty: true,
                            items: [{
                                key: "customer.customerBankAccounts[].bankStatements[].startMonth",
                                type: "date",
                                title: "START_MONTH"
                            }, {
                                key: "customer.customerBankAccounts[].bankStatements[].totalDeposits",
                                type: "amount",
                                calculator: true,
                                creditDebitBook: true,
                                onDone: function(result, model, context) {
                                    model.customer.customerBankAccounts[context.arrayIndexes[0]].bankStatements[context.arrayIndexes[1]].totalDeposits = result.totalCredit;
                                    model.customer.customerBankAccounts[context.arrayIndexes[0]].bankStatements[context.arrayIndexes[1]].totalWithdrawals = result.totalDebit;
                                },
                                title: "TOTAL_DEPOSITS"
                            }, {
                                key: "customer.customerBankAccounts[].bankStatements[].totalWithdrawals",
                                type: "amount",
                                title: "TOTAL_WITHDRAWALS"
                            }, {
                                key: "customer.customerBankAccounts[].bankStatements[].balanceAsOn15th",
                                type: "amount",
                                title: "BALENCE_AS_ON_REQUESTED_EMI_DATE"
                            }, {
                                key: "customer.customerBankAccounts[].bankStatements[].noOfChequeBounced",
                                type: "amount",
                                //maximum:99,
                                required: true,
                                title: "NO_OF_CHEQUE_BOUNCED"
                            }, {
                                key: "customer.customerBankAccounts[].bankStatements[].noOfEmiChequeBounced",
                                type: "amount",
                                required: true,
                                //maximum:99,
                                title: "NO_OF_EMI_CHEQUE_BOUNCED"
                            }, {
                                key: "customer.customerBankAccounts[].bankStatements[].bankStatementPhoto",
                                type: "file",
                                required: true,
                                title: "BANK_STATEMENT_UPLOAD",
                                fileType: "application/pdf",
                                "category": "CustomerEnrollment",
                                "subCategory": "IDENTITYPROOF",
                                using: "scanner"
                            }, ]
                        }, {
                            key: "customer.customerBankAccounts[].isDisbersementAccount",
                            type: "radios",
                            titleMap: [{
                                value: true,
                                name: "Yes"
                            }, {
                                value: false,
                                name: "No"
                            }]
                        }]
                    }]
                },


                {
                    "type": "actionbox",
                    "condition": "model._mode != 'EDIT'",
                    "items": [{
                        "type": "save",
                        "title": "SAVE_OFFLINE",
                    }, {
                        "type": "submit",
                        "title": "SUBMIT"
                    }]
                },

                {
                    "type": "actionbox",
                    "condition": "model._mode == 'EDIT'",
                    "items": [{
                        "type": "save",
                        "title": "SAVE_OFFLINE",
                    }, {
                        "type": "submit",
                        "title": "SUBMIT"
                    }, {
                        "type": "button",
                        "icon": "fa fa-user-plus",
                        "title": "ENROLL_CUSTOMER",
                        "onClick": "actions.proceed(model, formCtrl, form, $event)"
                    }, {
                        "type": "button",
                        "icon": "fa fa-refresh",
                        "title": "RELOAD",
                        "onClick": "actions.reload(model, formCtrl, form, $event)"
                    }]
                },



            ],
            schema: function() {
                return Enrollment.getSchema().$promise;
            },
            actions: {

                setProofs: function(model) {
                    model.customer.addressProofNo = model.customer.aadhaarNo;
                    model.customer.identityProofNo = model.customer.aadhaarNo;
                    model.customer.identityProof = 'Aadhar card';
                    model.customer.addressProof = 'Aadhar card';
                    model.customer.addressProofSameAsIdProof = true;
                    if (model.customer.yearOfBirth) {
                        model.customer.dateOfBirth = model.customer.yearOfBirth + '-01-01';
                    }
                },
                preSave: function(model, form, formName) {
                    var deferred = $q.defer();
                    if (model.customer.firstName) {
                        deferred.resolve();
                    } else {
                        irfProgressMessage.pop('enrollment-save', 'Customer Name is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },
                submit: function(model, form, formName) {

                    $log.info("Inside submit()");
                    model.customer.customerType = "Individual";
                    model.customer.title = String(model.customer.addressProofSameAsIdProof);
                  
                    model.customer.miscellaneous = null;
                    $log.warn(model);
                    if (!EnrollmentHelper.validateData(model)) {
                        $log.warn("Invalid Data, returning false");
                        return false;
                    }
                    var sortFn = function(unordered) {
                        var out = {};
                        Object.keys(unordered).sort().forEach(function(key) {
                            out[key] = unordered[key];
                        });
                        return out;
                    };



                    var reqData = _.cloneDeep(model);

                    EnrollmentHelper.fixData(reqData);
                    reqData.customer.addressProofSameAsIdProof = Boolean(reqData.customer.title);
                    $log.info(JSON.stringify(sortFn(reqData)));
                    EnrollmentHelper.saveData(reqData).then(function(res) {
                        model.customer = _.clone(res.customer);
                        model = EnrollmentHelper.fixData(model);
                        model.customer.addressProofSameAsIdProof = Boolean(model.customer.title);

                        /*reqData = _.cloneDeep(model);
                        EnrollmentHelper.proceedData(reqData).then(function(res){
                            irfNavigator.goBack();
                        });*/
                        $stateParams.confirmExit = false;
                        $state.go("Page.Engine", {
                            pageName: 'ProfileInformation',
                            pageId: model.customer.id
                        });
                    });

                    MutualFund.purchaseOrRedemption(reqData).then(function(res){
                        // $stateParams.confirmExit = false;

                    });
                },
                proceed: function(model, formCtrl, form, $event) {
                    formCtrl.scope.$broadcast('schemaFormValidate');

                    if (formCtrl && formCtrl.$invalid) {
                        PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                        return false;
                    }
                    model.customer.ageProof = model.customer.addressProofSameAsIdProof;
                    model.customer.customerType = "Individual";
                    var reqData = _.cloneDeep(model);
                    if (reqData.customer.id && reqData.customer.currentStage === 'Stage01') {
                        $log.info("Customer id not null, skipping save");
                        EnrollmentHelper.proceedData(reqData).then(function(res) {
                            $stateParams.confirmExit = false;
                            irfNavigator.goBack();
                        });
                    }
                },
                reload: function(model, formCtrl, form, $event) {
                    $stateParams.confirmExit = false;
                    $state.go("Page.Engine", {
                        pageName: 'ProfileInformation',
                        pageId: model.customer.id
                    }, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                }
            }
        };
    }
})