irf.pageCollection.factory(irf.page("bi.BIReports"), ["$log", "RolesPages", "BIReports", "SessionStore", "PageHelper", "$httpParamSerializer", "AuthTokenHelper", "$filter", "$q", "$http", "irfProgressMessage",
    function($log, RolesPages, BIReports, SessionStore, PageHelper, $httpParamSerializer, AuthTokenHelper, $filter, $q, $http, irfProgressMessage) {
        var allReportParametersCache = [];
        var getReportsConfiguration = function (reportName) {
            var defered = $q.defer();
            var result = [];
            if(allReportParametersCache.length != 0)
            {   
                if(reportName) {
                    result = $filter('filter')(allReportParametersCache, {report_name: reportName}, true);
                } else {
                    result = allReportParametersCache
                }

                defered.resolve(result);
            } else {
                BIReports.allReportParameters().$promise.then(function(result) {
                    var item;
                    for(var i=0; i < result.length ; i++) {
                        if(result[i].parameter == 'from_date' || result[i].parameter == 'to_date'){
                            // result[i].required = true;
                            // result[i].operators.push("IN", "between")
                        }
                        item = result[i];
                        allReportParametersCache.push(result[i]);  
                    }
                    if(reportName) {
                        result = $filter('filter')(allReportParametersCache, {report_name: reportName}, true);
                    } else {
                        result = allReportParametersCache
                    }

                    defered.resolve(result);
                }, function(err){
                    PageHelper.showErrors(err);
                });
            }

            return defered.promise;
        };
        getReportsConfiguration();
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
                
                return defered;
            },
            form: [],
            formSource: [{
                "type": "box",
                "title": "CHOOSE_A_REPORT",
                colClass: "col-sm-9",
                "items": [{
                    "key": "bi.report_name",
                    "type": "select",
                    onChange: function(modelValue, form, model, formCtrl, event){
                        var res = $filter('filter')( model.report.masterData, {'value': model.bi.report_name}, true);
                        model.selectedReport = (res && res.length > 0) ? res[0] : undefined; 
                        model.bi._filterCollection = [];
                        if (model.selectedReport.parameters) {
                            for (var i = 0; i < model.selectedReport.parameters.length; i++) {
                                model.bi._filterCollection[i] = model.bi._filterCollection[i] || {};
                                if (model.bi._filterCollection[i] ) {
                                    model.bi._filterCollection[i]['filterParameter'] = model.selectedReport.parameters[i];
                                } else {
                                    model.bi._filterCollection[i] = {filterParameter : model.selectedReport.parameters[i]};
                                } 
                            }
                        }
                    }
                }, 
                // {
                //     "key": "bi.from_date",
                //     condition: "model.done('true')",
                //     "type": "date"
                // }, {
                //     "key": "bi.to_date",
                //     condition: "model.done('true')",
                //     "type": "date"
                // }, 
                {
                    "key": "bi._filterCollection",
                    "type": "array",
                    "titleExpr": "",
                    condition: "model.selectedReport && model.selectedReport.parameters.length",
                    "view": "fixed",
                    "add": null,
                    "remove": null,
                    "startEmpty": false,
                    "items": [{
                        "key": "bi._filterCollection[]",
                        "type": "structeredFilter",
                        "filterParamPreset": true,
                        "getConfiguration": function(modelValue, form, model, formCtrl, event) {
                           return getReportsConfiguration(model.bi.report_name);
                        }
                    }]
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
                            "branchId": {
                                "key": "branchId",
                                "title": "BRANCH_NAME",
                                "type": "select",
                            },
                            "centreId": {
                                "key": "centreId",
                                "title": "CENTRE",
                                "type": "select",
                            },
                            "firstName": {
                                "key": "firstName",
                                "title": "CUSTOMER_NAME",
                                "type": "string",
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
                    if (model.selectedReport.parameterized) {
                        var reqData = {}
                        reqData.auth_data = {
                            'auth_token' : AuthTokenHelper.getAuthData().access_token,
                        }
                        reqData.report_name = model.bi.report_name;
                        //reqData.query_mode = 1;

                        reqData.filters = [];
                        for (var i = 0; i < model.bi._filterCollection.length; i++) {
                            if (model.bi._filterCollection[i].filterQuery)
                            reqData.filters.push(model.bi._filterCollection[i].filterQuery)
                        }
                        // BIReports.downLoadReport(reqData).$promise.then(function(data){
                        //     console.log(data);
                        // });
                        PageHelper.showLoader();
                        irfProgressMessage.pop("Reports","Downloading Report. Please wait...");
                        $http.post(
                          irf.BI_BASE_URL + '/newdownload.php',
                          reqData,
                          {responseType: 'arraybuffer'}
                        ).then(function (response) {
                          var headers = response.headers();
                          var blob = new Blob([response.data],{type:headers['content-type']});
                          var link = document.createElement('a');
                          link.href = window.URL.createObjectURL(blob);
                          if (headers["content-disposition"] && headers["content-disposition"].split('filename=').length == 2) {
                            var filename = headers["content-disposition"].split('filename=')[1];
                            link.download = filename.substr(1, filename.length - 2);
                          } else {
                            link.download = SessionStore.getLoginname() + '_' + model.selectedReport.name + '_' + moment().format('YYYYMMDDhhmmss');
                          }
                          link.click();
                          irfProgressMessage.pop("Reports","Report downloaded.", 5000);
                        }, function(err) {
                            PageHelper.showErrors(err);
                        }).finally(function(){
                            PageHelper.hideLoader();
                        });

                    } else {
                        var biDownloadUrl = irf.BI_BASE_URL + '/download.php?auth_token=' + AuthTokenHelper.getAuthData().access_token + '&' + $httpParamSerializer(model.bi);
                        $log.info(biDownloadUrl);
                        window.open(biDownloadUrl);
                    }
                }
            }
        };
    }
]);