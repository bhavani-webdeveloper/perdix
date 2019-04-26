define({
    pageUID: "kgfs.loans.individual.booking.DocumentUpload",
    pageType: "Engine",
    dependencies: ["$q","$log", "Enrollment", "IndividualLoan", "SessionStore", "$state", '$stateParams', 'PageHelper', 'IndividualLoan', 'Queries', 'Utils', 'formHelper', "LoanProcess", "CustomerBankBranch", "SchemaResource", "LoanAccount", "irfNavigator", "PagesDefinition","DeathMarking","Misc"],
    $pageFn: function ($q,$log, Enrollment, IndividualLoan, SessionStore, $state, $stateParams, PageHelper, IndividualLoan, Queries, Utils, formHelper, LoanProcess, CustomerBankBranch, SchemaResource, LoanAccount, irfNavigator, PagesDefinition,DeathMarking,Misc) {
        var getDocument = function (docsArr, docCode) {
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
            "title": "LOAN_DOCUMENT_UPLOAD_QUEUE",
            "subTitle": " ",
            initialize: function (model, form, formCtrl) {
                $log.info("Demo Customer Page got initialized");
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                model.loanView = SessionStore.getGlobalSetting("LoanViewPageName");
                model._queue = $stateParams.pageData;
                if (!model._queue) {
                    $log.info("Screen directly launched hence redirecting to queue screen");
                    // $state.go('Page.Engine', {
                    //     pageName: 'loans.individual.booking.DocumentUploadQueue',
                    //     pageId: null
                    // });
                    return;
                }

                var loanId = $stateParams['pageId'];
                PageHelper.showProgress('loan-load', 'Loading loan details...');
                PageHelper.showLoader();
                IndividualLoan.get({
                        id: $stateParams.pageId
                    })
                    .$promise
                    .then(
                        function (res) {
                            PageHelper.showProgress('loan-load', 'Loading done.', 2000);
                            model.loanProcess.loanAccount = res;
                            model.loanAccount = model.loanProcess.loanAccount;
                            /* DO BASIC VALIDATION */
                            if (res.currentStage != 'DocumentUpload') {
                                PageHelper.showProgress('load-loan', 'Loan is in different Stage', 2000);
                                //    irfNavigator.goBack();
                                return;
                            }
                            if (model.loanAccount.disbursementSchedules && model.loanAccount.disbursementSchedules.length) {
                                model.loanAccount.disbursementSchedules[0].party = model.loanAccount.disbursementSchedules[0].party || 'CUSTOMER';
                            }

                            Queries.getLoanProductDocuments(model.loanAccount.productCode, "LoanBooking", "DocumentUpload")
                                .then(
                                    function (docs) {
                                        var docsForProduct = [];
                                        for (var i = 0; i < docs.length; i++) {
                                            var doc = docs[i];
                                            docsForProduct.push({
                                                docTitle: doc.document_name,
                                                docCode: doc.document_code,
                                                formsKey: doc.forms_key,
                                                downloadRequired: doc.download_required,
                                                mandatory: doc.mandatory
                                            })
                                        }
                                        var loanDocuments = model.loanAccount.loanDocuments;
                                        var availableDocCodes = [];

                                        for (var i = 0; i < loanDocuments.length; i++) {
                                            availableDocCodes.push(loanDocuments[i].document);
                                            var documentObj = getDocument(docsForProduct, loanDocuments[i].document);
                                            /* To add flag whether to show or not */
                                            loanDocuments[i].isHidden = false;
                                            if (loanDocuments[i].documentStatus == 'APPROVED') {
                                                loanDocuments[i].isHidden = true;
                                            }


                                            if (documentObj != null) {
                                                loanDocuments[i].$title = documentObj.docTitle;
                                                loanDocuments[i].$key = documentObj.formsKey;
                                                loanDocuments[i].$formsKey = documentObj.formsKey;
                                                loanDocuments[i].$downloadRequired = documentObj.downloadRequired;
                                                loanDocuments[i].$mandatory = documentObj.mandatory;


                                            } else {
                                                if (_.hasIn(loanDocuments[i], 'document') && _.isString(loanDocuments[i].document)) {
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
                                                    $mandatory: docsForProduct[i].mandatory,
                                                    // disbursementId: model.loanAccount.disbursementSchedules[0].id,
                                                    isHidden: false
                                                })
                                            }
                                        }

                                        if (model._queue.accountNumber != null) {
                                            LoanAccount.activateLoan({
                                                "accountId": model._queue.accountNumber
                                            }, function (data) {
                                                $log.info("Inside success of activateLoan");
                                                LoanProcess.generateScheduleForSpecifiedDate({
                                                        // "accountNumber": model._queue.accountNumber,
                                                        "loanId": model._queue.loanId,
                                                        "tranchNumber": model.loanAccount.disbursementSchedules[0].trancheNumber,
                                                        "amount": model.loanAccount.disbursementSchedules[0].disbursementAmount,
                                                        "scheduledDisbursementDate": model.loanAccount.disbursementSchedules[0].scheduledDisbursementDate,
                                                        "firstRepaymentDate": model.loanAccount.firstRepaymentDate
                                                    })
                                                    .$promise
                                                    .then(function (resp) {}, function (httpRes) {
                                                        PageHelper.showProgress('loan-load', 'Failed to load the EMI Schedule. Try again.', 4000);
                                                        PageHelper.showErrors(httpRes);
                                                    }).finally(function () {
                                                        PageHelper.hideLoader();
                                                    });
                                            }, function (res) {
                                                PageHelper.hideLoader();
                                                PageHelper.showErrors(res);
                                                PageHelper.showProgress('disbursement', 'Error while activating loan.', 2000);
                                            });
                                        } else {
                                            PageHelper.hideLoader();
                                        }
                                    },
                                    function (httpRes) {
                                        PageHelper.hideLoader();
                                    }
                                )
                        },
                        function (httpRes) {
                            PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                            PageHelper.showErrors(httpRes);
                            PageHelper.hideLoader();
                        }
                    )
            },

            form: [
                {
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
                        "readonly": true
                    }, {
                        "type": "button",
                        "title": "DOWNLOAD_ALL_FORMS",
                        "onClick": function (model, form, schemaForm, event) {
                            Utils.downloadFile(Misc.allFormsDownload({recordId:model.loanAccount.id}));
                        }
                    }, {
                        "type": "fieldset",
                        "title": "LOAN_DOCUMENT_UPLOAD_QUEUE",
                        "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                        "items": [{
                            "type": "array",
                            "notitle": true,
                            "view": "fixed",
                            "key": "loanAccount.loanDocuments",
                            "add": null,
                            "remove": null,
                            "items": [{
                                "type": "section",
                                "htmlClass": "row",
                                "condition": "model.loanAccount.loanDocuments[arrayIndex].isHidden === false",
                                "items": [{
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "key": "loanAccount.loanDocuments[].$title",
                                            "notitle": true,
                                            "titleExpr": "model.loanAccount.loanDocuments[arrayIndex].$title",
                                            "type": "anchor",
                                            "fieldHtmlClass": "text-bold",
                                            "condition": "model.loanAccount.loanDocuments[arrayIndex].$downloadRequired",
                                            "onClick": function (model, form, schemaForm, event) {
                                                var doc = model.loanAccount.loanDocuments[event.arrayIndex];
                                                console.log(doc);
                                                Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=" + doc.$formsKey + "&record_id=" + model.loanAccount.id)
                                                // Utils.downloadFile(Misc.allFormsDownload());
                                            }
                                        }, {
                                            "key": "loanAccount.loanDocuments[].$title",

                                            "notitle": true,
                                            "title": " ",
                                            "condition": "!model.loanAccount.loanDocuments[arrayIndex].$downloadRequired",
                                            "readonly": true
                                        }]
                                    },

                                    {
                                        "type": "section",
                                        "htmlClass": "col-sm-2",
                                        "key": "loanAccount.loanDocuments[].documentStatus",
                                        "items": [{
                                            "notitle": true,
                                            "key": "loanAccount.loanDocuments[].documentStatus",
                                            "readonly": true
                                        }]
                                    }, {
                                        "type": "section",
                                        "htmlClass": "col-sm-4",
                                        "key": "loanAccount.loanDocuments[].remarks",
                                        "condition": "model.loanAccount.loanDocuments[arrayIndex].documentStatus === 'APPROVED'",
                                        "items": [{
                                            "notitle": true,
                                            "key": "loanAccount.loanDocuments[].remarks",
                                            "readonly": true
                                        }]
                                    }, {
                                        "type": "section",
                                        "htmlClass": "col-sm-4",
                                        "key": "loanAccount.loanDocuments[].documentStatus",
                                        "condition": "model.loanAccount.loanDocuments[arrayIndex].documentStatus === 'REJECTED' && !model.loanAccount.loanDocuments[arrayIndex].remarks",
                                        "items": [{
                                            "notitle": true,
                                            "key": "loanAccount.loanDocuments[].rejectReason",
                                            "readonly": true
                                        }]
                                    }, {
                                        "type": "section",
                                        "htmlClass": "col-sm-2",
                                        "key": "loanAccount.loanDocuments[].documentStatus",
                                        "condition": "model.loanAccount.loanDocuments[arrayIndex].documentStatus === 'REJECTED' && model.loanAccount.loanDocuments[arrayIndex].remarks",
                                        "items": [{
                                            "notitle": true,
                                            "key": "loanAccount.loanDocuments[].rejectReason",
                                            "readonly": true
                                        }]
                                    }, {
                                        "type": "section",
                                        "htmlClass": "col-sm-2",
                                        "key": "loanAccount.loanDocuments[].documentStatus",
                                        "condition": "model.loanAccount.loanDocuments[arrayIndex].documentStatus === 'REJECTED' && model.loanAccount.loanDocuments[arrayIndex].remarks",
                                        "items": [{
                                            "notitle": true,
                                            "key": "loanAccount.loanDocuments[].remarks",
                                            "readonly": true
                                        }]
                                    }, {
                                        "type": "section",
                                        "htmlClass": "col-sm-4",
                                        "key": "loanAccount.loanDocuments[].documentStatus",
                                        "condition": "model.loanAccount.loanDocuments[arrayIndex].documentStatus !== 'REJECTED' && model.loanAccount.loanDocuments[arrayIndex].documentStatus !== 'APPROVED'"
                                    },
                                    {
                                        "type": "section",
                                        "condition": "model.loanAccount.loanDocuments[arrayIndex].documentStatus !== 'APPROVED' && model.loanAccount.loanDocuments[arrayIndex].$mandatory == 'NO' ",

                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            title: "Upload",
                                            key: "loanAccount.loanDocuments[].documentId",
                                            type: "file",
                                            fileType: "application/pdf",
                                            category: "Loan",
                                            subCategory: "DOC1",
                                            "notitle": true,
                                            using: "scanner",
                                            required: false
                                        }]
                                    },
                                    {
                                        "type": "section",
                                        "condition": "model.loanAccount.loanDocuments[arrayIndex].documentStatus !== 'APPROVED' && model.loanAccount.loanDocuments[arrayIndex].$mandatory == 'YES' ",

                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            title: "Upload",
                                            key: "loanAccount.loanDocuments[].documentId",
                                            type: "file",
                                            fileType: "application/pdf",
                                            category: "Loan",
                                            subCategory: "DOC1",
                                            "notitle": true,
                                            using: "scanner",
                                            required: true

                                        }]
                                    }, {
                                        "type": "section",
                                        "condition": "model.loanAccount.loanDocuments[arrayIndex].documentStatus == 'APPROVED'",
                                        readonly: true,
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            title: "Upload",
                                            key: "loanAccount.loanDocuments[].documentId",
                                            type: "file",
                                            fileType: "application/pdf",
                                            category: "Loan",
                                            subCategory: "DOC1",
                                            "notitle": true,
                                            using: "scanner"
                                        }]
                                    }
                                ]
                            }] // END of array items
                        }]
                    }] // END of box items
                },
                {
                    "type": "box",
                    "title": "POST_REVIEW",
                    "condition": "model.loanAccount.id",
                    "items": [{
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
                                },
                                {
                                    key: "loanAccount.rejectReason",
                                    type: "lov",
                                    autolov: true,
                                    title: "REJECT_REASON",
                                    bindMap: {},
                                    searchHelper: formHelper,
                                    search: function (inputModel, form, model, context) {
                                        var stage1 = model.loanAccount.currentStage;

                                        if (model.loanAccount.currentStage == 'Application' || model.loanAccount.currentStage == 'ApplicationReview') {
                                            stage1 = "Application";
                                        }
                                        if (model.loanAccount.currentStage == 'FieldAppraisal' || model.loanAccount.currentStage == 'FieldAppraisalReview') {
                                            stage1 = "FieldAppraisal";
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
                                    onSelect: function (valueObj, model, context) {
                                        model.loanAccount.rejectReason = valueObj.name;
                                    },
                                    getListDisplayItem: function (item, index) {
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
                                },
                                {
                                    key: "review.targetStage",
                                    required: true,
                                    type: "lov",
                                    autolov: true,
                                    lovonly: true,
                                    title: "SEND_BACK_TO_STAGE",
                                    bindMap: {},
                                    searchHelper: formHelper,
                                    search: function (inputModel, form, model, context) {
                                        var stage1 = model.loanAccount.currentStage;
                                        var productCategory = model.loanProcess.loanAccount.productCategory;
                                        if(model.loanAccount.currentStage=='Rejected')
                                        var stage1= model.review.preStage;
                                        
                                        if((productCategory == 'Consumer' || productCategory == 'Personal') && model.loanAccount.currentStage !='Rejected')
                                        var targetstage = formHelper.enum('targetstagemelpersonal').data;
                                        else if(productCategory == 'JEWEL' && model.loanAccount.currentStage !='Rejected')
                                        var targetstage = formHelper.enum('targetstagemeljewel').data;
                                         else if(productCategory == 'JEWEL' && model.loanAccount.currentStage =='Rejected')
                                        var targetstage = formHelper.enum('targetstagemeljewelreject').data;
                                        else if((productCategory == 'Consumer' || productCategory == 'Personal') && model.loanAccount.currentStage =='Rejected' )
                                        var targetstage = formHelper.enum('targetstagemelpersonalreject').data;
                                        else
                                        var targetstage = formHelper.enum('booking_target_stage').data;

                                        var out = [];
                                        for (var i = 0; i < booking_target_stage.length; i++) {
                                            var t = booking_target_stage[i];
                                            if (t.field1 == stage1) {
                                                out.push({
                                                    name: t.name,
                                                    value: t.code
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
                                    onSelect: function (valueObj, model, context) {
                                        model.review.targetStage = valueObj.name;
                                        model.loanProcess.stage = valueObj.value;
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.name
                                        ];
                                    }
                                },
                                {
                                    key: "review.sendBackButton",
                                    type: "button",
                                    title: "SEND_BACK",
                                    onClick: "actions.sendBack(model, formCtrl, form, $event)"
                                }
                            ]
                        },
                        {
                            type: "section",
                            condition: "model.review.action=='PROCEED'",
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
                        }
                        /*, {
                                            "type": "submit",
                                            "title": "Submit"
                                        }*/
                    ]
                }
            ],
            schema: function () {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            actions: {
                submit: function (model, formCtrl, form) {
                    /* Loan SAVE */
                    console.log("Model from Submit from LoanBooking ");
                    console.log(model);
                    if (typeof model.loanAccount.loanAmount != "undefined") {
                        model.loanAccount.loanAmountRequested = model.loanAccount.loanAmount;
                    }
                    if (typeof model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf4 != "undefined") {
                        if (typeof model.loanAccount.husbandOrFatherFirstName == "undefined" || model.loanAccount.husbandOrFatherFirstName == null) {
                            model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf4 = null;
                        }
                    }
                    if (!model.loanAccount.id) {
                        model.loanAccount.isRestructure = false;
                        model.loanAccount.documentTracking = "PENDING";
                        model.loanAccount.psychometricCompleted = "NO";

                    }
                    PageHelper.showProgress('loan-process', 'Updating Loan');
                    model.loanProcess.save()
                        .finally(function () {
                            PageHelper.hideLoader();
                        })
                        .subscribe(function (value) {
                            BundleManager.pushEvent('new-loan', model._bundlePageObj, {
                                loanAccount: model.loanAccount
                            });
                            Utils.removeNulls(value, true);
                            PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);

                        }, function (err) {
                            PageHelper.showErrors(err);
                            PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                            PageHelper.hideLoader();
                        });

                },
                holdButton: function (model, formCtrl, form, $event) {
                    $log.info("Inside save()");
                    if (!model.loanAccount.id) {
                        model.loanAccount.isRestructure = false;
                        model.loanAccount.documentTracking = "PENDING";
                        model.loanAccount.psychometricCompleted = "NO";

                    }
                    model.loanAccount.status = "HOLD";
                    PageHelper.showProgress('loan-process', 'Updating Loan');
                    model.loanProcess.hold()
                        .finally(function () {
                            PageHelper.hideLoader();
                        })
                        .subscribe(function (value) {
                            Utils.removeNulls(value, true);
                            PageHelper.showProgress('loan-process', 'Loan hold.', 5000);
                            irfNavigator.goBack();
                        }, function (err) {
                            PageHelper.showErrors(err);
                            PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);

                            PageHelper.hideLoader();
                        });

                },
                sendBack: function (model, formCtrl, form, $event) {
                    if (model.review.remarks==null || model.review.remarks =="" || model.review.targetStage ==null || model.review.targetStage ==""){
                               PageHelper.showProgress("update-loan", "Send to Stage / Remarks is mandatory", 3000);
                               PageHelper.hideLoader();
                               return false;
                    }
                    PageHelper.showLoader();
                    model.loanProcess.sendBack()
                        .finally(function () {
                            PageHelper.hideLoader();
                        })
                        .subscribe(function (value) {
                            Utils.removeNulls(value, true);
                            PageHelper.showProgress('enrolment', 'Done.', 5000);
                            irfNavigator.goBack();
                        }, function (err) {
                            PageHelper.showErrors(err);
                            PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);

                            PageHelper.hideLoader();
                        });
                },
                proceed: function (model, formCtrl, form, $event) {
                    if (_.hasIn(model, 'review.targetStage'))
                    {
                        model.review.targetStage='';
                        model.loanProcess.stage='';
                    }
                    formCtrl.scope.$broadcast('schemaFormValidate');
					    if(!formCtrl.$valid){
                            PageHelper.showProgress('form-error', 'Your form have errors. Please fix them.',5000);
                            return
                        }
                    PageHelper.showProgress('enrolment', 'Updating Loan');
                    if(model.loanAccount.currentStage=='Checker2'){
                        model.loanProcess.stage='Completed';
                    }
                    var toStage=model.loanProcess.stage||null;
                    model.loanProcess.proceed(toStage)
                        .finally(function () {
                            PageHelper.hideLoader();
                        })
                        .subscribe(function (value) {
                            Utils.removeNulls(value, true);
                            PageHelper.showProgress('enrolment', 'Done.', 5000);
                            irfNavigator.goBack();
                        }, function (err) {
                            PageHelper.showErrors(err);
                            PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);

                            PageHelper.hideLoader();
                        });
                },
                reject: function (model, formCtrl, form, $event) {
                    if (model.review.remarks==null || model.review.remarks =="" || model.loanAccount.rejectReason ==null || model.loanAccount.rejectReason ==""){
                               PageHelper.showProgress("update-loan", "Reject Reason / Remarks is mandatory", 3000);
                               PageHelper.hideLoader();
                               return false;
                    }
                    PageHelper.showLoader();
                    model.loanProcess.reject()
                        .finally(function () {
                            PageHelper.hideLoader();
                        })
                        .subscribe(function (value) {
                            Utils.removeNulls(value, true);
                            PageHelper.showProgress('enrolment', 'Done.', 5000);
                            irfNavigator.goBack();
                        }, function (err) {
                            PageHelper.showErrors(err);
                            PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);

                            PageHelper.hideLoader();
                        });
                },
            }
        };
    }
});
