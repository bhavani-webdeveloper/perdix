define({
    pageUID: "Journal.JournalMultiPostingApproval",
    pageType: "Engine",
    dependencies: ["$log", "Journal", "Lead", "$state", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator", "SchemaResource"],

    $pageFn: function($log, Journal, Lead, $state, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator, SchemaResource) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "JOURNAL_Multi_POSTING",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.journal = model.journal || {};
                

                if (!_.hasIn(model.journal, 'journalHeader') || model.journal.journalHeader == null) {
                    model.journal.journalHeader = {};
                }


                if (!(model && model.journal && model.journal.journalHeader && model.journal.journalHeader.id && model.$$STORAGE_KEY$$)) {
                    PageHelper.showLoader();
                    PageHelper.showProgress("page-init", "Loading...");
                    var journalId = $stateParams.pageId;
                    if (!journalId) {
                        PageHelper.hideLoader();
                    } else {
                        Journal.getMultiJournalEntry({
                                id: journalId
                            },
                            function(res) {
                              
                                model.journal.journalHeader = res;

                                $log.info(model.journal);
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
                "title": "Journal Details",
                "readonly": true,
                "items": [{
                    "type": "box",
                    "readonly": true,
                    "key":"journal.journalHeader.journalDetails",
                    "type":"array",
                    title: "Journal Details",
                    items:[{

                        key: "journal.journalHeader.journalDetails[].drCrIndicator",
                        
                    
                    }, {
                        key: "journal.journalHeader.journalDetails[].glAcNo",
                        
                    },
                    {
                        key: "journal.journalHeader.journalDetails[].ifscCode",
                       
                    },
                    {
                        key: "journal.journalHeader.journalDetails[].instrumentBankName",
                        
                    },
                    {
                        key: "journal.journalHeader.journalDetails[].instrumentBranchName",
                        
                    },
                    
                    {
                        key: "journal.journalHeader.journalDetails[].instrumentNumber",
                        
                    },
                    {
                        key: "journal.journalHeader.journalDetails[].instrumentDate",
                       
                    },
                    {
                        key: "journal.journalHeader.journalDetails[].instrumentType",
                            
                    },
                    {
                        key: "journal.journalHeader.journalDetails[].relatedAccountNo",
                        
                    },
                    {
                        key: "journal.journalHeader.journalDetails[].remarks",
                        
                    },
                    {
                        key: "journal.journalHeader.journalDetails[].transactionAmount",
                        
                    },
                    {
                        key: "journal.journalHeader.journalDetails[].transactionDescription",
                        
                    },
                    ]
            }]
            },{
                "type": "box",
                "title": "Journal Transaction Details",
                "readonly": true,
                "items":[
                
                {
                    key:"journal.journalHeader.transactionBranchId",
                    
                },{
                    key:"journal.journalHeader.transactionDate",
                    
                },{
                    key:"journal.journalHeader.transactionId",
                    
                },{
                    key:"journal.journalHeader.valueDate",
                    
                }, ]
            }, {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "APPROVE"
                    }]
                },
            ],
            schema: function(){
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
                    model.journal.journalProcessAction = "PROCEED",
                    PageHelper.showLoader();
                    PageHelper.showProgress("Journal Updating", "Working...");
                    Journal.updateJournaMultilEntry(model.journal)
                    .$promise
                    .then(function(res) {
                        PageHelper.showProgress("Journal Update", "Journal Updated with id", 3000);
                            $log.info(res);
                            model.journal = res;
                            $state.go('Page.JournalMultiPostingDashboard', null);
                        }, function(httpRes) {
                            PageHelper.showProgress("Journal Update", "Oops. Some error occured.", 3000);
                            PageHelper.showErrors(httpRes);
                        }).finally(function() {
                            PageHelper.hideLoader();
                        })
                }
            }
        }
    }
})