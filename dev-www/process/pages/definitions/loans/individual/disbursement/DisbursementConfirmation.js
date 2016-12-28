irf.pageCollection.factory(irf.page("loans.individual.disbursement.DisbursementConfirmation"),
    ["$log", "Enrollment", "SessionStore","$state", "$stateParams", "PageHelper", "IndividualLoan", "SchemaResource","Utils",
        function($log, Enrollment, SessionStore,$state,$stateParams, PageHelper, IndividualLoan, SchemaResource,Utils){

        var branch = SessionStore.getBranch();
        var backToQueue = function(){
            $state.go("Page.Engine",{
                pageName:"loans.individual.disbursement.DisbursementConfirmationQueue",
                pageId:null
            });
        };

        return {
            "type": "schema-form",
            "title": "DISBURSEMENT_CONFIRMATION",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                try {
                    var loanId = ($stateParams['pageId'].split('.'))[0];
                    var disbursementId = ($stateParams['pageId'].split('.'))[1];
                    PageHelper.showLoader();
                    PageHelper.showProgress('loan-fetch', 'Fetching Loan Details');


                    if (!model._disbursementConfirmation) {
                        $log.info("Page visited directly");
                        backToQueue();
                    }
                    IndividualLoan.get({id: loanId}, function (resp, head) {

                        var disbExistFlag = false;
                        for (var i=0;i<resp.disbursementSchedules.length;i++) {
                            var disbSchedule = resp.disbursementSchedules[i];
                            console.log(disbSchedule);
                            if (disbSchedule.id == disbursementId) {
                                model.loanAccountDisbursementSchedule = disbSchedule;
                                Utils.removeNulls(model,true);
                                disbExistFlag = true;
                                break;
                            }
                        }
                        if(!disbExistFlag){
                            PageHelper.showProgress('loan-fetch', 'Failed to load Disbursement', 5000);
                        }
                        else{
                            PageHelper.showProgress('loan-fetch', 'Done.', 5000);
                        }
                        console.log(model);

                    },
                    function (resp) {
                        PageHelper.showProgress('loan-fetch', 'Oops. An Error Occurred', 5000);
                        PageHelper.showErrors(resp);

                    }).$promise.finally(function () {
                        PageHelper.hideLoader();
                    });
                }
                catch(err){
                    console.error(err);
                    PageHelper.showProgress('loan-fetch', 'Oops. An Error Occurred', 5000);
                }

            },
            offline: false,
            getOfflineDisplayItem: function(item, index){

            },
            form: [{
                "type": "box",
                "title": "DISBURSEMENT_DETAILS",
                "colClass": "col-sm-8",
                "items": [

                    {
                        "key":"loanAccountDisbursementSchedule.udf1",
                        "type": "select",
                        "titleMap":[{
                                "name":"Confirmed",
                                "value":"Confirmed"
                                },
                                {
                                "name":"Rejected",
                                "value":"Rejected"
                                }
                        ]
                    },
                    {
                        "key":"loanAccountDisbursementSchedule.actualDisbursementDate",
                        "type":"date",
                        "title":"ACTUAL_DISBURSEMENT_DATE",
                        "readonly":true
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.modeOfDisbursement",
                        "title": "MODE_OF_DISBURSEMENT",
                        "readonly":true
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.referenceDate",
                        "title": "DATE",
                        "type":"date",
                        "condition":"model.loanAccountDisbursementSchedule.modeOfDisbursement!='CASH'"
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.referenceNumber",
                        "title": "REFERENCE_NO",
                        "condition":"model.loanAccountDisbursementSchedule.modeOfDisbursement!='CASH'&& model.loanAccountDisbursementSchedule.udf1=='Rejected'"
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.referenceNumber",
                        "title": "REFERENCE_NO",
                        "required":true,
                        "condition":"model.loanAccountDisbursementSchedule.modeOfDisbursement!='CASH'&& model.loanAccountDisbursementSchedule.udf1=='Confirmed'"
                    },
                    {
                        "key":"loanAccountDisbursementSchedule.udf5",
                        "title":"FINANCE_TEAM_REJECTION_REASON",
                        "type": "select",
                        "condition":"model.loanAccountDisbursementSchedule.udf1=='Rejected'"
                    },
                    {
                        "key":"loanAccountDisbursementSchedule.udf4",
                        "title":"FINANCE_TEAM_REJECTION_REMARKS",
                        "condition":"model.loanAccountDisbursementSchedule.udf1=='Rejected'"
                    },
                    {
                        "type": "actionbox",
                        "items": [{
                            "type": "submit",
                            "title": "Update"
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
                        if(reqData.loanAccountDisbursementSchedule.udf1 == "Rejected"){
                            reqData.disbursementConfirmations =[];
                            var targetStage;
                            if (model.loanAccountDisbursementSchedule.udf5 == 'Internal issue - Wrong bank selection')
                                targetStage = 'ReadyForDisbursement';
                            else
                                targetStage = 'RejectedDisbursement';
                            reqData.disbursementConfirmations.push({
                                                accountNumber: model._disbursementConfirmation.accountNumber,
                                                stage: targetStage,
                                                status: "REJECT",
                                                tranchNumber:model._disbursementConfirmation.trancheNumber,
                                                transactionId: model._disbursementConfirmation.transactionId,
                                                udf1:model.loanAccountDisbursementSchedule.udf1,
                                                udf4:model.loanAccountDisbursementSchedule.udf4,
                                                udf5:model.loanAccountDisbursementSchedule.udf5
                                            });
                            delete reqData._disbursementConfirmation;
                            delete reqData.loanAccountDisbursementSchedule;
                            IndividualLoan.batchDisbursementConfirmation(reqData,function(resp,header){
                                PageHelper.showProgress("upd-disb","Done.","5000");
                                backToQueue();
                            },function(resp){
                                PageHelper.showProgress("upd-disb","Oops. An error occurred","5000");
                                PageHelper.showErrors(resp);

                            }).$promise.finally(function(){
                                PageHelper.hideLoader();
                            });
                        }
                        else{
                            reqData.loanAccountDisbursementSchedule.udf4 = "";
                            reqData.loanAccountDisbursementSchedule.udf5 = "";
                            reqData.loanAccountDisbursementSchedule.udfDate1 = "";
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
                        }
                        
                    }
                }
            }
        };
    }]);
