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
                    //@TODO : Where to redirect if no page params present
                }
            }

            function getTransactionNames(totalDemandDue){

                if (totalDemandDue>0){
                    return {
                        "Scheduled Demand":"Scheduled Demand",
                        "Fee Payment":"Fee Payment",
                        "Pre-closure":"Pre-closure",
                        "Prepayment":"Prepayment"
                    }
                }

                return {
                    "Advance Repayment":"Advance Repayment",
                    "Scheduled Demand":"Scheduled Demand",
                    "Fee Payment":"Fee Payment",
                    "Pre-closure":"Pre-closure",
                    "Prepayment":"Prepayment"
                }
            }

            var _pageGlobals = {
                transactionNames: {}
            };

            return {
                "id": "LoanRepay",
                "type": "schema-form",
                "name": "LoanRepay",
                "title": "LOAN_REPAYMENT",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {

                    var config = {
                        fingerprintEnabled: false
                    };

                    model.$pageConfig = config;

                    PageHelper.showLoader();
                    irfProgressMessage.pop('loading-loan-details', 'Loading Loan Details');
                    //PageHelper
                    var loanAccountNo = ($stateParams.pageId.split("."))[0];
                    var promise = LoanAccount.get({accountId: loanAccountNo}).$promise;
                    promise.then(function (data) { /* SUCCESS */
                        model.loanAccount = data;
                        console.log(data);
                        model.repayment = {};
                        model.repayment.productCode=data.productCode;
                        model.repayment.urnNo=data.customerId1;
                        model.repayment.instrument='CASH';
                        model.repayment.authorizationUsing='';
                        model.repayment.remarks='';
                        model.repayment.accountId = data.accountId;
                        model.repayment.amount = 0;
                        model.repayment.demandAmount = data.totalDemandDue;
                        model.repayment.productCode = data.productCode;
                        model.repayment.urnNo = data.customerId1;
                        //_pageGlobals.totalDemandDue = data.totalDemandDue;
                        _pageGlobals.transactionNames = getTransactionNames(data.totalDemandDue);

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
                                title: "LOAN_ACCOUNT_NUMBER",
                                readonly:true
                            },
                            {
                                key: "repayment.demandAmount",
                                readonly: true,
                                title: "TOTAL_DEMAND_DUE",
                                type: "amount"
                            },
                            {
                                key: "repayment.amount",
                                type: "amount"
                            },
                            "repayment.repaymentDate",
                            "repayment.cashCollectionRemark",
                            {
                                key:"repayment.transactionName",
                                "type":"select",
                                "required": true,
                                titleMap: {
                                    "Advance Repayment":"Advance Repayment",
                                    "Scheduled Demand":"Scheduled Demand",
                                    "Fee Payment":"Fee Payment",
                                    "Pre-closure":"Pre-closure",
                                    "Prepayment":"Prepayment"
                                }
                            },
                            {
                                "type": "fieldset",
                                "title": "Fingerprint",
                                "condition": "model.$pageConfig.fingerprintEnabled==true",
                                "items": [
                                    {
                                        "key": "additional.override_fp",
                                        "condition": "model.$pageConfig.fingerprintEnabled==true"
                                    },
                                    {
                                        "key": "repayment.authorizationRemark",
                                        "condition": "model.additional.override_fp==true"
                                    }
                                ]
                            },
                            {
                                "key": "repayment.instrument",
                                "type": "select",
                                "required": true,
                                "titleMap": [
                                    {
                                        name: "Cash",
                                        value: "CASH"
                                    },
                                    {
                                        "name":"Cheque",
                                        "value":"CHQ"
                                    },
                                    {
                                        "name":"NEFT",
                                        "value":"NEFT"
                                    },
                                    {
                                        "name":"RTGS",
                                        "value":"RTGS"
                                    }

                                ]
                            },
                            {
                                key:"repayment.checqueNumber",
                                title:"CHEQUE_NUMBER",
                                type:"Number",
                                required:true,
                                condition:"model.repayment.instrument=='CHQ'"
                            },
                            {
                                key:"repayment.chequeDate",
                                title:"CHEQUE_DATE",
                                type:"date",
                                required:true,
                                condition:"model.repayment.instrument=='CHQ'"
                            },
                            {
                                key:"repayment.ifscCode",
                                title:"IFSC",
                                type:"text",
                                condition:"model.repayment.instrument=='CHQ'"
                            },
                            {
                                key:"repayment.chequeBank",
                                title:"ISSUING_BANK",
                                type:"text",
                                condition:"model.repayment.instrument=='CHQ'"
                            },
                            {
                                key:"repayment.chequeBranch",
                                title:"ISSUING_BRANCH",
                                type:"text",
                                condition:"model.repayment.instrument=='CHQ'"
                            },
                            {
                                key: "repayment.chequePhoto",
                                title: "CHEQUE_PHOTO",
                                condition:"model.repayment.instrument=='CHQ'",
                                type: "file",
                                fileType: "image/*",
                                category: "noidea",
                                subCategory: "absolutlynoidea"
                            },
                            {
                                key:"repayment.NEFTReferenceNumber",
                                title:"REFERENCE_NUMBER",
                                type:"number",
                                required: true,
                                condition:"model.repayment.instrument=='NEFT'"
                            },
                            {
                                key:"repayment.NEFTDate",
                                title:"DATE",
                                type:"date",
                                condition:"model.repayment.instrument=='NEFT'"
                            },
                            {
                                key:"repayment.ifscCode",
                                title:"IFSC",
                                type:"text",
                                condition:"model.repayment.instrument=='NEFT'"
                            },
                            {
                                key:"repayment.NEFTBankDetails",
                                title:"BANK_DETAILS",
                                type:"text",
                                condition:"model.repayment.instrument=='NEFT'"
                            },
                            {
                                key:"repayment.NEFTBranchDetails",
                                title:"BRANCH_DETAILS",
                                type:"text",
                                condition:"model.repayment.instrument=='NEFT'"
                            },
                            {
                                key:"repayment.RTGSReferenceNumber",
                                title:"REFERENCE_NUMBER",
                                type:"text",
                                condition:"model.repayment.instrument=='RTGS'"
                            },
                            {
                                key:"repayment.RTGSDate",
                                title:"DATE",
                                type:"text",
                                condition:"model.repayment.instrument=='RTGS'"
                            },
                            {
                                key:"repayment.RTGSBankDetails",
                                title:"BANK_DETAILS",
                                type:"text",
                                condition:"model.repayment.instrument=='RTGS'"
                            },
                            {
                                key:"repayment.RTGSBranchDetails",
                                title:"BRANCH_DETAILS",
                                type:"text",
                                condition:"model.repayment.instrument=='RTGS'"
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
                        if (model.repayment.demandAmount > 0 && model.repayment.transactionName == "Advance Repayment"){
                            PageHelper.showProgress("loan-repay","Advance Repayment is not allowed for an outstanding Loan",5000);
                            return false;
                        }
                        $log.info("Inside submit");
                        if(window.confirm("Are you Sure?")){
                            PageHelper.showLoader();
                            var postData = _.cloneDeep(model.repayment);
                            postData.amount = parseInt(Number(postData.amount))+"";
                            //postData.instrument = "CASH";
                            LoanAccount.repay(postData,function(resp,header){
                                $log.info(resp);
                                try{
                                    alert(resp.response);
                                    PageHelper.navigateGoBack();
                                }catch(err){

                                }
                            },function(resp){
                                PageHelper.showErrors(resp);
                            }).$promise.finally(function(){
                                PageHelper.hideLoader();
                            });

                        }
                    }
                }
            }
        }]);
