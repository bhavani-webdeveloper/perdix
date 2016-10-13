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
irf.pageCollection.factory(irf.page("loans.individual.achpdc.PDCRegistration"), ["$log", "PDC", "PageHelper", "IndividualLoan", "SessionStore", "$state", "CustomerBankBranch", 'formHelper', "$stateParams", "CustomerBankBranch", "LoanAccount", "Queries", "Utils",
    function($log, PDC, PageHelper, IndividualLoan, SessionStore, $state, CustomerBankBranch, formHelper, $stateParams, CustomerBankBranch, LoanAccount, Queries, Utils) {

        var branch = SessionStore.getBranch();
        var urnSearch = [];

        return {
            "type": "schema-form",
            "title": "PDC_REGISTRATION",
            "subTitle": "",

            initialize: function(model, form, formCtrl) {
                $log.info("PDC selection Page got initialized");
                model.pdc = model.pdc || {};
                //model to add new cheque details
                model.pdc.addCheque = model.pdc.addCheque || [];

                //model to view to existing cheque details
                model.pdc.existingPDCCheque = model.pdc.existingPDCCheque || [];
                model.pdc.existingSecurityCheque = model.pdc.existingSecurityCheque || [];
                model.pdc.totalCheques = model.pdc.totalCheques || [];
                model.pdc.cancelledSecurityCheque= model.pdc.cancelledSecurityCheque || [];

                //model to store pdc cheque types from PDC.getPDCCheque api
                model.pdcGetPDCType = model.pdcGetPDCType || {};
                model.pdcGetPDCType.pdcSummaryDTO = model.pdcGetPDCType.pdcSummaryDTO || [];

                model.pdcIndividualLoanSearch = model.pdcIndividualLoanSearch || [];


                //model to store individual cheques details from accountPDCWSDto array in PDC.getPDCCheque api
                model.pdc.pdcChequeDetails = model.pdc.pdcChequeDetails || [];
                model.pdc.securityChequeDetails = model.pdc.securityChequeDetails || [];
                //model to check if the creating pdc number already exist
                model.pdcNumberMatch = model.pdcNumberMatch || [];
                model.pdcChequeMatch = model.pdcChequeMatch || [];
                model.pdcChequeExceedLimit = model.pdcChequeExceedLimit || [];
                model.pdc.pdcFormMax = model.pdc.pdcFormMax || 0;
                model.repaymentLenght = model.repaymentLenght || 0;

                //false if PDC.get({accountId: model._pdc.loanId} fails (No date available), else update
                model.flag = false;
                model.confirmUpdate = false;
                model.confirmDelete = false;
                model.exceedCheque = false;
                model.isPDC = false;
                model.isSecurity = false;

                model.loanId = $stateParams.pageId;

                if ($stateParams.pageId || model._pdc) {

                    PageHelper.clearErrors();
                    PageHelper.showLoader();
                    console.log(formHelper.enum('branch_id'));

                    IndividualLoan.get({
                        id: $stateParams.pageId
                    }).$promise.then(
                        function(res) {
                            $log.info("response: " + res);
                            model.pdcIndividualLoanSearch = res;
                            model.pdc.loanAccountNo = model.pdcIndividualLoanSearch.accountNumber;
                            
                            model.pdc.customerName = model.pdcIndividualLoanSearch.customerId;
                            model.pdc.accountId = model.pdcIndividualLoanSearch.accountNumber;
                            model.pdc.centreId = model.pdcIndividualLoanSearch.loanCentre.centreId;
                            for (var i = 0; i < formHelper.enum('centre').data.length; i++) {
                                if (parseInt(formHelper.enum('centre').data[i].code) == parseInt(model.pdc.centreId)) {
                                    model.pdc.centreCode = formHelper.enum('centre').data[i].name;
                                }
                            }

                            for (var i = 0; i < formHelper.enum('branch_id').data.length; i++) {
                                if (parseInt(formHelper.enum('branch_id').data[i].code) == parseInt(model.pdcIndividualLoanSearch.branchId)) {
                                    model.pdc.branchName = formHelper.enum('branch_id').data[i].name;
                                    break;
                                }
                            }
                            if(model.pdcIndividualLoanSearch.applicant){
                            urnSearch.push(model.pdcIndividualLoanSearch.applicant)    
                            }
                            if(model.pdcIndividualLoanSearch.coBorrowerUrnNo){
                            urnSearch.push(model.pdcIndividualLoanSearch.coBorrowerUrnNo)    
                            }
                            if(model.pdcIndividualLoanSearch.urnNo){
                            urnSearch.push(model.pdcIndividualLoanSearch.urnNo)    
                            }
                             
                            Queries.getCustomerBasicDetails({
                                urns: urnSearch
                            }).then(
                                function(resQuery) {
                                    if(model.pdcIndividualLoanSearch.applicant){
                                        model.pdc.applicantName = resQuery.urns[model.pdcIndividualLoanSearch.applicant].first_name;    
                                    }
                                    if(model.pdcIndividualLoanSearch.urnNo){
                                        model.pdc.entityName = resQuery.urns[model.pdcIndividualLoanSearch.urnNo].first_name;    
                                    }
                                    
                                },
                                function(errQuery) {}
                            );
                            LoanAccount.get({
                                accountId: model.pdcIndividualLoanSearch.accountNumber
                            }).$promise.then(
                                function(response) {
                                    model.pdcLoanAccountSearch = response;
                                    if (model.pdcLoanAccountSearch.repaymentSchedule) {
                                        model.repaymentLenght = model.pdcLoanAccountSearch.repaymentSchedule.length
                                    }
                                },
                                function(error) {}
                            );

                            PDC.getSecurityCheque({
                                accountNumber: model.pdcIndividualLoanSearch.accountNumber
                            }).$promise.then(function(res) {
                                    model.pdcGetSecurityType = res;
                                    PageHelper.showProgress("page-init", "Done.", 2000);
                                    $log.info("PDC Type PDC GET RESP. : " + res);
                                    for (var i = 0; i < model.pdcGetSecurityType.body.length; i++) {
                                        if (model.pdc.accountId == model.pdcGetSecurityType.body[i].loanAccountNo) {
                                            model.pdc.securityChequeDetails.push(model.pdcGetSecurityType.body[i]);
                                        }
                                    }
                                    if (model.pdcGetSecurityType.body.length > 0){
                                        model.flag = true;                                        
                                    }

                                    for(var i =0 ; i < model.pdc.securityChequeDetails.length ; i++){
                                        model.pdc.securityChequeDetails[i].status = 'ACTIVE';
                                    }
                                },
                                function(resError) {
                                    $log.info("PDC GET Error : " + resError);
                                }
                            ).finally(function() {
                                PageHelper.hideLoader();
                            });



                            PDC.getPDCCheque({
                                accountNumber: model.pdcIndividualLoanSearch.accountNumber
                            }).$promise.then(function(res) {
                                    model.pdcGetPDCType = res;
                                    PageHelper.showProgress("page-init", "Done.", 2000);
                                    $log.info("PDC Type PDC GET RESP. : " + res);
                                    for (var i = 0; i < model.pdcGetPDCType.body.pdcSummaryDTO.length; i++) {
                                        if (model.pdc.accountId == model.pdcGetPDCType.body.pdcSummaryDTO[i].loanAccountNo) {

                                            // model.pdc.existingPDCCheque.loanAccountNo = model.pdcGetPDCType.body.pdcSummaryDTO[i].accountNumber;
                                            // model.pdc.existingPDCCheque.id = model.pdcGetPDCType.body.pdcSummaryDTO[i].loanId;
                                            // model.pdc.existingPDCCheque.push(model.pdcGetPDCType.body.pdcSummaryDTO[i]);
                                            if (model.pdcGetPDCType.body.pdcSummaryDTO[i].accountPDCWSDto) {
                                                for (var j = 0; j < model.pdcGetPDCType.body.pdcSummaryDTO[i].accountPDCWSDto.length; j++) {
                                                    $log.info(model.pdcGetPDCType.body.pdcSummaryDTO[i].accountPDCWSDto[j].pdcNum);
                                                    if (model.pdc.pdcFormMax < parseInt(model.pdcGetPDCType.body.pdcSummaryDTO[i].accountPDCWSDto[j].pdcNum)) {
                                                        model.pdc.pdcFormMax = parseInt(model.pdcGetPDCType.body.pdcSummaryDTO[i].accountPDCWSDto[j].pdcNum);
                                                    }
                                                    model.pdc.pdcChequeDetails.push(model.pdcGetPDCType.body.pdcSummaryDTO[i].accountPDCWSDto[j]);
                                                }
                                            }
                                        }
                                    }
                                    if (model.pdcGetPDCType.body.pdcSummaryDTO.length > 0)
                                        model.flag = true;

                                },
                                function(resError) {
                                    $log.info("PDC GET Error : " + resError);
                                }
                            ).finally(function() {
                                PageHelper.hideLoader();

                            });
                        },
                        function(httpRes) {
                            PageHelper.hideLoader();

                            // PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                            // PageHelper.showErrors(httpRes);
                            $log.info("ACH Search Response : " + httpRes);
                        }
                    );
                } else {
                    $state.go("Page.Engine", {
                        pageName: "loans.individual.Queue",
                        pageId: null
                    });
                }
            },
            offline: false,

            getOfflineDisplayItem: function(item, index) {

            },

            form: [{
                "type": "box",
                "notitle": true,
                "items": [{
                    "type": "fieldset",
                    "title": "LOAN_DETAILS",
                    "items": [{
                        "key": "pdc.loanAccountNo",
                        "title": "LOAN_ACCOUNT_NUMBER",
                        "readonly": true
                    }, {
                        "key": "pdc.branchName",
                        "title": "BRANCH_NAME",
                        "readonly": true
                    }, {
                        "key": "pdc.centreCode",
                        "title": "SPOKE",
                        "readonly": true
                    }, {
                        "key": "pdc.entityName",
                        "title": "ENTITY_NAME",
                        "readonly": true
                    }, {
                        "key": "pdc.applicantName",
                        "title": "APPLICANT_NAME",
                        "readonly": true
                    }]
                }, {
                    "type": "fieldset",
                    "title": "PDC_DETAILS",
                    "items": [{
                        "type": "array",
                        "key": "pdc.addCheque",
                        "startEmpty": true,
                        "title": "ADD_CHEQUE_DETAILS",
                        "items": [{
                        key: "pdc.addCheque[].customerBankAccountNo",
                        type: "lov",
                        autolov: true,
                        title: "CUSTOMER_BANK_ACCOUNT_NUMBER",
                        bindMap: {
                        },
                        outputMap: {
                            "account_number": "pdc.addCheque[arrayIndex].customerBankAccountNo",
                            "ifsc_code": "pdc.addCheque[arrayIndex].ifscCode"
                        },
                        onSelect: function(result, model, arg1){
                            CustomerBankBranch.search({
                                'ifscCode': result.ifsc_code
                            }).$promise.then(function(response)
                            {
                                if(response.body)
                                {
                                    model.pdc.addCheque[arg1.arrayIndex].bankName  = response.body[0].bankName;
                                    model.pdc.addCheque[arg1.arrayIndex].branchName  = response.body[0].branchName;
                                    model.pdc.addCheque[arg1.arrayIndex].micr  = response.body[0].micrCode;
                                }
                            },function(error)
                            {

                            });
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            var urn = [];
                            for(var i =0; i <model.pdcIndividualLoanSearch.loanCustomerRelations.length; i++)
                            {
                                urn.push(model.pdcIndividualLoanSearch.loanCustomerRelations[i].urn);   
                            }
                            urn.push(model.pdcIndividualLoanSearch.urnNo);
                            return Queries.getCustomersBankAccounts({
                               customer_urns : urn,
                               customer_ids : model.pdcIndividualLoanSearch.customerId
                            });
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                'Account Number : ' +item.account_number,
                                'Branch : ' + item.customer_bank_branch_name,
                                'Bank : ' + item.customer_bank_name,
                                'IFSC Code : ' + item.ifsc_code

                            ];
                        }
                    }, {
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


                        }, {
                            "key": "pdc.addCheque[].bankName",
                            "title": "BANK_NAME"
                        }, {
                            "key": "pdc.addCheque[].branchName",
                            "title": "BRANCH_NAME"
                        }, {
                            "key": "pdc.addCheque[].chequeType",
                            "title": "CHEQUE_TYPE",
                            "type": "select",
                            "enumCode": "pdc_cheque_type"
                        }, {
                            "key": "pdc.addCheque[].numberOfCheque",
                            "title": "NUMBER_OF_CHEQUE",
                            "type": "Number"
                        }, {
                            "key": "pdc.addCheque[].chequeNoFrom",
                            "title": "CHEQUE_START_NUMBER",
                            "type": "string",
                            "placeholder": "Enter 6 digit Cheque Number",
                        }, {
                            "key": "pdc.addCheque[].pdcFrom",
                            "title": "EMI_SEQUENCE_NUMBER",
                            "type": "Number",
                            "condition": "model.pdc.addCheque[arrayIndex].chequeType == 'PDC'"
                        }]
                    }, {
                        "type": "actionbox",
                        "condition": "!model.flag",
                        "items": [{
                            "type": "submit",
                            "title": "SUBMIT",

                        }]
                    }, {
                        "type": "actionbox",
                        "condition": "model.flag",
                        "items": [{
                            "type": "submit",
                            "title": "UPDATE",
                        }]
                    }]
                }]
            }, {
                "type": "box",
                "notitle": true,
                "items": [{
                    "type": "fieldset",
                    "title": "SECURITY_CHEQUE_DETAILS",
                    "items": [{
                        "type": "array",
                        "key": "pdc.securityChequeDetails",
                        "add": null,
                        "startEmpty": true,
                        "remove": null,
                        "title": "SECURITY_CHEQUE_DETAILS",
                        "titleExpr": "model.pdc.securityChequeDetails[arrayIndex].chequeNoFrom + ' - ' + model.pdc.securityChequeDetails[arrayIndex].numberOfCheque",
                        "items": [{
                            "key": "pdc.securityChequeDetails[].customerBankAccountNo",
                            "title": "BANK_ACCOUNT_NUMBER",
                            "readonly": true
                        }, {
                            "key": "pdc.securityChequeDetails[].chequeNoFrom",
                            "title": "CHEQUE_NUMBER_FROM",
                            "readonly": true
                        }, {
                            "key": "pdc.securityChequeDetails[].numberOfCheque",
                            "title": "NUMBER_OF_CHEQUE",
                            "readonly": true
                        }, {
                            "key": "pdc.securityChequeDetails[].bankName",
                            "title": "BANK_NAME",
                            "type": "string",
                            "readonly": true
                        }, {
                            "key": "pdc.securityChequeDetails[].ifscCode",
                            "title": "IFSC_CODE",
                            "readonly": true
                        },{
                            "key": "pdc.securityChequeDetails[].status",
                            "title": "CHEQUE_STATUS",
                            'required': true,
                            "type": "select",
                            "titleMap": {
                            "ACTIVE": "ACTIVE",
                            "CANCELLED": "CANCELLED"
                            }
                        }, {
                            "key": "pdc.securityChequeDetails[].rejectReason",
                            "title": "REJECTED_REASON",
                            "condition": "model.pdc.securityChequeDetails[arrayIndex].status == 'CANCELLED'",
                            "required": true
                        }]
                    }]
                }, {
                    "type": "fieldset",
                    "title": "PDC_CHEQUE_LEAVES",
                    "items": [{
                        "type": "array",
                        "key": "pdc.pdcChequeDetails",
                        "add": null,
                        "startEmpty": true,
                        "remove": null,
                        "title": "CHEQUE_DETAILS",
                        "titleExpr": "model.pdc.pdcChequeDetails[arrayIndex].chequeNo + ' - ' + model.pdc.pdcChequeDetails[arrayIndex].pdcNum",
                        "items": [{
                            "key": "pdc.pdcChequeDetails[].chequeNo",
                            "title": "CHEQUE_NUMBER",
                            "readonly": true
                        }, {
                            "key": "pdc.pdcChequeDetails[].amount",
                            "title": "AMOUNT",
                            "type": "string",
                            "readonly": true
                        }, {
                            "key": "pdc.pdcChequeDetails[].chequeDate",
                            "title": "CHEQUE_DATE",
                            "readonly": true
                        }, {
                            "key": "pdc.pdcChequeDetails[].pdcNum",
                            "title": "EMI_SEQUENCE_NUMBER",
                            "readonly": true
                        }]
                    }]
                }]
            }],

            schema: function() {
                return PDC.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {
                    $log.info("Inside submit()");
                    //add the newly addeed cheque details
                    model.pdcNumberMatch = [];
                    model.pdcChequeMatch = [];
                    model.pdcChequeExceedLimit = [];
                    model.exceedCheque = false;
                    model.pdc.cancelledSecurityCheque = [];
                    model.pdc.cancelledSecurityChequeNumber = [];
                    model.confirmDelete = true;
                    //check for cancelled security cheque
                    for (var i = 0; i < model.pdc.securityChequeDetails.length; i++) {
                        if(model.pdc.securityChequeDetails[i].status == 'CANCELLED') {
                           model.pdc.cancelledSecurityCheque.push(model.pdc.securityChequeDetails[i]); 
                           model.pdc.cancelledSecurityChequeNumber.push(model.pdc.securityChequeDetails[i].chequeNoFrom);
                        } 
                    }

                    //check if check count is less than no. of repayment

                    for (var i = 0; i < model.pdc.addCheque.length; i++) {
                        if ((model.pdc.addCheque[i].chequeType == "PDC") && (model.pdc.addCheque[i].pdcFrom + model.pdc.addCheque[i].numberOfCheque - 1) > model.repaymentLenght) {
                            model.pdcChequeExceedLimit.push(model.pdc.addCheque[i]);
                        }
                    }

                    //check for the existance of PDC Number 
                    for (var i = 0; i < model.pdc.pdcChequeDetails.length; i++) {
                        for (var j = 0; j < model.pdc.addCheque.length; j++) {
                            if (model.pdc.addCheque[j].chequeType == "PDC") {
                                for (var k = model.pdc.addCheque[j].pdcFrom; k < (model.pdc.addCheque[j].pdcFrom + model.pdc.addCheque[j].numberOfCheque); k++) {
                                    if (model.pdc.pdcChequeDetails[i].pdcNum == k) {
                                        model.pdcNumberMatch.push(model.pdc.pdcChequeDetails[i].pdcNum);
                                    }
                                }
                            }
                        }
                    }
                    //Check for the existance of the cheque number
                    for (var i = 0; i < model.pdc.addCheque.length; i++) {
                        for (var j = parseInt(model.pdc.addCheque[i].chequeNoFrom); j < (parseInt(model.pdc.addCheque[i].chequeNoFrom) + parseInt(model.pdc.addCheque[i].numberOfCheque)); j++) {
                            for (var k = 0; k < model.pdc.pdcChequeDetails.length; k++) {
                                if (j == parseInt(model.pdc.pdcChequeDetails[k].chequeNo)) {
                                    model.pdcChequeMatch.push(model.pdc.pdcChequeDetails[i].chequeNo);
                                }
                            }
                        }
                    }

                    if (model.pdcChequeExceedLimit.length > 0) {
                        PageHelper.showProgress("page-init", "Cheque Number Count exceeds Number of Repayment ( " + model.repaymentLenght + " )", 3000);
                    } else if (model.pdcChequeMatch.length > 0) {
                        alert('1. The Following CHEQUE Numbers already exist: \n' + model.pdcChequeMatch.join(", ") + '\n');
                    } else {
                        if (model.pdcNumberMatch) {
                            if (model.pdcNumberMatch.length > 0) {

                                var confirmUpdate = confirm('The Following PDC Numbers already exist: \n' + model.pdcNumberMatch.join(", ") + "\nWould you like to replace them");
                                if (confirmUpdate == true) {
                                    var confirmUpdateAgain = confirm('Are you sure?');
                                    if (confirmUpdateAgain == true) {
                                        model.confirmUpdate = true;
                                    }
                                }

                            }

                            if (model.pdc.cancelledSecurityChequeNumber.length > 0) {

                                var confirmDelete = confirm('The Following Security Cheque(s) will be removed: \n' + model.pdc.cancelledSecurityChequeNumber.join(", ") + "\nWould you like to remove them?");
                                if (confirmDelete == true) {
                                    var confirmDeleteAgain = confirm('Are you sure?');
                                    if (confirmDeleteAgain == true) {
                                        model.confirmDelete = true;
                                    }
                                }

                            }
                            if (((model.pdcNumberMatch && model.confirmUpdate == true) || model.pdcNumberMatch.length == 0) || 
                                ((model.pdc.cancelledSecurityChequeNumber && model.confirmDelete == true) || model.pdc.cancelledSecurityChequeNumber.length == 0)) {
                                for (var bankCount = 0; bankCount < model.pdc.addCheque.length; bankCount++) {
                                    model.pdc.addCheque[bankCount].loanAccountNo = model.pdc.loanAccountNo;
                                    model.pdc.addCheque[bankCount].id = model.pdc.id;
                                    model.pdc.addCheque[bankCount].bankAccountNo = model.pdc.bankAccountNo;
                                    //model.pdc.addCheque[bankCount].chequeNoFrom = parseInt(model.pdc.addCheque[bankCount].chequeNoFrom); 
                                    model.pdc.addCheque[bankCount].branchName = model.pdc.addCheque[bankCount].branchName;
                                    if (model.pdc.addCheque[bankCount].chequeType == "PDC") {
                                        if (model.pdc.addCheque[bankCount].pdcFrom > 0 && model.pdc.addCheque[bankCount].pdcFrom < model.pdc.pdcFormMax) {
                                            var pdcMax = model.pdc.addCheque[bankCount].pdcFrom;
                                            model.pdc.addCheque[bankCount].pdcFrom = pdcMax;
                                            //model.pdc.pdcFormMax =model.pdc.pdcFormMax + model.pdc.addCheque[bankCount].numberOfCheque;
                                            pdcMax = model.pdc.addCheque[bankCount].numberOfCheque + model.pdc.addCheque[bankCount].pdcFrom;
                                            if (pdcMax > model.pdc.addCheque[bankCount].pdcFrom) {
                                                model.pdc.pdcFormMax = pdcMax;
                                            }

                                        } else {
                                            var pdcMax = model.pdc.pdcFormMax + 1;
                                            model.pdc.addCheque[bankCount].pdcFrom = pdcMax;
                                            model.pdc.pdcFormMax = model.pdc.pdcFormMax + model.pdc.addCheque[bankCount].numberOfCheque;

                                        }
                                    } else if(model.pdc.addCheque[bankCount].chequeType == "SECURITY")
                                    {
                                        for(var securityNumber = parseInt(model.pdc.addCheque[bankCount].chequeNoFrom); securityNumber < parseInt(model.pdc.addCheque[bankCount].chequeNoFrom) + parseInt(model.pdc.addCheque[bankCount].numberOfCheque); securityNumber++) {
                                            var currentCheque = "" + securityNumber;
                                            var padZeros = "000000";
                                            var securityChequeNumber = padZeros.substring(0, padZeros.length - currentCheque.length) + currentCheque;
                                            
                                            model.pdc.totalCheques.push({
                                                'customerBankAccountNo':model.pdc.addCheque[bankCount].customerBankAccountNo,
                                                'ifscCode':model.pdc.addCheque[bankCount].ifscCode,
                                                'bankName':model.pdc.addCheque[bankCount].bankName,
                                                'branchName':model.pdc.addCheque[bankCount].branchName,
                                                'chequeType':model.pdc.addCheque[bankCount].chequeType,
                                                'numberOfCheque':1,
                                                'chequeNoFrom':securityChequeNumber,
                                                'loanAccountNo': model.pdc.loanAccountNo,
                                                'micr':model.pdc.addCheque[bankCount].micr
                                            })
                                        }
                                    }
                                }
                                for(var finalCount = 0; finalCount < model.pdc.addCheque.length; finalCount++){
                                    if(model.pdc.addCheque[finalCount].chequeType == "PDC"){
                                        model.pdc.totalCheques.push(model.pdc.addCheque[finalCount]);    
                                    }
                                }
                                if(model.pdc.totalCheques.length > 0) {
                                    PageHelper.clearErrors();
                                    PageHelper.showLoader();
                                    PDC.update(model.pdc.totalCheques, function(response) {
                                        PageHelper.hideLoader();
                                        $state.reload();
                                    }, function(errorResponse) {
                                        PageHelper.hideLoader();
                                        model.pdc.pdcFormMax = 0;
                                        PageHelper.showErrors(errorResponse);
                                    });
                                }
                                
                                if(model.confirmDelete){
                                    for(var cancelledCheque = 0; cancelledCheque< model.pdc.cancelledSecurityCheque.length; cancelledCheque++)
                                    {
                                        model.pdc.securityChequeDetails[cancelledCheque].accountId = model.pdc.securityChequeDetails[cancelledCheque].loanAccountNo;
                                        model.pdc.securityChequeDetails[cancelledCheque].chequeNo = model.pdc.securityChequeDetails[cancelledCheque].chequeNoFrom;
                                        model.pdc.securityChequeDetails[cancelledCheque].bankAccountNo = model.pdc.securityChequeDetails[cancelledCheque].customerBankAccountNo;
                                        model.pdc.securityChequeDetails[cancelledCheque].rejectionDate = Utils.getCurrentDate();
                                    }
                                          
                                    PageHelper.clearErrors();
                                    PageHelper.showLoader();
                                    PDC.deleteSecurity(model.pdc.cancelledSecurityCheque, function(response) {
                                    PageHelper.hideLoader();
                                    $state.reload();
                                    }, function(errorResponse) {
                                        PageHelper.hideLoader();
                                        PageHelper.showErrors(errorResponse);
                                    });   
                                }
                                
                            }
                        }
                    }

                }
            }
        };
    }
]);