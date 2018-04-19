define({
    pageUID: "Journal.JournalPosting",
    pageType: "Engine",
    dependencies: ["$log", "Journal", "$state", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"],

    $pageFn: function($log, Journal, $state, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "BRANCH_POSTING_ENTRY",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.journal = model.journal || {};
                if (!_.hasIn(model.journal, 'journalEntryDto') || model.journal.journalEntryDto == null) {
                    model.journal.journalEntryDto = {};
                }
                model.journal.journalEntryDto.valueDate = moment(new Date()).format("YYYY-MM-DD");
                model.journal.journalEntryDto.branchId = SessionStore.getCurrentBranch().branchId;


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
                $log.info("Inside submit()");
            },
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return []
            },

            form: [{
                "type": "box",
                "title": "JOURNAL_POSTING",
                "items": [{
                    key: "journal.journalEntryDto.id",
                    readonly: true,
                    condition: "model.journal.journalEntryDto.id"
                }, {
                    key: "journal.journalEntryDto.transactionName",
                    "type": "lov",
                    lovonly: true,
                    "inputMap": {
                        "transactionName": {
                            "key": "journal.journalEntryDto.transactionName",
                            "title": "TRANSACTION_NAME",
                            "type": "string"
                        },
                        "transactionDescription": {
                            "key": "journal.journalEntryDto.transactionDescription",
                            "title": "TRANSACTION_DESCRIPTION",
                            "type": "string"
                        },
                        "debitGLNo": {
                            "key": "journal.journalEntryDto.debitGLNo",
                            "title": "DEBIT_GL_NO",
                            "type": "string",
                        },
                        "creditGLNo": {
                            "key": "journal.journalEntryDto.creditGLNo",
                            "title": "CREDIT_GL_NO",
                            "type": "string",
                        }
                    },
                    "outputMap": {
                        "id": "journal.journalEntryDto.journalMasterId",
                        "transactionName": "journal.journalEntryDto.transactionName",
                        "transactionDescription": "journal.journalEntryDto.transactionDescription",
                        "debitGLNo": "journal.journalEntryDto.debitGLNo",
                        "creditGLNo": "journal.journalEntryDto.creditGLNo",
                    },
                    "searchHelper": formHelper,
                    "search": function(inputModel, form,model) {
                        var ret = [];
                        var defered = $q.defer();
                        Journal.journalSearch({
                            'transactionName': inputModel.transactionName,
                            'transactionDescription': inputModel.transactionDescription,
                            'debitGLNo': inputModel.debitGLNo,
                            'creditGLNo': inputModel.creditGLNo,
                            'isApplicable': 0,
                        }).$promise.then(function(response){
                            var count=0; 
                            angular.forEach(response.body, function(value, key) {
                                $log.info(value);
                                Journal.get({
                                    id: value.id
                                }, function(res) {
                                    $log.info(model.journal.journalEntryDto.branchId);
                                    if (res.journalBranches && res.journalBranches) {
                                        for (k = 0; k < res.journalBranches.length; k++) {
                                            if (res.journalBranches[k].branchId == model.journal.journalEntryDto.branchId) {
                                                $log.info("hi");
                                                ret.push(value);
                                            }
                                        }
                                    }
                                    count++;
                                    if(count==response.body.length)
                                    {
                                        defered.resolve({
                                            headers: {
                                                "x-total-count": ret.length
                                            },
                                            body: ret
                                        });
                                    }
                                });
                            });
                        });
                        return defered.promise;
                    },
                    getListDisplayItem: function(data, index) {
                        return [
                            data.id,
                            data.transactionName,
                            data.transactionDescription
                        ];
                    },
                    onSelect: function(valueObj, model, context) {
                        
                    }
                }, {
                    key: "journal.journalEntryDto.transactionDescription",
                    readonly: true,
                }, {
                    key: "journal.journalEntryDto.creditGLNo",
                    readonly: true,
                }, {
                    key: "journal.journalEntryDto.debitGLNo",
                    readonly: true,
                }, {
                    key: "journal.journalEntryDto.transactionAmount",
                    "required":true,
                    type: "amount"
                }, {
                    key: "journal.journalEntryDto.instrumentBankName",
                    type: "string"
                }, {
                    key: "journal.journalEntryDto.instrumentBranchName",
                    type: "string"
                }, {
                    key: "journal.journalEntryDto.instrumentType",
                    "type": "select",
                    "titleMap": [{
                        "name": "CASH",
                        "value": "CASH"
                    }, {
                        "name": "CHEQUE",
                        "value": "CHEQUE"
                    }, {
                        "name": "NEFT",
                        "value": "NEFT"
                    }, {
                        "name": "RTGS",
                        "value": "RTGS"
                    }]
                }, {
                    key: "journal.journalEntryDto.instrumentNumber",
                    "title": "INSTRUMENT_DATE"
                }, {
                    key: "journal.journalEntryDto.instrumentDate",
                    "title": "INSTRUMENT_NUMBER",
                    type: "date"
                }, {
                    key: "journal.journalEntryDto.ifscCode",
                    type: "string"
                }, {
                    key: "journal.journalEntryDto.valueDate",
                    type: "date"
                }, {
                    key: "journal.journalEntryDto.relatedAccountNo",
                    title: "RELATED_ACCOUNT_NO"
                    // "required":true
                }, {
                    key: "journal.journalEntryDto.remarks",
                    "required":true
                }]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "SUBMIT"
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
                                        "type": "string"
                                    },
                                    "instrumentBranchName": {
                                        "title": "INSTRUMENT_BRANCH_NAME",
                                        "type": "string"
                                    },
                                    "instrumentType": {
                                        "title": "INSTRUMENT_TYPE",
                                        "type": "string"
                                    },
                                    "instrumentNumber": {
                                        "title": "INSTRUMENT_NUMBER",
                                        "type": "string"
                                    },
                                    "instrumentDate": {
                                        "title": "INSTRUMENT_DATE",
                                        "type": "string"
                                    },
                                    "ifscCode": {
                                        "title": "IFSC_CODE",
                                        "type": "string"
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