irf.pageCollection.factory("Pages__IndividualLoanBookingConfirmation",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "IndividualLoanBookingConfirmation",
        "type": "schema-form",
        "name": "IndividualLoanBookingConfirmationPage",
        "title": "Confirm Loan Booking",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");
            model.customer.urnNo="1234567890";
            model.interest_rate="25%";
            model.processing_fees="0.5%";
            model.cibil_charges="Rs. 100";
            model.repayment_mode="PDC";
            model.sanction_amount="Rs. 5,00,000";
            model.sanction_date="04/08/2016";
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "LOAN ACCOUNT DETAILS", // sample label code
            "colClass": "col-sm-6", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                {
                    "key": "partner.name",
                    "title": "Partner Name",
                    "readonly": true
                },
                {
                    "key": "loan.type",
                    "title": "Loan Type",
                    "readonly": true
                },
                {
                    "key": "frequency",
                    "title": "Frequency",
                    "readonly": true
                },
                {
                    "key": "customer.name",
                    "title": "Customer Name",
                    "readonly": true
                },
                {
                    "key": "entity.name",
                    "title": "Entity Name",
                    "readonly": true
                },
                {
                    "key": "customer.urnNo",
                    "title": "Customer URN",
                    "readonly": true
                },
                {
                    "key": "loan.repayment",
                    "title": "Loan/Repayment Tenure",
                    "readonly": true
                },
                {
                    "key": "customer.firstName",
                    "title": "Loan Amount",
                    "readonly": true
                },
                {
                    "key": "customer.lastName",
                    "title": "Loan Application date",
                    "readonly": true
                },
                {
                    "key": "loan.amount",
                    "title": "Loan purpose Level 1",
                    "readonly": true
                },
                {
                    "key": "loan_purpose",
                    "title": "Loan purpose Level 2",
                    "readonly": true
                },
                {
                    "key": "loan_purpose2",
                    "title": "Loan purpose Level 3",
                    "readonly": true
                },
                {
                    "key": "center.name",
                    "title": "Centre Name",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "Guarantor URN",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "First name",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "Middle name",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "Date of Birth",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "Address",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "Assets",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "Liabilities",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "Collateral Type",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "Collateral Description",
                    "readonly": true
                },
                {
                    "key": "loan_tenure",
                    "title": "Collateral Value",
                    "readonly": true
                },
                {
                    "key": "image1",
                    "title": "Document 1",
                    "readonly": true
                },
                {
                    "key": "image1",
                    "title": "Document 2",
                    "readonly": true
                },
                {
                    "key": "image1",
                    "title": "Document 3",
                    "readonly": true
                },
                {
                    "key": "image1",
                    "title": "Photo",
                    "readonly": true
                },
                {
                    "key": "interest_rate",
                    "title": "Interest Rate",
                    "readonly": true
                },
                {
                    "key": "processing_fees",
                    "title": "Processing Fees",
                    "readonly": true
                },
                {
                    "key": "cibil_charges",
                    "title": "CIBIL Charges",
                    "readonly": true
                },
                {
                    "key": "repayment_mode",
                    "title": "Repayment mode",
                    "readonly": true
                },
                {
                    "key": "sanction_amount",
                    "title": "Sanction amount",
                    "readonly": true
                },
                {
                    "key": "sanction_date",
                    "title": "Sanction date",
                    "readonly": true
                },
                {
                    "key": "customer_sign_date",
                    "title": "Customer Sign Date",
                    "type": "date"
                },
                {
                    "key": "disbursement_date",
                    "title": "Disbursement Date",
                    "type": "date"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "button",
                        "title": "Back",
                        "onClick": "actions.reenter(model, formCtrl, form, $event)"
                    },{
                        "type": "submit",
                        "title": "Confirm Loan Creation"
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
                        pageName: 'ViewIndividualLoan',
                        pageId: model.customer.id
                    });
            },
            reenter: function(model, formCtrl, form, $event) {
                $state.go("Page.Engine", {
                    pageName: 'IndividualLoanBooking',
                    pageId: model.customer.id
                });
            }
        }
    };
}]);