irf.pageCollection.factory(irf.page("arohan.dashboard.loans.individual.screening.DocumentUpload"), ["$log", "Enrollment", "SessionStore", "$state", '$stateParams', 'PageHelper', 'IndividualLoan', 'Queries', 'Utils', 'formHelper', "LoanProcess", "CustomerBankBranch", "SchemaResource", "LoanAccount", "Misc","irfNavigator", "PagesDefinition","$q",
    function($log, Enrollment, SessionStore, $state, $stateParams, PageHelper, IndividualLoan, Queries, Utils, formHelper, LoanProcess, CustomerBankBranch, SchemaResource, LoanAccount,Misc, irfNavigator, PagesDefinition,$q) {


        var getDocument = function(docsArr, docCode) {
            var i = 0;
            for (i = 0; i < docsArr.length; i++) {
                if (docsArr[i].docCode == docCode) {
                    return docsArr[i];
                }
            }
            return null;
        }
        
        var formConfig = function(individual,entity,model){
            model.additional.isIndividual = individual ? true : false;
            model.additional.isEntity = entity ? true : false;
        };


        return {
            "type": "schema-form",
            "title": "LOAN_DOCUMENT_UPLOAD_QUEUE",
            "subTitle": " ",
            initialize: function(model, form, formCtrl) {
                $log.info("Demo Customer Page got initialized");
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                model.loanView = SessionStore.getGlobalSetting("LoanViewPageName");
                model._queue = $stateParams.pageData;
                if (!model._queue) {
                    $log.info("Screen directly launched hence redirecting to queue screen");
                    $state.go('Page.Engine', {
                        pageName: 'arohan.dashboard.loans.individual.screening.DocumentUpload',
                        pageId: null
                    });
                    return;
                }
                var remainingDocsArray=[];
                var uploadedExistingDocs=[];
                var loanId = $stateParams['pageId'];
                PageHelper.showProgress('loan-load', 'Loading loan details...');
                PageHelper.showLoader();
                IndividualLoan.get({
                        id: $stateParams.pageId
                    })
                    .$promise
                    .then(
                        function(res) {
                            PageHelper.showProgress('loan-load', 'Loading done.', 2000);
                            model.loanAccount = res;
                            uploadedExistingDocs=_.cloneDeep(res.loanDocuments);
                           
                            /* DO BASIC VALIDATION */
                            if (res.currentStage!= 'DocumentUpload'){
                                PageHelper.showProgress('load-loan', 'Loan is in different Stage', 2000);
                                irfNavigator.goBack();
                                return;
                            }
                            if(model.loanAccount.disbursementSchedules && model.loanAccount.disbursementSchedules.length)
                            {
                                 model.loanAccount.disbursementSchedules[0].party = model.loanAccount.disbursementSchedules[0].party || 'CUSTOMER';
                            }
                            var masterDocumentsArray=[];
                            var allExistingDocs = []; 
                            model.remainingDocsArray=remainingDocsArray;
                            model.allExistingDocs = allExistingDocs;
                            Queries.getLoanProductDocuments(model.loanAccount.productCode, "LoanBooking", "DocumentUpload")
                                .then(
                                    function(docs) {
                                        var docsForProduct = [];
                                        masterDocumentsArray=docs;
                                        for (var i = 0; i < masterDocumentsArray.length; i++) {
                                            var pushFlag = true;
                                            var hiddenFlag=false;
                                            if (uploadedExistingDocs && uploadedExistingDocs.length) {
                                                for (var j = 0; j < uploadedExistingDocs.length; j++) {
                                                    if (!uploadedExistingDocs[j]) continue;
                                                    if (masterDocumentsArray[i].document_code == uploadedExistingDocs[j].document) {
                                                        
                                                        if (uploadedExistingDocs[j].documentStatus == 'APPROVED'){
                                                            hiddenFlag = true; 
                                                        }
                                                        allExistingDocs.push({
                                                            "$formsKey": masterDocumentsArray[i].forms_key,
                                                            "$key": masterDocumentsArray[i].forms_key,
                                                            "documentId": uploadedExistingDocs[j].documentId,
                                                            "id": uploadedExistingDocs[j].id,
                                                            "loanId": uploadedExistingDocs[j].loanId,
                                                            "$title": masterDocumentsArray[i].document_description ||
                                                            masterDocumentsArray[i].document_name ||
                                                            masterDocumentsArray[i].document_code,
                                                            "$downloadRequired": masterDocumentsArray[i].download_required,
                                                            "$mandatory": masterDocumentsArray[i].mandatory,
                                                            "isHidden": hiddenFlag,
                                                            "documentStatus":uploadedExistingDocs[j].documentStatus,
                                                            "document":uploadedExistingDocs[j].document
                                                        });
                                                        uploadedExistingDocs[j] = null;
                                                        pushFlag = false;
                                                    }
                                                }
                                            }
                                            if (pushFlag) {
                                                allExistingDocs.push({
                                                    "$formsKey": masterDocumentsArray[i].forms_key,
                                                    "$key": masterDocumentsArray[i].forms_key,
                                                    "documentId": null,
                                                    "id": null,
                                                    "loanId": $stateParams.pageId,
                                                    "$title":masterDocumentsArray[i].document_description || masterDocumentsArray[i].document_name || masterDocumentsArray[i].document_code || 'No Title Defined',
                                                    "$downloadRequired": masterDocumentsArray[i].download_required,
                                                    "$mandatory": masterDocumentsArray[i].mandatory,
                                                    "isHidden": false,
                                                    "documentStatus":null,
                                                    "document":masterDocumentsArray[i].document_code
                                                });
                                            }
                                        }
                                        if (uploadedExistingDocs && uploadedExistingDocs.length) {
                                            for (var i = 0; i < uploadedExistingDocs.length; i++) {
                                                if (uploadedExistingDocs[i]) {
                                                    remainingDocsArray.push({
                                                        "$formsKey": null,
                                                        "$key": null,
                                                        "documentId": uploadedExistingDocs[i].documentId,
                                                        "id": uploadedExistingDocs[i].id,
                                                        "loanId": uploadedExistingDocs[i].loanId,
                                                        "$title": uploadedExistingDocs[i].document || 'No Title Defined',
                                                        "$downloadRequired": null,
                                                        "$mandatory": null,
                                                        "isHidden": false,
                                                        "documentStatus":null,
                                                        "document":uploadedExistingDocs[i].document
                                                    });
                                                }
                                            }
                                        }

                                        model.remainingDocsArray=remainingDocsArray;
                                        
                                        model.allExistingDocs = allExistingDocs;
                                       
                                        var loanDocuments = model.loanAccount.loanDocuments;
                                        var availableDocCodes = [];
                                        for (var i = 0; i < docsForProduct.length; i++) {
                                            if (_.indexOf(availableDocCodes, docsForProduct[i].docCode) == -1) {
                                                loanDocuments.push({
                                                    document: docsForProduct[i].docCode,
                                                    $downloadRequired: docsForProduct[i].downloadRequired,
                                                    $title: docsForProduct[i].docTitle,
                                                    $formsKey: docsForProduct[i].formsKey,
                                                    $mandatory: docsForProduct[i].mandatory,
                                                    disbursementId: model.loanAccount.disbursementSchedules[0].id,
                                                    isHidden: false
                                                })
                                            }
                                        }
                                        console.log(model);
                                        if (model._queue.accountNumber != null) {
                                            LoanAccount.activateLoan({
                                                "accountId": model._queue.accountNumber
                                            }, function(data) {
                                                $log.info("Inside success of activateLoan");
                                                LoanProcess.generateScheduleForSpecifiedDate({
                                                        // "accountNumber": model._queue.accountNumber,
                                                        "loanId": model._queue.loanId,
                                                        "tranchNumber": model.loanAccount.disbursementSchedules[0].trancheNumber,
                                                        "amount":model.loanAccount.disbursementSchedules[0].disbursementAmount,
                                                        "scheduledDisbursementDate":model.loanAccount.disbursementSchedules[0].scheduledDisbursementDate,
                                                        "firstRepaymentDate":model.loanAccount.firstRepaymentDate
                                                    })
                                                    .$promise
                                                    .then(function(resp) {}, function(httpRes) {
                                                        PageHelper.showProgress('loan-load', 'Failed to load the EMI Schedule. Try again.', 4000);
                                                        PageHelper.showErrors(httpRes);
                                                    }).finally(function(){
                                                        PageHelper.hideLoader();
                                                    });
                                            }, function(res) {
                                                PageHelper.hideLoader();
                                                PageHelper.showErrors(res);
                                                PageHelper.showProgress('disbursement', 'Error while activating loan.', 2000);
                                            });
                                        } else {
                                            PageHelper.hideLoader();
                                        }
                                    },
                                    function(httpRes) {
                                        PageHelper.hideLoader();
                                    }
                                )
                            model.additional ={};
                            Queries.getCustomerById(model.loanAccount.customerId,true).then(function(customer){
                                if (customer.customerType == "Individual")
                                    formConfig(true,false,model);
                                else
                                    formConfig(false,true,model);
                            },function(err){
                                formConfig(false,true,model);
                            })
                        },
                        function(httpRes) {
                            PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                            PageHelper.showErrors(httpRes);
                            PageHelper.hideLoader();
                        }
                    )
            },

            form: [{
                "type": "box",
                "title": "DISBURSEMENT_DETAILS",
                "colClass": "col-sm-12",
                "condition":"model.siteCode!='IREPDhan'",
                "items": [
                   {
                            "type": "fieldset",
                            "title": "View Loan Details",
                            "condition":"model.loanAccount.id && model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                            "items": [{
                                key: "loanAccount.ViewLoan",
                                type: "button",
                                title: "View Loan",
                                required: true,
                                onClick: "actions.viewLoan(model, formCtrl, form, $event)"
                            }]
                    },{
                    "type": "fieldset",
                    "title": "DISBURSEMENT_ACCOUNT_DETAILS",
                    "items": [{
                        "key": "loanAccount.disbursementSchedules[0].party",
                        "type": "radios",
                        "titleMap": [{
                            "name": "Customer",
                            "value": "CUSTOMER"
                        }, {
                            "name": "Vendor",
                            "value": "VENDOR"
                        }],
                        onChange: function(value, form, model) {
                            model.loanAccount.customerBankAccountNumber = '';
                            model.loanAccount.customerBankIfscCode = '';
                            model.loanAccount.customerBank = '';
                            model.loanAccount.customerBranch = '';
                            model.loanAccount.disbursementSchedules[0].customerNameInBank = '';
                        },
                        condition:"model.siteCode != 'witfin'"
                    },
                    {
                        "key": "loanAccount.disbursementSchedules[0].party",
                        "type": "radios",
                        "titleMap": [{
                            "name": "Customer",
                            "value": "CUSTOMER"
                        }, {
                            "name": "Third Party",
                            "value": "VENDOR"
                        }],
                        onChange: function(value, form, model) {
                            model.loanAccount.customerBankAccountNumber = '';
                            model.loanAccount.customerBankIfscCode = '';
                            model.loanAccount.customerBank = '';
                            model.loanAccount.customerBranch = '';
                            model.loanAccount.disbursementSchedules[0].customerNameInBank = '';
                        },
                        condition:"model.siteCode == 'witfin'"
                    }, {
                        key: "loanAccount.disbursementSchedules[0].customerNameInBank",
                        title: "CUSTOMER_NAME_IN_BANK"
                    }, {
                        key: "loanAccount.customerBankAccountNumber",
                        type: "lov",
                        autolov: true,
                        title: "CUSTOMER_BANK_ACC_NO",
                        "condition": "model.loanAccount.disbursementSchedules[0].party=='CUSTOMER'",
                        bindMap: {
                            "customerId": "loanAccount.customerId"
                        },
                        outputMap: {
                            "account_number": "loanAccount.customerBankAccountNumber",
                            "ifsc_code": "loanAccount.customerBankIfscCode",
                            "customer_bank_name": "loanAccount.customerBank",
                            "customer_bank_branch_name": "loanAccount.customerBranch",
                            "customer_name_as_in_bank":"loanAccount.customerNameAsInBank"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            var urn = [];
                            var ids = [];
                            for(var i =0; i <model.loanAccount.loanCustomerRelations.length; i++)
                            {
                                if (model.loanAccount.loanCustomerRelations[i].urn)
                                    urn.push(model.loanAccount.loanCustomerRelations[i].urn);
                                else if (model.loanAccount.loanCustomerRelations[i].customerId)
                                    ids.push(model.loanAccount.loanCustomerRelations[i].customerId)
                            }
                            if (model.loanAccount.urnNo !=null)
                                urn.push(model.loanAccount.urnNo);
                            ids.push(model.loanAccount.customerId);
                            return Queries.getCustomersBankAccounts({
                               customer_urns : urn,
                               customer_ids : ids
                            });
                        },
                        onSelect: function(result, model, context) {
                            model.loanAccount.disbursementSchedules[0].customerNameInBank = model.loanAccount.customerNameAsInBank;
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
                        key: "loanAccount.customerBankAccountNumber",
                        title: "CUSTOMER_BANK_ACC_NO",
                        "condition": "model.loanAccount.disbursementSchedules[0].party=='VENDOR'"
                    }, {
                        key: "loanAccount.customerBankIfscCode",
                        title: "CUSTOMER_BANK_IFSC",
                        "condition": "model.loanAccount.disbursementSchedules[0].party=='CUSTOMER'"
                    }, {
                        key: "loanAccount.customerBankIfscCode",
                        type: "lov",
                        lovonly: true,
                        "condition": "model.loanAccount.disbursementSchedules[0].party=='VENDOR'",
                        inputMap: {
                            "ifscCode": {
                                "key": "loanAccount.customerBankIfscCode"
                            },
                            "bankName": {
                                "key": "loanAccount.customerBank"
                            },
                            "branchName": {
                                "key": "loanAccount.customerBranch"
                            }
                        },
                        outputMap: {
                            "bankName": "loanAccount.customerBank",
                            "branchName": "loanAccount.customerBranch",
                            "ifscCode": "loanAccount.customerBankIfscCode"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form) {
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
                        key: "loanAccount.customerBank",
                        title: "CUSTOMER_BANK"
                    }, {
                        key: "loanAccount.customerBranch",
                        title: "BRANCH_NAME"
                    }]
                }]
            },{
                "type": "box",
                "title": "DISBURSEMENT_DETAILS",
                "colClass": "col-sm-12",
                "condition":"model.siteCode=='IREPDhan'",
                "items": [
                   {
                            "type": "fieldset",
                            "title": "View Loan Details",
                            "condition":"model.loanAccount.id && model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                            "items": [{
                                key: "loanAccount.ViewLoan",
                                type: "button",
                                title: "View Loan",
                                required: true,
                                onClick: "actions.viewLoan(model, formCtrl, form, $event)"
                            }]
                    },{
                    "type": "fieldset",
                    "title": "DISBURSEMENT_ACCOUNT_DETAILS",
                    "items": [{
                        "key": "loanAccount.disbursementSchedules[0].party",
                        "type": "radios",
                        "titleMap": [{
                            "name": "Customer",
                            "value": "CUSTOMER"
                        }, {
                            "name": "Vendor",
                            "value": "VENDOR"
                        }],
                        onChange: function(value, form, model) {
                            model.loanAccount.customerBankAccountNumber = '';
                            model.loanAccount.customerBankIfscCode = '';
                            model.loanAccount.customerBank = '';
                            model.loanAccount.customerBranch = '';
                            model.loanAccount.disbursementSchedules[0].customerNameInBank = '';
                        },
                        condition:"model.siteCode != 'witfin'"
                    },
                    {
                        "key": "loanAccount.disbursementSchedules[0].party",
                        "type": "radios",
                        "titleMap": [{
                            "name": "Customer",
                            "value": "CUSTOMER"
                        }, {
                            "name": "Third Party",
                            "value": "VENDOR"
                        }],
                        onChange: function(value, form, model) {
                            model.loanAccount.customerBankAccountNumber = '';
                            model.loanAccount.customerBankIfscCode = '';
                            model.loanAccount.customerBank = '';
                            model.loanAccount.customerBranch = '';
                            model.loanAccount.disbursementSchedules[0].customerNameInBank = '';
                        },
                        condition:"model.siteCode == 'witfin'"
                    }, {
                        key: "loanAccount.disbursementSchedules[0].customerNameInBank",
                        title: "CUSTOMER_NAME_IN_BANK",
                        required:true

                    }, {
                        key: "loanAccount.customerBankAccountNumber",
                        type: "lov",
                        autolov: true,
                        required:true,
                        title: "CUSTOMER_BANK_ACC_NO",
                        "condition": "model.loanAccount.disbursementSchedules[0].party=='CUSTOMER'",
                        bindMap: {
                            "customerId": "loanAccount.customerId"
                        },
                        outputMap: {
                            "account_number": "loanAccount.customerBankAccountNumber",
                            "ifsc_code": "loanAccount.customerBankIfscCode",
                            "customer_bank_name": "loanAccount.customerBank",
                            "customer_bank_branch_name": "loanAccount.customerBranch",
                            "customer_name_as_in_bank":"loanAccount.customerNameAsInBank"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            var urn = [];
                            var ids = [];
                            for(var i =0; i <model.loanAccount.loanCustomerRelations.length; i++)
                            {
                                if (model.loanAccount.loanCustomerRelations[i].urn)
                                    urn.push(model.loanAccount.loanCustomerRelations[i].urn);
                                else if (model.loanAccount.loanCustomerRelations[i].customerId)
                                    ids.push(model.loanAccount.loanCustomerRelations[i].customerId)
                            }
                            if (model.loanAccount.urnNo !=null)
                                urn.push(model.loanAccount.urnNo);
                            ids.push(model.loanAccount.customerId);
                            return Queries.getCustomersBankAccounts({
                               customer_urns : urn,
                               customer_ids : ids
                            });
                        },
                        onSelect: function(result, model, context) {
                            model.loanAccount.disbursementSchedules[0].customerNameInBank = model.loanAccount.customerNameAsInBank;
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
                        required:true,
                        key: "loanAccount.customerBankAccountNumber",
                        title: "CUSTOMER_BANK_ACC_NO",
                        "condition": "model.loanAccount.disbursementSchedules[0].party=='VENDOR'"
                    }, {
                        required:true,
                        key: "loanAccount.customerBankIfscCode",
                        title: "CUSTOMER_BANK_IFSC",
                        "condition": "model.loanAccount.disbursementSchedules[0].party=='CUSTOMER'"
                    }, {
                        required:true,
                        key: "loanAccount.customerBankIfscCode",
                        type: "lov",
                        lovonly: true,
                        "condition": "model.loanAccount.disbursementSchedules[0].party=='VENDOR'",
                        inputMap: {
                            "ifscCode": {
                                "key": "loanAccount.customerBankIfscCode"
                            },
                            "bankName": {
                                "key": "loanAccount.customerBank"
                            },
                            "branchName": {
                                "key": "loanAccount.customerBranch"
                            }
                        },
                        outputMap: {
                            "bankName": "loanAccount.customerBank",
                            "branchName": "loanAccount.customerBranch",
                            "ifscCode": "loanAccount.customerBankIfscCode"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form) {
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
                        required:true,
                        key: "loanAccount.customerBank",
                        title: "CUSTOMER_BANK"
                    }, {
                        required:true,
                        key: "loanAccount.customerBranch",
                        title: "BRANCH_NAME"
                    }]
                }]
            },{
                "type":"box",
                "title":"ACH_ACCOUNT_DETAILS",
                "condition":"model.loanAccount.collectionPaymentType=='ACH' && model.siteCode!='IREPDhan' ",
                "items":[{
                        "key": "loanAccount.collectionCustomerNameAsInBank",
                        "title": "ACCOUNT_HOLDER_NAME",
                    },{
                        "key": "loanAccount.collectionAccountNumber",
                        "title": "CUSTOMER_BANK_ACC_NO",
                        type: "lov",
                        autolov: true,
                        bindMap: {
                            "customerId": "loanAccount.customerId"
                        },
                        outputMap: {
                            "account_number": "loanAccount.collectionAccountNumber",
                            "ifsc_code": "loanAccount.collectionIfscCode",
                            "customer_bank_name": "loanAccount.collectionBankName",
                            "customer_bank_branch_name": "loanAccount.collectionBankBranchName",
                            "customer_name_as_in_bank":"loanAccount.collectionCustomerNameAsInBank",
                            "account_type": "loanAccount.collectionAccountType"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            var urn = [];
                            var ids = [];
                            for(var i =0; i <model.loanAccount.loanCustomerRelations.length; i++)
                            {
                                if (model.loanAccount.loanCustomerRelations[i].urn)
                                    urn.push(model.loanAccount.loanCustomerRelations[i].urn);
                                else if (model.loanAccount.loanCustomerRelations[i].customerId)
                                    ids.push(model.loanAccount.loanCustomerRelations[i].customerId)
                            }
                            if (model.loanAccount.urnNo !=null)
                                urn.push(model.loanAccount.urnNo);
                            ids.push(model.loanAccount.customerId);
                            return Queries.getCustomersBankAccounts({
                               customer_urns : urn,
                               customer_ids : ids
                            });
                        },
                        onSelect: function(result, model, context) {
                           
                        },

                        getListDisplayItem: function(item, index) {
                            return [
                                'Account Number : ' +item.account_number,
                                'Branch : ' + item.customer_bank_branch_name,
                                'Bank : ' + item.customer_bank_name,
                                'IFSC Code : ' + item.ifsc_code
                            ];
                        }
                    },{
                            "key": "loanAccount.collectionAccountType",
                            "title": "ACCOUNT_TYPE",
                            "type": "select",
                            "enumCode": "ach_account_type"

                    },{
                        "key": "loanAccount.collectionIfscCode",
                        "title": "IFSC_CODE",
                    },{
                        "key": "loanAccount.collectionBankName",
                        "title": "BANK_NAME",
                    },{
                        "key": "loanAccount.collectionBankBranchName",
                        "title": "HUB_NAME",
                    },{
                        "key": "loanAccount.collectionButton",
                        "title": "SAVE_DETAILS",
                        "type":"button",
                        "onClick": "actions.saveACH(model, formCtrl, form, $event)"
                    }
                ]
            }, {
                "type":"box",
                "title":"ACH_ACCOUNT_DETAILS",
                "condition":"model.loanAccount.collectionPaymentType=='ACH' && model.siteCode=='IREPDhan' ",
                "items":[{
                        "key": "loanAccount.collectionCustomerNameAsInBank",
                        "title": "ACCOUNT_HOLDER_NAME",
                        required:true
                    
                    },{
                        "key": "loanAccount.collectionAccountNumber",
                        "title": "CUSTOMER_BANK_ACC_NO",
                        type: "lov",
                        required:true,
                        autolov: true,
                        bindMap: {
                            "customerId": "loanAccount.customerId"
                        },
                        outputMap: {
                            "account_number": "loanAccount.collectionAccountNumber",
                            "ifsc_code": "loanAccount.collectionIfscCode",
                            "customer_bank_name": "loanAccount.collectionBankName",
                            "customer_bank_branch_name": "loanAccount.collectionBankBranchName",
                            "customer_name_as_in_bank":"loanAccount.collectionCustomerNameAsInBank",
                            "account_type": "loanAccount.collectionAccountType"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            var urn = [];
                            var ids = [];
                            for(var i =0; i <model.loanAccount.loanCustomerRelations.length; i++)
                            {
                                if (model.loanAccount.loanCustomerRelations[i].urn)
                                    urn.push(model.loanAccount.loanCustomerRelations[i].urn);
                                else if (model.loanAccount.loanCustomerRelations[i].customerId)
                                    ids.push(model.loanAccount.loanCustomerRelations[i].customerId)
                            }
                            if (model.loanAccount.urnNo !=null)
                                urn.push(model.loanAccount.urnNo);
                            ids.push(model.loanAccount.customerId);
                            return Queries.getCustomersBankAccounts({
                               customer_urns : urn,
                               customer_ids : ids
                            });
                        },
                        onSelect: function(result, model, context) {
                           
                        },

                        getListDisplayItem: function(item, index) {
                            return [
                                'Account Number : ' +item.account_number,
                                'Branch : ' + item.customer_bank_branch_name,
                                'Bank : ' + item.customer_bank_name,
                                'IFSC Code : ' + item.ifsc_code
                            ];
                        }
                    },{
                            "key": "loanAccount.collectionAccountType",
                            "title": "ACCOUNT_TYPE",
                            "type": "select",
                            "enumCode": "ach_account_type",
                            required:true

                    },{
                        "key": "loanAccount.collectionIfscCode",
                        "title": "IFSC_CODE",
                        required:true
                    },{
                        "key": "loanAccount.collectionBankName",
                        "title": "BANK_NAME",
                        required:true
                    },{
                        "key": "loanAccount.collectionBankBranchName",
                        "title": "HUB_NAME",
                        required:true
                    },{
                        "key": "loanAccount.collectionButton",
                        "title": "SAVE_DETAILS",
                        "type":"button",
                        "onClick": "actions.saveACH(model, formCtrl, form, $event)"
                    }
                ]
            },{
                "type": "box",
                "colClass": "col-sm-12",
                "title": "LOAN_DOCUMENT_UPLOAD_QUEUE",
                "items": [{
                        "key": "_queue.centreName",
                        "title": "CENTRE",
                        "readonly": true
                    }, {
                        "key": "_queue.customerName",
                        "title": "ENTITY_NAME",
                        "condition": "model.additional.isEntity",
                        "readonly": true
                    },
                    {
                        "key": "_queue.customerName",
                        "title": "APPLICANT_NAME",
                        "condition":"model.additional.isIndividual",
                        "readonly": true
                    }, 
                    {
                        "type": "button",
                        "title": "DOWNLOAD_ALL_FORMS",
                        "onClick": function(model, form, schemaForm, event) {
                            Utils.downloadFile(Misc.allFormsDownload({recordId:model.loanAccount.id}));
                        }
                    }, 
                     //all existing docs
                    // {
                    //     "type": "fieldset",
                    //     "title": "LOAN_DOCUMENTS",
                    //     "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                    //     "items": [{
                    //         "type": "array",
                    //         "notitle": true,
                    //         "view": "fixed",
                    //         "key": "allExistingDocs",
                    //         "add": null,
                    //         "remove": null,
                    //         "items": [
                    //             {
                    //                 "type": "section",
                    //                 "htmlClass": "row",
                    //                 "condition": "model.allExistingDocs[arrayIndex].isHidden === false",
                    //                 "items": [
                    //                     {
                    //                         "type": "section",
                    //                         "htmlClass": "col-sm-3",
                    //                         "items": [{
                    //                             "key": "allExistingDocs[arrayIndex].$title",
                    //                             "notitle": true,
                    //                             "titleExpr": "model.allExistingDocs[arrayIndex].$title",
                    //                             "type": "anchor",
                    //                             "fieldHtmlClass": "text-bold",
                    //                             "condition": "model.allExistingDocs[arrayIndex].$downloadRequired",
                    //                             "onClick": function (model, form, schemaForm, event) {
                    //                                 var doc = model.allExistingDocs[schemaForm.key[-1]];
                    //                                 Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=" + doc.$formsKey + "&record_id=" + model.loanAccount.id)
                    //                             }
                    //                         },

                    //                         {
                    //                             "key": "allExistingDocs[].$title",
                    //                             "notitle": true,
                    //                             "title": " ",
                    //                             "condition": "!model.allExistingDocs[arrayIndex].$downloadRequired",
                    //                             "readonly": true
                    //                         }]
                    //                     },
                    //                     {
                    //                         "type": "section",
                    //                         "htmlClass": "col-sm-2",
                    //                         "key": "allExistingDocs[].documentStatus",
                    //                         "items": [{
                    //                             "notitle": true,
                    //                             "key": "allExistingDocs[].documentStatus",
                    //                             "readonly": true
                    //                         }]
                    //                     },
                    //                     {
                    //                         "type": "section",
                    //                         "htmlClass": "col-sm-4",
                    //                         "key": "allExistingDocs[].remarks",
                    //                         "condition": "model.allExistingDocs[arrayIndex].documentStatus === 'APPROVED'",
                    //                         "items": [{
                    //                             "notitle": true,
                    //                             "key": "allExistingDocs[].remarks",
                    //                             "readonly": true
                    //                         }]
                    //                     },
                    //                     {
                    //                         "type": "section",
                    //                         "htmlClass": "col-sm-4",
                    //                         "key": "allExistingDocs[].documentStatus",
                    //                         "condition": "model.allExistingDocs[arrayIndex].documentStatus === 'REJECTED' && !model.allExistingDocs[arrayIndex].remarks",
                    //                         "items": [{
                    //                             "notitle": true,
                    //                             "key": "allExistingDocs[].rejectReason",
                    //                             "readonly": true
                    //                         }]
                    //                     },
                    //                     {
                    //                         "type": "section",
                    //                         "htmlClass": "col-sm-2",
                    //                         "key": "allExistingDocs[].documentStatus",
                    //                         "condition": "model.allExistingDocs[arrayIndex].documentStatus === 'REJECTED' && model.allExistingDocs[arrayIndex].remarks",
                    //                         "items": [{
                    //                             "notitle": true,
                    //                             "key": "model.allExistingDocs[].rejectReason",
                    //                             "readonly": true
                    //                         }]
                    //                     }, {
                    //                         "type": "section",
                    //                         "htmlClass": "col-sm-2",
                    //                         "key": "allExistingDocs[].documentStatus",
                    //                         "condition": "model.allExistingDocs[arrayIndex].documentStatus === 'REJECTED' && model.allExistingDocs[arrayIndex].remarks",
                    //                         "items": [{
                    //                             "notitle": true,
                    //                             "key": "model.allExistingDocs[].remarks",
                    //                             "readonly": true
                    //                         }]
                    //                     }, {
                    //                         "type": "section",
                    //                         "htmlClass": "col-sm-4",
                    //                         "key": "allExistingDocs[].documentStatus",
                    //                         "condition": "model.allExistingDocs[arrayIndex].documentStatus !== 'REJECTED' && model.allExistingDocs[arrayIndex].documentStatus !== 'APPROVED' "
                    //                     },
                    //                     {
                    //                         "type": "section",
                    //                         "condition": "model.allExistingDocs[arrayIndex].documentStatus !== 'APPROVED' && model.allExistingDocs[arrayIndex].documentStatus != null && model.allExistingDocs[arrayIndex].$mandatory == 'NO' ",
                    //                         "htmlClass": "col-sm-3",
                    //                         "items": [{
                    //                             title: "Upload",
                    //                             key: "allExistingDocs[].documentId",
                    //                             type: "file",
                    //                             fileType: "application/pdf",
                    //                             category: "Loan",
                    //                             subCategory: "DOC1",
                    //                             "notitle": true,
                    //                             using: "scanner",
                    //                             required: false
                    //                         }]
                    //                     },
                    //                     {
                    //                         "type": "section",
                    //                         "htmlClass": "col-sm-3",
                    //                         "items": [{
                    //                             title: "Upload",
                    //                             key: "allExistingDocs[].documentId",
                    //                             type: "file",
                    //                             fileType: "application/pdf",
                    //                             category: "Loan",
                    //                             subCategory: "DOC1",
                    //                             "notitle": true,
                    //                             using: "scanner",
                    //                             required:true
                    //                         }]
                    //                     },
                    //             ]
                    //         }] // END of array items
                    //     }]
                    // },// all existing docs ends
                    //remaining docs 
                    // {
                    //     "type": "fieldset",
                    //     "title": "Additional Documents",
                    //     "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                    //     "readonly": true,
                    //     "items": [{
                    //         "type": "array",
                    //         "notitle": true,
                    //         "view": "fixed",
                    //         "key": "remainingDocsArray",
                    //         "remove": null,
                    //         "items": [
                    //             {
                    //                 "type": "section",
                    //                 "htmlClass": "row",
                    //                 "condition": "model.remainingDocsArray[arrayIndex].isHidden === false",
                    //                 "items": [
                    //                     {
                    //                         "type": "section",
                    //                         "htmlClass": "col-sm-9",
                    //                         "items": [{
                    //                             "key": "remainingDocsArray[].$title",
                    //                             "notitle": true,
                    //                             "titleExpr": "model.remainingDocsArray[arrayIndex].$title",
                    //                             "type": "html",
                    //                             "fieldHtmlClass": "text-bold",
                    //                             "condition": "!model.remainingDocsArray[arrayIndex].$downloadRequired",
                    //                             "onClick": function (model, form, schemaForm, event) {
                                                   
                    //                             }
                    //                         }]
                    //                     },
                    //                     {
                    //                         "type": "section",
                    //                         "htmlClass": "col-sm-3",
                    //                         "items": [{
                    //                             title: "Upload",
                    //                             key: "remainingDocsArray[].documentId",
                    //                             type: "file",
                    //                             fileType: "application/pdf",
                    //                             category: "Loan",
                    //                             subCategory: "DOC1",
                    //                             "notitle": true,
                    //                             using: "scanner"
                    //                         }]
                    //                     }
                    //                 ]
                    //             }] // END of array items
                    //     }]
                    // }
                ] 
            },
            {
                "type": "box",
                "title": "POST_REVIEW",
                "condition": "model.loanAccount.id",
                "items": [
                    {
                        key: "review.action",
                        type: "radios",
                        condition: "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                        titleMap: {
                            "REJECT": "REJECT",
                            "SEND_BACK": "SEND_BACK",
                            "PROCEED": "PROCEED",
                            "HOLD": "HOLD"
                        }
                    },
                    {
                        key: "review.action",
                        type: "radios",
                        condition: "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                        titleMap: {
                            "SEND_BACK": "SEND_BACK",
                            "PROCEED": "PROCEED",
                        }
                    },
                    {
                        type: "section",
                        condition: "model.review.action=='REJECT'",
                        items: [
                            {
                                title: "REMARKS",
                                key: "review.remarks",
                                condition: "model.siteCode != 'sambandh'",
                                type: "textarea",
                                required: true
                            }, 
                            {
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
                                condition: "model.siteCode == 'sambandh'"
                            },
                            {
                                key: "loanAccount.rejectReason",
                                type: "lov",
                                autolov: true,
                                title: "REJECT_REASON",
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function(inputModel, form, model, context) {
                                    var stage1 = model.currentStage;

                                    if (model.currentStage == 'Application' || model.currentStage == 'ApplicationReview') {
                                        stage1 = "Application";
                                    }
                                    if (model.currentStage == 'FieldAppraisal' || model.currentStage == 'FieldAppraisalReview') {
                                        stage1 = "FieldAppraisal";
                                    }
                                    if(typeof stage1 === 'undefined'){
                                        stage1=model.loanAccount.currentStage;
                                    }
                                    var rejectReason = formHelper.enum('application_reject_reason').data;
                                    var out = [];
                                    for (var i = 0; i < rejectReason.length; i++) {
                                        var t = rejectReason[i];
                                        if (t.field1 == stage1) {
                                             out.push({
                                                name: t.name,
                                            })
                                        }
                                        else{
                                            console.log(t.field1);
                                        }
                                    }
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": out.length
                                        },
                                        body: out
                                    });
                                },
                                onSelect: function(valueObj, model, context) {
                                    model.loanAccount.rejectReason = valueObj.name;
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.name
                                    ];
                                }
                            },
                                
                            {
                                key: "review.rejectButton",
                                type: "button",
                                title: "REJECT",
                                required: true,
                                onClick: "actions.reject(model, formCtrl, form, $event)"
                            }
                        ]
                    },
                    {
                        type: "section",
                        condition: "model.review.action=='HOLD'",
                        items: [
                            {
                                title: "REMARKS",
                                key: "review.remarks",
                                condition: "model.siteCode != 'sambandh'",
                                type: "textarea",
                                required: true
                            },
                            {
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
                                condition: "model.siteCode == 'sambandh'"
                            },
                            {
                                key: "review.holdButton",
                                type: "button",
                                title: "HOLD",
                                required: true,
                                onClick: "actions.holdButton(model, formCtrl, form, $event)"
                            }
                        ]
                    },
                    {
                        type: "section",
                        condition: "model.review.action=='SEND_BACK'",
                        items: [{
                            title: "REMARKS",
                            key: "review.remarks",
                            condition: "model.siteCode != 'sambandh'",
                            type: "textarea",
                            required: true
                        },
                        {
                            title: "REMARKS",
                            key: "review.remarks",
                            type: "textarea",
                            condition: "model.siteCode == 'sambandh'"
                        }, {
                            key: "review.targetStage",
                            title: "SEND_BACK_TO_STAGE",
                            type: "select",
                            required: true,
                            titleMap: {
                                "LoanInitiation": "LoanInitiation",
                                "LoanBooking": "LoanBooking"

                            },
                        }, {
                            key: "review.sendBackButton",
                            type: "button",
                            title: "SEND_BACK",
                            onClick: "actions.sendBack(model, formCtrl, form, $event)"
                        }]
                    },
                    {
                        type: "section",
                        condition: "model.review.action=='PROCEED'",
                        items: [
                            {
                                title: "REMARKS",
                                key: "review.remarks",
                                condition: "model.siteCode != 'sambandh'",
                                type: "textarea",
                                required: true
                            },
                            {
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
                                condition: "model.siteCode == 'sambandh'"
                            },
                            {
                                key: "review.proceedButton",
                                type: "button",
                                title: "PROCEED",
                                onClick: "actions.proceed(model, formCtrl, form, $event)"
                            }
                        ]
                    }
                ]
            },          
            {
                "type": "actionbox",
                condition: "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                "items": [{
                    "type": "button",
                    "title": "BACK",
                    "onClick": "actions.goBack(model, formCtrl, form, $event)"
                }/*, {
                    "type": "submit",
                    "title": "Submit"
                }*/]
            }],
            schema: function() {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            actions: {
                reject: function(model, formCtrl, form, $event){
                    $log.info("Inside reject()");
                    Utils.confirm("Are You Sure?").then(function(){
                        model.loanAccount.loanDocuments = [];
                        if (model.allExistingDocs.length) {
                            for (var i = 0; i < model.allExistingDocs.length; i++) {
                                if(model.allExistingDocs[i].documentId){

                                    model.loanAccount.loanDocuments.push(model.allExistingDocs[i]);
                                }
                            }
                        }
                        if (model.remainingDocsArray) {
                            for (var i = 0; i < model.remainingDocsArray.length; i++) {
                                if (remainingDocsArray[i].documentId) {
                                    model.loanAccount.loanDocuments.push(model.remainingDocsArray[i]);
                                }
                            }
                        }
                        var reqData = {
                        'loanAccount': _.cloneDeep(model.loanAccount),
                        'loanProcessAction': 'PROCEED',
                        'remarks': model.review.remarks
                        };
                        reqData.loanAccount.status = '';
                        reqData.loanProcessAction = "PROCEED";
                        reqData.stage = "Rejected";
                        reqData.remarks = model.review.remarks;
                        PageHelper.showLoader();
                        PageHelper.showProgress("update-loan", "Working...");
                        IndividualLoan.update(reqData)
                            .$promise
                            .then(function(res){
                                PageHelper.showProgress("update-loan", "Done.", 3000);
                                $state.go('Page.Engine', {
                                    pageName: 'loans.individual.booking.DocumentUploadQueue'
                                });
                            }, function(httpRes){
                                PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function(){
                                PageHelper.hideLoader();
                            })
                    })
                },
                holdButton: function(model, formCtrl, form, $event){
                    $log.info("Inside save()");
                    Utils.confirm("Are You Sure?")
                        .then(
                        function () {
                            model.loanAccount.loanDocuments = [];
                            if (model.allExistingDocs.length) {
                                for (var i = 0; i < model.allExistingDocs.length; i++) {
                                    if(model.allExistingDocs[i].documentId){
                                        model.loanAccount.loanDocuments.push(model.allExistingDocs[i]);
                                    }
                                }
                            }
                            if (model.remainingDocsArray) {
                                for (var i = 0; i < model.remainingDocsArray.length; i++) {
                                    if (model.remainingDocsArray[i].documentId) {
                                        model.loanAccount.loanDocuments.push(model.remainingDocsArray[i]);
                                    }
                                }
                            }
                                var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                                reqData.loanAccount.status = 'HOLD';
                                reqData.loanProcessAction = "SAVE";
                                reqData.remarks = model.review.remarks;
                                PageHelper.showLoader();
                                IndividualLoan.create(reqData)
                                    .$promise
                                    .then(function(res){
                                        $state.go('Page.Engine', {
                                            pageName: 'loans.individual.booking.DocumentUploadQueue'
                                        });
                                    }, function(httpRes){
                                        PageHelper.showErrors(httpRes);
                                    })
                                    .finally(function(httpRes){
                                        PageHelper.hideLoader();
                                    })
                            }
                        );
                },
                saveACH: function(model, formCtrl, form, $event){
                    $log.info("Inside save()");
                    Utils.confirm("Are You Sure?")
                    .then(
                        function() {
                            model.loanAccount.loanDocuments = [];
                            if (model.allExistingDocs) {
                                for (var i = 0; i < model.allExistingDocs.length; i++) {
                                    if(model.allExistingDocs[i].documentId){
                                        model.loanAccount.loanDocuments.push(model.allExistingDocs[i]);
                                    }
                                }
                            }
                            if (model.remainingDocsArray) {
                                for (var i = 0; i < model.remainingDocsArray.length; i++) {
                                    if (model.remainingDocsArray[i].documentId) {
                                        model.loanAccount.loanDocuments.push(model.remainingDocsArray[i]);
                                    }
                                }
                            }
                            var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                            var dummy = null;
                            reqData.loanProcessAction = "SAVE";
                            PageHelper.showLoader();
                            PageHelper.showProgress("update-loan", "Working...");
                            IndividualLoan.update(reqData)
                                .$promise
                                .then(
                                function(res) {
                                    model.loanAccount = _.cloneDeep(res.loanAccount);
                                    Queries.getLoanProductDocuments(model.loanAccount.productCode, "LoanBooking", "DocumentUpload")
                                    .then(
                                        function(docs) {
                                            var docsForProduct = [];
                                            for (var i = 0; i < docs.length; i++) {
                                                var doc = docs[i];
                                                docsForProduct.push({
                                                    docTitle: doc.document_name,
                                                    docCode: doc.document_code,
                                                    formsKey: doc.forms_key,
                                                    downloadRequired: doc.download_required
                                                })
                                            }
                                            var loanDocuments = model.loanAccount.loanDocuments;
                                            var availableDocCodes = [];

                                            for (var i = 0; i < loanDocuments.length; i++) {
                                                loanDocuments[i].documentId = res.loanAccount.loanDocuments[i].documentId;
                                                availableDocCodes.push(loanDocuments[i].document);
                                                var documentObj = getDocument(docsForProduct, loanDocuments[i].document);
                                                /* To add flag whether to show or not */
                                                loanDocuments[i].isHidden = false;
                                                if (loanDocuments[i].documentStatus == 'APPROVED'){
                                                    loanDocuments[i].isHidden = true;
                                                }

                                                if (documentObj != null) {
                                                    loanDocuments[i].$title = documentObj.docTitle;
                                                    loanDocuments[i].$key = documentObj.formsKey;
                                                    loanDocuments[i].$formsKey = documentObj.formsKey;
                                                    loanDocuments[i].$downloadRequired = documentObj.downloadRequired;
                                                } else {
                                                    if (_.hasIn(loanDocuments[i],'document') && _.isString(loanDocuments[i].document)){
                                                        loanDocuments[i].$title = loanDocuments[i].document;
                                                    } else {
                                                        loanDocuments[i].$title = "DOCUMENT_TITLE_NOT_MAINTAINED";    
                                                    }
                                                }
                                            }
                                            for (var i = 0; i < docsForProduct.length; i++) {
                                                if (_.indexOf(availableDocCodes, docsForProduct[i].docCode) == -1) {
                                                    loanDocuments.push({
                                                        document: docsForProduct[i].docCode,
                                                        $downloadRequired: docsForProduct[i].downloadRequired,
                                                        $title: docsForProduct[i].docTitle,
                                                        $formsKey: docsForProduct[i].formsKey,
                                                        disbursementId: model.loanAccount.disbursementSchedules[0].id,
                                                        isHidden: false
                                                    })
                                                }
                                            }
                                            
                                            PageHelper.hideLoader();
                                        },
                                        function(httpRes) {
                                            PageHelper.hideLoader();
                                            PageHelper.showErrors(httpRes);
                                        }
                                    );
                                    PageHelper.showProgress("update-loan", "ACH Details saved...", 3000);
                                }, 
                                function(httpRes){
                                    PageHelper.showErrors(httpRes);
                                    PageHelper.hideLoader();
                                }
                            );
                        }
                    );
                },
                viewLoan: function(model, formCtrl, form, $event){
                    Utils.confirm("Save the data before proceed").then(function(){
                        $log.info("Inside ViewLoan()");
                        if(model.siteCode == 'shramsarathi'){
                            irfNavigator.go({
                                state: "Page.Bundle",
                                pageName: "shramsarathi.dashboard.loans.individual.screening.LoanView",
                                pageId: model.loanAccount.id,
                                pageData: null},
                                {
                                    state: "Page.Engine",
                                    pageName: $stateParams.pageName,
                                    pageId: $stateParams.pageId,
                                    pageData: $stateParams.pageData
                                })
                        }
                       else if(model.loanView) {
                            irfNavigator.go({
                                state: "Page.Bundle",
                                pageName: model.loanView,
                                pageId: model.loanAccount.id,
                                pageData: null
                            },
                            {
                                state : 'Page.Engine',
                                pageName: $stateParams.pageName,
                                pageId: $stateParams.pageId,
                                pageData: $stateParams.pageData
                            });
                        } else {
                            irfNavigator.go({
                                state: "Page.Bundle",
                                pageName: "loans.individual.screening.LoanView",
                                pageId: model.loanAccount.id,
                                pageData: null
                            },
                            {
                                state : 'Page.Engine',
                                pageName: $stateParams.pageName,
                                pageId: $stateParams.pageId,
                                pageData: $stateParams.pageData
                            });  
                        }
                    });
                },

                sendBack: function(model, formCtrl, form, $event){
                    $log.info("Inside sendBack()");
                    if (_.isEmpty(model.review.remarks) || _.isEmpty(model.review.targetStage)) {
                        PageHelper.showProgress("update-loan", "Please Enter Remarks and Stage.", 3000);
                        return false;
                    }
                    Utils.confirm("Are You Sure?").then(function () {
                        model.loanAccount.loanDocuments = [];
                        if (model.allExistingDocs) {
                            for (var i = 0; i < model.allExistingDocs.length; i++) {
                                if(model.allExistingDocs[i].documentId){
                                    model.loanAccount.loanDocuments.push(model.allExistingDocs[i]);
                                }
                            }
                        }
                        if (model.remainingDocsArray) {
                            for (var i = 0; i < model.remainingDocsArray.length; i++) {
                                if (model.remainingDocsArray[i].documentId) {
                                    model.loanAccount.loanDocuments.push(model.remainingDocsArray[i]);
                                }
                            }
                        }
                        var reqData = { loanAccount: _.cloneDeep(model.loanAccount) };
                        reqData.loanAccount.status = '';
                        reqData.loanProcessAction = "PROCEED";
                        reqData.remarks = model.review.remarks;
                        reqData.stage = model.review.targetStage;
                        reqData.remarks = model.review.remarks;
                        PageHelper.showLoader();
                        PageHelper.showProgress("update-loan", "Working...");
                        IndividualLoan.update(reqData)
                            .$promise
                            .then(function (res) {
                                PageHelper.showProgress("update-loan", "Done.", 3000);
                                $state.go('Page.Engine', {
                                    pageName: 'loans.individual.booking.DocumentUploadQueue'
                                });
                            }, function (httpRes) {
                                PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                    })

                },
                proceed: function(model, form, formName) {
                   
                    if (PageHelper.isFormInvalid(form)){
                        return false;
                    }
                
                    model.loanAccount.loanDocuments=[];
                    if (model.allExistingDocs) {
                       
                        for (var i = 0; i<model.allExistingDocs.length; i++) {
                            if(model.allExistingDocs[i].documentId){
                                model.loanAccount.loanDocuments.push(model.allExistingDocs[i]);
                            }
                        }
                    }
                    if (model.remainingDocsArray) {
                            for (var i = 0; i < model.remainingDocsArray.length; i++) {
                                if (model.remainingDocsArray[i].documentId) {
                                    model.loanAccount.loanDocuments.push(model.remainingDocsArray[i]);
                                }
                            }
                    }
                    
                    if (model.loanAccount.disbursementSchedules && model.loanAccount.disbursementSchedules.length) {
                        for (var i = model.loanAccount.disbursementSchedules.length - 1; i >= 0; i--) {
                            model.loanAccount.disbursementSchedules[i].customerAccountNumber = model.loanAccount.customerBankAccountNumber;
                            model.loanAccount.disbursementSchedules[i].ifscCode = model.loanAccount.customerBankIfscCode;
                            model.loanAccount.disbursementSchedules[i].customerBankName = model.loanAccount.customerBank;
                            model.loanAccount.disbursementSchedules[i].customerBankBranchName = model.loanAccount.customerBranch;
                            model.loanAccount.disbursementSchedules[i].party = model.loanAccount.disbursementSchedules[0].party;
                            model.loanAccount.disbursementSchedules[i].customerNameInBank = model.loanAccount.disbursementSchedules[0].customerNameInBank;
                        }
                    }
                    var reqData = {
                        'loanAccount': _.cloneDeep(model.loanAccount),
                        'loanProcessAction': 'PROCEED',
                        'remarks': model.review.remarks
                    };
                    reqData.loanAccount.status = null;
                    PageHelper.showProgress('update-loan', 'Working...');
                    PageHelper.showLoader();
                    
                    return IndividualLoan.update(reqData)
                        .$promise
                        .then(
                            function(res) {
                                PageHelper.showProgress('update-loan', 'Done.', 2000);
                                $state.go('Page.Engine', {
                                    pageName: 'loans.individual.booking.DocumentUploadQueue'
                                });
                                return;
                            },
                            function(httpRes) {
                                PageHelper.showProgress('update-loan', 'Unable to proceed.', 2000);
                                PageHelper.showErrors(httpRes);
                            }
                        )
                        .finally(function() {
                            PageHelper.hideLoader();
                        })
                        
                        //$state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue', pageId: ''});
                },
                goBack: function(model, formCtrl, form, $event) {
                    irfNavigator.goBack();
                }
            }
        };
    }
]);
