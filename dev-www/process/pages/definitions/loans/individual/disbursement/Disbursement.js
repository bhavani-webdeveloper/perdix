irf.pageCollection.factory(irf.page("loans.individual.disbursement.Disbursement"),
    ["$log", "Enrollment", "SessionStore","$state", "$stateParams", "PageHelper", "IndividualLoan", "SchemaResource", "Utils","LoanAccount","formHelper","Queries","LoanAccount",
        function($log, Enrollment, SessionStore,$state,$stateParams, PageHelper, IndividualLoan, SchemaResource, Utils,LoanAccount,formHelper,Queries,LoanAccount){

        var branch = SessionStore.getBranch();
        var backToQueue = function(){
            $state.go("Page.Engine",{
                pageName:"loans.individual.disbursement.ReadyForDisbursementQueue",
                pageId:null
            });
        };
        //model.loanAccountDisbursementSchedule.disbursementFromBankAccountNumber
        //populate from getBankAccounts

        /*var banks = [];
        var getBankById = function(banks, id){
            for (var i=0;i<banks.length;i++){
                if (banks[i].obj.id == id){
                    return banks[i];
                }
            }
            return null;
        }*/
        /*model._more = {};
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
                        }, function(httpRes){

                        }
                    )*/


        return {
            "type": "schema-form",
            "title": "DISBURSE_LOAN",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                $log.info("Disbursement Page got initialized");

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
                    $log.info("loanId ::" + loanId);
                    PageHelper.showLoader();
                    PageHelper.showProgress('loan-fetch', 'Fetching Loan Details');
                    IndividualLoan.getDisbursementList({"currentStage":loanId}, function (resp, head) {
                        model.additional.accountNumber = resp[0].accountId;
                        model.additional.customerId = resp[0].customerId;
                        model.additional.numberOfDisbursements = resp[0].numDisbursements;
                        model.additional.productCode = resp[0].productCode;
                        model.additional.urnNo = resp[0].urnNo;
                        model.loanAccountDisbursementSchedule = model.loanAccountDisbursementSchedule || {};
                        if (!model._disbursement) {
                            $log.info("Page visited directly");
                            $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.ReadyForDisbursementQueue', pageId: null});
                        } else {
                            model.loanAccountDisbursementSchedule=model._disbursement;
                            $log.info("Printing the loanAccountDisbursementSchedule");
                            $log.info(model.loanAccountDisbursementSchedule);
                            //model.loanAccountDisbursementSchedule.amountdue=model._bounce.amount1;
                        }
                        model.loanAccountDisbursementSchedule.modeOfDisbursement = "CASH";
                        model.loanAccountDisbursementSchedule.disbursementAmount = Number(resp[0].amount);
                        model.loanAccountDisbursementSchedule.udf2= model.loanAccountDisbursementSchedule.udf2 || '';
                        model.loanAccountDisbursementSchedule.udf3= model.loanAccountDisbursementSchedule.udf3 || '';

                    },
                    function (resp) {
                        PageHelper.showProgress('loan-fetch', 'Oops. An Error Occurred', 5000);
                        PageHelper.showErrors(resp);


                    }).$promise.finally(function () {
                        PageHelper.hideLoader();
                    });
                    /*IndividualLoan.get({id: loanId}, function (resp, head) {
                        model.additional.accountNumber = resp.accountNumber;
                        model.additional.customerId = resp.customerId;
                        model.additional.numberOfDisbursements = resp.numberOfDisbursements;
                        model.additional.productCode = resp.productCode;
                        model.additional.urnNo = resp.urnNo;

                        model.additional.disbursementDone = false;

                        var disbExistFlag = false;
                        for (var i=0;i<resp.disbursementSchedules.length;i++) {
                            var disbSchedule = resp.disbursementSchedules[i];
                            console.log(disbSchedule);
                            if (disbSchedule.id == disbursementId) {
                                model.loanAccountDisbursementSchedule = disbSchedule;
                                model.loanAccountDisbursementSchedule.accountNumber = resp.accountNumber;
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
                    });*/
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
                        "key": "additional.accountNumber",
                        "title":"ACCOUNT_NUMBER",
                        "readonly":true
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.disbursementAmount",
                        "title":"DISBURSEMENT_AMOUNT",
                        "type":"amount"
                    },
                    {
                        key: "loanAccountDisbursementSchedule.disbursementFromBankAccountNumber",
                        type: "lov",
                        autolov: true,
                        title:"DISBURSEMENT_FROM_ACCOUNT",
                        bindMap: {
                            
                        },
                        outputMap: {
                            "account_number": "loanAccountDisbursementSchedule.disbursementFromBankAccountNumber"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            return Queries.getBankAccounts();
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
                        "key": "loanAccountDisbursementSchedule.customerAccountNumber",
                        "title": "CUSTOMER_BANK_ACC_NO",
                        "readonly":true
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.ifscCode",
                        "title": "CUSTOMER_BANK_IFSC",
                        "readonly":true
                    },
                    {
                        "key": "additional.branchName",
                        "title":"BRANCH_NAME",
                        readonly:true
                    },
                    {

                        "key": "loanAccountDisbursementSchedule.udf2",
                        "title": "REJECTED_REASON",
                        "enumCode": "reject_reason"
                    },
                    {

                        "key": "loanAccountDisbursementSchedule.udf3",
                        "title": "REJECT_REMARKS"
                    },
                    {
                        "type":"actions",
                        "items":[
                            {
                                "type":"button",
                                "title":"DISBURSE",
                                "icon":"fa fa-money",
                                "onClick":"actions.disburseLoan(model,formCtrl,form)"
                            },
                            {
                                "type":"button",
                                "title":"REJECT",
                                "onClick":"actions.rejectLoan(model,formCtrl,form)"
                            }
                        ]
                    }
                    /*,
                    {
                        "type":"actionbox",
                        "condition":"model.additional.disbursementDone",
                        "items":[
                            {
                                "type": "submit",
                                "title": "UPDATE"

                            }

                        ]
                    }*/
                ]
            }],
            schema: function() {
                //return SchemaResource.getLoanAccountSchema().$promise;
                return SchemaResource.getDisbursementSchema().$promise;
            },
            actions: {
                disburseLoan:function(model, formCtrl, form){
                    formCtrl.scope.$broadcast("schemaFormValidate");
                    if(!formCtrl.$valid){
                        PageHelper.showProgress('disbursement', "Errors found in the form. Please fix to continue",3000);
                        return;
                    }

                    if(window.confirm("Perform Disbursement?")){

                        PageHelper.showLoader();
                        var accountNumber = model.additional.accountNumber;
                        var accountId = model.loanAccountDisbursementSchedule.loanId;
                        model.loanAccountDisbursementSchedule.udf1 = "Sent to Bank";
                        PageHelper.showProgress('disbursement', 'Disbursing ' + accountId + '. Please wait.');

                        LoanAccount.activateLoan({"accountId": accountNumber},
                            function(data){
                                $log.info("Inside success of activateLoan");
                                var currDate = moment(new Date()).format("YYYY-MM-DD");
                                model.loanAccountDisbursementSchedule.accountNumber = accountNumber;

                                var toSendData = [];
                                toSendData.push(model.loanAccountDisbursementSchedule);
                                
                                IndividualLoan.batchDisburse(toSendData,
                                    function(data){
                                        PageHelper.showProgress('disbursement', 'Disbursement done', 2000);
                                        model.additional.disbursementDone=true;

                                    },
                                    function(res){
                                        PageHelper.showErrors(res);
                                        PageHelper.showProgress('disbursement', 'Disbursement failed', 2000);
                                    }).$promise.finally(function() {
                                        PageHelper.hideLoader();
                                    }
                                );
                            },
                            function(res){
                                PageHelper.hideLoader();
                                PageHelper.showErrors(res);
                                PageHelper.showProgress('disbursement', 'Error while activating loan.', 2000);
                            });

                    }

                },
                rejectLoan:function(model, formCtrl, form){
                    formCtrl.scope.$broadcast("schemaFormValidate");
                    if(!formCtrl.$valid){
                        PageHelper.showProgress('disbursement', "Errors found in the form. Please fix to continue",3000);
                        return;
                    }

                    if(window.confirm("Are you sure to reject the loan disbursement?")){

                        PageHelper.showLoader();
                        var accountNumber = model.additional.accountNumber;
                        var accountId = model.loanAccountDisbursementSchedule.loanId;
                        model.loanAccountDisbursementSchedule.udf1 = "Rejected";
                        PageHelper.showProgress('disbursement', 'Disbursing ' + accountId + '. Please wait.');

                        var reqData = _.cloneDeep(model);
                        reqData.disbursementProcessAction = "PROCEED";
                        reqData.stage = "RejectedDisbursement";
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

                },
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
