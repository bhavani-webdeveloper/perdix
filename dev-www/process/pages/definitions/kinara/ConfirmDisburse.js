irf.pageCollection.factory("Pages__ConfirmDisburse",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "ConfirmDisburse",
        "type": "schema-form",
        "name": "ConfirmDisburse",
        "title": "Confirmation of Disbursed Loan",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");

            model.branch_name="Confirmed";
            model.account_number="05/08/2016";

        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "DISBURSEMENT DETAILS | Ravi S | Key Metals Pvt. Ltd.", // sample label code
            "colClass": "col-sm-12", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                
                {
                    "key": "branch_name",
                    "title": "Confirmation Status"
                },
                {
                    "key": "account_number",
                    "title": "Disbursement Date"
                },
                {
                    "key": "account_number2",
                    "title": "Finance Team Rejection Remarks"
                },
                {
                    "key": "account_number3",
                    "title": "Finance Team Rejection Reasons"
                },
                {
                    "key": "account_number3",
                    "title": "Finance Team Rejected Date"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Confirm Disbursement"
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