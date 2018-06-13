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
                                "BranchPostingEntry": {
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
                "BranchPostingEntry.productType",
                "BranchPostingEntry.creditGLNo",
                "BranchPostingEntry.debitGLNo",
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
                "BranchPostingEntry.relatedAccountNo1"
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
                                "condition": 'model.journal.journalEntryDto.productType == ("Payment - Account") || model.journal.journalEntryDto.productType == ("Payment") || model.journal.journalEntryDto.productType == ("Journal - Account") || model.journal.journalEntryDto.productType == ("Journal")',
                                "type": "text"
                            },
                            "BranchPostingEntry.billDate": {
                                "condition": 'model.journal.journalEntryDto.productType == ("Payment - Account") || model.journal.journalEntryDto.productType == ("Payment") || model.journal.journalEntryDto.productType == ("Journal - Account") || model.journal.journalEntryDto.productType == ("Journal")'
                            },
                            "BranchPostingEntry.billUpload": {
                                "condition": 'model.journal.journalEntryDto.productType == ("Payment - Account") || model.journal.journalEntryDto.productType == ("Payment") || model.journal.journalEntryDto.productType == ("Journal - Account") || model.journal.journalEntryDto.productType == ("Journal")'
                            },
                            "BranchPostingEntry.instrumentType": {
                                "condition": 'model.journal.journalEntryDto.productType == ("Payment - Account") || model.journal.journalEntryDto.productType == ("Payment") || model.journal.journalEntryDto.productType == ("Receipt - Account") || model.journal.journalEntryDto.productType == ("Receipt")',
                                "orderNo": 65
                            },
                            "BranchPostingEntry.instrumentNumber": {
                                "condition": '(model.journal.journalEntryDto.productType == ("Payment - Account") || model.journal.journalEntryDto.productType == ("Payment") || model.journal.journalEntryDto.productType == ("Receipt - Account") || model.journal.journalEntryDto.productType == ("Receipt")) && model.journal.journalEntryDto.instrumentType.toLowerCase() == "cheque" || model.journal.journalEntryDto.instrumentType.toLowerCase() == "neft" || model.journal.journalEntryDto.instrumentType.toLowerCase() == "rtgs"'
                            },
                            "BranchPostingEntry.instrumentDate": {
                                "condition": 'model.journal.journalEntryDto.productType == ("Payment - Account") || model.journal.journalEntryDto.productType == ("Payment") || model.journal.journalEntryDto.productType == ("Receipt - Account") || model.journal.journalEntryDto.productType == ("Receipt")'
                            },
                            "BranchPostingEntry.instrumentBankName": {
                                "condition": '(model.journal.journalEntryDto.productType == ("Payment - Account") || model.journal.journalEntryDto.productType == ("Payment") || model.journal.journalEntryDto.productType == ("Receipt - Account") || model.journal.journalEntryDto.productType == ("Receipt")) && model.journal.journalEntryDto.instrumentType.toLowerCase() == "cheque" || model.journal.journalEntryDto.instrumentType.toLowerCase() == "neft" || model.journal.journalEntryDto.instrumentType.toLowerCase() == "rtgs"'
                            },
                            "BranchPostingEntry.instrumentBranchName": {
                                "condition": '(model.journal.journalEntryDto.productType == ("Payment - Account") || model.journal.journalEntryDto.productType == ("Payment") || model.journal.journalEntryDto.productType == ("Receipt - Account") || model.journal.journalEntryDto.productType == ("Receipt")) && model.journal.journalEntryDto.instrumentType.toLowerCase() == "cheque" || model.journal.journalEntryDto.instrumentType.toLowerCase() == "neft" || model.journal.journalEntryDto.instrumentType.toLowerCase() == "rtgs"'
                            },
                            "BranchPostingEntry.ifscCode": {
                                "condition": 'model.journal.journalEntryDto.productType == ("Payment - Account") || model.journal.journalEntryDto.productType == ("Payment") || model.journal.journalEntryDto.productType == ("Receipt - Account") || model.journal.journalEntryDto.productType == ("Receipt")',
                                "resolver": "JournalIFSCLOVConfiguration",
                                "type": "lov",
                                "lovonly": true
                            },
                            "BranchPostingEntry.relatedAccountNo1": {
                                "resolver": "JournalIFSCAccountNoConfiguration",
                                "type": "lov",
                                "lovonly": true,
                                "condition": 'model.journal.journalEntryDto.productType == ("Payment")|| model.journal.journalEntryDto.productType == ("Receipt") || model.journal.journalEntryDto.productType == ("Journal") || model.journal.journalEntryDto.productType == ("Contra")'
                            },
                            "BranchPostingEntry.relatedAccountNo": {
                                "resolver": "JournalIFSCAccountNoConfiguration",
                                "type": "lov",
                                "lovonly": true,
                                "condition": 'model.journal.journalEntryDto.productType == ("Payment - Account")|| model.journal.journalEntryDto.productType == ("Receipt - Account") || model.journal.journalEntryDto.productType == ("Journal - Account") || model.journal.journalEntryDto.productType == ("Contra - Account")',
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
                                }]
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
                        var journalId = $stateParams.pageId;
                        if (journalId) {
                            PageHelper.showLoader();
                            PageHelper.showProgress("page-init", "Loading...", 5000);
                            var journalId = $stateParams.pageId;
                            if (!journalId) {
                                PageHelper.hideLoader();
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
                                    PageHelper.hideLoader();
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
                                // model.journal.journalEntryDto.branchId = SessionStore.getCurrentBranch().branchId;
                            })
                        }










                    // model.journal = model.journal || {};
                    // if (!_.hasIn(model.journal, 'journalEntryDto') || model.journal.journalEntryDto == null) {
                    //     model.journal.journalEntryDto = {};
                    // }
                    // model.journal.journalEntryDto.valueDate = moment(new Date()).format("YYYY-MM-DD");
                    // model.journal.journalEntryDto.branchId = SessionStore.getCurrentBranch().branchId;


                    // if (!(model && model.journal && model.journal.journalEntryDto && model.journal.journalEntryDto.id && model.$$STORAGE_KEY$$)) {
                    //     PageHelper.showLoader();
                    //     PageHelper.showProgress("page-init", "Loading...");
                    //     var journalId = $stateParams.pageId;
                    //     if (!journalId) {
                    //         PageHelper.hideLoader();
                    //     } else {
                    //         Journal.getJournalEntry({
                    //                 id: journalId
                    //             },
                    //             function(res) {
                    //                 _.assign(model.journal.journalEntryDto, res);
                    //                 $log.info(model.journal.journalEntryDto);
                    //                 PageHelper.hideLoader();
                    //             }
                    //         );
                    //     }
                    //     $log.info("Journal page  is initiated ");
                    // }
                    // $log.info("Inside submit()");
                },
                offline: true,
                getOfflineDisplayItem: function(item, index) {
                    return []
                },

                // form: [{
                //     "type": "box",
                //     "title": "JOURNAL_POSTING",
                //     "items": [{
                //         key: "journal.journalEntryDto.id",
                //         readonly: true,
                //         condition: "model.journal.journalEntryDto.id"
                //     }, {
                //         key: "journal.journalEntryDto.transactionName",
                //         "type": "lov",
                //         lovonly: true,
                //         "inputMap": {
                //             "transactionName": {
                //                 "key": "journal.journalEntryDto.transactionName",
                //                 "title": "TRANSACTION_NAME",
                //                 "type": "string"
                //             },
                //             "transactionDescription": {
                //                 "key": "journal.journalEntryDto.transactionDescription",
                //                 "title": "TRANSACTION_DESCRIPTION",
                //                 "type": "string"
                //             },
                //             "debitGLNo": {
                //                 "key": "journal.journalEntryDto.debitGLNo",
                //                 "title": "DEBIT_GL_NO",
                //                 "type": "string",
                //             },
                //             "creditGLNo": {
                //                 "key": "journal.journalEntryDto.creditGLNo",
                //                 "title": "CREDIT_GL_NO",
                //                 "type": "string",
                //             }
                //         },
                //         "outputMap": {
                //             "id": "journal.journalEntryDto.journalMasterId",
                //             "transactionName": "journal.journalEntryDto.transactionName",
                //             "transactionDescription": "journal.journalEntryDto.transactionDescription",
                //             "debitGLNo": "journal.journalEntryDto.debitGLNo",
                //             "creditGLNo": "journal.journalEntryDto.creditGLNo",
                //         },
                //         "searchHelper": formHelper,
                //         "search": function(inputModel, form,model) {
                //             var ret = [];
                //             var defered = $q.defer();
                //             Journal.journalSearch({
                //                 'transactionName': inputModel.transactionName,
                //                 'transactionDescription': inputModel.transactionDescription,
                //                 'debitGLNo': inputModel.debitGLNo,
                //                 'creditGLNo': inputModel.creditGLNo,
                //                 'isApplicable': 0,
                //             }).$promise.then(function(response){
                //                 var count=0;
                //                 angular.forEach(response.body, function(value, key) {
                //                     $log.info(value);
                //                     Journal.get({
                //                         id: value.id
                //                     }, function(res) {
                //                         $log.info(model.journal.journalEntryDto.branchId);
                //                         if (res.journalBranches && res.journalBranches) {
                //                             for (k = 0; k < res.journalBranches.length; k++) {
                //                                 if (res.journalBranches[k].branchId == model.journal.journalEntryDto.branchId) {
                //                                     $log.info("hi");
                //                                     ret.push(value);
                //                                 }
                //                             }
                //                         }
                //                         count++;
                //                         if(count==response.body.length)
                //                         {
                //                             defered.resolve({
                //                                 headers: {
                //                                     "x-total-count": ret.length
                //                                 },
                //                                 body: ret
                //                             });
                //                         }
                //                     });
                //                 });
                //             });
                //             return defered.promise;
                //         },
                //         getListDisplayItem: function(data, index) {
                //             return [
                //                 data.id,
                //                 data.transactionName,
                //                 data.transactionDescription
                //             ];
                //         },
                //         onSelect: function(valueObj, model, context) {

                //         }
                //     }, {
                //         key: "journal.journalEntryDto.transactionDescription",
                //         readonly: true,
                //     }, {
                //         key: "journal.journalEntryDto.creditGLNo",
                //         readonly: true,
                //     }, {
                //         key: "journal.journalEntryDto.debitGLNo",
                //         readonly: true,
                //     }, {
                //         key: "journal.journalEntryDto.transactionAmount",
                //         "required":true,
                //         type: "amount"
                //     }, {
                //         key: "journal.journalEntryDto.instrumentBankName",
                //         type: "string"
                //     }, {
                //         key: "journal.journalEntryDto.instrumentBranchName",
                //         type: "string"
                //     }, {
                //         key: "journal.journalEntryDto.instrumentType",
                //         "type": "select",
                //         "titleMap": [{
                //             "name": "CASH",
                //             "value": "CASH"
                //         }, {
                //             "name": "CHEQUE",
                //             "value": "CHEQUE"
                //         }, {
                //             "name": "NEFT",
                //             "value": "NEFT"
                //         }, {
                //             "name": "RTGS",
                //             "value": "RTGS"
                //         }]
                //     }, {
                //         key: "journal.journalEntryDto.instrumentNumber",
                //         "title": "INSTRUMENT_DATE"
                //     }, {
                //         key: "journal.journalEntryDto.instrumentDate",
                //         "title": "INSTRUMENT_NUMBER",
                //         type: "date"
                //     }, {
                //         key: "journal.journalEntryDto.ifscCode",
                //         type: "string"
                //     }, {
                //         key: "journal.journalEntryDto.valueDate",
                //         type: "date"
                //     }, {
                //         key: "journal.journalEntryDto.relatedAccountNo",
                //         title: "RELATED_ACCOUNT_NO"
                //         // "required":true
                //     }, {
                //         key: "journal.journalEntryDto.remarks",
                //         "required":true
                //     }]
                // }, {
                //     "type": "actionbox",
                //     "items": [{
                //         "type": "submit",
                //         "title": "SUBMIT"
                //     }]
                // }],
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
                                            "type": "string"
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
                                        "productType": {
                                            "title": "PRODUCT_TYPE",
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


                        // model.branchProcess.save().
                        //     subscribe(function(d) {
                        //         console.log(d)
                        //     }, function(err) {
                        //         console.log(err)
                        //     })
                        // $log.info("Inside submit()");
                        // PageHelper.showLoader();
                        // PageHelper.showProgress("Journal Save", "Working...");
                        // if (model.journal.journalEntryDto.id) {
                        //     model.journal.journalEntryProcessAction = "PROCEED",
                        //         Journal.updateJournalEntry(model.journal)
                        //         .$promise
                        //         .then(function(res) {
                        //             PageHelper.showProgress("Journal Save", "Journal Updated with id", 3000);
                        //             $log.info(res);
                        //             model.journal = res;
                        //             $state.go('Page.JournalPostingDashboard', null);
                        //         }, function(httpRes) {
                        //             PageHelper.showProgress("Journal Save", "Oops. Some error occured.", 3000);
                        //             PageHelper.showErrors(httpRes);
                        //         }).finally(function() {
                        //             PageHelper.hideLoader();
                        //         })
                        // } else {
                        //     model.journal.journalEntryProcessAction = "SAVE",
                        //         model.journal.journalEntryDto.transactionDate = Utils.getCurrentDate();
                        //     model.journal.journalEntryDto.transactionType = "Entry";
                        //     Journal.createJournalEntry(model.journal)
                        //         .$promise
                        //         .then(function(res) {
                        //             PageHelper.showProgress("Journal Save", "Journal Created with id", 3000);
                        //             $log.info(res);
                        //             model.journal = res;
                        //             $state.go('Page.JournalPostingDashboard', null);
                        //         }, function(httpRes) {
                        //             PageHelper.showProgress("Journal Save", "Oops. Some error occured.", 3000);
                        //             PageHelper.showErrors(httpRes);
                        //         }).finally(function() {
                        //             PageHelper.hideLoader();
                        //         })
                        // }
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
                    }
                }
            }
        }
    }
})
