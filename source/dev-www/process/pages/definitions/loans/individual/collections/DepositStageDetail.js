define({
    pageUID: "loans.individual.collections.DepositStageDetail",
    pageType: "Engine",
    dependencies: ["$log","CustomerBankBranch","SessionStore", "formHelper", "$stateParams", "PageHelper", "Utils", "LoanCollection", "irfNavigator","Queries","Files"],
    $pageFn: function ($log,CustomerBankBranch,SessionStore, formHelper, $stateParams, PageHelper, Utils, LoanCollection, irfNavigator, Queries, Files) {
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
                //model.depositDetails.ifscCode = model.depositDetails.collectionDetail.ifscCode;
            },
            form: [{
                "type": "box",
                "title": "CASH_TO_BE_DEPOSITED",
                "condition":"model.depositDetails && model.depositDetails.instrumentType.toLowerCase()=='cash'",
                "items": [{
                        "key":"depositDetails.collectionDetail.depositId",
                        "title": "DEPOSIT_ID",
                        "readonly":true
                    },{
                        "key":"depositDetails.collectionDetail.totalAmount",
                        "title": "TOTAL_TO_BE_DEPOSITED",
                        "readonly":true
                    },
                    {
                        "key": "depositDetails.collectionDetail.totalAmount",
                        "title": "AMOUNT_DEPOSITED",
                        "readonly":true
                    },
                    {
                        "key":"depositDetails.collectionDetail.reference",
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
                                item.account_number
                            ];
                        },
                        onSelect: function (valueObj, model, context) {
                            model.depositDetails.collectionDetail.bankAccountNumber = valueObj.account_number;
                        }
                    },
                    {
                        key: "depositDetails.collectionDetail.ifscCode",
                        type: "lov",
                        "title": "CASH_DEPOSIT_IFSC_CODE",
                        lovonly: true,
                        inputMap: {
                            "ifscCode": {
                                "key": "depositDetails.collectionDetail.ifscCode"
                            },
                            "depositBank": {
                                "key": "depositDetails.collectionDetail.depositBank"
                            },
                            "depositBranch": {
                                "key": "depositDetails.collectionDetail.depositBranch"
                            }
                        },
                        onSelect: function(results, model, context) {
                            model.depositDetails.collectionDetail.ifscCode = results.ifscCode;
                            model.depositDetails.collectionDetail.bankBranchDetails = results.branchName;
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form) {
                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                            var promise = CustomerBankBranch.search({
                                'ifscCode': inputModel.ifscCode,
                                'branchName': inputModel.depositBranch
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                data.ifscCode,
                                data.branchName
                            ];
                        },
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
                        using: "scanner",
                        required:true
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
                    "depositDetails": {
                        "type": "object",
                        "properties": {
                            "collectionDetail": {
                                "type": "object",
                                "properties": {
                                    "ifscCode": {
                                        "type": "string",
                                        "title": "IFSC_CODE"
                                    },
                                    "depositBank": {
                                        "type": "string",
                                        "title": "DEPOSITE_BANK"
                                    },
                                    "depositBranch": {
                                        "type": "string",
                                        "title": "DEPOSITE_BRANCH"
                                    }
                                }
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
                    if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("loan", "Your form have errors. Please fix them.", 5000);
                            return false;
                    }
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