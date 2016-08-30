irf.pageCollection.factory(irf.page("loans.individual.disbursement.Disbursement"),
    ["$log", "Enrollment", "SessionStore","$state", "$stateParams", "PageHelper", "IndividualLoan", "SchemaResource",
        function($log, Enrollment, SessionStore,$state,$stateParams, PageHelper, IndividualLoan, SchemaResource){

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "DISBURSE_LOAN",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                $log.info("Individual Loan Booking Page got initialized");
                $log.info("Demo Customer Page got initialized");

                var loanId = $stateParams['pageId'];
                PageHelper.showProgress('loan-load', 'Loading loan details...');
                PageHelper.showLoader();
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
                        "key": "loanAccount.bank_name",
                        "type": "select",
                        "enumCode": "bank"
                        /*"titleMap": {
                         "1": "ICICI Bank",
                         "2": "Kotak Mahindra Bank"
                         }*/
                    },
                    {
                        "key": "loanAccount.accountNumber"
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
