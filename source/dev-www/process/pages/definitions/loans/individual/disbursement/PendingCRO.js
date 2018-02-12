irf.pageCollection.factory(irf.page("loans.individual.disbursement.PendingCRO"),
["$log", "IndividualLoan", "SessionStore","$state", "$stateParams","SchemaResource","PageHelper", 
function($log, IndividualLoan, SessionStore,$state,$stateParams,SchemaResource,PageHelper){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "CRO_APPROVAL",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("CRO Approval Page got initialized");

            if (!model._CROQueue)
            {
                $log.info("Screen directly launched hence redirecting to queue screen");
                $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.PendingCROQueue', pageId: null});
                return;
            }
            model.loanAccountDisbursementSchedule = {};
            model.loanAccountDisbursementSchedule = _.cloneDeep(model._CROQueue);
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "titleExpr":"('TRANCHE'|translate)+' ' + model._CROQueue.trancheNumber + ' | '+('DISBURSEMENT_DETAILS'|translate)+' | '+ model.loanAccountDisbursementSchedule.customerName",
            "items": [
                {
                    "key": "loanAccountDisbursementSchedule.loanId",
                    "title": "LOAN_ID",
                    "type": "string",
                    "readonly":true
                },
                {
                    "key": "loanAccountDisbursementSchedule.customerName",
                    "title": "BUSINESS_NAME",
                    "type": "string",
                    "readonly":true
                },
                {
                    "key": "loanAccountDisbursementSchedule.branchName",
                    title: "BRANCH",
                    "type": "string",
                    "readonly":true
                },
                {
                    "key": "loanAccountDisbursementSchedule.centreName",
                    title: "CENTRE",
                    "type": "string",
                    "readonly":true
                },
                {
                    "key": "loanAccountDisbursementSchedule.trancheNumber",
                    "title": "TRANCHE_NUMBER"
                },
                {
                    "key": "loanAccountDisbursementSchedule.remarks1",
                    "title": "FRO_REMARKS",
                    "readonly":true
                },
                {
                    "key": "loanAccountDisbursementSchedule.udfDate2",
                    "title": "REQUESTED_DATE",
                    "type": "date",
                    "readonly":true
                },
                {
                    "key": "loanAccountDisbursementSchedule.tranchCondition",
                    "title": "TRACHE_CONDITION",
                    "type": "textarea",
                    "readonly":true
                },
                {
                    "key": "loanAccountDisbursementSchedule.cro_status",
                    required:true,
                    "title": "Status",
                    "type": "select",
                    "titleMap": {
                                "1": "Approve",
                                "2": "Reject"
                            }
                },
                {
                    "key": "loanAccountDisbursementSchedule.remarks2",
                    "title": "REMARKS"
                },
                {
                    "key": "loanAccountDisbursementSchedule.latitude",
                    "title": "Location",
                    "type": "geotag",
                    "latitude": "loanAccountDisbursementSchedule.latitude",
                    "longitude": "loanAccountDisbursementSchedule.longitude"
                },
                {
                    key:"loanAccountDisbursementSchedule.photoId",
                    "title":"Photo",
                    "category":"Loan",
                    "subCategory":"IndividualLoanDocuments",
                    type:"file",
                    fileType:"image/*"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Submit"
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
                    delete reqData._FROQueue;
                    reqData.disbursementProcessAction = "PROCEED";
                    if (model.loanAccountDisbursementSchedule.cro_status =="2"){
                        reqData.stage = "FROApproval";
                    }
                    IndividualLoan.updateDisbursement(reqData,function(resp,header){
                        PageHelper.showProgress("upd-disb","Done.","5000");
                        PageHelper.hideLoader();
                        $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.PendingCROQueue', pageId: null});
                    },function(resp){
                        PageHelper.showProgress("upd-disb","Oops. An error occurred","5000");
                        PageHelper.showErrors(resp);

                    }).$promise.finally(function(){
                        PageHelper.hideLoader();
                    });
                }
            }
        }
    };
}]);