 define({
            pageUID: "loans.individual.collections.BranchDepositDetail",
            pageType: "Engine",
            dependencies: ["$log", "$state", "SessionStore", "formHelper", "$q", "$stateParams", "PageHelper", "Utils","LoanCollection","irfNavigator"],
            $pageFn: function($log, $state, SessionStore, formHelper, $q, $stateParams, PageHelper, Utils, LoanCollection, irfNavigator) {
                return {
                    "type": "schema-form",
                    "title": "DEPOSITED_BRANCH_DETAILS",
                    "subTitle": "",
                    initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {  
                        model.branchname = SessionStore.getCurrentBranch().branchName;
                        model.branchCollectionDetail= $stateParams.pageData;
                        if(model.branchCollectionDetail && model.branchCollectionDetail[0]['instrumentType']=='CASH'){
                            model.loanCollectionDetail={
                                totalCashCollected :0
                            }
                            _.each(model.branchCollectionDetail,function(cashItems){
                                model.loanCollectionDetail.totalCashCollected += cashItems.repaymentAmount;
                            })
                        }
                        if(model.branchCollectionDetail && model.branchCollectionDetail[0]['instrumentType']=='CHQ'){
                            model.loanCollectionDetail = {
                                "id" : model.branchCollectionDetail[0]['id'],
                                "customerName": model.branchCollectionDetail[0]['customerName'],
                                "accountNumber": model.branchCollectionDetail[0]['accountNumber'],
                                "repaymentAmount": model.branchCollectionDetail[0]['repaymentAmount'],
                                "reference": model.branchCollectionDetail[0]['reference'],
                                "instrumentDate": model.branchCollectionDetail[0]['instrumentDate'],
                                "instrumentType": model.branchCollectionDetail[0]['instrumentType'],
                                "repaymentDate": model.branchCollectionDetail[0]['repaymentDate']
                            }
                        }
                },
                form: [{
                    "type":"box",
                    "title": "DEPOSITED_CASH_DETAILS",
                    "readonly":true,
                    "condition": "model.branchCollectionDetail[0]['instrumentType']=='CASH'",
                    "items":[{
                        "key":"branchname",
                        "title":"BRANCH_NAME"
                    },
                    { 
                        "key": "",
                        "title": "SPOKE_NAME"
                    },{
                        "key":"loanCollectionDetail.totalCashCollected",
                        "title":"TOTAL_AMOUNT_COLLECTED"
                    }]
                },
                {
                    "type":"box",
                    "title": "DEPOSITED_CHEQUE_DETAILS",
                    "readonly": true,
                    "condition": "model.branchCollectionDetail[0]['instrumentType']=='CHQ'",
                    "items":[{
                        "key":"branchname",
                        "title":"BRANCH_NAME"
                    },
                    {
                        "key":"",
                        "title":"SPOKE_NAME"
                    },
                    {
                        "key":"loanCollectionDetail.customerName",
                        "title":"BUSINESS_NAME"
                    },
                    {
                        "key":"loanCollectionDetail.accountNumber",
                        "title":"LOAN_ACCOUNT_NO1"
                    },
                    {
                        "key":"loanCollectionDetail.repaymentAmount",
                        "title":"COLLECTED_AMOUNT"
                    },
                    {
                        "key":"loanCollectionDetail.reference",
                        "title":"CHEQUE_NUMBER1"
                    },
                    {
                        "key":"loanCollectionDetail.instrumentDate",
                        "title":"CHEQUE_DATE1"
                    }]
                },
                {
                    "type": "box",
                    "title": "PROCEED_SECTION",
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
                        },{
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
                        }]
                }],
                schema:{
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "type": "object",
                        "properties": {
                            "loanCollectionDetail": {
                                "type":"object",
                                "properties":{
                                    "totalCashCollected": {
                                        "type": ["string",null],
                                        "title":"TOTAL_AMOUNT_COLLECTED"
                                    },
                                    "customerName":{
                                        "type": ["string",null],
                                        "title":"BUSINESS_NAME"
                                    },
                                    "accountNumber":{
                                        "type": ["string",null],
                                        "title":"LOAN_ACCOUNT_NO"
                    
                                    },
                                    "repaymentAmount":{
                                        "type": ["string",null],
                                        "title":"Collected Amount"
                                    },
                                    "reference":{
                                        "type": ["string",null],
                                        "title":"CHEQUE_NUMBER"
                                    },
                                    "instrumentDate":{
                                        "type": ["string",null],
                                        "title":"CHEQUE_DATE"
                                    }
                                }
                            }
                        },
                        "required": [
                        ]},
                eventListeners: {},
                actions: {
                    proceed: function(model, formCtrl, form, $event){
                        /*
                            a) if action is proceed 
                                1)For cheque, calling LoanCollection update method ,
                                2) for cash , calling loancollection batch repay method ,
                                3) both above call with loancollection {id}
                                4) branch to be updated the pre-deposit ,
                            
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
                            .then(function () {
                                $log.info("Inside proceed()");
                                PageHelper.showBlockingLoader("Processing...");
        
                                if (model.branchCollectionDetail && model.branchCollectionDetail[0]['instrumentType'] == 'CASH') {
                                    var cashCollectionData = {
                                        "loanCollectionSummaryDTOs": [],
                                        "remarks": model.review.remarks,
                                        "repaymentProcessAction": "PROCEED",
                                        "stage": "PreDeposit"
                                    }
                                    _.each(model.branchCollectionDetail, function (cashCollectionDetail) {
                                        cashCollectionData.loanCollectionSummaryDTOs.push({
                                            loanCollectionId: cashCollectionDetail.id
                                        });
                                    })
                                    LoanCollection.batchUpdate(cashCollectionData).$promise
                                        .then(function (res, head) {
                                            PageHelper.showProgress('BranchDeposit', 'successfully moved to preDeposit', 5000);
                                            irfNavigator.goBack();
                                        }, function (httpres) {
                                            PageHelper.showProgress("BranchDeposit", "Error in proceeding to preDeposit", 5000);
        
                                        })
                                        .finally(function () {
                                            PageHelper.hideBlockingLoader();
                                        })
        
        
                                } else if (model.branchCollectionDetail && model.branchCollectionDetail[0]['instrumentType'] == 'CHQ') {
                                    var chequeCollectionData = {
                                        "loanCollection": model.branchCollectionDetail[0],
                                        "repaymentProcessAction": "PROCEED",
                                        "stage": "PreDeposit"
                                    };
                                    
                                    LoanCollection.update(chequeCollectionData).$promise
                                        .then(function (res, head) {
                                            PageHelper.showProgress('BranchDeposit', 'successfully moved to preDeposit', 5000);
                                            irfNavigator.goBack();
                                        }, function (httpres) {
                                            PageHelper.showProgress("BranchDeposit", "Error in proceeding to preDeposit", 5000);
        
                                        })
                                        .finally(function () {
                                            PageHelper.hideBlockingLoader();
                                        })
        
                                }
                                
                            })
           
                    },
                    reject: function(model, formCtrl, form, $event){
                        /*a) if action is reject
                                1) sending to reject stage , calling loancollection/batchRepay 
                                2) cheque have validation that it will always come in this branch as single unit
                        */
                        Utils.confirm("Are you sure ? ")
                            .then(function () {
                                $log.info("Inside reject()");
                                PageHelper.showBlockingLoader("Processing...");
                                var collectionData = {
                                    "loanCollectionSummaryDTOs": [],
                                    "remarks": model.review.remarks,
                                    "repaymentProcessAction": "PROCEED",
                                    "stage": "Rejected"
                                }
                                if (model.branchCollectionDetail && model.branchCollectionDetail[0]['instrumentType'] == 'CASH') {
                                    _.each(model.branchCollectionDetail, function (collectionDetail) {
                                        collectionData.loanCollectionSummaryDTOs.push({
                                            loanCollectionId: collectionDetail.id
                                        });
                                    })
        
                                } else if (model.branchCollectionDetail && model.branchCollectionDetail[0]['instrumentType'] == 'CHQ') {
                                    collectionData['loanCollectionSummaryDTOs'].push({loanCollectionId:model.branchCollectionDetail[0]['id']});
        
                                }
                                //After getting collectionData either for cash or for chq , hit the batch update api
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

                            })
                       
                    }
                }
            }
        }
    })