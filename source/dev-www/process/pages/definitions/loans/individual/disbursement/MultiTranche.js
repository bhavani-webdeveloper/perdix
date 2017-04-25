irf.pageCollection.factory(irf.page("loans.individual.disbursement.MultiTranche"),
["$log", "IndividualLoan", "SessionStore","$state", "$stateParams","SchemaResource","PageHelper","Utils", 
function($log, IndividualLoan, SessionStore,$state,$stateParams,SchemaResource,PageHelper,Utils){

    var branch = SessionStore.getBranch();

    var populateDisbursementDate = function(modelValue,form,model){
        if (modelValue){
            modelValue = new Date(modelValue);
            model.loanAccountDisbursementSchedule.scheduledDisbursementDate = moment(new Date(modelValue.setDate(modelValue.getDate()+1))).format("YYYY-MM-DD");
        }
    };

    return {
        "type": "schema-form",
        "title": "SUBSEQUENT_TRANCHE_DISBURSEMENT",
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
                    "key": "loanAccountDisbursementSchedule.tranchCondition",
                    "title": "TRACHE_CONDITION",
                    "type": "textarea",
                    "readonly":true
                },
                {
                    "key": "loanAccountDisbursementSchedule.remarks1",
                    "title": "FRO_REMARKS",
                    "readonly":true,
                    "condition": "model.loanAccountDisbursementSchedule.remarks1!=''"
                },
                {
                    "key": "loanAccountDisbursementSchedule.remarks2",
                    "title": "CRO_REMARKS",
                    "readonly":true,
                    "condition": "model.loanAccountDisbursementSchedule.remarks2!=''"
                },
                {
                    "key": "loanAccountDisbursementSchedule.customerSignatureDate",
                    "title": "CUSTOMER_SIGNATURE_DATE",
                    "type": "date",
                    "onChange":function(modelValue,form,model){
                        populateDisbursementDate(modelValue,form,model);
                    }
                },
                {
                    "key": "loanAccountDisbursementSchedule.scheduledDisbursementDate",
                    "title": "DISBURSEMENT_DATE",
                    "type": "date"
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
                        var customerSignatureDate = moment(model.loanAccountDisbursementSchedule.customerSignatureDate,SessionStore.getSystemDateFormat());
                        var scheduledDisbursementDate = moment(model.loanAccountDisbursementSchedule.scheduledDisbursementDate,SessionStore.getSystemDateFormat());
                        if (scheduledDisbursementDate.diff(customerSignatureDate, "days") <= 0) {
                           PageHelper.showProgress("upd-disb", "Scheduled disbursement date should be greater than Customer sign date", 5000);
                           return false;
                        }
                        PageHelper.showLoader();

                        model.loanAccountDisbursementSchedule.udfDate2 = Utils.getCurrentDateTime();
                        var reqData = _.cloneDeep(model);
                        delete reqData.$promise;
                        delete reqData.$resolved;
                        reqData.disbursementProcessAction = "PROCEED";
                        reqData.stage = "FROApproval";
                        IndividualLoan.updateDisbursement(reqData,function(resp,header){
                            PageHelper.showProgress("upd-disb","Done.","5000");
                            PageHelper.hideLoader();
                            $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.MultiTrancheQueue', pageId: null});
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
