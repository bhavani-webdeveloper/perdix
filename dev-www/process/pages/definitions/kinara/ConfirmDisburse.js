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

            model.confirmation_status="Rejected";
            model.disbursement_date="05-Aug-2016";
            model.reject_remarks="Capture IFSC code from the customer";
            model.reject_reason="Incorrect IFSC code";
            model.rejected_date="07-Aug-2016";

        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "Disbursement Details | 508640108845 | Ravi S | Key Metals Pvt. Ltd.", // sample label code
            "colClass": "col-sm-12", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                
                {
                    "key": "confirmation_status",
                    "title": "Confirmation Status"
                },
                {
                    "key": "disbursement_date",
                    "title": "Disbursement Date"
                },
                {
                    "key": "reject_reason",
                    "title": "Rejection Reasons"
                },
                {
                    "key": "reject_remarks",
                    "title": "Rejection Remarks"
                },
                {
                    "key": "rejected_date",
                    "title": "Rejected Date"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Update Status"
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