define({
    pageUID: "loans.individual.collections.CollectionRemainder",
    pageType: "Engine",
    dependencies: ["$log", "Journal", "LoanCollection", "$state", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"],

    $pageFn: function($log, Journal, LoanCollection, $state, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "COLLECTION_REMAINDER",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.collection = model.collection || {};
                model.collection.noOfDays = SessionStore.getGlobalSetting("CollectionRemainderBufferDays");

                $log.info("Collection Remainder Page got initialized");
            },
            offline: false,
            getOfflineDisplayItem: function(item, index) {},
            form: [{
                "type": "box",
                "title": "COLLECTION_REMAINDER",
                "items": [{
                    "key": "collection.fromDate",
                    "title": "FROM_DATE",
                    "type": "date"
                }]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "SUBMIT",
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

                    $log.info("Inside submit()");
                    console.warn(model);
                    var reqData = {
                        'fromDate': model.collection.fromDate,
                        'noOfDays': model.collection.noOfDays
                    }
                    LoanCollection.collectionRemainder(reqData).$promise.then(function(response) {
                        $log.info(response);
                        PageHelper.showProgress('Collection-Remainder', 'Success', 3000);

                    }, function(err) {
                        $log.info(err);
                    });
                },
                proceed: function(model, formCtrl, form, $event) {}
            }
        };
    }
})