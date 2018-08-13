define({
    pageUID: "loans.individual.disbursement.DisbursementReversalQueue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "SessionStore","$q", "IndividualLoan","PageHelper","Queries"],
    $pageFn: function($log, formHelper, SessionStore,$q, IndividualLoan,PageHelper,Queries) {
        return {
            "type": "schema-form",
            "title": "DISBURSEMENT_REVERSAL_QUEUE",
            "subTitle": "",
            "uri":"",
            initialize: function (model, form, formCtrl) {
                model.DisbursementReverse = model.DisbursementReverse || {};
                model.branchName = SessionStore.getBranch();
                model.branch = SessionStore.getCurrentBranch().branchId;

                model.currentStage = 'Completed';
                console.log(model);
            },
            form: [
                {
                    "type": "box",
                    "title": "LAST_DISBURSEMENT_DATA",
                    "items": [
                        {
                            "key": "DisbursementReverse.branchId",
                            "title": "BRANCH",
                            "enumCode": "branch_id",
                            "type": "userbranch",
                            "readonly": true
                        },
                        {
                            "key": "DisbursementReverse.accountNumber",
                            "title": "ACCOUNT_NUMBER",
                            "type": "lov",
                            "autolov": true,
                            "inputMap": {
                                "accountNumber":{
                                    "key":"DisbursementReverse.accountNumber",
                                    "title":"ACCOUNT_NUMBER"
                                }
                            },
                            "outputMap": {
                                "accountNumber": "DisbursementReverse.accountNumber",
                                "branchId": "DisbursementReverse.branchId",
                                "customerName":"DisbursementReverse.customerName",
                                "transactionId":"DisbursementReverse.transactionId",
                                "transactionName":"DisbursementReverse.transactionName",
                                "actualDisbursementDate":"DisbursementReverse.actualDisbursementDate",
                                "disbursedAmount":"DisbursementReverse.disbursedAmount"
                            },
                            "searchHelper": formHelper,
                            initialize: function(inputModel) {
                            },
                            search: function(inputModel, form, model) {
                                var deferred = $q.defer();
                                IndividualLoan.searchDisbursement({
                                    'currentStage': 'Completed',
                                    'accountNumber':  (inputModel.accountNumber || model.DisbursementReverse.accountNumber)
                                    
                                }).$promise
                                  .then(function(resp){
                                      deferred.resolve({
                                          "headers": {
                                              "x-total-count": 1
                                          },
                                          body: [resp.body[0]]
                                      });
                                  },deferred.reject);
                                return deferred.promise;
                            },
                            getListDisplayItem: function(item, index) {
                                $log.info(item);
                                return [
                                    item.body[0].accountNumber,
                                    item.body[0].branchName,
                                    item.body[0].customerName,
                                    item.body[0].transactionId,
                                    item.body[0].transactionName,
                                    item.body[0].actualDisbursementDate,
                                    item.body[0].disbursedAmount
                                ];
                            },
                            onSelect: function(result, model, context) {
    
                            }
                        },
                        {
                            "key": "DisbursementReverse.customerName",
                            "title": "CUSTOMER_NAME",
                            "condition": "model.DisbursementReverse.customerType == 'Individual'",
                            "readonly": true
                        },
                        {
                            "key": "DisbursementReverse.customerName",
                            "title": "ENTERPRISE_NAME",
                            "condition": "model.DisbursementReverse.customerType == 'Enterprise'",
                            "readonly": true
                        },
                        {
                            "key": "DisbursementReverse.transactionId",
                            "title": "TRANSACTION_ID",
                            "readonly": true
                        },
                        {
                            "key": "DisbursementReverse.actualDisbursementDate",
                            "title": "DISBURSEMENT_DATE",
                            "readonly": true,
                            "type": "date"
                        },
                        {
                            "key": "DisbursementReverse.disbursedAmount",
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
                            "title": "REVERSE_DISBURSEMENT"
                        }
                    ]
                }
            ],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "DisbursementReverse": {
                        "type": "object",
                        "properties": {
                            "accountNumber": {
                                "type": "string"
                            }
                        }
                    }
                }
            },
            actions: {
                submit: function(model, form, formName) {
                    if(PageHelper.isFormInvalid(form)) {
                        return false;
                    }
                    if(window.confirm("Are you sure?")){
                        PageHelper.showLoader();
                        var reqData={};
                            reqData.disbursementConfirmations =[];
                            var targetStage='ReadyForDisbursement';
                            reqData.disbursementConfirmations.push({
                                                accountNumber: model.DisbursementReverse.accountNumber,
                                                "currentStage": "Completed",
                                                stage: targetStage,
                                                status: "REJECT",
                                                tranchNumber:model.DisbursementReverse.trancheNumber,
                                                transactionId: model.DisbursementReverse.transactionId,
                                                udf1:"Rejected",
                                                udf4:model.DisbursementReverse.udf4,
                                                udf5:model.DisbursementReverse.udf5
                                            });
                            delete reqData.DisbursementReverse;
                            IndividualLoan.batchDisbursementConfirmation(reqData,function(resp,header){
                                PageHelper.showProgress("upd-disb","Done.","5000");
                                backToQueue();
                            },function(resp){
                                PageHelper.showProgress("upd-disb","Oops. An error occurred","5000");
                                PageHelper.showErrors(resp);

                            }).$promise.finally(function(){
                                PageHelper.hideLoader();
                            });  
                    }
                }
            }
        }
    }
})
