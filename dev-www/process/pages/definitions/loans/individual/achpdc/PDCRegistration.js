irf.pageCollection.factory(irf.page("loans.individual.achpdc.PDCRegistration"),
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "pdc",
        "type": "schema-form",
        "name": "pdc",
        "title": "PDC_REGISTRATION",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("PDC selection Page got initialized");
            model.pdc = model.pdc||{};
            if (model._pdc.accountNumber) {
                model.pdc.loanAccountNumber=model._pdc.accountNumber;
             } else if ($stateParams.pageId) {
              model.pdc.loanAccountNumber=$stateParams.pageId;
             } else {
              $state.go("Page.Engine",{
                                    pageName:"loans.individual.Queue",
                                    pageId:null
                                });
             }
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "notitle": true ,
            "colClass":"col-sm-8",
                 "items": [{
                            "type":"fieldset",
                            "title": "LOAN_DETAILS",
                            "items":[{
                                    "key": "pdc.loanAccountNumber",
                                    "title": "LOAN_ACCOUNT_NUMBER",
                                    "readonly":true
                                },
                                {
                                    "key": "pdc.BranchCode",
                                    "title": "BRANCH_NAME",
                                    "readonly":true
                                },
                                {
                                    "key": "pdc.CentreCode",
                                    "title": "CENTRE_CODE",
                                    "readonly":true
                                },
                                {
                                    "key": "pdc.entityName",
                                    "title": "ENTITY_NAME",
                                    "readonly":true
                                },
                                {
                                    "key": "pdc.applicantName",
                                    "title": "APPLICANT_NAME",
                                    "readonly":true
                                },
                                {
                                    "key": "pdc.coApplicantName",
                                    "title": "COAPPLICANT_NAME",
                                    "readonly":true
                                }]
                            },
                            {
                            "type":"fieldset",
                            "title": "SECURITY_CHECK",
                            "items":[{
                                    "key": "pdc.securityCheckNo",
                                    "title": "SECURITY_CHECK_NO"
                                },
                                {
                                    "key": "pdc.ifscCode",
                                    "title": "IFSC_CODE"
                                },
                                {
                                    "key": "pdc.bankName",
                                    "title": "BANK_NAME",
                                    "readonly":true
                                },
                                {
                                    "key": "pdc.branchName",
                                    "title": "BRANCH_NAME",
                                    "readonly":true
                                }]
                            },
                            {
                                "type":"fieldset",
                                "title":"PDC_DETAILS",
                                "items":[
                                {
                                    "key": "pdc.firstInstallmentDate",
                                    "title": "First Instalment Date",
                                    "type": "date"
                                },
                                {
                                    "type":"array",
                                    "key":"pdc.checkDetails",
                                    "view": "fixed",
                                    "title":"CHECK_DETAILS",
                                    "items":[{
                                            "key": "pdc.checkDetails[].checkStartNo",
                                            "title": "CHECK_START_NO"
                                        },
                                        {
                                            "key": "pdc.checkDetails[].noOfLeaves",
                                            "title": "NO_OF_LEAVES"
                                        },
                                        {
                                            "key": "pdc.checkDetails[].installmentAmount",
                                            "title": "INSTALLMENT_AMOUNT"
                                        },
                                        {
                                            "key": "pdc.checkDetails[].ifscCode",
                                            "title": "IFSC_CODE",
                                            "type": "lov",
                                            "inputMap": {
                                                "ifscCode": {
                                                    "key": "ifscCode",
                                                    "title": "IFSC_CODE"
                                                }
                                            }
                                        },
                                        {
                                            "key": "pdc.checkDetails[].bankName",
                                            "title": "BANK_NAME",
                                            "readonly":true
                                        },
                                        {
                                            "key": "pdc.checkDetails[].branchName",
                                            "title": "BRANCH_NAME",
                                            "readonly":true
                                        }]
                                }]
                            }
                        ]
                },
            {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Save Details"
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