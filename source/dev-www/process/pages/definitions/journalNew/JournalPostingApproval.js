define({
    pageUID: "Journal.JournalPostingApproval",
    pageType: "Engine",
    dependencies: ["$log", "Journal", "$state", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"],

    $pageFn: function($log, Journal, $state, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "JOURNAL_POSTING",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.journal = model.journal || {};
                if (!_.hasIn(model.journal, 'journalEntryDto') || model.journal.journalEntryDto == null) {
                    model.journal.journalEntryDto = {};
                }
                model.journal.journalEntryDto.valueDate = moment(new Date()).format("YYYY-MM-DD");
                $log.info("Inside submit()");
                if (!(model && model.journal && model.journal.journalEntryDto && model.journal.journalEntryDto.id && model.$$STORAGE_KEY$$)) {
                    PageHelper.showLoader();
                    PageHelper.showProgress("page-init", "Loading...");
                    var journalId = $stateParams.pageId;
                    if (!journalId) {
                        PageHelper.hideLoader();
                    } else {
                        Journal.getJournalEntry({
                                id: journalId
                            },
                            function(res) {
                                _.assign(model.journal.journalEntryDto, res);
                                $log.info(model.journal.journalEntryDto);
                                PageHelper.hideLoader();
                            }
                        );
                    }
                    $log.info("Journal page  is initiated ");
                }
            },
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return []
            },

            form: [{
                "type": "box",
                "readonly": true,
                "title": "JOURNAL_POSTING",
                "items": [{
                    key: "journal.journalEntryDto.id",

                }, {
                    key: "journal.journalEntryDto.transactionName",

                }, {
                    key: "journal.journalEntryDto.transactionDescription",
                }, {
                    key: "journal.journalEntryDto.creditGLNo",
                }, {
                    key: "journal.journalEntryDto.debitGLNo",
                }, {
                    key: "journal.journalEntryDto.transactionAmount",
                    type: "amount"
                }, {
                    key: "journal.journalEntryDto.instrumentBankName"
                }, {
                    key: "journal.journalEntryDto.instrumentBranchName"
                }, {
                    key: "journal.journalEntryDto.instrumentType"
                }, {
                    key: "journal.journalEntryDto.instrumentNumber"
                }, {
                    key: "journal.journalEntryDto.instrumentDate",
                    type: "date"
                }, {
                    key: "journal.journalEntryDto.ifscCode"
                }, {
                    key: "journal.journalEntryDto.valueDate",
                    type: "date"
                }, {
                    key: "journal.journalEntryDto.relatedAccountNo",
                    title: "RELATED_ACCOUNT_NO"
                }, {
                    key: "journal.journalEntryDto.remarks",
                }]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "APPROVE"
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
                            "remarks": {
                                "title": "REMARKS",
                                "type": "string"
                            },
                            "journalEntryDto": {
                                "type": "object",
                                "required": ["transactionAmount"],
                                "properties": {
                                    "creditGLNo": {
                                        "title": "CREDIT_GL_NO",
                                        "type": "string"
                                    },
                                    "debitGLNo": {
                                        "title": "DEBIT_GL_NO",
                                        "type": "string"
                                    },
                                    "id": {
                                        "title": "JOURNAL_ENTRY_ID",
                                        "type": "number"
                                    },
                                    "journalMasterId": {
                                        "title": "JOURNAL_MASTER_ID",
                                        "type": "number"
                                    },
                                    "relatedAccountNo": {
                                        "title": "RELATED_ACCOUNT_NO",
                                        "type": "string"
                                    },
                                    "remarks": {
                                        "title": "REMARKS",
                                        "type": "string"
                                    },
                                    "transactionAmount": {
                                        "title": "TRANSACTION_AMOUNT",
                                        "type": "number"
                                    },
                                    "transactionDescription": {
                                        "title": "TRANSACTION_DESCRIPTION",
                                        "type": "string"
                                    },
                                    "transactionDate": {
                                        "title": "TRANSACTION_DATE",
                                        "type": "string"
                                    },
                                    "transactionId": {
                                        "title": "TRANSACTION_ID",
                                        "type": "string"
                                    },
                                    "transactionName": {
                                        "title": "TRANSACTION_NAME",
                                        "type": "string"
                                    },
                                    "transactionResponse": {
                                        "title": "TRANSACTION_RESPONSE",
                                        "type": "string"
                                    },
                                    "transactionStatus": {
                                        "title": "TRANSACTION_STATUS",
                                        "type": "string"
                                    },
                                    "transactionType": {
                                        "title": "TRANSACTION_TYPE",
                                        "type": "string"
                                    },
                                    "valueDate": {
                                        "title": "VALUE_DATE",
                                        "type": "string"
                                    },
                                    "instrumentBankName": {
                                        "title": "INSTRUMENT_BANK_NAME",
                                        "type": ["string","null"]
                                    },
                                    "instrumentBranchName": {
                                        "title": "INSTRUMENT_BRANCH_NAME",
                                        "type": ["string","null"]
                                    },
                                    "instrumentType": {
                                        "title": "INSTRUMENT_TYPE",
                                        "type": ["string","null"]
                                    },
                                    "instrumentNumber": {
                                        "title": "INSTRUMENT_NUMBER",
                                        "type": ["string","null"]
                                    },
                                    "instrumentDate": {
                                        "title": "INSTRUMENT_DATE",
                                        "type": ["string","null"]
                                    },
                                    "ifscCode": {
                                        "title": "IFSC_CODE",
                                        "type": ["string","null"]
                                    },
                                }
                            }
                        }
                    }
                }
            },

            actions: {
                preSave: function(model, form, formName) {
                    var deferred = $q.defer();
                    if (model.journal.journalEntryDto.transactionName) {
                        deferred.resolve();
                    } else {
                        PageHelper.showProgress('Journal Save', 'Transaction Name is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },
                submit: function(model, form, formName) {
                    $log.info("Inside submit()");
                    PageHelper.showLoader();
                    PageHelper.showProgress("Journal Save", "Working...");
                    if (model.journal.journalEntryDto.id) {
                        model.journal.journalEntryProcessAction = "PROCEED",
                            Journal.updateJournalEntry(model.journal)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("Journal Save", "Journal Updated with id", 3000);
                                $log.info(res);
                                model.journal = res;
                                $state.go('Page.JournalPostingDashboard', null);
                            }, function(httpRes) {
                                PageHelper.showProgress("Journal Save", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            }).finally(function() {
                                PageHelper.hideLoader();
                            })
                    } else {
                        model.journal.journalEntryProcessAction = "SAVE",
                            model.journal.journalEntryDto.transactionDate = Utils.getCurrentDate();
                        model.journal.journalEntryDto.transactionType = "Entry";
                        Journal.createJournalEntry(model.journal)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("Journal Save", "Journal Created with id", 3000);
                                $log.info(res);
                                model.journal = res;
                                $state.go('Page.JournalPostingDashboard', null);
                            }, function(httpRes) {
                                PageHelper.showProgress("Journal Save", "Oops. Some error occured.", 3000);
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