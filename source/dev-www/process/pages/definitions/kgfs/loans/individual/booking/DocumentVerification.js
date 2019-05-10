define({
    pageUID: "kgfs.loans.individual.booking.DocumentVerification",
    pageType: "Engine",
    dependencies:  ["$log", "SessionStore", "$state","irfNavigator", "$stateParams", "PageHelper", "IndividualLoan", "LoanBookingCommons", "Utils", "Files", "Queries", "formHelper", "$q", "$filter", "SchemaResource"],
    $pageFn:function($log, SessionStore, $state, irfNavigator, $stateParams, PageHelper, IndividualLoan, LoanBookingCommons, Utils, Files, Queries, formHelper, $q, $filter, SchemaResource) {
        var docRejectReasons = [];
        Queries.getLoanProductDocumentsRejectReasons("individual_loan").then(function(resp){
            docRejectReasons = resp;
        });
        return {
            "type": "schema-form",
            "title": "DOCUMENT_VERIFICATIONS",
            "subTitle": " ",
            initialize: function(model, form, formCtrl) {
                $log.info("Demo Customer Page got initialized");
                model.loanView = SessionStore.getGlobalSetting("LoanViewPageName");
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                var loanId = $stateParams['pageId'];
                model._queue = $stateParams.pageData;
                PageHelper.showProgress('loan-load', 'Loading loan details...');
                PageHelper.showLoader();
                IndividualLoan.get({ id: $stateParams.pageId }).$promise.then(function(res) {
                    PageHelper.showProgress('loan-load', 'Loading done.', 2000);
                    model.loanAccount = res;
                    /* DO BASIC VALIDATION */
                    // if (res.currentStage!= 'DocumentVerification'){
                    //     PageHelper.showProgress('load-loan', 'Loan is in different Stage', 2000);
                    //     irfNavigator.goBack();
                    //     return;
                    // }
                    if(model.siteCode == 'kinara' && model.loanAccount.linkedAccountNumber && model.loanAccount.transactionType=='Internal Foreclosure'){
                        if (_.has(res, 'disbursementSchedules') &&
                        _.isArray(res.disbursementSchedules) &&
                        res.disbursementSchedules.length > 0 &&
                        res.numberOfDisbursed < res.disbursementSchedules.length){
                        model._currentDisbursement = res.disbursementSchedules[res.numberOfDisbursed];
                        model._currentDisbursement.precloseurePayOffAmountWithDue =model._currentDisbursement.linkedAccountTotalPrincipalDue +model._currentDisbursement.linkedAccountNormalInterestDue + model._currentDisbursement.linkedAccountPenalInterestDue+model._currentDisbursement.linkedAccountTotalFeeDue;
                        } 
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
                                loanDocuments[i].$formsKey = documentObj.forms_key;
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
            eventListeners: {
                "teleVerification-capture": function(bundleModel, model, params){
                    model.loanAccount.telecallingDetails = params.customer.telecallingDetails;            
                }
            },
            form: [
            {
                "type": "box",
                "colClass": "col-sm-12",
                "title": "DOCUMENT_VERIFICATION",
                "htmlClass": "text-danger",
                "items": [
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
                                        "readonly": true,
                                        "titleExpr": "model.loanAccount.loanDocuments[arrayIndex].$title",
                                            "type": "anchor",
                                            "fieldHtmlClass": "text-bold",
                                            "onClick": function (model, form, schemaForm, event) {
                                                var doc = model.loanAccount.loanDocuments[event.arrayIndex];
                                                console.log(doc);
                                                Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=" + doc.$formsKey + "&record_id=" + model.loanAccount.id)
                                                // Utils.downloadFile(Misc.allFormsDownload());
                                            }
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-2",
                                    "key": "loanDocs[].downloadRequired",
                                    "condition": "model.loanAccount.loanDocuments[arrayIndex].documentId",
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
                                            //var fileId = model.loanAccount.loanDocuments[schemaForm.arrayIndex].documentId;
                                            //Utils.downloadFile(Files.getFileDownloadURL(fileId));
                                            Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=" + "applicant_details" + "&record_id=" + model.loanAccount.id+ "&display=content")
                                        }
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-2",
                                    "items": [{
                                        "key": "loanAccount.loanDocuments[].documentStatus",
                                        "condition": "model.loanAccount.loanDocuments[arrayIndex].documentId",
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
                                            var rejectReason = formHelper.enum('document_reject_reason').data;
                                            var out = [];
                                            for (var i = 0; i < rejectReason.length; i++) {
                                                    out.push({
                                                        name: rejectReason[i].name,
                                                        code: rejectReason[i].code
                                                    })
                                            }

                                            return $q.resolve({
                                                "header": {
                                                    "x-total-count": out.length
                                                },
                                                "body": out
                                            });
                                        },
                                        getListDisplayItem: function(item, index) {
                                            return [item.name];
                                        },
                                        onSelect: function(result, model, context) {
                                            model.loanAccount.loanDocuments[context.arrayIndex].rejectReason = result.code;
                                        }
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-2",
                                    "condition": "model.loanAccount.loanDocuments[arrayIndex].documentStatus === 'REJECTED' && model.loanAccount.loanDocuments[arrayIndex].documentId",
                                    "items": [{
                                        title: "Remarks",
                                        notitle: true,
                                        placeholder: "Remarks",
                                        key: "loanAccount.loanDocuments[].remarks"
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-5",
                                    "condition": "model.loanAccount.loanDocuments[arrayIndex].documentStatus !== 'REJECTED' && model.loanAccount.loanDocuments[arrayIndex].documentId",
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
                "readonly":true,
                "title": "INTERNAL_FORE_CLOSURE_DETAILS",
                "condition": "model.siteCode == 'kinara' && model.loanAccount.linkedAccountNumber && model.loanAccount.transactionType=='Internal Foreclosure'",
                "items": [{
                    "key": "loanAccount.linkedAccountNumber",
                    "title":"LINKED_ACCOUNT_NUMBER",
                    "readonly":true
                }, {
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
                                for (var i = 0; i < targetstage.length; i++) {
                                    var t = targetstage[i];
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
            }, 
            {
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
                    if (model.review.remarks==null || model.review.remarks =="" || model.loanAccount.rejectReason ==null || model.loanAccount.rejectReason ==""){
                               PageHelper.showProgress("update-loan", "Reject Reason / Remarks is mandatory", 3000);
                               PageHelper.hideLoader();
                               return false;
                        }
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
                                if(model.loanAccount.currentStage == "Checker1")
                               {
                                $state.go('Page.Engine', {
                                    pageName: 'kgfs.loans.individual.booking.Checker1Queue'
                                });
                               }
                                if(model.loanAccount.currentStage == "Checker2"){
                                    $state.go('Page.Engine', {
                                        pageName: 'kgfs.loans.individual.booking.Checker2Queue'
                                    }); 
                                }
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
                                        if(model.loanAccount.currentStage == "Checker1")
                                        {
                                         $state.go('Page.Engine', {
                                             pageName: 'kgfs.loans.individual.booking.Checker1Queue'
                                         });
                                        }
                                         if(model.loanAccount.currentStage == "Checker2"){
                                             $state.go('Page.Engine', {
                                                 pageName: 'kgfs.loans.individual.booking.Checker2Queue'
                                             }); 
                                         }
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
                    if (model.review.remarks==null || model.review.remarks =="" || model.review.targetStage ==null || model.review.targetStage ==""){
                               PageHelper.showProgress("update-loan", "Send to Stage / Remarks is mandatory", 3000);
                               PageHelper.hideLoader();
                               return false;
                    }
                    Utils.confirm("Are You Sure?").then(function(){
                        var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                        reqData.loanAccount.status = '';
                        reqData.loanProcessAction = "PROCEED";
                        reqData.remarks = model.review.remarks;
                        reqData.stage = model.review.targetStage;
                        reqData.loanAccount.version = model.loanProcess.loanAccount.version
                        reqData.remarks = model.review.remarks;
                        PageHelper.showLoader();
                        PageHelper.showProgress("update-loan", "Working...");
                        IndividualLoan.update(reqData)
                            .$promise
                            .then(function(res){
                                PageHelper.showProgress("update-loan", "Done.", 3000);
                                if(model.loanAccount.currentStage == "Checker1")
                               {
                                $state.go('Page.Engine', {
                                    pageName: 'kgfs.loans.individual.booking.Checker1Queue'
                                });
                               }
                                if(model.loanAccount.currentStage == "Checker2"){
                                    $state.go('Page.Engine', {
                                        pageName: 'kgfs.loans.individual.booking.Checker2Queue'
                                    }); 
                                }
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
                    /** Checking Televerification for Applicant*/
                    if(model.loanAccount.currentStage == "Checker2" &&_.isEmpty(model.loanAccount.telecallingDetails)) {
                        PageHelper.showProgress("proceed-loan", "Televerification details are Mandatory.", 3000);
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
                        if (doc.documentId) {
                            if (_.indexOf(allowedStatues, doc.documentStatus) == -1) {
                                PageHelper.showProgress('update-loan', 'Invalid document status selected. Only Approved or Rejected are allowed.',3000);
                                return;
                            }
                            if (doc.documentStatus == 'REJECTED') {
                                redirectToUploadFlag = true;
                            }
                        }
                    }

                    if (redirectToUploadFlag == true) {
                        reqData['stage'] = 'DocumentUpload';
                    }

                    PageHelper.showProgress('update-loan', 'Working...');
                    PageHelper.showLoader();
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
});