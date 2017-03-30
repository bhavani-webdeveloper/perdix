irf.pageCollection.factory(irf.page("loans.individual.documentTracking.FileSingleAccountDetails"), ["$log", "$state", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "PagesDefinition", "DocumentTracking", "$stateParams", "$timeout", "Files",


    function($log, $state, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, DocumentTracking, $stateParams, $timeout, Files) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "FILING_ACCOUNT_DETAILS",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.accountDocumentTracker = model.accountDocumentTracker || {};
                $log.info("File account details is initiated ");

                if (model._Account) {
                    PageHelper.showLoader();
                    DocumentTracking.get({
                            id: model._Account.id
                        })
                        .$promise
                        .then(function(resp) {
                            model.accountDocumentTracker = resp;
                        }, function(errResp) {
                            PageHelper.showProgress("view-batch", "Error while reading the account", 3000);
                        }).finally(function() {
                            PageHelper.hideLoader();
                        })
                } else {
                    $state.go("Page.Engine", {
                        pageName: "loans.individual.documentTracking.PendingFilingQueue",
                        pageId: null
                    });
                }
            },
            modelPromise: function(pageId, _model) {},
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return []
            },
            form: [{
                    "type": "box",
                    "title": "ACCOUNT_DETAILS",
                    "readonly": true,
                    "items": [{
                        key: "accountDocumentTracker.branchName",
                        title: "BRANCH_NAME"
                    }, {
                        key: "accountDocumentTracker.centreName",
                        title: "SPOKE_NAME"
                    }, {
                        key: "accountDocumentTracker.applicantName",
                        title: "APPLICANT_NAME"
                    }, {
                        key: "accountDocumentTracker.customerName",
                        title: "ENTITY_NAME"
                    }, {
                        key: "accountDocumentTracker.accountNumber",
                        title: "ACCOUNT_NUMBER"
                    }, {
                        key: "accountDocumentTracker.scheduledDisbursementDate",
                        title: "DISBURSEMENT_DATE"
                    }]
                },

                {
                    "type": "box",
                    "title": "PENDING_FILING",
                    "items": [
                        {
                            "title": "FILE_LOCATION",
                            "key": "accountDocumentTracker.fileLocation",
                            "type":"select",
                            "onChange":function(value,form,model){
                                if (model.accountDocumentTracker.fileLocation =='On-Site'){
                                    model.accountDocumentTracker.barcodeNumber = '';
                                    model.accountDocumentTracker.cartonNumber = '';
                                }
                            }
                        },
                        {
                            "title": "CARTON_NUMBER",
                            "key": "accountDocumentTracker.cartonNumber",
                            "condition":"model.accountDocumentTracker.fileLocation=='Off-Site'"
                        }, 
                        {
                            "title": "BARCODE_NUMBER",
                            "key": "accountDocumentTracker.barcodeNumber",
                            "condition":"model.accountDocumentTracker.fileLocation=='Off-Site'"
                        }]
                },
                {
                    "type": "actionbox",
                    "items": [
                    {
                        "type": "button",
                        "title": "Back",
                        "onClick": "actions.goBack(model, formCtrl, form, $event)"
                    },
                    {
                        "type": "submit",
                        "title": "Submit"
                    }]
                },

            ],
            schema: function() {
                return DocumentTracking.getSchema().$promise;
            },
            actions: {
                goBack: function(model, form, formName) {
                    $log.info("Inside goBack()");
                    $state.go("Page.Engine", {
                        pageName: "loans.individual.documentTracking.PendingFilingQueue",
                        pageId: null
                    });
                },
                submit: function(model, form, formName) {
                    if (model.accountDocumentTracker.fileLocation=='Off-Site'
                        && (model.accountDocumentTracker.barcodeNumber=='' ||
                        model.accountDocumentTracker.cartonNumber=='')) {
                        PageHelper.showProgress("view-account", "Barcode Number and Carton Number are mandatory for Off-Site Location", 3000);
                        return false;
                    }
                    var reqData = {
                        accountDocumentTracker: [_.cloneDeep(model.accountDocumentTracker)]
                    };
                    reqData.accountDocumentTrackingAction = "PROCEED";
                    $log.info(reqData);
                    PageHelper.showLoader();
                    PageHelper.showProgress("update-batch", "Working...");
                    DocumentTracking.update(reqData)
                        .$promise
                        .then(function(res) {
                            PageHelper.showProgress("update-batch", "Batch Updated.", 3000);
                            $state.go("Page.Engine", {
                                pageName: "loans.individual.documentTracking.PendingFilingQueue",
                                pageId: null
                            });
                        }, function(httpRes) {
                            PageHelper.showProgress("update-batch", "Oops. Some error occured.", 3000);
                            PageHelper.showErrors(httpRes);
                        })
                        .finally(function() {
                            PageHelper.hideLoader();
                        })
                }
            }
        };

    }
]);