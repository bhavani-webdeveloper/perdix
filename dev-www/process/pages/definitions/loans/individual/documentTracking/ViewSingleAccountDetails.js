irf.pageCollection.factory(irf.page("loans.individual.documentTracking.ViewSingleAccountDetails"), 
    ["$log", "$state", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils","PagesDefinition", "DocumentTracking","$stateParams","$timeout","Files","Queries",


    function($log, $state, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils,PagesDefinition, DocumentTracking,$stateParams,$timeout,Files, Queries) {

        var branch = SessionStore.getBranch();

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
            "title": "VIEW_ACCOUNT_DETAILS",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.accountDocumentTracker = model.accountDocumentTracker || {};
                $log.info("View account details is initiated ");

                if (model._Account) {
                    PageHelper.showLoader();
                    DocumentTracking.get({id: model._Account.id})
                    .$promise
                    .then(function (resp){
                        model.accountDocumentTracker = resp;
                        Queries.getLoanProductDocuments(model._Account.productCode, "LoanBooking", "DocumentUpload")
                        .then(function (productDocs){
                            if(productDocs 
                                    && productDocs.length 
                                    && model.accountDocumentTracker.accountDocTrackerDetails 
                                    && model.accountDocumentTracker.accountDocTrackerDetails.length){
                                var docsFromProduct = [];
                                for (var i = 0; i < productDocs.length; i++) {
                                    var doc = productDocs[i];
                                    docsFromProduct.push({
                                        docTitle: doc.document_name,
                                        docCode: doc.document_code
                                    });
                                }
                                for(i=0;i<model.accountDocumentTracker.accountDocTrackerDetails.length;i++){
                                    var documentObj = getDocument(docsFromProduct, model.accountDocumentTracker.accountDocTrackerDetails[i].document);
                                    if(documentObj!=null)
                                        model.accountDocumentTracker.accountDocTrackerDetails[i].documentTitle = documentObj.docTitle;
                                    else
                                        model.accountDocumentTracker.accountDocTrackerDetails[i].documentTitle = model.accountDocumentTracker.accountDocTrackerDetails[i].document;
                                }

                            }
                        }, function (err){});
                    }, function(errResp){
                        PageHelper.showProgress("view-batch", "Error while reading the account", 3000);
                    }).finally(function(){
                        PageHelper.hideLoader();
                    })
                }
                else{
                    $state.go("Page.Engine", {pageName: "loans.individual.documentTracking.PendingDispatchQueue",pageId: null});
                }
            },
            modelPromise: function(pageId, _model) {
            }, 
            offline: false,
            getOfflineDisplayItem: function(item, index) {
                return []
            },
            form: [{
                    "type": "box",
                    "title": "LOAN_DETAILS",
                    "readonly":true,
                    "items": [
                        {
                            key: "accountDocumentTracker.branchName",
                            title: "BRANCH_NAME"
                        },
                        {
                            key: "accountDocumentTracker.centreName",
                            title: "SPOKE_NAME"
                        },
                        {
                            key: "accountDocumentTracker.applicantName",
                            title: "APPLICANT_NAME"
                        },
                        {
                            key: "accountDocumentTracker.customerName",
                            title: "ENTITY_NAME"
                        },
                        {
                            key: "accountDocumentTracker.accountNumber",
                            title: "ACCOUNT_NUMBER"
                        },
                        {
                            key: "accountDocumentTracker.scheduledDisbursementDate",
                            title: "DISBURSEMENT_DATE"
                        }
                    ]
                },
                {
                    "type": "box",
                    "title":"DOC_TRACKING_HISTORY",
                    "condition":"model.accountDocumentTracker.accountDocumentTrackingHistory",
                    "items": [
                        {
                            "type":"array",
                            "key":"accountDocumentTracker.accountDocumentTrackingHistory",
                            startEmpty: true,
                            "titleExpr": "model.accountDocumentTracker.accountDocumentTrackingHistory.batchNumber",
                            "view":"fixed",
                            "add":null,
                            "remove":null,
                            "items":[
                            {
                                "title": "REJECTED_FROM_BATCH_NO",
                                "readonly": true,
                                "key": "accountDocumentTracker.accountDocumentTrackingHistory[].batchNumber"
                            },
                            {
                                "title": "HARD_COPY_VERIFICATION_DATE",
                                "readonly": true,
                                "key": "accountDocumentTracker.accountDocumentTrackingHistory[].hardCopyVerificationDate"
                            },
                            {
                                "title": "REJECTION_REMARKS",
                                "readonly": true,
                                "key": "accountDocumentTracker.accountDocumentTrackingHistory[].rejectRemarks"
                            }
                        ]
                        }
                    ]
                },
                {
                    "type": "box",
                    "title":"LOAN_DOCUMENTS",
                    "condition":"model.accountDocumentTracker.accountDocTrackerDetails",
                    "items": [
                        {
                            "type":"array",
                            "key":"accountDocumentTracker.accountDocTrackerDetails",
                            "titleExpr": "model.accountDocumentTracker.accountDocTrackerDetails[arrayIndex].documentTitle",
                            "view":"fixed",
                            "add":null,
                            "remove":null,
                            "items":[
                            {
                                "title": "DOWNLOAD",
                                "type": "anchor",
                                "readonly": true,
                                "key": "accountDocumentTracker.accountDocTrackerDetails[].documentId",
                                "condition":"model.accountDocumentTracker.accountDocTrackerDetails[arrayIndex].documentId",
                                "onClick": function(model, form, schemaForm, event) {
                                    var fileId = model.accountDocumentTracker.accountDocTrackerDetails[schemaForm.arrayIndex].documentId;
                                    Utils.downloadFile(Files.getFileDownloadURL(fileId));
                                }
                            },
                            {
                                "title": "STATUS",
                                "key": "accountDocumentTracker.accountDocTrackerDetails[].status",
                                //"type":"select",
                                readonly:true,
                                "condition":"model.accountDocumentTracker.accountDocTrackerDetails[arrayIndex].documentId"
                            }
                        ]
                        }
                    ]
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "button",
                        "title": "Back",
                        "onClick":"actions.goBack()"
                    }]
                },
            ],
            schema: function() {
                return DocumentTracking.getSchema().$promise;
            },
            actions: {
                goBack: function(model, form, formName) {
                    $log.info("Inside goBack()");
                    $state.go("Page.Engine", {pageName: "loans.individual.documentTracking.PendingDispatchQueue",pageId: null});
                }
            }
        };

    }
]);