irf.pageCollection.factory(irf.page("loans.individual.booking.DocumentVerification"), ["$log", "SessionStore", "$state","irfNavigator", "$stateParams", "PageHelper", "IndividualLoan", "LoanBookingCommons", "Utils", "Files", "Queries", "formHelper", "$q", "$filter",
    function($log, SessionStore, $state, irfNavigator, $stateParams, PageHelper, IndividualLoan, LoanBookingCommons, Utils, Files, Queries, formHelper, $q, $filter) {

        var docRejectReasons = [];
        Queries.getLoanProductDocumentsRejectReasons().then(function(resp){
            docRejectReasons = resp;
        });

        return {
            "type": "schema-form",
            "title": "DOCUMENT_VERIFICATION",
            "subTitle": " ",
            initialize: function(model, form, formCtrl) {
                $log.info("Demo Customer Page got initialized");
                model.loanView = SessionStore.getGlobalSetting("LoanViewPageName");
                var loanId = $stateParams['pageId'];
                PageHelper.showProgress('loan-load', 'Loading loan details...');
                PageHelper.showLoader();
                IndividualLoan.get({ id: $stateParams.pageId }).$promise.then(function(res) {
                    PageHelper.showProgress('loan-load', 'Loading done.', 2000);
                    model.loanAccount = res;
                    /* DO BASIC VALIDATION */
                    if (res.currentStage!= 'DocumentVerification'){
                        PageHelper.showProgress('load-loan', 'Loan is in different Stage', 2000);
                        irfNavigator.goBack();
                        return;
                    }
                    if(model.loanAccount.disbursementSchedules && model.loanAccount.disbursementSchedules.length)
                    {
                        model.loanAccount.disbursementSchedules[0].party = model.loanAccount.disbursementSchedules[0].party || 'CUSTOMER';
                    }
                    
                    var loanDocuments = model.loanAccount.loanDocuments;
                    var availableDocCodes = [];
                    LoanBookingCommons.getDocsForProduct(model.loanAccount.productCode, "LoanBooking", "DocumentUpload").then(function(docsForProduct) {
                        $log.info(docsForProduct);
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
                    "items": [{
                        "key": "loanAccount.disbursementSchedules[0].party",
                        "type": "text",
                        "readonly":true,
                        "title":"PARTY"
                    }, {
                        key: "loanAccount.disbursementSchedules[0].customerNameInBank",
                        title: "CUSTOMER_NAME_IN_BANK",
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
                    }]
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
                        "readonly": true
                    }, {
                        "type": "button",
                        "title": "DOWNLOAD_ALL_FORMS",
                        "onClick": function(model, form, schemaForm, event) {
                                var fileUrl = IndividualLoan.getAllDocumentsUrl(model.loanAccount.id);
                                Utils.downloadFile(fileUrl);
                        }
                    }, {
                        "type": "fieldset",
                        "title": "DOCUMENT_VERIFICATION",
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
                                "items": [{
                                    "type": "section",
                                    "htmlClass": "col-sm-3",
                                    "items": [{
                                        "key": "loanAccount.loanDocuments[].$title",
                                        "notitle": true,
                                        "title": " ",
                                        "readonly": true
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-2",
                                    "key": "loanDocs[].downloadRequired",
                                    //"condition": "model.loanDocs[arrayIndex].downloadRequired==true",
                                    "items": [{
                                        "title": "DOWNLOAD_FORM",
                                        "notitle": true,
                                        "fieldHtmlClass": "btn-block",
                                        "style": "btn-default",
                                        "icon": "fa fa-download", 
                                        "type": "button",
                                        "readonly": false,
                                        "key": "loanAccount.loanDocs[].documentId",
                                        "onClick": function(model, form, schemaForm, event) {
                                            var fileId = model.loanAccount.loanDocuments[schemaForm.arrayIndex].documentId;
                                            Utils.downloadFile(Files.getFileDownloadURL(fileId));
                                        }
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-2",
                                    "items": [{
                                        "key": "loanAccount.loanDocuments[].documentStatus",
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
                                    "condition": "model.loanAccount.loanDocuments[arrayIndex].documentStatus === 'REJECTED'",
                                    "items": [{
                                        title: "Reason",
                                        notitle: true,
                                        placeholder: "Reason",
                                        key: "loanAccount.loanDocuments[].rejectReason",
                                        type: "lov",
                                        lovonly: true,
                                        searchHelper: formHelper,
                                        search: function(inputModel, form, model, context) {
                                            var f = $filter('filter')(docRejectReasons, {"document_code": model.loanAccount.loanDocuments[context.arrayIndex].document},true);
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
                                            model.loanAccount.loanDocuments[context.arrayIndex].rejectReason = result.reject_reason;
                                        }
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-2",
                                    "condition": "model.loanAccount.loanDocuments[arrayIndex].documentStatus === 'REJECTED'",
                                    "items": [{
                                        title: "Remarks",
                                        notitle: true,
                                        placeholder: "Remarks",
                                        key: "loanAccount.loanDocuments[].remarks"
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-5",
                                    "condition": "model.loanAccount.loanDocuments[arrayIndex].documentStatus !== 'REJECTED'",
                                    "items": [{
                                        title: "Remarks",
                                        notitle: true,
                                        placeholder: "Remarks",
                                        key: "loanAccount.loanDocuments[].remarks"
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
                                "LoanInitiation": "LoanInitiation",
                                "LoanBooking": "LoanBooking",
                                "DocumentUpload":"DocumentUpload"

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
                                            pageName: 'loans.individual.booking.PendingVerificationQueue'
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
                viewLoan: function(model, formCtrl, form, $event) {
                    Utils.confirm("Save the data before proceed").then(function() {
                        $log.info("Inside ViewLoan()");
                        if(model.loanView) {
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
                proceed: function(model, form, formName) {

                    if (PageHelper.isFormInvalid(form)){
                        return false;
                    }

                    var reqData = {
                        'loanAccount': _.cloneDeep(model.loanAccount),
                        'loanProcessAction': 'PROCEED'
                    };
                    var docStatuses = [];
                    var allowedStatues = ['APPROVED', 'REJECTED'];
                    var redirectToUploadFlag = false;
                    for (var i = 0; i < reqData.loanAccount.loanDocuments.length; i++) {
                        var doc = reqData.loanAccount.loanDocuments[i];
                        if (_.indexOf(allowedStatues, doc.documentStatus) == -1) {
                            PageHelper.showProgress('update-loan', 'Invalid document status selected. Only Approved or Rejected are allowed.');
                            return;
                        }

                        if (doc.documentStatus == 'REJECTED') {
                            redirectToUploadFlag = true;
                        }
                    }

                    if (redirectToUploadFlag == true) {
                        reqData['stage'] = 'DocumentUpload';
                    }

                    PageHelper.showProgress('update-loan', 'Working...');
                    PageHelper.showLoader();
                    console.log(JSON.stringify(reqData));
                    return IndividualLoan.update(reqData)
                        .$promise
                        .then(
                            function(res) {
                                PageHelper.showProgress('update-loan', 'Done.', 2000);
                                $state.go('Page.Engine', {
                                    pageName: 'loans.individual.booking.PendingVerificationQueue'
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