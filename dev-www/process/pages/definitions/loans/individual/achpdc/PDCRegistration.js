/*
About PDCRegistration.js
------------------------
To register or update PDC loan id. If the user exist, the Update module is called
else the create field is called. 
The search API is called in iniialize to identify if loan account number exist. If exist, the details are obtained
and filled in the screen.
    
Methods
-------
Initialize : To decare the required model variables.
submit : To submit the created/updated ACH

Services
--------
PDC.getPDCCheque({accountNumber: model.pdc.accountId} : Search for existance of "PDC" Cheque types
PDC.getSecurityCheque({accountNumber: model.pdc.accountId} : Search for existance of "SECURITY" Cheque types
PDC.create : TO carete a new PDC account
PDC.update : TO update an existing PDC account
*/
irf.pageCollection.factory(irf.page("loans.individual.achpdc.PDCRegistration"),
["$log", "PDC", "PageHelper", "SessionStore","$state", "CustomerBankBranch", 'formHelper', "$stateParams", "CustomerBankBranch",
function($log, PDC, PageHelper, SessionStore,$state,CustomerBankBranch,formHelper,$stateParams,CustomerBankBranch){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "PDC_REGISTRATION",
        "subTitle": "",

        initialize: function (model, form, formCtrl) {
            $log.info("PDC selection Page got initialized");
            model.pdc = model.pdc||{};
            model.pdc.addCheque = model.pdc.addCheque || [];
            model.pdc.existingCheque = model.pdc.existingCheque || [];
            //model to store pdc cheque types
            model.pdcGetPDCType = model.pdcGetPDCType || {};
            model.pdcGetPDCType.pdcSummaryDTO = model.pdcGetPDCType.pdcSummaryDTO || [];
            //model to store security cheque types
            model.pdcGetSecurityType = model.pdcGetSecurityType || [];
            //model to store indevidual cheques
            model.pdc.chequeDetails = model.pdc.chequeDetails || [];
            //model to check if the creating pdc number already exist
            model.pdcNumberMatch = model.pdcNumberMatch || [];
            model.pdcChequeMatch = model.pdcChequeMatch || []; 
            //false if PDC.get({accountId: model._pdc.loanId} fails (No date available), else update
            model.flag = false;

            if (model._pdc ) {      
                model.pdc.accountId = model._pdc.accountNumber;
                model.pdc.loanAccountNo = model._pdc.accountNumber;
                model.pdc.branchName = model._pdc.branchName;
                model.pdc.customerName = model._pdc.customerName;
                PageHelper.clearErrors();
                PageHelper.showLoader();
                PDC.getPDCCheque({accountNumber: model.pdc.accountId}).$promise.then(function(res){
                        model.pdcGetPDCType = res;
                        PageHelper.showProgress("page-init","Done.",2000);
                        $log.info("PDC Type PDC GET RESP. : "+res);
                        for (var i = 0; i < model.pdcGetPDCType.body.pdcSummaryDTO.length; i++) {
                            if(model.pdc.accountId == model.pdcGetPDCType.body.pdcSummaryDTO[i].loanAccountNo) {

                                model.pdc.existingCheque.loanAccountNo = model.pdcGetPDCType.body.pdcSummaryDTO[i].accountNumber;
                                model.pdc.existingCheque.id = model.pdcGetPDCType.body.pdcSummaryDTO[i].loanId;
                                model.pdc.customerBankAccountNo = model.pdcGetPDCType.body.pdcSummaryDTO[i].customerBankAccountNo;
                                model.pdc.existingCheque.push(model.pdcGetPDCType.body.pdcSummaryDTO[i]);
                            }
                        }

                        for (var i = 0; i < model.pdcGetPDCType.body.pdcSummaryDTO.length; i++) {
                            if (model.pdcGetPDCType.body.pdcSummaryDTO[i].accountPDCWSDto)
                            {
                                for (var j = 0; j < model.pdcGetPDCType.body.pdcSummaryDTO[i].accountPDCWSDto.length; j++)
                                {
                                    model.pdc.chequeDetails.push(model.pdcGetPDCType.body.pdcSummaryDTO[i].accountPDCWSDto[j]);   
                                }
                            }
                        }
                        if(model.pdcGetPDCType.body.pdcSummaryDTO.length > 0)
                            model.flag = true;
                    },
                    function(resError){
                        $log.info("PDC GET Error : "+resError);  
                    }
                ).finally(function(){
                    PageHelper.hideLoader();
                });

                // PDC.getSecurityCheque().$promise.then(function(res){
                //     model.pdcGetSecurityType = res;
                //     PageHelper.showProgress("page-init","Done.",2000);
                //     $log.info("Security Type PDC GET RESP. : "+res);

                //     for (var i = 0; i < model.pdcGetSecurityType.body.length; i++) {
                //         if(model.pdc.accountId == model.pdcGetSecurityType.body[i].loanAccountNo) {
                //             model.pdc.existingCheque.push(model.pdcGetSecurityType.body[i]);
                //             model.pdc.customerBankAccountNo = model.pdcGetSecurityType.body[i].customerBankAccountNo;
                //             model.flag = true; 
                //         }
                //     }
                // },
                // function(resError){
                //     $log.info("PDC GET Error : "+resError);  
                // }).finally(function(){
                //     PageHelper.hideLoader();
                // });
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
                        "title": "BANK_ACCOUNT_NUMBER",
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
                            // {
                            //     "key": "pdc.firstInstallmentDate",
                            //     "title": "FIRST_INSTALMENT_DATE",
                            //     "type": "date"
                            // },
                            {
                                "type": "fieldset",
                                "title": "CHEQUE_LEAVES",
                                "items": [{
                                    "type":"array",
                                    "key":"pdc.chequeDetails",
                                    "add": null,
                                    "startEmpty": true,
                                    "remove":null,
                                    "title":"CHEQUE_DETAILS",
                                    "titleExpr": "model.pdc.chequeDetails[arrayIndex].chequeNo + ' - ' + model.pdc.chequeDetails[arrayIndex].pdcNum",
                                    "items":[
                                        {
                                            "key": "pdc.chequeDetails[].chequeNo",
                                            "title": "CHEQUE_NUMBER",
                                            "readonly": true
                                        },{
                                            "key": "pdc.chequeDetails[].bankAccountNo",
                                            "title": "BANK_ACCOUNT_NUMBER",
                                            "readonly": true
                                        },
                                        {
                                            "key": "pdc.chequeDetails[].amount",
                                            "title": "AMOUNT",
                                            "type": "string",
                                            "readonly": true
                                        },
                                        {
                                            "key": "pdc.chequeDetails[].chequeDate",
                                            "title": "CHEQUE_DATE",
                                            "readonly": true
                                        },
                                        {
                                            "key": "pdc.chequeDetails[].pdcNum",
                                            "title": "PDC_NUMBER",
                                            "readonly": true
                                        }]
                                }]
                            },
                            {
                                "type":"array",
                                "key":"pdc.existingCheque",
                                "startEmpty": true,
                                "add":null,
                                "remove":null,
                                "condition": "model.flag",
                                "title":"CHEQUE_DETAILS",
                                "titleExpr":"model.pdc.existingCheque[arrayIndex].chequeType + ' - ' + model.pdc.existingCheque[arrayIndex].chequeNoFrom + ' - ' + model.pdc.existingCheque[arrayIndex].numberOfCheque",
                                "items":[
                                    {
                                        "key": "pdc.existingCheque[].bankAccountNo",
                                        "title": "BANK_ACCOUNT_NUMBER",
                                        "readonly": true
                                    },
                                    {
                                        "key": "pdc.existingCheque[].ifscCode",
                                        "title": "IFSC_CODE",
                                        "type": "string",
                                        "readonly": true

                                    },
                                    {
                                        "key": "pdc.existingCheque[].bankName",
                                        "title": "BANK_NAME",
                                        "readonly": true
                                    },
                                    {
                                        "key": "pdc.existingCheque[].branchName",
                                        "title": "BRANCH_NAME",
                                        "readonly": true
                                    },
                                    {
                                        "key": "pdc.existingCheque[].chequeType",
                                        "title": "CHEQUE_TYPE",
                                        "readonly": true
                                    },
                                    {
                                        "key": "pdc.existingCheque[].chequeNoFrom",
                                        "title": "CHEQUE_START_NUMBER",
                                        "type": "Number"
                                    },
                                    {
                                        "key": "pdc.existingCheque[].numberOfCheque",
                                        "title": "NUMBER_OF_CHEQUE",
                                        "type": "Number"
                                    },
                                    {
                                        "key": "pdc.existingCheque[].pdcFrom",
                                        "title": "PDC_FROM",
                                        "type": "Number"
                                    }
                                ]
                            },
                            {
                                "type":"array",
                                "key":"pdc.addCheque",
                                "startEmpty": true,
                                "title":"ADD_CHEQUE_DETAILS",
                                "items":[
                                    {
                                        "key": "pdc.addCheque[].bankAccountNo",
                                        "title": "BANK_ACCOUNT_NUMBER"
                                    },
                                    {
                                        "key": "pdc.addCheque[].ifscCode",
                                        "title": "IFSC_CODE",
                                        "type": "lov",
                                        "lovonly": true,
                                        "inputMap": {
                                            "ifscCode": {
                                                "key": "pdc.addCheque[].ifscCode"
                                            },
                                            "bankName": {
                                                "key": "pdc.addCheque[].bankName"
                                            },
                                            "branchName": {
                                                "key": "pdc.addCheque[].branchName"
                                            }
                                        },

                                        outputMap: {
                                            "bankName": "pdc.addCheque[arrayIndex].bankName",
                                            "branchName": "pdc.addCheque[arrayIndex].branchName",
                                            "ifscCode": "pdc.addCheque[arrayIndex].ifscCode"
                                        },

                                        searchHelper: formHelper,
                                        search: function(inputModel, form) {
                                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                            var promise = CustomerBankBranch.search({
                                                'bankName': inputModel.bankName,
                                                'ifscCode': inputModel.ifscCode,
                                                'branchName': inputModel.branchName
                                            }).$promise;
                                            return promise;
                                        },

                                        getListDisplayItem: function(data, index) {
                                            return [
                                                data.ifscCode,
                                                data.branchName,
                                                data.bankName
                                            ];
                                        }
                        

                                    },
                                    {
                                        "key": "pdc.addCheque[].bankName",
                                        "title": "BANK_NAME",
                                        "readonly": true
                                    },
                                    {
                                        "key": "pdc.addCheque[].branchName",
                                        "title": "BRANCH_NAME",
                                        "readonly": true
                                    },
                                    {
                                        "key": "pdc.addCheque[].chequeType",
                                        "title": "CHEQUE_TYPE",
                                        "type": "select",
                                        "enumCode": "pdc_cheque_type"
                                    },
                                    {
                                        "key": "pdc.addCheque[].chequeNoFrom",
                                        "title": "CHEQUE_START_NUMBER",
                                        "type": "Number"
                                    },
                                    {
                                        "key": "pdc.addCheque[].numberOfCheque",
                                        "title": "NUMBER_OF_CHEQUE",
                                        "type": "Number"
                                    },
                                    {
                                        "key": "pdc.addCheque[].pdcFrom",
                                        "title": "PDC_FROM",
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
                model.pdc.pdcSummaryDTO
                //add the newly addeed cheque details
                model.pdcNumberMatch = [];
                model.pdcChequeMatch = [];
                //check for the existance of PDC Number 
                for( var i = 0; i < model.pdc.chequeDetails.length ; i++){
                    for( var j = 0; j < model.pdc.addCheque.length ; j++){
                        for( var k = model.pdc.addCheque[j].pdcFrom; k < (model.pdc.addCheque[j].pdcFrom + model.pdc.addCheque[j].numberOfCheque) ; k++){
                            if(model.pdc.chequeDetails[i].pdcNum == k){
                                model.pdcNumberMatch.push(model.pdc.chequeDetails[i].pdcNum);
                            }
                       }
                    }
                }
                //Check for the existance of the cheque number
                for( var i = 0; i < model.pdc.chequeDetails.length ; i++){
                    for( var j = 0; j < model.pdc.addCheque.length ; j++){
                        for( var k = model.pdc.addCheque[j].chequeNoFrom; k < (model.pdc.addCheque[j].chequeNoFrom + model.pdc.addCheque[j].numberOfCheque) ; k++){
                            if(model.pdc.chequeDetails[i].chequeNo == k){
                                model.pdcChequeMatch.push(model.pdc.chequeDetails[i].chequeNo);
                            }
                       }
                    }
                } 

                if(model.pdcChequeMatch > 0 && model.pdcNumberMatch.length > 0)
                {
                    alert('1. The Following CHEQUE Numbers already exist: \n' + model.pdcChequeMatch.join(", ")+'\n'
                        +'2. The Following PDC Numbers already exist: \n' + model.pdcNumberMatch.join(", "))
                }else if( model.pdcChequeMatch.length > 0)
                {
                    alert('1. The Following CHEQUE Numbers already exist: \n' + model.pdcChequeMatch.join(", ")+'\n')
                }else if(model.pdcNumberMatch.length > 0 )
                {
                    
                    var confirmUpdate = confirm('The Following PDC Numbers already exist: \n' 
                        + model.pdcNumberMatch.join(", ") + "\nWould you like to replace them");
                    if (confirmUpdate == true) {
                        var confirmUpdateAgain = confirm('Are you sure?');
                        if(confirmUpdateAgain == true)
                        {
                            for (var bankCount = 0; bankCount < model.pdc.addCheque.length; bankCount++)
                            {
                                model.pdc.addCheque[bankCount].loanAccountNo = model.pdc.loanAccountNo;
                                model.pdc.addCheque[bankCount].id = model.pdc.id;
                                model.pdc.addCheque[bankCount].customerBankAccountNo = model.pdc.customerBankAccountNo;

                                if (model.pdc.addCheque[bankCount].chequeType == "PDC")
                                {
                                    model.pdc.addCheque[bankCount].branchName = model.pdc.branchName;
                                } 

                            }

                            //model.pdc.existingCheque = [];
                            PageHelper.clearErrors();
                            PageHelper.showLoader();

                            if (model.flag) {
                                PDC.update(model.pdc.addCheque, function(response){
                                    PageHelper.hideLoader();

                                }, function(errorResponse){
                                    PageHelper.hideLoader();
                                    PageHelper.showErrors(errorResponse);
                                });
                            }
                            else {
                                $log.info("Inside Create()");
                                PDC.create(model.pdc.addCheque, function(response){
                                    PageHelper.hideLoader();
                                    model.flag = true;
                                }, function(errorResponse){
                                    PageHelper.hideLoader();
                                    PageHelper.showErrors(errorResponse);
                                });
                            }
                        }
                    }
                } else {
                    for (var bankCount = 0; bankCount < model.pdc.addCheque.length; bankCount++)
                        {
                            model.pdc.addCheque[bankCount].loanAccountNo = model.pdc.loanAccountNo;
                            model.pdc.addCheque[bankCount].id = model.pdc.id;
                            model.pdc.addCheque[bankCount].customerBankAccountNo = model.pdc.customerBankAccountNo;

                            if (model.pdc.addCheque[bankCount].chequeType == "PDC")
                            {
                                model.pdc.addCheque[bankCount].branchName = model.pdc.branchName;
                            } 

                        }
                    if (model.flag) {
                        PDC.update(model.pdc.addCheque, function(response){
                            PageHelper.hideLoader();

                        }, function(errorResponse){
                            PageHelper.hideLoader();
                            PageHelper.showErrors(errorResponse);
                        });
                    }
                    else {
                        $log.info("Inside Create()");
                        PDC.create(model.pdc.addCheque, function(response){
                            PageHelper.hideLoader();
                            model.flag = true;
                        }, function(errorResponse){
                            PageHelper.hideLoader();
                            PageHelper.showErrors(errorResponse);
                        });
                    }
                }
            }
        }


        // actions: {
        //     submit: function(model, form, formName){
        //         $log.info("Inside submit()");
        //         //bankCount is the no. of banks added in "pdc.existingCheque" array
        //         //model.pdc.chequeDetails = model.pdc.chequeDetails || [];

        //         model.pdc.pdcSummaryDTO
                

        //         //model.pdc.pdcSummaryDTO = [];
        //         //Add existing cheque details
        //         // for (var bankCount = 0; bankCount < model.pdc.existingCheque.length; bankCount++) {
        //         //     model.pdc.pdcSummaryDTO.push(model.pdc.existingCheque[bankCount]);
        //         //     //$log.info("bank no : " + bankCount);
        //         //     //leavesCount is the no. of leaves in each bank array added in "pdc.existingCheque" array
        //         //     // for (var leavesCount = 0; leavesCount < model.pdc.existingCheque[bankCount].noOfLeaves; leavesCount++) {
        //         //     //     $log.info("Leaves No.: " + leavesCount);
        //         //     //     $log.info("Cheque No.: " + ( model.pdc.existingCheque[bankCount].chequeStartNo + leavesCount));
        //         //     //     var currentLeafNo = model.pdc.existingCheque[bankCount].chequeStartNo + leavesCount;
        //         //     //     model.pdc.chequeDetails.push({
        //         //     //         bankName: model.pdc.existingCheque[bankCount].bankName,
        //         //     //         ifscCode: model.pdc.existingCheque[bankCount].ifscCode,
        //         //     //         chequeNo: currentLeafNo
        //         //     //     });
        //         //     // }
        //         // }

        //         //add the newly addeed cheque details
        //         for (var bankCount = 0; bankCount < model.pdc.addCheque.length; bankCount++)
        //         {
        //             model.pdc.addCheque[bankCount].loanAccountNo = model.pdc.loanAccountNo;
        //             model.pdc.addCheque[bankCount].id = model.pdc.id;
        //             model.pdc.addCheque[bankCount].customerBankAccountNo = model.pdc.customerBankAccountNo;

        //             if (model.pdc.addCheque[bankCount].chequeType == "PDC")
        //             {
        //                 model.pdc.addCheque[bankCount].pdcFrom = 1;
        //                 model.pdc.addCheque[bankCount].branchName = model.pdc.branchName;
        //                // model.pdc.pdcSummaryDTO.push(model.pdc.addCheque[bankCount]);
        //             } 
        //             // else {
        //             //     model.pdc.pdcSummaryDTO.push(model.pdc.addCheque[bankCount]);
        //             // }  
        //         }

        //         //model.pdc.existingCheque = [];
        //         PageHelper.clearErrors();
        //         PageHelper.showLoader();

        //         if (model.flag) {
        //             PDC.update(model.pdc.addCheque, function(response){
        //                 PageHelper.hideLoader();

        //             }, function(errorResponse){
        //                 PageHelper.hideLoader();
        //                 PageHelper.showErrors(errorResponse);
        //             });
        //         }
        //         else {
        //             $log.info("Inside Create()");
        //             PDC.create(model.pdc.addCheque, function(response){
        //                 PageHelper.hideLoader();
        //                 model.flag = true;
        //             }, function(errorResponse){
        //                 PageHelper.hideLoader();
        //                 PageHelper.showErrors(errorResponse);
        //             });
        //         }
        //         /*$state.go("Page.Engine", {
        //             pageName: 'IndividualLoanBookingConfirmation',
        //             pageId: model.customer.accountId
        //         });*/
        //     }
        // }
    };
}]);