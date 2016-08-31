irf.pageCollection.factory(irf.page("loans.individual.disbursement.DisbursementConfirmation"),
    ["$log", "Enrollment", "SessionStore","$state", "$stateParams", "PageHelper", "IndividualLoan", "SchemaResource",
        function($log, Enrollment, SessionStore,$state,$stateParams, PageHelper, IndividualLoan, SchemaResource){

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "DISBURSEMENT_CONFIRMATION",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {

                var loanId = $stateParams['pageId'];
                PageHelper.showLoader();
                PageHelper.showProgress('loan-fetch', 'Fetching Loan Details');
                IndividualLoan.get({id: $stateParams.pageId},function (resp,head) {
                        PageHelper.showProgress('loan-fetch', 'Done.', 5000);
                        model.loanAccount = resp;

                    },
                    function(resp){
                        PageHelper.showProgress('loan-fetch', 'Oops. An Error Occurred', 5000);
                        PageHelper.showErrors(resp);

                }).$promise.finally(function(){
                        PageHelper.hideLoader();
                });
            },
            offline: false,
            getOfflineDisplayItem: function(item, index){

            },
            form: [{
                "type": "box",
                "title": "DISBURSEMENT_DETAILS",
                "colClass": "col-sm-8",
                "items": [

                    {
                        "key":"loanAccount.confirmationStatus",
                        "type":"select",
                        "titleMap":{
                            "Confirmed":"Confirmed",
                            "Rejected":"Rejected"
                        },
                        "title":"CONFIRMATION_STATUS"
                    },
                    {
                        "key":"loanAccount.loanDisbursementDate",
                        "type":"date",
                        "title":"DISBURSEMENT_DATE"
                    },
                    {
                        "key":"loanAccount.rejectionRemarks",
                        "title":"FINANCE_TEAM_REJECTION_REMARKS"
                    },
                    {
                        "key":"loanAccount.rejectionReason",
                        title:"FINANCE_TEAM_REJECTION_REASON"
                    },
                    {
                        "key":"loanAccount.rejectionDate",
                        "type":"date",
                        "title":"REJECTION_DATE"
                    },
                    {
                        "type": "actionbox",
                        "items": [{
                            "type": "submit",
                            "title": "Update"
                        }]
                    }
                ]
            }],
            schema: function() {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName){
                    alert("submit");
                }
            }
        };
    }]);
