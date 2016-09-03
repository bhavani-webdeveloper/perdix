irf.pageCollection.factory(irf.page("loans.individual.achpdc.PDCRegistration"),
["$log", "PDC", "PageHelper", "SessionStore","$state", "$stateParams", function($log, PDC, PageHelper, SessionStore,$state,$stateParams){

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
            model.pdcGet = model.pdcGet||{};
            if (model._pdc.loanId) {
                model.pdc = model._pdc;
                
                PDC.get({accountId: model._pdc.loanId},
                    function(res){
                        model.pdcGet = Utils.removeNulls(res,true);
                        // for (var i = Things.length - 1; i >= 0; i--) {
                        //     Things[i]
                        // }
                        PageHelper.hideLoader();
                        PageHelper.showProgress("page-init","Done.",2000);
                        model.pdc.securityCheckNo = model.pdcGet;
                        $log.info("PDC GET RESP. : "+res);
                    },
                    function(res){
                        PageHelper.hideLoader();
                        PageHelper.showProgress("page-init","Error in loading customer.",2000);
                        // PageHelper.showErrors(res);
                        $log.info("PDC GET Error : "+res);  
                        
                        /*$state.go("Page.Engine", {
                            pageName: 'EnrollmentHouseVerificationQueue',
                            pageId: null
                        });*/
                    }
                );

             } else if ($stateParams.pageId) {
              model.pdc.loanId=$stateParams.pageId;
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
                                    "key": "pdc.loanId",
                                    "title": "LOAN_ID",
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
                                    "key": "pdc.customerName",
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
                                    "key": "pdc.pdcSummaryDTO.bankAccountNo",
                                    "title": "BANK_ACCOUNT_NUMBER",
                                    "readonly":true
                                },
                                {
                                    "key": "pdc.pdcSummaryDTO.securityCheckNo",
                                    "title": "SECURITY_CHECK_NO"
                                },
                                {
                                    "key": "pdc.pdcSummaryDTO.chequeNoFrom",
                                    "title": "CHEQUE_NUMBER_FROM"
                                },
                                {
                                    "key": "pdc.pdcSummaryDTO.chequeType",
                                    "title": "CHEQUE_TYPE"
                                },
                                {
                                    "key": "pdc.pdcSummaryDTO.customerBankAccountNo",
                                    "title": "CUSTOMER_BANK_ACCOUNT_NUMBER"
                                },
                                {
                                    "key": "pdc.pdcSummaryDTO.id",
                                    "title": "ID"
                                },
                                {
                                    "key": "pdc.pdcSummaryDTO.ifscCode",
                                    "title": "IFSC_CODE"
                                },
                                {
                                    "key": "pdc.pdcSummaryDTO.bankName",
                                    "title": "BANK_NAME",
                                    "readonly":true
                                },
                                {
                                    "key": "pdc.pdcSummaryDTO.numberOfCheque",
                                    "title": "NUMBER_OF_CHEQUE",
                                    "readonly":true
                                },
                                {
                                    "key": "pdc.pdcSummaryDTO.branchName",
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
                                    "type": "fieldset",
                                    "title": "CHEQUE_LEAVES",
                                    "items": [{
                                        "type":"array",
                                        "key":"pdc.chequeDetails",
                                        "add": null,
                                        "startEmpty": true,
                                        "title":"CHECK_DETAILS",
                                        "titleExpr": "model.pdc.chequeDetails[arrayIndex].bankName + ' - ' + model.pdc.chequeDetails[arrayIndex].chequeNo",
                                        "items":[{
                                                "key": "pdc.chequeDetails[].bankName",
                                                "title": "BANK_NAME",
                                                "readonly": true
                                            },
                                            {
                                                "key": "pdc.chequeDetails[].ifscCode",
                                                "title": "IFSC_CODE"
                                            },
                                            {
                                                "key": "pdc.chequeDetails[].chequeNo",
                                                "title": "CHEQUE_NUMBER"
                                            }]
                                    },]
                                },
                                {
                                    "type":"array",
                                    "key":"pdc.addCheque",
                                    "view": "fixed",
                                    "startEmpty": true,
                                    "title":"CHECK_DETAILS",
                                    "items":[{
                                            "key": "pdc.addCheque[].bankName",
                                            "title": "BANK_NAME"
                                        },
                                        {
                                            "key": "pdc.addCheque[].ifscCode",
                                            "title": "IFSC_CODE"
                                        },
                                        {
                                            "key": "pdc.addCheque[].checkStartNo",
                                            "title": "CHECK_START_NUMBER",
                                            "type": "Number"
                                        },
                                        {
                                            "key": "pdc.addCheque[].noOfLeaves",
                                            "title": "NUMBER_OF_LEAVES",
                                            "type": "Number"
                                        }]
                                }]
                            }
                        ]
                },
            {
                    "type": "actionbox",
                    "condition":"!model.pdc.id",
                    "items": [{
                        "type": "submit",
                        "title": "Submit",
                              }]
                },
                {
                    "type": "actionbox",
                    "condition":"model.pdc.id",
                    "items": [{
                        "type": "submit",
                        "title": "Update",
                              }]
                }],
        schema: function() {
            return PDC.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                $log.info("Inside submit()");
                //bankCount is the no. of banks added in "pdc.addCheque" array
                model.pdc.chequeDetails = model.pdc.chequeDetails || [];
                for (var bankCount = 0; bankCount < model.pdc.addCheque.length; bankCount++) {
                    $log.info("bank no : " + bankCount);
                    //leavesCount is the no. of leaves in each bank array added in "pdc.addCheque" array
                    for (var leavesCount = 0; leavesCount < model.pdc.addCheque[bankCount].noOfLeaves; leavesCount++) {
                        $log.info("Leaves No.: " + leavesCount);
                        $log.info("Cheque No.: " + ( model.pdc.addCheque[bankCount].checkStartNo + leavesCount));
                        var currentLeafNo = model.pdc.addCheque[bankCount].checkStartNo + leavesCount;
                        model.pdc.chequeDetails.push({
                            bankName: model.pdc.addCheque[bankCount].bankName,
                            ifscCode: model.pdc.addCheque[bankCount].ifscCode,
                            chequeNo: currentLeafNo
                        });
                    }
                }
                model.pdc.addCheque = [];
                PageHelper.showLoader();
                // if (model.pdc.id) {
                //     PDC.update(model.pdc, function(response){
                //         PageHelper.hideLoader();
                //         model.pdc=Utils.removeNulls(model.pdc,true);
                //     }, function(errorResponse){
                //         PageHelper.hideLoader();
                //         PageHelper.showErrors(errorResponse);
                //     });
                // } else {
                    $log.info("Inside Create()");
                    PDC.create(model.pdc, function(response){
                        PageHelper.hideLoader();
                        model.pdc=response;
                    }, function(errorResponse){
                        PageHelper.hideLoader();
                        PageHelper.showErrors(errorResponse);
                    });
                //}
                /*$state.go("Page.Engine", {
                    pageName: 'IndividualLoanBookingConfirmation',
                    pageId: model.customer.id
                });*/
            }
        }
    };
}]);