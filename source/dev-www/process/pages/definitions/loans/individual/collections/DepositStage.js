irf.pageCollection.factory(irf.page("loans.individual.collections.DepositStage"),
["$log", "SessionStore","$state", "$stateParams", "irfElementsConfig","Queries","formHelper","CustomerBankBranch","LoanCollection","PageHelper", "$filter", "$q", "Utils",
function($log,SessionStore,$state,$stateParams,irfElementsConfig,Queries,formHelper,CustomerBankBranch,LoanCollection,PageHelper,$filter, $q, Utils){

    // var branch = SessionStore.getBranch();
    var branch = SessionStore.getCurrentBranch().branchName;
    var siteCode = SessionStore.getGlobalSetting('siteCode');

    var computeTotal = function(model){
        var totalAmount=0;
        for (var i = model.pendingCashDeposits.length - 1; i >= 0; i--) {
            if(model.pendingCashDeposits[i].check)
                totalAmount+=model.pendingCashDeposits[i].amount_collected;
        }
        model.bankDepositSummary.totalAmount = totalAmount;
    }

    return {
        "type": "schema-form",
        "title": "DEPOSIT_STAGE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");
            model.loggedInUser = SessionStore.getLoginname();
            model.siteCode = SessionStore.getGlobalSetting('siteCode');
            PageHelper.showLoader();
            model.bankDepositSummary = {};
            model.loanCollections = [];
            var depositListPromise = Queries.getDepositList(SessionStore.getLoginname())
            .then(function (res){
                $log.info(res);
                model.pendingCashDeposits = [];
                model.loanAccounts = [];
                for (var i=0; i< res.body.length;i++){
                    var cashDeposit = res.body[i];
                    model.loanCollections.push(cashDeposit);
                    model.pendingCashDeposits.push(
                        {
                            loan_ac_no: cashDeposit.account_number,
                            repaymentId: cashDeposit.id,
                            customer_name: cashDeposit.customer_name,
                            amount_collected: cashDeposit.repayment_amount
                        }
                    );
                    model.loanAccounts.push(cashDeposit.id);
                }
                model.additional={};
                model.additional.selectAll = true;
                for ( i = 0; i < model.pendingCashDeposits.length; i++)
                            model.pendingCashDeposits[i].check = true;
                computeTotal(model);
            });
            var accountDetailPromise = Queries.getBankAccountsByPartnerForLoanRepay(
                SessionStore.getGlobalSetting("mainPartner") || "Kinara").then(function(res){

                var records = res.body;

                if(records && _.isArray(records) && records.length > 0){
                    var defaultBank = $filter('filter')( records, {default_collection_account : true}, true);
                    if(defaultBank && _.isArray(defaultBank) && defaultBank.length > 0)
                        model.bankDepositSummary.bankAccountNumber = defaultBank[0].account_number;
                }

            });

            var promiseArray = [depositListPromise, accountDetailPromise];

            $q.all(promiseArray).then(
                function(){
                    PageHelper.hideLoader();
                },

                function(httpRes){
                PageHelper.showProgress('deposit-stage', 'Failed to load the deposit details. Try again.', 4000);
                PageHelper.showErrors(httpRes);
                PageHelper.hideLoader();
            });

        },
        offline: false,
        getOfflineDisplayItem: function(item, index){

        },
        form: [{
            "type": "box",
            "titleExpr": "'Cash to be deposited by '+ model.loggedInUser", // sample label code
            "colClass": "col-sm-12", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
            {
                "key": "additional.selectAll",
                "type": "checkbox",
                "title": "SELECT_ALL",
                "schema":{
                        "default": false
                    },
                "onChange": function(modelValue, form, model){

                    if (modelValue)
                    {
                        for ( i = 0; i < model.pendingCashDeposits.length; i++)
                        model.pendingCashDeposits[i].check = true;
                    }
                    else
                    {
                        for ( i = 0; i < model.pendingCashDeposits.length; i++)
                        model.pendingCashDeposits[i].check = false;
                    }
                    computeTotal(model);
                }
            },
            {
                "type":"array",
                "key":"pendingCashDeposits",
                "add":null,
                "remove":null,
                "view": "fixed",
                //"readonly":true,
                "notitle":true,
                "items":[{
                    "type":"section",
                    "htmlClass": "row",
                    "items": [{
                        "type": "section",
                        "htmlClass": "col-xs-1 col-md-1",
                        "items": [{
                            "key":"pendingCashDeposits[].check",
                            "title":" ",
                            "readonly":false,
                            "type": "checkbox",
                            "schema":{
                                "default": false
                            },
                            "onChange": function(modelValue, form, model){
                                model.additional.selectAll=false;
                                computeTotal(model);
                            }
                        }]
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-5 col-md-5",
                        "items": [{
                            "key":"pendingCashDeposits[].customer_name",
                            "readonly":true,
                            "titleExpr":"model.pendingCashDeposits[arrayIndex].loan_ac_no",
                            "title":" "
                        }]
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-4 col-md-4",
                        "items": [{
                            "key": "pendingCashDeposits[].amount_collected",
                            "readonly":true,
                            "type":"amount",
                            "title": " "
                        }]
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-2 col-md-2",
                        "items": [{
                            "key": "pendingCashDeposits[].button",
                            "type":"button",
                            "title": "Reject",
                            onClick:"actions.reject(model, form, formName)"
                        }]
                    }]
                }]
            },
            {
                "type":"section",
                "html":"<hr>"
            },
            {
                "key":"bankDepositSummary.totalAmount",
                "type":"amount",
                "title":"AMOUNT_DEPOSITED",
                "readonly": true
            },
            {
                "key":"bankDepositSummary.depositId",
                "type":"text",
                "title":"REFERENCE",
                "condition":"model.siteCode == 'witfin'"
            },
            {
                "key":"bankDepositSummary.reference",
                "type":"text",
                "title":"REFERENCE",
                "condition":"model.siteCode != 'witfin'"
            },
            {
                key: "bankDepositSummary.bankAccountNumber",
                type: "lov",
                lovonly: true,
                title:"DEPOSITED_TO_ACCOUNT",
                required: true,
                bindMap: {
                },
                outputMap: {
                    "account_number": "bankDepositSummary.bankAccountNumber"
                },
                searchHelper: formHelper,
                search: function(inputModel, form, model) {
                    return Queries.getBankAccountsByPartnerForLoanRepay();
                },
                getListDisplayItem: function(item, index) {
                    return [
                        item.account_number,
                        item.ifsc_code + ', ' + item.bank_name,
                        item.branch_name
                    ];
                }
            },
            {
                key: "bankDepositSummary.ifscCode",
                type: "lov",
                "title":"CASH_DEPOSIT_BRANCH_IFSC_CODE",
                lovonly: true,
                required:true,
                inputMap: {
                    "ifscCode": {
                        "key": "bankDepositSummary.ifscCode"
                    },
                    "bankName": {
                        "key": "bankDepositSummary.depositBank"
                    },
                    "branchName": {
                        "key": "bankDepositSummary.depositBranch"
                    }
                },
                onSelect:function(results,model,context) {
                    model.bankDepositSummary.ifscCode = results.ifscCode;
                    model.bankDepositSummary.bankBranchDetails = results.bankName + ' ' + results.branchName;
                },
                searchHelper: formHelper,
                search: function(inputModel, form) {
                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                    var promise = CustomerBankBranch.search({
                        'bankName': inputModel.bankName,
                        'ifscCode': inputModel.ifscCode,
                        'branchName': inputModel.branchName
                    }).$promise;
                    return promise;
                },
                getListDisplayItem: function(data, index) {
                    return [
                        data.ifscCode,
                        data.branchName,
                        data.bankName
                    ];
                },
            },
             {
                "key":"bankDepositSummary.bankBranchDetails",
                "title":"DEPOSITED_BANK_BRANCH",
                required:true
            },
            {
                title: "Bank Challan",
                key: "bankDepositSummary.challanFileId",
                type: "file",
                fileType: "application/pdf",
                category: "Loan",
                subCategory: "DOC1",
                using: "scanner",
                required:true
            },

            ]
        },{
            "type": "actionbox",
            "items": [{
                "type": "submit",
                "title": "SUBMIT"
            }]
        }],
        schema: {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "repayments": [{
                    "type": "string"
                }],
                "bankDepositSummary": {
                    "type": "object",
                    "properties": {
                        "bankAccountNumber": {
                            "type": "string"

                        },
                        "bankBranchDetails": {
                            "type": "string"
                        },
                        "ifscCode": {
                            "type": "string",
                            "title":"IFSC_CODE"
                        },
                        "depositBank": {
                            "type": "string",
                            "title":"DEPOSITED_BANK"
                        },
                        "depositBranch": {
                            "type": "string",
                            "title":"DEPOSITED_BRANCH"
                        },
                    }
                }
            },
            "required": [
                "repaymentId",
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
            submit: function(model, form, formName){
                if (!model.bankDepositSummary.totalAmount || model.bankDepositSummary.totalAmount <=0){
                    PageHelper.showProgress("deposit-cash","Amount deposited cannot be zero",5000);
                    return false;
                }
                var loanCollectionIds = [];
                for (var i = model.pendingCashDeposits.length - 1; i >= 0; i--) {
                    if(model.pendingCashDeposits[i].check){
                        loanCollectionIds.push(model.pendingCashDeposits[i].repaymentId);
                    }
                }

                model.bankDepositSummary.loanCollections = _.cloneDeep(model.loanCollections);
                var reqData = {
                    'bankDepositSummary': _.cloneDeep(model.bankDepositSummary),
                    'loanCollectionIds':_.cloneDeep(loanCollectionIds)
                };

                PageHelper.showProgress('deposit-cash', 'Working...');
                PageHelper.showLoader();
                $log.info(reqData);
                LoanCollection.processCashDeposite(reqData, function(response){
                    PageHelper.hideLoader();
                    $state.go('Page.Engine', {pageName: 'loans.individual.collections.BounceQueue', pageId: null});

                }, function(errorResponse){
                    PageHelper.hideLoader();
                    PageHelper.showProgress('deposit-cash', 'Request is failed', 500);
                    PageHelper.showErrors(errorResponse);
                });
            },
            reject: function(model, form, formName) {
                $log.info(model.pendingCashDeposits[form.arrayIndex]);
                $log.info("Inside reject()");
                Utils.confirm("Are You Sure?")
                    .then(function() {
                        PageHelper.showLoader();
                        LoanCollection.get({
                            id: model.pendingCashDeposits[form.arrayIndex].repaymentId
                        }).$promise.then(
                            function(resp) {

                                var loanCollection = _.cloneDeep(resp);
                                var reqParams = {};
                                reqParams.loanCollection = loanCollection;
                                reqParams.stage = "Rejected";
                                reqParams.repaymentProcessAction = "PROCEED";
                                LoanCollection.update(reqParams, function(resp, header) {
                                    PageHelper.showProgress('loan collection with id' +resp.id + 'is rejected', 'Working...');
                                    PageHelper.hideLoader();
                                    $state.reload();

                                }, function(resp) {
                                    PageHelper.showErrors(resp);
                                }).$promise.finally(function() {
                                    PageHelper.hideLoader();
                                });
                            })
                    })
            }
        }
    };
}]);
