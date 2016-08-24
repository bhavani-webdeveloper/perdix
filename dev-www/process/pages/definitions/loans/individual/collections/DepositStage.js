irf.pageCollection.factory(irf.page("loans.individual.collections.DepositStage"),
["$log", "Enrollment", "SessionStore","$state", "$stateParams", "irfElementsConfig", function($log, Enrollment, SessionStore,$state,$stateParams,irfElementsConfig){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "DEPOSIT_STAGE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");
            model.loggedInUser = SessionStore.getUsername();

            model.pendingCashDeposits = [{
                "loan_ac_no":"508640101335",
                "customer_name":"GeeKay Industries",
                "amount_collected": 10000
            },
            {
                "loan_ac_no":"508640108276",
                "customer_name":"Manjunatha Hydroflexibles",
                "amount_collected":6000
            },
            {
                "loan_ac_no":"5010001229347869",
                "customer_name":"VSR Engineering",
                "amount_collected":49816
            }];
            model.depositBank = "HDFC Bank";
            model.depositBranch = "Nungambakkam";

            model.totalAmount=0;
            for (var i = model.pendingCashDeposits.length - 1; i >= 0; i--) {
                model.totalAmount+=model.pendingCashDeposits[i].amount_collected;
            }
            model.amountDeposited = model.totalAmount;
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "titleExpr": "'Cash to be deposited by '+ model.loggedInUser", // sample label code
            "colClass": "col-sm-12", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
            {
                "type":"array",
                "key":"pendingCashDeposits",
                "add":null,
                "remove":null,
                "view": "fixed",
                "readonly":true,
                "notitle":true,
                "items":[{
                    "type":"section",
                    "htmlClass": "row",
                    "items": [{
                        "type": "section",
                        "htmlClass": "col-xs-8 col-md-8",
                        "items": [{
                            "key":"pendingCashDeposits[].customer_name",
                            "titleExpr":"model.pendingCashDeposits[arrayIndex].loan_ac_no",
                            "title":" "
                        }]
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-4 col-md-4",
                        "items": [{
                            "key": "pendingCashDeposits[].amount_collected",
                            "type":"amount",
                            "title": " "
                        }]
                    }]
                }]
            },
            {
                "type":"section",
                "html":"<hr>"
            },
            {
                "type":"section",
                "htmlClass": "row",
                "items": [{
                    "type": "section",
                    "htmlClass": "col-sm-12",
                    "items": [{
                        "type": "amount",
                        "key": "totalAmount",
                        "title":"TOTAL_TO_BE_DEPOSITED",
                        "readonly":true
                    }]
                }]
            },
            {
                "key":"amountDeposited",
                "type":"amount",
                "title":"AMOUNT_DEPOSITED"
            },
            {
                "key":"depositBank",
                "title":"DEPOSITED_BANK"
            },
            {
                "key":"depositBranch",
                "title":"DEPOSITED_BRANCH"
            }
            ]
        },{
            "type": "actionbox",
            "items": [{
                "type": "submit",
                "title": "SUBMIT"
            }]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                    $state.go("Page.Engine", {
                        pageName: 'IndividualLoanBookingConfirmation',
                        pageId: model.customer.id
                    });
            }
        }
    };
}]);