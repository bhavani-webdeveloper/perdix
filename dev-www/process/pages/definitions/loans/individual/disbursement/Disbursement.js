irf.pageCollection.factory(irf.page("loans.individual.disbursement.Disbursement"),
    ["$log", "Enrollment", "SessionStore","$state", "$stateParams", "PageHelper", "IndividualLoan", "SchemaResource", "Utils",
        function($log, Enrollment, SessionStore,$state,$stateParams, PageHelper, IndividualLoan, SchemaResource, Utils){

        var branch = SessionStore.getBranch();
        var backToQueue = function(){
            $state.go("Page.Engine",{
                pageName:"loans.individual.disbursement.ReadyForDisbursementQueue"
            });
        };
        /*var banks = [];
        var getBankById = function(banks, id){
            for (var i=0;i<banks.length;i++){
                if (banks[i].obj.id == id){
                    return banks[i];
                }
            }
            return null;
        }*/

        return {
            "type": "schema-form",
            "title": "DISBURSE_LOAN",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                $log.info("Individual Loan Booking Page got initialized");
                $log.info("Demo Customer Page got initialized");
                /*model._more = {};

                var loanId = $stateParams['pageId'];

                PageHelper.showProgress('loan-load', 'Loading bank details...');
                PageHelper.showLoader();

                Bank.getBankAccounts()
                    .$promise
                    .then(
                        function(res){
                            if (res.length==0){
                                PageHelper.showProgress('loan-load', 'No bank details found', 2000);
                                PageHelper.hideLoader();
                                return;
                            }
                            for (var i=0; i<res.length; i++){
                                var bank = res[i];
                                banks.push({
                                    name: bank.bankName + " - " + bank.branchName,
                                    value: bank.id,
                                    obj: bank
                                })
                            }
                            model._more.banks = banks;
                            PageHelper.showProgress('loan-load', 'Loading loan details');
                            IndividualLoan.get({id: $stateParams.pageId})
                                .$promise
                                .then(
                                    function (res) {
                                        PageHelper.showProgress('loan-load', 'Loading done.', 2000);
                                        model.loanAccount = res;
                                    }, function(httpRes){
                                        PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                                        PageHelper.showErrors(httpRes);
                                    })
                                .finally(function(){
                                    PageHelper.hideLoader();
                                })
                        }, function(httpRes){

                        }
                    )*/
                model.additional = {"branchName":branch};
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
                                backToQueue();
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
                "title": "DISBURSEMENT_DETAILS", // sample label code
                "colClass": "col-sm-12", // col-sm-6 is default, optional
                //"readonly": false, // default-false, optional, this & everything under items becomes readonly
                "items": [
                    /*{
                        "title": "BANK_NAME",
                        "key": "_more.bankId",
                        "type": "select",
                        "titleMap": banks,
                        "onChange": function(a,b,c,d){
                            var bank = getBankById(c._more.banks, a);
                            if (bank!=null){
                                c.loanAccount.disbursementFromBankAccountNumber = bank.obj.accountNumber;
                                c._more.disbursementFromBankBranch = bank.obj.branchName + " - " + bank.obj.ifscCode;
                            } else {
                                c.loanAccount.disbursementFromBankAccountNumber = null;
                                c._more.disbursementFromBankBranch = null;
                            }

                            //b.loanAccount.disbursementFromBankAccountNumber
                        }
                    },*/
                    {
                        "key": "loanAccountDisbursementSchedule.disbursementFromBankAccountNumber",
                        "title":"DISBURSEMENT_FROM_BANK_ACC_NO"
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.customerAccountNumber",
                        "title": "CUSTOMER_ACC_NO"
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.ifscCode",
                        "title": "CUSTOMER_BANK_IFSC"
                    },
                    {
                        "key": "additional.branchName",
                        "title":"BRANCH_NAME",
                        readonly:true
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.udf1",
                        "type": "select",
                        //"enumCode": "status"
                        "titleMap": {
                         "Sent To Bank": "Sent To Bank",
                         "Reject": "Reject"
                         }
                    },
                    {

                        "key": "loanAccountDisbursementSchedule.udf2",
                        "title": "REJECTED_REASON",
                        "type": "text",
                        "enumCode": "reject_reason"
                    },
                    {

                        "key": "loanAccountDisbursementSchedule.udf3",
                        "title": "REJECT_REMARKS"
                    },
                    {
                        "type": "actionbox",
                        "items": [{
                            "type": "submit",
                            "title": "UPDATE"
                        }]
                    }
                ]
            }],
            schema: function() {
                //return SchemaResource.getLoanAccountSchema().$promise;
                return SchemaResource.getDisbursementSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName){
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
