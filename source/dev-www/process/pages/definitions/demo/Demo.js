define({
    pageUID: "demo.Demo",
    pageType: "Engine",
    dependencies: ["$log", "Enrollment", "SessionStore", "Files", "formHelper", "Queries"],
    $pageFn: function($log, Enrollment, SessionStore, Files, formHelper, Queries){
        return {
            "type": "schema-form",
            "title": "Demo Page2",
            "subTitle": "Demo Page2 secondary title",
            initialize: function (model, form, formCtrl) {
                $log.info("Demo Customer Page2 got initialized");

                model.address = model.address || {};
                model.address.streetAddress = "Stt";

                Files.getBase64DataFromFileId(
                    '482acbaf-0090-4168-adca-76aaba818d5a',
                    true
                ).then(function(base64String){
                    console.log(base64String);
                },function(err){

                });

                Queries.getLoanCustomerDetails(26)
                .then(function(out){
                    console.log('shahal');
                    console.log(out);
                })
            },

            form: [
                {
                    type: "box",
                    title: "BANK_ACCOUNTS",
                    items: [
                        {
                            key: "customer.totalDeposits",
                            type: "amount",
                            calculator: true,
                            title: "TOTAL_DEPOSITS"
                        },
                        {
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
                                        startMonth: statementStartMoment.format(SessionStore.getSystemDateFormat()),
                                        startMonthForTitle: statementStartMoment.format("MMMM YYYY")
                                    });
                                    statementStartMoment = statementStartMoment.add(1, 'months').startOf('month');
                                }
                            },
                            items: [
                                {
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
                                },
                                {
                                    key: "customer.customerBankAccounts[].customerBankName",
                                    readonly: true,
                                    required: true
                                },
                                {
                                    key: "customer.customerBankAccounts[].customerBankBranchName",
                                    readonly: true,
                                    required: true
                                },
                                {
                                    key: "customer.customerBankAccounts[].customerNameAsInBank"
                                },
                                {
                                    key: "customer.customerBankAccounts[].accountNumber"
                                },
                                {
                                    key: "customer.customerBankAccounts[].accountType",
                                    type: "select"
                                },
                                {
                                    key: "customer.customerBankAccounts[].bankingSince",
                                    type: "date",
                                    title: "BANKING_SINCE"
                                },
                                {
                                    key: "customer.customerBankAccounts[].netBankingAvailable",
                                    type: "select",
                                    title: "NET_BANKING_AVAILABLE",
                                    enumCode: "decisionmaker"
                                },
                                {
                                    key: "customer.customerBankAccounts[].sanctionedAmount",
                                    type: "amount",
                                    title: "OUTSTANDING_BALANCE",
                                    condition:"model.customer.customerBankAccounts[arrayIndex].accountType=='OD' || model.customer.customerBankAccounts[arrayIndex].accountType=='CC'"
                                },
                                {
                                    key:"customer.customerBankAccounts[].bankStatementDocId",
                                    type:"file",
                                    required: true,
                                    title:"BANK_STATEMENT_UPLOAD",
                                    fileType:"application/pdf",
                                    "category": "CustomerEnrollment",
                                    "subCategory": "IDENTITYPROOF",
                                    using: "scanner"
                                },
                                {
                                    key: "customer.customerBankAccounts[].bankStatements",
                                    type: "array",
                                    title: "STATEMENT_DETAILS",
                                    titleExpr: "moment(model.customer.customerBankAccounts[arrayIndexes[0]].bankStatements[arrayIndexes[1]].startMonth).format('MMMM YYYY') + ' ' + ('STATEMENT_DETAILS' | translate)",
                                    titleExprLocals: {moment: window.moment},
                                    items: [
                                        {
                                            key: "customer.customerBankAccounts[].bankStatements[].startMonth",
                                            type: "date",
                                            title: "START_MONTH",
                                            dateDisplayFormat: "MMM, YYYY",
                                            onChange: function(modelValue, form, model){
                                                model.customer.customerBankAccounts[form.arrayIndexes[0]].bankStatements[form.arrayIndexes[1]].startMonthForTitle = moment(modelValue).format("MMMM YYYY");
                                            }
                                        },

                                        {
                                            key: "customer.customerBankAccounts[].bankStatements[].totalDeposits",
                                            type: "amount",
                                            calculator: true,
                                            required:true,
                                            title: "TOTAL_DEPOSITS"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].bankStatements[].totalWithdrawals",
                                            type: "amount",
                                            title: "TOTAL_WITHDRAWALS"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].bankStatements[].balanceAsOn15th",
                                            type: "amount",
                                            title: "BALENCE_AS_ON_REQUESTED_EMI_DATE"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].bankStatements[].noOfChequeBounced",
                                            type: "amount",
                                            required:true,
                                            title: "NO_OF_CHEQUE_BOUNCED"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].bankStatements[].noOfEmiChequeBounced",
                                            type: "amount",
                                            required:true,
                                            title: "NO_OF_EMI_CHEQUE_BOUNCED"
                                        },
                                    ]
                                },
                                {
                                    key: "customer.customerBankAccounts[].isDisbersementAccount",
                                    type: "radios",
                                    titleMap: [{
                                        value: true,
                                        name: "Yes"
                                    },{
                                        value: false,
                                        name: "No"
                                    }]
                                }
                            ]
                        }
                    ]
                }


            ],
            schema: function(){
                return Enrollment.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName){
                }
            }
        };
    }
})
