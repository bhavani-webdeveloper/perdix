define({
    pageUID: "loans.individual.collections.CollectionRemainder",
    pageType: "Engine",
    dependencies: ["$log", "Journal", "LoanCollection", "$state", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"],

    $pageFn: function($log, Journal, LoanCollection, $state, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "Collection Reminder",
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
                "title": "Collection Reminder",
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
                    "collection": {
                        "type": "object",
                        "properties": {
                        }
                    }
                }
            },

            actions: {
                submit: function(model, form, formName) {

                    $log.info("Inside submit()");
                    console.warn(model);
                    var fromDate = moment(model.collection.fromDate).format("DD-MM-YYYY");
                    var reqData = {
                        'fromDate': fromDate,
                        'noOfDays': model.collection.noOfDays
                    }
                    PageHelper.showProgress('Collection-Remainder', 'Repayment Remainder Processing');
                    PageHelper.showLoader();
                    LoanCollection.collectionRemainder(reqData).$promise.then(function(response) {
                        $log.info(response);
                        PageHelper.showProgress('Collection-Remainder', 'Successfully processed', 3000);
                        PageHelper.hideLoader();
                    }, function(err) {
                        $log.info(err);
                        PageHelper.showProgress('Collection-Remainder', 'Error in Processing Request' +""+ err, 3000);
                        PageHelper.hideLoader();
                    });
                },
                proceed: function(model, formCtrl, form, $event) {}
            }
        };
    }
})