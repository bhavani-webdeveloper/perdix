irf.pageCollection.factory(irf.page("bi.BIReports"), ["$log", "RolesPages", "BIReports", "SessionStore", "PageHelper", "$httpParamSerializer", "AuthTokenHelper",
    function($log, RolesPages, BIReports, SessionStore, PageHelper, $httpParamSerializer, AuthTokenHelper) {

        return {
            "type": "schema-form",
            "title": "REPORTS",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.report = {};
                model.report.role = SessionStore.getUserRole();
                $log.info(model.report.role.id);

                var self = this;
                self.form = [];
                PageHelper.showLoader();
                BIReports.reportList().$promise.then(function(resp) {
                    RolesPages.getReportsByRole({
                        roleId: model.report.role.id
                    }).$promise.then(function(response) {
                        var object=[];
                        for (i in resp) {
                            if (response && response.body && response.body.length) {
                                for (j in response.body) {
                                    if (resp[i].value == response.body[j].report_name)
                                    {
                                        object.push(resp[i]);
                                    }
                                }
                            }
                        }
                        $log.info(object);
                        self.formSource[0].items[0].titleMap = object;
                        self.form = self.formSource;
                    });
                }, function(errResp) {
                    PageHelper.showErrors(errResp);
                }).finally(function() {
                    PageHelper.hideLoader();
                });

            },
            form: [],
            formSource: [{
                "type": "box",
                "title": "CHOOSE_A_REPORT",
                "items": [{
                    "key": "bi.report_name",
                    "type": "select"
                }, {
                    "key": "bi.from_date",
                    "type": "date"
                }, {
                    "key": "bi.to_date",
                    "type": "date"
                }]
            }, {
                type: "actionbox",
                items: [{
                    type: "submit",
                    title: "DOWNLOAD_REPORT"
                }]
            }],
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
                    var biDownloadUrl = irf.BI_BASE_URL + '/download.php?auth_token=' + AuthTokenHelper.getAuthData().access_token + '&' + $httpParamSerializer(model.bi);
                    $log.info(biDownloadUrl);
                    window.open(biDownloadUrl);
                }
            }
        };
    }
]);