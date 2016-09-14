irf.pageCollection.factory(irf.page("loans.individual.writeoff.WriteOffExecution"),
["$log", "Enrollment", "SessionStore", "$state", "SchemaResource", function($log, Enrollment, SessionStore, $state, SchemaResource){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "WRITE_OFF",
        initialize: function (model, form, formCtrl) {
            $log.info("WriteOff Screen got initialized");
            model.loanAccount = model.loanAccount || [];
            if (model._loanAccount ) {
                model.loanAccount = model._loanAccount;
            }

        },
        offline: false,
        getOfflineDisplayItem: function(item, index){

        },
        form: [{
            "type": "box",
            "title": "WRITE_OFF", // sample label code
            "colClass": "col-sm-12", // col-sm-6 is default, optional

            "items": [
            /*
                {
                    type:"section",
                    html:"<pre>{{model._loanAccount}}</pre>"
                },
                {
                    type:"section",
                    html:"<pre>{{model.loanAccount}}</pre>"
                },
            */
                {
                    "key": "loanAccount.accountId",
                    "readonly": true
                },
                {
                    "key": "loanAccount.amount1",
                    "readonly": true,
                    "required": true
                },
                {
                    "key": "loanAccount.amount2",
                    "required": true
                },
                {
                    "title": "REMARKS",
                    "key": "loanAccount.writeOffRemarks",
                    "required": true
                },
                {
                    "key": "loanAccount.transactionDate",
                    "type": "date"
                },
                {
                    "type": "submit",
                    "title": "WRITE_OFF"
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
                    // Update information in DB
                    return LoanAccount.writeOff({
                        'accountNumber': loanAccount.accountId,
                        'writeOffDate' : loanAccount.transactionDate,
                        'remarks' : loanAccount.writeOffRemarks
                    }).$promise;

                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'loans.individual.writeoff.WriteOffQueue', pageId: ''});
                }
            }
        }
    };
}]);
