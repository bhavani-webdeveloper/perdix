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
                    "key": "loanAccount.disbursementSchedules.customerSignatureDate",
                    
                    "type": "date"
                },
                {
                    "key": "loanAccount.disbursementSchedules.scheduledDisbursementDate",
                    "title": "DISBURSEMENT_DATE",
                    "type": "date"
                },
                {
                    "key": "loanAccount.partnerName",
                    "title": "PARTNER_NAME",
                    "readonly": true
                },
                {
                    "key": "loanAccount.loanType",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.frequency",
                    
                    "readonly": true,
                    "type": "select",
                    "enumCode": "frequency"
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
                    "key": "loanAccount.loanPurpose1",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.loanPurpose2",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.loanPurpose3",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.loanCentre",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.guarantors.guaUrnNo",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.guarantors.guaFirstName",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.guarantors.guaMiddleName",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.guarantors.guaDob",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.guarantors.address",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.guarantors.assetDetails",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.guarantors.totalLiabilities",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.collateral.collateralType",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.collateral.collateralDescription",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.collateral.collateralValue",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.loanDocuments[1].document",
                    "title": "DOCUMENT_1",
                    "readonly": true
                },
                {
                    "title": "DOCUMENT_2",
                    "key": "loanAccount.loanDocuments[2].document",
                    "readonly": true
                },
                {
                    "title": "DOCUMENT_3",
                    "key": "loanAccount.loanDocuments[3].document",
                    "readonly": true
                },
                {
                    "key": "loanAccount.loanDocuments.photo",
                    "title": "PHOTO",
                    "readonly": true
                },
                {
                    "key": "loanAccount.interestRate",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.processingFeeInPaisa",
                    
                    "readonly": true
                },
                {
                    "key": "loanAccount.cibilCharges",
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
                    "key": "loanAccount.sanctionDate",
                    
                    "readonly": true
                },
                
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "button",
                        "title": "BACK",
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