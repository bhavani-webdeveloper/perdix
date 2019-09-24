irf.pageCollection.factory(irf.page("loans.individual.writeoff.WriteOffExecution"),
["$log", "Enrollment", "SessionStore", "$state", "SchemaResource", "LoanAccount", "PageHelper", 
function($log, Enrollment, SessionStore, $state, SchemaResource, LoanAccount, PageHelper){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "WRITE_OFF",
        initialize: function (model, form, formCtrl) {
            $log.info("WriteOff Screen got initialized");
            model.loanAccount = model.loanAccount || [];
            if (model._loanAccount ) {
                model.loanAccount = model._loanAccount;
                model.loanAccount.accountNumber = model._loanAccount.accountId;
                model.loanAccount.writeOffDate = model._loanAccount.transactionDate;

                var promise = LoanAccount.get({accountId: model.loanAccount.accountNumber}).$promise;
                promise.then(function (data) { /* SUCCESS */
                    model.loanAccountAPi= data;
                    irfProgressMessage.pop('loading-loan-details', 'Loaded.', 2000);
                }, function (resData) {
                    irfProgressMessage.pop('loading-loan-details', 'Error loading Loan details.', 4000);
                    PageHelper.showErrors(resData);
                    irfNavigator.goBack();
                    //backToLoansList();
                });

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
                    "key": "loanAccount.accountNumber",
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
                    "title": "PRINCIPAL_DUE",
                    "key": "loanAccountAPi.totalPrincipalDue",
                    "readonly": true
                },
                {
                    "title": "INTEREST_DUE",
                    "key": "loanAccountAPi.totalNormalInterestDue",
                    "readonly": true
                },
                {
                    "title": "PENAL_INTEREST_DUE",
                    "key": "loanAccountAPi.totalPenalInterestDue",
                    "readonly": true
                },
                {
                    "title": "TOTAL_DEMAND_DUE",
                    "key": "loanAccount.amount1",
                    "readonly": true
                },
                {
                    "title": "FEE_DUE",
                    "key": "loanAccountAPi.totalFeeDue",
                    "readonly": true
                }, 
                {
                    "title": "PRINCIPAL_NOT_DUE",
                    "key": "loanAccountAPi.principalNotDue",
                    "readonly": true
                },
                {
                    "title": "BOOKED_NOT_DUE_NORMAL_INTEREST",
                    "key": "loanAccountAPi.bookedNotDueNormalInterest",
                    "readonly": true
                },
               
                {
                    "title": "BOOKED_NOT_DUE_PENAL_INTEREST",
                    "key": "loanAccountAPi.bookedNotDuePenalInterest",
                    "readonly": true
                },
                {
                    "title": "PRODUCT_CODE",
                    "key": "loanAccount.param1",
                    "readonly": true
                },
                {
                    "title": "WRITE_OFF_DATE",
                    "key": "loanAccount.writeOffDate",
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
                    PageHelper.showLoader();
                    LoanAccount.writeOff({
                        'accountNumber': model.loanAccount.accountNumber,
                        'writeOffDate' : model.loanAccount.writeOffDate,
                        'remarks' : model.loanAccount.remarks
                    }, null, function(response) {
                        PageHelper.hideLoader();
                        PageHelper.showProgress("page-init", "Done.", 2000);
                        $log.info("Redirecting");
                        $state.go('Page.Engine', {pageName: 'loans.individual.writeoff.WriteOffQueue', pageId: ''});
                    }, function(errorResponse) {
                        PageHelper.hideLoader();
                        PageHelper.showErrors(errorResponse);
                    });
                }
            }
        }
    };
}]);
