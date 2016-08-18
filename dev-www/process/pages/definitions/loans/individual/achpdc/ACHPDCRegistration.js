irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHPDCRegistration"),
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
            "colClass":"col-xs-12",
            // sample label code
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [   {
                         "type": "fieldset",
                         
                             "items": [
                            {
                            "type": "tabs", 
                            "tabs": [
                       {
                        "title": "ACH Registration",
                    "type": "fieldset",
                   "key": "instrument",
                    items: [{
                            "key": "ach.accountHolderName",
                            "title": "Account Holder Name"
                        },
                        {
                            "key": "ach.accountType",
                            "title": "Account Type"
                        },
                        {
                            "key": "ach.amount",
                            "title": "Amount",
                            "type": "Number"
                          
                        },
                        {
                            "key": "ach.consumerReferenceNumber",
                            "title": "Consumer Reference Number"
                        },
                        {
                            "key": "ach.customerAdditionalInformation",
                            "title": "Customer Additional Information"
                       },
                        {
                            "key": "ach.debitAmtOF",
                            "title": "Debit Amount OF"
                        },
                        {
                            "key": "ach.emailId",
                            "title": "E-mail Id"
                        },
                        {
                            "key": "ach.endDate",
                            "title": "End Date",
                            "type": "date"
                        },
                        {
                            "key": "ach.frequency",
                            "title": "Cheque Date"
                        },
                        {
                            "key": "ach.id",
                            "title": "Id",
                            "type":"Number"
                        },
                        {
                            "key": "ach.ifscCode",
                            "title": "IFSC Code"
                        },
                        {
                            "key": "ach.initialRejectReason",
                            "title": "Initial Reject Reason"
                        },
                        {
                            "key": "ach.legalAccountNumber",
                            "title": "Legal Account Number"
                        },
                        {
                            "key": "ach.loanAccountNumber",
                            "title": "Loan Account Number"
                        },
                        {
                            "key": "ach.mandateDate",
                            "title": "Mandate Date"
                        },
                        {
                            "key": "ach.micrCode",
                            "title": "Micro Code"
                        },
                        {
                            "key": "ach.mobilNumber",
                            "title": "Mobil Number"
                        },
                        {
                            "key": "ach.nameOfTheDestinationBankWithBranch",
                            "title": "Name Of The Destination Bank With Branch"
                        },
                        {
                            "key": "ach.nameOfUtilityBillerBankCompany",
                            "title": "Name Of Utility Biller Bank Company"
                        },
                        {
                            "key": "ach.processedOnWithUmrn",
                            "title": "Processed On With UMRN"
                        },
                        {
                            "key": "ach.rejectionCode",
                            "title": "Rejection Code"
                        },
                        {
                            "key": "ach.rejectionReason",
                            "title": "Rejection Reason"
                        },
                        {
                            "key": "ach.schemPlanReferenceNo",
                            "title": "Scheme Plan Reference Number"
                        },
                        {
                            "key": "ach.sponsorBankCode",
                            "title": "Sponsor Bank Code"
                        },
                        {
                            "key": "ach.startDate",
                            "title": "Start Data",
                            "type":"date"
                        },
                        {
                            "key": "ach.telephoneNo",
                            "title": "Telephone Number"
                        },
                        {
                            "key": "ach.umnrNo",
                            "title": "UMNR Number"
                        },
                        {
                            "key": "ach.uptoMaximumAmt",
                            "title": "Upto Maximum Amount",
                            "type": "Number"
                        },
                        {
                            "key": "ach.utilityCode",
                            "title": "Utility Code"
                        },
                        {
                            "key": "ach.version",
                            "title": "Version",
                            "type": "Number"
                        }]
                },
                
                {
                    "type": "fieldset",
                    "title": "PDC Registration",
                      "key": "instrument",
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
                }
                
            ]
        }]
    }]
        },
     
        {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Save Details",
                    }]
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