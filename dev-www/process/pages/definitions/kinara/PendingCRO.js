irf.pageCollection.factory("Pages__PendingCRO",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "PendingCRO",
        "type": "schema-form",
        "name": "PendingCRO",
        "title": "PENDING FOR CRO (CENTRAL RISK OFFICER) APPROVAL",
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
                    "title": "FRO Remarks"
                },
                {
                    "key": "account_number",
                    "title": "Verification Date",
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
                    "title": "CRO Approve Remarks",
                    "type": "select"
                },
                {
                    "key": "reject_remarks",
                    "title": "CRO Rejection Remarks"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Confirm CRO Approval/Rejection"
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