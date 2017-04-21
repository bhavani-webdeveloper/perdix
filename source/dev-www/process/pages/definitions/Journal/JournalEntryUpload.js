define({
    pageUID: "Journal.JournalEntryUpload",
    pageType: "Engine",
    dependencies: ["$log", "Journal", "$state", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"],

    $pageFn: function($log, Journal, $state, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "JOURNAL_ENTRY_UPLOAD",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                 model.journal = model.journal || {};
                $log.info("Journal Upload  Page got initialized");
            },
            offline: false,
            getOfflineDisplayItem: function(item, index) {},
            form: [{
                "type": "box",
                "title": "JOURNAL_ENTRY_UPLOAD",
                "colClass": "col-sm-6",
                "items": [{
                    "key": "journal.Bulkfile",
                    "notitle": true,
                    "title": "JOURNAL_ENTRY_UPLOAD",
                    "category": "ACH",
                    "subCategory": "cat2",
                    "type": "file",
                    "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    customHandle: function(file, progress, modelValue, form, model) {
                        Journal.JournalEntryUpload(file, progress).then(function(resp){
                            //$state.go('Page.LeadDashboard', null);
                        });
                    }
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
                            "Bulkfile": {
                                "title": "JOURNAL_ENTRY_UPLOAD",
                                "type": "string"
                            }
                        }
                    }
                }
            },

            actions: {
                submit: function(model, form, formName) {

                },
                proceed: function(model, formCtrl, form, $event) {}
            }
        };
    }
})