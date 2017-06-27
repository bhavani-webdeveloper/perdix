define({
    pageUID: "Journal.JournalMaintenance",
    pageType: "Engine",
    dependencies: ["$log", "$state","User", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, $state,User, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "JOURNAL_MAINTENANCE",
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
                return [
                    item.journal.transactionName
                ]
            },

            form: [{
                    "type": "box",
                    "title": "JOURNAL_MAINTENANCE",
                    "items": [{
                        key: "journal.id",
                        "condition": "model.journal.id",
                        readonly: true,
                        type: "number",
                        "title": "JOURNAL_ID"
                    }, {
                        key: "journal.creditGLNo",
                        type: "string",
                        "title": "CREDIT_GL_NO"
                    }, {
                        key: "journal.debitGLNo",
                        type: "string",
                        "title": "DEBIT_GL_NO"
                    }, {
                        key: "journal.transactionName",
                        type: "string",
                        "title": "TRANSACTION_NAME"
                    }, {
                        key: "journal.transactionDescription",
                        type: "textarea",
                        "title": "TRANSACTION_DESCRIPTION"
                    }, {
                        key: "journal.journalBranches",
                        type: "array",
                        view: "fixed",
                        title: "Branches",
                        items: [{
                            key: "journal.journalBranches[].branchName",
                            title: "BRANCH_NAME",
                            // condition: "model.journal.userBranches == active",
                            type: "lov",
                            //enumCode: "branch_id",
                            required: true,
                            searchHelper: formHelper,
                            search: function(inputModel, form, model) {
                                var out = [];
                                var branches = formHelper.enum('branch_id').data;
                                $log.info(branches);
                                if (branches && branches.length) {
                                        for (var j = 0; j < branches.length; j++) {
                                                out.push({
                                                    name: branches[j].name,
                                                    id: branches[j].value
                                                })
                                        }
                                }
                                return $q.resolve({
                                    headers: {
                                        "x-total-count": out.length
                                    },
                                    body: out
                                });
                                /*var promise = User.query({
                                    'branchName': model.journal.journalBranches[].branchId
                                }).$promise;
                                return promise;*/
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.name
                                ];
                            },
                            onSelect: function(valueObj, model, context) {
                                model.journal.journalBranches[context.arrayIndex].branchId=valueObj.id;
                                model.journal.journalBranches[context.arrayIndex].branchName=valueObj.name;
                            }
                        }]
                    }]
                }, {
                    "type": "actionbox",
                    "condition": "!model.journal.id",
                    "items": [{
                        "type": "submit",
                        "title": "CREATE_JOURNAL"
                    }, {
                        "type": "save",
                        "title": "SAVE_OFFLINE"
                    }]
                },

                {
                    "type": "actionbox",
                    "condition": "model.journal.id",
                    "items": [{
                        "type": "save",
                        "title": "SAVE_OFFLINE"
                    }, {
                        "type": "button",
                        "title": "UPDATE_JOURNAL",
                        onClick: function(model, formCtrl) {
                            $log.info("Inside submit()");
                            PageHelper.showLoader();
                            PageHelper.showProgress("Journal Save", "Working...");
                            if (model.journal.id) {
                                Journal.updateJournal(model.journal)
                                    .$promise
                                    .then(function(res) {
                                        PageHelper.showProgress("Journal Save", "Journal Updated with id" + '  ' + res.id, 3000);
                                        $log.info(res);
                                        model.journal = res;
                                        $state.go('Page.JournalMaintenanceDashboard', null);
                                    }, function(httpRes) {
                                        PageHelper.showProgress("Journal Save", "Oops. Some error occured.", 3000);
                                        PageHelper.showErrors(httpRes);
                                    }).finally(function() {
                                        PageHelper.hideLoader();
                                    })
                            }
                        }
                    }]
                }
            ],

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
                            },
                            "journalBranches": {
                                "type": "array",
                                "title": "USER_BRANCHES",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "branchId": {
                                            "type": ["string", "null"],
                                            "title": "BRANCH_ID"
                                        },
                                        "transactionId": {
                                            "type": ["number", "null"],
                                            "title": "TRANSACTION_ID"
                                        },
                                        "id": {
                                            "type": ["number", "null"],
                                            "title": "ID"
                                        }
                                    }
                                }
                            },
                        }
                    }
                }
            },

            actions: {
                preSave: function(model, form, formName) {
                    var deferred = $q.defer();
                    if (model.journal.transactionName) {
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
                    if (model.journal.id) {
                        Journal.updateJournal(model.journal)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("Journal Save", "Journal Updated with id" + '  ' + res.id, 3000);
                                $log.info(res);
                                model.journal = res;
                                $state.go('Page.JournalMaintenanceDashboard', null);
                            }, function(httpRes) {
                                PageHelper.showProgress("Journal Save", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            }).finally(function() {
                                PageHelper.hideLoader();
                            })
                    } else {
                        Journal.createJournal(model.journal)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("Journal Save", "Journal Created with id" + '  ' + res.id, 3000);
                                $log.info(res);
                                model.journal = res;
                                $state.go('Page.JournalMaintenanceDashboard', null);
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