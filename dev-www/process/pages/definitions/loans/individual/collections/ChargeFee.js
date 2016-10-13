irf.pageCollection.factory(irf.page("loans.individual.collections.ChargeFee"),
["$log", "SchemaResource", "SessionStore", "Utils", "$stateParams", "LoanAccount", "PageHelper",
    function($log, SchemaResource, SessionStore, Utils, $stateParams, LoanAccount, PageHelper) {

        return {
            "type": "schema-form",
            "title": "ADHOC_CHARGES",
            "subTitle": "CHARGE_FEE",
            initialize: function(model, form, formCtrl) {
                $log.info("Demo Customer Page got initialized");
                model.chargeFee = model.chargeFee || {};
                model.chargeFee.accountNumber = $stateParams.pageId;
                model.chargeFee.transactionDate = Utils.getCurrentDate();
                model.chargeFee.userId = SessionStore.getLoginname();
            },
            form: [{
                "type": "box",
                "title": "FEE_DETAILS",
                "items": [{
                    "key": "chargeFee.accountNumber",
                    "title": "ACCOUNT_NUMBER",
                    "readonly": true
                }, {
                    "key": "_loan.customerName",
                    "title": "ENTITY_NAME",
                    "readonly": true,
                    "condition": "model._loan.customerName"
                }, {
                    "key": "_loan.loanAmount",
                    "title": "LOAN_AMOUNT",
                    "readonly": true,
                    "condition": "model._loan.loanAmount"
                }, {
                    "key": "chargeFee.transactionDate",
                    "title": "FEE_DATE",
                    "type": "date",
                    "readonly": true
                }, {
                    "key": "chargeFee.transactionName",
                    "title": "FEE_TYPE",
                    "type": "select",
                    "enumCode": "charge_fee_type",
                    "required": true
                }, {
                    "key": "chargeFee.amount",
                    "title": "AMOUNT",
                    "type": "amount",
                    "required": true
                }]
            }, {
                type: "actionbox",
                items: [{
                    type: "submit",
                    title: "Submit"
                }]
            }],
            schema: function() {
                return SchemaResource.getDisbursementSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {
                    $log.info("on submit action ....");
                    model.chargeFee.transactionDate = Utils.getCurrentDate() + "T14:35:13.248Z";
                    PageHelper.showLoader();
                    LoanAccount.chargeFee(model.chargeFee).$promise.then(function(resp) {
                        PageHelper.showProgress("charge-fee", "Charge Fee Collected", 3000);
                        $state.go("Page.Engine", {
                            "pageName": "loans.individual.Queue",
                            "pageId": null
                        });
                    }, function(errResp) {
                        $log.error(errResp);
                        PageHelper.showErrors(errResp);
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });
                }
            }
        };
    }
]);