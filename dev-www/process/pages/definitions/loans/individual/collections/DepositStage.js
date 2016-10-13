irf.pageCollection.factory(irf.page("loans.individual.collections.DepositStage"),
["$log", "SessionStore","$state", "$stateParams", "irfElementsConfig","Queries","formHelper","CustomerBankBranch","LoanProcess","PageHelper",
function($log,SessionStore,$state,$stateParams,irfElementsConfig,Queries,formHelper,CustomerBankBranch,LoanProcess,PageHelper){

    var branch = SessionStore.getBranch();

    var computeTotal = function(model){
        model.totalAmount=0;
        for (var i = model.pendingCashDeposits.length - 1; i >= 0; i--) {
            model.totalAmount+=model.pendingCashDeposits[i].amount_collected;
        }
        model.amountDeposited = model.totalAmount;
    }

    return {
        "type": "schema-form",
        "title": "DEPOSIT_STAGE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");
            model.loggedInUser = SessionStore.getLoginname();

            Queries.getDepositList(SessionStore.getLoginname())
            .then(function (res){
                $log.info(res);
                model.pendingCashDeposits = [];
                model.loanAccounts = [];
                for (var i=0; i< res.body.length;i++){
                    var cashDeposit = res.body[i];
                    if(cashDeposit.repayment_amount_in_paisa>0)
                        cashDeposit.repayment_amount_in_paisa = cashDeposit.repayment_amount_in_paisa / 100;
                    model.pendingCashDeposits.push(
                        {
                            loan_ac_no: cashDeposit.account_number,
                            repaymentId: cashDeposit.id,
                            customer_name: cashDeposit.customer_name,
                            amount_collected: cashDeposit.repayment_amount_in_paisa
                        }
                    );
                    model.loanAccounts.push(cashDeposit.id);
                }
                computeTotal(model);
            },
            function(httpRes){
                PageHelper.showProgress('deposit-stage', 'Failed to load the deposit details. Try again.', 4000);
                PageHelper.showErrors(httpRes);
                PageHelper.hideLoader();
            });

        },
        offline: false,
        getOfflineDisplayItem: function(item, index){

        },
        form: [{
            "type": "box",
            "titleExpr": "'Cash to be deposited by '+ model.loggedInUser", // sample label code
            "colClass": "col-sm-12", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
            {
                "type":"array",
                "key":"pendingCashDeposits",
                "add":null,
                "remove":null,
                "view": "fixed",
                "readonly":true,
                "notitle":true,
                "items":[{
                    "type":"section",
                    "htmlClass": "row",
                    "items": [{
                        "type": "section",
                        "htmlClass": "col-xs-8 col-md-8",
                        "items": [{
                            "key":"pendingCashDeposits[].customer_name",
                            "titleExpr":"model.pendingCashDeposits[arrayIndex].loan_ac_no",
                            "title":" "
                        }]
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-4 col-md-4",
                        "items": [{
                            "key": "pendingCashDeposits[].amount_collected",
                            "type":"amount",
                            "title": " "
                        }]
                    }]
                }]
            },
            {
                "type":"section",
                "html":"<hr>"
            },
            {
                "type":"section",
                "htmlClass": "row",
                "items": [{
                    "type": "section",
                    "htmlClass": "col-sm-12",
                    "items": [{
                        "type": "amount",
                        "key": "totalAmount",
                        "title":"TOTAL_TO_BE_DEPOSITED",
                        "readonly":true
                    }]
                }]
            },
            {
                "key":"amountDeposited",
                "type":"amount",
                "title":"AMOUNT_DEPOSITED"
            },
            {
                key: "bankDepositSummary.bankAccountNumber",
                type: "lov",
                autolov: true,
                title:"DEPOSITED_TO_ACCOUNT",
                bindMap: {
                },
                outputMap: {
                    "account_number": "bankDepositSummary.bankAccountNumber"
                },
                searchHelper: formHelper,
                search: function(inputModel, form, model) {
                    return Queries.getBankAccounts();
                },
                getListDisplayItem: function(item, index) {
                    return [
                        item.account_number,
                        item.ifsc_code + ', ' + item.bank_name,
                        item.branch_name
                    ];
                }
            },
            {
                key: "bankDepositSummary.ifscCode",
                type: "lov",
                "title":"CASH_DEPOSIT_BRANCH_IFSC_CODE",
                lovonly: true,
                inputMap: {
                    "ifscCode": {
                        "key": "bankDepositSummary.ifscCode"
                    },
                    "bankName": {
                        "key": "bankDepositSummary.depositBank"
                    },
                    "branchName": {
                        "key": "bankDepositSummary.depositBranch"
                    }
                },
                onSelect:function(results,model,context) {
                    model.bankDepositSummary.ifscCode = results.ifscCode;
                    model.bankDepositSummary.bankBranchDetails = results.bankName + ' ' + results.branchName;
                },
                searchHelper: formHelper,
                search: function(inputModel, form) {
                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                    var promise = CustomerBankBranch.search({
                        'bankName': inputModel.depositBank,
                        'ifscCode': inputModel.ifscCode,
                        'branchName': inputModel.depositBranch
                    }).$promise;
                    return promise;
                },
                getListDisplayItem: function(data, index) {
                    return [
                        data.ifscCode,
                        data.branchName,
                        data.bankName
                    ];
                },
            },
            {
                "key":"bankDepositSummary.bankBranchDetails",
                "title":"DEPOSITED_BANK_BRANCH"
            }
            ]
        },{
            "type": "actionbox",
            "items": [{
                "type": "submit",
                "title": "SUBMIT"
            }]
        }],
        schema: {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                /*"repayment": {
                    "type": "object",
                    "properties": {
                        "repaymentId": {
                            "type": "string",
                            "title":"ACCOUNT_ID"
                        },
                        "amount": {
                            "type": "number",
                            "title":"AMOUNT_PAID"

                        },
                        "authorizationRemark": {
                            "type": "string",
                            "title":"AUTHORIZATION_REMARK"
                        },
                        "authorizationUsing": {
                            "type": "string",
                            "title":"AUTHORIZATION_USING"
                        },
                        "cashCollectionRemark": {
                            "type": "string",
                            "title":"CASH_COLLECTION_REMARK"
                        },
                        "groupCode": {
                            "type": "string",
                            "title":"GROUP_CODE"
                        },
                        "instrument": {
                            "type": "string",
                            "title": "INSTRUMENT_TYPE",
                            "required": true
                        },
                        "productCode": {
                            "type": "string",
                            "title":"PRODUCT_CODE"
                        },
                        "remarks": {
                            "type": "string",
                            "title":"REMARKS"
                        },
                        "repaymentDate": {
                            "type": "string",
                            "title":"REPAYMENT_DATE",
                            readonly:true,
                            "x-schema-form": {
                                "type": "date"
                            }
                        },
                        "transactionId": {
                            "type": "string",
                            "title":"TRANSACTION_ID"
                        },
                        "transactionName": {
                            "type": "string",
                            "title":"TRANSACTION_NAME",
                            "enumCode":"repayment_transaction_name",

                        },
                        "urnNo": {
                            "type": "string",
                            "title":"URN_NO"
                        }
                    },
                    required: [
                        'instrument'
                    ]
                },*/
                "repayments": [{
                    "type": "string"
                }],
                "bankDepositSummary": {
                    "type": "object",
                    "properties": {
                        "bankAccountNumber": {
                            "type": "string"

                        },
                        "bankBranchDetails": {
                            "type": "string"
                        },
                        "ifscCode": {
                            "type": "string",
                            "title":"IFSC_CODE"
                        },
                        "depositBank": {
                            "type": "string",
                            "title":"DEPOSITED_BANK"
                        },
                        "depositBranch": {
                            "type": "string",
                            "title":"DEPOSITED_BRANCH"
                        },
                    }
                }
            },
            "required": [
                "repaymentId",
                "amount",
                "authorizationRemark",
                "authorizationUsing",
                "cashCollectionRemark",
                "groupCode",
                "productCode",
                "remarks",
                "repaymentDate",
                "transactionId",
                "transactionName",
                "urnNo"
            ]
        },
        actions: {
            submit: function(model, form, formName){
                var reqData = {
                    'bankDepositSummary': _.cloneDeep(model.bankDepositSummary),
                    'repayments':_.cloneDeep(model.loanAccounts)
                };

                PageHelper.showProgress('update-loan', 'Working...');
                PageHelper.showLoader();
                $log.info(reqData);
                console.log(JSON.stringify(reqData));
                LoanProcess.processCashDeposit(reqData, function(response){
                    PageHelper.hideLoader();
                    $state.go('Page.Engine', {pageName: 'loans.individual.collections.BounceQueue', pageId: null});

                }, function(errorResponse){
                    PageHelper.hideLoader();
                    PageHelper.showErrors(errorResponse);
                });
            }
        }
    };
}]);
