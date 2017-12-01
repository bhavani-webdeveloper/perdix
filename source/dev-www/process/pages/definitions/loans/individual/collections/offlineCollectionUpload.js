irf.pageCollection.factory(irf.page("loans.individual.collections.offlineCollectionUpload"), ["$log", "SessionStore", 'Utils', 'PageHelper', 'formHelper', '$filter', '$q', 'LoanProcess',
    function($log, SessionStore, Utils, PageHelper, formHelper, $filter, $q, LoanProcess) {

        return {
            "type": "schema-form",
            "title": "OFFLINE_COLLECTION_EXCEL_UPLOAD",
            "subTitle": Utils.getCurrentDate(),

            initialize: function(model, form, formCtrl) {
                model.collection = model.collection || {};
            },
            form: [{
                "type": "box",
                "title": "OFFLINE_COLLECTION_EXCEL_UPLOAD",
                "items": [{
                    "type": "fieldset",
                    "title": "DOWNLOAD_OFFLINE_COLLECTION_UPLOAD_TEMPLATE",
                    "items": [{
                        "title": "DOWNLOAD",
                        "htmlClass": "btn-block",
                        "icon": "fa fa-download",
                        "type": "button",
                        "notitle": true,
                        "readonly": false,
                        "onClick": function(model, formCtrl, form, $event) {
                            var fileId = irf.MANAGEMENT_BASE_URL + '/server-ext/template/'+ "offLineCollectionDemandUpload.xlsx";

                            Utils.downloadFile(fileId);
                        }
                    }]
                }]
            }, {
                "type": "box",
                "title": "UPLOAD_OFFLINE_COLLECTION_EXCEL",
                "items": [{
                    "type": "fieldset",
                    "title": "UPLOAD_STATUS",
                    "items": [{
                            "key": "collection.collectionDemandFileId",
                            "notitle": true,
                            "type": "file",
                            "category": "ACH",
                            "subCategory": "cat2",
                            "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            customHandle: function(file, progress, modelValue, form, model) {
                                PageHelper.showBlockingLoader("Processing...");
                                LoanProcess.collectiondemandOfflineUpload(file, progress)
                                    .then(
                                        function(response){
                                            PageHelper.showProgress("collection-upload", "Upload success!", 5000);
                                        }, function(httpResponse){
                                            PageHelper.showProgress("Collection-upload", "Upload Failed!", 5000);
                                        }
                                    )
                                    .finally(function(){
                                        PageHelper.hideBlockingLoader();
                                    });
                            }
                        }
                    ]
                }]
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "collection": {
                        "type": "object",
                        "required": [],
                        "properties": {
                            "collectionDemandFileId": {
                                "title": "FILE",
                                "type": ["Object", "null"]
                            }
                        }
                    }
                }
            },
            actions: {
                submit: function(model, form, formName) {}
            }
        };
    }
]);