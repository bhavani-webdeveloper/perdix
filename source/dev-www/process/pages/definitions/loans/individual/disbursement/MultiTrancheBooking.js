define({
    pageUID: "loans.individual.disbursement.MultiTrancheBooking",
    pageType: "Engine",
    dependencies: ["$log", "IndividualLoan", "SessionStore","$state", "$stateParams","SchemaResource","PageHelper","Utils"],
    $pageFn: function($log, IndividualLoan, SessionStore,$state,$stateParams,SchemaResource,PageHelper,Utils){

        var branch = SessionStore.getBranch();

        var populateDisbursementDate = function(modelValue,form,model){
            if (modelValue){
                modelValue = new Date(modelValue);
                model.loanAccountDisbursementSchedule.scheduledDisbursementDate = moment(new Date(modelValue.setDate(modelValue.getDate()+1))).format("YYYY-MM-DD");
            }
        };
        var populateDisbursementDate1 = function(modelValue,form,model){
            if (modelValue){
                modelValue = new Date(modelValue);
                model.loanAccountDisbursementSchedule.scheduledDisbursementDate = moment(new Date(modelValue.setDate(modelValue.getDate()))).format("YYYY-MM-DD");
            }
        };

        var populateDisbursementScheduledDate = function(modelValue,form,model) {
            var now= moment().format('HH:MM');
            var today=model.loanAccountDisbursementSchedule.customerSignatureDate ;
            var tomorrow= moment(model.loanAccountDisbursementSchedule.customerSignatureDate).add("days", 1).format(SessionStore.getSystemDateFormat());
           // model._currentDisbursement.customerSignatureDate = today;
            if(now < model.disbursementCutOffTime){
               model.loanAccountDisbursementSchedule.scheduledDisbursementDate = today;
               model.CutOffdate=moment(today);
               model.CutOffTime=false;
               model.scheduledDisbursementAllowedDate= moment(today).add("days", model.disbursementRestrictionDays);
            }else{
               model.loanAccountDisbursementSchedule.scheduledDisbursementDate = tomorrow;
               model.CutOffdate=moment(tomorrow);
               model.CutOffTime=true;
               model.scheduledDisbursementAllowedDate= moment(tomorrow).add("days", model.disbursementRestrictionDays);
            }
        };

        return {
            "type": "schema-form",
            "title": "MULTI_TRANCHE_BOOKING",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                $log.info("Multi Tranche Page got initialized");
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                if (!$stateParams.pageData)
                {
                    $log.info("Screen directly launched hence redirecting to queue screen");
                    $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.MultiTrancheBookingQueue', pageId: null});
                    return;
                }
                model.loanAccountDisbursementSchedule = {};
                model.loanAccountDisbursementSchedule = _.cloneDeep($stateParams.pageData);
                model.disbursementCutOffTime=SessionStore.getGlobalSetting("disbursementCutOffTime");
                model.disbursementRestrictionDays= Number(SessionStore.getGlobalSetting("disbursementRestrictionDays") || 0);
            },
            offline: false,
            getOfflineDisplayItem: function(item, index){
                
            },
            form: [{
                "type": "box",
                "titleExpr":"('TRANCHE'|translate)+' ' + model.loanAccountDisbursementSchedule.trancheNumber + ' | '+('DISBURSEMENT_DETAILS'|translate)+' | '+ model.loanAccountDisbursementSchedule.accountNumber",
                "items": [
                    {
                        "key": "loanAccountDisbursementSchedule.trancheNumber",
                        "title": "TRANCHE_NUMBER",
                        "readonly":true
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
                        "condition":"!model.disbursementCutOffTime",
                        "onChange":function(modelValue,form,model){
                            populateDisbursementDate(modelValue,form,model);
                        }
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.customerSignatureDate",
                        "title": "CUSTOMER_SIGNATURE_DATE",
                        "type": "date",
                        "condition":"model.disbursementCutOffTime",
                        "onChange":function(modelValue,form,model){
                            populateDisbursementDate1(modelValue,form,model);
                            populateDisbursementScheduledDate(modelValue,form,model)
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
                            if (scheduledDisbursementDate.diff(customerSignatureDate, "days") < 0) {
                               PageHelper.showProgress("upd-disb", "Scheduled disbursement date should be greater than Customer sign date", 5000);
                               return false;
                            }
                            PageHelper.showLoader();

                            model.loanAccountDisbursementSchedule.udfDate2 = Utils.getCurrentDateTime();
                            var reqData = _.cloneDeep(model);
                            delete reqData.$promise;
                            delete reqData.$resolved;
                            reqData.disbursementProcessAction = "PROCEED";
                            reqData.stage = "DocumentUpload";
                            IndividualLoan.updateDisbursement(reqData,function(resp,header){
                                PageHelper.showProgress("upd-disb","Done.","5000");
                                PageHelper.hideLoader();
                                $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.MultiTrancheBookingQueue', pageId: null});
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
    }
});
