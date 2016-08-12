irf.pageCollection.factory("Pages__Disburse",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "Disburse",
        "type": "schema-form",
        "name": "Disburse",
        "title": "Disburse Loan",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");
            model.bank_name="ICICI Bank";
            model.branch_name="Belgavi";
            model.account_number="005123456789";
            model.status="Rejected";
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
                    "title": "Bank Name",
                    "type": "select",
                    "titleMap": {
                                "1": "ICICI Bank",
                                "2": "Kotak Mahindra Bank"
                            }
                },
                {
                    "key": "branch_name",
                    "title": "Branch Name"
                },
                {
                    "key": "account_number",
                    "title": "Account Number"
                },
                {
                    "key": "status",
                    "title": "Status",
                    "type": "select",
                    "titleMap": {
                                "1": "Sent To Bank",
                                "2": "Reject"
                            }
                },
                {
                    "key": "reject_reason",
                    "title": "Rejected Reason",
                    "type": "select"
                },
                {
                    "key": "reject_remarks",
                    "title": "Rejected Remarks"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Disburse"
                    },{
                        "type": "submit",
                        "title": "Reject"
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