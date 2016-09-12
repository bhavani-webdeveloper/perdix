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
                        "type":"select",
                        "titleMap":{
                            "Confirmed":"Confirmed",
                            "Rejected":"Rejected"
                        }
                    },
                    {
                        "key":"loanAccountDisbursementSchedule.actualDisbursementDate",
                        "type":"date",
                        "title":"ACTUAL_DISBURSEMENT_DATE"
                    },
                    {
                        "key":"loanAccountDisbursementSchedule.udf4",
                        "title":"FINANCE_TEAM_REJECTION_REMARKS"
                    },
                    {
                        "key":"loanAccountDisbursementSchedule.udf5",
                        "title":"FINANCE_TEAM_REJECTION_REASON",
                        "type": "select"
                    },
                    {
                        "key":"loanAccountDisbursementSchedule.udfDate1",
                        "type":"date",
                        "title":"REJECTION_DATE"
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
                            reqData.stage = "RejectedDisbursement";
                        }
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
        };
    }]);
