irf.pageCollection.factory(irf.page("management.MasterDataMaintenance"), ["$log", "SessionStore", 'Utils', 'ACH', 'Maintenance', 'Files', 'AuthTokenHelper', 'PageHelper', 'formHelper', '$filter', '$q',
    function($log, SessionStore, Utils, ACH, Maintenance, Files, AuthTokenHelper, PageHelper, formHelper, $filter, $q) {
        var branchIDArray = [];
        return {
            "type": "schema-form",
            "title": "MASTER_DATA_MAINTENANCE",
            //"subTitle": Utils.getCurrentDate(),

            initialize: function(model, form, formCtrl) {
                model.authToken = AuthTokenHelper.getAuthData().access_token;
                model.userLogin = SessionStore.getLoginname();
                model.master = model.master || {};
                model.uploadres = model.uploadres || {};

                var promise = Maintenance.getMasterData().$promise;
                promise.then(function(res) {
                    $log.info("hi printing");
                    $log.info(res);
                })

                model.master.demandDate = model.master.demandDate || Utils.getCurrentDate();
                //model.achDemand.updateDemand = model.achDemand.updateDemand || [];
                for (var i = 0; i < formHelper.enum('branch_id').data.length; i++) {
                    branchIDArray.push(parseInt(formHelper.enum('branch_id').data[i].code));
                }

            },
            form: [{
                "type": "box",
                "title": "MASTER_DATA_TEMPLATE_DOWNLOAD",
                "items": [{
                    "type": "fieldset",
                    "title": "DOWNLOAD_MASTER_DATA_TEMPLATE",
                    "items": [{
                            "key": "master.uploadName",
                            "title": "NAME",
                            "type": "lov",
                            autolov: true,
                            bindMap: {},
                            searchHelper: formHelper,
                            search: function(inputModel, form, model) {
                                return Maintenance.getMasterData().$promise;
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.group,
                                    item.name,
                                    item.value,
                                    item.template_file
                                ];
                            },
                            onSelect: function(result, model, context) {
                                $log.info(result);
                                model.master.templateFile = result.template_file;
                                model.master.uploadName = result.name;
                                model.master.uploadNameValue = result.value;
                            }
                        },
                        /*{
                                                "key": "master.templateFile",
                                                "title": "TEMPLATE_URL",
                                                "type": "string"
                                            },*/
                        {
                            "type": "button",
                            "title": "DOWNLOAD",
                            "icon": "fa fa-download",
                            "notitle": true,
                            "readonly": false,

                            "onClick": function(model, form, schemaForm, event) {
                                var fileId = irf.BI_BASE_URL + "/upload_template/" + model.master.templateFile;
                                Utils.downloadFile(fileId);
                                //Utils.downloadFile(irf.MANAGEMENT_BASE_URL + "/forms/AllFormsDownload.php?record_id=" + model.loanAccount.id);
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
                    "items": [{
                        "key": "master.achDemandListFileId",
                        "notitle": true,
                        "type": "file",
                        "category": "ACH",
                        "subCategory": "cat2",
                        "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        customHandle: function(file, progress, modelValue, form, model) {
                            Maintenance.masterDataUpload(file, progress, {
                                fileType: model.master.uploadNameValue
                            }).then(function(resp) {
                                $log.info(resp.data.stats);                               
                                    model.master.value = true;                                
                                model.uploadres = resp.data.stats;
                            });
                        }
                    }]
                }]
            }, {
                "type": "box",
                "title": "UPLOAD_RESPONSE",
                "condition": "model.master.value",
                "items": [{
                    "type": "section",
                    "htmlClass": "col-sm-12 col-xs-12",
                    "title": "UPLOAD_RESPONSE",
                    "items": [{
                        "key": "uploadres.New Bank Branches Created (based on IFSC)",
                        "title": "New Bank Branches inserted"

                    }, {
                        "key": "uploadres.New Banks Created",
                        "title": "New Bank inserted"

                    }, {
                        "key": "uploadres.Skipped Bank Branches",
                        "title": "Skipped Bank inserted"

                    }, {
                        "key": "uploadres.Skipped IFSC List",
                        "title": "Skipped IFSC List"

                    }, {
                        "key": "uploadres.total_rows_processed",
                        "title": "Total Rows Processed"

                    }]
                }]
            }, ],
            schema: function() {
                return ACH.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {}
            }
        };
    }
]);