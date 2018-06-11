
define({
    pageUID: "excelUpload.ExcelUpload",
    pageType: "Engine",
    dependencies: ["$log", "SessionStore", "$state", "$stateParams", "DocumentTracking"],

    $pageFn: function($log, SessionStore, $state, $stateParams, DocumentTracking) {

        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "DOCUMENT_TRACKING_BULK_UPLOAD",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("DocumentTrackingBulkUpload  Page got initialized");
            },
            offline: false,
            getOfflineDisplayItem: function(item, index) {},
            form: [{
                "type": "box",
                "title": "BULK_UPLOAD",
                "colClass": "col-sm-6",
                "items": [{
                    "key": "DocumentTracking.BulkFiling",
                    "notitle": true,
                    "title": "BULK_UPLOAD",
                    "category": "ACH",
                    "subCategory": "cat2",
                    "type": "file",
                    "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    customHandle: function(file, progress, modelValue, form, model) {
                        DocumentTracking.BulkFileUpload(file, progress).then(function(resp){
                            $state.go('Page.DocumentTrackingDashboard', null);
                        });
                    }
                }]
            }],
            schema: function() {
                return DocumentTracking.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {

                },
                proceed: function(model, formCtrl, form, $event) {}
            }
        };
    }
})
