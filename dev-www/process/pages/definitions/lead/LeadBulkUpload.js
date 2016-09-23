irf.pageCollection.factory(irf.page("lead.LeadBulkUpload"), ["$log", "Enrollment", "SessionStore", "$state", "$stateParams", "lead", function($log, Enrollment, SessionStore, $state, $stateParams, lead) {

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "LEAD_BULK_UPLOAD",
        "subTitle": "",
        initialize: function(model, form, formCtrl) {
            $log.info("LeadBulkUpload  Page got initialized");
        },
        offline: false,
        getOfflineDisplayItem: function(item, index) {},
        form: [{
            "type": "box",
            "title": "LEAD_BULK_UPLOAD",
            "colClass": "col-sm-6",
            "items": [{
                "key": "lead.Bulkfile",
                "notitle": true,
                "title": "UPLOAD_THE_FILE",
                "category": "ACH",
                "subCategory": "cat2",
                "type": "file",
                "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                customHandle: function(file, progress, modelValue, form, model) {
                    ACH.achMandateUpload(file, progress);
                }
            }, {
                "type": "button",
                "icon": "fa fa-user-plus",
                "title": "UPLOAD",
                "onClick": "actions.proceed(model, formCtrl, form, $event)"
            }]
        }],
        schema: function() {
            return lead.getLeadSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName) {

            },
            proceed: function(model, formCtrl, form, $event) {}
        }
    };
}]);