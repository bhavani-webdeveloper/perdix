define({
    pageUID: "excelUpload.ExcelUpload",
    pageType: "Engine",
    dependencies: ["$log", "SessionStore", "$state", "$stateParams", "DocumentTracking", "ExcelUpload", "$timeout"],

    $pageFn: function($log, SessionStore, $state, $stateParams, DocumentTracking, ExcelUpload, $timeout) {

        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "GENERIC_EXCEL_UPLOAD",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.upload = model.upload || {};
                $log.info("DocumentTrackingBulkUpload  Page got initialized");
                var self = this;

                var formData = function() {
                    self.form = [{
                        "type": "box",
                        "title": "GENERIC_EXCEL_UPLOAD",
                        "colClass": "col-sm-6",
                        "items": [{
                            key: "upload.excel_type",
                            title: "EXCEL_TYPE",
                            type: "select",
                            enumCode: "excel_type",
                            "required": true
                        }, {
                            "key": "upload.upload",
                            "title": "EXCEL_UPLOAD",
                            "category": "ACH",
                            "subCategory": "cat2",
                            "type": "file",
                            "required": true,
                            "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            customHandle: function(file, progress, modelValue, form, model) {
                                ExcelUpload.ExcelFileUpload(file, progress, model.upload.excel_type).then(function(resp) {
                                    formData();
                                    // model.upload = {};
                                });
                            }
                        }]
                    }];
                }

                function formData() {
                    $timeout(function() {
                        self.form = [];
                    });
                };
            },

            offline: false,
            getOfflineDisplayItem: function(item, index) {},
            form: [],
            schema: {
                "type": "object",
                "properties": {
                    "upload": {
                        "type": "string"
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