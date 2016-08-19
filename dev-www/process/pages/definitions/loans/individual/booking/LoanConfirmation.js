irf.pageCollection.factory(irf.page("loans.individual.booking.DisburseConfirmation"),
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "CONFIRM_LOAN_BOOKING",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");
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
                    "key": "loanAccount.partner.name",
                    "title": "PARTNER_NAME",
                    "readonly": true
                },
                {
                    "key": "loanAccount.type",
                    "title": "LOAN_TYPE",
                    "readonly": true
                },
                {
                    "key": "loanAccount.frequency",
                    "title": "FREQUENCY",
                    "readonly": true
                },
                {
                    "key": "loanAccount.customer.name",
                    "title": "CUSTOMER_NAME",
                    "readonly": true
                },
                {
                    "key": "loanAccount.entity.name",
                    "title": "ENTITY_NAME",
                    "readonly": true
                },
                {
                    "key": "loanAccount.customer.urnNo",
                    "title": "CUSTOMER_URN",
                    "readonly": true
                },
                {
                    "key": "loanAccount.repayment",
                    "title": "REPAYMENT_TENURE",
                    "readonly": true
                },
                {
                    "key": "loanAccount.customer.firstName",
                    "title": "LOAN_AMOUNT",
                    "readonly": true
                },
                {
                    "key": "loanAccount.customer.lastName",
                    "title": "LOAN_APPLICATION_DATE",
                    "readonly": true
                },
                {
                    "key": "loanAccount.amount",
                    "title": "LOAN_PURPOSE_LEVEL_1",
                    "readonly": true
                },
                {
                    "key": "loanAccount.purpose",
                    "title": "LOAN_PURPOSE_LEVEL_2",
                    "readonly": true
                },
                {
                    "key": "loanAccount.purpose2",
                    "title": "LOAN_PURPOSE_LEVEL_3",
                    "readonly": true
                },
                {
                    "key": "loanAccount.center.name",
                    "title": "CENTER_NAME",
                    "readonly": true
                },
                {
                    "key": "loanAccount.gua_urn",
                    "title": "GUARTANTOR_URN",
                    "readonly": true
                },
                {
                    "key": "loanAccount.gua_first_name",
                    "title": "FIRST_NAME",
                    "readonly": true
                },
                {
                    "key": "loanAccount.gua_middle_name",
                    "title": "MIDDLE_NAME",
                    "readonly": true
                },
                {
                    "key": "loanAccount.gua_dob",
                    "title": "DATE_OF_BIRTH",
                    "readonly": true
                },
                {
                    "key": "loanAccount.gua_address",
                    "title": "ADDRESS",
                    "readonly": true
                },
                {
                    "key": "loanAccount.assets",
                    "title": "ASSETS",
                    "readonly": true
                },
                {
                    "key": "loanAccount.liabilities",
                    "title": "LIABILITIES",
                    "readonly": true
                },
                {
                    "key": "loanAccount.collateral_type",
                    "title": "COLLATERAL_TYPE",
                    "readonly": true
                },
                {
                    "key": "loanAccount.collateral_desc",
                    "title": "COLLATERAL_DESCRIPTION",
                    "readonly": true
                },
                {
                    "key": "loanAccount.collateral_value",
                    "title": "COLLATERAL_VALUE",
                    "readonly": true
                },
                {
                    "key": "loanAccount.loanDocuments.document1",
                    "title": "DOCUMENT_1",
                    "readonly": true
                },
                {
                    "title": "DOCUMENT_2",
                    "key": "loanAccount.loanDocuments.document2",
                    "readonly": true
                },
                {
                    "title": "DOCUMENT_3",
                    "key": "loanAccount.loanDocuments.document3",
                    "readonly": true
                },
                {
                    "key": "loanAccount.loanDocuments.photo",
                    "title": "PHOTO",
                    "readonly": true
                },
                {
                    "key": "loanAccount.interest",
                    "title": "INTEREST_RATE",
                    "readonly": true
                },
                {
                    "key": "loanAccount.processingFeeInPaisa",
                    "title": "PROCESSING_FEES",
                    "readonly": true
                },
                {
                    "key": "loanAccount.cibil_charges",
                    "title": "CIBIL_CHARGES",
                    "readonly": true
                },
                {
                    "key": "loanAccount.repayment",
                    "title": "REPAYMENT_MODE",
                    "readonly": true
                },
                {
                    "key": "loanAccount.sanction_amount",
                    "title": "SANCTION_AMOUNT",
                    "readonly": true
                },
                {
                    "key": "loanAccount.sanction_date",
                    "title": "SANCTION_DATE",
                    "readonly": true
                },
                {
                    "key": "loanAccount.customer_sign_date",
                    "title": "CUSTOMER_SIGN_DATE",
                    "type": "date"
                },
                {
                    "key": "loanAccount.disbursement_date",
                    "title": "DISBURSEMENT_DATE",
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
                        "title": "CONFIRM_LOAN_CREATION"
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