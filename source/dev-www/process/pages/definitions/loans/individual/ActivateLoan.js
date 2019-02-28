irf.pageCollection.factory(irf.page("loans.individual.ActivateLoan"),
["$log", "SchemaResource", "SessionStore", "Utils", "$stateParams", "LoanAccount", "PageHelper", "$state",
    function($log, SchemaResource, SessionStore, Utils, $stateParams, LoanAccount, PageHelper, $state) {

        return {
            "type": "schema-form",
            "title": "ACTIVATE_LOAN",
            "subTitle": "ACTIVATE_LOAN",
            initialize: function(model, form, formCtrl) {
                $log.info("Demo Customer Page got initialized");
                model.activateLoan = model.activateLoan || {};
                model.activateLoan.accountNumber = $stateParams.pageId;
                
                
            },
            form: [{
                "type": "box",
                "title": "ACCOUNT_DETAILS",
                "items": [{
                    "key": "activateLoan.accountNumber",
                    "title": "ACCOUNT_NUMBER",
                    "readonly": true
                }]
            }, {
				type: "actionbox",				
                items: [{
                    type: "submit",
                    title: "Activate"
                }]
            }],
            schema: function() {
                return SchemaResource.getDisbursementSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {
                    $log.info("on submit action ....");
                    LoanAccount.activateLoan({
						"accountId": model.activateLoan.accountNumber
					}, function (data) {
						$log.info("Loan Activation successful");
						PageHelper.showProgress("loan-activation", "Loan Activation successful", 3000);
                        $state.go("Page.Engine", {
                            "pageName": "loans.individual.Queue",
                            "pageId": null
                        });
						
					}, function (res) {
						PageHelper.hideLoader();
						PageHelper.showErrors(res);
						PageHelper.showProgress('loan-activation', 'Error while activating loan.', 2000);
					});
                }
            }
        };
    }
]);