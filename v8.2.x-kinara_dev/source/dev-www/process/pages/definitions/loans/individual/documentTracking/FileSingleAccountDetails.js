irf.pageCollection.factory(irf.page("loans.individual.documentTracking.FileSingleAccountDetails"), 
    ["$log", "$state", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils","PagesDefinition", "DocumentTracking","$stateParams","$timeout","Files",


    function($log, $state, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils,PagesDefinition, DocumentTracking,$stateParams,$timeout,Files) {

        var branch = SessionStore.getBranch();

        var updateRemarksApplicable = function(model){
            var pending=false;
            if(model.accountDocumentTracker.accountDocTrackerDetails){
                for(i=0;i<model.accountDocumentTracker.accountDocTrackerDetails.length;i++){
                    if(model.accountDocumentTracker.accountDocTrackerDetails[i].status == 'PENDING'){
                       pending = true;
                    }
                }
            }
            model._Account.isRejected = pending;
        };

        return {
            "type": "schema-form",
            "title": "FILING_ACCOUNT_DETAILS",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.accountDocumentTracker = model.accountDocumentTracker || {};
                $log.info("File account details is initiated ");

                if (model._Account) {
                    PageHelper.showLoader();
                    DocumentTracking.get({id: model._Account.id})
                    .$promise
                    .then(function (resp){
                        model.accountDocumentTracker = resp;
                        model._Account.isRejected = false;
                        updateRemarksApplicable(model);
                    }, function(errResp){
                        PageHelper.showProgress("view-batch", "Error while reading the account", 3000);
                    }).finally(function(){
                        PageHelper.hideLoader();
                    })
                }
                else{
                    $state.go("Page.Engine", {pageName: "loans.individual.documentTracking.PendingFilingQueue",pageId: null});
                }
            },
            modelPromise: function(pageId, _model) {
            }, 
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return []
            },
            form: [{
                    "type": "box",
                    "title": "ACCOUNT_DETAILS",
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
                                "title": "Rejected From Batch No",
                                "readonly": true,
                                "key": "accountDocumentTracker.accountDocumentTrackingHistory[].batchNumber"
                            },
                            {
                                "title": "Hard Copy Verification Date",
                                "readonly": true,
                                "key": "accountDocumentTracker.accountDocumentTrackingHistory[].hardCopyVerificationDate"
                            },
                            {
                                "title": "Rejection Remarks",
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
                            notitle: true,
                            "view":"fixed",
                            "add":null,
                            "remove":null,
                            "items":[
                            {
                                "titleExpr": "model.accountDocumentTracker.accountDocTrackerDetails[arrayIndex].document",
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
                                "type":"select",
                                "condition":"model.accountDocumentTracker.accountDocTrackerDetails[arrayIndex].documentId",
                                onChange: function(modelValue, form, model, formCtrl, event) {
                                    updateRemarksApplicable(model);
                                }
                            },
                            {
                                "title": "REMARKS",
                                "key": "accountDocumentTracker.accountDocTrackerDetails[].remarks",
                                "type":"textarea",
                                "condition":"model.accountDocumentTracker.accountDocTrackerDetails[arrayIndex].documentId"
                            }
                        ]
                        }
                    ]
                },
                {
                    "type": "box",
                    "title":"REJECT_DETAILS",
                    "condition":"model._Account.isRejected",
                    "items": [
                        {
                            "title": "Remarks",
                            "type":"textarea",
                            "key": "accountDocumentTracker.rejectRemarks"
                        }
                    ]
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "button",
                        "title": "Back",
                        "onClick":"actions.goBack()"
                    },
                    {
                        "type": "submit",
                        "title": "SUBMIT"
                    }]
                },
            ],
            schema: function() {
                return DocumentTracking.getSchema().$promise;
            },
            actions: {
                goBack: function(model, form, formName) {
                    $log.info("Inside goBack()");
                    $state.go("Page.Engine", {pageName: "loans.individual.documentTracking.PendingFilingQueue",pageId: null});
                },
                submit: function(model, form, formName) {
                    var isFilingDoneForAllDocs = true;
                    for(i=0;i<model.accountDocumentTracker.accountDocTrackerDetails.length;i++){
                        if(model.accountDocumentTracker.accountDocTrackerDetails[i].status == '' || model.accountDocumentTracker.accountDocTrackerDetails[i].status == null){
                            PageHelper.showProgress("view-account","Status should be updated for all the Documents",3000);
                            return false;
                        }
                        else{
                            if(model.accountDocumentTracker.accountDocTrackerDetails[i].status == 'PENDING'){
                               isFilingDoneForAllDocs = false; 
                            }
                        }
                    }
                    if(isFilingDoneForAllDocs){
                        model.accountDocumentTracker.filingDate = moment().format(SessionStore.getSystemDateFormat());
                        model.accountDocumentTracker.rejectDate = null;
                        model.accountDocumentTracker.nextStage = "Filed";
                    }
                    else{
                        model.accountDocumentTracker.nextStage = "RejectedDocuments";
                        model.accountDocumentTracker.rejectDate = moment().format(SessionStore.getSystemDateFormat());
                    }
                    if(!model._Account.isRejected)
                        model.accountDocumentTracker.rejectRemarks = null;
                    var reqData = {accountDocumentTracker:[ _.cloneDeep(model.accountDocumentTracker)]};
                    reqData.accountDocumentTrackingAction = "PROCEED";
                    $log.info(reqData);
                    PageHelper.showLoader();
                    PageHelper.showProgress("update-batch", "Working...");
                    DocumentTracking.update(reqData)
                        .$promise
                        .then(function(res){
                            PageHelper.showProgress("update-batch", "Batch Updated.", 3000);
                            $state.go("Page.Engine", {pageName: "loans.individual.documentTracking.PendingFilingQueue",pageId: null});
                        }, function(httpRes){
                            PageHelper.showProgress("update-batch", "Oops. Some error occured.", 3000);
                            PageHelper.showErrors(httpRes);
                        })
                        .finally(function(){
                            PageHelper.hideLoader();
                        })
                }
            }
        };

    }
]);