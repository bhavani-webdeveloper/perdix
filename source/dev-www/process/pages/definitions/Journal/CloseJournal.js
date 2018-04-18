define({
    pageUID: "Journal.CloseJournal",
    pageType: "Engine",
    dependencies: ["$log", "$state", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, $state, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "CLOSE_JOURNAL",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.journal = model.journal || {};
                $log.info("Inside submit()");
                if (!(model && model.journal && model.journal.id && model.$$STORAGE_KEY$$)) {
                    PageHelper.showLoader();
                    PageHelper.showProgress("page-init", "Loading...");
                    var journalId = $stateParams.pageId;
                    if (!journalId) {
                        PageHelper.hideLoader();
                    }
                    Journal.get({
                            id: journalId
                        },
                        function(res) {
                            _.assign(model.journal, res);
                            $log.info(model.journal);
                            PageHelper.hideLoader();
                        }
                    );
                    $log.info("Journal page  is initiated ");
                }
            },
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return []
            },

            form: [{
                "type": "box",
                "title": "CLOSE_JOURNAL",
                "items": [
                {
                    key: "journal.id",
                    "condition": "model.journal.id",
                    type: "number",
                    readonly: true,
                    "title": "JOURNAL_ID"
                }, {
                    key: "journal.creditGLNo",
                    type: "string",
                    readonly: true,
                    "title": "CREDIT_GL_NO"
                }, {
                    key: "journal.debitGLNo",
                    type: "string",
                    readonly: true,
                    "title": "DEBIT_GL_NO"
                }, {
                    key: "journal.transactionName",
                    type: "string",
                    readonly: true,
                    "title": "TRANSACTION_NAME"
                }, {
                    key: "journal.transactionDescription",
                    type: "string",
                    readonly: true,
                    "title": "TRANSACTION_DESCRIPTION"
                }, {
                    key: "journal.type",
                    type: "string",
                    readonly: true,
                    "title": "TRANSACTION_TYPE"
                }]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "Close"
                }]
            }],

            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "journal": {
                        "type": "object",
                        "required": [],
                        "properties": {
                            "branchId": {
                                "title": "BRANCH_NAME",
                                "type": "number"
                            },
                            "batchNumber": {
                                "title": "BATCH_NAME",
                                "type": "string"
                            }
                        }
                    }
                }
            },

            actions: {
                preSave: function(model, form, formName) {
                    $log.info("Inside submit()");
                },
                submit: function(model, form, formName) {
                    $log.info("Inside submit()");
                    model.journal.isApplicable=1;
                    PageHelper.showLoader();
                    PageHelper.showProgress("Journal Close", "Working...");
                    if (model.journal.id) {
                        Journal.closeJournal(model.journal)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("Journal Close", "Journal Closed with id" + res.id, 3000);
                                $log.info(res);
                                model.journal = res;
                            }, function(httpRes) {
                                PageHelper.showProgress("Journal Close", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            }).finally(function() {
                                PageHelper.hideLoader();
                            })
                    }
                }
            }
        }
    }
})