irf.pageCollection.factory(irf.page("loans.individual.booking.DocumentVerification"), ["$log", "SessionStore", "$state","irfNavigator", "$stateParams", "PageHelper", "IndividualLoan", "LoanBookingCommons", "Utils", "Files", "Queries", "formHelper", "$q", "$filter","PaymentBank","PayeeValidation","Enrollment","LoanAccount", "kinara.IndividualLoanHelper",
    function($log, SessionStore, $state, irfNavigator, $stateParams, PageHelper, IndividualLoan, LoanBookingCommons, Utils, Files, Queries, formHelper, $q, $filter,PaymentBank,PayeeValidation,Enrollment,LoanAccount,KinaraIndividualLoanHelper) {

        var docRejectReasons = [];
        Queries.getLoanProductDocumentsRejectReasons("individual_loan").then(function(resp){
            docRejectReasons = resp;
        });

        var formConfig = function(individual,entity,model){
            model.additional.isIndividual = individual ? true : false;
            model.additional.isEntity = entity ? true : false;
        };

        return {
            "type": "schema-form",
            "title": "DOCUMENT_VERIFICATION",
            "subTitle": " ",
            "processType": "Loan",
            "processName": "Booking",
            "lockingRequired": true,
            initialize: function(model, form, formCtrl) {
                var loanDocumentsArray=[];
                var masterDocumentsArray=[];
                var allExistingDocs=[];
                var uploadedExistingDocs=[];
                var remainingDocsArray=[];
                $log.info("Demo Customer Page got initialized");
                var showNetDisbursmentDetails = 'N';
                if (SessionStore.getGlobalSetting("loans.preOpenSummary.showNetDisbursmentDetails") == "Y") {
                    showNetDisbursmentDetails = 'Y';
                }
                model.loanView = SessionStore.getGlobalSetting("LoanViewPageName");
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                model.autoPaymentMaximumAmount = SessionStore.getGlobalSetting("payment.AutoPaymentMaximumAmount");
                var loanId = $stateParams['pageId'];
                PageHelper.showProgress('loan-load', 'Loading loan details...');
                PageHelper.showLoader();
                IndividualLoan.get({ id: $stateParams.pageId }).$promise.then(function(res) {
                    PageHelper.showProgress('loan-load', 'Loading done.', 2000);
                    model.loanAccount = res;
                    uploadedExistingDocs=_.cloneDeep(res.loanDocuments);

                    model.loanAccount.disbursementTransactionType="Manual";
                    if(model.loanAccount.loanAmount > model.autoPaymentMaximumAmount){
                        model.loanAccount.isMaxLoanAmount=true;
                    }else{
                        PaymentBank.validation({ifscCode:model.loanAccount.customerBankIfscCode},
                        function(response,headersGetter){
                            //sucess
                            model.isVerifiedBank=true;
                            model.beneficiaryAccValidationStatus =true;
                            //model.loanAccount.disbursementTransactionType="Auto";
                            /**code added to make value as Manual eventhough the validation is success */
                            model.loanAccount.disbursementTransactionType="Manual";

                        },
                        function(resp){
                            model.isVerifiedBank=false;
                            model.loanAccount.disbursementTransactionType="Manual";
                        });
                    }

                 
                    /* DO BASIC VALIDATION */
                    if (res.currentStage!= 'DocumentVerification'){
                        PageHelper.showProgress('load-loan', 'Loan is in different Stage', 2000);
                        irfNavigator.goBack();
                        return;
                    }
                    if(model.siteCode == 'kinara' && model.loanAccount.linkedAccountNumber && (model.loanAccount.transactionType=='Internal Foreclosure' || model.loanAccount.transactionType=='Loan Transfer')){
                        if (_.has(res, 'disbursementSchedules') &&
                        _.isArray(res.disbursementSchedules) &&
                        res.disbursementSchedules.length > 0 &&
                        res.numberOfDisbursed < res.disbursementSchedules.length){
                        model._currentDisbursement = res.disbursementSchedules[res.numberOfDisbursed];
                       // model._currentDisbursement.precloseurePayOffAmountWithDue =model._currentDisbursement.linkedAccountTotalPrincipalDue +model._currentDisbursement.linkedAccountNormalInterestDue + model._currentDisbursement.linkedAccountPenalInterestDue+model._currentDisbursement.linkedAccountTotalFeeDue;
                        model._currentDisbursement.precloseurePayOffAmountWithDue=model._currentDisbursement.linkedAccountPayOffAmountWithDue; 
                        }
                    }
                    if(model.loanAccount.disbursementSchedules && model.loanAccount.disbursementSchedules.length)
                    {
                        model.loanAccount.disbursementSchedules[0].party = model.loanAccount.disbursementSchedules[0].party || 'CUSTOMER';
                    }
                    if (showNetDisbursmentDetails == "Y") {
                        /** if there is LinkedAccount : getting the details */
                        if (!(_.isNull(model.loanAccount.transactionType))) {
                            LoanAccount.get({
                               accountId: model.loanAccount.linkedAccountNumber
                           })
                           .$promise.then(function(res){
                               model.linkedAccountCbsData=res;
                           },function(err){
                               $log.info("loan request Individual/find api failure" + err);
                           });
                        }
                        KinaraIndividualLoanHelper.computePreOpenFeeData(model);
                    }
                    var loanDocuments = model.loanAccount.loanDocuments;
                    var availableDocCodes = [];
                    LoanBookingCommons.getDocsForProduct(model.loanAccount.productCode, "LoanBooking", "DocumentUpload").then(function(docsForProduct) {
                        $log.info(docsForProduct);

                        masterDocumentsArray=docsForProduct;
                        for(var i=0;i<masterDocumentsArray.length;i++){
                            var pushFlag = true;
                            if (uploadedExistingDocs && uploadedExistingDocs.length) {
                                for(var j=0;j<uploadedExistingDocs.length;j++){
                                    if (!uploadedExistingDocs[j]) continue;
                                    if(masterDocumentsArray[i].document_code == uploadedExistingDocs[j].document){
                                        allExistingDocs.push({
                                            "documentId": uploadedExistingDocs[j].documentId,
                                            "id": uploadedExistingDocs[j].id,
                                            "loanId": uploadedExistingDocs[j].loanId,
                                            "$title": masterDocumentsArray[i].document_description ||
                                                masterDocumentsArray[i].document_name ||
                                                masterDocumentsArray[i].document_code,
                                            "$downloadRequired": masterDocumentsArray[i].download_required,
                                            "$mandatory": masterDocumentsArray[i].mandatory,
                                            "isHidden": false,
                                            "documentStatus": uploadedExistingDocs[j].documentStatus,
                                            "remarks":uploadedExistingDocs[j].remarks,
                                            "rejectReason":uploadedExistingDocs[j].rejectReason,
                                            "document":uploadedExistingDocs[j].document
                                        });
                                        pushFlag=false;
                                        uploadedExistingDocs[j]=null;
                                    }
                                }
                            }
                            if(pushFlag){
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
                                    "remarks":null,
                                    "rejectReason":null,
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
                                        "$downloadRequired": false,
                                        "$mandatory": null,
                                        "isHidden": false,
                                        "documentStatus": uploadedExistingDocs[i].documentStatus,
                                        "remarks":uploadedExistingDocs[i].remarks,
                                        "rejectReason":uploadedExistingDocs[i].rejectReason,
                                        "document":uploadedExistingDocs[i].document
                                    });
                                }
                            }
                        }

                        model.remainingDocsArray = remainingDocsArray;
                        model.allExistingDocs = allExistingDocs;

                        for (var i = 0; i < loanDocuments.length; i++) {
                            availableDocCodes.push(loanDocuments[i].document);
                            var documentObj = LoanBookingCommons.getDocumentDetails(docsForProduct, loanDocuments[i].document);
                            if (documentObj != null) {
                                loanDocuments[i].$title = documentObj.document_name;
                            } else {
                                if (_.hasIn(loanDocuments[i],'document') && _.isString(loanDocuments[i].document)){
                                    loanDocuments[i].$title = loanDocuments[i].document;
                                } else {
                                    loanDocuments[i].$title = "DOCUMENT_TITLE_NOT_MAINTAINED";
                                }
                            }
                        }
                        PageHelper.hideLoader();
                    },

                    function(httpRes) {
                        PageHelper.hideLoader();
                    });
                    model.additional = {};
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
                });
            },
            form: [{
                "type": "box",
                "title": "DISBURSEMENT_DETAILS",
                "colClass": "col-sm-12",
                "items": [{
                    "type": "fieldset",
                    "title": "DISBURSEMENT_ACCOUNT_DETAILS",
                    "items": [
                    {
                        "type": "section",
                        "htmlClass": "alert alert-warning",
                        "condition": "model.beneficiaryAccValidationRes.Body.status=='Failed'",
                        "html":"<h4><i class='icon fa fa-warning'></i>Beneficiary Validation Failed!</h4> {{model.beneficiaryAccValidationRes.Body.remarks}}"
                    },
                    {
                        "type": "section",
                        "htmlClass": "alert alert-success",
                        "condition": "model.beneficiaryAccValidationRes.Body.status=='Success'",
                        "html":"<h4><i class='icon fa fa-check'></i>Beneficiary Validation Success </h4> {{model.beneficiaryAccValidationRes.Body.remarks}}"
                    },
                    {
                        "key": "loanAccount.disbursementSchedules[0].party",
                        "type": "text",
                        "readonly":true,
                        "title":"PARTY"
                    }, {
                        key: "loanAccount.disbursementSchedules[0].customerNameInBank",
                        title: "CUSTOMER_NAME_IN_BANK",
                        "readonly":true
                    }, 
                    {
                        key: "loanAccount.disbursementSchedules[0].mobilePhone",
                        title: "CUSTOMER_MOBILE_NUMBER",
                        "readonly":true
                    }, {
                        key: "loanAccount.customerBankAccountNumber",
                        title: "CUSTOMER_BANK_ACC_NO",
                        "readonly":true
                    }, {
                        key: "loanAccount.customerBankIfscCode",
                        title: "CUSTOMER_BANK_IFSC",
                        "readonly":true
                    }, {
                        key: "loanAccount.customerBank",
                        "readonly":true,
                        title: "CUSTOMER_BANK"
                    }, {
                        key: "loanAccount.customerBranch",
                        "readonly":true,
                        title: "BRANCH_NAME"
                    },
                    {
                        "key": "loanAccount.disbursementTransactionType",
                        "title": "PAYMENT_MODE",
                        "lovonly": true,
                        "type": "lov",
                        bindMap: {
                         "IfscCode": "loanAccount.customerBankIfscCode",
                        },
                        autolov: true,
                        required: true,
                        searchHelper: formHelper,
                        search: function(inputModel, form, model, context) {
                            var out = [{mode: "Manual"}];
                            if(model.isVerifiedBank && !model.loanAccount.isMaxLoanAmount){
                                out.push({
                                    mode: "Auto"
                                });
                            }
                            return $q.resolve({
                                headers: {
                                    "x-total-count": out.length
                                },
                                body: out
                            });
                        },
                        onSelect: function(valueObj, model, context) {
                            model.loanAccount.disbursementTransactionType = valueObj.mode;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.mode
                            ];
                        },
                        onChange: function(value, form, model) {

                        }
                    },
                    {
                        key: "loanAccount.payeeValidationButton",
                        "type": "button",
                        title: "BENEFICIARY_VALIDATION",
                        "condition": "model.beneficiaryAccValidationStatus && model.isVerifiedBank && !model.loanAccount.isMaxLoanAmount && model.loanAccount.disbursementTransactionType=='Auto'",
                        "onClick": "actions.payeeValidation(model, formCtrl, form, $event)"
                    },
                    {
                        key: "beneficiaryAccValidationRes.Body.remarks",
                        "condition":"model.beneficiaryAccValidationRes.Body.remarks!= 'null'",
                        title: "Validation Description",
                        "readonly":true
                    }
                ]
                }]
            },{
                "type":"box",
                "title":"ACH_ACCOUNT_DETAILS",
                readonly: true,
                "condition":"model.loanAccount.collectionPaymentType=='ACH'",
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
                    }
                ]
            },
            {
                "type": "box",
                "colClass": "col-sm-12",
                "title": "DOCUMENT_VERIFICATION",
                "htmlClass": "text-danger",
                "items": [
                     {
                            "type": "fieldset",
                            "title": "View Loan Details",
                            "condition":"model.loanAccount.id",
                            "items": [{
                                key: "loanAccount.ViewLoan",
                                type: "button",
                                title: "View Loan",
                                required: true,
                                onClick: "actions.viewLoan(model, formCtrl, form, $event)"
                            }]
                    },
                    {
                        "key": "_queue.centreName",
                        "title": "CENTRE",
                        "readonly": true
                    }, {
                        "key": "_queue.customerName",
                        "title": "ENTITY_NAME",
                        "condition":"model.additional.isEntity",
                        "readonly": true
                    },

                    {
                        "key": "_queue.accountNumber",
                        "title": "ACCOUNT_NUMBER",
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
                                var fileUrl = IndividualLoan.getAllDocumentsUrl(model.loanAccount.id);
                                Utils.downloadFile(fileUrl);
                        }
                    },  //allExistingDocs form
                    {
                        "type": "fieldset",
                        "title": "DOCUMENT_VERIFICATION",
                        "items": [{
                            "type": "array",
                            "notitle": true,
                            "view": "fixed",
                            "key": "allExistingDocs",
                            "add": null,
                            "remove": null,
                            "items": [{
                                "type": "section",
                                "htmlClass": "row",
                                "items": [{
                                    "type": "section",
                                    "htmlClass": "col-sm-3",
                                    "items": [{
                                        "key": "allExistingDocs[].$title",
                                        "notitle": true,
                                        "title": " ",
                                        "readonly": true
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-2",
                                    "condition":"model.allExistingDocs[arrayIndex].documentId",
                                    "key": "allExistingDocs[].downloadRequired",
                                    "items": [{
                                        "title": "DOWNLOAD_FORM",
                                        "fieldHtmlClass": "btn-block",
                                        "style": "btn-default",
                                        "icon": "fa fa-download",
                                        "type": "button",
                                        "readonly": false,
                                        "key": "allExistingDocs[].documentId",
                                        "onClick": function(model, form, schemaForm, event) {
                                            var fileId = model.allExistingDocs[schemaForm.arrayIndex].documentId;
                                            Utils.downloadFile(Files.getFileDownloadURL(fileId));
                                        }
                                    }]
                                },
                                {
                                    "type": "section",
                                    "htmlClass": "col-sm-2",
                                    "condition":"!model.allExistingDocs[arrayIndex].documentId",
                                    "key": "allExistingDocs[].downloadRequired",
                                    "items": [{
                                        "title": "No File",
                                        "fieldHtmlClass": "btn-block",
                                        "style": "btn-default",
                                        "icon": "fa fa-download",
                                        "type": "button",
                                        "readonly": false,
                                        "key": "allExistingDocs[].documentId",
                                        "onClick": function(model, form, schemaForm, event) {
                                        }
                                    }]
                                },{
                                    "type": "section",
                                    "htmlClass": "col-sm-2",
                                    "items": [{
                                        "key": "allExistingDocs[].documentStatus",
                                        "title": "Status",
                                        "notitle": true,
                                        "type": "select",
                                        "titleMap": [{
                                            value: "REJECTED",
                                            name: "Rejected"
                                        }, {
                                            value: "APPROVED",
                                            name: "Approved"
                                        }]
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-3",
                                    "condition": "model.allExistingDocs[arrayIndex].documentStatus === 'REJECTED'",
                                    "items": [{
                                        title: "Reason",
                                        notitle: true,
                                        placeholder: "Reason",
                                        key: "allExistingDocs[].rejectReason",
                                        type: "lov",
                                        lovonly: true,
                                        searchHelper: formHelper,
                                        search: function(inputModel, form, model, context) {
                                            var f = $filter('filter')(docRejectReasons, {"document_code": model.allExistingDocs[context.arrayIndex].document},true);
                                            return $q.resolve({
                                                "header": {
                                                    "x-total-count": f && f.length
                                                },
                                                "body": f
                                            });
                                        },
                                        getListDisplayItem: function(item, index) {
                                            return [item.reject_reason];
                                        },
                                        onSelect: function(result, model, context) {
                                            model.allExistingDocs[context.arrayIndex].rejectReason = result.reject_reason;
                                        }
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-2",
                                    "condition": "model.allExistingDocs[arrayIndex].documentStatus === 'REJECTED'",
                                    "items": [{
                                        title: "Remarks",
                                        notitle: true,
                                        placeholder: "Remarks",
                                        key: "allExistingDocs[].remarks"
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-5",
                                    "condition": "model.allExistingDocs[arrayIndex].documentStatus !== 'REJECTED'",
                                    "items": [{
                                        title: "Remarks",
                                        notitle: true,
                                        placeholder: "Remarks",
                                        key: "allExistingDocs[].remarks"
                                    }]
                                }]
                            }]
                        }]
                    },
                    { // remaining docs array
                        "type": "fieldset",
                        "title": "Additional Documents",
                        "items": [{
                            "type": "array",
                            "notitle": true,
                            "view": "fixed",
                            "key": "remainingDocsArray",
                            "add": null,
                            "remove": null,
                            "items": [{
                                "type": "section",
                                "htmlClass": "row",
                                "items": [{
                                    "type": "section",
                                    "htmlClass": "col-sm-3",
                                    "items": [{
                                        "key": "remainingDocsArray[].$title",
                                        "notitle": true,
                                        "title": " ",
                                        "readonly": true
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-2",
                                    "condition":"model.remainingDocsArray[arrayIndex].documentId",
                                    "key": "allExistingDocs[].downloadRequired",
                                    "items": [{
                                        "title": "DOWNLOAD_FORM",
                                        "fieldHtmlClass": "btn-block",
                                        "style": "btn-default",
                                        "icon": "fa fa-download",
                                        "type": "button",
                                        "readonly": false,
                                        "key": "remainingDocsArray[].documentId",
                                        "onClick": function(model, form, schemaForm, event) {
                                            var fileId = model.remainingDocsArray[schemaForm.arrayIndex].documentId;
                                            if(fileId){
                                                Utils.downloadFile(Files.getFileDownloadURL(fileId));
                                            }
                                        }
                                    }]
                                },
                                {
                                    "type": "section",
                                    "htmlClass": "col-sm-2",
                                    "condition":"!model.remainingDocsArray[arrayIndex].documentId",
                                    "key": "remainingDocsArray[].downloadRequired",
                                    "items": [{
                                        "title": "No File",
                                        "fieldHtmlClass": "btn-block",
                                        "style": "btn-default",
                                        "icon": "fa fa-download",
                                        "type": "button",
                                        "readonly": false,
                                        "key": "remainingDocsArray[].documentId",
                                        "onClick": function(model, form, schemaForm, event) {
                                        }
                                    }]
                                },
                                {
                                    "type": "section",
                                    "htmlClass": "col-sm-2",
                                    "condition": "model.remainingDocsArray[arrayIndex].documentStatus === 'REJECTED'",
                                    "items": [{
                                        title: "Remarks",
                                        notitle: true,
                                        placeholder: "Remarks",
                                        key: "remainingDocsArray[].remarks"
                                    }]
                                },

                            ]
                            }]
                        }]
                    }
                ]   // END of box items
            },
            {
                "type": "box",
                "readonly":true,
                "title": "INTERNAL_FORE_CLOSURE_DETAILS",
                "condition": "model.siteCode == 'kinara' && model.loanAccount.linkedAccountNumber && model.loanAccount.transactionType=='Internal Foreclosure'",
                "items": [{
                    "key": "loanAccount.linkedAccountNumber",
                    "title":"LINKED_ACCOUNT_NUMBER",
                    "readonly":true
                },
                 {
                    "key":"loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6",
                    "title":"OTHER_LINKED_ACCOUNTS",
                    "readonly":true,
                },
                {
                    "key": "_currentDisbursement.customerSignatureDate",
                    "title": "CUSTOMER_SIGNATURE_DATE",
                    "type": "date",
                    "readonly":true
                },
                {
                    "key": "_currentDisbursement.scheduledDisbursementDate",
                    "title": "SCHEDULED_DISBURSEMENT_DATE",
                    "type": "date",
                    "readonly":true
                },
                {
                    "key": "loanAccount.firstRepaymentDate",
                    "title": "REPAYMENT_DATE",
                    "type": "date",
                    "readonly":true
                },{
                    "key": "loanAccount.transactionType",
                    "title":"TRANSACTION_TYPE",
                    "readonly":true,
                },{
                    "type":"fieldset",
                    "items":[
                    {
                        "key": "_currentDisbursement.precloseurePayOffAmountWithDue",
                        "title": "PAYOFF_AMOUNT_WITH_DUE",
                        "readonly": true,
                    },{
                        "key": "_currentDisbursement.linkedAccountTotalPrincipalDue",
                        "title": "TOTAL_PRINCIPAL_DUE",
                        "readonly": true
                    }, {
                        "key": "_currentDisbursement.linkedAccountNormalInterestDue",
                        "title": "TOTAL_INTEREST_DUE",
                        "readonly": true,
                    },{
                        "key": "_currentDisbursement.linkedAccountPenalInterestDue",
                        "title": "TOTAL_PENAL_INTEREST_DUE",
                        "readonly": true
                    }, {
                        "key": "_currentDisbursement.linkedAccountTotalFeeDue",
                        "title": "TOTAL_FEE_DUE",
                        "readonly": true,
                    }
                    ]
                },
                {
                    "type": "fieldset",
                    "readonly":true,
                    "title": "WAIVER_DETAILS",
                    "items": [{
                        "key": "_currentDisbursement.normalInterestDuePayment",
                        "title": "TOTAL_INTEREST_DUE"
                    }, {
                        "key": "_currentDisbursement.penalInterestDuePayment",
                        "title": "TOTAL_PENAL_INTEREST_DUE"
                    }, {
                        "key": "_currentDisbursement.feeAmountPayment",
                        "title": "TOTAL_FEE_DUE"
                    }]
                }
                ]
            },
            {
                "type": "box",
                "readonly":true,
                "title": "LOAN_TRANSFER_DETAILS",
                "condition": "model.siteCode == 'kinara' && model.loanAccount.linkedAccountNumber && model.loanAccount.transactionType=='Loan Transfer'",
                "items": [{
                    "key": "loanAccount.linkedAccountNumber",
                    "title":"LINKED_ACCOUNT_NUMBER",
                    "readonly":true
                }, 
                {
                    "key":"loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6",
                    "title":"OTHER_LINKED_ACCOUNTS",
                    "readonly":true,
                }, 
                {
                    "key": "_currentDisbursement.customerSignatureDate",
                    "title": "CUSTOMER_SIGNATURE_DATE",
                    "type": "date",
                    "readonly":true
                },
                {
                    "key": "_currentDisbursement.scheduledDisbursementDate",
                    "title": "SCHEDULED_DISBURSEMENT_DATE",
                    "type": "date",
                    "readonly":true
                },
                {
                    "key": "loanAccount.firstRepaymentDate",
                    "title": "REPAYMENT_DATE",
                    "type": "date",
                    "readonly":true
                },{
                    "key": "loanAccount.transactionType",
                    "title":"TRANSACTION_TYPE",
                    "readonly":true,
                },{
                    "type":"fieldset",
                    "items":[
                    {
                        "key": "_currentDisbursement.precloseurePayOffAmountWithDue",//here
                        "title": "PAYOFF_AMOUNT_WITH_DUE",
                        "readonly": true,
                    },{
                        "key": "_currentDisbursement.linkedAccountTotalPrincipalDue",
                        "title": "TOTAL_PRINCIPAL_DUE",
                        "readonly": true
                    }, {
                        "key": "_currentDisbursement.linkedAccountNormalInterestDue",
                        "title": "TOTAL_INTEREST_DUE",
                        "readonly": true,
                    },{
                        "key": "_currentDisbursement.linkedAccountPenalInterestDue",
                        "title": "TOTAL_PENAL_INTEREST_DUE",
                        "readonly": true
                    }, {
                        "key": "_currentDisbursement.linkedAccountTotalFeeDue",
                        "title": "TOTAL_FEE_DUE",
                        "readonly": true,
                    },{
                        
                        "key": "linkedAccountCbsData.securityDeposit",
                        "title": "SECURITY_DEPOSIT",
                        "readonly": true,
                    }
                    ]
                },
                {
                    "type": "fieldset",
                    "readonly":true,
                    "title": "WAIVER_DETAILS",
                    "items": [{
                        "key": "_currentDisbursement.normalInterestDuePayment",
                        "title": "TOTAL_INTEREST_DUE"
                    }, {
                        "key": "_currentDisbursement.penalInterestDuePayment",
                        "title": "TOTAL_PENAL_INTEREST_DUE"
                    }, {
                        "key": "_currentDisbursement.feeAmountPayment",
                        "title": "TOTAL_FEE_DUE"
                    }]
                }
                ]
            },
            /** removed for teporal fix
            {
                "type": "box",
                "title": "ACTUAL_NET_DISBURSEMENT",
                "condition": "!model.showPreOpenData && model.siteCode == 'kinara'",
                "order":10,
               // "condition": "model.currentStage=='Screening'||model.currentStage=='Dedupe'||model.currentStage=='ScreeningReview'||model.currentStage=='Application'||model.currentStage=='ApplicationReview'||model.currentStage=='FieldAppraisal'||model.currentStage=='FieldAppraisalReview'||model.currentStage=='ZonalRiskReview'|| model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview' || model.currentStage=='Sanction' || model.currentStage=='Rejected'",
                "items": [
                    // {
                    //     key: "preOpenFeeData.loanAmountBasedOnRequested",
                    //     "type": "amount",
                    //     "title": "Loan Recommended",
                    //     readonly:true
                    // },
                    {
                        key:"preOpenFeeData.loanAmount",
                        "type": "amount",
                        "title": "LOAN_AMOUNT",
                        readonly: true,
                    },
                    {
                       key: "preOpenFeeData.expectedProcessingFee",
                       "type": "amount",
                        "title": "Actual Processing Fee",
                        readonly:true
                    },
                    {
                       key: "preOpenFeeData.expectedCommercialCibilCharges",
                       "type": "amount",
                        "title": "Actual CIBIL Charges",
                       readonly:true
                    },
                     {
                        key: "preOpenFeeData.expectedSecurityEMI",
                        "type": "amount",
                         "title": "Actual Security EMI",
                         readonly:true
                     },
                     {
                        key: "preOpenFeeData.expectedPortfolioInsuranceAmount",
                        "type": "amount",
                         "title": "Actual Portfolio Insurance with GST",
                         readonly:true
                     },
                     {
                        key: "preOpenFeeData.payoffAmountForLinkedAccount",
                        "type": "amount",
                         "title": "Actual Payoff for linked account",
                         readonly:true
                     },
                     {
                        key: "preOpenFeeData.documentCharges",
                        "type": "amount",
                         "title": "Actual Documentation Charges",
                         readonly:true
                     },
                     {
                        key: "preOpenFeeData.netDisbursementAmount",
                        "type": "amount",
                         "title": "Actual Disbursable Amount",
                         readonly:true
                     },
                ]
            },
            **/
            {
                "type": "box",
                "title": "POST_REVIEW",
                "condition": "model.loanAccount.id",
                "items": [
                    {
                        key: "review.action",
                        type: "radios",
                        titleMap: {
                            "REJECT": "REJECT",
                            "SEND_BACK": "SEND_BACK",
                            "PROCEED": "PROCEED",
                            "HOLD": "HOLD"
                        }
                    },
                    {
                        type: "section",
                        condition: "model.review.action=='REJECT'",
                        items: [
                            {
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
                                required: true
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
                                type: "textarea",
                                required: true
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
                            type: "textarea",
                            required: true
                        }, {
                            key: "review.targetStage",
                            title: "SEND_BACK_TO_STAGE",
                            type: "select",
                            required: true,
                            titleMap: {
                                "LoanInitiation": "Loan Initiation",
                                "LoanBooking": "Loan Booking",
                                "DocumentUpload":"Document Upload"

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
                                type: "textarea",
                                required: true
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
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "button",
                    "title": "BACK",
                    "onClick": "actions.goBack(model, formCtrl, form, $event)"
                }/*, {
                    "type": "submit",
                    "title": "Submit"
                }*/]
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "userRoles": {
                        "type": "object",
                        "properties": {
                            "userId": {
                                "type": "string",
                                "title": "User ID"
                            }
                        }
                    }
                }
            },
            actions: {
                payeeValidation: function(model, formCtrl, form, $event){
                    var reqData ={
                        "beneficiaryAccValidationReq": {
                            "Body": {
                                "accountNumber": model.loanAccount.customerBankAccountNumber,
                                "beneficiaryMobileNumber": model.loanAccount.disbursementSchedules[0].mobilePhone,
                                "beneficiaryName": model.loanAccount.disbursementSchedules[0].customerNameInBank.replace(/[^a-zA-Z]/g, ''),
                                "ifscCode": model.loanAccount.customerBankIfscCode
                            }
                        }
                    };
                    PageHelper.showLoader();
                    PayeeValidation.validation(reqData,function(response,headersGetter){
                        model.beneficiaryAccValidationStatus = response.beneficiaryAccValidationRes.Body.status;
                        model.beneficiaryAccValidationRes = response.beneficiaryAccValidationRes;
                        model.beneficiaryAccValidationStatus= false
                        if(response.beneficiaryAccValidationRes.Body.status=="Failed"){
                            model.beneficiaryAccValidationRes.Body.remarks =response.beneficiaryAccValidationRes.Body.Error_Desc;
                            model.loanAccount.disbursementTransactionType="Manual";
                            model.isVerifiedBank=false;
                        }

                        PageHelper.hideLoader();
                    },function(httpRes){
                        PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                        PageHelper.showErrors(httpRes);
                        PageHelper.hideLoader();
                    });


                },
                reject: function(model, formCtrl, form, $event){
                    $log.info("Inside reject()");
                    Utils.confirm("Are You Sure?").then(function () {
                        model.loanAccount.loanDocuments = [];

                        if (model.allExistingDocs) {

                            for (var i = 0; i < model.allExistingDocs.length; i++) {

                                if (model.allExistingDocs[i].documentId) {

                                    model.loanAccount.loanDocuments.push(model.allExistingDocs[i]);
                                }
                            }
                        }
                        if (model.remainingDocsArray && model.remainingDocsArray.length) {
                            for (var j = 0; j < model.remainingDocsArray.length; j++) {
                                if (model.remainingDocsArray[j].documentId) {
                                    model.loanAccount.loanDocuments.push(model.remainingDocsArray[j]);
                                }
                            }
                        }

                        var reqData = { loanAccount: _.cloneDeep(model.loanAccount) };
                        reqData.loanAccount.status = '';
                        reqData.loanProcessAction = "PROCEED";
                        reqData.stage = "Rejected";
                        reqData.remarks = model.review.remarks;
                        PageHelper.showLoader();
                        PageHelper.showProgress("update-loan", "Working...");
                        IndividualLoan.update(reqData)
                            .$promise
                            .then(function (res) {
                                PageHelper.showProgress("update-loan", "Done.", 3000);
                                $state.go('Page.Engine', {
                                    pageName: 'loans.individual.booking.PendingVerificationQueue'
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
                holdButton: function(model, formCtrl, form, $event){
                    $log.info("Inside save()");
                    Utils.confirm("Are You Sure?")
                        .then(
                        function () {

                            model.loanAccount.loanDocuments = [];

                            if (model.allExistingDocs) {
                                replaceFlag = false;
                                for (var i = 0; i < model.allExistingDocs.length; i++) {

                                    if (model.allExistingDocs[i].documentId) {

                                        model.loanAccount.loanDocuments.push(model.allExistingDocs[i]);
                                    }
                                }
                            }
                            if (model.remainingDocsArray && model.remainingDocsArray.length) {
                                for (var j = 0; j < model.remainingDocsArray.length; j++) {
                                    if (model.remainingDocsArray[j].documentId) {
                                        model.loanAccount.loanDocuments.push(model.remainingDocsArray[j]);
                                    }
                                }
                            }
                            var reqData = { loanAccount: _.cloneDeep(model.loanAccount) };
                            reqData.loanAccount.status = 'HOLD';
                            reqData.loanProcessAction = "SAVE";
                            reqData.remarks = model.review.remarks;
                            PageHelper.showLoader();
                            IndividualLoan.create(reqData)
                                .$promise
                                .then(function (res) {
                                    $state.go('Page.Engine', {
                                        pageName: 'loans.individual.booking.PendingVerificationQueue'
                                    });
                                }, function (httpRes) {
                                    PageHelper.showErrors(httpRes);
                                })
                                .finally(function (httpRes) {
                                    PageHelper.hideLoader();
                                })
                        }
                        );
                },
                viewLoan: function(model, formCtrl, form, $event) {
                    Utils.confirm("Save the data before proceed").then(function() {
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
                                pageId: model.loanAccount.id
                            }, {
                                state: "Page.Engine",
                                pageName: "loans.individual.booking.DocumentVerification",
                                pageId: model.loanAccount.id
                            });
                        }
                    });
                },
                sendBack: function(model, formCtrl, form, $event){
                    $log.info("Inside sendBack()");
                    if(_.isEmpty(model.review.remarks) || _.isEmpty(model.review.targetStage)) {
                        PageHelper.showProgress("update-loan", "Please Enter Remarks and Stage.", 3000);
                        return false;
                    }
                    Utils.confirm("Are You Sure?").then(function(){
                        model.loanAccount.loanDocuments=[];
                        if (model.allExistingDocs) {
                            for(var i=0;i< model.allExistingDocs.length;i++){
                                if( model.allExistingDocs[i].documentId){
                                    model.loanAccount.loanDocuments.push(model.allExistingDocs[i]);
                                }
                            }
                         }
                         if (model.remainingDocsArray && model.remainingDocsArray.length) {
                                for (var j = 0; j < model.remainingDocsArray.length; j++) {
                                    if(model.remainingDocsArray[j].documentId){
                                        model.remainingDocsArray[j].document=model.remainingDocsArray[j].$title;
                                        model.loanAccount.loanDocuments.push(model.remainingDocsArray[j]);
                                    }
                                }
                            }
                        var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                        reqData.loanAccount.status = '';
                        reqData.loanProcessAction = "PROCEED";
                        reqData.remarks = model.review.remarks;
                        reqData.stage = model.review.targetStage;
                        reqData.remarks = model.review.remarks;
                        PageHelper.showLoader();
                        PageHelper.showProgress("update-loan", "Working...");
                        IndividualLoan.update(reqData)
                            .$promise
                            .then(function(res){
                                PageHelper.showProgress("update-loan", "Done.", 3000);
                                $state.go('Page.Engine', {
                                    pageName: 'loans.individual.booking.PendingVerificationQueue'
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
                proceed: function (model, form, formName) {
                    if (PageHelper.isFormInvalid(form)) {
                        return false;
                    }
                    var showNetDisbursmentDetails = 'N';
                    if (SessionStore.getGlobalSetting("loans.preOpenSummary.showNetDisbursmentDetails") == "Y") {
                        showNetDisbursmentDetails = 'Y';
                    }
                    if (showNetDisbursmentDetails == "Y") {
                        if (model.preOpenFeeData.netDisbursementAmount < 0) {
                            PageHelper.setError({
                                message: "disubrsement amount can not be less than : 0"
                            });
                            return;
                        }
                    }
                    if(model.loanAccount.disbursementTransactionType=="Auto"){
                        if(model.beneficiaryAccValidationRes){
                            if(model.beneficiaryAccValidationRes.Body.status.toUpperCase() != 'Success'.toUpperCase()){
                                PageHelper.showProgress('update-loan', 'Perform beneficiary Validation', 3000);
                                return false;
                            }
                        }else{
                            PageHelper.showProgress('update-loan', 'Perform beneficiary Validation', 3000);
                            return false;
                        }
                    }
                    model.loanAccount.loanDocuments=[];
                    model.loanAccount.tempMasterDocuments = [];


                    if (model.allExistingDocs) {
                        for(var i=0;i< model.allExistingDocs.length;i++){
                            if( model.allExistingDocs[i].documentId){
                                model.loanAccount.tempMasterDocuments.push(model.allExistingDocs[i]);
                                model.loanAccount.loanDocuments.push(model.allExistingDocs[i]);
                            }
                        }
                     }
                     if (model.remainingDocsArray && model.remainingDocsArray.length) {
                            for (var j = 0; j < model.remainingDocsArray.length; j++) {
                                if(model.remainingDocsArray[j].documentId){
                                    model.remainingDocsArray[j].document=model.remainingDocsArray[j].$title;
                                    model.loanAccount.loanDocuments.push(model.remainingDocsArray[j]);
                                }
                            }
                        }

                    var reqParamData = {
                        'loanAccount': _.cloneDeep(model.loanAccount),
                        'loanProcessAction': 'PROCEED',
                        "remarks": model.review.remarks
                    };
                    var allowedStatues = ['APPROVED', 'REJECTED'];
                    reqParamData.loanAccount.status = null;
                     var redirectToUploadFlag = false;
                    for (var i = 0; i < reqParamData.loanAccount.tempMasterDocuments.length; i++) {
                        var doc = reqParamData.loanAccount.tempMasterDocuments[i];
                        if (_.indexOf(allowedStatues, doc.documentStatus) == -1) {
                            PageHelper.showProgress('update-loan', 'Invalid document status selected. Only Approved or Rejected are allowed.', 3000);
                            return;
                        }

                        if (doc.documentStatus == 'REJECTED') {
                            redirectToUploadFlag = true;
                        }
                    }
                    if (redirectToUploadFlag == true) {
                        reqParamData['stage'] = 'DocumentUpload';
                    }

                    PageHelper.showProgress('update-loan', 'Working...');
                    PageHelper.showLoader();
                    console.log(JSON.stringify(reqParamData));
                    return IndividualLoan.update(reqParamData)
                        .$promise
                        .then(
                            function (res) {
                                PageHelper.showProgress('update-loan', 'Done.', 2000);
                                $state.go('Page.Engine', {
                                    pageName: 'loans.individual.booking.PendingVerificationQueue'
                                });
                                return;
                            },
                            function (httpRes) {
                                PageHelper.showProgress('update-loan', 'Unable to proceed.', 2000);
                                PageHelper.showErrors(httpRes);
                            }
                        )
                        .finally(function () {
                            PageHelper.hideLoader();
                        })
                },
                goBack: function(model, formCtrl, form, $event) {
                    // $state.go("Page.Engine", {
                    //     pageName: 'loans.individual.booking.PendingVerificationQueue',
                    //     pageId: null
                    // });
                    irfNavigator.goBack();
                }
            }
        };
    }
]);
