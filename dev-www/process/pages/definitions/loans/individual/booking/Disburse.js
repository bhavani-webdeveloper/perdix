irf.pageCollection.factory(irf.page("loans.individual.booking.Disburse"),
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "DISBURSE_LOAN",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");
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
                    "key": "bank_name",
                    "title": "BANK_NAME",
                    "key": "loanAccount.bank_name",
                    "type": "select",
                    "titleMap": {
                                "1": "ICICI Bank",
                                "2": "Kotak Mahindra Bank"
                            }
                },
                {
                    "key": "loanAccount.branch_name",
                    "title": "BRANCH_NAME"
                },
                {

                    "key": "loanAccount.account_number",
                    "title": "ACCOUNT_NUMBER"
                },
                {

                    "title": "STATUS",
                    "key": "loanAccount.status",
                    "type": "select",
                    "titleMap": {
                                "1": "Sent To Bank",
                                "2": "Reject"
                            }
                },
                {

                    "key": "loanAccount.reject_reason",
                    "title": "REJECTED_REASON",
                    "type": "select"
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
            return Enrollment.getSchema().$promise;
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