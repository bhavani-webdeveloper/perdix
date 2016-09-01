irf.pageCollection.factory(irf.page("loans.individual.reversal.reversalExecution"),
["$log", "Enrollment", "SessionStore", "$state", "SchemaResource", function($log, Enrollment, SessionStore, $state, SchemaResource){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "WRITE_OFF",
        initialize: function (model, form, formCtrl) {
            $log.info("WriteOff Screen got initialized");
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){

        },
        form: [{
            "type": "box",
            "title": "WRITE_OFF", // sample label code
            "colClass": "col-sm-12", // col-sm-6 is default, optional

            "items": [
                {
                    "key": "loanAccount.accountNumber",
                    "readonly": true,
                    "type": "number"
                },
                {
                    "key": "loanAccount.customerName",
                    "readonly": true,
                    "required": true
                },
                {
                    "key": "loanAccount.lastTransactionAmount",
                    "readonly": true,
                    "required": true
                },
                {
                    "key": "loanAccount.transactionDate",
                    "readonly": true,
                    "type": "date"
                },
                {
                    "type": "submit",
                    "title": "REVERSE"
                }
            ]
        }],
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                // Disbursement Date should be >= Sanction Date + 30 days
                // if (model.loanAccount.sanctionDate <= model.loanAccount.scheduledDisbursementDate-30)
                {
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'loans.individual.writeoff.AccountQueue', pageId: ''});
                }
            }
        }
    };
}]);
