define({
    pageUID: "MutualFund.MutualFundDownloadFeed",
    pageType: "Engine",
    dependencies: ["$log", "$q", 'PageHelper', 'formHelper', "Utils", 'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "irfNavigator", "MutualFund", "Files"],
    $pageFn: function($log, $q, PageHelper, formHelper, Utils, irfProgressMessage, SessionStore, $state, $stateParams, irfNavigator, MutualFund, Files) {

        return {
            "title": "FEED_DOWNLOAD",
            "subTitle": "",
            type: "schema-form",
            initialize: function(model, form, formCtrl) {
                var downloadParameters = {};
                var downloadResponse = {};
            },
            form: [{
                type: "box",
                title: "DOWNLOAD_PARAMETERS",
                items: [{
                        title: "TRANSACTION_TYPE",
                        key: "downloadParameters.transactionType",
                        "type": "select",
                        "titleMap": {
                            "PURCHASE": "PURCHASE",
                            "REDEMPTION": "REDEMPTION"
                        },
                        required: true
                    }, {
                        title: "DOWNLOAD_DATE_FROM",
                        key: "downloadParameters.dateFrom",
                        "type": "date",
                        required: true
                    }, {
                        title: "DOWNLOAD_DATE_TO",
                        key: "downloadParameters.dateTo",
                        "type": "date",
                        required: true
                    }, {
                        "type": "button",
                        "title": "DOWNLOAD",
                        "onClick": "actions.getDownloadDetails(model, formCtrl, form, $event)"
                    }
                ]
            }],
            schema: {
                "type": "object",
                "properties": {
                    "downloadParameters": {
                        "type": "object",
                        "properties": {
                            "transactionType": {
                                "type": ["string"],
                                "title": "TRANSACTION_TYPE"

                            },
                            "dateFrom": {
                                "type": "date",
                                "title": "DOWNLOAD_DATE_FROM",
                                "x-schema-form": {
                                    "type": "date"
                                }
                            },
                            "dateTo": {
                                "type": "date",
                                "title": "DOWNLOAD_DATE_TO",
                                "x-schema-form": {
                                    "type": "date"
                                }
                            }
                        }
                    }

                }

            },
            actions: {
                downloadFile: function(model) {
                    var self = this;
                    PageHelper.showLoader();
                    var reqData = _.cloneDeep(model.downloadResponse);                    
                    var fileId = reqData.fileId;
                    try {
                        Utils.downloadFile(Files.getFileDownloadURL(fileId));
                    } catch (err) {
                        irfProgressMessage.pop("download-get-file", "An error occured, failed to fetch file", 5000);
                        PageHelper.hideLoader();
                    } finally {
                        PageHelper.hideLoader();
                    }
                },
                getDownloadDetails: function(model, formCtrl, form, $event) {
                    var self = this;
                    var reqData = {};
                    PageHelper.showLoader();
                    reqData.dateFrom = model.downloadParameters.dateFrom + " 00:00:00";
                    reqData.dateTo = model.downloadParameters.dateTo+" 23:59:59";
                    reqData.transactionType = model.downloadParameters.transactionType;
                    try {
                        MutualFund.download(reqData).$promise.then(function(res) {
                            model.downloadResponse = res;
                            self.downloadFile(model);
                        }, function(err) {
                            irfProgressMessage.pop("download-get", "An error occured, failed to fetch data", 5000);
                            PageHelper.hideLoader();
                            irfNavigator.goBack();
                        });
                    } catch (err) {
                        irfProgressMessage.pop("error -get -downloadResponse", 5000);
                    } finally {
                        PageHelper.hideLoader();
                    }

                }
            }
        };
    }
})