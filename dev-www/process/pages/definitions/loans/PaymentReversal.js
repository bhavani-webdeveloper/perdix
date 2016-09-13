irf.pageCollection.factory(irf.page("loans.PaymentReversal"),
["$log", "Queries", "SessionStore", "$state", "formHelper", "LoanAccount", "Utils", "PageHelper",
function($log, Queries, SessionStore, $state, formHelper, LoanAccount, Utils, PageHelper) {

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "REVERSE_REPAYMENT",
        initialize: function(model, form, formCtrl) {
            model.repayment = model.repayment || {};
            $log.info("Reversal Screen got initialized");
        },
        form: [
            {
                "type": "box",
                "title": "LAST_REPAYMENT",
                "items": [
                    {
                        "key": "repayment.branchName",
                        "title": "BRANCH",
                        "readonly": true
                    },
                    {
                        "key": "repayment.accountId",
                        "title": "ACCOUNT_NUMBER",
                        "type": "lov",
                        "autolov": true,
                        "inputMap": {
                            "account_number":{
                                "key":"repayment.accountId",
                                "title":"ACCOUNT_NUMBER"
                            }
                        },
                        "outputMap": {
                            "account_number": "repayment.accountId",
                            "branch_name": "repayment.branchName",
                            "urn_no":"repayment.urnNo",
                            "first_name":"repayment.customerName",
                            "transaction_id":"repayment.transactionId",
                            "repayment_type":"repayment.transactionName",
                            "repayment_date":"repayment.transactionDate",
                            "repayment_amount":"repayment.repaymentAmount"
                        },
                        "searchHelper": formHelper,
                        initialize: function(inputModel) {
                        },
                        search: function(inputModel, form, model) {
                            return Queries.getLatestLoanRepayment(inputModel.account_number || model.repayment.accountId);
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.account_number,
                                item.first_name,
                                'Rs.' + item.repayment_amount + ' on ' + item.repayment_date
                            ];
                        },
                        onSelect: function(result, model, context) {
                        }
                    },
                    {
                        "key": "repayment.urnNo",
                        "title": "CUSTOMER_URN",
                        "readonly": true
                    },
                    {
                        "key": "repayment.customerName",
                        "title": "CUSTOMER_NAME",
                        "readonly": true
                    },
                    {
                        "key": "repayment.transactionId",
                        "title": "TRANSACTION_ID",
                        "readonly": true
                    },
                    {
                        "key": "repayment.transactionName",
                        "title": "REPAYMENT_TYPE",
                        "readonly": true
                    },
                    {
                        "key": "repayment.transactionDate",
                        "title": "REPAYMENT_DATE",
                        "readonly": true,
                        "type": "date"
                    },
                    {
                        "key": "repayment.repaymentAmount",
                        "title": "AMOUNT",
                        "type": "amount",
                        "readonly": true
                    }
                ]
            },
            {
                "type": "actionbox",
                "items": [
                    {
                        "type": "submit",
                        "title": "REVERSE_REPAYMENT"
                    }
                ]
            }
        ],
        schema: {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "repayment": {
                    "type": "object",
                    "properties": {
                        "accountId": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        actions: {
            submit: function(model, form, formName) {
                PageHelper.clearErrors();
                Utils.confirm("Are you sure?").then(function(){
                    PageHelper.showLoader();
                    PageHelper.showProgress("payment-reversal","Processing Reversal",3000);
                    LoanAccount.manualReversal(model.repayment).$promise.then(function(resp) {
                        PageHelper.showProgress("payment-reversal","Transaction reversed successfully",3000);
                        var accountId = model.repayment.accountId;
                        model.repayment = {};
                    }, function(errResp) {
                        PageHelper.showErrors(errResp);
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });
                });
            }
        }
    };
}]);
/*

{
  "accountId": "100290100009",
  "transactionDate": "2016-09-13",
  "transactionId": "CMS235",
  "transactionName": "Scheduled",
  "urnNo": "1609019940231001"
}

*/