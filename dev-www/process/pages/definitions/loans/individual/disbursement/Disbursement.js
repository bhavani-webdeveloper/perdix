irf.pageCollection.factory(irf.page("loans.individual.disbursement.Disbursement"),
    ["$log", "Enrollment", "SessionStore","$state", "$stateParams", "PageHelper", "IndividualLoan", "SchemaResource", "Bank",
        function($log, Enrollment, SessionStore,$state,$stateParams, PageHelper, IndividualLoan, SchemaResource, Bank){

        var branch = SessionStore.getBranch();

        var banks = [];
        var getBankById = function(banks, id){
            for (var i=0;i<banks.length;i++){
                if (banks[i].obj.id == id){
                    return banks[i];
                }
            }
            return null;
        }

        return {
            "type": "schema-form",
            "title": "DISBURSE_LOAN",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                $log.info("Individual Loan Booking Page got initialized");
                $log.info("Demo Customer Page got initialized");
                model._more = {};

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
                    )


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
                    {
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
                    },
                    {
                        "key": "loanAccount.disbursementFromBankAccountNumber"
                    },
                    {
                        "key": "_more.disbursementFromBankBranch",
                        "title": "DISBURSEMENT_FROM_BRANCH"
                    },
                    {
                        "key": "loanAccount.customerBranch"
                    },
                    {
                        "key": "loanAccount.applicationStatus",
                        "type": "select",
                        "enumCode": "status"
                        /*"titleMap": {
                         "1": "Sent To Bank",
                         "2": "Reject"
                         }*/
                    },
                    {

                        "key": "loanAccount.reject_reason",
                        "title": "REJECTED_REASON",
                        "type": "select",
                        "enumCode": "reject_reason"
                    },
                    {

                        "key": "loanAccount.reject_remarks",
                        "title": "REJECT_REMARKS"
                    },
                    {
                        "type": "actionbox",
                        "items": [{
                            "type": "submit",
                            "title": "Disburse"
                        },{
                            "type": "submit",
                            "title": "Reject"
                        }]
                    }
                ]
            }],
            schema: function() {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName){
                    $state.go("Page.Engine", {
                        pageName: 'IndividualLoanBookingConfirmation',
                        pageId: model.customer.id
                    });
                }
            }
        };
    }]);
