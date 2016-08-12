irf.pageCollection.factory(irf.page('loans.LoanRepay'),
    ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
        ,"LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
        "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils",
        function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils) {

            function backToLoansList(){
                try {
                    var urnNo = ($stateParams.pageId.split("."))[1];
                    $state.go("Page.Engine", {
                        pageName: "customer360.loans.View",
                        pageId: urnNo
                    });
                }catch(err){
                    console.log(err);
                    // @TODO : Where to redirect if no page params present
                }
            }

            function deriveAmount(txnType, repaymentObj){
                var amount = 0;
                switch(txnType){
                    case 'Pre-closure':
                        amount = parseFloat(repaymentObj.payOffAndDueAmount);
                        break;
                    case 'Scheduled Demand':
                        amount = parseFloat(repaymentObj.totalDemandDue);
                        break;
                    default:
                        amount = 0;
                        break;
                }
                return amount;
            }

            return {
                "id": "LoanRepay",
                "type": "schema-form",
                "name": "LoanRepay",
                "title": "LOAN_REPAYMENT",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    PageHelper.showLoader();
                    irfProgressMessage.pop('loading-loan-details', 'Loading Loan Details');
                    //PageHelper
                    var loanAccountNo = ($stateParams.pageId.split("."))[0];
                    var promise = LoanAccount.get({accountId: loanAccountNo}).$promise;
                    promise.then(function (data) { /* SUCCESS */
                        model.loanAccount = data;
                        console.log(data);
                        model.repayment = {
                            'accountId': data.accountId,
                            'totalDemandDue': data.totalDemandDue,
                            'payOffAndDueAmount': data.payOffAndDueAmount
                        };

                        var currDate = moment(new Date()).format("YYYY-MM-DD");
                        model.repayment.repaymentDate = currDate;
                        irfProgressMessage.pop('loading-loan-details', 'Loaded.', 2000);
                    }, function (resData) {
                        irfProgressMessage.pop('loading-loan-details', 'Error loading Loan details.', 4000);
                        PageHelper.showErrors(resData);
                        backToLoansList();
                    })
                    .finally(function () {
                        PageHelper.hideLoader();
                    })

                },
                offline: false,
                form: [
                    {
                        "type": "box",
                        "title": "REPAY",
                        "items": [
                            {
                                key:"repayment.accountId",
                                readonly:true
                            },
                            {
                                key:"repayment.transactionName",
                                "type":"select",
                                "titleMap":{
                                    "Advance Repayment":"Advance Repayment",
                                    "Scheduled Demand":"Scheduled Demand",
                                    "Fee Payment":"Fee Payment",
                                    "Pre-closure":"Pre-closure",
                                    "Prepayment":"Prepayment"
                                },
                                onChange: function(value, form, model){
                                    model.repayment.amount = deriveAmount(value, model.repayment);
                                }
                            },
                            "repayment.amount",
                            "repayment.repaymentDate",
                            "repayment.cashCollectionRemark",
                            "additional.override_fp",
                            {
                                "key": "repayment.authorizationRemark",
                                "condition": "model.additional.override_fp==true"
                            }
                        ]
                    },
                    {
                        "type":"actionbox",
                        "items": [
                            {
                                "type":"submit",
                                "style":"btn-theme",
                                "title":"SUBMIT"

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
                                    "type": "string",
                                    "title":"ACCOUNT_ID"
                                },
                                "amount": {
                                    "type": "string",
                                    "title":"AMOUNT"

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
                                    "title":"TRANSACTION_NAME"

                                },
                                "urnNo": {
                                    "type": "string",
                                    "title":"URN_NO"
                                }
                            },
                        },
                        "additional": {
                            "type": "object",
                            "properties": {
                                "override_fp": {
                                    "type": "boolean",
                                    "title":"OVERRIDE_FINGERPRINT",
                                    "default": false
                                }
                            }
                        }
                    },
                    "required": [
                        "accountId",
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
                    preSave: function (model, formCtrl) {
                        var deferred = $q.defer();
                        model._storedData = null;
                        deferred.resolve();
                        return deferred.promise;
                    },
                    submit: function (model, formCtrl, formName) {
                        $log.info("Inside submit");
                        if(window.confirm("Are you Sure?")){
                            PageHelper.showLoader();
                            var postData = _.cloneDeep(model.repayment);
                            postData.amount = parseInt(Number(postData.amount))+"";
                            LoanAccount.repay(postData,function(resp,header){
                                $log.info(resp);
                                try{
                                    alert(resp.response);
                                }catch(err){

                                }
                            },function(resp){
                                try{
                                    PageHelper.showErrors(resp);
                                }catch(err){
                                    console.error(err);
                                }
                            }).$promise.finally(function(){
                                PageHelper.hideLoader();
                            });

                        }
                    }
                }
            }
        }]);
