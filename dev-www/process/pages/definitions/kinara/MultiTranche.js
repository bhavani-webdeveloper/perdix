irf.pageCollection.factory("Pages__MultiTranche",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "MultiTranche",
        "type": "schema-form",
        "name": "MultiTranche",
        "title": "Multi Tranche Disbursement",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");

            model.tranche_no="3";
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "Tranche #3 | Disbursement Details | Ravi S | Key Metals Pvt. Ltd.", // sample label code
            "colClass": "col-sm-6", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                {
                    "key": "tranche_no",
                    "title": "Tranche Number",
                },
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