irf.pageCollection.factory(irf.page("loans.individual.writeoff.WriteOffExecution"),
["$log", "Enrollment", "SessionStore", "$state", "SchemaResource", "LoanAccount", 
function($log, Enrollment, SessionStore, $state, SchemaResource, LoanAccount){

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
            model.loanAccount.remarks = "";

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
                    "title": "ACCOUNT_ID",
                    "key": "loanAccount.accountId",
                    "readonly": true
                },
                {
                    "title": "CUSTOMER_NAME",
                    "key": "loanAccount.customerName",
                    "readonly": true
                },
                {
                    "title": "CUSTOMER_URN",
                    "key": "loanAccount.description",
                    "readonly": true
                },
                {
                    "title": "TOTAL_DEMAND_DUE",
                    "key": "loanAccount.amount1",
                    "readonly": true
                },
                {
                    "title": "PRINCIPAL_DUE",
                    "key": "loanAccount.part1",
                    "readonly": true
                },
                {
                    "title": "INTEREST_DUE",
                    "key": "loanAccount.part2",
                    "readonly": true
                },
                {
                    "title": "PRODUCT_CODE",
                    "key": "loanAccount.param1",
                    "readonly": true
                },
                {
                    "title": "WRITE_OFF_DATE",
                    "key": "loanAccount.transactionDate",
                    "type": "date",
                    "required": true
                },
                {
                    "title": "REMARKS",
                    "key": "loanAccount.remarks",
                    "required": true
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
                        'accountNumber': model.loanAccount.accountId,
                        'writeOffDate' : model.loanAccount.transactionDate,
                        'remarks' : model.loanAccount.remarks
                    }).$promise;

                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'loans.individual.writeoff.WriteOffQueue', pageId: ''});
                }
            }
        }
    };
}]);
