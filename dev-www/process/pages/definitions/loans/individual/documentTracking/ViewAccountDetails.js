irf.pageCollection.factory(irf.page("loans.individual.documentTracking.ViewAccountDetails"), 
    ["$log", "$state", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils","PagesDefinition", "DocumentTracking","$stateParams","$timeout","Files",


    function($log, $state, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils,PagesDefinition, DocumentTracking,$stateParams,$timeout,Files) {

        var branch = SessionStore.getBranch();
        var localModel;

        return {
            "type": "schema-form",
            "title": "VIEW_ACCOUNT_DETAILS",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                localModel = model;
                model.accountDocumentTracker = model.accountDocumentTracker || {};
                $log.info("View account details is initiated ");

                if ($stateParams.pageId) {
                    PageHelper.showLoader();
                    model.accountDocumentTracker = [];
                    DocumentTracking.getBatch({batchNumber:$stateParams.pageId})
                    .$promise
                    .then(function (resp){
                        model.accountDocumentTracker = resp;
                    }, function(errResp){
                        PageHelper.showProgress("view-batch", "Error while reading the Batch", 3000);
                    }).finally(function(){
                        PageHelper.hideLoader();
                    })
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
                    "title": "BATCH_DETAILS",
                    "readonly":true,
                    "items": [
                        {
                            key: "accountDocumentTracker[0].branchId",
                            title: "BRANCH_NAME"
                        },
                        {
                            key: "accountDocumentTracker[0].batchNumber",
                            title: "BATCH_NUMBER"
                        },
                        {
                            key: "accountDocumentTracker[0].courierNumber",
                            title: "POD_NO"
                        },
                        {
                            key: "accountDocumentTracker[0].courierDate",
                            title: "DISPATCHED_DATE"
                        },
                        {
                            key: "accountDocumentTracker[0].receiveDate",
                            title: "RECEIVED_DATE"
                        }
                    ]
                },
                {
                    "type": "box",
                    "title":"LOAN_HISTORY",
                    "condition":"model.$tempAccountDocumentTrackingHistory",
                    "items": [
                        {
                            "type":"array",
                            "key":"$tempAccountDocumentTrackingHistory",
                            startEmpty: true,
                            "titleExpr": "model.$tempAccountDocumentTrackingHistory.batchNumber",
                            "view":"fixed",
                            "add":null,
                            "remove":null,
                            "items":[
                            {
                                "title": "Rejected From Batch No",
                                "readonly": true,
                                "key": "$tempAccountDocumentTrackingHistory[].batchNumber"
                            },
                            {
                                "title": "Hard Copy Verification Date",
                                "readonly": true,
                                "key": "$tempAccountDocumentTrackingHistory[].hardCopyVerificationDate"
                            },
                            {
                                "title": "Rejection Remarks",
                                "readonly": true,
                                "key": "$tempAccountDocumentTrackingHistory[].remarks"
                            }
                        ]
                        }
                    ]
                },
                {
                    "type": "box",
                    colClass: "col-sm-12",
                    "items": [
                        {
                            type: "tableview",
                            listStyle: "table",
                            key: "accountDocumentTracker",
                            title: "ACCOUNT_DETAILS",
                            selectable: true,
                            expandable: true,
                            paginate: false,
                            searching: false,
                            getColumns: function(){
                                return [{
                                    title: 'SPOKE_NAME',
                                    data: 'centreId'
                                }, {
                                    title: 'APPLICANT_NAME',
                                    data: 'applicantName'
                                }, {
                                    title: 'ENTITY_NAME',
                                    data: 'customerName'
                                }, {
                                    title: 'ACCOUNT_NUMBER',
                                    data: 'accountNumber'
                                }, {
                                    title: 'DISBURSEMENT_DATE',
                                    data: 'scheduledDisbursementDate'
                                }, {
                                    title: 'STATUS',
                                    data: 'udf1'
                                }]
                            },
                            getActions: function(item) {
                                
                                return [{
                                    name:"View Details",
                                    desc:"",
                                    icon:"fa fa-registered",
                                    fn: function(item){
                                        $timeout(function() {
                                            localModel.$tempAccountDocTracker = item;
                                            localModel.$tempAccountDocTrackerDetails = item.accountDocTrackerDetails;
                                            localModel.$tempAccountDocumentTrackingHistory = item.accountDocumentTrackingHistory;
                                        });
                                    },
                                    isApplicable: function(item, index) {
                                        return true;
                                    }
                                }];
                            }
                        },
                        {
                            "type":"section",
                            "htmlClass":"row",
                            "items":[
                            {
                                "type":"section",
                                "htmlClass":"col-sm-1",
                                "items":[
                                    { 
                                        type: 'button',  
                                        key:"btnAcceptButton",
                                        title: 'Accept',
                                        "onClick": function(model, formCtrl, form, event) {
                                            for(i=0;i<model.accountDocumentTracker.length;i++){
                                                if(model.accountDocumentTracker[i].$selected){
                                                    model.accountDocumentTracker[i].udf1 = "Accept";
                                                }
                                                model.accountDocumentTracker[i].$selected = false;
                                            }
                                            formCtrl.redraw();
                                        }
                                    }
                                ]
                            },
                            {
                                "type":"section",
                                "htmlClass":"col-sm-1",
                                "items":[
                                    { 
                                        type: 'button',  
                                        key:"btnRejectButton",
                                        title: 'Reject',
                                        "onClick": function(model, formCtrl, form, event) {
                                            for(i=0;i<model.accountDocumentTracker.length;i++){
                                                if(model.accountDocumentTracker[i].$selected){
                                                    model.accountDocumentTracker[i].udf1 = "Reject";
                                                }
                                                model.accountDocumentTracker[i].$selected = false;
                                            }
                                            formCtrl.redraw();
                                        }
                                    }
                                ]
                            }
                            ]
                        }
                    ]
                },
                {
                    "type": "box",
                    "title":"LOAN_DOCUMENTS",
                    "condition":"model.$tempAccountDocTrackerDetails",
                    "items": [
                        {
                            "type":"array",
                            "key":"$tempAccountDocTrackerDetails",
                            notitle: true,
                            "view":"fixed",
                            "add":null,
                            "remove":null,
                            "items":[
                            {
                                "titleExpr": "model.$tempAccountDocTrackerDetails[arrayIndex].document",
                                "type": "anchor",
                                "readonly": true,
                                "key": "$tempAccountDocTrackerDetails[].documentId",
                                "condition":"model.$tempAccountDocTrackerDetails[arrayIndex].documentId",
                                "onClick": function(model, form, schemaForm, event) {
                                    var fileId = localModel.$tempAccountDocTrackerDetails[schemaForm.arrayIndex].documentId;
                                    Utils.downloadFile(Files.getFileDownloadURL(fileId));
                                }
                            }
                        ]
                        }
                    ]
                },
                {
                    "type": "box",
                    "title":"REJECT_DETAILS",
                    "condition":"model.$tempAccountDocTracker",
                    "items": [
                        {
                            "title": "Remarks",
                            "type":"textarea",
                            "key": "$tempAccountDocTracker.remarks"
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
                preSave: function(model, form, formName) {
                    $log.info("Inside save()");
                    var deferred = $q.defer();
                    if (model.doc) {
                        deferred.resolve();
                    } else {
                        irfProgressMessage.pop('LeadGeneration-save', 'Applicant Name is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },

                goBack: function(model, form, formName) {
                    $log.info("Inside goBack()");
                    $state.go("Page.Engine", {pageName: "loans.individual.documentTracking.PendingVerificationQueue",pageId: null});
                }
            }
        };

    }
]);