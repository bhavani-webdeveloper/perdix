irf.pageCollection.factory("Pages__IndividualLoanBooking",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", "SchemaResource", function($log, Enrollment, SessionStore,$state,$stateParams, SchemaResource){

    var branch = SessionStore.getBranch();

    return {
        "id": "IndividualLoanBooking",
        "type": "schema-form",
        "name": "IndividualLoanBookingPage",
        "title": "Loan Booking Page",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            //$log.info("Individual Loan Booking Page got initialized");
            //model.customer.urnNo="1234567890";
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){

        },
        form: [{
            "type": "box",
            "title": "LOAN ACCOUNT DETAILS", // sample label code
            "colClass": "col-sm-6", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items":[
            {
                "type": "fieldset",
                "title": "Product Details",


            "items": [
                {
                    "key": "partner.name",
                    "title": "Partner Name",
                    "type": "select"
                },
                {
                    "key": "loan.type",
                    "title": "Loan Type",
                    "type": "select"
                },
                {
                    "key": "frequency",
                    "title": "Frequency",
                    "type": "select"
                }
                ]
            },
            {
                "type": "fieldset",
                "title": "Customer Details",
                "items": [
                {
                    "key": "customer.name",
                    "title": "Customer Name"
                },
                {
                    "key": "entity.name",
                    "title": "Entity Name"
                },
                {
                    "key": "customer.urnNo",
                    "title": "Customer URN",
                    "readonly": true
                }
                ]
            },
                {
                    "key": "loan.repayment",
                    "title": "Loan/Repayment Tenure"
                },
            {
                "type": "fieldset",
                "title": "Account Details",
                "items": [
                {
                    "key": "loanAccount.loanAmount"
                },
                {
                    "key": "customer.lastName",
                    "title": "Loan Application date"
                },
                {
                    "key": "loan.amount",
                    "title": "Loan purpose Level 1"
                },
                {
                    "key": "loan_purpose",
                    "title": "Loan purpose Level 2"
                },
                {
                    "key": "loan_purpose2",
                    "title": "Loan purpose Level 3"
                },
                {
                    "key": "center.name",
                    "title": "Centre Name"
                }
                ]
            },
            {
                "type": "fieldset",
                "title": "Insurance Details",
                "items": [
                {
                    "key": "customer.lastName",
                    "title": "Customer Insurance Selection",
                    "type": "select"
                },
                {
                    "key": "customer.lastName",
                    "title": "Nominee Details"
                },
                {
                    "key": "customer.lastName",
                    "title": "Guardian Details"
                }
                ]
            },
            {
                "type": "fieldset",
                "title": "Guarantor Details",
                "items": [
                {
                    "key": "loan_tenure",
                    "title": "Guarantor URN"
                },
                {
                    "key": "loan_tenure",
                    "title": "Guarantor DSC Override"
                },
                {
                    "key": "loan_tenure",
                    "title": "Guarantor DSC Remarks"
                },
                {
                    "key": "loan_tenure",
                    "title": "Guarantor Liabilities"
                }
                ]
            }
                ]
            },{
                "type": "box",
                "title": "",
                "items":[
                {
                    "key": "loan_tenure",
                    "title": "First name"
                },
                {
                    "key": "loan_tenure",
                    "title": "Middle name"
                },
                {
                    "key": "loan_tenure",
                    "title": "Date of Birth"
                },
                {
                    "key": "loan_tenure",
                    "title": "Address"
                },
                {
                    "key": "loan_tenure",
                    "title": "Assets"
                },
                {
                    "key": "loan_tenure",
                    "title": "Liabilities"
                },
                {
                "type": "fieldset",
                "title": "Collateral Details",
                "items": [
                {
                    "key": "loan_tenure",
                    "title": "Collateral Type"
                },
                {
                    "key": "loan_tenure",
                    "title": "Collateral Description"
                },
                {
                    "key": "loan_tenure",
                    "title": "Collateral Value"
                },
                {
                    "key": "image1",
                    "type": "file",
                    "title": "Document 1"
                },
                {
                    "key": "image1",
                    "type": "file",
                    "title": "Document 2"
                },
                {
                    "key": "image1",
                    "type": "file",
                    "title": "Document 3"
                },
                {
                    "key": "image1",
                    "type": "file",
                    "title": "Photo"
                }
                ]
            },
            {
                "type": "fieldset",
                "title": "Sanction Details",
                "items": [
                {
                    "key": "loan_tenure",
                    "title": "Interest Rate"
                },
                {
                    "key": "loan_tenure",
                    "title": "Processing Fees"
                },
                {
                    "key": "loan_tenure",
                    "title": "CIBIL Charges"
                },
                {
                    "key": "loan_tenure",
                    "title": "Repayment mode"
                },
                {
                    "key": "loan_tenure",
                    "title": "Sanction Amount"
                },
                {
                    "key": "loan_tenure",
                    "title": "Sanction Date"
                },
                {
                    "key": "loan_tenure",
                    "title": "Multi Tranche",
                    "type": "radios",
                    "titleMap": {
                                "1": "Yes",
                                "2": "No"
                            }
                },
                {
                    "key": "tranche_details",
                    "title": "Tranche Details",
                    "type": "textarea"
                }
                ]
            }
                ]
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Create Loan Account",
                    }
                ]
        }],
        schema: function() {
            return SchemaResource.getGlobalSchema().$promise;
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
