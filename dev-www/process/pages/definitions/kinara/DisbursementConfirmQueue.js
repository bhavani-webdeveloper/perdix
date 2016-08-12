irf.pageCollection.factory("Pages__DisbursementConfirmQueue",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "DisbursementConfirmQueue",
        "type": "schema-form",
        "name": "DisbursementConfirmQueue",
        "title": "DISBURSEMENT CONFIRMATION QUEUE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "Select Loans To Disburse OR Upload File", // sample label code
            "colClass": "col-sm-12", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                {
                    "key": "loan_acc_1",
                    "title": "Ajay Karthik | GKB Industries Ltd.",
                    "type": "checkbox",
                    "schema": {
                        "default": false
                    }
                },
                {
                    "key": "loan_acc_2",
                    "title": "Ravi S | Key Metals Pvt. Ltd.",
                    "type": "checkbox",
                    "schema": {
                        "default": false
                    }
                },
                {
                    "key": "loan_acc_3",
                    "title": "Kaushik G | HPL",
                    "type": "checkbox",
                    "schema": {
                        "default": false
                    }
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Upload Confirmation Excel"
                    },{
                        "type": "submit",
                        "title": "Confirm Selected Accounts"
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