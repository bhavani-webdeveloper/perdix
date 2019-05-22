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
            
            actions: {
                submit: function(model, form, formName) {
                    $log.info("Inside submit");
                    PageHelper.showLoader();                    
                    var promise = LoanAccount.activateLoan({
                        "accountId": model.activateLoan.accountNumber
                    }).$promise;
                    promise.then(function(data) { /* SUCCESS */
                            $log.info(data)
                            PageHelper.showProgress("activateAccount", 'Account activated successfully.', 5000);
                        }, function(resData) {
                            PageHelper.showProgress("activateAccount", "Fail to activate account", 5000);
                        })
                        .finally(function() {
                            PageHelper.hideLoader();
                        })
                }
            }
        };
    }
]);