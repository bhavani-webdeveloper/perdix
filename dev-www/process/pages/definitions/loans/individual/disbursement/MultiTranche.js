irf.pageCollection.factory(irf.page("loans.individual.disbursement.MultiTranche"),
["$log", "IndividualLoan", "SessionStore","$state", "$stateParams","SchemaResource","PageHelper", 
function($log, IndividualLoan, SessionStore,$state,$stateParams,SchemaResource,PageHelper){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "SUBSEQUENT TRANCHE DISBURSEMENT",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Multi Tranche Page got initialized");
            if (!model._MTQueue)
            {
                $log.info("Screen directly launched hence redirecting to queue screen");
                $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.MultiTrancheQueue', pageId: null});
                return;
            }
            model.loanAccountDisbursementSchedule = {};
            model.loanAccountDisbursementSchedule = _.cloneDeep(model._MTQueue);
            model.loanAccountDisbursementSchedule.actualDisbursementDate = "";
            model.loanAccountDisbursementSchedule.customerSignatureDate = "";
            model.loanAccountDisbursementSchedule.scheduledDisbursementDate = "";
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "titleExpr":"('TRANCHE'|translate)+' ' + model._MTQueue.trancheNumber + ' | '+('DISBURSEMENT_DETAILS'|translate)+' | '+ model._MTQueue.accountNumber",
            "items": [
                {
                    "key": "loanAccountDisbursementSchedule.trancheNumber",
                    "title": "TRANCHE_NUMBER"
                },
                {
                    "key": "loanAccountDisbursementSchedule.scheduledDisbursementDate",
                    "title": "DISBURSEMENT_DATE",
                    "type": "date"
                },
                {
                    "key": "loanAccountDisbursementSchedule.customerSignatureDate",
                    "title": "CUSTOMER_SIGNATURE_DATE",
                    "type": "date"
                },
                {
                    "key": "loanAccountDisbursementSchedule.remarks",
                    "title": "REMARKS"
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
                    $state.go("Page.Engine", {
                        pageName: 'loans.individual.disbursement.MultiTrancheQueue',
                        pageId: null
                    });
                    if(window.confirm("Are you sure?")){
                        PageHelper.showLoader();
                        var reqData = _.cloneDeep(model);
                        reqData.disbursementProcessAction = "SAVE";
                        IndividualLoan.updateDisbursement(reqData,function(resp,header){
                            reqData = _.cloneDeep(resp);
                            delete reqData.$promise;
                            delete reqData.$resolved;
                            reqData.disbursementProcessAction = "PROCEED";
                            IndividualLoan.updateDisbursement(reqData,function(resp,header){
                                PageHelper.showProgress("upd-disb","Done.","5000");
                                backToQueue();
                            },function(resp){
                                PageHelper.showProgress("upd-disb","Oops. An error occurred","5000");
                                PageHelper.showErrors(resp);

                            }).$promise.finally(function(){
                                PageHelper.hideLoader();
                            });

                        },function(resp){
                            PageHelper.showErrors(resp);
                            PageHelper.showProgress("upd-disb","Oops. An error occurred","5000");
                            PageHelper.hideLoader();
                        });
                    }
            }
        }
    };
}]);