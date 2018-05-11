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
            "title": "BRANCH_POSTING_JOURNAL_MAINTENANCE",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                var branches = formHelper.enum('branch_id').data;
                model.journal = model.journal || {};
                $log.info("Inside submit()");
                var journalId = $stateParams.pageId;
                model.journal.journalBranches = [];
                if(!journalId) {
                    var branches = formHelper.enum('branch_id').data;
                    if (branches && branches.length) {
                            for (var j = 0; j < branches.length; j++) {
                                model.journal.journalBranches.push({
                                        name: branches[j].name,
                                        id: branches[j].value
                                    })
                            }
                    }
                }

                if (!(model && model.journal && model.journal.id && model.$$STORAGE_KEY$$)) {
                    PageHelper.showLoader();
                    PageHelper.showProgress("page-init", "Loading...");

                    if (!journalId) {
                        PageHelper.hideLoader();
                    }
                    Journal.get({
                            id: journalId
                        },
                        function(res) {
                            _.assign(model.journal, res);


                            var journalBranches = [];

                            model.journal.journalBranches.map(function(j) {
                                var index = _.findIndex(branches, function(b) {
                                    return b.value == j.branchId;
                                })
                                journalBranches.push({id:j.branchId, name: branches[index].name, transactionId: j.transactionId, $selected: true});
                            });

                            branches.map(function(b) {
                                var index = _.findIndex(journalBranches, function(j) {
                                    return j.id == b.value;
                                });
                                if(index < 0) {
                                    journalBranches.push({name: b.name});
                                }

                            })



                            model.journal.journalBranches = journalBranches;

                            $log.info(model.journal);
                            PageHelper.hideLoader();
                        }
                    );
                    $log.info("Journal page  is initiated ");
                    PageHelper.showProgress("Journal loading", "Page Loaded!", 3000);
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
                    "colClass":"col-sm-6",
                    "title": "BRANCH_POSTING_JOURNAL_MAINTENANCE",
                    "items": [{
                        key: "journal.id",
                        "condition": "model.journal.id",
                        readonly: true,
                        type: "number",
                        "title": "JOURNAL_ID"
                    },
                    {
                        key: "journal.transactionName",
                        type: "string",
                        "title": "TRANSACTION_NAME",
                        required: true
                    },
                    {
                        key: "journal.transactionDescription",
                        type: "textarea",
                        required: true,
                        "title": "TRANSACTION_DESCRIPTION"
                    },
                    {
                        key: "journal.transactionType",
                        type: "select",
                        required: true,
                        "title": "TRANSACTION_TYPE",
                        //"enumCode": 'journal_transaction_type'
                        titleMap: {
                            "Entry": "Entry"
                        }
                    },
                    {
                        key: "journal.productType",
                        type: "select",
                        required: true,
                        "title": "PRODUCT_TYPE",
                        "enumCode": 'journal_transaction_type'

                    },
                    {
                        key: "journal.debitGLNo",
                        "type": "lov",
                        lovonly: true,
                        required: true,
                        title: "DEBIT_GL_NO",
                        "inputMap": {
                            "productCode": {
                                "key": "journal.productCode",
                                "title": "PRODUCT_CODE",
                                "type": "string"
                            },
                            "glName": {
                                "key": "journal.glName",
                                "title": "GL_NAME",
                                "type": "string"
                            },
                            "category": {
                                "key": "journal.category",
                                "title": "CATEGORY",
                                "type": "select",
                                "enumCode":"gl_category"
                            }
                        },
                        "outputMap": {
                            "glName": "journal.glName",
                        },
                        "searchHelper": formHelper,
                        "search": function(inputModel, form,model) {
                            var ret = [];
                            var defered = $q.defer();
                            Journal.listAccountCode({
                                'productCode': inputModel.productCode,
                                'glName': inputModel.glName,
                                'category': inputModel.category,
                                'glType': 'LEDGER'
                            }).$promise.then(function(response){
                                defered.resolve(response);
                            });
                            return defered.promise;
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                data.category,
                                data.productCode,
                                data.glType
                            ];
                        },
                        onSelect: function(valueObj, model, context) {
                            model.journal.debitGLNo=valueObj.productCode;
                        }
                    }, {
                        key: "journal.creditGLNo",
                        "type": "lov",
                        lovonly: true,
                        required: true,
                        title: "CREDIT_GL_NO",
                        "inputMap": {
                            "productCode": {
                                "key": "journal.productCode",
                                "title": "PRODUCT_CODE",
                                "type": "string"
                            },
                            "glName": {
                                "key": "journal.glName",
                                "title": "GL_NAME",
                                "type": "string"
                            },
                            "category": {
                                "key": "journal.category",
                                "title": "CATEGORY",
                                "type": "select",
                                "enumCode":"gl_category"
                            }
                        },
                        "outputMap": {
                            "glName": "journal.glName",
                        },
                        "searchHelper": formHelper,
                        "search": function(inputModel, form,model) {
                            console.log(model.journal)
                            var ret = [];
                            var defered = $q.defer();
                            Journal.listAccountCode({
                                'productCode': inputModel.productCode,
                                'glName': inputModel.glName,
                                'category': inputModel.category,
                                'glType': 'LEDGER'
                            }).$promise.then(function(response){
                                defered.resolve(response);
                            });
                            return defered.promise;
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                data.category,
                                data.productCode,
                                data.glType
                            ];
                        },
                        onSelect: function(valueObj, model, context) {
                            model.journal.creditGLNo=valueObj.productCode;
                        }
                    },{
                        key: "journal.journalBranches",
                        type: "tableview",
                        listStyle: 'table',
                        paginate: true,
                        title: "Branches",
                        selectable: true,
                        editable: false,
                        getColumns: function() {
                            return [{
                                title: 'name',
                                data: 'name'
                            }]
                        }
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
                            var branches = formHelper.enum('branch_id').data;
                            var journalbranch = [];
                            _.map(model.journal.journalBranches, function(j) {
                                if(j.$selected == true && !j.id) {
                                    var index = _.findIndex(branches, function(b) {
                                        return b.name == j.name;
                                    })
                                if (index > -1) {
                                        journalbranch.push({branchId: branches[index].value});
                                    }
                                } else if (j.$selected && j.id) {
                                    var index = _.findIndex(branches, function(b) {
                                        return b.name == j.name;
                                    })
                                if (index > -1) {
                                        journalbranch.push({branchId: branches[index].value});
                                    }
                                }
                            });

                            model.journal.journalBranches = journalbranch;

                            if (model.journal.id) {
                                Journal.updateJournal(model.journal)
                                    .$promise
                                    .then(function(res) {
                                        PageHelper.showProgress("Journal Save", "Journal Updated with id" + '  ' + res.id, 3000);
                                        $log.info(res);
                                        // Add navigation
                                        irfNavigator.goBack();
                                        // $state.go('Page.JournalMaintenanceDashboard', null);
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
                            "transactionName": {
                                "title": "BATCH_NAME",
                                "type": "string"
                            },
                            "batchNumber": {
                                "title": "BATCH_NAME",
                                "type": "string"
                            },
                            "transactionName": {
                                "title": "BATCH_NAME",
                                "type": "string"
                            },
                            "transactionType": {
                                "title": "BATCH_NAME",
                                "type": "string"
                            },
                            "productType": {
                                "title": "PRODUCY_TYPE",
                                "type": "string"
                            },
                            "debitGLNo": {
                                "title": "BATCH_NAME",
                                "type": "string"
                            },
                            "creditGLNo": {
                                "title": "BATCH_NAME",
                                "type": "string"
                            },
                            "productCode": {
                                "title": "BATCH_NAME",
                                "type": "string"
                            },
                            "glName": {
                                "title": "BATCH_NAME",
                                "type": "string"
                            },
                            "category": {
                                "title": "BATCH_NAME",
                                "type": "string"
                            }
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
                    // PageHelper.showLoader();
                    var branches = [];
                    model.journal.journalBranches.map(function(item) {
                        if(_.hasIn(item, '$selected') && item.$selected) {
                            branches.push({'branchId': item.id});
                        }
                    })
                    model.journal.journalBranches = branches;
                    // var branches = model.journal.journalBranches.filter(function(item) {
                    //     return _.hasIn(item, '$selected') && item.$selected;
                    // })
                    model.journal.journalBranches = branches;
                    PageHelper.showProgress("Journal Save", "Working...");
                    if (model.journal.id) {
                        // Journal.updateJournal(model.journal)
                        //     .$promise
                        //     .then(function(res) {
                        //         PageHelper.showProgress("Journal Save", "Journal Updated with id" + '  ' + res.id, 3000);
                        //         $log.info(res);
                        //         model.journal = res;
                        //         $state.go('Page.JournalMaintenanceDashboard', null);
                        //     }, function(httpRes) {
                        //         PageHelper.showProgress("Journal Save", "Oops. Some error occured.", 3000);
                        //         PageHelper.showErrors(httpRes);
                        //     }).finally(function() {
                        //         PageHelper.hideLoader();
                        //     })
                    } else {

                        Journal.createJournal(model.journal)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("Journal Save", "Journal Created with id" + '  ' + res.id, 3000);
                                $log.info(res);
                                irfNavigator.goBack();
                                // 'Add navigation'
                                // $state.go('Page.JournalMaintenanceDashboard', null);
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
