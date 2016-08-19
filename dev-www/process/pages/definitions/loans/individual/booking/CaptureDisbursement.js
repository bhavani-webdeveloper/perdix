irf.pageCollection.factory(irf.page("loans.individual.booking.CaptureDisbursement"),
["$log", "Enrollment", "SessionStore", "$state", "SchemaResource", function($log, Enrollment, SessionStore, $state, SchemaResource){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "LOAN_BOOKING_SCREEN",
        initialize: function (model, form, formCtrl) {
            $log.info("Loan Booking Screen got initialized");
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "LOAN_ACCOUNT", // sample label code
            "colClass": "col-sm-12", // col-sm-6 is default, optional
            
            "items": [
                {
                    "key": "loanAccount.accountNumber",
                    "title": "ACCOUNT_NUMBER",
                    "readonly": true,
                    "type": "number"
                },
                {
                    "key": "loanAccount.customerSignatureDate",
                    "title": "CUSTOMER_SIGN_DATE",
                    "type": "date",
                    "required": true,
                    "onChange": function(modelValue, form, model, formCtrl, event) {
                        model.loanAccount.scheduledDisbursementDate = moment(modelValue).add(2,"days");
                    }
                },
                {
                    "key": "loanAccount.scheduledDisbursementDate",
                    "title": "DISBURSEMENT_DATE",
                    "type": "date"
                },
                {
                    "type": "submit",
                    "title": "SUBMIT"
                }
            ]
        }],
        schema: function() {
            return SchemaResource.getGlobalSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                // Disbursement Date should be >= Sanction Date + 30 days
                // if (model.loanAccount.sanctionDate <= model.loanAccount.scheduledDisbursementDate-30)
                {
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue', pageId: ''});
                }
            }
        }
    };
}]);