irf.pageCollection.factory(irf.page("loans.individual.collections.DepositQueue"),
["$log", "Enrollment", "SessionStore","$state", "$stateParams", "irfElementsConfig", function($log, Enrollment, SessionStore,$state,$stateParams,irfElementsConfig){

    var branch = SessionStore.getBranch();

    return {
        "id": "DepositQueue",
        "type": "schema-form",
        "name": "DepositQueue",
        "title": "DEPOSIT_STAGE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");
            model.loggedInUser = SessionStore.getUsername();

            model.pendingCashDeposits = [{
                "loan_ac_no":"5010001229342345",
                "customer_name":"Srilakshmi",
                "amount_collected":1200
            },
            {
                "loan_ac_no":"5010001229342322",
                "customer_name":"Janardhan",
                "amount_collected":1100
            },
            {
                "loan_ac_no":"5010001229347869",
                "customer_name":"Krishna",
                "amount_collected":800
            },
            {
                "loan_ac_no":"5010001229341122",
                "customer_name":"Raju",
                "amount_collected":2000
            }];
            //this.form[0].items=[];

            /*this.form[0].items.push({
                "type":"section",
                "htmlClass": "row",
                "items": [{
                    "type": "section",
                    "htmlClass": "col-xs-8",
                    "items": [{
                        "type": "section",
                        "html": "<H4>{{'Loan Account Number' | translate}}</H4>"
                    }]
                },
                {
                    "type": "section",
                    "htmlClass": "col-xs-4",
                    "items": [{
                        "type": "section",
                        "html": "<H4>{{'Amount collected' | translate}}</H4>"
                    }]
                }]
            });*/
            model.totalAmount=0;
            for (var i = model.pendingCashDeposits.length - 1; i >= 0; i--) {
                model.totalAmount+=model.pendingCashDeposits[i].amount_collected;

            }
            /*this.form[0].items.push({
                "type":"section",
                "html":"<hr>"
            },
            {
                "type":"section",
                "htmlClass": "row",
                "items": [{
                    "type": "section",
                    "htmlClass": "col-xs-8",
                    "items": [{
                        "type": "section",
                        "html": "<strong>{{'Total' | translate}}</strong>"
                    }]
                },
                {
                    "type": "section",
                    "htmlClass": "col-xs-4",
                    "items": [{
                        "type": "amount",
                        "html": "<strong>" + irfElementsConfig.currency.iconHtml + "&nbsp;" + totalAmount + "</strong>"
                    }]
                }]
            },
            {
                "type":"section",
                "html":"<hr>"
            },
            {
                "type":"submit",
                "title":"SUBMIT"
            });*/

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
            },
            {
                "type":"section",
                "html":"<hr>"
            },
            {
                "type":"submit",
                "title":"SUBMIT"
            }
            ]
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