irf.pageCollection.factory(irf.page("management.TaggingMaintenance"), ["$log", "SessionStore", 'Utils', 'ACH', 'Maintenance', 'Files', 'AuthTokenHelper', 'PageHelper', 'formHelper', '$filter', '$q',
    function($log, SessionStore, Utils, ACH, Maintenance, Files, AuthTokenHelper, PageHelper, formHelper, $filter, $q) {
        var branchIDArray = [];
        return {
            "type": "schema-form",
            "title": "TAGGING MAINTENANCE",
            //"subTitle": Utils.getCurrentDate(),

            initialize: function(model, form, formCtrl) {
                model.authToken = AuthTokenHelper.getAuthData().access_token;
                model.userLogin = SessionStore.getLoginname();
                model.master = model.master || {};
                model.uploadres = model.uploadres || {};
            },
            form: [{
                    "type": "box",
                    "title": "TAGGING MAINTENANCE",
                    "items": [{
                                
                                key:"master.uploadName",
                                type:"select",
                                required: true,
                                title: "Tagging Type",
                                "enumCode": "taggingType"
                            },{
                        "type": "fieldset",
                        "title": "DOWNLOAD_MASTER_DATA_TEMPLATE",
                        "items": [
                            {
                                "type": "button",
                                "title": "Download Template",
                                "icon": "fa fa-download",
                                "condition": "model.master.uploadName",
                                "notitle": true,
                                "readonly": false,

                                "onClick": function(model, form, schemaForm, event) {
                                    
                                   var fileId = "";
                                   if(model.master.uploadName == "PAR"){
                                     fileId = irf.MANAGEMENT_BASE_URL + '/server-ext/template/'+ "PAR_ddmmyyyy.xlsx";
                                     model.master.uploadNameValue = "PAR";
                                   }
                                   if(model.master.uploadName == "SECURITIZATION"){
                                     fileId = irf.MANAGEMENT_BASE_URL + '/server-ext/template/'+ "scuritisation_tagging.xlsx";
                                     model.master.uploadNameValue = "SECURITIZATION";
                                   }
                                   Utils.downloadFile(fileId);
                                },
                            }
                        ]
                    }]
                }, {
                    "type": "box",
                    "title": "UPLOAD_MASTER_DATA",
                    "items": [{
                        "type": "fieldset",
                        "title": "UPLOAD_STATUS",
                        "condition": "model.master.uploadName",
                        "items": [{
                            "key": "master.achDemandListFileId",
                            "notitle": true,
                            "type": "file",
                            "category": "ACH",
                            "subCategory": "cat2",
                            "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            customHandle: function(file, progress, modelValue, form, model) {
                                Maintenance.taggingMasterDataUpload(file, progress, {
                                    fileType: model.master.uploadName
                                }).then(function(resp) {
                                    $log.info(resp.data.stats);
                                    model.master.value = true;
                                    model.uploadres = resp.data.stats;
                                    model.master.achDemandListFileId = undefined;
                                });
                            }
                        }]
                    }]
                }, {
                    type: "box",
                    colClass: "col-sm-12",
                    condition: "model.master.value",
                    title: "UPLOAD_RESPONSE",
                    items: [{
                        type: "section",
                        htmlClass: "row",
                        items: [{
                            type: "section",
                            htmlClass: "col-sm-12 col-xs-12 col-md-12",
                            html: '<div  ng-repeat="(key, value) in model.uploadres" class="col-sm-12 col-xs-12 col-md-12">' +
                                "<label class = 'col-sm-3 col-xs-3 col-md-3' style = 'width: 30%;float: left;'>{{key}}</label><div style = 'font-weight: bold;width: 70%;'  class = 'col-sm-9 col-xs-9 col-md-9'>{{value}}</div></div>"
                        }]
                    }]
                }
            ],
            schema: function() {
                return ACH.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {}
            }
        };
    }
]);