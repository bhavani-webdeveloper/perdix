irf.pageCollection.factory(irf.page("loans.individual.disbursement.GenerateEMISchedule"), 
    ["$log", "SchemaResource", "SessionStore", "$state", '$stateParams', 'PageHelper', 'IndividualLoan', 'Queries', 'Utils', "formHelper", "CustomerBankBranch","LoanProcess",
    function($log, SchemaResource, SessionStore, $state, $stateParams, PageHelper, IndividualLoan, Queries, Utils, formHelper, CustomerBankBranch,LoanProcess) {


        var getDocument = function(docsArr, docCode) {
            var i = 0;
            for (i = 0; i < docsArr.length; i++) {
                if (docsArr[i].docCode == docCode) {
                    return docsArr[i];
                }
            }
            return null;
        }

        return {
            "type": "schema-form",
            "title": "UPLOAD_DOCUMENT",
            "subTitle": " ",
            initialize: function(model, form, formCtrl) {
                $log.info("Multi Tranche Upload Document Page got initialized");

                if (!model._EMIScheduleGenQueue) {
                    $log.info("Screen directly launched hence redirecting to queue screen");
                    $state.go('Page.Engine', {
                        pageName: 'loans.individual.disbursement.EMIScheduleGenQueue',
                        pageId: null
                    });
                    return;
                }
                model.loanAccountDisbursementSchedule = {};
                model.loanAccountDisbursementSchedule = _.cloneDeep(model._EMIScheduleGenQueue);
                model.loanAccountDisbursementSchedule.party = model.loanAccountDisbursementSchedule.party || 'CUSTOMER';

                PageHelper.showProgress('loan-load', 'Loading details...');
                PageHelper.showLoader();
                IndividualLoan.get({
                        id: model.loanAccountDisbursementSchedule.loanId
                    })
                    .$promise
                    .then(
                        function(res) {
                            PageHelper.showProgress('loan-load', 'Loading done.', 2000);
                            model.loanAccount = res;
                            $log.info("Loan account fetched");
                            $log.info(res);

                            Queries.getLoanProductDocuments(model.loanAccount.productCode, "MultiTranche", "DocumentUpload")
                                .then(
                                    function(docs) {
                                        $log.info("document fetched");
                                        $log.info(docs);
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

                                        model.individualLoanDocuments = model.individualLoanDocuments || [];
                                        $log.info("printing");
                                        $log.info(model.individualLoanDocuments);

                                        var loanDocuments = model.individualLoanDocuments;
                                        var availableDocCodes = [];
                                        $log.info("Number of documents: " + loanDocuments.length);
                                        $log.info("docsForProduct length: " + docsForProduct.length);
                                        $log.info("availableDocCodes length: " + availableDocCodes.length);

                                        for (var i = 0; i < loanDocuments.length; i++) {
                                            availableDocCodes.push(loanDocuments[i].document_code);
                                            $log.info(loanDocuments[i]);
                                            var documentObj = getDocument(docsForProduct, loanDocuments[i].document_code);
                                            if (_.isObject(documentObj)) {
                                                $log.info("going to set value");
                                                loanDocuments[i].$title = documentObj.docTitle;
                                                loanDocuments[i].$key = documentObj.formsKey;
                                            } else {
                                                $log.info("in else");
                                                $log.info(loanDocuments);
                                                loanDocuments[i].$title = "DOCUMENT TITLE NOT MAINTAINED";
                                            }

                                        }

                                        for (var i = 0; i < docsForProduct.length; i++) {
                                            if (_.indexOf(availableDocCodes, docsForProduct[i].docCode) == -1) {
                                                loanDocuments.push({
                                                    document: docsForProduct[i].docCode,
                                                    $downloadRequired: docsForProduct[i].downloadRequired,
                                                    $title: docsForProduct[i].docTitle,
                                                    $formsKey: docsForProduct[i].formsKey,
                                                    disbursementId: model.loanAccountDisbursementSchedule.id,
                                                    loanId: model.loanAccountDisbursementSchedule.loanId,
                                                    documentStatus: "PENDING"
                                                })
                                            }
                                        }
                                        $log.info("Number of documents finally: " + loanDocuments.length);
                                        LoanProcess.generateScheduleForSpecifiedDate({
                                        // "accountNumber": model.loanAccountDisbursementSchedule.accountNumber,
                                        "loanId": model.loanAccountDisbursementSchedule.loanId,
                                        "tranchNumber": model.loanAccountDisbursementSchedule.trancheNumber,
                                        "amount":model.loanAccountDisbursementSchedule.disbursementAmount,
                                        "scheduledDisbursementDate":model.loanAccountDisbursementSchedule.scheduledDisbursementDate,
                                        "firstRepaymentDate":model.loanAccount.firstRepaymentDate
                                        })
                                            .$promise
                                            .then(function(resp) {}, function(httpRes) {
                                                PageHelper.showProgress('loan-load', 'Failed to load the EMI Schedule. Try again.', 4000);
                                                PageHelper.showErrors(httpRes);
                                            });
                                    },
                                    function(httpRes) {
                                        PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                                        PageHelper.showErrors(httpRes);
                                        PageHelper.hideLoader();
                                    }
                                )
                                .finally(function(httpRes) {

                                })
                            PageHelper.hideLoader();
                        },
                        function(httpRes) {
                            PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                            PageHelper.showErrors(httpRes);
                            PageHelper.hideLoader();
                        }
                    )
            },

            form: [

                {
                    "type": "box",
                    "title": "DISBURSEMENT_DETAILS",
                    "colClass": "col-sm-12",
                    "items": [{
                        "type": "fieldset",
                        "title": "DISBURSEMENT_ACCOUNT_DETAILS",
                        "items": [{
                            "key": "loanAccountDisbursementSchedule.party",
                            "type": "radios",
                            "titleMap": [{
                                "name": "Customer",
                                "value": "CUSTOMER"
                            }, {
                                "name": "Vendor",
                                "value": "VENDOR"
                            }],
                            onChange: function(value, form, model) {
                                model.loanAccountDisbursementSchedule.customerAccountNumber = '';
                                model.loanAccountDisbursementSchedule.ifscCode = '';
                                model.loanAccountDisbursementSchedule.customerBankName = '';
                                model.loanAccountDisbursementSchedule.customerBankBranchName = '';
                                model.loanAccountDisbursementSchedule.customerNameInBank = '';
                            }
                        }, {
                            key: "loanAccountDisbursementSchedule.customerNameInBank",
                            title: "CUSTOMER_NAME_IN_BANK"
                        }, {
                            key: "loanAccountDisbursementSchedule.customerAccountNumber",
                            type: "lov",
                            autolov: true,
                            title: "CUSTOMER_BANK_ACC_NO",
                            "condition": "model.loanAccountDisbursementSchedule.party=='CUSTOMER'",
                            bindMap: {
                                "customerId": "loanAccount.customerId"
                            },
                            outputMap: {
                                "account_number": "loanAccountDisbursementSchedule.customerAccountNumber",
                                "ifsc_code": "loanAccountDisbursementSchedule.ifscCode",
                                "customer_bank_name": "loanAccountDisbursementSchedule.customerBankName",
                                "customer_bank_branch_name": "loanAccountDisbursementSchedule.customerBankBranchName",
                                "customer_name_as_in_bank": "loanAccountDisbursementSchedule.customerNameInBank"
                            },
                            searchHelper: formHelper,
                            search: function(inputModel, form, model) {
                                var urn = [];
                                for(var i =0; i <model.loanAccount.loanCustomerRelations.length; i++)
                                {
                                    urn.push(model.loanAccount.loanCustomerRelations[i].urn);   
                                }
                                urn.push(model.loanAccount.urnNo);
                                return Queries.getCustomersBankAccounts({
                                   customer_urns : urn,
                                   customer_ids : model.loanAccount.customerId
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
                            key: "loanAccountDisbursementSchedule.customerAccountNumber",
                            title: "CUSTOMER_BANK_ACC_NO",
                            "condition": "model.loanAccountDisbursementSchedule.party=='VENDOR'"
                        }, {
                            key: "loanAccountDisbursementSchedule.ifscCode",
                            title: "CUSTOMER_BANK_IFSC",
                            "condition": "model.loanAccountDisbursementSchedule.party=='CUSTOMER'"
                        }, {
                            key: "loanAccountDisbursementSchedule.ifscCode",
                            type: "lov",
                            lovonly: true,
                            "condition": "model.loanAccountDisbursementSchedule.party=='VENDOR'",
                            inputMap: {
                                "ifscCode": {
                                    "key": "loanAccountDisbursementSchedule.ifscCode"
                                },
                                "bankName": {
                                    "key": "loanAccountDisbursementSchedule.customerBankName"
                                },
                                "branchName": {
                                    "key": "loanAccountDisbursementSchedule.customerBankBranchName"
                                }
                            },
                            outputMap: {
                                "bankName": "loanAccountDisbursementSchedule.customerBankName",
                                "branchName": "loanAccountDisbursementSchedule.customerBankBranchName",
                                "ifscCode": "loanAccountDisbursementSchedule.ifscCode"
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
                            key: "loanAccountDisbursementSchedule.customerBankName",
                            title: "CUSTOMER_BANK"
                        }, {
                            key: "loanAccountDisbursementSchedule.customerBankBranchName",
                            title: "BRANCH_NAME"
                        }]
                    }]
                }, {
                    "type": "box",
                    "colClass": "col-sm-12",
                    "titleExpr": "('TRANCHE'|translate)+' ' + model._MTQueue.trancheNumber + ' | '+('DISBURSEMENT_DETAILS'|translate)+' | '+ model.customerName",
                    "htmlClass": "text-danger",
                    "items": [{
                        "key": "loanAccountDisbursementSchedule.scheduledDisbursementDate",
                        "title": "DISBURSEMENT_DATE",
                        "type": "date",
                        "readonly": true
                    }, {
                        "key": "loanAccountDisbursementSchedule.customerSignatureDate",
                        "title": "CUSTOMER_SIGNATURE_DATE",
                        "type": "date",
                        "readonly": true
                    }, {
                        "key": "loanAccountDisbursementSchedule.remarks1",
                        "title": "FRO_REMARKS",
                        "readonly": true
                    }, {
                        "key": "loanAccountDisbursementSchedule.remarks2",
                        "title": "CRO_REMARKS",
                        "readonly": true
                    }, {
                        "type": "array",
                        "notitle": true,
                        "view": "fixed",
                        "key": "individualLoanDocuments",
                        "startEmpty": true,
                        "add": null,
                        "remove": null,
                        "items": [{
                            "type": "section",
                            "htmlClass": "row",
                            "items": [{
                                "type": "section",
                                "htmlClass": "col-sm-3",
                                "items": [{
                                    "key": "individualLoanDocuments[].$title",
                                    "notitle": true,
                                    "titleExpr": "model.individualLoanDocuments[arrayIndex].$title",
                                    "type": "anchor",
                                    "fieldHtmlClass": "text-bold",
                                    "condition": "model.individualLoanDocuments[arrayIndex].$downloadRequired",
                                    "onClick": function(model, form, schemaForm, event) {
                                        var doc = model.individualLoanDocuments[event.arrayIndex];
                                        console.log(doc);
                                        Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=" + doc.$formsKey + "&record_id=" + model.loanAccountDisbursementSchedule.loanId);
                                    }
                                },{
                                    "key": "individualLoanDocuments[].$title",
                                    "notitle": true,
                                    "title": " ",
                                    "condition": "!model.individualLoanDocuments[arrayIndex].$downloadRequired",
                                    "readonly": true
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-2",
                                "key": "individualLoanDocuments[].documentStatus",
                                "items": [{
                                    "notitle": true,
                                    "key": "individualLoanDocuments[].documentStatus",
                                    "readonly": true
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-4",
                                "key": "individualLoanDocuments[].remarks",
                                "condition": "model.individualLoanDocuments[arrayIndex].documentStatus === 'APPROVED'",
                                "items": [{
                                    "notitle": true,
                                    "key": "individualLoanDocuments[].remarks",
                                    "readonly": true
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-4",
                                "key": "individualLoanDocuments[].documentStatus",
                                "condition": "model.individualLoanDocuments[arrayIndex].documentStatus === 'REJECTED' && !model.individualLoanDocuments[arrayIndex].remarks",
                                "items": [{
                                    "notitle": true,
                                    "key": "individualLoanDocuments[].rejectReason",
                                    "readonly": true
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-2",
                                "key": "individualLoanDocuments[].documentStatus",
                                "condition": "model.individualLoanDocuments[arrayIndex].documentStatus === 'REJECTED' && model.individualLoanDocuments[arrayIndex].remarks",
                                "items": [{
                                    "notitle": true,
                                    "key": "individualLoanDocuments[].rejectReason",
                                    "readonly": true
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-2",
                                "key": "individualLoanDocuments[].documentStatus",
                                "condition": "model.individualLoanDocuments[arrayIndex].documentStatus === 'REJECTED' && model.individualLoanDocuments[arrayIndex].remarks",
                                "items": [{
                                    "notitle": true,
                                    "key": "individualLoanDocuments[].remarks",
                                    "readonly": true
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-4",
                                "key": "individualLoanDocuments[].documentStatus",
                                "condition": "model.individualLoanDocuments[arrayIndex].documentStatus !== 'REJECTED' && model.individualLoanDocuments[arrayIndex].documentStatus !== 'APPROVED'"
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-3",
                                "items": [{
                                    title: "Upload",
                                    key: "individualLoanDocuments[].documentId",
                                    "required": true,
                                    type: "file",
                                    fileType: "*/*",
                                    category: "Loan",
                                    subCategory: "DOC1",
                                    "notitle": true
                                }]
                            }]
                        }]
                    }]
                }, {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Submit"
                    },
                    {
                    "type": "button",
                    "title": "SEND_BACK",
                    "onClick": "actions.submit(model, formCtrl, form, $event, 1)"
                    }]
                }
            ],
            schema: function() {
                return SchemaResource.getDisbursementSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName, $event, isReject) {
                    if (window.confirm("Are you sure?")) {
                        PageHelper.showLoader();
                        var reqData = _.cloneDeep(model);
                        delete reqData.$promise;
                        delete reqData.$resolved;
                        delete reqData.loanAccount;
                        delete reqData._EMIScheduleGenQueue;
                        reqData.disbursementProcessAction = "PROCEED";
                        if(isReject){
                            reqData.stage = "MTBooking";
                            delete reqData.individualLoanDocuments;
                        }
                        IndividualLoan.updateDisbursement(reqData, function(resp, header) {
                            PageHelper.showProgress("upd-disb", "Done.", "5000");
                            PageHelper.hideLoader();
                            $state.go('Page.Engine', {
                                pageName: 'loans.individual.disbursement.MultiTrancheQueue',
                                pageId: null
                            });
                        }, function(resp) {
                            PageHelper.showProgress("upd-disb", "Oops. An error occurred", "5000");
                            PageHelper.showErrors(resp);

                        }).$promise.finally(function() {
                            PageHelper.hideLoader();
                        });
                    }
                }
            }
        };
    }
]);