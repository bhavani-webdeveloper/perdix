irf.pageCollection.factory(irf.page("loans.individual.disbursement.PendingFRO"),
["$log", "IndividualLoan", "SessionStore","$state", "$stateParams","SchemaResource","PageHelper","Queries", 
function($log, IndividualLoan, SessionStore,$state,$stateParams,SchemaResource,PageHelper,Queries){

    var branch = SessionStore.getBranch();
    var branchId = SessionStore.getBranchId();

    return {
        "type": "schema-form",
        "title": "FRO_APPROVAL",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("FRO Approval Page got initialized");

            if (!model._FROQueue)
            {
                $log.info("Screen directly launched hence redirecting to queue screen");
                $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.PendingFROQueue', pageId: null});
                return;
            }
            model.loanAccountDisbursementSchedule = {};
            model.loanAccountDisbursementSchedule = _.cloneDeep(model._FROQueue);

            Queries.getLoanAccount(model.loanAccountDisbursementSchedule.accountNumber, branchId).then(function(value){
                $log.info("Loan account record received");
                model.loanAccountRec = value;
                $log.info(model.loanAccountRec);
            },function(err){
                $log.info("Error while fetching Loan Account");
            });
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
                    "readonly":true
                },
                {
                    "key": "loanAccountDisbursementSchedule.tranchCondition",
                    "title": "TRACHE_CONDITION",
                    "type": "textarea",
                    "readonly":true
                },
                {
                    "key": "loanAccountDisbursementSchedule.fro_status",
                    "title": "STATUS",
                    required:true,
                    "type": "select",
                    "titleMap": {
                                "1": "Approve",
                                "2": "Reject"
                            }
                },
                {
                    "key": "loanAccountDisbursementSchedule.remarks1",
                    "title": "REMARKS"
                },
                {
                    "key": "loanAccountDisbursementSchedule.latitude",
                    "title": "LOCATION",
                    "type": "geotag",
                    "latitude": "loanAccountDisbursementSchedule.latitude",
                    "longitude": "loanAccountDisbursementSchedule.longitude"
                },
                {
                    key:"loanAccountDisbursementSchedule.photoId",
                    "title":"PHOTO",
                    "category":"customer",
                    "subCategory":"customer",
                    offline: false,
                    type:"file",
                    fileType:"image/*"
                },
                {
                    "type": "actionbox",
                    "items": [{
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
                    delete reqData._FROQueue;
                    reqData.disbursementProcessAction = "PROCEED";
                    if (model.loanAccountDisbursementSchedule.fro_status =="2"){
                        if (model.loanAccountRec.product_type == 'OD')
                            reqData.stage = "LOCDisbursement";
                        else
                            reqData.stage = "MTDisbursementDataCapture";
                    }
                    IndividualLoan.updateDisbursement(reqData,function(resp,header){
                        PageHelper.showProgress("upd-disb","Done.","5000");
                        PageHelper.hideLoader();
                        $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.PendingFROQueue', pageId: null});
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