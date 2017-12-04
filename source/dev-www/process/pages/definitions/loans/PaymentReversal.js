irf.pageCollection.factory(irf.page("loans.PaymentReversal"),
["$log", "Queries", "SessionStore", "$state", "formHelper", "LoanAccount", "Utils", "PageHelper", "$q",
function($log, Queries, SessionStore, $state, formHelper, LoanAccount, Utils, PageHelper, $q) {

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
                        "key": "repayment.branchId",
                        "title": "BRANCH",
                        "enumCode": "branch_id",
                        "type": "select",
                        "readonly": true
                    },
                    {
                        "key": "repayment.accountId",
                        "title": "ACCOUNT_NUMBER",
                        "type": "lov",
                        "autolov": true,
                        "inputMap": {
                            "accountId":{
                                "key":"repayment.accountId",
                                "title":"ACCOUNT_NUMBER"
                            }
                        },
                        "outputMap": {
                            "accountId": "repayment.accountId",
                            "branchName": "repayment.branchName",
                            "urnNo":"repayment.urnNo",
                            "customerName":"repayment.customerName",
                            "transactionId":"repayment.transactionId",
                            "transactionName":"repayment.transactionName",
                            "transactionDate":"repayment.transactionDate",
                            "amount":"repayment.amount"
                        },
                        "searchHelper": formHelper,
                        initialize: function(inputModel) {
                        },
                        search: function(inputModel, form, model) {
                            var deferred = $q.defer();
                            LoanAccount.findTransactionForReversal({accountNo: (inputModel.accountId || model.repayment.accountId)}).$promise
                            .then(function(resp) {
                                deferred.resolve({
                                    "headers": {
                                        "x-total-count": 1
                                    },
                                    body: [resp]
                                });
                            }, deferred.reject);
                            return deferred.promise;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.account_number,
                                item.first_name,
                                'Rs.' + item.repayment_amount + ' on ' + item.repayment_date
                            ];
                        },
                        onSelect: function(result, model, context) {
                            PageHelper.showProgress("loading-account-details", "Loading Account Details...");
                            PageHelper.showLoader();
                            Queries.getAccountDetails([result.accountId])
                                .then(
                                    function(res){
                                        if (res.body.length == 0){
                                            PageHelper.showProgress("loading-account-details", "Unable to load loan details", 5000);
                                        }
                                        if (res.body.length > 0){
                                            PageHelper.showProgress("loading-account-details", "Done", 5000);
                                            model.repayment.branchId = res.body[0].branch_id;
                                            model.repayment.customerName = res.body[0].first_name;  
                                            model.repayment.customerType = res.body[0].customer_type;  
                                        }
                                    }, function(httpRes){
                                        PageHelper.showProgress("loading-account-details", "Unable to load loan details", 5000);
                                    }
                                )
                                .finally(function(){
                                    PageHelper.hideLoader();
                                })

                        }
                    },
                    {
                        "key": "repayment.urnNo",
                        "title": "URN",
                        "readonly": true
                    },
                    {
                        "key": "repayment.customerName",
                        "title": "CUSTOMER_NAME",
                        "condition": "model.repayment.customerType == 'Individual'",
                        "readonly": true
                    },
                    {
                        "key": "repayment.customerName",
                        "title": "ENTERPRISE_NAME",
                        "condition": "model.repayment.customerType == 'Enterprise'",
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
                        "key": "repayment.amount",
                        "title": "AMOUNT",
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
                    LoanAccount.manualReversalOfRepayments(model.repayment).$promise.then(function(resp) {
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