define(['perdix/domain/model/loan/LoanProcess', 'perdix/domain/shared/AngularResourceService'],function(LoanProcess, AngularResourceService){
    console.log(LoanProcess);
    console.log("TESTING");
    return {
    pageUID: "witfin.customer.JournalMultiPosting",
    pageType: "Engine",
    dependencies: ["$log", "Journal", "$state", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator", "SchemaResource", "$injector"],

    $pageFn: function($log, Journal, $state, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator, SchemaResource, $injector) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "MULTI_ENTRY_JOURNAL_POSTING",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.journal = model.journal || {};
                model.journal.journalHeader = model.journal.journalHeader || {};
                model.journal.journalHeader.journalDetails = [{
                        "interactionDate": Utils.getCurrentDate()
                }];

                AngularResourceService.getInstance().setInjector($injector);

                var lp = new LoanProcess();
                lp.get(6895)
                    .finally(function(){
                        console.log('INSIDE FINALLY');
                    })
                    .subscribe(
                        function(data){
                            console.log("data loaded");
                            console.log(data);
                        },
                        function(err) {
                            console.log("data error");
                            console.log(err);
                        }
                    )


                model.journal.journalHeader.valueDate = moment(new Date()).format("YYYY-MM-DD");
                model.journal.journalHeader.transactionDate = moment(new Date()).format("YYYY-MM-DD");
                model.journal.journalHeader.journalDetails.branchId = SessionStore.getCurrentBranch().branchId;



                $log.info("Inside submit()");
            },
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return []
            },

            form: [{
                "type": "box",
                "title": "Journal Details",
                "items": [{
                    key: "journal.journalHeader.journalDetails",
                    type: "array",
                    add: "new",
                    remove: "remove",
                    startEmpty: true,
                    view: "fixed",
                    title: "Journal Details",
                    items:[{

                        key: "journal.journalHeader.journalDetails[].drCrIndicator",
                        type: "select",
                        "titleMap": [{
                                "name": "DEBIT",
                                "value": "DEBIT"
                            }, {
                                "name": "CREDIT",
                                "value": "CREDIT"
                            }]

                    }, {
                        key: "journal.journalHeader.journalDetails[].glAcNo",
                        type: "string",
                    },
                    {
                        key: "journal.journalHeader.journalDetails[].ifscCode",
                        type: "string",
                    },
                    {
                        key: "journal.journalHeader.journalDetails[].instrumentBankName",
                        type: "string",
                    },
                    {
                        key: "journal.journalHeader.journalDetails[].instrumentBranchName",
                        type: "string",
                    },

                    {
                        key: "journal.journalHeader.journalDetails[].instrumentNumber",
                        type: "string",
                    },
                    {
                        key: "journal.journalHeader.journalDetails[].instrumentDate",
                        type: "date",
                    },
                    {
                        key: "journal.journalHeader.journalDetails[].instrumentType",
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
                    },
                    {
                        key: "journal.journalHeader.journalDetails[].relatedAccountNo",
                        type: "string",
                    },
                    {
                        key: "journal.journalHeader.journalDetails[].remarks",
                        type: "string",
                    },
                    {
                        key: "journal.journalHeader.journalDetails[].transactionAmount",
                        type: "number",
                    },
                    {
                        key: "journal.journalHeader.journalDetails[].transactionDescription",
                        type: "string",
                    },
                    ]
            }]
            },{
                "type": "box",
                "title": "Journal Transaction Details",

                "items":[

                {
                    key:"journal.journalHeader.transactionBranchId",
                    type: "number"
                },{
                    key:"journal.journalHeader.transactionDate",
                    type: "date"
                },{
                    key:"journal.journalHeader.transactionId",
                    type: "string"
                },{
                    key:"journal.journalHeader.valueDate",
                    type: "date"
                }, ]
            }, {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "SAVE"
                    }]
                },
            ],
            schema: function() {
                return SchemaResource.getJournalMultiSchema().$promise;
            },

            actions: {

                preSave: function(model, form, formName) {
                    var deferred = $q.defer();
                    if (model.journal.journalHeader.transactionBranchId) {
                        deferred.resolve();
                    } else {
                        PageHelper.showProgress('Journal Save', 'Transaction Branch ID is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },
                submit: function(model, form, formName) {
                    $log.info("Inside submit()");


                    var totalJournal = model.journal.journalHeader.journalDetails;

                    var debitCount = 0, creditCount = 0;
                    var debitAmount = 0; creditAmount = 0;
                    for(var i = 0; i < totalJournal.length; i++) {
                        if(totalJournal[i].drCrIndicator === 'DEBIT') {
                            ++debitCount;
                            debitAmount += totalJournal[i].transactionAmount;
                        } else {
                            ++creditCount;
                            creditAmount += totalJournal[i].transactionAmount;
                        }
                    }

                    model.journal.journalHeader.noOfCredits = creditCount;
                    model.journal.journalHeader.noOfDebits = debitCount;
                    model.journal.journalHeader.totalDebitAmount = debitAmount;
                    model.journal.journalHeader.totalCreditAmount = creditAmount;
                    model.journal.journalHeader.noOfTransaction = totalJournal.length;
                    model.journal.journalProcessAction = "SAVE",
                    PageHelper.showLoader();
                    PageHelper.showProgress("Journal Save", "Working...");
                    Journal.createMultiJournal(model.journal)
                    .$promise
                    .then(function(res) {
                        PageHelper.showProgress("Journal Save", "Journal Created with id", 3000);
                            $log.info(res);
                            model.journal = res;
                            $state.go('Page.JournalMultiPostingDashboard', null);
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
}})
