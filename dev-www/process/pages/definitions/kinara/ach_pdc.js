irf.pageCollection.factory("Pages__ACH_PDC",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "ach_pdc",
        "type": "schema-form",
        "name": "ach_pdc",
        "title": "ACH/PDC REGISTRATION",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("ACH / PDC selection Page got initialized");
            model.customer.urnNo="1234567890";
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "LOAN ACCOUNT DETAILS", // sample label code
            "colClass": "col-sm-8", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                {
                    "key": "instrument",
                    "title": "Repayment instrument",
                    "type": "select",
                    "titleMap": {
                        "1": "ACH",
                        "2": "PDC"
                    }
                },
                {
                    "type": "fieldset",
                    "condition": "model.instrument == '2'",
                    items: [{
                            "key": "branch_id",
                            "title": "Branch ID"
                        },
                        {
                            "key": "frequency",
                            "title": "Account ID"
                        },
                        {
                            "key": "customer.name",
                            "title": "Repayment Frequency ",
                            "type": "select",
                            "titleMap": {
                                "1": "Monthly",
                                "2": "Quarterly"
                            }   
                        },
                        {
                            "key": "entity.name",
                            "title": "Loan Booking date",
                            "type": "date"
                        },
                        {
                            "key": "customer.urnNo",
                            "title": "Bank Name",
                            "type": "select"
                        },
                        {
                            "key": "loan.repayment",
                            "title": "Branch ID",
                            "type": "select"
                        },
                        {
                            "key": "customer.firstName",
                            "title": "Bank account No"
                        },
                        {
                            "key": "customer.lastName",
                            "title": "Cheque No"
                        },
                        {
                            "key": "loan.amount",
                            "title": "Cheque Date",
                            "type": "date"
                        },
                        {
                            "key": "loan_purpose",
                            "title": "Instalment Number"
                        },
                        {
                            "key": "loan_purpose2",
                            "title": "Number of Cheques"
                        },
                        {
                            "key": "center.name",
                            "title": "Cheque Amount"
                        },
                        {
                            "key": "loan_tenure",
                            "title": "Instrument Type",
                            "type": "select",
                            "titleMap": {
                                "1": "Normal PDC",
                                "2": "Pre- EMI PDC",
                                "3": "Security PDC"
                            }
                        },
                        {
                            "key": "loan_tenure",
                            "title": "Data Created By",
                            "type": "date"
                        },
                        {
                            "key": "loan_tenure",
                            "title": "Created On",
                            "type": "date"
                        },
                        {
                            "key": "loan_tenure",
                            "title": "Data Edited By"
                        },
                        {
                            "key": "loan_tenure",
                            "title": "Edited Date ",
                            "type": "date"
                        }]
                },
                
                {
                    "type": "fieldset",
                    "condition": "model.instrument == '1'",
                    items: [{
                            "key": "branch_id",
                            "title": "Branch ID"
                        },
                        {
                            "key": "frequency",
                            "title": "Account ID"
                        },
                        {
                            "key": "customer.name",
                            "title": "Savings Account Details"
                        },
                        {
                            "key": "entity.name",
                            "title": "Bank/Account ID"
                        },
                        {
                            "key": "customer.urnNo",
                            "title": "Account Type",
                            "type": "select"
                        },
                        {
                            "key": "loan.repayment",
                            "title": "Account Number"
                        },
                        {
                            "key": "customer.firstName",
                            "title": "Full Name"
                        },
                        {
                            "key": "customer.lastName",
                            "title": "Loan account Number"
                        },
                        {
                            "key": "loan.amount",
                            "title": "Instalment Number"
                        },
                        {
                            "key": "loan_purpose",
                            "title": "ACH Registered Date",
                            "type": "date"
                        },
                        {
                            "key": "loan_purpose2",
                            "title": "ACH Submitted date",
                            "type": "date"
                        },
                        {
                            "key": "center.name",
                            "title": "Max ECS Amount"
                        },
                        {
                            "key": "loan_tenure",
                            "title": "Repayment Frequency",
                            "type": "select"
                        },
                        {
                            "key": "loan_tenure",
                            "title": "Instalment Amount"
                        },
                        {
                            "key": "loan_tenure",
                            "title": "First Instalment Amount"
                        },
                        {
                            "key": "loan_tenure",
                            "title": "Last Instalment Amount"
                        },
                        {
                            "key": "loan_tenure",
                            "title": "First Instalment Date",
                            "type": "date"
                        },
                        {
                            "key": "loan_tenure",
                            "title": "Last Instalment Date",
                            "type": "date"
                        }]
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Save Details",
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