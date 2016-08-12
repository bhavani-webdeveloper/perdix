irf.pageCollection.factory("Pages__PendingFRO",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "PendingFRO",
        "type": "schema-form",
        "name": "PendingFRO",
        "title": "PENDING FOR FRO(FIELD RISK OFFICER) APPROVAL",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "DISBURSEMENT DETAILS | Ravi S | Key Metals Pvt. Ltd.", // sample label code
            "colClass": "col-sm-6", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                {
                    "key": "bank_name",
                    "title": "Tranche Details",
                    "type": "textarea"
                },
                {
                    "key": "branch_name",
                    "title": "Remarks"
                },
                {
                    "key": "account_number",
                    "title": "Hub Manager Verification Date",
                    "type": "date"
                },
                {
                    "key": "account_number",
                    "title": "FRO Verification Date",
                    "type": "date"
                },
                {
                    "key": "status",
                    "title": "Status",
                    "type": "radios",
                    "titleMap": {
                                "1": "Approve",
                                "2": "Reject"
                            }
                },
                {
                    "key": "reject_reason",
                    "title": "FRO Approve Remarks",
                    "type": "select"
                },
                {
                    "key": "reject_remarks",
                    "title": "FRO Rejection Remarks"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Confirm FRO Approval/Rejection"
                    },{
                        "type": "submit",
                        "title": "Reset"
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