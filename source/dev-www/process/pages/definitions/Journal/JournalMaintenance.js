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
                model.journal = model.journal || {};
                $log.info("Inside submit()");
                model.journal.journalBranches = [];
                var branches = formHelper.enum('branch_id').data;
                console.log(branches);
                if (branches && branches.length) {
                        for (var j = 0; j < branches.length; j++) {
                            model.journal.journalBranches.push({
                                    name: branches[j].name,
                                    id: branches[j].value
                                })
                        }
                }
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
                            var branches = formHelper.enum('branch_id').data;
                            if(model.journal.journalBranches && model.journal.journalBranches)
                            {
                                for(i=0;i<model.journal.journalBranches.length;i++){
                                    for(j=0;j<branches.length;j++){
                                        if(model.journal.journalBranches[i].branchId==branches[j].value){
                                           model.journal.journalBranches[i].branchName=branches[j].name;
                                        }
                                    }
                                }
                            }
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
                        "enumCode": 'journal_transaction_type',
                        titleMap: {
                            'Receipt':'Receipt'
                        }
                    },
                    {
                        key: "journal.debitGLNo",
                        "type": "lov",
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
                            if (model.journal.id) {
                                Journal.updateJournal(model.journal)
                                    .$promise
                                    .then(function(res) {
                                        PageHelper.showProgress("Journal Save", "Journal Updated with id" + '  ' + res.id, 3000);
                                        $log.info(res);
                                        // Add navigation
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
                            branches.push({'id': item.id, 'branchId': item.id});
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