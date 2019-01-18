irf.pageCollection.factory(irf.page("loans.individual.CustomerAndLoanUpload"), ["$log", "SessionStore", 'Utils', 'ACH', 'Maintenance', 'Files', 'AuthTokenHelper', 'PageHelper', 'formHelper', '$filter', '$q',
    function($log, SessionStore, Utils, ACH, Maintenance, Files, AuthTokenHelper, PageHelper, formHelper, $filter, $q) {
        var branchIDArray = [];
        return {
            "type": "schema-form",
            "title": "CUSTOMER AND LOAN UPLOAD",
            //"subTitle": Utils.getCurrentDate(),

            initialize: function(model, form, formCtrl) {
                model.authToken = AuthTokenHelper.getAuthData().access_token;
                model.userLogin = SessionStore.getLoginname();
                model.master = model.master || {};
                model.uploadres = model.uploadres || {};
            },
            form: [{
                    "type": "box",
                    "title": "CUSTOMER AND LOAN UPLOAD",
                    "items": [{
                                
                                key:"master.uploadName",
                                type:"select",
                                required: true,
                                title: "Upload Type",
                                titleMap: {
                                            "CUSTOMER": "CUSTOMER",
                                            "LOAN": "LOAN",
                                            "LOANCOLLECTION":"LOAN COLLECTION",
                                            "DISBURSEMENT":"DISBURSEMENT"
                                        }
                            },
                            {
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
                                        Maintenance.CustomerAndLoanDataUpload(file, progress, {
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
                    },{
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