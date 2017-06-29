irf.pageCollection.factory(irf.page("bi.BIReports"), ["$log", "RolesPages", "BIReports", "SessionStore", "PageHelper", "$httpParamSerializer", "AuthTokenHelper", "$filter", "$q",
    function($log, RolesPages, BIReports, SessionStore, PageHelper, $httpParamSerializer, AuthTokenHelper, $filter, $q) {

        return {
            "type": "schema-form",
            "title": "REPORTS",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.report = {};
                model.report.role = SessionStore.getUserRole();
                $log.info(model.report.role.id);
                model.done = function(val) {
                    return val === 'true' ? true : false;
                }
                var self = this;
                self.form = [];
                
                var p2 = BIReports.reportList().$promise.then(function(resp) {
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
                        model.report.masterData = object;
                        self.form = self.formSource;
                    });
                }, function(errResp) {
                    PageHelper.showErrors(errResp);
                }).finally(function() {

                    PageHelper.hideLoader();
                });

            },
            modelPromise: function(pageId, model) {
                var self = this;
                var defered = $q.defer();
                PageHelper.showLoader();
                var p1 = BIReports.allReportParameters().$promise.then(function(result){
                    var item;
                    self.formSource[0].items.splice(3, self.formSource[0].items.length -3);
                    for(var i=0; i < result.length ; i++) {
                        if(result[i].parameter == 'from_date' || result[i].parameter == 'to_date'){
                            continue;
                        }
                        item = {};
                        item['key'] = "bi." + result[i].parameter;
                        console.log (item['key']);
                        item['type'] = result[i].type;
                        item['title'] = result[i].name;
                        item['titleMap'] = result[i].titleMap;
                        item['condition'] = "model.selectedReport && model.selectedReport.parameters.indexOf('" + result[i].parameter + "') != -1";
                        self.formSource[0].items.push(item);    
                    }
                    console.log(JSON.stringify(self.formSource[0].items));
                    defered.resolve();
                }, function(err){
                    PageHelper.showErrors(err);
                });
                return defered;
            },
            form: [],
            formSource: [{
                "type": "box",
                "title": "CHOOSE_A_REPORT",
                "items": [{
                    "key": "bi.report_name",
                    "type": "select",
                    onChange: function(modelValue, form, model, formCtrl, event){
                        var res = $filter('filter')( model.report.masterData, {'value': model.bi.report_name}, true);
                        model.selectedReport = (res && res.length > 0) ? res[0] : undefined; 
                    }
                }, {
                    "key": "bi.from_date",
                    condition: "model.done('true')",
                    "type": "date"
                }, {
                    "key": "bi.to_date",
                    condition: "model.done('true')",
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
                            },
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