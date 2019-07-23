define(['perdix/domain/model/journal/branchposting/BranchPostingProcess'], function(BranchPostingProcess) {
    BranchPostingProcess = BranchPostingProcess['BranchPostingProcess'];
   
    return {
        pageUID: "Journal.JournalPosting",
        pageType: "Engine",
        dependencies: ["$log", "Journal", "$state", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator", "UIRepository", "IrfFormRequestProcessor"],

        $pageFn: function($log, Journal, $state, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
            PageHelper, Utils, PagesDefinition, Queries, irfNavigator, UIRepository, IrfFormRequestProcessor) {

            var branch = SessionStore.getBranch();

            var configFile = function() {
                return {
                    "branchProcess.journalEntryDto.currentStage": {
                        "branchPostingReview": {
                            "overrides": {
                                "BranchPostingEntry": {
                                    "readonly": true
                                }
                            }
                        },
                        "Rejected": {
                            "overrides": {
                                "BranchPostingEntry": {
                                    "readonly": true
                                }
                            }
                        },
                        "Completed": {
                            "excludes": [
                                "actionBox"
                            ],
                            "overrides": {
                                "BranchPostingEntry.transactionName": {
                                    "readonly": true
                                },
                                "BranchPostingEntry.transactionDescription": {
                                    "readonly": true
                                },
                                "BranchPostingEntry.entryType": {
                                    "readonly": true
                                },
                                "BranchPostingEntry.creditGLNo": {
                                    "readonly": true
                                },
                                "BranchPostingEntry.debitGLNo": {
                                    "readonly": true
                                },
                                "BranchPostingEntry.transactionAmount": {
                                    "readonly": true
                                },
                                "BranchPostingEntry.billNo": {
                                    "readonly": true
                                },
                                "BranchPostingEntry.billDate": {
                                    "readonly": true
                                },
                                "BranchPostingEntry.billUpload": {
                                    "readonly": true
                                },
                                "BranchPostingEntry.instrumentBankName": {
                                    "readonly": true
                                },
                                "BranchPostingEntry.instrumentBranchName": {
                                    "readonly": true
                                },
                                "BranchPostingEntry.instrumentType": {
                                    "readonly": true
                                },
                                "BranchPostingEntry.transactionDate": {
                                    "readonly": true
                                },
                                "BranchPostingEntry.remarks": {
                                    "readonly": true
                                },
                                "BranchPostingEntry.instrumentNumber": {
                                    "readonly": true
                                },
                                "BranchPostingEntry.instrumentDate": {
                                    "readonly": true
                                },
                                "BranchPostingEntry.ifscCode": {
                                    "readonly": true
                                },
                                "BranchPostingEntry.valueDate": {
                                    "readonly": true
                                },
                                "BranchPostingEntry.relatedAccountNo": {
                                    "readonly": true
                                }
                            }
                        }
                    }
                }
            }
            var getIncludes = function(model) {
                return [
                "BranchPostingEntry",
                "BranchPostingEntry.transactionName",
                "BranchPostingEntry.transactionDescription",
                "BranchPostingEntry.entryType",
                "BranchPostingEntry.branchId",
                "BranchPostingEntry.creditGLNo",
                "BranchPostingEntry.debitGLNo",
                "BranchPostingEntry.creditGLName",
                "BranchPostingEntry.debitGLName",
                "BranchPostingEntry.transactionAmount",
                "BranchPostingEntry.billNo",
                "BranchPostingEntry.billDate",
                "BranchPostingEntry.billUpload",
                "BranchPostingEntry.instrumentBankName",
                "BranchPostingEntry.instrumentBranchName",
                "BranchPostingEntry.instrumentType",
                "BranchPostingEntry.transactionDate",
                "BranchPostingEntry.remarks",
                "BranchPostingEntry.instrumentNumber",
                "BranchPostingEntry.instrumentDate",
                "BranchPostingEntry.ifscCode",
                "BranchPostingEntry.valueDate",
                "BranchPostingEntry.relatedAccountNo",
                "BranchPostingEntry.relatedAccountNo1",
                "BranchPostingEntry.print"
                ]
            }

            return {
                "type": "schema-form",
                "title": "BRANCH_POSTING_ENTRY",
                "subTitle": "",
                initialize: function(model, form, formCtrl) {
                    model.journal = model.journal || {};
                    var self = this;
                    var formRequest = {
                        "overrides": {
                            "BranchPostingEntry.billNo": {
                                "condition": 'model.journal.journalEntryDto.entryType == ("Payment - Account") || model.journal.journalEntryDto.entryType == ("Payment") || model.journal.journalEntryDto.entryType == ("Journal - Account") || model.journal.journalEntryDto.entryType == ("Journal")',
                                "type": "text"
                            },
                            "BranchPostingEntry.billDate": {
                                "condition": 'model.journal.journalEntryDto.entryType == ("Payment - Account") || model.journal.journalEntryDto.entryType == ("Payment") || model.journal.journalEntryDto.entryType == ("Journal - Account") || model.journal.journalEntryDto.entryType == ("Journal")'
                            },
                            "BranchPostingEntry.billUpload": {
                                "condition": 'model.journal.journalEntryDto.entryType == ("Payment - Account") || model.journal.journalEntryDto.entryType == ("Payment") || model.journal.journalEntryDto.entryType == ("Journal - Account") || model.journal.journalEntryDto.entryType == ("Journal")'
                            },
                            "BranchPostingEntry.instrumentType": {
                                "condition": 'model.journal.journalEntryDto.entryType == ("Payment - Account") || model.journal.journalEntryDto.entryType == ("Payment") || model.journal.journalEntryDto.entryType == ("Receipt - Account") || model.journal.journalEntryDto.entryType == ("Receipt")',
                                "orderNo": 65
                            },
                            "BranchPostingEntry.instrumentNumber": {
                                "condition": '(model.journal.journalEntryDto.entryType == ("Payment - Account") || model.journal.journalEntryDto.entryType == ("Payment") || model.journal.journalEntryDto.entryType == ("Receipt - Account") || model.journal.journalEntryDto.entryType == ("Receipt")) && model.journal.journalEntryDto.instrumentType.toLowerCase() == "cheque" || model.journal.journalEntryDto.instrumentType.toLowerCase() == "neft" || model.journal.journalEntryDto.instrumentType.toLowerCase() == "rtgs"'
                            },
                            "BranchPostingEntry.instrumentDate": {
                                "condition": 'model.journal.journalEntryDto.entryType == ("Payment - Account") || model.journal.journalEntryDto.entryType == ("Payment") || model.journal.journalEntryDto.entryType == ("Receipt - Account") || model.journal.journalEntryDto.entryType == ("Receipt")'
                            },
                            "BranchPostingEntry.instrumentBankName": {
                                "condition": '(model.journal.journalEntryDto.entryType == ("Payment - Account") || model.journal.journalEntryDto.entryType == ("Payment") || model.journal.journalEntryDto.entryType == ("Receipt - Account") || model.journal.journalEntryDto.entryType == ("Receipt")) && model.journal.journalEntryDto.instrumentType.toLowerCase() == "cheque" || model.journal.journalEntryDto.instrumentType.toLowerCase() == "neft" || model.journal.journalEntryDto.instrumentType.toLowerCase() == "rtgs"'
                            },
                            "BranchPostingEntry.instrumentBranchName": {
                                "condition": '(model.journal.journalEntryDto.entryType == ("Payment - Account") || model.journal.journalEntryDto.entryType == ("Payment") || model.journal.journalEntryDto.entryType == ("Receipt - Account") || model.journal.journalEntryDto.entryType == ("Receipt")) && model.journal.journalEntryDto.instrumentType.toLowerCase() == "cheque" || model.journal.journalEntryDto.instrumentType.toLowerCase() == "neft" || model.journal.journalEntryDto.instrumentType.toLowerCase() == "rtgs"'
                            },
                            "BranchPostingEntry.ifscCode": {
                                "condition": '(model.journal.journalEntryDto.entryType == ("Payment - Account") || model.journal.journalEntryDto.entryType == ("Payment") || model.journal.journalEntryDto.entryType == ("Receipt - Account") || model.journal.journalEntryDto.entryType == ("Receipt")) && model.journal.journalEntryDto.instrumentType.toLowerCase() == "cheque" || model.journal.journalEntryDto.instrumentType.toLowerCase() == "neft" || model.journal.journalEntryDto.instrumentType.toLowerCase() == "rtgs"',
                                "resolver": "JournalIFSCLOVConfiguration",
                                "type": "lov",
                                "lovonly": true,
                                "required":true
                            },
                            "BranchPostingEntry.relatedAccountNo1": {
                                "resolver": "JournalIFSCAccountNoConfiguration",
                                "type": "lov",
                                "lovonly": true,
                                "condition": 'model.journal.journalEntryDto.entryType == ("Payment")|| model.journal.journalEntryDto.entryType == ("Receipt") || model.journal.journalEntryDto.entryType == ("Journal") || model.journal.journalEntryDto.entryType == ("Contra")'
                            },
                            "BranchPostingEntry.relatedAccountNo": {
                                "resolver": "JournalIFSCAccountNoConfiguration",
                                "type": "lov",
                                "lovonly": true,
                                "condition": 'model.journal.journalEntryDto.entryType == ("Payment - Account")|| model.journal.journalEntryDto.entryType == ("Receipt - Account") || model.journal.journalEntryDto.entryType == ("Journal - Account") || model.journal.journalEntryDto.entryType == ("Contra - Account")',
                                "required" : true
                            }
                            
                        },
                        "includes": getIncludes (model),
                        "excludes": [
                        ""
                        ],
                        "options": {
                            "repositoryAdditions": {
                                "BranchPostingEntry": {
                                    "items": {
                                        "relatedAccountNo1": {
                                            "key": "journal.journalEntryDto.relatedAccountNo",
                                            "title": "RELATED_ACCOUNT_NO",
                                            "orderNo": 140
                                        },
                                        "print": {                                         
                                        "condition": 'model.journal.journalEntryDto.currentStage == ("Completed") && model.journal.journalEntryDto.transactionType == ("Expenses")',
                                        "type": "button",
                                        "title": "PRINT VOUCHER",
                                        "onClick": "actions.printPDF(model, formCtrl, form, $event)"
                                        },
                                        "debitGLName": {
                                            "key": "journal.journalEntryDto.debitGLName",
                                            "title": "Debit GL Name",
                                            "orderNo": 45,
                                            "readonly":true
                                        },
                                        "creditGLName": {
                                            "key": "journal.journalEntryDto.creditGLName",
                                            "title": "Credit GL Name",
                                            "orderNo": 55,
                                            "readonly":true
                                        },
                                        "branchId" :{
                                            "key": "journal.journalEntryDto.branchId",
                                            "title": "BRANCH_NAME",
                                            "orderNo": 35,
                                            "type": "select",
                                            "enumCode": "branch_id",
                                            "readonly": true
                                        },
                                    }
                                }
                            },
                            "additions": [
                            {
                                "type": "actionbox",
                                "condition":"model.journal.journalEntryDto.currentStage!=='branchPostingReview'",
                                "orderNo": 1200,
                                "items": [
                                {
                                    "type": "button",
                                    "title": "SAVE",

                                    "onClick": "actions.save(model, formCtrl, form, $event)"
                                },
                                {
                                    "type": "submit",

                                    "title": "SUBMIT"
                                }],
                            },
                            {
                                "type": "box",
                                "orderNo": 999,
                                "title": "POST_REVIEW",
                                "condition":"model.journal.journalEntryDto.currentStage=='branchPostingReview'",
                                "items": [{
                                        key: "review.action",
                                        type: "radios",
                                        titleMap: {
                                            "REJECT": "REJECT",
                                            "SEND_BACK": "SEND_BACK",
                                            "PROCEED": "PROCEED"
                                        }
                                    },{
                                        type: "section",
                                        condition: "model.review.action=='PROCEED'",
                                        items: [{
                                            "type": "button",
                                            "title": "PROCEED",
                                            "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                        }]
                                    },{
                                         type: "section",
                                        condition: "model.review.action=='REJECT'",
                                        items: [{
                                            "type": "button",
                                            "title": "REJECT",
                                            "onClick": "actions.reject(model, formCtrl, form, $event)"
                                        }]
                                    },{
                                    type: "section",
                                    condition: "model.review.action=='SEND_BACK'",
                                    "items": [
                                    {
                                        title: "REMARKS",
                                        key: "branchProcess.remarks",
                                        type: "textarea",
                                        required: true
                                    }, {
                                        key: "branchProcess.stage",
                                        "required": true,
                                        type: "lov",
                                        autolov: true,
                                        lovonly:true,
                                        title: "SEND_BACK_TO_STAGE",
                                        bindMap: {},
                                        searchHelper: formHelper,
                                        search: function(inputModel, form, model, context) {
                                            var stage1 = model.branchProcess.journalEntryDto.currentStage;
                                            var targetstage = formHelper.enum('posting_target_stage').data;
                                            var out = [];
                                            for (var i = 0; i < targetstage.length; i++) {
                                                var t = targetstage[i];
                                                if (t.field1 == stage1) {
                                                    out.push({
                                                        name: t.name,
                                                        value:t.code
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
                                            // model.review.targetStage1 = valueObj.name;
                                            model.branchProcess.stage = valueObj.value;

                                        },
                                        getListDisplayItem: function(item, index) {
                                            return [
                                            item.name
                                            ];
                                        }
                                    }, {

                                        type: "button",
                                        title: "SEND_BACK",
                                        onClick: "actions.sendBack(model, formCtrl, form, $event)"
                                    }
                                    ]


                                }]
                            }
                            ]

                        }
                    };

                                    model.branchProcess = journal;
                                    model.journal.journalEntryDto = {};
                                    model.journal.journalEntryDto = journal.journalEntryDto;
                                    Journal.listAccountCode({
                                        'productCode': model.journal.journalEntryDto.creditGLNo.split(":")[2]
                                    }).$promise.then(function(response) {
                                        model.journal.journalEntryDto.creditGLName = response.body[0].glName
                                    });
                                    Journal.listAccountCode({
                                        'productCode': model.journal.journalEntryDto.debitGLNo.split(":")[2]
                                    }).$promise.then(function(response) {
                                        model.journal.journalEntryDto.debitGLName = response.body[0].glName       
                                   });
                                    UIRepository.getPostingEntryUIRepository().$promise
                                    .then(function(repo){
                                        return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                                    })
                                    .then(function(form){
                                        console.log(form)
                                        self.form = form;
                                    });
                                    PageHelper.hideLoader();
                                })
                            }
                            $log.info("Journal page  is initiated ");
                        } else {
                            BranchPostingProcess.getJournal(journalId)
                            .finally(function() {
                                PageHelper.showProgress('Posting', 'Loading Finished.', 5000);
                            })
                            .subscribe(function(journal) {

                                model.branchProcess = journal;
                                model.journal.journalEntryDto = {};
                                model.journal.journalEntryDto = journal.journalEntryDto;
                                UIRepository.getPostingEntryUIRepository().$promise
                                .then(function(repo){
                                    return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                                })
                                .then(function(form){
                                    console.log(form)
                                    self.form = form;
                                });
                                                               // model.journal.journalEntryDto.branchId = SessionStore.getCurrentBranch().branchId;
                            })
                        }
                        $log.info("Journal page  is initiated ");
                    } else {
                        BranchPostingProcess.createNewProcess()
                        .finally(function() {
                            PageHelper.showProgress('Posting', 'Loading Finished.', 5000);
                        })
                        .subscribe(function(journal) {
                            model.branchProcess = journal;
                            model.journal.journalEntryDto = {};
                            model.journal.journalEntryDto = journal.journalEntryDto;
                            UIRepository.getPostingEntryUIRepository().$promise
                            .then(function(repo){
                                return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                            })
                            .then(function(form){
                                console.log(form)
                                self.form = form;
                            });
                        })
                    }
                },
                offline: true,
                getOfflineDisplayItem: function(item, index) {
                    return []
                },
                form: [],
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
                                        "billNo": {
                                            "title": "BILL_NO",
                                            "type": "string"
                                        },
                                        "billUpload": {
                                            "title": "BILL_UPLOAD",
                                            "type": "string"
                                        },
                                        "billDate": {
                                            "title": "BILL_DATE",
                                            "type": ["string","null"]
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
                                            "type": ["string","null"]
                                        },
                                        "relatedAccountNo1": {
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
                                        "entryType": {
                                            "title": "PRODUCT_TYPE",
                                            "type": ["string", "null"]
                                        },
                                        "valueDate": {
                                            "title": "VALUE_DATE",
                                            "type": ["string","null"]
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
                        PageHelper.showProgress("Posting Save", "Working...");
                        model.branchProcess.remarks = model.journal.remarks;
                        model.branchProcess.save()
                        .finally(function() {

                        })
                        .subscribe(function(branchProcess) {
                            // console.log("out");
                            // console.log(branchProcess);
                            PageHelper.showProgress("Posting Save", "Posting Updated with id", 3000);
                            model.branchProcess.proceed()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(out) {
                                PageHelper.showProgress("Posting Save", "Posting Updated with id", 3000);
                                PageHelper.showProgress('Posting', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function(err) {
                                PageHelper.showProgress('Posting', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            })
                        }, function(err) {
                            PageHelper.showProgress('Posting', 'Oops. Some error.', 5000);
                            PageHelper.showErrors(err);
                            PageHelper.hideLoader();
                        });
                    },

                    save: function (model, formCtrl, form, $event) {
                        $log.info("Inside save()");
                        if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        PageHelper.showLoader();
                        model.branchProcess.remarks = model.journal.remarks;
                        model.branchProcess.save()
                        .finally(function() {
                            PageHelper.hideLoader();
                        })
                        .subscribe(function(out) {
                            PageHelper.showProgress("Posting Save", "Posting Updated with id", 3000);
                            PageHelper.showProgress('Posting', 'Done.', 5000);
                        }, function(err) {
                            PageHelper.showProgress('Posting', 'Oops. Some error.', 5000);
                            PageHelper.showErrors(err);
                            PageHelper.hideLoader();
                        });
                    },
                    reject: function (model, formCtrl, form, $event) {
                        $log.info("Inside reject()");
                        if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        PageHelper.showLoader();
                        model.branchProcess.remarks = model.journal.remarks;
                        model.branchProcess.reject()
                        .finally(function() {
                            PageHelper.hideLoader();
                        })
                        .subscribe(function(out) {
                            PageHelper.showProgress("Posting Rejected", "Posting Rejected", 3000);
                            PageHelper.showProgress('Posting', 'Done.', 5000);
                            irfNavigator.goBack();
                        }, function(err) {
                            PageHelper.showProgress('Posting', 'Oops. Some error.', 5000);
                            PageHelper.showErrors(err);
                            PageHelper.hideLoader();
                        });
                    },
                    proceed: function (model, formCtrl, form, $event) {
                        $log.info("Inside proceed()");
                        model.journal.journalEntryDto.creditGLNo = "TestGL101";
                        model.journal.journalEntryDto.debitGLNo = "TestGL101";
                        model.branchProcess.journalEntryDto = Utils.removeNulls(model.branchProcess.journalEntryDto, true);
                        if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        PageHelper.showLoader();
                        model.branchProcess.remarks = model.journal.remarks;
                        model.branchProcess.proceed("Completed")
                        .finally(function() {
                            PageHelper.hideLoader();
                        })
                        .subscribe(function(out) {
                            PageHelper.showProgress("Posting Save", "Posting Updated with id", 3000);
                            PageHelper.showProgress('Posting', 'Done.', 5000);
                            irfNavigator.goBack();
                        }, function(err) {
                            PageHelper.showProgress('Posting', 'Oops. Some error.', 5000);
                            PageHelper.showErrors(err);
                            PageHelper.hideLoader();
                        })
                    },
                    sendBack: function (model, formCtrl, form, $event) {
                        model.branchProcess.sendBack()
                        .finally(function() {
                            PageHelper.hideLoader();
                        })
                        .subscribe(function(out) {
                            PageHelper.showProgress("Posting Send Back", "Posting Send Back", 3000);
                            PageHelper.showProgress('Posting', 'Done.', 5000);
                            irfNavigator.goBack();
                        }, function(err) {
                            PageHelper.showProgress('Posting', 'Oops. Some error.', 5000);
                            PageHelper.showErrors(err);
                            PageHelper.hideLoader();
                        });
                    },
                    printPDF: function (model, formCtrl, form, $event) {
                       var biDownloadUrl =irf.FORM_DOWNLOAD_URL+'?form_name=cash_voucher&record_id='+model.branchProcess.journalEntryDto.id;
                       $log.info(biDownloadUrl);
                       window.open(biDownloadUrl);
                     }
                }
            }
        }
    }
})
