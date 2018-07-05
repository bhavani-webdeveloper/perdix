define({
    pageUID: "loans.individual.collections.PreDepositDetail",
    pageType: "Engine",
    dependencies: ["$log", "$state", "SessionStore", "formHelper", "$q", "$stateParams", "PageHelper", "Utils", "LoanCollection", "irfNavigator","Maintenance"],
    $pageFn: function ($log, $state, SessionStore, formHelper, $q, $stateParams, PageHelper, Utils, LoanCollection, irfNavigator, Maintenance) {
        return {
            "type": "schema-form",
            "title": "PREDEPOSIT_CONSOLIDATED",
            "subTitle": "",
            initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                model.branchname = SessionStore.getCurrentBranch().branchId;
                model.collectionDetails = $stateParams.pageData;
            /* 1) Calling maintenance api to get the sequence number */
            model.depositID ; 
                Maintenance.getSequenceNumber({sequenceName: 'challan-Number'}).$promise
                .then(function (res, head) {
                    $log.info("successfully got the depositID")
                    model.depositID=res.sequenceNumber;
                }, function (httpres) {
                    PageHelper.showProgress("BranchDeposit", "Error getting the depostiId", 5000);
                })
            /* 1)calculating toatal sum to update in bank deposit summary */
            
                if(model.collectionDetails && model.collectionDetails[0]['instrumentType']=='CASH'){
                    model.totalCashCollected =0;
                    _.each(model.collectionDetails,function(cashItems){
                        model.totalCashCollected += cashItems.repaymentAmount;
                    })
                }
            },
            form: [{
                "type": "box",
                "title":"PREDEPOSIT",
                "colClass": "col-sm-12",
                "readonly": true,
                "items":[{
                    "type":"tableview",
                    "title": "CASH_COLLECTED_CONSOLIDATED",
                    "selectable": true,
                    "expandable": true,
                    "key":"collectionDetails",
                    getColumns: function() {
                     return [{
                            "title":"BUSINESS_NAME",
                            "data" :"customerName"
                        },
                        {
                            "title":"LOAN_ACCOUNT_NO",
                            "data":"accountNumber"
                        },
                        {
                            "title":"BRANCH_NAME",
                            "data":"branchName"
                        },
                        {
                            "title":"SPOKE_NAME",
                            "data":"centreName"
                        },
                        {
                            "title":"INSTRUMENT_TYPE",
                            "data":"instrumentType"
                        },
                        {
                            "title":"TOTAL_DEMANDED",
                            "data": "demandAmount"

                        },
                        {
                            "title":"TOTAL_COLLECTED3",
                            "data":"repaymentAmount"
                        }]
                    }
                    }]

                },
                {
                    "type": "box",
                    "title": "PROCEED_SECTION",
                    "colClass": "col-sm-12",
                    "items": [{
                            key: "review.action",
                            type: "radios",
                            titleMap: {
                                "REJECT": "REJECT",
                                "PROCEED": "PROCEED"
                            }
                        },
                        {
                            type: "section",
                            condition: "model.review.action=='PROCEED'",
                            items: [{
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
                                required: true
                            }, {
                                key: "review.proceedButton",
                                type: "button",
                                title: "PROCEED",
                                onClick: "actions.proceed(model, formCtrl, form, $event)"
                            }]
                        },
                        {
                            type: "section",
                            condition: "model.review.action == 'REJECT'",
                            items: [{
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
                                required: true
                            }, {
                                key: "review.proceedButton",
                                type: "button",
                                title: "REJECT",
                                onClick: "actions.reject(model, formCtrl, form, $event)"
                            }]
                        }
                    ]
                }
            ],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "collectionDetails1": {
                        "type": "object",
                        "properties": {
                            "customerName": {
                                "type": ["string", null],
                                "title": "BUSINESS_NAME"
                            },
                            "accountNumber": {
                                "type": ["string", null],
                                "title": "LOAN_ACCOUNT_NO"

                            },
                            "repaymentAmount": {
                                "type": ["string", null],
                                "title": "Collected Amount"
                            }
                        }
                    }
                },
                "required": []
            },
            eventListeners: {},
            actions: {
                proceed: function (model, formCtrl, form, $event) {
                    /*
                        a) if action is proceed 
                            1)For cheque, calling LoanCollection update method ,
                            2) for cash , calling loancollection batch repay method ,
                            3) both above call with loancollection {id}
                            4) branch to be updated the pre-deposit ,
                        
                    */
                    $log.info("Inside proceed()");
                    PageHelper.showBlockingLoader("Processing...");
                    if (model.collectionDetails && model.collectionDetails[0]['instrumentType'] == 'CASH') {
                        var cashDepositSummary = {
                                bankDepositSummary : {
                                    depositId:model.depositID,
                                    totalAmount:  model.totalCashCollected,
                                    loanCollections: model.collectionDetails
                                },
                                loanCollectionIds : [],
                                loanColleactions: model.collectionDetails,
                                depositId : model.depositID
                            }
                        _.each(model.collectionDetails, function (cashCollectionDetail) {
                            cashDepositSummary['loanCollectionIds'].push(cashCollectionDetail.id);
                        })

                        LoanCollection.processCashDeposite(cashDepositSummary).$promise
                            .then(function (res, head) {
                                PageHelper.showProgress('PreDeposit', 'successfully moved to Deposit', 5000);
                                irfNavigator.goBack();
                            }, function (httpres) {
                                PageHelper.showProgress("PreDeposit", "Error in proceeding to Deposit", 5000);

                            })
                            .finally(function () {
                                PageHelper.hideBlockingLoader();
                            })


                    } else if (model.collectionDetails && model.collectionDetails[0]['instrumentType'] == 'CHQ') {
                        var chequeCollectionData = {
                            "loanCollection": model.collectionDetails[0],
                            "repaymentProcessAction": "PROCEED",
                            "stage": "Deposit"
                        };
                        chequeCollectionData['loanCollection']['chequeDepositId']= model.depositID;
                        LoanCollection.update(chequeCollectionData).$promise
                            .then(function (res, head) {
                                PageHelper.showProgress('PreDeposit', 'successfully moved to Deposit', 5000);
                                irfNavigator.goBack();
                            }, function (httpres) {
                                PageHelper.showProgress("PreDeposit", "Error in proceeding to Deposit", 5000);

                            })
                            .finally(function () {
                                PageHelper.hideBlockingLoader();
                            })

                    }
                },
                reject: function (model, formCtrl, form, $event) {
                    /*a) if action is reject
                            1) sending to reject stage , calling loancollection/batchRepay 
                            2) cheque have validation that it will always come in this branch as single unit
                    */
                    $log.info("Inside reject()");
                    PageHelper.showBlockingLoader("Processing...");
                    var collectionData = {
                        "loanCollectionSummaryDTOs": [],
                        "remarks": model.review.remarks,
                        "repaymentProcessAction": "PROCEED",
                        "stage": "Rejected"
                    }
                    if (model.collectionDetails && model.collectionDetails[0]['instrumentType'] == 'CASH') {
                        _.each(model.collectionDetails, function (collectionDetail) {
                            collectionData.loanCollectionSummaryDTOs.push({
                                loanCollectionId: collectionDetail.id
                            });
                        })

                    } else if (model.collectionDetails && model.collectionDetails[0]['instrumentType'] == 'CHQ') {
                        collectionData['loanCollectionSummaryDTOs'].push({
                            loanCollectionId: model.collectionDetails[0]['id']
                        });

                    }
                    LoanCollection.batchUpdate(collectionData).$promise
                        .then(function (res, head) {
                            PageHelper.showProgress('BranchDepositReject', 'successfully Rejected', 5000);
                            irfNavigator.goBack();
                        }, function (httpres) {
                            PageHelper.showProgress("BranchDepositReject", "Error in in Reject", 5000);

                        })
                        .finally(function () {
                            PageHelper.hideBlockingLoader();
                        })
                }
            }
        }
    }
})