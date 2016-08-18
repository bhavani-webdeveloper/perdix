irf.pageCollection.factory("Pages__LoanBookingScreen",
["$log", "Enrollment", "SessionStore", "$state", "SchemaResource", function($log, Enrollment, SessionStore, $state, SchemaResource){

    var branch = SessionStore.getBranch();

    return {
        "id": "LoanBookingScreen",
        "type": "schema-form",
        "name": "LoanBookingScreen",
        "title": "Loan Booking Screen",
        initialize: function (model, form, formCtrl) {
            $log.info("Loan Booking Screen got initialized");
            model.acct_no="50067932853";
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "LOAN BOOKING - Account #50067932853", // sample label code
            "colClass": "col-sm-6", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                {
                    "key": "loanAccount.customerSignatureDate",
                                    "title": "Cust Sign Date",
                    "type": "date",
                    "required": true
                },
                {
                    "key": "loanAccount.scheduledDisbursementDate",
                    "title": "DISBURSEMENT_DATE",
                    "type": "date",
                    "required": true
                }/*,
                {
                    "key": "sanction_date",
                    "title": "Sanction Date",
                    "type": "date"
                }*/,
                {
                    "key": "loanAccount.accountNumber",
                    "title": "ACCOUNT_NUMBER"
                },
                {
                    "type": "submit",
                    "title": "SUBMIT"
                }
            ]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                $log.info("Redirecting");
                $state.go('Page.Engine', {pageName: 'PendingDocumentUpload', pageId: 'PendingDocumentUpload'});
            }
        }
    };
}]);