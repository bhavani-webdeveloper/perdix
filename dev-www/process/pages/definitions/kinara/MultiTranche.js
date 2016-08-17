irf.pageCollection.factory("Pages__MultiTranche",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "MultiTranche",
        "type": "schema-form",
        "name": "MultiTranche",
        "title": "SUBSEQUENT TRANCHE DISBURSEMENT",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "TRANCHE 3 | DISBURSEMENT DETAILS | Ravi S | Key Metals Pvt. Ltd.", // sample label code
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
                    "title": "Disbursement Date",
                    "type": "date"
                },
                {
                    "key": "branch_name",
                    "title": "Customer Sign Date",
                    "type": "date"
                },
                {
                    "key": "branch_name",
                    "title": "Remarks For Tranche Disbursement"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Send For FRO Verification"
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