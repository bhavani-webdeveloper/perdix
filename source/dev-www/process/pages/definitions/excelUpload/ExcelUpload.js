define({
    pageUID: "excelUpload.ExcelUpload",
    pageType: "Engine",
    dependencies: ["$log", "SessionStore", "$state", "$stateParams", "DocumentTracking", "ExcelUpload", "PageHelper"],
 
    $pageFn: function($log, SessionStore, $state, $stateParams, DocumentTracking, ExcelUpload, PageHelper) {
 
        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "GENERIC_EXCEL_UPLOAD",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.upload = model.upload || {};
                $log.info("DocumentTrackingBulkUpload  Page got initialized");
                ExcelUpload.getExcelUploadJson().$promise.then(function(json) {
                    model.excelJson = json;
                }, function(e) {
                    PageHelper.setError({message: "Failed to load upload definition"});
                });
            },
            offline: false,
            getOfflineDisplayItem: function(item, index) {},
            form: [{
                "type": "box",
                "title": "GENERIC_EXCEL_UPLOAD",
                "colClass": "col-sm-6",
                "items": [{
                    key: "upload.excel_type",
                    title: "EXCEL_TYPE",
                    type: "select",
                    enumCode: "excel_type",
                    "required": true,
                    onChange:function(model) {
                        model.excelJson[model.upload.excel_type].enableTruncate;
                    }
                }, {
                    "key": "upload.isTruncate",
                    "title": "DELETE_REUPLOAD",
                    "type": "checkbox",
                    "condition": "model.excelJson[model.upload.excel_type].enableTruncate",
                    "schema": {
                        "default": false
                    }
                }, {
                    "key": "upload.upload",
                    "title": "EXCEL_UPLOAD",
                    "category": "ACH",
                    "subCategory": "cat2",
                    "type": "file",
                    "required": true,
                    "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    customHandle: function(file, progress, modelValue, form, model) {
                        ExcelUpload.ExcelFileUpload(file, progress, model.upload.excel_type, model.upload.isTruncate).then(function(resp) {
                            model.upload = {};
                        });
                    }
                }]
            }],
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