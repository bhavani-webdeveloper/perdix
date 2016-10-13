irf.pageCollection.factory(irf.page("loans.individual.disbursement.UpdateAccountDetails"),
["$log", "IndividualLoan", "SessionStore","$state", "$stateParams","SchemaResource","PageHelper","formHelper","CustomerBankBranch", 
function($log, IndividualLoan, SessionStore,$state,$stateParams,SchemaResource,PageHelper,formHelper,CustomerBankBranch){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "UPDATE_ACCOUNT",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Update Account Details Page got initialized");

            if (!model._rejectedDisbursementQueue)
            {
                $log.info("Screen directly launched hence redirecting to queue screen");
                $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.RejectedDisbursementQueue', pageId: null});
                return;
            }
            model.loanAccountDisbursementSchedule = {};
            model.loanAccountDisbursementSchedule = _.cloneDeep(model._rejectedDisbursementQueue);
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "titleExpr":"('TRANCHE'|translate)+' ' + model._MTQueue.trancheNumber + ' | '+('DISBURSEMENT_DETAILS'|translate)+' | '+ model.customerName",
            "items": [
                {
                    "key": "loanAccountDisbursementSchedule.trancheNumber",
                    "title": "TRANCHE_NUMBER"
                },
                {
                    "key": "loanAccountDisbursementSchedule.udfDate2",
                    "title": "REQUESTED_DATE",
                    "type": "date",
                    "readonly":true,
                    "condition":"model.loanAccountDisbursementSchedule.udfDate2!=null"
                },
                {
                    "key": "loanAccountDisbursementSchedule.customerNameInBank",
                    "title": "CUSTOMER_NAME_IN_BANK"
                },
                {
                    "key": "loanAccountDisbursementSchedule.customerAccountNumber",
                    "title": "CUSTOMER_BANK_ACC_NO"
                },
                {
                    key: "loanAccountDisbursementSchedule.ifscCode",
                    type: "lov",
                    lovonly: true,
                    inputMap: {
                        "ifscCode": {
                            "key": "loanAccountDisbursementSchedule.ifscCode"
                        },
                        "bankName": {
                            "key": "loanAccountDisbursementSchedule.customerBankName"
                        },
                        "branchName": {
                            "key": "loanAccountDisbursementSchedule.customerBankBranchName"
                        }
                    },
                    outputMap: {
                        "bankName": "loanAccountDisbursementSchedule.customerBankName",
                        "branchName": "loanAccountDisbursementSchedule.customerBankBranchName",
                        "ifscCode": "loanAccountDisbursementSchedule.ifscCode"
                    },
                    searchHelper: formHelper,
                    search: function(inputModel, form) {
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
                    }
                },
                {
                    "key": "loanAccountDisbursementSchedule.customerBankName",
                    "title": "BANK_NAME",
                    "readonly":true
                },
                {
                    "key": "loanAccountDisbursementSchedule.customerBankBranchName",
                    "title": "BRANCH_NAME",
                    "readonly":true
                },
                {
                    "key": "loanAccountDisbursementSchedule.udf5",
                    "title": "REJECTED_REASON",
                    "readonly":true
                },
                {
                    "key": "loanAccountDisbursementSchedule.udf4",
                    "title": "REJECT_REMARKS",
                    "readonly":true
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "button",
                        "title": "BACK",
                        "onClick": "actions.goBack(model, formCtrl, form, $event)"
                    },
                    {
                        "type": "submit",
                        "title": "SUBMIT"
                    }]
                }
            ]
        }],
        schema: function() {
            return SchemaResource.getDisbursementSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                if(window.confirm("Are you sure?")){
                    PageHelper.showLoader();
                    var reqData = _.cloneDeep(model);
                    delete reqData.$promise;
                    delete reqData.$resolved;
                    delete reqData._rejectedDisbursementQueue;
                    reqData.disbursementProcessAction = "PROCEED";
                    reqData.stage = "ReadyForDisbursement";
                    IndividualLoan.updateDisbursement(reqData,function(resp,header){
                        PageHelper.showProgress("upd-disb","Done.","5000");
                        PageHelper.hideLoader();
                        $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.RejectedDisbursementQueue', pageId: null});
                    },function(resp){
                        PageHelper.showProgress("upd-disb","Oops. An error occurred","5000");
                        PageHelper.showErrors(resp);

                    }).$promise.finally(function(){
                        PageHelper.hideLoader();
                    });
                }
            },
            goBack: function (model, formCtrl, form, $event) {
                $state.go("Page.Engine", {
                    pageName: 'loans.individual.disbursement.RejectedDisbursementQueue',
                    pageId: null
                });
            }
        }
    };
}]);