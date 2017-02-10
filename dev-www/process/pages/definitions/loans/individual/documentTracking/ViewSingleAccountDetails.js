irf.pageCollection.factory(irf.page("loans.individual.documentTracking.ViewSingleAccountDetails"), 
    ["$log", "$state", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils","PagesDefinition", "DocumentTracking","$stateParams","$timeout","Files",


    function($log, $state, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils,PagesDefinition, DocumentTracking,$stateParams,$timeout,Files) {

        var branch = SessionStore.getBranch();

        var documentsHTML = 
        '<div>'+
            '<h3 ng-show="LOANDOCTRACKER" style="font-weight:bold;color:#ccc;">HIGHMARK REPORT</h3>'+
            '<iframe ng-show="CBDATA.highMark.reportHtml" id="{{CBDATA._highmarkId}}" style="border:0;width:100%;height:500px;"></iframe>'+
            '<div ng-hide="CBDATA.highMark.reportHtml">'+
                '<center><b style="color:tomato">{{CBDATA.customer.first_name||CBDATA.customerId}} - HighMark Scores NOT available</b></center>'+
            '</div>'+
        '</div>';

        return {
            "type": "schema-form",
            "title": "VIEW_ACCOUNT_DETAILS",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.accountDocumentTracker = model.accountDocumentTracker || {};
                $log.info("View account details is initiated ");

                if (model._Account) {
                    PageHelper.showLoader();
                    DocumentTracking.getbyAccountNumber({
                            accountNumber:model._Account.accountNumber,
                            trancheNumber:model._Account.trancheNumber,
                            })
                    .$promise
                    .then(function (resp){
                        model.accountDocumentTracker = resp;
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
                    "title":"LOAN_HISTORY",
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