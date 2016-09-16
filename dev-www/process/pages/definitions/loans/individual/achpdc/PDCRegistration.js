irf.pageCollection.factory(irf.page("loans.individual.achpdc.PDCRegistration"),
["$log", "PDC", "PageHelper", "SessionStore","$state", "CustomerBankBranch", 'formHelper', "$stateParams", 
function($log, PDC, PageHelper, SessionStore,$state,CustomerBankBranch,formHelper,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "PDC_REGISTRATION",
        "subTitle": "",

        initialize: function (model, form, formCtrl) {
            $log.info("PDC selection Page got initialized");
            model.pdc = model.pdc||{};
            //model.pdc.chequeDetails = model.pdc.chequeDetails||[];
            model.pdcGet = model.pdcGet||{};
            model.flag = false;//false if PDC.get({accountId: model._pdc.loanId} fails (No date available), else update
         
            if (model._pdc ) {      
                model.pdc.accountId = model._pdc.accountNumber;
                model.pdc.loanAccountNo = model._pdc.accountNumber;
                model.pdc.branchName = model._pdc.branchName;
                model.pdc.customerName = model._pdc.customerName;
                PageHelper.showLoader();
                PDC.get({accountNumber: model.pdc.accountId},
                    function(res){
                        model.pdcGet = Utils.removeNulls(res,true);
                        PageHelper.hideLoader();
                        PageHelper.showProgress("page-init","Done.",2000);
                        model.pdc = model.pdcGet;
                        model.pdc.addCheque = model.pdc.pdcSummaryDTO;
                        $log.info("PDC GET RESP. : "+res);
                        model.flag = true;
                    },
                    function(res){
                        PageHelper.hideLoader();
                        model.flag = false;
                        $log.info("PDC GET Error : "+res);  
                    }
                );
            } 
            else {
                $state.go("Page.Engine",{
                    pageName:"loans.individual.Queue",
                    pageId:null
                });
            }
        },
        offline: false,

        getOfflineDisplayItem: function(item, index){
            
        },

        form: [
            {
                "type": "box",
                "notitle": true ,
                "colClass":"col-sm-8",
                "items": [
                    {
                        "type":"fieldset",
                        "title": "LOAN_DETAILS",
                        "items":[
                            {
                                "key": "pdc.loanAccountNo",
                                "title": "LOAN_ACCOUNT_NUMBER",
                                "readonly":true
                            },
                            {
                                "key": "pdc.branchName",
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
                            }
                        ]
                    },
                    {
                        "type":"fieldset",
                        "title": "SECURITY_CHEQUE",
                        "items":[
                            // {
                            //     "key": "pdc.bankAccountNo",
                            //     "title": "BANK_ACCOUNT_NUMBER"
                            // },
                            // {
                            //     "key": "pdc.securityCheckNo",
                            //     "title": "SECURITY_CHEQUE_NO"
                            // },
                            // {
                            //     "key": "pdc.chequeNoFrom",
                            //     "title": "CHEQUE_NUMBER_FROM"
                            // },
                            // {
                            //     "key": "pdc.chequeType",
                            //     "title": "CHEQUE_TYPE"
                            // },
                            {
                                "key": "pdc.customerBankAccountNo",
                                "title": "CUSTOMER_BANK_ACCOUNT_NUMBER"
                            }
                            // {
                            //     "key": "pdc.ifscCode",
                            //     "title": "IFSC_CODE"
                            // },
                            // {
                            //     "key": "pdc.bankName",
                            //     "title": "BANK_NAME",
                            //     "readonly":true
                            // },
                            // {
                            //     "key": "pdc.numberOfCheque",
                            //     "title": "NUMBER_OF_CHEQUE"
                            // }
                        ]
                    },
                    {
                        "type":"fieldset",
                        "title":"PDC_DETAILS",
                        "items":[
                            {
                                "key": "pdc.firstInstallmentDate",
                                "title": "FIRST_INSTALMENT_DATE",
                                "type": "date"
                            },
                            // {
                            //     "type": "fieldset",
                            //     "title": "CHEQUE_LEAVES",
                            //     "items": [{
                            //         "type":"array",
                            //         "key":"pdc.chequeDetails",
                            //         "add": null,
                            //         "startEmpty": true,
                            //         "title":"CHEQUE_DETAILS",
                            //         "titleExpr": "model.pdc.chequeDetails[arrayIndex].bankName + ' - ' + model.pdc.chequeDetails[arrayIndex].chequeNo",
                            //         "items":[{
                            //                 "key": "pdc.chequeDetails[].bankName",
                            //                 "title": "BANK_NAME",
                            //                 "readonly": true
                            //             },
                            //             {
                            //                 "key": "pdc.chequeDetails[].ifscCode",
                            //                 "title": "IFSC_CODE",
                            //                 "type": "lov",
                            //                 "inputMap": {
                            //                     "ifscCode": {
                            //                         "key": "ifscCode",
                            //                         "title": "IFSC_CODE"
                            //                     }
                            //                 }
                            //             },
                            //             {
                            //                 "key": "pdc.chequeDetails[].chequeNo",
                            //                 "title": "CHEQUE_NUMBER"
                            //             }]
                            //     }]
                            // },
                            {
                                "type":"array",
                                "key":"pdc.addCheque",
                                "view": "fixed",
                                "startEmpty": true,
                                "title":"CHEQUE_DETAILS",
                                "items":[
                                    {
                                        "key": "pdc.addCheque[].bankAccountNo",
                                        "title": "BANK_ACCOUNT_NUMBER"
                                    },
                                    {
                                        "key": "ach.ifscCode",
                                        "title": "IFSC_CODE",
                                        "type": "lov",
                                        "inputMap": {
                                            "ifscCode": {
                                                "key": "ifscCode",
                                                "title": "IFSC_CODE"
                                            }
                                        }
                                    },
                                    // {
                                    //     "key": "pdc.addCheque[].ifscCode",
                                    //     "title": "IFSC_CODE",
                                    //     "type": "lov",
                                    //     "lovonly": true,
                                    //     "inputMap": {
                                    //         "ifscCode": {
                                    //             "key": "pdc.addCheque[].ifscCode"
                                    //         },
                                    //         "bankName": {
                                    //             "key": "pdc.addCheque[].bankName"
                                    //         },
                                    //         "branchName": {
                                    //             "key": "pdc.addCheque[].branchName"
                                    //         }
                                    //     },

                                    //     outputMap: {
                                    //         "bankName": "pdc.addCheque[arrayIndex].bankName",
                                    //         "branchName": "pdc.addCheque[arrayIndex].branchName",
                                    //         "ifscCode": "pdc.addCheque[arrayIndex].ifscCode"
                                    //     },

                                    //     searchHelper: formHelper,
                                    //     search: function(inputModel, form) {
                                    //         $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    //         var promise = CustomerBankBranch.search({
                                    //             'bankName': inputModel.bankName,
                                    //             'ifscCode': inputModel.ifscCode,
                                    //             'branchName': inputModel.branchName
                                    //         }).$promise;
                                    //         return promise;
                                    //     },

                                    //     getListDisplayItem: function(data, index) {
                                    //         return [
                                    //             data.ifscCode,
                                    //             data.branchName,
                                    //             data.bankName
                                    //         ];
                                    //     }
                        

                                    // },
                                    {
                                        "key": "pdc.addCheque[].bankName",
                                        "title": "BANK_NAME"
                                    },
                                    {
                                        "key": "pdc.addCheque[].branchName",
                                        "title": "BRANCH_NAME"
                                    },
                                    {
                                        "key": "pdc.addCheque[].chequeNoFrom",
                                        "title": "CHEQUE_NUMBER_FROM",
                                        "type": "Number"
                                    },
                                    {
                                        "key": "pdc.addCheque[].chequeType",
                                        "title": "CHEQUE_TYPE",
                                        "type": "select",
                                        "enumCode": "pdc_cheque_type"
                                    },
                                    {
                                        "key": "pdc.addCheque[].numberOfCheque",
                                        "title": "NUMBER_OF_CHEQUE",
                                        "type": "Number"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type": "actionbox",
                "condition":"!model.flag",
                "items": [
                    {
                        "type": "submit",
                        "title": "SUBMIT",
                              
                    }
                ]
            },
            {
                "type": "actionbox",
                "condition":"model.flag",
                "items": [
                    {
                        "type": "submit",
                        "title": "UPDATE",
                    }
                ]
            }
        ],

        schema: function() {
            return PDC.getSchema().$promise;
        },

        actions: {
            submit: function(model, form, formName){
                $log.info("Inside submit()");
                //bankCount is the no. of banks added in "pdc.addCheque" array
                //model.pdc.chequeDetails = model.pdc.chequeDetails || [];
                model.pdc.pdcSummaryDTO = [];

                for (var bankCount = 0; bankCount < model.pdc.addCheque.length; bankCount++) {
                    model.pdc.pdcSummaryDTO.push({
                        bankAccountNo: model.pdc.addCheque[bankCount].bankAccountNo,
                        bankName: model.pdc.addCheque[bankCount].bankName,
                        ifscCode: model.pdc.addCheque[bankCount].ifscCode,
                        chequeNoFrom: model.pdc.addCheque[bankCount].chequeNoFrom,
                        chequeType: model.pdc.addCheque[bankCount].chequeType,
                        numberOfCheque: model.pdc.addCheque[bankCount].numberOfCheque,
                        customerBankAccountNo: model.pdc.customerBankAccountNo,
                        loanAccountNo: model._pdc.accountNumber,
                        branchName: model.pdc.addCheque[bankCount].branchName,
                        id: model._pdc.loanId
                    });

                    //$log.info("bank no : " + bankCount);
                    //leavesCount is the no. of leaves in each bank array added in "pdc.addCheque" array
                    // for (var leavesCount = 0; leavesCount < model.pdc.addCheque[bankCount].noOfLeaves; leavesCount++) {
                    //     $log.info("Leaves No.: " + leavesCount);
                    //     $log.info("Cheque No.: " + ( model.pdc.addCheque[bankCount].chequeStartNo + leavesCount));
                    //     var currentLeafNo = model.pdc.addCheque[bankCount].chequeStartNo + leavesCount;
                    //     model.pdc.chequeDetails.push({
                    //         bankName: model.pdc.addCheque[bankCount].bankName,
                    //         ifscCode: model.pdc.addCheque[bankCount].ifscCode,
                    //         chequeNo: currentLeafNo
                    //     });
                    // }
                }

                //model.pdc.addCheque = [];
                PageHelper.showLoader();

                if (model.flag) {
                    PDC.update(model.pdc, function(response){
                        PageHelper.hideLoader();

                    }, function(errorResponse){
                        PageHelper.hideLoader();
                        PageHelper.showErrors(errorResponse);
                    });
                }
                else {
                    $log.info("Inside Create()");
                    PDC.create(model.pdc.pdcSummaryDTO, function(response){
                        PageHelper.hideLoader();
                        model.flag = true;
                    }, function(errorResponse){
                        PageHelper.hideLoader();
                        PageHelper.showErrors(errorResponse);
                    });
                }
                /*$state.go("Page.Engine", {
                    pageName: 'IndividualLoanBookingConfirmation',
                    pageId: model.customer.accountId
                });*/
            }
        }
    };
}]);