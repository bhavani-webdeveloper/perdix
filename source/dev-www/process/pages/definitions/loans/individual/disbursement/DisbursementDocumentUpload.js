irf.pageCollection.factory(irf.page("loans.individual.disbursement.DisbursementDocumentUpload"), ["$log", "Enrollment", "SessionStore", "$state", '$stateParams', 'PageHelper', 'IndividualLoan', 'Queries', 'Utils', 'formHelper', "LoanProcess", "CustomerBankBranch", "SchemaResource", "LoanAccount", "irfNavigator", "PagesDefinition",
    function($log, Enrollment, SessionStore, $state, $stateParams, PageHelper, IndividualLoan, Queries, Utils, formHelper, LoanProcess, CustomerBankBranch, SchemaResource, LoanAccount, irfNavigator, PagesDefinition) {


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
            "title": "LOAN_DOCUMENT_UPLOAD_QUEUE",
            "subTitle": " ",
            initialize: function(model, form, formCtrl) {
                $log.info("Demo Customer Page got initialized");
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                model.loanView = SessionStore.getGlobalSetting("loanViewPageName");
                model._queue = $stateParams.pageData;
                if (!model._queue) {
                    $log.info("Screen directly launched hence redirecting to queue screen");
                    $state.go('Page.Engine', {
                        pageName: 'loans.individual.disbursement.DisbursementDocumentUploadQueue',
                        pageId: null
                    });
                    return;
                }

                var loanId = $stateParams['pageId'].split(".")[0];
                var disbursementId = $stateParams['pageId'].split(".")[1];
                PageHelper.showProgress('loan-load', 'Loading loan details...');
                PageHelper.showLoader();
                IndividualLoan.get({
                        id: $stateParams.pageId
                    })
                    .$promise
                    .then(
                        function(res) {
                            console.log(res);
                            PageHelper.showProgress('loan-load', 'Loading done.', 2000);
                            model.loanAccount = res;
                            /* DO BASIC VALIDATION */
                            var disbExistFlag = false;
                            for (var i=0;i<res.disbursementSchedules.length;i++) {
                                var disbSchedule = res.disbursementSchedules[i];
                                console.log(disbSchedule);
                                if (disbSchedule.id == disbursementId) {
                                    loanAccountDisbursementSchedule= disbSchedule;
                                    Utils.removeNulls(model,true);
                                    disbExistFlag = true;
                                    break;
                                }
                            }
                            if(!disbExistFlag){
                                 PageHelper.showProgress('loan-fetch', 'Failed to load Disbursement', 5000);
                            }
                            else{
                                PageHelper.showProgress('loan-fetch', 'Done.', 5000);
                            }
                            console.log(model);

                            Queries.getLoanProductDocuments(model.loanAccount.productCode, "Disbursement", "DisbursementDocumentUpload")
                                .then(
                                    function(docs) {
                                        docsForProduct = [];
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
                        "onClick": function(model, form, schemaForm, event) {
                            Utils.downloadFile(irf.MANAGEMENT_BASE_URL + "/forms/AllFormsDownload.php?record_id=" + model.loanAccount.id);
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
                            "items": [
                            {
                                "type": "section",
                                "htmlClass": "row",
                                "condition": "model.loanAccount.loanDocuments[arrayIndex].isHidden === false",
                                "items": [
                                {
                                    "type": "section",
                                    "htmlClass": "col-sm-4",
                                    "items": [{
                                        "key": "loanAccount.loanDocuments[].$title",
                                        "notitle": true,
                                        "titleExpr": "model.loanAccount.loanDocuments[arrayIndex].$title",
                                        "type": "anchor",
                                        "fieldHtmlClass": "text-bold",
                                        "condition": "model.loanAccount.loanDocuments[arrayIndex].$downloadRequired",
                                        "onClick": function(model, form, schemaForm, event) {
                                            var doc = model.loanAccount.loanDocuments[event.arrayIndex];
                                            console.log(doc);
                                            Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=" + doc.$formsKey + "&record_id=" + model.loanAccount.id)
                                        }
                                    },{
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
                                }, {
                                    "type": "section",
                                     "condition": "model.loanAccount.loanDocuments[arrayIndex].documentStatus !== 'APPROVED'",
                                    "htmlClass": "col-sm-3",
                                    "items": [{
                                        title: "Upload",
                                        key: "loanAccount.loanDocuments[].documentId",
                                        "required": true,
                                        type: "file",
                                        fileType: "application/pdf",
                                        category: "Loan",
                                        subCategory: "DOC1",
                                        "notitle": true,
                                        using: "scanner"
                                    }]
                                },{
                                    "type": "section",
                                     "condition": "model.loanAccount.loanDocuments[arrayIndex].documentStatus == 'APPROVED'",
                                     readonly:true,
                                    "htmlClass": "col-sm-3",
                                    "items": [{
                                        title: "Upload",
                                        key: "loanAccount.loanDocuments[].documentId",
                                        "required": true,
                                        type: "file",
                                        fileType: "application/pdf",
                                        category: "Loan",
                                        subCategory: "DOC1",
                                        "notitle": true,
                                        using: "scanner"
                                    }]
                                }]
                            }] // END of array items
                        }]
                    }] // END of box items
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
                        var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
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
                                    pageName: 'loans.individual.disbursement.DisbursementDocumentUploadQueue'
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
                            function(){
                                var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                                reqData.loanAccount.status = 'HOLD';
                                reqData.loanProcessAction = "SAVE";
                                reqData.remarks = model.review.remarks;
                                PageHelper.showLoader();
                                IndividualLoan.create(reqData)
                                    .$promise
                                    .then(function(res){
                                        $state.go('Page.Engine', {
                                            pageName: 'loans.individual.disbursement.DisbursementDocumentUploadQueue'
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

                sendBack: function(model, formCtrl, form, $event){
                    $log.info("Inside sendBack()");
                    if(_.isEmpty(model.review.remarks) || _.isEmpty(model.review.targetStage)) {
                        PageHelper.showProgress("update-loan", "Please Enter Remarks and Stage.", 3000);
                        return false;
                    }
                    Utils.confirm("Are You Sure?").then(function(){
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
                                    pageName: 'loans.individual.disbursement.DisbursementDocumentUploadQueue'
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
                proceed: function(model, form, formName) {
                    if (PageHelper.isFormInvalid(form)){
                        return false;
                    }
                    $log.info("Redirecting");

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
                        'loanProcessAction': 'SAVE',
                        'remarks': model.review.remarks
                    };
                    PageHelper.showProgress('update-loan', 'Working...');
                    PageHelper.showLoader();
                    return IndividualLoan.update(reqData)
                        .$promise
                        .then(
                            function(res) {
                                PageHelper.showProgress('update-loan', 'Done.', 2000);
                                var reqDataForDisburse = {
                                    "disbursementProcessAction": "PROCEED",
                                    "individualLoanDocuments": docsForProduct,
                                    "loanAccountDisbursementSchedule": loanAccountDisbursementSchedule
                                };

                                IndividualLoan.updateDisbursement(reqDataForDisburse,function(resp,header){
                                    PageHelper.showProgress("upd-disb","Done.","5000");
                                        backToQueue();
                                    },function(resp){
                                        PageHelper.showProgress("upd-disb","Oops. An error occurred","5000");
                                        PageHelper.showErrors(resp);

                                    }).$promise.finally(function(){
                                        PageHelper.hideLoader();
                                    });

                                $state.go('Page.Engine', {
                                    pageName: 'loans.individual.disbursement.DisbursementDocumentUploadQueue'
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
                        //
                        //$state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue', pageId: ''});
                },
                goBack: function(model, formCtrl, form, $event) {
                    irfNavigator.goBack();
                }
            }
        };
    }
]);