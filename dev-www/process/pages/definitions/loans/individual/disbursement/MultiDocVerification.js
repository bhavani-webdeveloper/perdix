irf.pageCollection.factory(irf.page("loans.individual.disbursement.MultiDocVerification"), ["$log", "SchemaResource", "SessionStore", "$state", "$stateParams", "$filter", "PageHelper", "formHelper", "IndividualLoan", "LoanBookingCommons", "Utils", "Files", "Queries", "$q",
    function($log, SchemaResource, SessionStore, $state, $stateParams, $filter, PageHelper, formHelper, IndividualLoan, LoanBookingCommons, Utils, Files, Queries, $q) {

        var docRejectReasons = [];
        Queries.getLoanProductDocumentsRejectReasons().then(function(resp){
            docRejectReasons = resp;
        });

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
            "title": "DOCUMENT_VERIFICATION",
            "subTitle": " ",
            initialize: function(model, form, formCtrl) {
                $log.info("Multi Tranche Document Verification Page got initialized");

                PageHelper.showProgress('loan-load', 'Loading loan details...');
                if (!model._DocVerifyQueue) {
                    $log.info("Screen directly launched hence redirecting to queue screen");
                    $state.go('Page.Engine', {
                        pageName: 'loans.individual.disbursement.MultiDocVerificationQueue',
                        pageId: null
                    });
                    return;
                }
                model.loanAccountDisbursementSchedule = {};
                model.loanAccountDisbursementSchedule = _.cloneDeep(model._DocVerifyQueue);
                PageHelper.showLoader();
                IndividualLoan.get({
                    id: model.loanAccountDisbursementSchedule.loanId
                }).$promise.then(function(res) {
                    PageHelper.showProgress('loan-load', 'Loading done.', 2000);
                    model.loanAccount = res;
                    $log.info("Loan account fetched");
                    Queries.getLoanProductDocuments(model.loanAccount.productCode, "MultiTranche", "DocumentUpload").then(function(docs) {
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
                        var j = 0;

                        var loanDocuments = model.individualLoanDocuments;
                        var availableDocCodes = [];
                        if (model.loanAccount.loanDocuments.length) {
                            for (var i = model.loanAccount.loanDocuments.length - 1; i >= 0; i--) {
                                if (model.loanAccount.loanDocuments[i].disbursementId != null && model.loanAccount.loanDocuments[i].documentStatus == "PENDING") {
                                    model.individualLoanDocuments[j] = model.loanAccount.loanDocuments[i];
                                }
                            }
                        }

                        for (var i = 0; i < model.individualLoanDocuments.length; i++) {
                            var documentObj = getDocument(docsForProduct, model.individualLoanDocuments[i].document);
                            if (_.isObject(documentObj)) {
                                model.individualLoanDocuments[i].$title = documentObj.docTitle;
                                model.individualLoanDocuments[i].$key = documentObj.formsKey;
                            } else {
                                loanDocuments[i].$title = "DOCUMENT TITLE NOT MAINTAINED";
                            }
                        }
                        $log.info(model.individualLoanDocuments);
                    },
                    function(httpRes) {
                        PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                        PageHelper.showErrors(httpRes);
                        PageHelper.hideLoader();
                    }).finally(function(httpRes) {

                    });
                    PageHelper.hideLoader();
                },
                function(httpRes) {
                    PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                    PageHelper.showErrors(httpRes);
                    PageHelper.hideLoader();
                });
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
                            "type": "text",
                            "readonly":true,
                            "title":"PARTY"
                        }, 
                        {
                            key: "loanAccountDisbursementSchedule.customerNameInBank",
                            title: "CUSTOMER_NAME_IN_BANK",
                            "readonly":true
                        },
                        {
                            key: "loanAccountDisbursementSchedule.customerAccountNumber",
                            title: "CUSTOMER_BANK_ACC_NO",
                            "readonly":true
                        }, 
                        {
                            key: "loanAccountDisbursementSchedule.ifscCode",
                            title: "CUSTOMER_BANK_IFSC",
                            "readonly":true
                        }, 
                        {
                            key: "loanAccountDisbursementSchedule.customerBankName",
                            title: "CUSTOMER_BANK",
                            "readonly":true
                        }, 
                        {
                            key: "loanAccountDisbursementSchedule.customerBankBranchName",
                            title: "BRANCH_NAME",
                            "readonly":true
                        }]
                    }]
                },
                {
                    "type": "box",
                    "colClass": "col-sm-12",
                    "titleExpr": "('TRANCHE'|translate)+' ' + model._MTQueue.trancheNumber + ' | '+('DISBURSEMENT_DETAILS'|translate)+' | '+ model.customerName",
                    "htmlClass": "text-danger",
                    "items": [{
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
                                    "title": " ",
                                    "readonly": true
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-2",
                                "items": [{
                                    "title": "DOWNLOAD_FORM",
                                    "notitle": true,
                                    "fieldHtmlClass": "btn-block",
                                    "style": "btn-default",
                                    "icon": "fa fa-download",
                                    "type": "button",
                                    "readonly": false,
                                    "key": "individualLoanDocuments[].documentId",
                                    "onClick": function(model, form, schemaForm, event) {
                                        var fileId = model.individualLoanDocuments[schemaForm.arrayIndex].documentId;
                                        Utils.downloadFile(Files.getFileDownloadURL(fileId));
                                    }
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-2",
                                "items": [{
                                    "key": "individualLoanDocuments[].documentStatus",
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
                                "condition": "model.individualLoanDocuments[arrayIndex].documentStatus === 'REJECTED'",
                                "items": [{
                                    title: "Reason",
                                    notitle: true,
                                    placeholder: "Reason",
                                    key: "individualLoanDocuments[].rejectReason",
                                    type: "lov",
                                    lovonly: true,
                                    searchHelper: formHelper,
                                    search: function(inputModel, form, model, context) {
                                        var f = $filter('filter')(docRejectReasons, {"document_code": model.individualLoanDocuments[context.arrayIndex].document});
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
                                        model.individualLoanDocuments[context.arrayIndex].rejectReason = result.reject_reason;
                                    }
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-2",
                                "condition": "model.individualLoanDocuments[arrayIndex].documentStatus === 'REJECTED'",
                                "items": [{
                                    title: "Remarks",
                                    notitle: true,
                                    placeholder: "Remarks",
                                    key: "individualLoanDocuments[].remarks"
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-5",
                                "condition": "model.individualLoanDocuments[arrayIndex].documentStatus !== 'REJECTED'",
                                "items": [{
                                    title: "Remarks",
                                    notitle: true,
                                    placeholder: "Remarks",
                                    key: "individualLoanDocuments[].remarks"
                                }]
                            }]
                        }]
                    }]
                }, {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Submit"
                    }]
                }
            ],
            schema: function() {
                return SchemaResource.getDisbursementSchema().$promise;
            },
            actions: {
                /*submit: function(model, form, formName){
                    var reqData = {
                        'loanAccount': _.cloneDeep(model.loanAccount),
                        'loanProcessAction': 'PROCEED'
                    };
                    var docStatuses = [];
                    var allowedStatues = ['APPROVED', 'REJECTED'];
                    var redirectToUploadFlag = false;
                    for (var i=0; i<reqData.individualLoanDocuments.length; i++){
                        var doc = reqData.individualLoanDocuments[i];
                        if (_.indexOf(allowedStatues, doc.documentStatus) == -1){
                            PageHelper.showProgress('update-loan', 'Invalid document status selected. Only Approved or Rejected are allowed.');
                            return;
                        }

                        if (doc.documentStatus == 'REJECTED'){
                            redirectToUploadFlag = true;
                        }
                    }

                    if (redirectToUploadFlag == true){
                        reqData['stage'] = 'DocumentUpload';
                    }

                    PageHelper.showProgress('update-loan', 'Working...');
                    PageHelper.showLoader();
                    console.log(JSON.stringify(reqData));
                    return IndividualLoan.update(reqData)
                        .$promise
                        .then(
                            function(res){
                                PageHelper.showProgress('update-loan', 'Done.', 2000);
                                $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingVerificationQueue'});
                                return;
                            }, function(httpRes){
                                PageHelper.showProgress('update-loan', 'Unable to proceed.', 2000);
                                PageHelper.showErrors(httpRes);
                            }
                        )
                        .finally(function(){
                            PageHelper.hideLoader();
                        })
                }*/
                submit: function(model, form, formName) {
                    if (window.confirm("Are you sure?")) {
                        PageHelper.showLoader();
                        var reqData = _.cloneDeep(model);
                        delete reqData.$promise;
                        delete reqData.$resolved;
                        delete reqData.loanAccount;
                        delete reqData._DocVerifyQueue;
                        reqData.disbursementProcessAction = "PROCEED";
                        var allowedStatues = ['APPROVED', 'REJECTED'];
                        var redirectToUploadFlag = false;
                        if (reqData.individualLoanDocuments && reqData.individualLoanDocuments.length > 0) {
                            for (var i = 0; i < reqData.individualLoanDocuments.length; i++) {
                                var doc = reqData.individualLoanDocuments[i];
                                if (_.indexOf(allowedStatues, doc.documentStatus) == -1) {
                                    PageHelper.showProgress('update-loan', 'Invalid document status selected. Only Approved or Rejected are allowed.');
                                    return;
                                }

                                if (doc.documentStatus == 'REJECTED') {
                                    redirectToUploadFlag = true;
                                }
                            }
                        }

                        if (redirectToUploadFlag == true) {
                            reqData['stage'] = 'DocumentUpload';
                        } else
                            reqData['stage'] = 'ReadyForDisbursement';

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