
irf.pageCollection.factory(irf.page("management.MasterDataMaintenance"), 
    ["$log", "SessionStore", 'Utils', 'ACH', 'AuthTokenHelper', 'PageHelper', 'formHelper', '$filter', '$q',
    function($log, SessionStore, Utils, ACH, AuthTokenHelper, PageHelper, formHelper, $filter, $q) {
        var branchIDArray = [];
        return {
            "type": "schema-form",
            "title": "MASTER_DATA_MAINTENANCE",
            //"subTitle": Utils.getCurrentDate(),

            initialize: function(model, form, formCtrl) {
                model.authToken = AuthTokenHelper.getAuthData().access_token;
                model.userLogin = SessionStore.getLoginname();
                model.master = model.master|| {};
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
                        "key": "master.name",
                        "title": "NAME",
                        "type": "select"
                    },{
                        "key": "master.url",
                        "title": "TEMPLATE_URL",
                        "type": "string"
                    }, {
                        "title": "DOWNLOAD",
                        "htmlClass": "btn-block",
                        "icon": "fa fa-download",
                        "type": "button",
                        "notitle": true,
                        "readonly": false,
                        "onClick": function(model, formCtrl, form, $event) {
                            if (!model.demandlist.demandDate) {
                                PageHelper.setError({
                                    'message': 'Installment Date is mandatory.'
                                });
                                return false;
                            }
                            PageHelper.clearErrors();
                            PageHelper.showLoader();
                            ACH.demandDownloadStatus({
                                "demandDate": model.achCollections.demandDate,
                                "branchId": branchIDArray.join(",")
                            }).$promise.then(
                                function(response) {
                                    window.open(irf.BI_BASE_URL + "/download.php?user_id=" + model.userLogin + "&auth_token=" + model.authToken + "&report_name=ach_demands&date=" + model.achCollections.demandDate);
                                    PageHelper.showProgress("page-init", "Success", 5000);
                                },
                                function(error) {
                                    PageHelper.showProgress("page-init", error, 5000);
                                }).finally(function() {
                                PageHelper.hideLoader();
                            });
                        }
                    }]
                }]
            }, {
                "type": "box",
                "title": "UPLOAD_MASTER_DATA",
                "items": [{
                    "type": "fieldset",
                    "title": "UPLOAD_STATUS",
                    "items": [
                         {
                               key: "ach.customerId",
                               title: "CUSTOMER_ID",
                            },
                    {
                            "key": "ach.achDemandListFileId",
                            "notitle": true,
                            "type": "file",
                            "category": "ACH",
                            "subCategory": "cat2",
                            "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            customHandle: function(file, progress, modelValue, form, model) {
                                ACH.monthlyDemandUpload(file, progress,{customerId:model.ach.customerId});
                            }
                        }
                    ]
                }]
            }],
            schema: function() {
                return ACH.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {}
            }
        };
    }
]);