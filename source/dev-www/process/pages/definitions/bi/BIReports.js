irf.pageCollection.factory(irf.page("bi.BIReports"),
["$log", "BIReports", "SessionStore", "PageHelper", "$httpParamSerializer", "AuthTokenHelper",
    function($log, BIReports, SessionStore, PageHelper, $httpParamSerializer, AuthTokenHelper) {

        return {
            "type": "schema-form",
            "title": "REPORTS",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                var self = this;
                self.form = [];
                PageHelper.showLoader();
                BIReports.reportList().$promise.then(function(resp){
                    self.formSource[0].items[0].titleMap = resp;
                    self.form = self.formSource;
                }, function(errResp){
                    PageHelper.showErrors(errResp);
                }).finally(function(){
                    PageHelper.hideLoader();
                });
            },
            form: [],
            formSource: [
                {
                    "type": "box",
                    "title": "CHOOSE_A_REPORT",
                    "items": [
                        {
                            "key": "bi.report_name",
                            "type": "select"
                        },
                        {
                            "key": "bi.from_date",
                            "type": "date"
                        },
                        {
                            "key": "bi.to_date",
                            "type": "date"
                        }
                    ]
                },
                {
                    type: "actionbox",
                    items: [{
                        type: "submit",
                        title: "DOWNLOAD_REPORT"
                    }]
                }
            ],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "bi": {
                        "type": "object",
                        "properties": {
                            "report_name": {
                                "type": "string",
                                "title": "REPORT_NAME"
                            },
                            "from_date": {
                                "type": "string",
                                "title": "FROM_DATE"
                            },
                            "to_date": {
                                "type": "string",
                                "title": "TO_DATE"
                            }
                        },
                        "required": [
                            "report_name",
                            "from_date",
                            "to_date"
                        ]
                    }
                }
            },
            actions: {
                submit: function(model, form, formName) {
                    var biDownloadUrl = irf.BI_BASE_URL + '/download.php?auth_token='+ AuthTokenHelper.getAuthData().access_token +'&' + $httpParamSerializer(model.bi);
                    $log.info(biDownloadUrl);
                    window.open(biDownloadUrl);
                }
            }
        };
    }
]);