irf.pageCollection.factory("Pages__LoanBookingScreen",
["$log", "Enrollment", "SessionStore", function($log, Enrollment, SessionStore){

    var branch = SessionStore.getBranch();

    return {
        "id": "LoanBookingScreen",
        "type": "schema-form",
        "name": "LoanBookingScreen",
        "title": "Loan Booking Screen",
        initialize: function (model, form, formCtrl) {
            $log.info("Loan Booking Screen got initialized");
            model.acct_no="50067932853";
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "LOAN BOOKING - Account #50067932853", // sample label code
            "colClass": "col-sm-6", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                {
                    "key": "sign_date",
                    "title": "Cust Sign Date",
                    "type": "date",
                    "required": true
                },
                {
                    "key": "disbursement_date",
                    "title": "Disbursement Date",
                    "type": "date",
                    "required": true
                }/*,
                {
                    "key": "sanction_date",
                    "title": "Sanction Date",
                    "type": "date"
                }*/,
                {
                    "key": "acct_no",
                    "title": "Account Number"
                },
                {
                    "type": "submit",
                    "title": "Submit"
                }
            ]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){

            }
        }
    };
}]);