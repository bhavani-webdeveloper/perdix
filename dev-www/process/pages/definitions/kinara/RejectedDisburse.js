irf.pageCollection.factory("Pages__RejectedDisburse",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "RejectedDisburse",
        "type": "schema-form",
        "name": "RejectedDisburse",
        "title": "Update Acccount Details",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");

            model.rejected_reason="Data errors";
            model.rejected_remarks="IFSC code wrong";
            model.remarks_hub_manager="Please correct the IFSC code";

        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "DETAILS | Ravi S | Key Metals Pvt. Ltd.", // sample label code
            "colClass": "col-sm-12", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                
                {
                    "key": "rejected_reason1",
                    "title": "Finance Team Rejected Reason"
                },
                {
                    "key": "rejected_remarks",
                    "title": "Finance Team Rejected Remarks"
                },
                {
                    "key": "rejected_remarks2",
                    "title": "Finance Team Rejected Date"
                },
                {
                    "key": "rejected_remarks3",
                    "title": "Applicant IFSC Code"
                },
                {
                    "key": "rejected_remarks4",
                    "title": "Applicant Account Name"
                },
                {
                    "key": "rejected_remarks5",
                    "title": "Applicant Bank Account Number"
                },
                {
                    "key": "remarks_hub_manager",
                    "title": "Remarks – Hub Manager"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Submit"
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