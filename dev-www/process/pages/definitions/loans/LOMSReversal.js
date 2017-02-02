irf.pageCollection.factory(irf.page("loans.LOMSReversal"),
["$log", "Queries", "SessionStore", "$state", "formHelper", "LoanAccount", "Utils", "PageHelper", "$q",
function($log, Queries, SessionStore, $state, formHelper, LoanAccount, Utils, PageHelper, $q) {

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "REVERSE_FROM_LOMS",
        initialize: function(model, form, formCtrl) {
            model.repayment = model.repayment || {};
            $log.info("LOMS Reversal screen");
        },
        form: [
            {
                "type": "box",
                "title": "LAST_REPAYMENT",
                "items": [
                    {
                        "key": "input.accountNumber",
                        "title": "ACCOUNT_NUMBER",
                        "type": "string",
                        "required": true
                    },
                    {
                        "key": "input.transactionName",
                        "title": "TRANSACTION_NAME",
                        "type": "select",
                        "titleMap": {
                            "Fee Charge": "Fee Charge",
                            "SecurityDeposit": "SecurityDeposit"
                        },
                        "required": true
                    },
                    {
                        "key": "input.getTransactionForReversal",
                        "type": "button",
                        "title": "FIND_TRANSACTION",
                        "onClick": function(model, formCtrl, form){
                            if (PageHelper.isFormInvalid(formCtrl, true)){
                                return;
                            }
                            PageHelper.clearErrors();
                            PageHelper.showLoader();
                            model.transaction = null;
                            LoanAccount.getTransactionForReversalInLoms(model.input)
                                .$promise
                                .then(function(transaction){
                                    model.transaction = transaction;
                                    model.transaction.$$reversalDone = false;
                                }, function(httpRes){
                                    PageHelper.showErrors(httpRes);
                                })
                                .finally(function(){
                                    PageHelper.hideLoader();
                                })
                        }
                    }
                ]
            },
            {
                "type": "box",
                "title": "TRANSACTION_DETAILS",
                "condition": "model.transaction!=null",
                "items": [
                     {
                         "key": "transaction.transactionId",
                         "type": "string",
                         "readonly": true,
                         "title": "TRANSACTION_ID"
                     },
                     {
                         "key": "transaction.transactionName",
                         "type": "string",
                         "readonly": true,
                         "title": "TRANSACTION_NAME"
                     },
                     {
                         "key": "transaction.valueDateStr",
                         "type": "date",
                         "readonly": true,
                         "title": "VALUE_DATE"
                     },
                     {
                         "key": "transaction.amount1",
                         "type": "string",
                         "readonly": true,
                         "title": "AMOUNT"
                     }
                ]
            },
            {
                "type": "actionbox",
                "condition": "model.transaction!=null && model.transaction.$$reversalDone==false",
                "items": [
                    {
                        "type": "submit",
                        "title": "REVERSE_TRANSACTION"
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
                    model.transaction.transactionNameToBeReversed = model.input.transactionName;
                    LoanAccount.reverseFromLOMS(model.transaction).$promise.then(function(resp) {
                        PageHelper.showProgress("payment-reversal","Transaction reversed successfully",3000);
                        model.transaction.$$reversalDone = true;
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