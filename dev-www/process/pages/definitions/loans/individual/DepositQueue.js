irf.pageCollection.factory("Pages__DepositQueue",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", "irfElementsConfig", function($log, Enrollment, SessionStore,$state,$stateParams,irfElementsConfig){

    var branch = SessionStore.getBranch();

    return {
        "id": "DepositQueue",
        "type": "schema-form",
        "name": "DepositQueue",
        "title": "Deposit Stage",
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
            var totalAmount=0;
            for (var i = model.pendingCashDeposits.length - 1; i >= 0; i--) {
                totalAmount+=model.pendingCashDeposits[i].amount_collected;

            }
            this.form[0].items.push({
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
                        "type": "section",
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
                "title":"Submit"
            });

        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "titleExpr": "'Cash to be deposited by '+ model.loggedInUser", // sample label code
            "colClass": "col-sm-6", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
            {
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
            },
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
                        "htmlClass": "col-xs-8",
                        "items": [{
                            "key":"pendingCashDeposits[].loan_ac_no",
                            "notitle":true
                        },{
                            "key":"pendingCashDeposits[].customer_name",
                            "notitle":true
                        }]
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-xs-4",
                        "items": [{
                            "key": "pendingCashDeposits[].amount_collected",
                            "type":"amount",
                            "notitle":true
                        }]
                    }]
                }]
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