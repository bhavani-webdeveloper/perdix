define({
    pageUID: "loans.individual.collections.DepositStageDetail",
    pageType: "Engine",
    dependencies: ["$log","SessionStore", "formHelper", "$stateParams", "PageHelper", "Utils", "LoanCollection", "irfNavigator","Queries","Files"],
    $pageFn: function ($log,SessionStore, formHelper, $stateParams, PageHelper, Utils, LoanCollection, irfNavigator, Queries, Files) {
        return {
            "type": "schema-form",
            "title": "DEPOSIT_STAGE_DETAIL",
            "subTitle": "",
            initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {

                /* 1)getting pagedata from predeposit detail page ,
                   2) loading total deposit amount and refrence from that data ,
                   3)fetching loan account number with ifsc code and branch to which deosit will be done
                   4) on proceed update in bank deposit summmary for cash and loan collection for cheque
                   5) reject will send back to pre deposit queue 
                 */
                model.branchname = SessionStore.getCurrentBranch().branchId;
                model.depositDetails = $stateParams.pageData;
            },
            form: [{
                "type": "box",
                "title": "CASH_TO_BE_DEPOSITED",
                "condition":"model.depositDetails && model.depositDetails.instrumentType.toLowerCase()=='cash'",
                "items": [{
                        "key":"",
                        "title": "TOTAL_TO_BE_DEPOSITED"
                    },
                    {
                        "key": "depositDetails.collectionDetail.totalAmount",
                        "title": "AMOUNT_DEPOSITED"
                    },
                    {
                        "key":"depositDetails.collectionDetail.depositId",
                        "title": "Refrence"
                    },
                    {
                        key: "depositDetails.collectionDetail.bankAccountNumber",
                        type: "lov",
                        autolov: true,
                        title: "DEPOSITED_IN_ACCOUNT",
                        required: true,
                        bindMap: {},
                        outputMap: {
                            "account_number": "depositDetails.collectionDetail.bankAccountNumber"
                        },
                        searchHelper: formHelper,
                        search: function (inputModel, form, model) {
                            return Queries.getBankAccountsByPartnerForLoanRepay();
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.account_number,
                                item.ifsc_code,
                                item.branch_name
                            ];
                        },
                        onSelect: function (valueObj, model, context) {
                            model.depositDetails.collectionDetail.bankAccountNumber = valueObj.account_number;
                            model.depositDetails.collectionDetail.ifscCode = valueObj.ifsc_code;
                            model.depositDetails.collectionDetail.bankBranchDetails = valueObj.branch_name; 
                        }
                    },
                    {
                        "key":"depositDetails.collectionDetail.ifscCode",
                        "title": "CASH_DEPOSIT_IFSC_CODE"
                    },
                    {
                        "key": "depositDetails.collectionDetail.bankBranchDetails",
                        "title": "CASH_DEPOSIT_BRANCH",
                    },
                    {
                        title: "BANK_CHALLAN1",
                        key: "depositDetails.collectionDetail.challanFileId",
                        type: "file",
                        fileType: "application/pdf",
                        category: "Loan",
                        subCategory: "DOC1",
                        using: "scanner"
                    }
                ]
            },
            {
                "type": "box",
                "title": "CHEQUE_TO_BE_DEPOSITED",
                "condition":"model.depositDetails && model.depositDetails.instrumentType.toLowerCase()=='chq'",
                items: [{
                    "key":"depositDetails.collectionDetail.demandAmount",
                    "title": "TOTAL_TO_BE_DEPOSITED"
                },
                {
                    "key": "depositDetails.collectionDetail.repaymentAmount",
                    "title": "AMOUNT_DEPOSITED"
                },
                {
                    "key":"depositDetails.collectionDetail.chequeDepositId",
                    "title": "Refrence"
                },{
                    key: "depositDetails.collectionDetail.bankAccountNumber",
                    condition: "model.depositDetails && model.depositDetails.instrumentType.toLowerCase()=='chq'",
                    title: "DEPOSITED_IN_ACCOUNT",
                    readonly: true
                },
                {
                    "key":"depositDetails.collectionDetail.chequeDepositedBankIfscCode",
                    "title": "CASH_DEPOSIT_IFSC_CODE",
                    "readonly": true,
                    "condition": "model.depositDetails && model.depositDetails.instrumentType.toLowerCase()=='chq'"
                },
                {
                    "key": "depositDetails.collectionDetail.accountBranchId",
                    "title": "CASH_DEPOSIT_BRANCH",
                    "readonly": true,
                    "condition":"model.depositDetails && model.depositDetails.instrumentType.toLowerCase()=='chq'"
                },
                {
                    title: "BANK_CHALLAN",
                    key: "depositDetails.collectionDetail.challanFileId",
                    type: "file",
                    fileType: "application/pdf",
                    category: "Loan",
                    subCategory: "DOC1",
                    using: "scanner"
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
                    /* 1)for cash using updateBankDepositSummaries and finnaly using batchRepay api to move to next branch
                       2)for cheque using loancollection api to update and move forward to next branch
                     */
                  
                    Utils.confirm("Are you sure ? ")
		            .then(function(){
                    // 1)cash collection details to be deposited
                        if(model.depositDetails && model.depositDetails.instrumentType.toLowerCase()=='cash'){
                    //UPDATE API to update deposit summary details
                            LoanCollection.updateDeposiSummary(model.depositDetails.collectionDetail).$promise
                                .then(function (res, head) {
                                    PageHelper.showProgress('Deposit-Stage', 'Successfully Updated', 5000);
                                    let cashProceedData = {
                                        "loanCollectionSummaryDTOs": [{
                                            "depositId_loanAccountNumber": model.depositDetails.id
                                        }],
                                        "remarks": model.review.remarks,
                                        "repaymentProcessAction": "PROCEED"
                                    }
                    //batchRepay to proceed loancollection account associated with bankSummaryID
                                    LoanCollection.batchUpdate(cashProceedData).$promise
                                        .then(function (res, head) {
                                            PageHelper.showProgress('Deposit-Stage', 'Successfully proceeded to BRSValidation', 5000);
                                            irfNavigator.goBack();
                                        }, function (httpres) {
                                            PageHelper.showProgress("Deposit-Stage", "Error in Proceeding to next stage", 5000);
                                        })
                                }, function (httpres) {
                                    PageHelper.showProgress("Deposit-Stage", "Error in updating the deposit data", 5000);

                                })
                                .finally(function () {
                                    PageHelper.hideBlockingLoader();
                                })
                        }else if(model.depositDetails && (model.depositDetails.instrumentType.toLowerCase()=='chq' || model.depositDetails.instrumentType.toLowerCase() == 'cheque')){
                            var chequeDepositData = {
                                "loanCollection": model.depositDetails.collectionDetail,
                                "repaymentProcessAction": "PROCEED"
                            }
                            LoanCollection.update(chequeDepositData).$promise
                                .then(function(res, head){
                                    PageHelper.showProgress('Deposit-Stage', 'Successfully proceeded to BRSValidation', 5000);
                                    irfNavigator.goBack();

                                }, function(httpres){
                                    PageHelper.showProgress("Deposit-Stage", "Error in Proceeding to next stage", 5000);

                                })
                        }
                    })
                   
                },
                reject: function (model, formCtrl, form, $event) {
                /* 1)rejection from this stage will go to preDeposit stage */
                $log.info("Inside reject()");
                Utils.confirm("Are you sure ? ")
                    .then(function () {
                        PageHelper.showBlockingLoader("Processing...");
                        var collectionData = {
                            "loanCollectionSummaryDTOs": [],
                            "remarks": model.review.remarks,
                            "repaymentProcessAction": "PROCEED",
                            "stage": "PreDeposit"
                        }
                        if (model.depositDetails && model.depositDetails.instrumentType.toLowerCase()=='cash') {
                                collectionData['loanCollectionSummaryDTOs'].push({
                                    depositId_loanAccountNumber: model.depositDetails.id
                                });

                        } else if (model.depositDetails && (model.depositDetails.instrumentType.toLowerCase()=='chq' || model.depositDetails.instrumentType.toLowerCase() == 'cheque')) {
                            collectionData['loanCollectionSummaryDTOs'].push({
                                depositId_loanAccountNumber: model.depositDetails.id
                            });

                        }
                        LoanCollection.batchUpdate(collectionData).$promise
                            .then(function (res, head) {
                                PageHelper.showProgress('Deposit-Reject', 'successfully Rejected', 5000);
                                irfNavigator.goBack();
                            }, function (httpres) {
                                PageHelper.showProgress("Deposit-Reject", "Error in in Reject", 5000);

                            })
                            .finally(function () {
                                PageHelper.hideBlockingLoader();
                            })

                    })
                    
                   
                }
            }
        }
    }
})